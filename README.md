# 合同会社S&E コーポレートウェブサイト

合同会社S&Eの公式コーポレートウェブサイトです。

## プロジェクト概要

- **クライアント名**: 合同会社S&E
- **設立日**: 2025年10月1日
- **法人番号**: 9011503006730
- **事業内容**: 営業代行業、広告代理業、古物営業、商品企画・販売、経営コンサルティング

## 技術スタック

- **HTML5**: セマンティックマークアップ
- **CSS3**: Flexbox, Grid, CSS Variables, レスポンシブデザイン
- **JavaScript (ES6+)**: モジュール化、非同期処理
- **Three.js**: 3D背景エフェクト
- **Intersection Observer API**: スクロールアニメーション

## ファイル構成

```
sande-website/
│
├── index.html                    # トップページ
├── message.html                  # 代表挨拶
├── company.html                  # 会社概要
├── business.html                 # 事業内容
├── mission.html                  # ミッション・ビジョン
├── contact.html                  # お問い合わせ
├── privacy.html                  # プライバシーポリシー
├── personal-info.html            # 個人情報の取り扱い
├── legal.html                    # 特定商取引法に基づく表記
│
├── css/
│   ├── reset.css                 # リセットCSS
│   ├── variables.css             # CSS変数定義
│   ├── common.css                # 共通スタイル
│   ├── header.css                # ヘッダー
│   ├── footer.css                # フッター
│   ├── loading.css               # ローディング画面
│   └── home.css                  # トップページ専用
│
├── js/
│   ├── main.js                   # メインJS
│   ├── loading.js                # ローディング画面制御
│   ├── navigation.js             # ナビゲーション・ハンバーガーメニュー
│   ├── cursor.js                 # カスタムカーソル
│   ├── scroll-animation.js       # スクロールアニメーション
│   ├── three-background.js       # Three.js背景エフェクト
│   ├── smooth-scroll.js          # スムーススクロール
│   └── form-validation.js        # フォームバリデーション
│
├── assets/
│   └── images/
│       ├── logo.svg              # メインロゴ
│       └── logo-white.svg        # 白ロゴ
│
├── sitemap.xml                   # サイトマップ
├── robots.txt                    # クローラー制御
├── site.webmanifest              # PWAマニフェスト
└── README.md                     # このファイル
```

## 主な機能

### デザイン・UI

- **レスポンシブデザイン**: モバイル、タブレット、デスクトップに対応
- **ローディング画面**: SVGアニメーション + プログレスバー
- **カスタムカーソル**: デスクトップ環境でのインタラクティブなカーソル
- **Three.js背景**: トップページのパーティクルエフェクト
- **スクロールアニメーション**: Intersection Observerによる要素の表示アニメーション
- **ハンバーガーメニュー**: モバイル・タブレット用のスライドインメニュー

### 機能

- **フォームバリデーション**: リアルタイムバリデーション機能
- **スムーススクロール**: アンカーリンクのスムーズスクロール
- **透過ヘッダー**: スクロールに応じて背景が変化
- **SEO最適化**: メタタグ、構造化データ、サイトマップ

## セットアップ方法

### 1. ローカル環境での確認

#### シンプルな方法（Python使用）

```bash
cd /mnt/d/S&E-website
python3 -m http.server 8000
```

ブラウザで `http://localhost:8000` にアクセス

#### Node.js使用（推奨）

```bash
cd /mnt/d/S&E-website
npx http-server -p 8000
```

### 2. 本番環境へのデプロイ

#### 必要な作業

1. **ファビコンの作成**
   - 現在SVGのみ。PNG形式のファビコンを作成してください
   - 必要なサイズ: 16x16, 32x32, 180x180, 192x192, 512x512

2. **ドメイン設定**
   - `https://sande-llc.jp` への変更
   - 全HTMLファイル内のURLを実際のドメインに置換

3. **OGP画像の作成**
   - `/assets/images/ogp-image.png` を作成（推奨サイズ: 1200x630px）

4. **Google Analytics設定**（必要に応じて）
   - トラッキングコードの追加

5. **お問い合わせフォームの実装**
   - 現在はフロントエンドのみ
   - バックエンドAPI実装またはFormspree等のサービス利用

6. **古物商許可番号の追記**
   - `legal.html` 内の許可番号を実際の番号に置換

## ブラウザ対応

- Chrome (最新版, 1つ前のバージョン)
- Firefox (最新版, 1つ前のバージョン)
- Safari (最新版, 1つ前のバージョン)
- Edge (最新版)
- iOS 14以降
- Android 10以降

## パフォーマンス目標

- **ページ読み込み速度**: 3秒以内 (3G環境)
- **Lighthouse スコア**:
  - Performance: 90+
  - Accessibility: 95+
  - Best Practices: 95+
  - SEO: 100

## カラーパレット

```css
--main-color: #2C3E50      /* ダークネイビー */
--accent-color: #E74C3C    /* コーラルレッド */
--sub-color: #ECF0F1       /* ライトグレー */
--text-color: #2C3E50      /* テキスト */
--text-sub-color: #7F8C8D  /* サブテキスト */
--bg-color: #FFFFFF        /* 背景 */
--bg-light: #F8F9FA        /* 淡い背景 */
```

## フォント

- **メインフォント**: Noto Sans JP (Google Fonts)
- **フォールバック**: Hiragino Kaku Gothic ProN, Hiragino Sans, Meiryo, sans-serif

## 連絡先

- **会社名**: 合同会社S&E
- **住所**: 〒114-0014 東京都北区田端5丁目5番6号 メゾン・ル・ヴェール206号
- **電話**: 080-4683-9753
- **メール**: sande.llc.official@gmail.com

## ライセンス

© 2025 S&E LLC. All Rights Reserved.

---

**制作日**: 2025年10月22日
**バージョン**: 1.0.0
