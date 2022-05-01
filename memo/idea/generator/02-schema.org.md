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


## プレーンテキストから生成したい

　たとえばパンくずリストは表示名とURLの組がリストになっているもの。それらはJSのMapクラスで表現できる。それを引数にとり、JSONの元となるオブジェクトを返す関数が以下。

```javascript
    static #makeBreadcrumbList(data) { // positionプロパティを自動生成する
        const items = []
        let count = 1;
        for (const [name, url] of data.entries()) {
            const item = { "@type": "ListItem" }
            item.position = count
            item.name = name
            if (url) { item.item = url; }
            count++;
            items.push(item)
        }
        return items;
    }
```

　あとは以下APIでオブジェクトをJSON文字列化すればJSON-LDになる。

```javascript
JSON.stringify(this.Options);
```

　以下のような文字列を手で作るのは大変すぎるからね。

```javascript
{
    '@type': 'BreadcrumbList',
    itemListElement: [{
        "@type": "ListItem",
        "position": 1,
        "name": "",
        "item": "URL"
    },{
        "@type": "ListItem",
        "position": 2,
        "name": "",
        "item": "URL"
    },{
        "@type": "ListItem",
        "position": 3,
        "name": ""
    }]
}
```

`@type`|データ型
-------|--------
`BreadcrumbList`|`Map<表示名, URL>[表示順]`
`FAQPage`|`Map<質問, 回答>[表示順]`
`HowTo`|`name, image, totalTime, estimatedCost, supply:['材料1,', '材料2'], tool:['道具1','道具2'], step:['手順1', '手順2']`
`HowToSupply`|`name, image, estimatedCost, requiredQuantity`
`HowToTool`|`name, image, requiredQuantity`
`HowToSection`,`HowToStep`,`HowToDirection`,`HowToTip`|`name, text, image`

### HowTo

　HowToは非常に複雑なので、簡略化するためにはまず分析してパターンを導出する。

* HowTo
    * image
    * totalTime
    * estimatedCost
    * supply: [{}]
    * tool: [{}]
    * step: [{}]
        * HowToStep.text
        * HowToStep.itemListElement<HowToDirection>
            * text
        * HowToStep.itemListElement<HowToTip>
            * text
        * HowToSection
            * itemListElement<HowToStep>
                * HowToStep.text
                * HowToStep.itemListElement<HowToDirection>
                * HowToStep.itemListElement<HowToTip>

　とくに`step`の記法が4パターンあることが複雑化しているポイントである。まずはこれを分析したい。

* 階層
    * 1階層 `step:[Step.text, ...]`
    * 2階層 `step:[Step.itemListElement[Direction.text, ...], ...]`
    * 3階層 `step:[Section{name, itemListElement: [Step.itemListElement[Direction.text, ...], ...], ...]`
* 種別
    * 手順 `Direction.text`
    * ヒント `Tip.text`

1階層
```
1. 手順1
2. 手順2
3. 手順3
```

2階層
```
1. 手順1
2. 手順2
3. 手順3
    3-1. 手順3-1
    3-2. 手順3-2
    3-3. ヒント
```

3階層
```
1. セクション1
    1-1. 手順1
    1-2. 手順2
    1-3. 手順3
        1-3-1. 手順3-1
        1-3-2. 手順3-2
        1-3-3. ヒント
```

* 1階層のとき
    * Step.textを使う（nameやitemListElementは使わない）
    * ヒントであるTipは2階層以上でないと指定できない！
* 2階層以上あるとき
    * StepはtextでなくnameとitemListElementを使う
    * itemListElementにはDirection.textかTip.textを使う
* 3階層あるとき
    * Sectionを使う
* 必須
    * HowTo
        * name
* 補足情報
    * HowTo
        * totalTime
        * estimatedCost
        * supply
        * tool
        * image
        * video
    * Step
        * image
        * url
        * video
* 注意
    * textには`手順1. 〜`などを含めず、純粋な工程のみを記す

```javascript
const Steps = HowTo.generateSteps(txt)
HowTo.generate(name, Steps, options)
```
```
準備
    PCを起動する
        PCの電源プラグをコンセントに挿す
        PCの電源スイッチを入れる
        PCがブートするのを待つ
手順
    ブラウザを起動する
        システムメニューを開く
        「インターネット」をクリックする
        「Chromium」をクリックする
後始末
    ブラウザを閉じる
        タイトルバー右上にある❌ボタンをクリックする
```
```
Section[0].name
    itemListElement[]
        Step[0].name
            itemListElement[]
                Direction.text
                Direction.text
                Direction.text
                Tip.text
Section[1].name
    itemListElement[]
        Step[0].name
            itemListElement[]
                Direction.text
                Direction.text
                Direction.text
Section[2].name
    itemListElement[]
        Step[0].name
            itemListElement[]
                Direction.text
```

```
PCを起動する
    PCの電源プラグをコンセントに挿す
    PCの電源スイッチを入れる
    PCがブートするのを待つ
    HDDなら60秒、SSDなら30秒くらいかかる
ブラウザを起動する
    システムメニューを開く
    「インターネット」をクリックする
    「Chromium」をクリックする
```


```
Step[0].name
    itemListElement[]
        Direction.text
        Direction.text
        Direction.text
        Tip.text
Step[1].name
    itemListElement[]
        Direction.text
        Direction.text
        Direction.text
```

1階層
```
PCの電源プラグをコンセントに挿す
PCの電源スイッチを入れる
PCがブートするのを待つ
```
```
Step[0].text
Step[1].text
Step[2].text
```

#### 2階層は記法が2パターンあるが、1つしか使わない

　じつは2階層のときには以下2パターンがありうる。

```
Step.name
    itemListElement[]
        Direction.text
        Direction.text
```
```
Section.name
    Step.name
        itemListElement[]
            Step[0].text
            Step[1].text
```

　ただし後者はDirectionとTipを使い分けることができない。よってこのパターンは使わないことにする。

#### DirectionとTipの使い分け

　HowToをテキストで書くとき、2階層以上なら手順（Direction）のほかにヒント（Tip）を書ける。これらを使い分けるとき、どのように表記するか。

```
手順
    手順1
    手順2
    手順2のヒント
    手順3
```

　Tipにする場合、その行のインデント直後に`TIP:`を書く。これで`HowToTip`型が使われるようになる。

```
手順
    手順1
    手順2
    TIP: 手順2のヒント
    手順3
```

　これは3階層あるときも同じ。

```
セクション
    手順
        ディレクション
        ディレクション
        TIP: チップ
        ディレクション
```

　ただし、1階層のときは使えない。これはStep.textを使うためである。

