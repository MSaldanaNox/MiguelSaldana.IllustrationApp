var canvas, context, flag = false,
    prevX = 0,
    currX = 0,
    prevY = 0,
    currY = 0,
    dot_flag = false;

var lineColor = "black",
    lineWidth = 1;

function init() {
    canvas = document.getElementById('sheet');
    context = canvas.getContext("2d");
    width = canvas.width;
    height = canvas.height;

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
    switch (obj.id) {
        case "green":
            lineColor = "green";
            break;
        case "blue":
            lineColor = "blue";
            break;
        case "red":
            lineColor = "red";
            break;
        case "yellow":
            lineColor = "yellow";
            break;
        case "orange":
            lineColor = "orange";
            break;
        case "black":
            lineColor = "black";
            break;
        case "white":
            lineColor = "white";
            break;
    }

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