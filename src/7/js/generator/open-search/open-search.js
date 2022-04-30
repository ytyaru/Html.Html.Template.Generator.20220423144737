class OpenSearch { // https://developer.mozilla.org/ja/docs/Web/OpenSearch
    constructor(shortName, url='opensearch.xml') {
        this.shortName = shortName
        this.url = url // opensearch.xmlのURL
    }
    get Link() { return `<link rel="search" href="${this.url}" title="${this.shortName}" type="application/opensearchdescription+xml">`; }
    #urlToMime(url) {
        const ext = options.iconUrl.toLowerCase().split('.')[-1]
        switch(ext) {
            case 'ico': return 'image/x-icon'
            case 'png': return 'image/png'
            case 'jpg':
            case 'jpeg': return 'image/png'
            default: throw 'URLの拡張子はico,png,jpg,jpegのいずれかであるべきです。';
        }
    }
    generate() { // shortName:16字以内、description:1024字以内
        for (const key of ['shortName', 'queryUrl']) {
            if (!options.hasOwnProperty(key)) { throw `引数optionsのキー ${key} は必須です。`; }
        }
        const xml = []
        xml.push(`<OpenSearchDescription xmlns="http://a9.com/-/spec/opensearch/1.1/" xmlns:moz="http://www.mozilla.org/2006/browser/search/">`)
        xml.push(`<ShortName>${(options.shortName) ? options.shortName : this.shortName}</ShortName>`)
        xml.push(`<InputEncoding>UTF-8</InputEncoding>`)
        if (options.description) { xml.push(`<Description>${options.description}</Description>`); }
        if (options.iconUrl) { xml.push(`<Image width="16" height="16" type="${this.#urlToMime(options.iconUrl)}">${options.iconUrl}</Image>`); }
        xml.push(`<Url method="get" template="${options.queryUrl}" type="text/html"/>`) // https://qiita.com/search?q={searchTerms}
        if (options.suggestUrl) { xml.push(`<Url method="get" template="${options.suggestUrl}" type="text/html"/>`); } // https://qiita.com/search_suggest?q={searchTerms}
        if (options.siteUrl) { xml.push(`<moz:SearchForm>${options.siteUrl}</moz:SearchForm>`); }
        xml.push(`<Url rel="self" template="${this.url}" type="application/opensearchdescription+xml" />`)
        xml.push(`</OpenSearchDescription>`)
        return xml.join('')
    }
}
