class Clipboard {
    static copy(value=null) {
        if (!value) { value = document.getElementById('content').value; }
        navigator.clipboard.writeText(value)
        .then(() => {
            console.log('クリップボードにコピーした。', value);
        })
        .catch(err => {
            console.error('クリップボードのコピーに失敗した。');
        });
    }
}

