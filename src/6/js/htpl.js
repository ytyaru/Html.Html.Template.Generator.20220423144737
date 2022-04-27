class Htpl { // Html + Tpl(Template)
    static get Meta() { return Meta; }
    static get OpenGraph() { return OpenGraphNamespace; }
}
class Meta {
    static generate(options=null) {
        if (!options) {
            options = {
                description: 'サイト説明',
                author: '著者名',
                creator: '製作者名',
                publisher: '発行者名',
                keywords: 'web,site,keyword',
                generator: '制作ツール名',
            }
        }
        const html = []
        for (const key of Object.keys(options)) {
            if (options[key]) { html.push(Meta.#makeHtml(key, options[key])); }
        }
        return html.join('')
    }
    static #makeHtml(name, content) { return `<meta name="${name}" content="${content}">`; }
}
class OpenGraphOption {
    static OPTIONS = { 'og': {
        type: 'website', 
        title: 'タイトル',
        url: 'URL',
        image: '画像URL',
        description: '説明。',
        locale: 'ja_JP', // en_US
        'locale:alternate': ['en_US'],
        site_name: 'サイト名',
        audio: '音声URL',
        video: '動画URL',
        determiner: '', // タイトルの前に表示される単語 a, an, the
    }}
}
class OpenGraphNamespace extends OpenGraphOption {
    static get WebSite() { return new OpenGraphGenerator(this.OPTIONS); }
    static get Article() { return new OpenGraphGenerator({...this.OPTIONS, 
        'og': { type: 'article' },
        'article': {
            published_time: '2022-01-01T00:00:00+09:00',  // 公開日時
            modified_time: '2022-01-01T00:00:00+09:00',   // 最終更新日時
            expiration_time: '2022-01-01T00:00:00+09:00', // 有効期限
            author: '著者名',
            section: '上位のセクション名',
            tag: ['tag1', 'tag2'],
    }});}
    static get Book() { return new OpenGraphGenerator({...this.OPTIONS, 
        'og': { type: 'book' },
        'book': {
            author: ['著者URL'],
            isbn: 'ISBN',
            release_date: '2022-01-01T00:00:00+09:00',
            tag: ['tag1', 'tag2'],
    }});}
    static get Profile() { return new OpenGraphGenerator({...this.OPTIONS, 
        'og': { type: 'profile' },
        'profile': {
            first_name: '',
            last_name: '',
            username: '',
            gender: 'male', // male, female
    }});}
    static get Music() { return OpenGraphMusicNamespace; }
    static get Video() { return OpenGraphVideoNamespace; }
}
class OpenGraphMusicNamespace extends OpenGraphOption {
    static get Song() { return new OpenGraphGenerator({...this.OPTIONS, 
        'og': { type: 'music.song' },
        'music': {
            duration: 1,      // int 曲の長さ（秒）
            album: [''],      // [music.album]
            'album:disc': 1,  // int
            'album:track': 1, // int
            musician: [''],   // [profile]
    }});}
    static get Album() { return new OpenGraphGenerator({...this.OPTIONS, 
        'og': { type: 'music.album' },
        'music': {
            song: '',         // music.song
            'song:disc': 1,   // int
            'song:track': 1,  // int
            musician: '',     // profile
            release_date: '', // datetime ISO8601
    }});}
    static get PlayList() { return new OpenGraphGenerator({...this.OPTIONS, 
        'og': { type: 'music.playlist' },
        'music': {
            song: '',         // music.song
            'song:disc': 1,   // int
            'song:track': 1,  // int
            creator: '',      // profile
    }});}
    static get RadioStation() { return new OpenGraphGenerator({...this.OPTIONS, 
        'og': { type: 'music.radio_station' },
        'music': {
            creator: '',      // profile
    }});}
}
class OpenGraphVideoNamespace extends OpenGraphOption {
    static #MOVIE = { 'video': {
        actor: [''],      // [profile] 俳優
        'actor:role': '', // string
        director: '',     // [profile] 監督
        writer: [''],     // [profile] 作家
        duration: 1,      // int 長さ（秒）
        release_date: '', // datetime 公開日
        tag: [''],        // [string]
    }}
    static get Movie() { return new OpenGraphGenerator({...this.OPTIONS, 
        'og': { type: 'video.movie' },
        ...this.#MOVIE,
    });}
    static get Episode() { return new OpenGraphGenerator({...this.OPTIONS, 
        'og': { type: 'video.episode' },
        ...this.#MOVIE,
        'video': {
            series: '', // video.tv_show このエピソードが属するシリーズ
    }});}
    static get TvShow() { return new OpenGraphGenerator({...this.OPTIONS, 
        'og': { type: 'video.tv_show' },
        ...this.#MOVIE,
    });}
    static get Other() { return new OpenGraphGenerator({...this.OPTIONS, 
        'og': { type: 'video.other' },
        ...this.#MOVIE,
    });}
}
class OpenGraphGenerator {
    constructor(options) {
        options['@context'] = "https://schema.org/"
        this.options = options
    }
    get Options() { return this.options; }
    get Prefix() {
        const html = []
        for (const prefix of Object.keys(this.Options)) { html.push(this.#makePrefixValue(prefix)); }
        return html.join(' ')
    }
    #makePrefixValue(prefix='og') { return `${prefix}: https://ogp.me/ns${('og' === prefix) ? '' : '/' + prefix}#`; }
    generate() {
        let html = []
        for (const prefix of Object.keys(this.Options)) {
            html = html.concat(this.#generateOpenGraph(prefix, this.Options[prefix]))
        }
        return html.join('')
    }
    #generateOpenGraph(prefix, options) {
        if ('og' === prefix && !options.hasOwnProperty('type')) { options.type = 'website'; }
        const html = []
        for (const key of Object.keys(options)) {
                 if (!options[key]) { continue; }   // 値がない
            else if (Array.isArray(options[key])) { // 配列である
                for (const value of options[key]) {
                    html.push(this.makeHtml(`${prefix}:${key}`, value));
                }
            }
            else { html.push(this.makeHtml(`${prefix}:${key}`, options[key])); }
        }
        return html
    }
    makeHtml(property, content) { return `<meta property="${property}" content="${content}">`; }
}
class SchemaOrg { // Googleが対応しているものだけ
    static get Person() { return new JsonLdGenerator({
        '@type': 'Person',
        name: '',
        url: '',
        image: '',
        sameAs: [''],
        gender: '',
        description: '',
    }); }
    // 記事
    static get Article() { return new JsonLdGenerator({
        '@type': 'Article',
        author: {
            '@type': 'Person',
            name: '',
            url: '',
            sameAs: [''],
        },
        dateModified: '',
        datePublished: '',
        headline: '', // 半角 110 文字（全角 55 文字）以内
        image: [''], // アス比（1x1,4x3,16x9）各種用意する。幅696px以上。面積30万px以上。
    }); }
    // パンくずリスト
    static #makeBreadcrumbListItemListElement(data) { // positionプロパティを自動生成する
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
    static get BreadcrumbList(data) { // data: new Map(); map[name] = URL;
        if (!data || !(data instanceof Map)) {
            data = new Map()
            data['Home'] = 'https://domain.com/'
            data['Sec1'] = 'https://domain.com/sec1/'
            data['Sec11'] = ''
        }
        return new JsonLdGenerator({
            '@type': 'BreadcrumbList',
            itemListElement: this.#makeBreadcrumbListItemListElement(data),
        /*
        return new JsonLdGenerator({
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
        */
    }); }
    // FAQ
    static #makeFaqList(data) { // data = new Map(); map[Q] = "A";
        if (!(data instanceof Map)) { throw "引数dataはMap型にしてください。map = new Map(); map['質問1'] = '回答1';"; }
        const items = []
        for (const [question, answer] of data.entries()) {
            const item = { "@type": "Question" }
            item.name = question,
            item.acceptedAnswer = {
                '@type': 'Answer',
                text: answer,
            },
            items.push(item)
        }
        return items;
    }
    static get FAQPage(data) {
        if (!data || !(data instanceof Map)) {
            data = new Map()
            data['質問1'] = '回答1'
            data['質問2'] = '回答2'
            data['質問3'] = '回答3'
        }
        return new JsonLdGenerator({
            '@type': 'FAQPage',
            mainEntity: this.#makeFaqList(data),
    }); }



    /*
    static get NewsArticle() { return new JsonLdGenerator({ // ニュース
        '@type': '',
    }); }
    static get AdvertiserContentArticle() { return new JsonLdGenerator({ // 有料コンテンツ（広告、スポンサー、有料）
        '@type': 'AdvertiserContentArticle',
    }); }
    static get Report() { return new JsonLdGenerator({ // 政府または非政府組織によって生成されたレポート
        '@type': 'Report',
    }); }
    static get SatiricalArticle() { return new JsonLdGenerator({ // 風刺的な記事
        '@type': '',
    }); }
    static get ScholarlyArticle() { return new JsonLdGenerator({ // 学術論文
        '@type': 'ScholarlyArticle',
    }); }
    static get SocialMediaPosting() { return new JsonLdGenerator({ // ソーシャルメディアプラットフォームへの投稿
        '@type': 'SocialMediaPosting',
        sharedContent: {},
    }); }
    static get TechArticle() { return new JsonLdGenerator({ // 技術記事（ハウツー、手順、トラブルシューティング、仕様など）
        '@type': 'TechArticle',
        dependencies: '', // 記事の手順を実行するために必要な前提条件
        proficiencyLevel: '', // このコンテンツに必要な習熟度。期待値：'初心者'、'エキスパート'。
    }); }
    // ブログ
    static get Blog() { return new JsonLdGenerator({
        '@type': '',
    }); }
    static get BlogPosting() { return new JsonLdGenerator({
        '@type': '',
    }); }
    // Web Story (AMP)
    static get AmpStory() { return new JsonLdGenerator({
        '@type': 'AmpStory',
    }); }
    */
    // 価格
    static get MonetaryAmount() { return new JsonLdGenerator({
        '@type': 'MonetaryAmount',
        currency: 'JPY',
        value: 100,
    }); }
    static get HowTo() { return new JsonLdGenerator({
        '@type': 'HowTo',
        name: '',
        image: '',
        totalTime: 'P2D3H4M5S', // 所要時間：2日間3時間4分5秒
        estimatedCost: {        // 経費：￥100
            '@type': 'MonetaryAmount',
            currency: 'JPY',
            value: 100,
        },
        supply: [{
            '@type': 'HowToSupply',
            name: '材料A',
            image: '',
            requiredQuantity: 1,
            estimatedCost: {
                '@type': 'MonetaryAmount',
                currency: 'JPY',
                value: 100,
            },
        },{
            '@type': 'HowToSupply',
            name: '材料B',
            image: '',
            requiredQuantity: 1,
            estimatedCost: {
                '@type': 'MonetaryAmount',
                currency: 'JPY',
                value: 100,
            },
        }],
        tool: [{
            '@type': 'HowToTool',
            name: '道具A',
            image: '',
            requiredQuantity: 1,
        },{
            '@type': 'HowToTool',
            name: '道具B',
            image: '',
            requiredQuantity: 1,
        }],
        step: [{
            '@type': 'HowToSection',
            name: '準備',
            itemListElement: [{
                '@type': 'HowToStep',
                name: '準備1',
                image: '',
                url: '',
                itemListElement: [{
                    '@type': 'HowToDirection',
                    text: 'すべきこと1-1。',
                },{
                    '@type': 'HowToDirection',
                    text: 'すべきこと1-2。',
                }],
            },{
                '@type': 'HowToStep',
                name: '準備2',
                image: '',
                url: '',
                itemListElement: [{
                    '@type': 'HowToDirection',
                    text: 'すべきこと2-1。',
                },{
                    '@type': 'HowToDirection',
                    text: 'すべきこと2-2。',
                }],
            }]
        },{
            '@type': 'HowToSection',
            name: '手順',
            itemListElement: [{
                '@type': 'HowToStep',
                name: '手順1',
                image: '',
                url: '',
                itemListElement: [{
                    '@type': 'HowToDirection',
                    text: 'すべきこと1-1。',
                },{
                    '@type': 'HowToDirection',
                    text: 'すべきこと1-2。',
                }],
            },{
                '@type': 'HowToStep',
                name: '手順2',
                image: '',
                url: '',
                itemListElement: [{
                    '@type': 'HowToDirection',
                    text: 'すべきこと2-1。',
                },{
                    '@type': 'HowToDirection',
                    text: 'すべきこと2-2。',
                }],
            }]
        }]
    }); }
    static get HowToSupply() { return new JsonLdGenerator({ // 材料
        '@type': 'HowToSupply',
        name: '',
        image: '',
        requiredQuantity: 1,
        estimatedCost: {
            '@type': 'MonetaryAmount',
            currency: 'JPY',
            value: 100,
        },
    }); }
    static get HowToTool() { return new JsonLdGenerator({ // 道具
        '@type': 'HowToTool',
        name: '',
        image: '',
        requiredQuantity: 1,
    }); }
    static get HowToSection() { return new JsonLdGenerator({ // Stepまとめ
        '@type': '',
        name: '',
        itemListElement: [{
            '@type': 'HowToStep',
            text: '',
            image: '',
        },{
            '@type': 'HowToStep',
            text: '',
            image: '',
        }],
    }); }
    static get HowToStep() { return new JsonLdGenerator({ // 手順（text）
        '@type': 'HowToStep',
        text: '',
        image: '',
    }); }
    static get HowToStepDirections() { return new JsonLdGenerator({ // 手順（Direction, Tip）
        '@type': 'HowToStep',
        name: '手順1',
        image: '',
        url: '',
        itemListElement: [{
            '@type': 'HowToDirection',
            text: 'すべきこと1。',
        },{
            '@type': 'HowToDirection',
            text: 'すべきこと2。',
        },{
            '@type': 'HowToTip',
            text: '補足。',
        }],
    }); }
    static get HowToDirection() { return new JsonLdGenerator({ // Step詳細
        '@type': 'HowToDirection',
        text: 'すべきこと。',
    }); }
    static get HowToTip() { return new JsonLdGenerator({ // Step補足
        '@type': 'HowToTip',
        text: '補足。',
    }); }
    
    /*
    // 短編小説
    static get ShortStory() { return new JsonLdGenerator({
        '@type': '',
    }); }
    */

    /*
    // 画像（Illust, PixelArt, がない。おそらくPaintingに該当するのだろう）
    static get Drawing() { return new JsonLdGenerator({
        '@type': '',
    }); }
    static get Painting() { return new JsonLdGenerator({
        '@type': '',
    }); }
    static get Photograph() { return new JsonLdGenerator({
        '@type': '',
    }); }
    static get Poster() { return new JsonLdGenerator({
        '@type': '',
    }); }
    static get VisualArtwork() { return new JsonLdGenerator({
        '@type': '',
    }); }
    */

    // データセット（CSV,XMLなど）https://developers.google.com/search/docs/advanced/structured-data/dataset?hl=ja
    static get Dataset() { return new JsonLdGenerator({
        '@type': 'Dataset',
        name: '',
        description: '',
        creator: [''],
        citation: 'URL',
        keywords: ['']
        isAccessibleForFree: true,
        license: 'https://creativecommons.org/publicdomain/zero/1.0/',
        distribution: [{
            '@type': 'DataDownload',
            encodingFormat: 'CSV',
            contentUrl: 'http://www.ncdc.noaa.gov/stormevents/ftp.jsp'
            },{
            '@type': 'DataDownload',
            encodingFormat: 'XML',
            contentUrl: 'http://gis.ncdc.noaa.gov/all-records/catalog/search/resource/details.page?id=gov.noaa.ncdc:C00510'
        }],
        image: '',
        sameAs: [''],
        gender: '',
    }); }

    /*
    // メディア
    static get MediaObject() { return new JsonLdGenerator({
        '@type': 'MediaObject',
        contentSize: '',
        contentUrl: '',
        encodingFormat: '', // MIME type
        width: '',
        height: '',
    }); }
    */
    static get ImageObject() { return new JsonLdGenerator({
        '@type': 'ImageObject',
        '': '',
        contentUrl: 'URL',
        license: 'URL',
        acquireLicensePage: 'URL',
    }); }
    static get AudioObject() { return new JsonLdGenerator({
        '@type': 'AudioObject',
    }); }
    static get VideoObject() { return new JsonLdGenerator({// https://developers.google.com/search/docs/advanced/structured-data/video?hl=ja
        '@type': 'VideoObject',
        name: '',
        description: '',
        thumbnailUrl: [''],
        uploadDate: '',
        duration: '',
        contentUrl: '',
        embedUrl: '',
        interactionStatistic: {
            "@type": "InteractionCounter",
            "interactionType": { "@type": "WatchAction" },
            "userInteractionCount": 5647018
        },
    }); }
    /*
    static get MusicVideoObject() { return new JsonLdGenerator({
        '@type': 'MusicVideoObject',
    }); }
    static get 3DModel() { return new JsonLdGenerator({
        '@type': '3DModel',
    }); }
    */

    static get Offer() { return new JsonLdGenerator({
        '@type': 'Offer',
        price: 100,
        priceCurrency: 'JPY',
    }); }

    // ソフトウェア
    static get SoftwareApplication() { return new JsonLdGenerator({
        '@type': 'SoftwareApplication',
        name: '',
        offers: {
            '@type': 'Offer',
            price: 100,
            priceCurrency: 'JPY',
        },
        aggregateRating: {
            '@type': 'AggregateRating',
            ratingCount: 1,  // 評価数
            bestRating: 5,   // 最大評価値
            ratingValue: 5,  // 評価値
        },
        applicationCategory: '', // GameApplication, SocialNetworkingApplication, TravelApplication, ShoppingApplication, SportsApplication,LifestyleApplication, BusinessApplication, DesignApplication, DeveloperApplication, DriverApplication, EducationalApplication, HealthApplication, FinanceApplication, SecurityApplication, BrowserApplication, CommunicationApplication, DesktopEnhancementApplication, EntertainmentApplication, MultimediaApplication, HomeApplication, UtilitiesApplication, ReferenceApplication
        operatingSystem: 'Windows, OSX, Linux, Android, iOS',
    }); }
    static get WebApplication() { return new JsonLdGenerator({
        '@type': 'WebApplication',
        name: '',
        offers: {
            '@type': 'Offer',
            price: 100,
            priceCurrency: 'JPY',
        },
        aggregateRating: {
            '@type': 'AggregateRating',
            ratingCount: 1,  // 評価数
            bestRating: 5,   // 最大評価値
            ratingValue: 5,  // 評価値
        },
        applicationCategory: '',
        operatingSystem: 'Windows, OSX, Linux, Android, iOS',
    }); }
    static get MobileApplication() { return new JsonLdGenerator({
        '@type': 'WebApplication',
        name: '',
        offers: {
            '@type': 'Offer',
            price: 100,
            priceCurrency: 'JPY',
        },
        aggregateRating: {
            '@type': 'AggregateRating',
            ratingCount: 1,  // 評価数
            bestRating: 5,   // 最大評価値
            ratingValue: 5,  // 評価値
        },
        applicationCategory: '',
        operatingSystem: 'Windows, OSX, Linux, Android, iOS',
    }); }
    static get VideoGameSoftwareApplication() { return new JsonLdGenerator({
        '@type': ['VideoGame', 'SoftwareApplication'],
        name: '',
        offers: {
            '@type': 'Offer',
            price: 100,
            priceCurrency: 'JPY',
        },
        aggregateRating: {
            '@type': 'AggregateRating',
            ratingCount: 1,  // 評価数
            bestRating: 5,   // 最大評価値
            ratingValue: 5,  // 評価値
        },
        applicationCategory: '',
        operatingSystem: 'Windows, OSX, Linux, Android, iOS',
    }); }
    static get VideoGameWebApplication() { return new JsonLdGenerator({
        '@type': ['VideoGame', 'WebApplication'],
        name: '',
        offers: {
            '@type': 'Offer',
            price: 100,
            priceCurrency: 'JPY',
        },
        aggregateRating: {
            '@type': 'AggregateRating',
            ratingCount: 1,  // 評価数
            bestRating: 5,   // 最大評価値
            ratingValue: 5,  // 評価値
        },
        applicationCategory: '',
        operatingSystem: 'Windows, OSX, Linux, Android, iOS',
    }); }
    static get VideoGameMobileApplication() { return new JsonLdGenerator({
        '@type': ['VideoGame', 'MobileApplication'],
        name: '',
        offers: {
            '@type': 'Offer',
            price: 100,
            priceCurrency: 'JPY',
        },
        aggregateRating: {
            '@type': 'AggregateRating',
            ratingCount: 1,  // 評価数
            bestRating: 5,   // 最大評価値
            ratingValue: 5,  // 評価値
        },
        applicationCategory: '',
        operatingSystem: 'Windows, OSX, Linux, Android, iOS',
    }); }
    /*
    static get SoftwareSourceCode() { return new JsonLdGenerator({
        '@type': '',
    }); }
    */

    /*
    static get Thesis() { return new JsonLdGenerator({ // 論文
        '@type': '',
    }); }
    */

    // 本
    static get Book() { return new JsonLdGenerator({
        '@type': 'DataFeed',
        dataFeedElement: [
            "@context": "https://schema.org",
            "@type": "Book",
            "@id": "http://example.com/work/the_catcher_in_the_rye",
            "url": "http://example.com/work/the_catcher_in_the_rye",
            "name": "",
            "author": {
                "@type": "Person",
                name: "J.D. Salinger"
            },
            sameAs: "https://en.wikipedia.org/wiki/The_Catcher_in_the_Rye",
            dateModified: "2018-09-10T13:58:26.892Z",
            workExample: [{
                "@type": "Book",
                "@id": "http://example.com/edition/the_catcher_in_the_rye_paperback",
                "isbn": "9787543321724", // ISBN-13
                "bookEdition": "Mass Market Paperback",
                "bookFormat": "https://schema.org/Paperback", // AudiobookFormat, EBook, ,Hardcover ,Paperback
                "inLanguage": "en",
                "potentialAction": {
                    "@type": "ReadAction", // 購入
                    "target": {
                        "@type": "EntryPoint",
                        "urlTemplate": "http://example.com/store/9787543321724",
                        "actionPlatform": [
                            "https://schema.org/DesktopWebPlatform",
                            "https://schema.org/AndroidPlatform",
                            "https://schema.org/IOSPlatform"
                        ]
                    },
                    "expectsAcceptanceOf": {
                        "@type": "Offer",
                        "category": "purchase",
                        "price": 6.99,
                        "priceCurrency": "USD",
                        "availabilityStarts": "2020-01-01T11:0:00-04:00",
                        "availabilityEnds": "2050-06-30T23:59:00-04:00",
                        "eligibleRegion": {
                            "@type": "Country",
                            "name": "US"
                        }
                    }
                }
            },{
                "@type": "Book",
                "@id": "http://example.com/edition/the_catcher_in_the_rye_paperback",
                "isbn": "9787543321724",
                "bookEdition": "Mass Market Paperback",
                "bookFormat": "https://schema.org/Paperback",
                "inLanguage": "en",
            }]
        ],
    }); }
    /*
    static get Chapter() { return new JsonLdGenerator({
        '@type': '',
    }); }
    */

    /*
    static get () { return new JsonLdGenerator({
        '@type': '',
    }); }
    static get () { return new JsonLdGenerator({
        '@type': '',
    }); }
    static get () { return new JsonLdGenerator({
        '@type': '',
    }); }
    static get () { return new JsonLdGenerator({
        '@type': '',
    }); }
    */
}
class JsonLdGenerator { // <script type="application/ld+json">
    constructor(options) { this.options = options; }
    get Options() { return this.options; }
    get Mime() { return 'application/ld+json'; }
    generate() { return JSON.stringify(this.Options); }
}
