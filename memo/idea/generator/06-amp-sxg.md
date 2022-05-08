# AMPの後継SGX

* [AMP][](WebStory)
* [SXG][](SignedExchange)

[AMP]:https://developers.google.com/amp?hl=ja
[SXG]:https://developers.google.com/search/docs/advanced/experience/signed-exchange?hl=ja

　[SXG][]はWEBページを高速表示するための仕組み。Googleが[SXG][]対応したWEBページをキャッシュし、閲覧者はそのキャッシュを表示する。

* https://web.dev/signed-exchanges/
* https://web.dev/web-bundles/

　WebBundleという技術によって複数のWEBページファイル群がひとつの`.wbn`ファイルに固められる。オフラインで動作するようにもなる。現状はchrominium系ブラウザでしか動作しない。  
　PWAによるキャッシュよりも強力なオフライン機構だと思われる。  
　Minifyしてくれるのかもしれない。ネット通信とサイズ容量減により高速化が期待できる。

　Googleがサイトをキャッシュするらしい。

