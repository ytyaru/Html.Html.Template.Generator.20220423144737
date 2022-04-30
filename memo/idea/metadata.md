# メタデータ

* html
    * meta
        * charset
        * metadata
        * robots
        * view
    * title
    * base
    * link
        * `rel`
            * `stylesheet`
            * `alternate`
                * 代替スタイルシート
                    * `rel="alternate stylesheet"`
                    * `title=""`必須
                * フィード
                    * `type="application/atom+xml"`
                    * `type="application/rss+xml"`
                * メディアクエリ `media="..."` MediaQuery
                    * Device
                        * `screen`
                        * `print`
                    * `color-scheme`
                        * `light`
                        * `dark`
                * 多言語
                    * `hreflang="en-GB"`
                * 他
                    * `type="..."`
            * `icon`
            * `apple-touch-icon`
            * `manifest`
                * PWAアプリ用
                * json形式
                * `href="manifest.json"`
            * WebMention（https://webmention.io/  https://qiita.com/jlkiri/items/d56ec812fa8de7a740e2）
                * `rel="me" href="https://twitter.com/${TwitterId}"`
                * `rel="webmention" href="https://webmention.io/${DOMAIN}/webmention"`
                * `rel="pingback" href="https://webmention.io/${DOMAIN}/xmlrpc"`
                * `rel="pingback" href="https://webmention.io/webmention?forward=https://example.com/endpoint"`
    * style
    * script
    * noscript
    * template,slot
    * a
        * `rel`
            * `author`
            * `help`
            * `license`
            * `next`, `prev`
            * `external`
            * `tag`
    * form
        * `rel`
            * `search`
                * `type="application/opensearchdescription+xml"`
                * Open Search
* sitemap
    * xml
    * txt
* feed
    * atom
* open-graph
    * twitter
    * facebook
* schema.org
    * google
        * json-ld
* open-search
    * xml
* pwa
    * manifest.json

## 語彙を自作する

* XML Schema
* LOD
* JSON Schema

　とりあえず一番カンタンそうなのはJSON Schema。


