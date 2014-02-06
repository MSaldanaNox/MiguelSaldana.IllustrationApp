function erase() {
    var toDelete = document.getElementById("sheet");
    var img = toDelete.getContext('2d');
    var m = confirm("Clear canvas of current work?");
    if (m) {
        img.clearRect(0, 0, toDelete.width, toDelete.height);
    }
}

function save() {
	var dataURL = document.getElementById('sheet').toDataURL();
	var hiddenField = document.getElementById('hidden_image_field').value;
	hiddenField = dataURL;
	var csrftoken = getCookie('csrftoken');
	$.ajax({
			beforeSend: function(xhr, settings) {
		            xhr.setRequestHeader("X-CSRFToken", csrftoken);
		    },
			type: "POST",
			url: "/saveImage",
			data: { 
			   imgBase64: dataURL
			}
//		}).done(function(o) {
//			var toSave = o;
//		    var imgType = "image/png";
//		    var imgDownload = "image/octet-stream";
//		    document.location.href = toSave.replace(imgType, imgDownload);
		});
}

function load() {
	console.log('SO');
	var canvas = document.getElementById('sheet');
	var ctx = canvas.getContext('2d');
    var reader = new FileReader();
    reader.onload = function(event){
        var img = new Image();
        img.onload = function(){
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img,0,0);
        }
        img.src = event.target.result;
    }
    reader.readAsDataURL(e.target.files[0]);
}