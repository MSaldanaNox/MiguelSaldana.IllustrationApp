var container;
var layer1;
var layer2;

function init() {
    var canvas = document.getElementById("canvas");
    container = new CanvasLayers.Container(canvas, false);

    container.onRender = function(layer, rect, context) {
        context.fillStyle = '#000';
        context.fillRect(0, 0, layer.getWidth(), layer.getHeight());
    }

    layer1 = new CanvasLayers.Layer(10, 60, 60, 60);
    container.getChildren().add(layer1);

    layer1.onRender = function(layer, rect, context) {
        context.fillStyle = '#00f';
        context.fillRect(0, 0, layer.getWidth(), layer.getHeight());
    }

    layer2 = new CanvasLayers.Layer(100, 50, 60, 80);
    container.getChildren().add(layer2);

    layer2.onRender = function(layer, rect, context) {
        context.fillStyle = '#0f0';
        context.fillRect(0, 0, layer.getWidth(), layer.getHeight());
    }

    layer2.lowerToBottom();
    var timer = setInterval("changeScene()", 10);
}

function addLayer()	{
	var layerToAdd = new CanvasLayers.Layer(0,0,400,400);
	container.getChildren().add(layerToAdd);
	var context = canvas.getContext("2d");
	
	var num = Math.floor((Math.random()*999999));
	var hex = ''+num;
	while(hex.length<6)
	{
		hex = '0'+hex;
	}
	context.fillStyle = hex;
    context.fillRect(0, 0, layerToAdd.getWidth(), layerToAdd.getHeight());
	
}

function deleteLayer() {
	var layerCollection = container.getChildren();
	var layerArray = layerCollection.list;
	console.log(layerArray[0]);
	layerArray[layerArray.length-1].close();
}

function moveLayerUp()
{
	var layerCollection = container.getChildren();
	var layerArray = layerCollection.list;
	var currentIndex = layerArray.length-2;
	
	var temp = layerArray[currentIndex];
	console.log()
	temp.hide();
	layerArray[currentIndex] = layerArray[currentIndex+1];
	layerArray[currentIndex].hide();
	layerArray[currentIndex+1] = temp;
	layerArray[currentIndex+1].show();
	layerArray[currentIndex].show();
	container.redraw();
}

function moveLayerDown()
{
	var layerCollection = container.getChildren();
	var layerArray = layerCollection.list;
	var currentIndex = layerArray.length-1;
	
	var temp = layerArray[currentIndex];
	temp.hide();
	layerArray[currentIndex] = layerArray[currentIndex-1];
	layerArray[currentIndex].hide();
	layerArray[currentIndex-1] = temp;
	layerArray[currentIndex-1].show();
	layerArray[currentIndex].show();
	container.redraw();
}

function changeScene() {
    layer2.moveTo(layer2.getRelativeX() - 1, layer2.getRelativeY());
    container.redraw();
}