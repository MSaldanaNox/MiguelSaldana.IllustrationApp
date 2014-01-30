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
    var imgType = "image/PNG";
    var imgDownload = "image/octet-stream";
    var img = toSave.toDataURL(imgType);
    window.open(img, "toDataUrl() image", "width=500, height=500");
    content.Headers.Add("Content-Disposition", "attachment; filename=export.csv");
    document.location.href = img.replace(imgType, imgDownload);
//    Canvas2Image.saveAsJPEG(toSave, true);
}