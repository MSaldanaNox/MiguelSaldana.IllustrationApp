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

function changeScene() {
    layer2.moveTo(layer2.getRelativeX() - 1, layer2.getRelativeY());
    container.redraw();
}