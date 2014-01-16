function erase() {
    var toDelete = document.getElementById("sheet");
    var img = toDelete.getContext('2d');
    var m = confirm("Clear canvas of current work?");
    if (m) {
        console.log('DELETED');
        img.clearRect(0, 0, toDelete.width, toDelete.height);
    }
}

function save() {
    var toSave = document.getElementById("sheet");
    var img = toSave.toDataURL();
    window.open(img, "toDataUrl() image", "width=500, height=500");
}