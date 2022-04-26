window.addEventListener('DOMContentLoaded', () => {
    setDefaultByOs();
    setCaret();
    // ボタン
    document.getElementById('help').addEventListener('click', (e)=>{
        document.getElementById('help-dialog').showModal();
    });
    document.getElementById('download').addEventListener('click', (e)=>{ download(); });
    document.getElementById('copy').addEventListener('click', (e)=>{ copy(); });
    for (const ui of document.querySelectorAll('input, textarea, select')) {
        // 入力
        ui.addEventListener('input', (e)=>{
            document.getElementById('content').value = generate();
        });
        // ショートカットキー
        ui.addEventListener('keydown', (e)=>{
             if (e.code == 'Enter' && e.ctrlKey) { download(); }
        else if (e.code == 'Enter' && e.shiftKey) { copy(); }
    });
    document.getElementById('expand-file-details').addEventListener('change', (e)=>{
        document.getElementById('details-file').style.setProperty('visibility', (e.target.checked) ? 'visible' : 'hidden')
    });
    /*
    document.getElementById('expand-file-details').addEventListener('click', (e)=>{
        console.log(e.target.dataset.checked)
        document.getElementById('details-file').style.setProperty('visibility', ('true' === e.target.dataset.checked.toLowerCase()) ? 'visible' : 'hidden')
        e.target.dataset.checked = ('true' === e.target.dataset.checked.toLowerCase()) ? 'false' : 'true';
        console.log(e.target.dataset.checked)
    });
    */
    /*
    document.getElementById('expand-file-details').addEventListener('click', (e)=>{
        console.log(window.getComputedStyle(e.target).getPropertyValue('visibility'))
        e.target.style.setProperty('visibility', 
                       ('hidden' === window.getComputedStyle(e.target).getPropertyValue('visibility')) ? 'visible' : 'hidden')
    });
    */
    }
    // フォーカス制御
    document.getElementById('help').addEventListener('keydown', (e)=>{
        if (e.code == 'Tab' && e.shiftKey) {document.getElementById('author').focus(); e.preventDefault();}
    });
    document.getElementById('author').addEventListener('keydown', (e)=>{
        if (e.code == 'Tab') {
            if (e.shiftKey) {document.getElementById('description').focus();}
            else            {document.getElementById('help').focus();}
            e.preventDefault();
        }
    });
    document.getElementById('close-help-dialog').addEventListener('keydown', (e)=>{
        if (e.code == 'Tab') { e.preventDefault(); }
    });
    document.getElementById('help-dialog').addEventListener('open', (e)=>{
        document.getElementById('close-help-dialog').focus();
    });
    document.getElementById('help-dialog').addEventListener('close', (e)=>{
        document.getElementById('catch-copy').focus();
    });
    document.getElementById('catch-copy').dispatchEvent(new Event('input'));
});
function generate() {
    // meta
    //function meta(name, content) { return `<meta name="${name}" content="${content}">`; }
    const catchCopy = document.getElementById('catch-copy').value;
    const siteName = document.getElementById('site-name').value;
    const description = document.getElementById('description').value;
    const author = document.getElementById('author').value;
    // Open Graph
    const og = Htpl.OpenGraph.Article;
    og.Options.og.siteName = siteName
    og.Options.og.title = `${catchCopy} - ${siteName}`
    og.Options.og.description = description
    og.Options.article.author = author
    /*
    const og = Htpl.OpenGraph.Music.Song;
    og.Options.og.siteName = siteName
    og.Options.og.title = `${catchCopy} - ${siteName}`
    og.Options.og.description = description
    og.Options.music.musician = author
    */
    /*
    const og = Htpl.OpenGraph.Video.Movie;
    og.Options.og.siteName = siteName
    og.Options.og.title = `${catchCopy} - ${siteName}`
    og.Options.og.description = description
    og.Options.video.actor = author
    */
    /*
    const og = new OpenGraph('article');
    const options = og.Options['og']
    options.siteName = siteName
    options.title = `${catchCopy} - ${siteName}`
    options.description = description
    const article = og.Options['article']
    article.author = author
    */
    // Generate
    html = []
    html.push('<!DOCTYPE html>')
    html.push('<html>')
    //html.push('<head>')
    //html.push(`<head prefix="${og.makePrefix()}">`)
    html.push(`<head prefix="${og.Prefix}">`)
    html.push('<meta charset="UTF-8">')
    html.push(`<title>${catchCopy} - ${siteName}</title>`)
    //html.push(meta('description', description))
    //html.push(meta('author', author))
    html.push(Htpl.Meta.generate({
        description: description,
        author: author,
    }))
    //html.push(og.generate(options, article))
    html.push(og.generate())
    html.push('</head>')
    html.push('<body>')
    html.push('</body>')
    html.push('</html>')
    //return html.join('');
    return prettier.format(html.join(''), {
        parser: "html",
        plugins: prettierPlugins,
        filepath: document.getElementById('name').value,
        endOfLine: document.getElementById('newline').value.replace('-','').toLowerCase(),
    });
}
function download() {
    HtmlFile.download(
        TextFile.createUtf8Blob(
            document.getElementById('content').value, 
            document.getElementById('newline').value,
            document.getElementById('bom').checked),
        document.getElementById('name').value);
}
function copy() {
    Clipboard.copy(
        TextFile.replaceNewLine(
            document.getElementById('content').value,
            document.getElementById('newline').value,
        )
    );
}
function setCaret() {
    const ta = document.getElementById('content');
    ta.setSelectionRange(ta.value.length, ta.value.length);
}
function setDefaultByOs() {
    // WindowsならCRLF、MacならCR、それ以外ならLF
    const options = document.getElementById('newline').options;
    const LF = 0;
    const CR = 1;
    const CRLF = 2;
    const ua = window.navigator.userAgent.toLowerCase();
    console.log(ua)
    if (ua.indexOf('windows nt') !== -1) { options[CRLF].selected = true; }
    else if (ua.indexOf('mac os x') !== -1) { options[CR].selected = true; } // MacOS
    else if (ua.indexOf('iphone') !== -1) { options[CR].selected = true; } // iOS
    else if (ua.indexOf('android') !== -1) { options[LF].selected = true; }
    // Linux,  CrOS = Chrome OS（Raspberry PI OS）、ゲーム機（PlayStation 5, PlayStation Vita, Nintendo WiiU, Nintendo Switch, Nintendo 3DS, Xbox）
    else { options[LF].selected = true; }

    // WindowsならBOM付き、それ以外はBOM無しをデフォルトにする。
    document.getElementById('bom').checked = ua.indexOf('windows nt') !== -1;
}

