class Sitemap { // 全URL網羅。入力値をどうするか。ファイルシステムで解析したいがJSでは無理。TSVファイルにするか。URL,更新日時
    static get Xml() { return SitemapXml(); } 
    static get Txt() { return SitemapTxt(); } 
}
class SitemapXml {
    generate(tsv) {
        const xml = []
        xml.push('<?xml version="1.0" encoding="UTF-8"?>')
        xml.push('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">')
        xml.push('<url>')
        for(const line of tsv.split('\n')) {
            const [url, lastMod, changefreq, priority] = line.split('\t')
            if (!url) { continue; }
            xml.push(`<loc>${url}</loc>`)
            if (lastMod) { xml.push(`<lastmod>${lastMod}</lastmod>`); }
            if (changefreq && includes()) { xml.push(`<changefreq>${changefreq}</changefreq>`); }
            if (priority) { xml.push(`<priority>${priority}</priority>`); }
        }
        xml.push('</url>')
        xml.push('</urlset> ')
        return xml.join('')
    }
}
class SitemapTxt {
    generate(tsv) {
        const txt = []
        for(const line of tsv.split('\n')) {
            const [url, lastMod, changefreq, priority] = line.split('\t')
            if (!url) { continue; }
            txt.push(url)
        }
        return txt.join('')
    }
}

