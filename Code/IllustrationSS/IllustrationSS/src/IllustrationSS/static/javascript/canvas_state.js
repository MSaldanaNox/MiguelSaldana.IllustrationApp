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
//		  console.log('saved'); 
//		  // If you want the file to be visible in the browser 
//		  // - please modify the callback in javascript. All you
//		  // need is to return the url to the file, you just saved 
//		  // and than put the image in your browser.
		});
//    var toSave = document.getElementById("sheet");
//    var imgType = "image/jpeg";
//    var imgDownload = "image/octet-stream";
//    var img = toSave.toDataURL(imgType);
//    document.location.href = img.replace(imgType, imgDownload);
	
	
}

function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie != '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}