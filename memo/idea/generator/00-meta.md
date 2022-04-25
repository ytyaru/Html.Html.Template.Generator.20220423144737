# metaタグを中心とした基礎タグを生成する

# 出力

## 形式

* クリップボード
* JSライブラリ
    * 関数
    * クラス
    * クラスESM
* JSライブラリCDN化

### I/F

```javascript
Htpl.generate();                // Head+Body。CSSとJSを外部可する／内部可する（externalize(externalize-css, externalize-js)）
Htpl.Head.generate();           // Head要素内を生成する
Htpl.Head.Meta.generate();      // title,base,meta要素を生成する
Htpl.Head.Link.generate();      // link,style要素を生成する
Htpl.Head.Script.generate();    // script,noscript要素を生成する
Htpl.Head.OpenGraph.generate(); // link要素でOpenGrapph要素を生成する
Htpl.Head.SchemaOrg.generate(); // schema.orgを生成する（JSON-LD）
Htpl.Body.generate();           // セクショニング（header, footer, main, aside, article, nav, address, section, h1〜h6））
Htpl.Body.Table.generate();     // テーブルを生成する
Htpl.Body.Img.generate();       // img,pictureを生成する
```

名前|語源
----|----
`Htpl`|`Html`+`Tpl`(`Template`)

## 内容

### 全候補

* `<!DOCTYPE html>`
* `<html>`
* `<head>`
    * `<meta>`
        * Open Graph
            * Twitter Card
            * Facebook
    * `<base>`,`<title>`
    * `<link>`,`<style>`
    * `<script>`, `<noscript>` 
        * schema.org(JSON-LD)
        * Library
            * Google Analitics
            * Boostrap
* `<body>`
* `<header>`, `<footer>`, `<main>`, `<aside>`, `<article>`, `<nav>`, `<address>`, `<section>`, `<small>`

### 今回

#### 対象

* `<head>`内に含めるタグのうち`<title>`,`<base>`,`<meta>`

#### 対象外

対象外|理由
------|----
`<!DOCTYPE html>`|ファイル出力しないから
`<html>`,`<head>`,`<body>`|ファイル出力しないから。タグ自体を省略可能だから。
`<head>`内に含めるタグのうち`<link>`,`<style>`,`<script>`,`<noscript>`,`<template>`|今回は対象外

## `<meta>`

系統|書式
----|----
文字コード|`<meta charset="UTF-8">`
基本メタデータ|`<meta name="" content="">`
Open Graph|`<meta itemprop="" content="">`

### 基本メタデータ

```html
<meta name="" content="">
```

1. メタデータ系
2. クローラ系
3. 表示系

#### 1. メタデータ系

`name`属性値|概要
------------|----
`description`|サイト説明。Google検索結果では80字まで表示され、以降は`…`で消される。
`author`|著者名
`creator`|製作者名。複数人いるときは複数タグ作る。
`publisher`|発行者名。
`keywords`|サイトに関する語をカンマ区切りで書く。
`generator`|制作ツール名

#### 2. クローラ系

`name`属性値|概要
------------|----
`referrer`|HTTPヘッダに付与する内容を制御する
`robots`|クローラ
`googlebot`|Google検索クローラ
`slurp`|Yahoo 検索のクローラー

`referrer`の`content`属性値|概要
---------------------------|----
`no-referrer`|HTTP の Referer ヘッダーを送信しません。
`origin|文書のオリジンを送信します。
`no-referrer-when-downgrade`|現在のページと同等の安全性の URL (https→https) にはリファラーとしてオリジンを送信しますが、安全性が低い URL (https→http) には送信しません。これは既定の動作です。
`origin-when-crossorigin`|同一オリジンへのリクエストでは URL 全体（引数を除く）を送信しますが、他の場合はオリジンのみ送信します。
`same-origin`|同一オリジンにはリファラーを送信しますが、オリジン間リクエストにはリファラー情報を含めません。
`strict-origin`|安全性が同等とみられる宛先 (HTTPS->HTTPS) に対しては、リファラーとして文書のオリジンのみを送信しますが、安全性が劣る宛先 (HTTPS->HTTP) には送信しません。
`strict-origin-when-cross-origin`|文書と同一のオリジンへのリクエストを行う際には完全な URL を送信し、安全性が同等とみられる宛先 (HTTPS->HTTPS) に対しては、リファラーとして文書のオリジンのみを送信し、安全性が劣る宛先 (HTTPS->HTTP) にはヘッダーを送信しません。
`unsafe-URL`|同一オリジンおよびオリジン間のリクエストで URL 全体 (パラメーターは除く) を送信します。

`robots`の`content`値|説明|対象
---------------------|----|----
`index`|robot にページのインデックス作成を許可する (既定値)|すべて
`noindex`|ページのインデック作成を行わないことを robot に要求する|すべて
`follow`|robot がページ上のリンクをたどることを許可する (既定値)|すべて
`nofollow`|ページ上のリンクをたどらないことを robot に要求する|すべて
`none`|noindex, nofollow と同義|Google
`noodp`|Open Directory Project に説明文がある場合、検索結果のページでその説明文をサイトの説明として使用しないようにする|Google, Yahoo, Bing
`noarchive`|ページのコンテンツをキャッシュしないことを検索エンジンに要求する。|Google, Yahoo, Bing
`nosnippet`|検索結果のページでページの説明を表示しないようにする。|Google, Bing
`noimageindex`|インデックス登録された画像の参照元としてページを表示しないように要求する|Google
`nocache`|`noarchive`と同義|Bing

#### 3. 表示系

`name`属性値|概要
------------|----
`theme-color`|CSSで有効な色（`#FFFF00`等）
`color-scheme`|互換性をもつ色系統
`viewport`|ビューポートの初期サイズ。モバイル端末のみで使用される。

`color-scheme`の`content`属性値|概要
-------------------------------|----
`normal`|文書が色系統を意識しておらず、単に既定のカラーパレットを使用して描画されます。
`[light | dark]+`|文書が対応している1つ以上の色系統です。同じ色系統を2回以上指定した場合は、1回だけ指定した場合と同じ効果になります。複数の色系統を指定すると、最初の色系統が文書で推奨されますが、ユーザーの好みによって2つ目の色系統を使用することができます。
`only light`|この文書が明色モード、つまり明色の背景色に暗色の前景色の組み合わせのみに対応していることを示します。仕様書によれば、`only dark`は暗色モードに対応していない文書に強制すると、内容が読めなくなる可能性があるので有効ではありません。主要なブラウザーはすべて、設定がない限りは明色モードです。

```html
<meta name="color-scheme" content="normal">
<meta name="color-scheme" content="only light">
<meta name="color-scheme" content="light">
<meta name="color-scheme" content="dark">
<meta name="color-scheme" content="light dark">
<meta name="color-scheme" content="dark light">
```

　`light`モードがデフォルトで、`dark`にもオプションで対応していたほうが嬉しい。よって`light dark`がベスト。（そのためにCSSを作り込まねばならないのが大変だが）

```html
<meta name="viewport" content="width=device-width, initial-scale=1">
```
```html
<meta name="viewport" content="width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no">
```

