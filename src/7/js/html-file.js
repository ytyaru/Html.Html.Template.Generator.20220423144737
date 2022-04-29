class HtmlFile extends TextFile {
    static download(blob, name=null) {
        super.download(blob, (name) ? name : 'index.html')
    }
}
