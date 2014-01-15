function erase() {
    var m = confirm("Clear canvas of current work?");
    if (m) {
        ctx.clearRect(0, 0, w, h);
        document.getElementById("canvasimg").style.display = "none";
    }
}

function save() {
    var toSave = document.getElementById("sheet");
    var img = canvas.toDataURL();
    window.open(img, "toDataUrl() image", "width=500, height=500");
}