class OpenGraphFacebook { // Open Graphと重複しない部分のみ
    static get Prefix() { return 'fb: http://ogp.me/ns/fb#'; }
    static generate(appId) { return `<meta property="fb:app_id" content="${appId}"; ?>" />`; }
}

