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

#### method

　インターフェイスを考える。

材料＆道具
```javascript
Google.SchemaOrg.HowToSupply(name, image=null, requiredQuantity=1, estimatedCost=null)
Google.SchemaOrg.HowToTool(name, image=null, requiredQuantity=1)

Google.SchemaOrg.HowToSupply(option)
Google.SchemaOrg.HowToTool(option)

Google.SchemaOrg.HowToSupplies(options)
Google.SchemaOrg.HowToTools(options)

HowToSupplies(options) {
    return [...Array(options.length).keys()].map((o)=>{Google.SchemaOrg.HowToSupply(o)});

    const supplies = []
    for (const option of options) {
        supplies.push(Google.SchemaOrg.HowToSupply(option))
    }
    return supplies
}
```

1層
```javascript
const steps = ['手順1', '手順2', '手順3']
const steps = [['手順1',url,image], ['手順2',url,image], ['手順3',url,image]]
const steps = [{name:'手順1',url:'',image:''}, {name:'手順2'}, {name:'手順3'}]
const options = {image: '完成画像URL'}
options.suply = [Google.SchemaOrg.HowToSupply(name, image, requiredQuantity, estimatedCost)] 
options.tool = [Google.SchemaOrg.HowToTool(name, image, requiredQuantity)]
Google.SchemaOrg.HowTo(name, steps, options)
```

2層
```javascript
const steps = new Map()
steps['手順1'] = ['手順1-1', '手順1-2', 'TIP: ヒント']
steps['手順2'] = ['手順2-1', '手順2-2', 'TIP: ヒント']
const options = {image: 'URL'}
Google.SchemaOrg.HowTo(name, steps, options)
```

3層
```javascript
const steps = new Map()
steps['セクション1'] = new Map()
steps['セクション1']['手順1'] = ['手順1-1', '手順1-2', 'TIP: ヒント']
steps['セクション1']['手順2'] = ['手順2-1', '手順2-2', 'TIP: ヒント']
steps['セクション2'] = new Map()
steps['セクション2']['手順1'] = ['手順1-1', '手順1-2', 'TIP: ヒント']
steps['セクション2']['手順2'] = ['手順2-1', '手順2-2', 'TIP: ヒント']
const options = {image: 'URL'}
Google.SchemaOrg.HowTo(name, steps, options)
```

##### Map

　まずnew Map()が思ったように使えなかった。オブジェクトと同じように挿入できると思っていたが、できない。

* [Map](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Map)

　以下のように`set`メソッドを使ってキーと値をセットする。

```javascript
const map = new Map()
map.set('キー', '値')
```

　そのため値を代入するとき、すごく面倒になり、読みづらい。

3層
```javascript
const steps = new Map()
const sec1 = new Map()
const sec2 = new Map()
const sec3 = new Map()
sec1.set('ラズパイを起動する', [
        'ACアダプタをコンセントに挿す', 
        'ブートが完了するのを待つ', 
        'TIP:待機時間はHDDなら60秒、SSDなら30秒くらいだよ'])
sec2.set('ブラウザを起動する', [
        'システムメニューアイコンをクリックする', 
        'TIP:タスクバーの左上にあるラズパイ印だよ',
        'インターネット→Chromiumをクリックする',
    ])
sec3.set('ブラウザを終了する', [
        'ブラウザのタイトルバーにある❌ボタンをクリックする'
    ])
steps.set('準備', sec1)
steps.set('手順', sec2)
steps.set('後始末', sec3)
```

　階層順がめちゃくちゃ。読みづらい。

2層
```javascript
const steps = new Map()
steps.set('手順カテゴリ1', ['具体的な手順1-1', '具体的な手順1-2'])
steps.set('手順カテゴリ2', ['具体的な手順2-1', '具体的な手順2-2', '具体的な手順2-3'])
steps.set('手順カテゴリ3', ['具体的な手順3-1', '具体的な手順3-2', 'TIP:ヒント', '具体的な手順3-3'])
```

　2層だけならまだ読みやすい。

　ところで、HowToStepに`image`や`url`などの補足情報を付与したいとき、この形式だと困る。

　とりあえず現状の実装におけるパターンは以下。2,3層のとき`image`や`url`などの補足情報を付与できない。その機能を追加したい。

```
dataパターン
    HowToStepText String ['手順','手順','手順']
    HowToStepText Array  ['手順','https://a.html','https://a.jpg']
    HowToStepText Object {text:'手順', url:'https://a.html', image:'https://a.jpg'}
    HowToStepDirections Array [['手順','手順'], ['手順','手順']]
追加パターン
    HowToStepDirections Object [{name:'', steps:['手順','手順'], image:''}, {name:'', steps:['手順','手順'], image:''}]
```

　それに加えて、もっと簡単に書きたい。

　記法を検討してみる。

```
1層
    ['手順1', '手順2']
    [['手順1','https://a.html','https://a.jpg'], ['手順2','https://a.html','https://a.jpg']]
    [{text:'手順1',url:'https://a.html',image:'https://a.jpg'}, {...}]
2層
    [{name:'手順1',steps:['手順1-1', '手順1-2']}, {name:'手順2',steps:['手順2-1', '手順2-2']}]
    [{name:'手順1',steps:[['手順1-1','URL','imgURL'], [...]]}, {...}]
    [{name:'手順1',steps:[{text:'手順1',url:'https://a.html',image:'https://a.jpg'}, {text:'手順2',url:'https://a.html',image:'https://a.jpg'}]}, {...}]
    ['手順1', [['手順1-1','URL','imgURL'],[...]], '手順2', [['手順2-1','URL','imgURL'],[...]]]
3層
    ['準備', ['準備1',[['準備1-1','URL','imgURL'],[...]], '手順', [['手順1-1','URL','imgURL'],[...]], '後始末', [['後始末1-1','URL','imgURL'],[...]]]]
```

　Objectにするとキー名を書かねばならず、冗長になってしまう。どうせ`name`,`text`,`url`,`image`の4つしかないので、なんとか省略したい。そこで配列を使う。

* 配列内でキーと値を交互に表示することで`name`属性キーを排除する
* 配列内テキストが`https://`ではじまるものは`url`属性値である
* 配列内テキストが`https://`ではじまるもののうち画像の拡張子で終わるものは`image`属性値である

　問題は、これらのパターンを確実に識別できるか否か。

* 1,2,3層のどれであるか
* `text`のみか、`url`,`image`のオプションがあるのか

1層
```
['手順1', '手順2']
```

1層＋オプション
```
[['手順1', 'https://a.jpg'], ['手順2', 'https://a.jpg']]
[['手順1', 'https://a.html'], ['手順2', 'https://a.html']]
[['手順1', 'https://a.html', 'https://a.jpg'], ['手順2', 'https://a.html', 'https://a.jpg']]
```

2層
```
['手順1', ['手順1-1', '手順1-2'], '手順2', ['手順2-1','手順2-2']]
```

2層＋オプション
```
['手順1', [['手順1-1','URL','imgURL'],[...]], '手順2', [['手順2-1','URL','imgURL'],[...]]]
```

3層
```
['準備', ['準備1',[['準備1-1','準備1-2'],[...]], '手順', [['手順1-1','手順1-2'],[...]], '後始末', [['後始末1-1','後始末1-2'],[...]]]]
```

3層＋オプション
```
['準備', ['準備1',[['準備1-1','URL','imgURL'],[...]], '手順', [['手順1-1','URL','imgURL'],[...]], '後始末', [['後始末1-1','URL','imgURL'],[...]]]]
```

3層＋オプションを読みやすく書いてみる。
```
const steps = [
'準備', [
    '準備1',[[
        '準備1-1',
        'URL',
        'imgURL'
        ],[
        '準備1-2',
        'URL',
        'imgURL'
    ]],
    '準備2',[[
        ...
    ]],
'手順', [[
    '手順1',[[
        '手順1-1',
        'URL',
        'imgURL'
        ],[
        '手順1-2',
        'URL',
        'imgURL'
    ]],
    '手順2',[[
        ...
    ]],
]],
'後始末', [[
    '後始末1',[[
        '後始末1-1',
        'URL',
        'imgURL'
        ],[
        '後始末1-2',
        'URL',
        'imgURL'
    ]],
    '後始末2',[[
        ...
    ]],
]]
]
```

　とても書いてられない。プレーンテキストで定義したい。

1層
```
手順1
手順2
```

1層＋オプション
```
手順1   https://a.html      https://a.jpg
手順2   https://a.html      https://a.jpg
```

2層
```
手順1
    手順1-1
    手順1-2
手順2
    手順1-1
    手順1-2
```

2層＋オプション
```
手順1   https://a.html      https://a.jpg
    手順1-1
    手順1-2
手順2   https://a.html      https://a.jpg
    手順1-1
    手順1-2
```

2層＋部分的に1層
```
手順1   https://a.html      https://a.jpg
    手順1-1
    手順1-2
手順2   https://a.html      https://a.jpg
```

3層
```
準備
    準備1
        準備1-1
        準備1-2
    準備2
        準備1-1
        準備1-2
手順
    手順1
        手順1-1
        手順1-2
    手順2
        手順1-1
        手順1-2
後始末
    後始末1
        後始末1-1
        後始末1-2
    後始末手順2
        後始末1-1
        後始末1-2
```

3層＋オプション
```
準備
    準備1   https://a.html      https://a.jpg
        準備1-1
        準備1-2
    準備2   https://a.html      https://a.jpg
        準備1-1
        準備1-2
手順
    手順1   https://a.html      https://a.jpg
        手順1-1
        手順1-2
    手順2   https://a.html      https://a.jpg
        手順1-1
        手順1-2
後始末
    後始末1   https://a.html      https://a.jpg
        後始末1-1
        後始末1-2
    後始末手順2   https://a.html      https://a.jpg
        後始末1-1
        後始末1-2
```

3層＋部分的に2層
```
準備
    準備1   https://a.html      https://a.jpg
        準備1-1
        準備1-2
    準備2   https://a.html      https://a.jpg
手順
    手順1   https://a.html      https://a.jpg
        手順1-1
        手順1-2
    手順2   https://a.html      https://a.jpg
後始末
    後始末1   https://a.html      https://a.jpg
        後始末1-1
        後始末1-2
    後始末手順2   https://a.html      https://a.jpg
```

　これを解析してshcmema.orgに変換せねばならない。超大変そう。TreeTextみたいに特定の形式を定義し、それに従って解析する。そのルールを明確にし、解析中にどんな情報がほしいか考えねばならない。

* インデント（TAB,SPACE(何文字か)）
* 現在の階層
* 名前＋メタデータ

　話をもどす。

　3層にしたら部分的に1層にすることはできないはず。それは想定外の用途である。最上位はHowToSectionであり、[必ずitemListElementにHowToStepの配列が入っていることが期待される][how-to-section]から。いや、でも、どうなんだ？　[リッチリザルト][]でテストしてみないとわからない。

* [how-to-section]:https://developers.google.com/search/docs/advanced/structured-data/how-to?hl=ja#how-to-section
* [リッチリザルト]:https://search.google.com/test/rich-results?hl=ja

#### カスタム例外

* https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Error

　たとえばschema.orgを生成するときの引数エラーを定義する。

* SchemaOrgParameterError

```javascript
class SchemaOrgParameterError extends Error {
    constructor(message) {
        super(message);
        this.name = 'SchemaOrgParameterError ';
    }
}

try {
    throw new SchemaOrgParameterError ('エラーじゃ！');
} catch (e) {
    if (e instanceof SchemaOrgParameterError) {
        console.log('自作エラーじゃ！')
    } else {
        console.log('その他エラー');
    }
}
```

　じつは環境依存である。

```javascript
class SchemaOrgParameterError extends Error {
    constructor(message) {
        super(message);
        this.name = 'SchemaOrgParameterError';
        // V8のとき必要
        if (Error.captureStackTrace) { Error.captureStackTrace(this, this.constructor); }
        // ES5やそれ以前のとき必要
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
```

　冗長すぎる。`class 名前 extends Error`と書いただけで設定してほしい。`name`部分だけは`this.constructor.name`で改善できた。これでクラス名が代入できる。これもデフォルトでやってほしかったなぁ。

```javascript
class SchemaOrgParameterError extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
        // V8のとき必要
        if (Error.captureStackTrace) { Error.captureStackTrace(this, this.constructor); }
        // ES5やそれ以前のとき必要
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
```




