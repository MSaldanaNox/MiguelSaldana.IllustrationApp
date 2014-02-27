	var canvas, context, container, activeLayer, currentIndex, history, redoStack, 
	toolBox, currentTool, ppts, tmp_canvas, tmp_ctx, mouse, last_mouse, sketch,
	    prevX = 0,
	    currX = 0,
	    prevY = 0,
	    currY = 0,
	    dot_flag = false;
	
	var lineColor = "black",
	    lineWidth = 1;
	
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
// canvas.width = 500;
// canvas.height = 500;
	    sketch = document.querySelector('#content');
		var sketch_style = getComputedStyle(sketch);
		console.log(sketch);
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
	    
	    // Adding canvas event listeners
// canvas.addEventListener("mousemove", function (e) {
// findxy('move', e)
// }, false);
// canvas.addEventListener("mousedown", function (e) {
// findxy('down', e)
// }, false);
// canvas.addEventListener("mouseup", function (e) {
// findxy('up', e)
// }, false);
// canvas.addEventListener("mouseout", function (e) {
// findxy('out', e)
// }, false);
	    
	    // Adding toolbox event listeners
	    toolBox.addEventListener("mousedown", function(e) {
	    	changeTool(e)
	    }, false);
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
		
		mouse = {x: 0, y: 0};
		last_mouse = {x: 0, y: 0};
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
	
	function changeTool(e) {
		var target = e.target
//		alert(target.id);
	}
	
	function pencil() {
	    context.beginPath();
	    context.moveTo(prevX, prevY);
	    context.lineTo(currX, currY);
	    context.strokeStyle = lineColor;
	    context.lineWidth = lineWidth;
	    context.closePath();
	    context.stroke();
	}
	
	function brush() {
		// Saving all the points in an array
		ppts.push({x: mouse.x, y: mouse.y});
		
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
		
		for (var i = 1; i < ppts.length - 2; i++) {
			var c = (ppts[i].x + ppts[i + 1].x) / 2;
			var d = (ppts[i].y + ppts[i + 1].y) / 2;
			
			tmp_ctx.quadraticCurveTo(ppts[i].x, ppts[i].y, c, d);
		}
		
		// For the last 2 points
		tmp_ctx.quadraticCurveTo(
			ppts[i].x,
			ppts[i].y,
			ppts[i + 1].x,
			ppts[i + 1].y
		);
		tmp_ctx.stroke();
	}
	
	
	function findxy(res, e) {
		/* Drawing on Paint App */
		tmp_ctx.lineWidth = 30;
		tmp_ctx.lineJoin = 'round';
		tmp_ctx.lineCap = 'round';
		tmp_ctx.strokeStyle = lineColor;
		tmp_ctx.fillStyle = lineColor;
		
		if(res==='down') {
				tmp_canvas.addEventListener('mousemove', brush, false);
				
				mouse.x = typeof e.offsetX !== 'undefined' ? e.offsetX : e.layerX;
				mouse.y = typeof e.offsetY !== 'undefined' ? e.offsetY : e.layerY;
				
				ppts.push({x: mouse.x, y: mouse.y});
				
				brush();
		}
		if(res==='up') {
				tmp_canvas.removeEventListener('mousemove', brush, false);
				
				// Writing down to real canvas now
				context.drawImage(tmp_canvas, 0, 0);
				// Clearing tmp canvas
				tmp_ctx.clearRect(0, 0, tmp_canvas.width, tmp_canvas.height);
				
				// Emptying up Pencil Points
				ppts = [];
		}
	}
	
	function save() {
		var dataURL = document.getElementById('canvas').toDataURL();
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
		history.push(document.getElementById('canvas').toDataURL());
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
		
	// var num = Math.floor((Math.random()*999999));
	// var hex = ''+num;
	// while(hex.length<6)
	// {
	// hex = '0'+hex;
	// }
	// context.fillStyle = hex;
	// context.fillRect(0, 0, layerToAdd.getWidth(), layerToAdd.getHeight());
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
