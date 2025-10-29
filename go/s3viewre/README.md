# S3 Bucket Viewer

AWS S3バケットの内容を視覚的に閲覧できるシンプルなWEBアプリケーションです。

## 機能

### 1. バケット一覧表示
- ユーザーがアクセス可能なS3バケットの一覧を表示
- バケット名、作成日時、リージョン情報を表示

### 2. オブジェクト一覧表示
- 選択したバケット内のオブジェクト/フォルダを表示
- ファイルサイズと最終更新日時を表示
- フォルダ階層のナビゲーション機能

### 3. 検索機能
- バケット内のオブジェクトをキーワードで検索
- プレフィックス(パス)での絞り込み

### 4. 詳細情報表示
- 選択したオブジェクトの詳細情報を表示
  - ファイルサイズ（人間が読みやすいフォーマット）
  - Content-Type
  - 最終更新日時
  - ETag
  - Storage Class

## 技術スタック

### バックエンド
- Go 1.21+
- AWS SDK for Go v2
- html/template でHTMLレンダリング

### フロントエンド
- HTML5
- CSS3
- Vanilla JavaScript

### 認証
- AWS認証情報は環境変数または `~/.aws/credentials` から取得
- IAMロールベースのアクセス制御

## セットアップ

### 前提条件
- Go 1.21 以上
- AWS認証情報の設定
  - 環境変数 (`AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`)
  - または `~/.aws/credentials` ファイル

### インストール

```bash
# プロジェクトディレクトリに移動
cd s3viewre

# 依存関係のダウンロード
go mod download

# アプリケーションのビルド
go build -o s3viewre ./cmd/s3viewre/main.go
```

## 実行

```bash
# デフォルト（ポート 8080）で起動
./s3viewre

# カスタムポートで起動
PORT=3000 ./s3viewre
```

アプリケーションが起動すると、ブラウザで `http://localhost:8080` にアクセスしてください。

## ディレクトリ構造

```
s3viewre/
├── cmd/
│   └── s3viewre/
│       └── main.go          # エントリーポイント
├── internal/
│   ├── handler/
│   │   └── handler.go       # HTTPハンドラー層
│   └── service/
│       └── s3_service.go    # S3操作のサービス層
├── templates/
│   ├── index.html           # バケット一覧ページ
│   ├── bucket.html          # バケット詳細ページ
│   └── object.html          # オブジェクト詳細ページ
├── static/
│   └── css/
│       └── style.css        # スタイルシート
├── go.mod                   # Go モジュール定義
├── go.sum                   # Go モジュールチェックサム
└── SPEC.md                  # 仕様書
```

## APIエンドポイント

| メソッド | エンドポイント | 説明 |
|---------|---------------|------|
| GET | `/` | バケット一覧ページを表示 |
| GET | `/bucket/{bucket_name}` | 指定バケットのオブジェクト一覧を表示 |
| GET | `/bucket/{bucket_name}?prefix={path}` | 指定パス配下のオブジェクト一覧を表示 |
| GET | `/bucket/{bucket_name}?search={keyword}` | 指定キーワードで検索 |
| GET | `/object/{bucket_name}/{object_key}` | オブジェクトの詳細情報を表示 |
| GET | `/static/{path}` | 静的ファイルを提供 |

## セキュリティ要件

- AWS認証情報はハードコードしない（環境変数から読み込み）
- IAMポリシーで必要最小限の権限を付与：
  - `s3:ListAllMyBuckets` - バケット一覧の取得
  - `s3:ListBucket` - バケット内のオブジェクト一覧取得
  - `s3:GetObject` - オブジェクトのメタデータ取得
  - `s3:GetObjectMetadata` - オブジェクトのメタデータ取得

### 推奨IAMポリシー

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:ListAllMyBuckets"
      ],
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "s3:ListBucket",
        "s3:GetObject",
        "s3:GetObjectMetadata"
      ],
      "Resource": [
        "arn:aws:s3:::*",
        "arn:aws:s3:::*/*"
      ]
    }
  ]
}
```

## トラブルシューティング

### AWS認証エラー
```
Error: AWS config load failed
```
- AWS認証情報が設定されていません
- `AWS_ACCESS_KEY_ID` と `AWS_SECRET_ACCESS_KEY` を設定するか、`~/.aws/credentials` を確認してください

### ポートバインドエラー
```
Error: listen tcp :8080: bind: address already in use
```
- 別のアプリケーションがポート 8080 を使用しています
- `PORT=9000 ./s3viewre` など、別のポートで起動してください

## 開発

### ビルド
```bash
go build -o s3viewre ./cmd/s3viewre/main.go
```

### コード整形
```bash
go fmt ./...
```

### ビルド後のクリーンアップ
```bash
rm s3viewre
```

## ライセンス

MIT License

## 作成者

Claude Code - Anthropic

---

**注意:** このアプリケーションは S3 バケットへの読み取り専用アクセスのみを提供します。削除やアップロードなどの書き込み操作はサポートしていません。
