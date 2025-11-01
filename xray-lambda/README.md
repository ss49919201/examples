# TypeScript Lambda with Docker

AWS Lambda を Docker コンテナとしてパッケージ化した TypeScript の実装例です。

## ファイル構成

```
.
├── Dockerfile              # Lambda コンテナイメージの定義（マルチステージビルド）
├── .dockerignore          # Docker ビルド時の除外ファイル
├── package.json           # Node.js 依存関係とスクリプト
├── tsconfig.json          # TypeScript コンパイラ設定
├── src/
│   └── index.ts          # Lambda ハンドラー関数（TypeScript）
├── dist/                  # コンパイル後の JavaScript（.gitignore）
└── README.md
```

## ビルド方法

```bash
# イメージをビルド（AWS 公式ドキュメントに基づく）
docker build --provenance=false -t xray-lambda:latest .
```

**注**: `--provenance=false` オプションは、AWS 公式ドキュメントの推奨に基づいています。

## 実行方法

### ローカルテスト

```bash
# イメージをビルド
docker build --provenance=false -t xray-lambda:latest .

# コンテナを実行
docker run -p 9000:8080 xray-lambda:latest

# 別のターミナルでテストイベントを送信
curl -X POST "http://localhost:9000/2015-03-31/functions/function/invocations" \
  -H "Content-Type: application/json" \
  -d '{"key": "value"}'
```

### AWS Lambda へのデプロイ

1. ECR リポジトリを作成:
```bash
aws ecr create-repository --repository-name xray-lambda
```

2. イメージをビルドしてタグ付け:
```bash
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com
docker build --provenance=false -t xray-lambda:latest .
docker tag xray-lambda:latest <ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/xray-lambda:latest
```

3. ECR にプッシュ:
```bash
docker push <ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/xray-lambda:latest
```

4. Lambda 関数を作成:
```bash
aws lambda create-function \
  --function-name xray-lambda \
  --role arn:aws:iam::<ACCOUNT_ID>:role/lambda-execution-role \
  --code ImageUri=<ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/xray-lambda:latest \
  --package-type Image
```

## ハンドラーについて

- **ハンドラー関数**: `src/index.handler`
- **入力**: Lambda イベントオブジェクト
- **出力**: 応答オブジェクト（statusCode と body を含む）

## ローカル開発

### 依存関係のインストール

```bash
npm install
```

### TypeScript のコンパイル

```bash
npm run build
```

### ローカルで実行

```bash
npm start
```

### ts-node で開発実行

```bash
npm run dev
```

### デバッグ

Dockerfile で `CMD` を一時的に変更して対話型シェルで実行:

```bash
docker run -it --entrypoint /bin/sh xray-lambda:latest
```
