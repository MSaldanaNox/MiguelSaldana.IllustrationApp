var canvas, ctx, flag = false,
    prevX = 0,
    currX = 0,
    prevY = 0,
    currY = 0,
    dot_flag = false;

var lineColor = "black",
    y = 1;

function init() {
    canvas = document.getElementById('sheet');
    ctx = canvas.getContext("2d");
    w = canvas.width;
    h = canvas.height;

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
    if (x == "white") y = 14;
    else y = 1;

}

function draw() {
    ctx.beginPath();
    ctx.moveTo(prevX, prevY);
    ctx.lineTo(currX, currY);
    console.log(currX+','+currY);
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = y;
    ctx.stroke();
    ctx.closePath();
}

function erase() {
    var m = confirm("Clear canvas of current work?");
    if (m) {
        ctx.clearRect(0, 0, w, h);
        document.getElementById("canvasimg").style.display = "none";
    }
}

function save() {
    var toSave = document.getElementById("mycanvas");
    var img = canvas.toDataURL("image/png");
    
    var window = window.open();
    window.document.write('<img src="'+img+'"/>');
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
            ctx.beginPath();
            ctx.fillStyle = x;
            ctx.fillRect(currX, currY, 2, 2);
            ctx.closePath();
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