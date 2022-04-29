class Feed { // 全URL網羅。入力値をどうするか。ファイルシステムで解析したいがJSでは無理。TSVファイルにするか。URL,更新日時
    static get Atom() { return FeedAtom(); } 
}
class FeedAtom {
    static generate(tsv) {
        const atom = []
        atom.push('<?xml version="1.0"?>')
        atom.push('<feed xmlns="http://www.w3.org/2005/Atom" xmlns:g="http://base.google.com/ns/1.0">')
        atom.push(`<link rel="self" type="application/atom+xml" href="${selfUrl}" />`) // 必須
        // WebSub/PubSubHubBub
        atom.push('<link rel="hub" href="https://pubsubhubbub.appspot.com/"/>')
        atom.push('<link rel="hub" href="https://pubsubhubbub.superfeedr.com"/>')
        atom.push('<link rel="hub" href="https://switchboard.p3k.io/"/>')
        atom.push('<link rel="hub" href="http://phubb.cweiske.de/hub.php"/>')
        atom.push(`<author><name>${author}</name></author>`) // 必須
        atom.push(`<title>${title}</title>`) // 必須
        atom.push(`<updated>${updated}</updated>`) // 必須
        // atom.push(`<link href="${siteUrl}" rel="alternate" type="text/html" />`)
        atom.push('<entry>')
        for(const line of tsv.split('\n')) {
            const [url, title, summary, published, updated] = line.split('\t')
            if (!url) { throw 'URLは必須です。'; }
            if (!title) { throw 'titleは必須です。'; }
            if (!summary) { throw 'summaryは必須です。'; }
            if (!published) { throw 'publishedは必須です。'; }
            if (!updated) { updated = published; }
            atom.push(`<id>${url}</id>`) // 必須
            atom.push(`<link rel="alternate" type="text/html" href="${url}" />`) // 必須（link rel="alternate" があれば代替可能）
            atom.push(`<published>${published}</published>`) // 任意
            atom.push(`<updated>${updated}</updated>`) // 必須
            atom.push(`<title>${title}</title>`) // 必須
            //atom.push(`<content src="${url}"></content>`) // 必須（link rel="alternate" があれば代替可能）
            //atom.push(`<content>${content}</content>`) // 必須（link rel="alternate" があれば代替可能）
            atom.push('<summary>${summary}</summary>') // 任意
        }
        atom.push('</entry>')
        atom.push('</feed>')
        return atom.join('')
    }
}
