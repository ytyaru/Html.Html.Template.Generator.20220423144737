# schema.org

## 情報源

* https://schema.org/
* https://developers.google.com/search/docs/advanced/structured-data/search-gallery?hl=ja

## 概要

* schema.orgは検索エンジンが解析できる共通語彙集である
* 語彙はセマンティックなHTML文書を書くためのものである
* JSON-LD形式で書くのが一般的である
* Googleによるリッチリザルト表示がおもな用途である

## Article

* https://developers.google.com/search/docs/advanced/structured-data/article?hl=ja#non-amp

* @type = Article, NewsArticle, BlogPosting
* Person
    * name
    * url
        * sameAs = [URL]
* dateModified
* datePublished
* headline（全角55字、半角110字以内）
* image
    * [URL]
    * [ImageObject]
        * アス比（1x1, 4x3, 16x9を複数指定）
        * 幅696px以上
        * 画素数（縦x横=30万px以上（千x千=100万））
            * 2K(1080p)の場合
                * 16x9:1920x1080(2,073,600)
                * 4x3:1440x1080(1,555,200)
                * 1x1:1080x1080(1,166,400)
* MonetaryAmount（価格）
    * currency（https://en.wikipedia.org/wiki/ISO_4217）
        * JPY（日本円）
    * value
* QuantitativeValue（量）
    * unitCode（3字のコード：https://unece.org/trade/cefact/UNLOCODE-Download）
    * unitText
    * value
    
1,000, x 1,000 = 1,000,000

¥100
$100
€100
