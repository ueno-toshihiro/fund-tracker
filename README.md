# ファンド情報トラッカー (Fund Tracker)

MUFG Asset Management API を活用した投資信託（ファンド）情報の表示・管理アプリケーションです。最新のファンド情報を一覧表示し、詳細情報の閲覧、お気に入り登録などの機能を提供します。

## 目的

このアプリケーションは以下の目的で開発されました：

- 複数のファンド情報を一元管理できる
- ファンドのパフォーマンスなどの重要情報を分かりやすく表示する
- お気に入り機能によって、関心のあるファンドを簡単に追跡できるようにする
- ソートやフィルタリング機能により、効率的に情報を探せるようにする

## 技術スタック

### フロントエンド

- **Next.js 14** - React フレームワーク（App Router 使用）
- **React** - UI ライブラリ
- **TypeScript** - 型安全な開発環境
- **Tailwind CSS** - スタイリング
- **MUI** - UI コンポーネントライブラリ
- **shadcn/ui** - UI コンポーネントライブラリ
- **Chart.js** - データ可視化

### バックエンド

- **Next.js API Routes** - サーバーサイド機能
- **Vercel KV (Redis)** - お気に入り情報の保存（オプション）

### インフラ

- **Vercel** - ホスティングとデプロイメント

## 主な機能

1. **ファンド一覧表示**

   - ファンド名、基準価格、価格変動の表示
   - ソート機能（ファンド名、基準価格、各日の価格変動）
   - フィルタリング機能（ファンド名/コードによる検索）

2. **ファンド詳細表示**

   - 基本情報（基準価額、前日比、純資産総額）
   - 期間別リターン

3. **お気に入り機能**
   - ファンドのお気に入り登録/解除
   - お気に入りファンドのみの表示

## セットアップ方法

### 前提条件

- Node.js 18.0.0 以上
- npm または yarn

### インストール

# 依存関係のインストール

\`\`\`bash
pnpm install
\`\`\`

### 環境変数の設定

`.env.local`ファイルをプロジェクトのルートディレクトリに作成し、以下の環境変数を設定します：

\`\`\`

# Vercel KV（お気に入り機能用、オプション）

KV_REST_API_URL=your_kv_rest_api_url
KV_REST_API_TOKEN=your_kv_rest_api_token

\`\`\`

### 開発サーバーの起動

\`\`\`bash
npm run dev
\`\`\`

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてアプリケーションにアクセスできます。

## Vercel KV の設定（オプション）

お気に入り機能を使用するには、Vercel KV（Redis）の設定が必要です：

1. Vercel アカウントにログイン
2. 新しい KV データベースを作成
3. 生成された環境変数（`KV_REST_API_URL`と`KV_REST_API_TOKEN`）をプロジェクトの環境変数に追加

**注意**: Vercel KV が設定されていない場合、アプリケーションはローカルストレージを使用してお気に入り情報を保存します。

## デプロイ

### Vercel へのデプロイ

1. GitHub リポジトリを Vercel にインポート
2. 環境変数を設定
3. デプロイボタンをクリック

または、Vercel CLI を使用：

\`\`\`bash
npm install -g vercel
vercel
\`\`\`

## API 仕様

このアプリケーションは、MUFG Asset Management が提供する API を使用しています。
API 仕様の詳細は以下のドキュメントを参照してください：
https://www.am.mufg.jp/assets/pdf/tool/webapi/fund_api.pdf

## 開発者向け情報

### ディレクトリ構造

```
fund-tracker/
├── app/ # Next.js App Router
│ ├── actions.ts # サーバーアクション
│ ├── funds/ # ファンド詳細ページ
│ └── page.tsx # トップページ
├── components/ # React コンポーネント
│ ├── fund-list.tsx # ファンド一覧コンポーネント
│ ├── fund-detail-view.tsx # ファンド詳細コンポーネント
│ └── performance-chart.tsx # パフォーマンスチャート
├── lib/ # ユーティリティ関数
│ ├── api.ts # API 関連の関数
│ ├── mock-data.ts # モックデータ（開発用）
│ └── mock-fund-details.ts # 詳細モックデータ
└── public/ # 静的ファイル
```
