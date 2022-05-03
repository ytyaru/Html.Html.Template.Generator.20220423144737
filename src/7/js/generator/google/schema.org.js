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
    static #makeBreadcrumbList(data) { // positionプロパティを自動生成する
        const items = []
        let count = 1;
        for (const [name, url] of data) {
            const item = { "@type": "ListItem" }
            item.position = count
            item.name = name
            if (url) { item.item = url; }
            count++;
            items.push(item)
        }
        return items;
    }
    static BreadcrumbList(data) { // data: new Map(); map[name] = URL;
        if (!data || !(data instanceof Map)) {
            data = new Map()
            data['Home'] = 'https://domain.com/'
            data['Sec1'] = 'https://domain.com/sec1/'
            data['Sec11'] = ''
        }
        return new JsonLdGenerator({
            '@type': 'BreadcrumbList',
            itemListElement: this.#makeBreadcrumbList(data),
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
        if (!(data instanceof Map)) { throw new SchemaOrgParameterError("引数dataはMap型にしてください。const map = new Map(); map.set('質問1', '回答1');"); }
        //if (!(data instanceof Map)) { throw new Error("引数dataはMap型にしてください。map = new Map(); map['質問1'] = '回答1';"); }
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
    static FaqPage(data) {
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
    static #makeAnswer(answer, isMarkdown=false) { // answer = '回答' or ['回答', '理由']
        const obj = { '@type': 'Answer' }
        if (isMarkdown) { obj.encodingFormat = 'text/markdown'; }
        if ('string' === typeof(answer)) { obj.text = answer; }
        else if (Array.isArray(answer)) { obj.text = answer[0]; obj.comment = this.#makeComment(answer[1]); }
        else { throw new SchemaOrgParameterError("引数answerは文字列か配列であるべきです。'回答'または['回答', '理由']。"); }
        //else { throw new Error("引数answerは文字列か配列であるべきです。'回答'または['回答', '理由']。"); }
        return obj;
    }
    static #makeComment(text) { return {
        '@type': 'Comment',
        text: text,
    }}
    static #makeQuestion(question, answerObj, suggestsObjs, isCheckbox=false) { 
        const type = (isCheckbox) ? 'Checkbox' : 'Multiple choice'
        return {
            '@type': 'Question',
            eduQuestionType: type,  // Multiple choice（正解はひとつのみ）, Checkbox（正解が複数ある）
            learningResourceType: 'Practice problem', // 練習問題（固定値）
            text: question,                // 問題
            acceptedAnswer: answerObj,     // 回答（正解）
            suggestedAnswer: suggestsObjs, // 回答（不正解）
        }
    }
    // クイズ https://developers.google.com/search/docs/advanced/structured-data/practice-problems?hl=ja
// ひとつの問題に対して正解がひとつ。不正解が複数。ラジオボタン選択式。answer, suggestsはテキストまはたオブジェクトが入る。オブジェクトはテキストが二つ入る。すなわち表示テキストと、それが正解／不正解である理由。
    static SimpleQuiz(title, question, answer, suggests) {
        const answerObj = this.#makeAnswer(answer);
        const suggestObjs = []
        for (const s of suggests) { suggestObjs.push(this.#makeAnswer(s)); }
        return new JsonLdGenerator({
            '@type': 'Quiz',
            "about": {
                "@type": "Thing",
                "name": title,
            },
            hasPart: this.#makeQuestion(question, answerObj, suggestObjs),
    }); }
    static SimpleQuizes(title, questions) { // SimpleQuizが複数ある。questions = [{question, answer, suggests}]
        const questionObjs = []
        for (const question of questions) {
            const answerObj = this.#makeAnswer(question.answer);
            const suggestObjs = []
            for (const s of question.suggests) { suggestObjs.push(this.#makeAnswer(s)); }
            questionObjs.push(this.#makeQuestion(question, answerObj, suggestObjs))
        }
        return new JsonLdGenerator({
            '@type': 'Quiz',
            "about": {
                "@type": "Thing",
                "name": title,
            },
            hasPart: questionObjs,
    }); }

    static get Quiz() { return new JsonLdGenerator({ // ニュース
        '@type': 'Quiz',
        "about": {
            "@type": "Thing",
            "name": "クイズのコンセプト"
        },
        hasPart: {
            '@type': 'Question',
            eduQuestionType: 'Multiple choice',  // Multiple choice（正解はひとつのみ）, Checkbox（正解が複数ある）
            learningResourceType: 'Practice problem', // 練習問題（固定値）
            name: 'クイズのタイトル',
            text: 'クイズの本文。問題文。',
            acceptedAnswer: { // 正解
                '@type': 'Answer',
                encodingFormat: 'text/html', // h1〜h6,br,ol,ul,li,p,b,i,img,LaTex。（text/html, text/markdown）
                text: '正解',
                /*
                comment: { // なぜ正解なのか。
                    '@type': 'Comment',
                    text: '理由',
                },
                */
            },
            suggestedAnswer: [{ // 不正解
                '@type': 'Answer',
                encodingFormat: 'text/html',
                text: '不正解1',
                /*
                comment: { // なぜ不正解なのか。
                    '@type': 'Comment',
                    text: '理由',
                },
                */
            },{
                '@type': 'Answer',
                encodingFormat: 'text/html',
                text: '不正解2',
            }],
        },
    }); }

    // ポッドキャスト RSS https://support.google.com/podcast-publishers/answer/9889544#enclosure
    /*
    static get  Podcast() {
    }); }
    */

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
    static MonetaryAmount(value, currency='JPY') { return {
        '@context': 'https://schema.org/',
        '@type': 'MonetaryAmount',
        currency: currency,
        value: value,
    }}
    static HowToItem(type, option) {
        if (!option.hasOwnProperty('name')) { throw new SchemaOrgParameterError(`${type}の引数optionにはnameキーと値が必須です。`); }
        const result = {'@type': type}
        result['name'] = option.name
        for (const key of ['image', 'requiredQuantity']) {
            if (option.hasOwnProperty(key)) { result[key] = option[key]; }
        }
        return result
    }
    static HowToTool(option) { return this.HowToItem('HowToTool', option); }
    static HowToTools(options) { return [...Array(options.length).keys()].map((o)=>{Google.SchemaOrg.HowToTool(o)}); }
    static HowToSupply(option) {
        const result = this.HowToItem('HowToSupply', option);
        for (const key of ['estimatedCost']) {
            if (option.hasOwnProperty(key)) { result[key] = option[key]; }
        }
        return result
    }
    static HowToSupplies(options) { return [...Array(options.length).keys()].map((o)=>{Google.SchemaOrg.HowToSupply(o)}); }
    static HowToStepSection(name, steps) { return {
        '@type': 'HowToSection',
        name: name,
        itemListElement: steps,
    }}
    static HowToStepText(data) {
        const step = {'@type': 'HowToStep'}
             if ('string' === typeof data) { step.text = data; }
        else if (Array.isArray(data)) {
            for (const d of data) {
                if (!step.hasOwnProperty('text')) { step.text = d; }
                else {
                    if (['http://', 'https://'].some((schema)=>{d.toLowerCase().startsWith(schema)})) {
                        if (['png','jpg','gif','webp','avif'].some((ext)=>{d.toLowerCase().endsWith('.'+ext)})) { step.image = d; }
                        else { step.url = d; }
                    }
                    else { continue; }
                }
            }
        }
        else if (data instanceof Object) { step = data; } // text, url, image, 
        else { throw new SchemaOrgParameterError(`HowToStepTextの引数dataはStringかObject型であるべきです。'${typeof data}' data = '手順'; data = {text:'手順', url:'https://...', image:'https://...'};`); }
        return step
    }
    static HowToStepDirections(name, directions) {
        const step = {'@type': 'HowToStep', 'name': name}
        step.itemListElement = []
        if (Array.isArray(directions)) {
            for (const dir of directions) {
                if (dir.toUpperCase().startsWith('TIP:')) { step.itemListElement.push(this.HowToTip(dir)); }
                else { step.itemListElement.push(this.HowToDirection(dir)); }
            }
        }
        else { throw new SchemaOrgParameterError(`HowToStepDirectionsの引数directionsは配列であるべきです。const ary = ['Direction1', 'TIP:ヒント'];`); }
    }
    /*
    static HowToEnd(type, text) {
        const EXPECTEDS = ['HowToTip','HowToDirection']
        if (!EXPECTEDS.some((e)=>type === e)) { throw new SchemaOrgParameterError(`引数typeが不正値です。次のいずれかにしてください。\n${EXPECTEDS.join('\n')}`); }
        return { '@type': type, text: text }
    }
    static HowToTip(text) { return this.HowToEnd('HowToTip', text); } 
    static HowToDirection(text) { return this.HowToEnd('HowToDirection', text); } 
    */
    static HowToTip(text) { return { '@type': 'HowToTip', text: text }; } 
    static HowToDirection(text) { return { '@type': 'HowToDirection', text: text }; } 
    static HowToSteps(data) { // 階層1,2,3の3パターンある。2階層以上なら先頭に`TIPS:`と書けばHowToDirectionでなくHowToTipになる。
        if (Array.isArray(data)) { // 1層
            return data.map(v=>SchemaOrg.HowToStepText(v))
        } else if (data instanceof Map) {
            const result = []
            for (const [key, value] of data) {
                if (Array.isArray(value)) { // 2層
                    result.push([...Array(data.length).keys()].map((d)=>{SchemaOrg.HowToStepDirections(key, value)})) 
                } else if (value instanceof Map) { // 3層
                    const steps = []
                    for (const [name, directions] of value) {
                        steps.push(Google.SchemaOrg.HowToStepDirections(name, directions))
                    }
                    result.push(this.HowToStepSection(key, steps))
                } else { throw new SchemaOrgParameterError(`HowToStepsの引数dataの2層目は配列かMap型のいずれかであるべきです。${typeof value}`); }
            }
            return result
        } else { throw new SchemaOrgParameterError(`HowToStepsの引数dataの1層目は配列かMap型のいずれかであるべきです。${typeof data}`); }
    }
    static HowTo(name, steps, option=null) {
        //const opt = option || {}
        const opt = {'@type': 'HowTo', ...option}
        opt.name = name
        opt.step = this.HowToSteps(steps)
        return new JsonLdGenerator(opt)
    }
    /*
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
        '@type': 'HowToSection',
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
    */

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

    static DataDownload(format, url) { return { // format = 'CSV','XML',  url = 'https://...some.csv'
        '@type': 'DataDownload',
        encodingFormat: format,
        contentUrl: url
    }}
    // データセット（CSV,XMLなど）https://developers.google.com/search/docs/advanced/structured-data/dataset?hl=ja
    static Dataset(name, description, downloads, options={}) { // downloads = new Map() ['format'] = 'url'
        if (!(downloads instanceof Map)) { throw new SchemaOrgParameterError("引数downloadsはMap型であるべきです。const map = new Map(); map.set('format', 'url');"); }
        //if (!(downloads instanceof Map)) { throw new Error("引数downloadsはMap型であるべきです。map['format'] = 'url'"); }
        const distribution = []
        for (const [format, url] of downloads.entries()) { distribution.push(this.DataDownload(format, url)); }
        return new JsonLdGenerator({
            '@type': 'Dataset',
            name: name,
            description: description,
            distribution: distribution,
            ...options
        /*
        const obj = { 
            '@type': 'Dataset',
            name: name,
            description: description,
            distribution: distribution,
            creator: creator,
            citation: 'URL',
            keywords: [''],
            isAccessibleForFree: true,
            license: 'https://creativecommons.org/publicdomain/zero/1.0/',
        }
        */
        /*
        return new JsonLdGenerator({ 
            '@type': 'Dataset',
            name: name,
            description: description,
            distribution: distribution,
            creator: creator,
            citation: 'URL',
            keywords: [''],
            isAccessibleForFree: true,
            license: 'https://creativecommons.org/publicdomain/zero/1.0/',
        */
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
        duration: '', // PT1H2M3 (ISO8601形式。1時間2分3秒間)
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
        dataFeedElement: [{
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
        }],
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
    //constructor(options) { this.options = options; this.options['@context'] = 'https://schema.org/'; }
    constructor(options) { this.options = {'@context':'https://schema.org/', ...options}; }
    get Options() { return this.options; }
    get Mime() { return 'application/ld+json'; }
    generate() { return JSON.stringify(this.Options); }
}
class SchemaOrgParameterError extends ExtensibleCustomError {}
/*
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
*/
