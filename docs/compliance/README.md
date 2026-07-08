# TABACOYA 合規機能仕様書 — 提出資料

このディレクトリには、TABACOYA（開成産業合同会社）のたばこ EC サイト仮申し込み審査用のドキュメントを格納しています。

## ファイル一覧

| ファイル | 内容 |
|----------|------|
| `機能仕様書.md` | **主提出資料**。年齢確認・本人性確認・購入フロー・健康警告表示・特定商取引法表記・個人情報保護・決済・管理者機能・技術スタックを網羅した日本語仕様書（約 700 行） |

## 含まれている図表（Markdown で記述）

- サイト全体アーキテクチャ図（ASCII）
- 年齢確認フロー（フロー図）
- 本人性確認フロー（フロー図）
- 会員登録・ログインフロー
- ショッピングカート → チェックアウト → 注文確定フロー
- 健康警告オーバーレイの UI 構成図

## PDF への変換方法

### 方法 A：Pandoc（推奨）

```bash
# Pandoc がインストールされている場合
pandoc 機能仕様書.md -o 機能仕様書.pdf \
  --pdf-engine=xelatex \
  -V mainfont="IPAGothic" \
  -V geometry:margin=2cm \
  --toc \
  --toc-depth=2
```

### 方法 B：VS Code の Markdown PDF 拡張

1. VS Code に「Markdown PDF」拡張をインストール
2. `機能仕様書.md` を開く
3. 右クリック → 「Markdown PDF: Export (pdf)」

### 方法 C：オンラインサービス（GitHub 経由）

1. `機能仕様書.md` を GitHub のリポジトリに push
2. https://www.markdowntopdf.com/ などにアップロードして変換

### 方法 D：Chrome ブラウザで印刷

1. Markdown エディタ（VS Code / Typora / Obsidian）でプレビューを開く
2. `Ctrl + P` で印刷ダイアログを開く
3. 保存先を「PDF」に変更して保存

## 提出方法

審査機関（財務局 / JT）に提出する際は、以下のいずれかの方法で提出できます：

1. **PDF 形式**（推奨）：ファイル名を「TABACOYA_機能仕様書_2026年7月.pdf」として提出
2. **GitHub リポジトリ URL**：リポジトリの該当パスを共有（`docs/compliance/機能仕様書.md`）
3. **Markdown 形式**：そのままテキストとして添付

## 改訂履歴

- 2026-07-08: 初版作成（コミット `04afbfc` 以降の機能を反映）