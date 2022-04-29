# Sitemap

## 情報源

* https://developers.google.com/search/docs/advanced/sitemaps/build-sitemap?hl=ja#rss
* https://www.sitemaps.org/protocol.html

## 書式

### 単一ファイル

sitemap.xml
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>http://www.example.com/foo.html</loc>
    <lastmod>2018-06-04</lastmod>
  </url>
</urlset>
```

### ファイルセット

sitemap.xml
```xml
<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
   <sitemap>
      <loc>http://www.example.com/sitemap1.xml.gz</loc>
      <lastmod>2004-10-01T18:23:17+00:00</lastmod>
   </sitemap>
   <sitemap>
      <loc>http://www.example.com/sitemap2.xml.gz</loc>
      <lastmod>2005-01-01</lastmod>
   </sitemap>
</sitemapindex>
```

## 上限

* URL数：5万
* サイズ: 50MB（52,428,800 バイト）
* gzip形式で圧縮することも可能

## 選択肢

* ファイル形式: XML, RSS, Atom, TXT

## サイトマップをGoogleに送信する

* https://developers.google.com/search/docs/advanced/sitemaps/build-sitemap?hl=ja#rss

```
https://www.google.com/ping?sitemap=FULL_URL_OF_SITEMAP
```

```sh
FULL_URL_OF_SITEMAP=https://exmaple.com/sitemap.xml
wget https://www.google.com/ping?sitemap=$FULL_URL_OF_SITEMAP
```

## WebSub/PubSubHubBub

* http://pubsubhubbub.appspot.com/
* https://github.com/pubsubhubbub/
* https://websubhub.com/
* https://ruuraruura.com/ping-websub-searchconsole/

```sh
$ curl \
    -d "hub.mode=subscribe&hub.topic=$TOPIC_URL&hub.callback=$CALLBACK_URL" \
    -X POST \
    https://websubhub.com/hub
```
```sh
$ curl \
    -d "hub.mode=unsubscribe&hub.topic=$TOPIC_URL&hub.callback=$CALLBACK_URL" \
    -X POST \
    https://websubhub.com/hub
```
```sh
$ curl \
    -d "hub.mode=publish&hub.topic=$TOPIC_URL" \
    -X POST \
    https://websubhub.com/hub
```

hub.lease_seconds
サブスクライバーがサブスクリプションをアクティブにしたい秒数。正の10進整数で指定されます。デフォルト値は10日です。
hub.secret
コンテンツ配信用のHMACダイジェストを計算するために使用される、サブスクライバーが提供する暗号的にランダムな一意のシークレット文字列。このパラメータの長さは200バイト未満でなければなりません。
サブスクライブリクエストを送信すると、適切なGETリクエストが$ CALLBACK_URLに送信され、サブスクリプションが確認されます。

```xml
<link rel="self" type="application/atom+xml" href="https://qwerty.work/blog/atom.xml"/>
<link rel="hub" href="https://pubsubhubbub.appspot.com/"/>
<link rel="hub" href="https://pubsubhubbub.superfeedr.com"/>
<link rel="hub" href="https://switchboard.p3k.io/"/>
<link rel="hub" href="http://phubb.cweiske.de/hub.php"/>
```

　上記Atom/RSSのXMLファイルURLを

* https://s-yqual.com/blog/326

## Atom/RSS2.0

　いわゆるフィード。最新記事20件だけを配信するなどの形で利用する。サイトが更新されるたびにフィードファイルも更新する。

