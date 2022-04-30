class Manifest { // JSON。PWAアプリ用
    constructor() {
        this.options = { 
            name: '完全名', // 必須
            short_name: '略名', // 必須
            icons: [{ // 必須。Chromiumは少なくとも192x192, 512x512が必要 // https://techracho.bpsinc.jp/hachi8833/2021_06_24/108697 // https://zenn.dev/pacchiy/articles/e4dcd7bd29d387
                src: 'favicon.svg',
                sizes: 'any',
                type: 'image/svg+xml',
            },{
                src: 'img/app-icon/192x192.png',   // https://a.png
                sizes: '192x192',  // width x height
                type: 'image/png',  // MIME type
                purpose: 'any maskable', // 透過部分が白背景にならず、アイコンですべて埋まるようにトリミングされる https://web.dev/maskable-icon/
            },{
                src: 'img/app-icon/512x512.png',
                sizes: '512x512',
                type: 'image/png',
                purpose: 'any maskable',
            }],
            //prefer_related_applications: true,
            related_applications: [{
                platform: 'webapp',
                url: '',
                id: '',
            }],
            description: '',
            background_color: '',
            lang: 'ja-JP',
            display: 'fullscreen', // fullscreen,standalone,minimal-ui,browser
            display_override: ['window-controls-overlay'], // 
            iarc_rating_id: '',
            orientation: '',
            prefer_related_applications: '',
            screenshots: [{
                src: "screenshot1.webp",
                sizes: "1280x720",
                type: "image/webp",
                platform: "wide", // wide,narrow,android,chromeos,ios,kaios,macos,windows,xbox,chrome_web_store,play,iTunes,microsoft-inbox,microsoft-store
                label: "Homescreen of Awesome App"
            }],
            shortcuts: [{ // https://web.dev/app-shortcuts/  36x36、48x48、72x72、96x96、144x144、192x192
                name: "Today's agenda",
                short_name: '',
                url: "/today",
                description: "List of events planned for today",
                icons: [{
                    src: 'icon.svg',
                    sizes: 'any',
                },{
                    src: 'icon.png',
                    sizes: '192x192',
                }],
            }],
            start_url: '',
            theme_color: '',
        }
    }
    get Options() { return this.options; }
    get FileName() { return 'manifest.json'; }
    get MimeType() { return 'application/json'; }
    // get MimeType() { return 'application/manifest+json'; } // 拡張子.webmanifest
    get Link() { return `<link rel="manifest" href="${this.FileName}">`; }
    get IconLinks() {
        const html = []
        html.push(`<link rel="icon" sizes="16x16" href="/favicon.ico" />`) // 16,32,48
        html.push(`<link rel="icon" type="image/svg+xml" href="/favicon.svg">`)
        html.push(`<link rel="apple-touch-icon" href="/apple-touch-icon.png">`) // 180x180
    }
    generate() { return JSON.stringify(this.Options); }
}
