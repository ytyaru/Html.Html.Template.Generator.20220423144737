class WebMention {
    constructor(me=null, domain=null, token=null) {
        this.me = me || 'https://twitter.com/ツイッターID'
        this.domain = domain || 'WebMensionユーザ名（サイトのドメイン名）'
        this.token = token || 'WebMensionからもらったAPIキー'
    }
    get Me() { return `<link rel="me" href="https://twitter.com/${this.me}">`; }
    get WebMension() { return `<link rel="webmention" href="https://webmention.io/${this.domain}/webmention">`; }
    get Pingback() { return `<link rel="pingback" href="https://webmention.io/${this.domain}/xmlrpc">`; }
    async generate() {
        const res = await fetch(`https://webmention.io/api/mentions.jf2?domain=${this.domain}&token=${this.token}`)
        const mension = await res.json();
        // ここでJSONを使ってHTMLを動的生成する。だれかどんなコメントをしたか。
        return this.#generateMension(resJson);
    }
    #generateMension(json) {
        return `WebMensionの情報から動的HTMLを生成する。`
    }
    /*
    generate() {
        fetch(`https://webmention.io/api/mentions.jf2?domain=${this.domain}&token=${this.token}`, {
            method: 'GET'    
        }).then(res => {
            if (res.ok) { return res.json(); }
            throw new Error('WebMentionの取得に失敗しました。');
        }).then(resJson => {
            console.debug('WebMentionの取得に成功しました。');
            console.debug(JSON.stringify(resJson));
            // ここでJSONを使ってHTMLを動的生成する。だれかどんなコメントをしたか。
            return this.#generateMension(resJson);
        })
        .catch(error => {
            console.error(error);
        })
    }
    */
}
