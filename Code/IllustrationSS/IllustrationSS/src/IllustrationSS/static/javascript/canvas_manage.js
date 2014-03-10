var canvas, context, container, activeLayer, currentIndex, history, redoStack, toolBox, currentTool, ppts, tmp_canvas, tmp_ctx, mouse, last_mouse, sketch, prevX = 0, currX = 0, prevY = 0, currY = 0, dot_flag = false;

var red, blue, green;
var hue, sat, val;
var trans;
var hex;

var lineColor, lineWidth = 1;

function init() {
	// Set up basic tools
	canvas = document.getElementById("canvas");
	toolBox = document.getElementById("toolbox");

	// Set up history functionality
	history = new Array();
	redoStack = new Array();
	history.push(document.getElementById('canvas').toDataURL());

	// Setting the currently active layer of app
	activeLayer = canvas;
	currentIndex = 0;

	// Setting up canvas
	sketch = document.querySelector('#content');
	var sketch_style = getComputedStyle(sketch);
	context = canvas.getContext("2d");
	width = canvas.width;
	height = canvas.height;

	// Setting up Layering functionality
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

	// Loading in Image
	var imageLoader = document.getElementById('imageLoader');
	imageLoader.addEventListener('change', load, false);

	// Setting color attributes
	// RGB
	document.getElementById('red').value = '0';
	document.getElementById('green').value = '0';
	document.getElementById('blue').value = '0';
	red = 0;
	blue = 0;
	green = 0;
	// HSV
	document.getElementById('hue').value = '0';
	hue = 0;
	document.getElementById('saturation').value = '0';
	sat = 0;
	document.getElementById('brightness').value = '0';
	val = 0;
	// Alpha
	document.getElementById('alpha').value = '100';
	trans = 1;
	// Hex code
	document.getElementById('colorHex').value = '000000';
	hex = '000000';

	// Adding on change event listeners
	// // RGB values
	// var red = document.getElementById('red');
	// red.addEventListener('change', rgbValues, false);
	// var blue = document.getElementById('blue');
	// red.addEventListener('change', rgbValues, false);
	// var green = document.getElementById('green');
	// red.addEventListener('', rgbValues, false);
	// // HSV values
	// var hue = document.getElementById('hue');
	// hue.addEventListener('change', hsvValues, false);
	// var saturation = document.getElementById('saturation');
	// saturation.addEventListener('change', hsvValues, false);
	// var brightness = document.getElementById('brightness');
	// brightness.addEventListener('change', hsvValues, false);
	// // Alpha Value
	// var alpha = document.getElementById('alpha');
	// alpha.addEventListener('change', transparency, false);
	// HexCode value
	var hex = document.getElementById('colorHex');
	hex.addEventListener('change', hexcode, false);

	// Setting initial line color
	linecolor = 'rgba(0,0,0,1)';

	// Adding toolbox event listeners
	currentTool = "pencil";

	// for each iterates over a list and runs a function for each element
	var forEach = Array.prototype.forEach,
	// query selector all runs a CSS selector and returns a list of elements
	// matching the selector
	$$ = document.querySelectorAll.bind(document);

	// for each element in the list returned by the CSS selector
	forEach.call($$('.tool'), function(v) {
		// add an event listener to the click event
		v.addEventListener("mousedown", function(e) {
			changeTool(e)
		}, false);
	});

	container.redraw();

	// Setting up drawing functionality
	canvas.width = parseInt(sketch_style.getPropertyValue('width'));
	canvas.height = parseInt(sketch_style.getPropertyValue('height'));

	tmp_canvas = document.createElement('canvas');
	tmp_ctx = tmp_canvas.getContext('2d');
	tmp_canvas.id = 'tmp_canvas';
	tmp_canvas.width = canvas.width;
	tmp_canvas.height = canvas.height;

	sketch.appendChild(tmp_canvas);

	mouse = {
		x : 0,
		y : 0
	};
	last_mouse = {
		x : 0,
		y : 0
	};
	ppts = [];

	tmp_canvas.addEventListener('mousemove', function(e) {
		mouse.x = typeof e.offsetX !== 'undefined' ? e.offsetX : e.layerX;
		mouse.y = typeof e.offsetY !== 'undefined' ? e.offsetY : e.layerY;
	}, false);

	tmp_canvas.addEventListener('mousedown', function(e) {
		findxy('down', e)
	}, false);
	tmp_canvas.addEventListener('mouseup', function(e) {
		findxy('up', e)
	}, false);
}

function hexcode(obj) {
	console.log(obj.target.value)
	var toHex = obj.target.value;
	var colorDiv = document.getElementById('color');
	while (toHex.length < 6) {
		toHex += "0";
	}
	hex = toHex;
	lineColor = "#" + toHex;
	var colorDiv = document.getElementById('color');
	colorDiv.style.backgroundColor = "#" + toHex;
}

function rgbValues(obj) {
	var colorName = obj.id;
	var colorValue = obj.value;
	if (colorName == 'red')
		red = colorValue;
	else if (colorName == 'blue')
		blue = colorValue;
	else if (colorName == 'green')
		green = colorValue;

	var color = 'rgba(' + red + ',' + blue + ',' + green + ',' + trans + ')';
	lineColor = color;
	var colorDiv = document.getElementById('color');
	colorDiv.style.backgroundColor = color;
	document.getElementById('colorHex').value = rgbToHex(red, blue, green);
	rgbToHsv(red,blue,green);
}

function hsvValues(obj) {
	var colorName = obj.target.id;
	var colorValue = obj.target.value;
	if (colorName == 'hue')
		hue = colorValue;
	else if (colorName == 'saturation')
		sat = colorValue;
	else if (colorName == 'brightness')
		val = colorValue;

	var color = 'hsla(' + hue + ',' + sat + ',' + val + ',' + trans + ')';
	lineColor = color;
	var colorDiv = document.getElementById('color');
	colorDiv.style.backgroundColor = color;
}

function transparency(obj) {
	trans = (obj.value / 100);
	console.log(lineColor);
}

function changeTool(e) {
	var target = e.target
	currentTool = target.id;
}

function pencil() {
	tmp_ctx.lineWidth = 1;
	// Saving all the points in an array
	ppts.push({
		x : mouse.x,
		y : mouse.y
	});

	if (ppts.length < 3) {
		var b = ppts[0];
		tmp_ctx.beginPath();
		// ctx.moveTo(b.x, b.y);
		// ctx.lineTo(b.x+50, b.y+50);
		tmp_ctx.arc(b.x, b.y, tmp_ctx.lineWidth / 2, 0, Math.PI * 2, !0);
		tmp_ctx.fill();
		tmp_ctx.closePath();

		return;
	}

	// Tmp canvas is always cleared up before drawing.
	tmp_ctx.clearRect(0, 0, tmp_canvas.width, tmp_canvas.height);

	tmp_ctx.beginPath();
	tmp_ctx.moveTo(ppts[0].x, ppts[0].y);

	for ( var i = 1; i < ppts.length - 2; i++) {
		var c = (ppts[i].x + ppts[i + 1].x) / 2;
		var d = (ppts[i].y + ppts[i + 1].y) / 2;

		tmp_ctx.quadraticCurveTo(ppts[i].x, ppts[i].y, c, d);
	}

	// For the last 2 points
	tmp_ctx
			.quadraticCurveTo(ppts[i].x, ppts[i].y, ppts[i + 1].x,
					ppts[i + 1].y);
	tmp_ctx.stroke();
}

function brush() {
	// Saving all the points in an array
	ppts.push({
		x : mouse.x,
		y : mouse.y
	});

	if (ppts.length < 3) {
		var b = ppts[0];
		tmp_ctx.beginPath();
		// ctx.moveTo(b.x, b.y);
		// ctx.lineTo(b.x+50, b.y+50);
		tmp_ctx.arc(b.x, b.y, tmp_ctx.lineWidth / 2, 0, Math.PI * 2, !0);
		tmp_ctx.fill();
		tmp_ctx.closePath();

		return;
	}

	// Tmp canvas is always cleared up before drawing.
	tmp_ctx.clearRect(0, 0, tmp_canvas.width, tmp_canvas.height);

	tmp_ctx.beginPath();
	tmp_ctx.moveTo(ppts[0].x, ppts[0].y);

	for ( var i = 1; i < ppts.length - 2; i++) {
		var c = (ppts[i].x + ppts[i + 1].x) / 2;
		var d = (ppts[i].y + ppts[i + 1].y) / 2;

		tmp_ctx.quadraticCurveTo(ppts[i].x, ppts[i].y, c, d);
	}

	// For the last 2 points
	tmp_ctx
			.quadraticCurveTo(ppts[i].x, ppts[i].y, ppts[i + 1].x,
					ppts[i + 1].y);
	tmp_ctx.stroke();
}

function picker() {
	var pixel = context.getImageData(ppts[ppts.length - 1].x,
			ppts[ppts.length - 1].y, 1, 1).data;
	var hex = "#"
			+ ("000000" + rgbToHex(pixel[0], pixel[1], pixel[2])).slice(-6);

	console.log(ppts[ppts.length - 1].x);

	lineColor = hex;
	var colorDiv = document.getElementById('color');
	colorDiv.style.backgroundColor = hex;

	console.log(hex);

	currentTool = "brush";
}

function rgbToHsv(r, g, b) {
	var computedH = 0;
	var computedS = 0;
	var computedV = 0;

	// remove spaces from input RGB values, convert to int
	var r = parseInt(r, 10);
	var g = parseInt(g, 10);
	var b = parseInt(b, 10);

	if (r == null || g == null || b == null || isNaN(r) || isNaN(g) || isNaN(b)) {
		alert('Please enter numeric RGB values!');
		return;
	}
	
	if (r < 0 || g < 0 || b < 0 || r > 255 || g > 255 || b > 255) {
		alert('RGB values must be in the range 0 to 255.');
		return;
	}
	r = r / 255;
	g = g / 255;
	b = b / 255;
	var minRGB = Math.min(r, Math.min(g, b));
	var maxRGB = Math.max(r, Math.max(g, b));

	// Black-gray-white
	if (minRGB == maxRGB) {
		computedV = minRGB;
		return [ 0, 0, computedV ];
	}

	// Colors other than black-gray-white:
	var d = (r == minRGB) ? g - b : ((b == minRGB) ? r - g : b - r);
	var h = (r == minRGB) ? 3 : ((b == minRGB) ? 1 : 5);
	computedH = 60 * (h - d / (maxRGB - minRGB));
	computedS = (maxRGB - minRGB) / maxRGB;
	computedV = maxRGB;
	
	hue = computedH;
	sat = computedS;
	val = computedV;
	
	document.getElementById('hue').value = hue;
	document.getElementById('saturation').value = sat;
	document.getElementById('brightness').value = val;
}

function rgbToHex(r, g, b) {
	if (r > 255 || g > 255 || b > 255)
		throw "Invalid color component";
	return ((r << 16) | (g << 8) | b).toString(16);
}

function HexToRGB() {
	red = parseInt(hex.substring(0, 2), 16);
	blue = parseInt(hex.substring(2, 4), 16);
	green = parseInt(hex.substring(4, 6), 16);
	document.getElementById('red').value = red;
	document.getElementById('green').value = blue;
	document.getElementById('blue').value = green;
}

function eraser() {
	// Setting clear color
	tmp_ctx.globalCompositeOperation = 'copy';
	tmp_ctx.strokeStyle = 'rgba(0,0,0,0)';
	tmp_ctx.fillStyle = 'rgba(0,0,0,0)';

	// Saving all the points in an array
	ppts.push({
		x : mouse.x,
		y : mouse.y
	});

	if (ppts.length < 3) {
		var b = ppts[0];
		tmp_ctx.beginPath();
		// ctx.moveTo(b.x, b.y);
		// ctx.lineTo(b.x+50, b.y+50);
		tmp_ctx.arc(b.x, b.y, tmp_ctx.lineWidth / 2, 0, Math.PI * 2, !0);
		tmp_ctx.fill();
		tmp_ctx.closePath();

		return;
	}

	// Tmp canvas is always cleared up before drawing.
	tmp_ctx.clearRect(0, 0, tmp_canvas.width, tmp_canvas.height);

	tmp_ctx.beginPath();
	tmp_ctx.moveTo(ppts[0].x, ppts[0].y);

	for ( var i = 1; i < ppts.length - 2; i++) {
		var c = (ppts[i].x + ppts[i + 1].x) / 2;
		var d = (ppts[i].y + ppts[i + 1].y) / 2;

		tmp_ctx.quadraticCurveTo(ppts[i].x, ppts[i].y, c, d);
	}

	// For the last 2 points
	tmp_ctx
			.quadraticCurveTo(ppts[i].x, ppts[i].y, ppts[i + 1].x,
					ppts[i + 1].y);
	tmp_ctx.stroke();
}

function paint() {
	if (currentTool === "pencil")
		pencil();
	else if (currentTool === "brush")
		brush();
	else if (currentTool === "picker")
		picker();
	else if (currentTool === "eraser")
		eraser();
}

function findxy(res, e) {
	/* Drawing on Paint App */
	tmp_ctx.lineWidth = 10;
	tmp_ctx.lineJoin = 'round';
	tmp_ctx.lineCap = 'round';
	tmp_ctx.strokeStyle = lineColor;
	tmp_ctx.fillStyle = lineColor;

	if (res === 'down') {
		tmp_canvas.addEventListener('mousemove', paint, false);

		mouse.x = typeof e.offsetX !== 'undefined' ? e.offsetX : e.layerX;
		mouse.y = typeof e.offsetY !== 'undefined' ? e.offsetY : e.layerY;

		ppts.push({
			x : mouse.x,
			y : mouse.y
		});

		paint();
	}
	if (res === 'up') {
		tmp_canvas.removeEventListener('mousemove', paint, false);

		// Writing down to real canvas now
		context.drawImage(tmp_canvas, 0, 0);
		// Clearing tmp canvas
		tmp_ctx.clearRect(0, 0, tmp_canvas.width, tmp_canvas.height);

		// Emptying up Pencil Points
		ppts = [];
		saveInstance();
	}
}

function save() {
	var dataURL = document.getElementById('canvas').toDataURL();
	hiddenField = dataURL;
	var csrftoken = getCookie('csrftoken');
	$.ajax({
		beforeSend : function(xhr, settings) {
			xhr.setRequestHeader("X-CSRFToken", csrftoken);
		},
		type : "POST",
		url : "/saveImage",
		data : {
			imgBase64 : dataURL
		}
	});
}

function load(e) {
	var reader = new FileReader();
	reader.onload = function(event) {
		var img = new Image();
		img.onload = function() {
			canvas.width = img.width;
			canvas.height = img.height;
			context.drawImage(img, 0, 0);
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
		for ( var i = 0; i < cookies.length; i++) {
			var cookie = jQuery.trim(cookies[i]);
			// Does this cookie string begin with the name we want?
			if (cookie.substring(0, name.length + 1) == (name + '=')) {
				cookieValue = decodeURIComponent(cookie
						.substring(name.length + 1));
				break;
			}
		}
	}
	return cookieValue;
}

function saveInstance() {
	history.push(document.getElementById('canvas').toDataURL());
	if (redoStack.length > 0) {
		redoStack.splice(0, redoStack.length);
	}
}

function undo() {
	if (history.length > 1) {
		var toRedo = history.pop();
		var img = new Image();
		img.src = history[history.length - 1];
		canvas.width = canvas.width;
		context.drawImage(img, 0, 0);
		redoStack.push(toRedo);
	}
}

function redo() {
	if (redoStack.length > 0) {
		var toHistory = redoStack.pop();
		var img = new Image();
		img.src = toHistory;
		canvas.width = canvas.width;
		context.drawImage(img, 0, 0);
		history.push(toHistory);
	}
}

function addLayer() {
	console.log(container.getChildren());
	var layerToAdd = new CanvasLayers.Layer(0, 0, canvas.width, canvas.height);
	container.getChildren().add(layerToAdd);

	var num = Math.floor((Math.random() * 999999));
	var hex = '' + num;
	while (hex.length < 6) {
		hex = '0' + hex;
	}
	context.fillStyle = hex;
	context.fillRect(0, 0, layerToAdd.getWidth(), layerToAdd.getHeight());
	activeLayer = layerToAdd;
	currentIndex = container.getChildren().list.length - 1;
	console.log(container.getChildren().list[currentIndex]);
	saveInstance();
}

function deleteLayer() {
	var layerCollection = container.getChildren();
	var layerArray = layerCollection.list;

	if (layerArray.length > 0) {
		console.log(layerCollection);
		console.log(layerArray);
		console.log(currentIndex)
		if (currentIndex != 0)
			currentIndex = currentIndex - 1;
		layerArray[currentIndex].close();
		saveInstance();
	}
	container.redraw();
}

function moveLayerUp() {
	var layerCollection = container.getChildren();
	var layerArray = layerCollection.list;

	if (currentIndex != layerArray.length - 1) {
		var temp = layerArray[currentIndex];
		temp.hide();
		layerArray[currentIndex] = layerArray[currentIndex + 1];
		layerArray[currentIndex].hide();
		layerArray[currentIndex + 1] = temp;
		layerArray[currentIndex + 1].show();
		layerArray[currentIndex].show();
		container.redraw();
		saveInstance();
	}
}

function moveLayerDown() {
	var layerCollection = container.getChildren();
	var layerArray = layerCollection.list;

	if (currentIndex != 0) {
		var temp = layerArray[currentIndex];
		temp.hide();
		layerArray[currentIndex] = layerArray[currentIndex - 1];
		layerArray[currentIndex].hide();
		layerArray[currentIndex - 1] = temp;
		layerArray[currentIndex - 1].show();
		layerArray[currentIndex].show();
		container.redraw();
		saveInstance();
	}
}
