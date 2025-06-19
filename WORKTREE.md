# Git Worktree Management Guide

このドキュメントは、このリポジトリでGit Worktreeを効率的に使用するためのガイドです。

## 概要

Git Worktreeは、同じリポジトリの複数のブランチを同時に作業できる機能です。これにより、ブランチ切り替えによる作業の中断を避け、開発効率を大幅に向上させることができます。

## ディレクトリ構造

```
examples/                    # メインリポジトリ
├── scripts/
│   ├── worktree.sh         # Worktree管理スクリプト
│   └── setup-worktree-env.sh # 環境セットアップスクリプト
├── .worktree-config        # Worktree設定ファイル
├── WORKTREE.md            # このドキュメント
└── ...

worktrees/                  # Worktree格納ディレクトリ
├── feature/
│   ├── new-api/           # feature/new-api ブランチ
│   └── user-auth/         # feature/user-auth ブランチ
├── bugfix/
│   └── login-issue/       # bugfix/login-issue ブランチ
└── hotfix/
    └── security-patch/    # hotfix/security-patch ブランチ
```

## セットアップ

### 1. 初回セットアップ

```bash
# 開発環境をセットアップ
./scripts/setup-worktree-env.sh
```

### 2. シェルエイリアスの追加（推奨）

以下のエイリアスを `~/.bashrc` または `~/.zshrc` に追加してください：

```bash
# Git Worktree aliases
alias wt='/path/to/examples/scripts/worktree.sh'
alias wtc='/path/to/examples/scripts/worktree.sh create'
alias wtl='/path/to/examples/scripts/worktree.sh list'
alias wtr='/path/to/examples/scripts/worktree.sh remove'
```

## 基本的な使用方法

### Worktreeの作成

```bash
# 新しいブランチでWorktreeを作成
./scripts/worktree.sh create feature/new-feature

# 既存のブランチからWorktreeを作成
./scripts/worktree.sh create feature/existing-feature

# 特定のベースブランチから新しいブランチを作成
./scripts/worktree.sh create feature/new-api main
```

### Worktreeの一覧表示

```bash
./scripts/worktree.sh list
```

### Worktreeでの作業

```bash
# Worktreeに移動
cd ../worktrees/feature/new-feature

# 通常のGit操作が可能
git add .
git commit -m "Add new feature"
git push origin feature/new-feature
```

### Worktreeの削除

```bash
# Worktreeを削除（ブランチは残る）
./scripts/worktree.sh remove feature/new-feature

# 全てのWorktreeを削除
./scripts/worktree.sh clean
```

## ブランチ命名規則

プロジェクトの整理性を保つため、以下の命名規則を推奨します：

- `feature/機能名` - 新機能の開発
- `bugfix/バグ説明` - バグ修正
- `hotfix/緊急修正` - 緊急修正
- `experiment/実験名` - 実験的な機能
- `release/バージョン` - リリース準備

## ワークフロー例

### 1. 機能開発のワークフロー

```bash
# 1. 新機能用のWorktreeを作成
./scripts/worktree.sh create feature/user-authentication

# 2. Worktreeで作業
cd ../worktrees/feature/user-authentication

# 3. 開発作業
# ... コーディング ...

# 4. コミット・プッシュ
git add .
git commit -m "Implement user authentication"
git push origin feature/user-authentication

# 5. メインブランチに戻って他の作業を続行
cd ../../examples

# 6. 機能完成後、Worktreeを削除
./scripts/worktree.sh remove feature/user-authentication
```

### 2. バグ修正とホットフィックス

```bash
# 緊急バグ修正用のWorktreeを作成
./scripts/worktree.sh create hotfix/security-patch main

# Worktreeで修正作業
cd ../worktrees/hotfix/security-patch

# 修正・テスト・デプロイ
# ...

# 修正完了後、Worktreeを削除
cd ../../examples
./scripts/worktree.sh remove hotfix/security-patch
```

## IDE/エディタでの使用

### VS Code

- 各Worktreeは独立したワークスペースとして認識されます
- `.vscode/settings.json` は自動的にセットアップされます
- Git統合機能がWorktreeごとに独立して動作します

### IntelliJ IDEA / WebStorm

- 各Worktreeを独立したプロジェクトとして開くことができます
- `.idea/` フォルダはWorktreeごとに自動的に分離されます

## ベストプラクティス

### 1. 作業の分離

- 各機能/バグ修正は独立したWorktreeで作業する
- メインリポジトリは安定した状態を保つ
- 長期間使用しないWorktreeは定期的に削除する

### 2. ファイル共有

- 設定ファイル（`.gitignore`, `package.json` など）はメインリポジトリで管理
- 環境変数ファイル（`.env`）はWorktreeごとに独立
- ビルド成果物（`node_modules/`, `target/` など）はWorktreeごとに独立

### 3. チーム開発

- Worktreeの命名規則をチームで統一する
- 長期間未使用のWorktreeは定期的にクリーンアップする
- Worktreeの作成・削除はスクリプトを使用して一貫性を保つ

## トラブルシューティング

### よくある問題

1. **Worktreeの削除でエラーが発生する**
   ```bash
   # 強制削除
   git worktree remove --force ../worktrees/branch-name
   ```

2. **Worktreeのパスが見つからない**
   ```bash
   # Worktreeの整理
   git worktree prune
   ```

3. **ブランチが削除できない**
   ```bash
   # 強制削除
   git branch -D branch-name
   ```

### 確認コマンド

```bash
# 全Worktreeの状態確認
git worktree list

# Gitの設定確認
git config --list | grep worktree

# 不要なWorktreeエントリの削除
git worktree prune
```

## 高度な使用方法

### 1. リモートブランチからのWorktree作成

```bash
# リモートブランチをトラッキングしてWorktreeを作成
./scripts/worktree.sh create feature/remote-feature
# スクリプトが自動的にリモートブランチを検出してトラッキング設定を行います
```

### 2. 一時的な実験用Worktree

```bash
# 実験用のWorktreeを作成
./scripts/worktree.sh create experiment/new-architecture

# 実験後、ブランチごと削除
./scripts/worktree.sh remove experiment/new-architecture
# 削除時にブランチも同時に削除するか選択できます
```

### 3. 複数プロジェクトの並行開発

```bash
# フロントエンド機能開発
./scripts/worktree.sh create feature/frontend-ui

# バックエンドAPI開発
./scripts/worktree.sh create feature/backend-api

# それぞれ独立して開発を進行
```

## 参考リンク

- [Git Worktree公式ドキュメント](https://git-scm.com/docs/git-worktree)
- [Pro Git - Git Worktree](https://git-scm.com/book/en/v2/Git-Tools-Advanced-Merging)

---

質問や問題がある場合は、プロジェクトのIssueやチームチャットでお気軽にお聞きください。