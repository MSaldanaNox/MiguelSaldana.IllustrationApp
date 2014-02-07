var canvas, context, flag = false,
    prevX = 0,
    currX = 0,
    prevY = 0,
    currY = 0,
    dot_flag = false;

var lineColor = "blue",
    lineWidth = 1;

function init() {
    canvas = document.getElementById('sheet');
    canvas.width = 500;
    canvas.height = 500;
    context = canvas.getContext("2d");
    width = canvas.width;
    height = canvas.height;
    var setDefault = document.getElementById('color');

    var imageLoader = document.getElementById('imageLoader');
    imageLoader.addEventListener('change', load, false);
    
    canvas.addEventListener("mousemove", function (e) {
        findxy('move', e)
    }, false);
    canvas.addEventListener("mousedown", function (e) {
        findxy('down', e)
    }, false);
    canvas.addEventListener("mouseup", function (e) {
        findxy('up', e)
    }, false);
    canvas.addEventListener("mouseout", function (e) {
        findxy('out', e)
    }, false);
}

function color(obj) {
    var toHex = obj.value;
    var colorDiv = document.getElementById('color');
    while(toHex.length < 6)
    {
        toHex += "0";
    }
    
    lineColor = "#"+toHex;
    colorDiv.style.backgroundColor = "#"+toHex;
    console.log(toHex)
}

function draw() {
    context.beginPath();
    context.moveTo(prevX, prevY);
    context.lineTo(currX, currY);
    context.strokeStyle = lineColor;
    context.lineWidth = lineWidth;
    context.stroke();
    context.closePath();
}



function findxy(res, e) {
    if (res == 'down') {
        prevX = currX;
        prevY = currY;
        currX = e.pageX - canvas.offsetLeft;
        currY = e.pageY - canvas.offsetTop;

        flag = true;
        dot_flag = true;
        if (dot_flag) {
            context.beginPath();
            context.fillStyle = lineColor;
            context.fillRect(currX, currY, lineWidth, lineWidth);
            context.closePath();
            dot_flag = false;
        }
    }
    if (res == 'up' || res == "out") {
        flag = false;
    }
    if (res == 'move') {
        if (flag) {
            prevX = currX;
            prevY = currY;
            currX = (e.pageX - canvas.offsetLeft);
            currY = (e.pageY - canvas.offsetTop);
            draw();
        }
    }
    
}

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
			}.done(function(){
				console.log('logged');
			})
//		}).done(function(o) {
//			var toSave = o;
//		    var imgType = "image/png";
//		    var imgDownload = "image/octet-stream";
//		    document.location.href = toSave.replace(imgType, imgDownload);
		});
}

function load(e) {
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