class File {
    static download(blob, name) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        document.body.appendChild(a);
        a.download = name;
        a.href = url;
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
    }
}
