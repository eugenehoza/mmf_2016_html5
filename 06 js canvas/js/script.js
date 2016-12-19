//html elements
var canvas;

var canvasSize = 500;
var packmanCenter = { x: 400, y: 150 };
var packmanShiftDistance = 10;
var packmanDirect = { alpha: 0.2, betta: 2 * 3.14 - 0.2 };
var radiusFood = 5;

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

function getFoods(count, arrayObstacles) {
    var arrayFoods = [];
    while (arrayFoods.length != count) {
        var coordX = Math.floor(Math.random() * ((canvasSize - radiusFood) - radiusFood + 1)) + radiusFood;
        var coordY = Math.floor(Math.random() * ((canvasSize - radiusFood) - radiusFood + 1)) + radiusFood;
        var food = { x: coordX, y: coordY, radius: radiusFood }
        if (!intersectionObject(arrayFoods, food, "arc", "arc") && !intersectionObject(arrayObstacles, food, "rect", "arc")) {
            arrayFoods.push({ x: coordX, y: coordY, radius: radiusFood, size: radiusFood });
        }
    }
    return arrayFoods;
}

function drawObjects(array, fillStyle, typeObject) {
    ctx.fillStyle = fillStyle;
    if (typeObject == "rect") {
        array.forEach(elem => ctx.fillRect(elem.x, elem.y, elem.size, elem.size));
    }
    if (typeObject == "arc") {
        ctx.beginPath();
        array.forEach(function (elem, i, arr) {
            ctx.moveTo(elem.x, elem.y);
            ctx.arc(elem.x, elem.y, elem.size, 0, 2 * 3.14, false)
        });
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = "";
    }
    ctx.fillStyle = "";
}

function intersectionObject(array, object, typeObjectArray, typeObject) {
    if (typeObject == "rect" && typeObjectArray == "rect") {
        return array.some(function (elem, i, arr) {
            var centr1 = { x: elem.x + elem.size / 2, y: elem.y + elem.size / 2 };
            var centr2 = { x: object.x + object.size / 2, y: object.y + object.size / 2 };
            var dlina = Math.sqrt(Math.pow(centr1.x - centr2.x, 2) + Math.pow(centr1.y - centr2.y, 2));
            return dlina < elem.size * Math.sqrt(2) / 2 + object.size * Math.sqrt(2) / 2 + 40;
        });
    }
    if (typeObjectArray == "rect" && typeObject == "arc") {
        return array.some(function (elem, i, arr) {
            var centr1 = { x: elem.x + elem.size / 2, y: elem.y + elem.size / 2 };
            var dlina = Math.sqrt(Math.pow(centr1.x - object.x, 2) + Math.pow(centr1.y - object.y, 2));
            return dlina <= elem.size / 2 + object.radius;
        });
    }
    if (typeObjectArray == "arc" && typeObject == "arc") {
        return array.some(function (elem, i, arr) {
            var dlina = Math.sqrt(Math.pow(elem.x - object.x, 2) + Math.pow(elem.y - object.y, 2));
            return dlina <= object.radius;
        });
    }
    if (typeObjectArray == "arc" && typeObject == "rect") {
        return array.some(function (elem, i, arr) {
            var centr1 = { x: object.x + object.size / 2, y: object.y + object.size / 2 };
            var dlina = Math.sqrt(Math.pow(elem.x - centr1.x, 2) + Math.pow(elem.y - object.y, 2));
            return dlina < elem.radius + object.size / 2;
        });
    }
}


function eatFood() {
    if (intersectionObject(arrayFoods, packmanModel, "arc", "arc")) {
        var firstLength = Math.sqrt(Math.pow(arrayFoods[0].x - packmanModel.x, 2) + Math.pow(arrayFoods[0].y - packmanModel.y, 2));
        var indexFood = 0;
        arrayFoods.forEach(function (elem, i, arr) {
            if (firstLength > Math.sqrt(Math.pow(elem.x - packmanModel.x, 2) + Math.pow(elem.y - packmanModel.y, 2))) {
                firstLength = Math.sqrt(Math.pow(elem.x - packmanModel.x, 2) + Math.pow(elem.y - packmanModel.y, 2));
                indexFood = i;
            }
        });
        arrayFoods.splice(indexFood, 1);
        $("#countFood span").text(arrayFoods.length);
        if (arrayFoods.length == 0) {
            level++;
            var gamePlay = levelsGame(level);
            if (gamePlay == undefined) {
                return;
            }
            arrayObstacles = getObstacles(gamePlay.obstacles, 15, 50);
            arrayFoods = getFoods(gamePlay.foods, arrayObstacles);
            arrayVillains = getVillain(gamePlay.villain);
            $("#level span").text(level);
            $("#countFood span").text(arrayFoods.length);
        }
    }
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
            eatFood();
            break;
        case 38:
            packmanCenter.y -= packmanShiftDistance
            packmanDirect.alpha = 3 * 3.14 / 2 + 0.2
            packmanDirect.betta = 3 * 3.14 / 2 - 0.2
            eatFood();
            break;
        case 39:
            packmanCenter.x += packmanShiftDistance
            packmanDirect.alpha = 0.2;
            packmanDirect.betta = 2 * 3.14 - 0.2;
            eatFood();
            break;
        case 40:
            packmanCenter.y += packmanShiftDistance
            packmanDirect.alpha = 3.14 / 2 + 0.2
            packmanDirect.betta = 3.14 / 2 - 0.2
            eatFood();
            break;
    }
});

// infinite loop 
setInterval(function () {
    clearContext();
    arrayFoods = getFoods(10, [{x:1, y:2, size: 10}]);
    $("#countFood span").text(arrayFoods.length);
    drawObjects(arrayFoods, "green", "arc");
    drawPackman(packmanCenter, packmanDirect);
}, 50) 