//html elements
var canvas;

var canvasSize = 500;
var packmanCenter = { x: 400, y: 150 };
var packmanShiftDistance = 10;
var packmanDirect = { alpha: 0.2, betta: 2 * 3.14 - 0.2 };

var ctx;

document.addEventListener("DOMContentLoaded", (event) => {
    canvas = document.getElementById("canvas");       
    ctx = canvas.getContext("2d");
});

function calculateCenterPackman(packmanCenter) {
    var min = 0;
    var max = canvasSize;
    packmanCenter.x = Math.floor(Math.random() * (max - min + 1)) + min;
    packmanCenter.y = Math.floor(Math.random() * (max - min + 1)) + min;
}

function start_time() {
    $('.timer').text('00:00:00')
    var this_date = new Date();
    start_time_interval = setInterval(function () {
        var new_date = new Date() - this_date;
        var ms = Math.abs(Math.floor(new_date % 1000 / 10)); //ms 
        var sec = Math.abs(Math.floor(new_date / 1000) % 60); //sek 
        var min = Math.abs(Math.floor(new_date / 1000 / 60) % 60); //min 
        if (sec.toString().length == 1) sec = '0' + sec;
        if (min.toString().length == 1) min = '0' + min;
        $('.timer').text(min + ':' + sec + ":" + ms);
    }, 100);
};

function stop_time() {
    $('.timer').text('00:00:00');
    clearInterval(start_time_interval);
}

function drawPackman(packmanCenter, packmanDirect) {
    ctx.fillStyle = "yellow";
    ctx.moveTo(packmanCenter.x, packmanCenter.y);
    ctx.arc(packmanCenter.x, packmanCenter.y, 20, packmanDirect.alpha, packmanDirect.betta, false);
    ctx.lineTo(packmanCenter.x, packmanCenter.y);
    //ctx.stroke(); 
    ctx.fill();
    ctx.fillStyle = "";
}


function clearContext() {
    if (ctx != null) {
        ctx.beginPath();
        ctx.moveTo(0, 0);
        // ctx.lineTo(canvasSize, 0);
        // ctx.lineTo(canvasSize, canvasSize);
        // ctx.lineTo(0, canvasSize);
        // ctx.closePath();
        // ctx.stroke();
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvasSize, canvasSize);
        ctx.fillStyle = "";
    }
}

$(document).keydown(function (e) {
    // 37 - left 
    // 38 - top 
    // 39 - right 
    // 40 - down 

    switch (e.keyCode) {
        case 37:
            packmanCenter.x -= packmanShiftDistance
            packmanDirect.alpha = 0.2 + 3.14;
            packmanDirect.betta = 3.14 - 0.2;
            break;
        case 38:
            packmanCenter.y -= packmanShiftDistance
            packmanDirect.alpha = 3 * 3.14 / 2 + 0.2
            packmanDirect.betta = 3 * 3.14 / 2 - 0.2
            break;
        case 39:
            packmanCenter.x += packmanShiftDistance
            packmanDirect.alpha = 0.2;
            packmanDirect.betta = 2 * 3.14 - 0.2;
            break;
        case 40:
            packmanCenter.y += packmanShiftDistance
            packmanDirect.alpha = 3.14 / 2 + 0.2
            packmanDirect.betta = 3.14 / 2 - 0.2
            break;
    }
});

// infinite loop 
setInterval(function () {
    clearContext();
    drawPackman(packmanCenter, packmanDirect);
}, 50) 