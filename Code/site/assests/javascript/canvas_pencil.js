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
    context = canvas.getContext("2d");
    width = canvas.width;
    height = canvas.height;
    var setDefault = document.getElementById('color');
    
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
    context.strokeStyle = rgba(0,0,0,1);
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