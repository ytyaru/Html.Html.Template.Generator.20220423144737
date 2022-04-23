window.addEventListener('DOMContentLoaded', () => {
    setDefaultByOs();
    setCaret();
    document.getElementById('help').addEventListener('click', (e)=>{
        document.getElementById('help-dialog').showModal();
    });
    document.getElementById('help-dialog').addEventListener('open', (e)=>{
        document.getElementById('close-help-dialog').focus();
    });
    document.getElementById('help-dialog').addEventListener('close', (e)=>{
        document.getElementById('content').focus();
    });
    document.getElementById('download').addEventListener('click', (e)=>{ download(); });
    document.getElementById('copy').addEventListener('click', (e)=>{ copy(); });
    document.getElementById('content').addEventListener('keydown', (e)=>{
             if (e.code == 'Enter' && e.ctrlKey) { download(); }
        else if (e.code == 'Enter' && e.shiftKey) { copy(); }
        else if (e.code == 'Tab') { document.getElementById('help').focus(); e.preventDefault(); }
    });
    document.getElementById('close-help-dialog').addEventListener('keydown', (e)=>{
        if (e.code == 'Tab') { e.preventDefault(); }
    });
});
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

