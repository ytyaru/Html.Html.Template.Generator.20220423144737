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
            this.#validate(key, options[key])
            if (options[key]) { html.push(Meta.#makeHtml(key, options[key])); }
        }
        html.push(this.#makeViewportHtml(options))
        return html.join('')
    }
    static #validateKey(key) {
        const EXPECTEDS = ['application-name', 'author', 'creator', 'publisher', 'description', 'generator', 'keywords', 'referrer', 'theme-color', 'color-scheme', 'robots', 'googlebot', 'slurp', 'viewport']
        if (!EXPECTEDS.includes(key)) { throw new Error(`meta要素のname属性値が不正です（${key}）。次のうちのいずれかであるべきです。\n${expecteds.join('\n')}`); }
    }
    static #validateValue(key, value, expecteds) {
        if (!expecteds) { return }
        if (!expecteds.includes(value)) { throw new Error(`${key}が不正値です。meta要素のname属性値が${key}のとき、content属性値は次のうちのいずれかであるべきです。\n${expecteds.join('\n')}`); }
    }
    static #getExpecteds(key) {
        switch (key) {
            case 'refferrer': return ['origin', 'no-referrer-when-downgrade', 'origin-when-crossorigin', 'same-origin', 'strict-origin', 'strict-origin-when-cross-origin', 'unsafe-URL']
            case 'robots':
            case 'googlebot':
            case 'slurp': return ['index', 'noindex', 'follow', 'nofollow', 'none', 'noodp', 'noarchive', 'nosnippet', 'noimageindex', 'nocache']
            case 'color-scheme': return ['normal', 'only light', 'light', 'dark', 'light dark', 'dark light']
            default: return null;
        }
    }
    static #validate(key, value) {
        this.#validateKey(key)
        this.#validateValue(key, value, this.#getExpecteds(key));
    }
    static #makeHtml(name, content) { return `<meta name="${name}" content="${content}">`; }
    static #makeViewportHtml(options) {
        if (options.hasOwnProperty('viewport')) {
            switch (options['viewport'].toLowerCase()) {
                case '1':
                case 'no-scalable':
                    return '<meta name="viewport" content="width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no">'
                case 'default':
                case 'simple':
                default:
                    return '<meta name="viewport" content="width=device-width, initial-scale=1">'
            }
        } else { return '<meta name="viewport" content="width=device-width, initial-scale=1">'; }
    }
}

