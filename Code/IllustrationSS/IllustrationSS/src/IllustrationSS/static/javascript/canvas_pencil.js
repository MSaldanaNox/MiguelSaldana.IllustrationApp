var canvas, context, container, activeLayer, currentIndex, history, redoStack, ppts, mouse, last_mouse, flag = false,
    prevX = 0,
    currX = 0,
    prevY = 0,
    currY = 0,
    dot_flag = false;

var lineColor = "blue",
    lineWidth = 5;

function init() {
    canvas = document.getElementById("sheet");
    
    history = new Array();
    redoStack = new Array();
    history.push(document.getElementById('sheet').toDataURL());
    activeLayer = canvas;
    currentIndex = 0;
    canvas.width = 500;
    canvas.height = 500;
    context = canvas.getContext("2d");
    width = canvas.width;
    height = canvas.height;
    
    container = new CanvasLayers.Container(canvas, false);
    container.onRender = function(layer, rect, con) {
        con.fillStyle = '#FFF';
        con.fillRect(0, 0, layer.getWidth(), layer.getHeight());
    }
    
    activeLayer = new CanvasLayers.Layer(0, 0, width, height);
    container.getChildren().add(activeLayer);

    activeLayer.onRender = function(layer, rect, con) {
        con.fillStyle = '#454545';
        con.fillRect(0, 0, layer.getWidth(), layer.getHeight());
    }
    
    var setDefault = document.getElementById('color');

    var imageLoader = document.getElementById('imageLoader');
    imageLoader.addEventListener('change', load, false);
    
    ppts = [];
    mouse = {x: 0, y: 0};
	last_mouse = {x: 0, y: 0};
    
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
    container.redraw();
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
}

function pencil() {
    context.beginPath();
    context.moveTo(prevX, prevY);
    context.lineTo(currX, currY);
    context.strokeStyle = lineColor;
    context.lineWidth = lineWidth;
    context.closePath();
    context.stroke();
    
    context.beginPath();
    context.moveTo(ppts[0].x, ppts[0].y);
     
    for (var i = 1; i < ppts.length - 2; i++) {
        var c = (ppts[i].x + ppts[i + 1].x) / 2;
        var d = (ppts[i].y + ppts[i + 1].y) / 2;
     
        context.quadraticCurveTo(ppts[i].x, ppts[i].y, c, d);
    }
     
    // For the last 2 points
    context.quadraticCurveTo(
        ppts[i].x,
        ppts[i].y,
        ppts[i + 1].x,
        ppts[i + 1].y
    );
    context.stroke();
}

function brush() {
    context.beginPath();
    var circleRadius = lineWidth/2;
    context.fillStyle = lineColor;
    context.arc(currX-circleRadius,currY-circleRadius,circleRadius,0,2*Math.PI);
    context.fill();
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
//            context.fillRect(currX, currY, lineWidth, lineWidth);
            var circleRadius = lineWidth/2;
            context.arc(currX-circleRadius,currY-circleRadius,circleRadius,0,2*Math.PI);
            context.fill();
            context.closePath();
            dot_flag = false;
        }
    }
    if (res == 'up' || res == "out") {
        flag = false;
        if(res == 'up')
        	saveInstance();
    }
    if (res == 'move') {
        if (flag) {
            prevX = currX;
            prevY = currY;
            currX = (e.pageX - canvas.offsetLeft);
            currY = (e.pageY - canvas.offsetTop);
            brush();
        }
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
			}
		});
}

function load(e) {
    var reader = new FileReader();
    reader.onload = function(event){
        var img = new Image();
        img.onload = function(){
            canvas.width = img.width;
            canvas.height = img.height;
            context.drawImage(img,0,0);
            saveInstance();
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

function saveInstance()
{
	history.push(document.getElementById('sheet').toDataURL());
	if(redoStack.length > 0)
	{
		redoStack.splice(0,redoStack.length);
	}
}

function undo()
{
	if(history.length > 1)
	{
		var toRedo = history.pop();
		var img = new Image();
		img.src = history[history.length-1];
		canvas.width = canvas.width;
		context.drawImage(img, 0,0);
		redoStack.push(toRedo);
	}
}

function redo()
{
	if(redoStack.length > 0)
	{
		var toHistory = redoStack.pop();
		var img = new Image();
		img.src = toHistory;
		canvas.width = canvas.width;
		context.drawImage(img, 0,0);
		history.push(toHistory);
	}
}

function addLayer()	{
	var layerToAdd = new CanvasLayers.Layer(0,0,canvas.width,canvas.height);
	container.getChildren().add(layerToAdd);
	
//	var num = Math.floor((Math.random()*999999));
//	var hex = ''+num;
//	while(hex.length<6)
//	{
//		hex = '0'+hex;
//	}
//	context.fillStyle = hex;
//    context.fillRect(0, 0, layerToAdd.getWidth(), layerToAdd.getHeight());
	activeLayer = layerToAdd;
	currentIndex = container.getChildren().list.length-1;
	console.log(container.getChildren().list[currentIndex]);
	saveInstance();
}

function deleteLayer() {
	var layerCollection = container.getChildren();
	var layerArray = layerCollection.list;
	
	if(layerArray.length > 0)
	{
		console.log(layerCollection);
		console.log(layerArray);
		console.log(currentIndex)
		if(currentIndex!=0)
			currentIndex = currentIndex-1;
		layerArray[currentIndex].close();
		saveInstance();
	}
	container.redraw();
}

function moveLayerUp()
{
	var layerCollection = container.getChildren();
	var layerArray = layerCollection.list;
	
	if(currentIndex!=layerArray.length-1)
	{
		var temp = layerArray[currentIndex];
		temp.hide();
		layerArray[currentIndex] = layerArray[currentIndex+1];
		layerArray[currentIndex].hide();
		layerArray[currentIndex+1] = temp;
		layerArray[currentIndex+1].show();
		layerArray[currentIndex].show();
		container.redraw();
		saveInstance();
	}
}

function moveLayerDown()
{
	var layerCollection = container.getChildren();
	var layerArray = layerCollection.list;
	
	if(currentIndex!=0)
	{
		var temp = layerArray[currentIndex];
		temp.hide();
		layerArray[currentIndex] = layerArray[currentIndex-1];
		layerArray[currentIndex].hide();
		layerArray[currentIndex-1] = temp;
		layerArray[currentIndex-1].show();
		layerArray[currentIndex].show();
		container.redraw();
		saveInstance();
	}
}

