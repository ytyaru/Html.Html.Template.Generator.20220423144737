class Htpl { // Html + Tpl(Template)
    static get Meta() { return Meta; }
    static get OpenGraph() { return OpenGraphNamespace; }
    static get SchemaOrg() { return SchemaOrg; }
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

