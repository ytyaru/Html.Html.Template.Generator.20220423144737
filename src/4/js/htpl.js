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
        this.options = options
    }
    get Options() { return this.options; }
    get Prefix() {
        const html = []
        for (const prefix of Object.keys(this.Options)) { html.push(this.#makePrefixValue(prefix)); }
        return html.join(' ')
    }
    #makePrefixValue(prefix='og') { return `${prefix}: https://ogp.me/ns/${('og' === prefix) ? '' : prefix}#`; }
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
/*
class OpenGraphAvGenerator extends OpenGraphGenerator {
    constructor(options) { super(options); }
    get Options() { return this.options; }
    get Prefix() {
        const html = []
        for (const prefix of Object.keys(this.Options)) { html.push(this.#makePrefixValue(prefix)); }
        return html.join(' ')
    }
    #makePrefixValue(prefix='og') { return `${prefix.split('.')[0]}: https://ogp.me/ns/${('og' === prefix) ? '' : prefix.split('.')[0]}#`; }
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
*/

/*
class OpenGraphOptions {
    get Options() { return {
        'og': {
            type: 'website', 
            title: 'タイトル',
            url: 'URL',
            image: '画像URL',
            description: '説明。',
            locale: 'ja_JP', // en_US
            localeAlternate: ['en_US'],
            siteName: 'サイト名',
            audio: '音声URL',
            video: '動画URL',
            determiner: '', // タイトルの前に表示される単語 a, an, the
    }}
}
class OpenGraphWebsiteOptions extends OpenGraphOptions {
    get Options() { return super.Options; }
}
class OpenGraphArticleOptions extends OpenGraphOptions {
    get Options() { return { ...super.Options,
        'article': {
            published_time: '2022-01-01T00:00:00+09:00',  // 公開日時
            modified_time: '2022-01-01T00:00:00+09:00',   // 最終更新日時
            expiration_time: '2022-01-01T00:00:00+09:00', // 有効期限
            author: '著者名',
            section: '上位のセクション名',
            tag: ['tag1', 'tag2'],
        }
    }}
}
*/
/*
class OpenGraph {
    constructor(type='website') {
        this.type = type
    }
    get Options() { return {
        'og': {
            type: 'website', 
            title: 'タイトル',
            url: 'URL',
            image: '画像URL',
            description: '説明。',
            locale: 'ja_JP', // en_US
            localeAlternate: ['en_US'],
            siteName: 'サイト名',
            audio: '音声URL',
            video: '動画URL',
            determiner: '', // タイトルの前に表示される単語 a, an, the
        },
        'website': {},
        'article': {
            published_time: '2022-01-01T00:00:00+09:00',  // 公開日時
            modified_time: '2022-01-01T00:00:00+09:00',   // 最終更新日時
            expiration_time: '2022-01-01T00:00:00+09:00', // 有効期限
            author: '著者名',
            section: '上位のセクション名',
            tag: ['tag1', 'tag2'],
        },
        'book': {
            author: ['著者URL'],
            isbn: 'ISBN',
            release_date: '2022-01-01T00:00:00+09:00',
            tag: ['tag1', 'tag2'],
        },
        'profile': {
            first_name: '',
            last_name: '',
            username: '',
            gender: 'male', // male, female
        }
     }}
    get Prefix() { return 'og'; }
    get Type() { }
    get DefaultOptions() { return {
        type: 'website',
        title: 'タイトル',
        url: 'URL',
        image: '画像URL',
        description: '説明。',
        locale: 'ja_JP', // en_US
        localeAlternate: ['en_US'],
        siteName: 'サイト名',
        audio: '音声URL',
        video: '動画URL',
        determiner: '', // タイトルの前に表示される単語 a, an, the
    }}
    generate(options=null, extOpts=null) {
        const html = this.#generateOptions('og', options)
        if (extOpts) { return html.concat(this.#generateOptions(this.type, extOpts)).join(''); }
        else { return html.join(''); }
    }
    #generateOptions(prefix, options) {
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
    makePrefix() { return this.#makePrefixValue() + ' ' + this.#makePrefixValue(this.type); }
    #makePrefixValue(prefix='og') { return `${prefix}: https://ogp.me/ns/${('og' === prefix) ? '' : prefix}#`; }
    //makePrefix(prefix='og') { const p = ('og' === prefix) ? '' | prefix; return `${prefix}: https://ogp.me/ns/${p}#`; }
    makeHtml(property, content) { return `<meta property="${property}" content="${content}">`; }
}
*/
/*
class OpenGraphOption {
    get Prefix() { return 'og'; }
    get Options() { return {
        type: 'website',
        title: 'タイトル',
        url: 'URL',
        image: '画像URL',
        description: '説明。',
        locale: 'ja_JP', // en_US
        localeAlternate: ['en_US'],
        siteName: 'サイト名',
        audio: '音声URL',
        video: '動画URL',
        determiner: '', // タイトルの前に表示される単語 a, an, the
    }}
}
class extends OpenGraphOption {
    get Prefix() { return 'og'; }
    get Options() { return {
        type: 'website',
        title: 'タイトル',
        url: 'URL',
        image: '画像URL',
        description: '説明。',
        locale: 'ja_JP', // en_US
        localeAlternate: ['en_US'],
        siteName: 'サイト名',
        audio: '音声URL',
        video: '動画URL',
        determiner: '', // タイトルの前に表示される単語 a, an, the
    }}
}
*/

/*
class OpenGraph {
    
}
class OpenGraph {
    static #PREFIX = 'og'
    static get WebSite() { return OpenGraphWebSite; }
    static get Article() { return OpenGraphArticle; }
    static get Book() { return OpenGraphBook; }
    static get Profile() { return OpenGraphProfile; }
    static get VideoMovie() { return OpenGraphVideoMovie; }
    static get VideoEpisode() { return OpenGraphVideoEpisode; }
    static get VideoTvShow() { return OpenGraphTvShow; }
    static get VideoOther() { return OpenGraphVideoOther; }
    static get MusicSong() { return OpenGraphMusicSong; }
    static get MusicAlbum() { return OpenGraphMusicAlbum; }
    static get MusicPlayList() { return OpenGraphMusicPlayList; }
    static get MusicRadioStation() { return OpenGraphMusicRadioStation; }
    static get DefaultOptions() { return {
        type: 'website',
        title: 'タイトル',
        url: 'URL',
        image: '画像URL',
        description: '説明。',
        locale: 'ja_JP', // en_US
        localeAlternate: ['en_US'],
        siteName: 'サイト名',
        audio: '音声URL',
        video: '動画URL',
        determiner: '', // タイトルの前に表示される単語 a, an, the
    }}
    static generate(type=null) {
        
    }
    static generate(options=null, extOpts=null) {
        if (!options) { options = this.DefaultOptions(); }
        if (!Object.hasOwnProperty('type')) { options.type = 'website'; }
        const html = []
        for (const key of Object.keys(options)) {
                 if (!options[key]) { continue; }   // 値がない
            else if (Array.isArray(options[key])) { // 配列である
                for (const value of options[key]) {
                    html.push(Meta.#makeHtml('${this.#PREFIX}:${key}', value));
                }
            }
            else { html.push(Meta.#makeHtml('${this.#PREFIX}:${key}', options[key])); }
            
        }
        return html.join('')
    }
    static #makeHtml(property, content) { return `<meta property="${name}" content="${content}">`; }
    static #makeNamespace(prefix='og') { return `${prefix}: https://ogp.me/ns/${('og'===prefix) ? '' | prefix}#`; }
    //static #makeNamespace(name='og', type='') { return `${name}: https://ogp.me/ns/${('og'===name) ? '' | type}#`; }
    static #makeHead(prefixes=null) {
        const PREFIXES = ['website', 'article', 'book', 'profile', 'video', 'music']
        if (!prefixes) { prefixes = ['og', 'website']; }
        if (!prefixes.includes('og')) { prefixes.insert(0, 'og'); }
        const codes = []
        for (const prefix of prefixes) { codes.push(this.#makeNamespace(prefix)); }
        return prefixes.join(' ');
        //return `<head prefix="${prefixes.join(' ')}"></head>`
    }
}
class OpenGraphCommon { // OpenGraphの共通部分
    get Prefix() { return 'og'; }
    get DefaultOptions() { return {
        type: 'website',
        title: 'タイトル',
        url: 'URL',
        image: '画像URL',
        description: '説明。',
        locale: 'ja_JP', // en_US
        localeAlternate: ['en_US'],
        siteName: 'サイト名',
        audio: '音声URL',
        video: '動画URL',
        determiner: '', // タイトルの前に表示される単語 a, an, the
    }}
    generate(options=null) {
        if ('og' === this.Prefix && !Object.hasOwnProperty('type')) { options.type = 'website'; }
        const html = []
        for (const key of Object.keys(options)) {
                 if (!options[key]) { continue; }   // 値がない
            else if (Array.isArray(options[key])) { // 配列である
                for (const value of options[key]) {
                    html.push(Meta.#makeHtml('${this.#PREFIX}:${key}', value));
                }
            }
            else { html.push(Meta.#makeHtml('${this.#PREFIX}:${key}', options[key])); }
        }
        return html.join('')
    }
    makePrefix(prefix='og') { return `${prefix}: https://ogp.me/ns/${('og'===prefix) ? '' | prefix}#`; }
    makeHtml(property, content) { return `<meta property="${name}" content="${content}">`; }
}
class OpenGraphWebSite extends OpenGraphCommon { get Prefix() { return 'website'; } }
class OpenGraphArticle extends OpenGraphCommon {
    get Prefix() { return 'article'; }
    get DefaultOptions() { return {
        published_time: '2022-01-01T00:00:00+09:00',  // 公開日時
        modified_time: '2022-01-01T00:00:00+09:00',   // 最終更新日時
        expiration_time: '2022-01-01T00:00:00+09:00', // 有効期限
        author: '著者名',
        section: '上位のセクション名',
        tag: ['tag1', 'tag2'],
    }}
}
*/

