class Podcast { // https://support.google.com/podcast-publishers/answer/9476656?hl=ja
    constructor() {
        this.options = {
            title: '',
            rssUrl: '',
            siteUrl: '',
            author: '',
            email: '',
            description: '',
            image: '',
            items: []
        }
        this.title = null;
    }
    LinkOnHtml(title, url) { return `<link type="application/rss+xml" rel="alternate" title="${title}" href="${url}">`; }
    LinkOnRss(url) { return `<link>${url}</link>`; }
    ItemOptions() { return {
        title: '',
        description: '',
        pubDate: '',
        enclosure: {
            url: '', // https://a.mp3
            type: '', // MIME type (mp3, ogg, m4a, aac, wav) audio/mpeg
            length: '', // データサイズ（バイト）
        },
        duration: '', // 再生時間(hh:mm:ss, mm:ss, ssssss)
    }}
    #generateItem(options) { // https://support.google.com/podcast-publishers/answer/9889544
        const rss = []
        // 必須
        for (const key of ['title', 'url', 'type', 'length']) {
            if (options.hasOwnProperty(key)) { throw `引数optionsのキー ${key} は必須です。`; }
        }
        rss.push(`<item>`)
        rss.push(`<title>${options.title}</title>`)
        rss.push(`<enclosure url="${options.url}" type="${options.type}" length="${options.length}"/>`) // url: 音声ファイルURL, type: MIME type, length: ファイルサイズ（バイト）
        // 推奨
        if (options.hasOwnProperty('description')) { rss.push(`<description>${options.description}</description>`); }
        if (options.hasOwnProperty('pubDate')) { rss.push(`<pubDate>${options.pubDate}</pubDate>`); }
        if (options.hasOwnProperty('duration')) { rss.push(`<itunes:duration>${options.duration}</itunes:duration>`); }
        if (options.hasOwnProperty('isExplicit') && options.isExplicit) { rss.push(`<itunes:explicit>yes</itunes:explicit>`); } // 露骨表現あり
        if (options.hasOwnProperty('isBlock') && options.isBlock) { rss.push(`<itunes:block>yes</itunes:block>`); } // 削除
        // 他にもあるが省略（guid（podcastマネージャではguidでなくURLで識別するから）, itunes:new-feed-url（以前のフィードURLに301リダイレクトを仕込まねばならないから））
        rss.push(`</item>`)
        return rss.join('')
    }
    #generateCategory(category) {
        const CATEGORYES = [
            'Arts',
            'Business',
            'Comedy',
            'Education',
            'Games &amp; Hobbies',
            'Government &amp; Organizations',
            'Health',
            'Kids &amp; Family',
            'Music',
            'News &amp; Politics',
            'Religion &amp; Spirituality',
            'Science &amp; Medicine',
            'Society &amp; Culture',
            'Sports &amp; Recreation',
            'TV &amp; Film',
            'Technology',
        ]
        if (!CATEGORYES.includes(category)) { throw `引数categoryが不正値です。次のいずれかにしてください。\n${CATEGORYES.join('\n')}`;  }
        return `<itunes:category text="${category}"/>`
    }
    generate(options) {
        for (const key of ['title', 'email', 'author', 'description', 'image', 'siteUrl', 'items']) {
            if (options.hasOwnProperty(key)) { throw `引数optionsのキー ${key} は必須です。`; }
        }
        const rss = []
        rss.push(`<?xml version="1.0" encoding="UTF-8"?>`)
        rss.push(`<rss version="2.0" xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd">`)
        rss.push(`<channel>`)
        rss.push(`<title>${options.title}</title>`)
        rss.push(`<itunes:owner><itunes:email>${options.email}</itunes:email></itunes:owner>`)
        rss.push(`<itunes:author>${options.author}</itunes:author>`)
        rss.push(`<description>${options.description}</description>`)
        rss.push(`<itunes:image href="${options.image}"/>`)
        rss.push(`<link>${options.siteUrl}</link>`)
        rss.push(`<language>ja-jp</language>`)
        if (!options.hasOwnProperty('language')) { options.language = 'ja-jp'; }
        rss.push(`<language>${options.language}</language>`)
        if (options.hasOwnProperty('category')) { rss.push(`${this.#generateCategory(options.category)}`); }
        for (const item of options.items) {
            rss.push(this.#generateItem(item))
        }
        rss.push(`</channel>`)
        rss.push(`</rss>`)
        return rss.join('')
    }
}
