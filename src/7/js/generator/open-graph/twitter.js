class OpenGraphTwitter { // Open Graphと重複しない部分のみ
    static get Types() { return ['summary', 'summary_large_image', 'app', 'player']; }
    static #validType(type) {
        if (!this.Types.includes(type)) { throw `引数typeが不正値です。${TYPES.join(',')}のいずれかにしてください。`; }
    }
    static generate(card='summary_large_image', site=null, creator=null) { // site,creator=ツイッターID
        const html = []
        this.#validType(card)
        html.push(`<meta name="twitter:card" content="${card}" />`)
        if (site) { html.push(`<meta name="twitter:site" content="@${site}" />`); }
        if (creator) { html.push(`<meta name="twitter:creator" content="@${creator}" />`); }
        return html.join('')
    }
}

