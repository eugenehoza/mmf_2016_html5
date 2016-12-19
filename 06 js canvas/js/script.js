//html elements
var canvas;
var canvasSize = 500;


var packmanModel = { x: 400, y: 150, alpha: 0.2, betta: 2 * 3.14 - 0.2, radius: 20 };
var packmanShiftDistance = 10;

var radiusFood = 5;
var radiusVillain = 10;
var arrayObstacles;
var arrayFoods;
var arrayVillains
var level = 1;


var ctx;

document.addEventListener("DOMContentLoaded", (event) => {
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    clearContext();
});

function startingCoordinatesPackman() {
    var min = packmanModel.radius;
    var max = canvasSize - packmanModel.radius;
    do {
        packmanModel.x = Math.floor(Math.random() * (max - min + 1)) + min;
        packmanModel.y = Math.floor(Math.random() * (max - min + 1)) + min;
    } while (intersectionObject(arrayObstacles, packmanModel, "rect", "arc"));
}

function levelsGame(level) {
    switch (level) {
        case 1: return { obstacles: 16, foods: 13, villain: 3 };
        case 2: return { obstacles: 17, foods: 14, villain: 3 };
        case 3: return { obstacles: 18, foods: 15, villain: 4 };
        case 4: return { obstacles: 19, foods: 16, villain: 4 };
        case 5: return { obstacles: 20, foods: 17, villain: 4 };
        case 6: return { obstacles: 21, foods: 18, villain: 5 };
        case 7: return { obstacles: 22, foods: 19, villain: 5 };
        case 8: return { obstacles: 23, foods: 21, villain: 6 };
        case 9: return { obstacles: 24, foods: 23, villain: 6 };
        case 10: return { obstacles: 25, foods: 25, villain: 7 };
        default:
            endGame();
            break;
    }
}

function endGame() {
    clearInterval(timerInterval);
    clearInterval(drawingGamePlay);
    clearContext();
    ctx.fillStyle = "white";
    ctx.lineWidth = 2;
    ctx.font = 'italic 40pt Calibri';
    ctx.fillText("END", 200, 250);
    ctx.fillStyle = "";
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

function startGame() {
    $('.timer').text('00:00:00');
    level = 1;
    $("#level span").text(level);
    ctx.restore();
    var gamePlay = levelsGame(level);
    if (gamePlay == undefined) {
        return;
    }
    arrayObstacles = getObstacles(gamePlay.obstacles, 15, 50);
    arrayFoods = getFoods(gamePlay.foods, arrayObstacles);
    arrayVillains = getVillain(gamePlay.villain);
    $("#countFood span").text(arrayFoods.length);

    startingCoordinatesPackman();
    drawingGamePlay = setInterval(function () {
        clearContext();
        drawObjects(arrayObstacles, "grey", "rect");
        drawObjects(arrayFoods, "green", "arc");
        drawObjects(moveVillains(arrayVillains), "red", "arc");
        drawPackman(packmanModel);
    }, 100);


    var this_date = new Date();
    timerInterval = setInterval(function () {
        var new_date = new Date() - this_date;
        var ms = Math.abs(Math.floor(new_date % 1000 / 10)); //ms 
        var sec = Math.abs(Math.floor(new_date / 1000) % 60); //sek 
        var min = Math.abs(Math.floor(new_date / 1000 / 60) % 60); //min 
        if (sec.toString().length == 1) sec = '0' + sec;
        if (min.toString().length == 1) min = '0' + min;
        $('.timer').text(min + ':' + sec + ":" + ms);
    }, 100);
};

function getObstacles(count, lengthMin, lengthMax) {
    var arrayObstacles = [];
    while (arrayObstacles.length != count) {
        var barrier = Math.floor(Math.random() * (3 - 1)) + 1;
        if (barrier == 1) {
            var coordX = Math.floor(Math.random() * (canvasSize - lengthMin - 1)) + 1;
            var coordY = Math.floor(Math.random() * (canvasSize - lengthMin - 1)) + 1;
            if ((coordX >= packmanModel.radius * 2 && coordX <= canvasSize - 2 * packmanModel.radius - lengthMin || coordX == 0 && coordX == canvasSize - lengthMin)
                && (coordY >= 2 * packmanModel.radius && coordY <= canvasSize - 2 * packmanModel.radius - lengthMin || coordY == 0 && coordY == canvasSize - lengthMin)) {
                var obstacle = { x: coordX, y: coordY, size: lengthMin };
                if (arrayObstacles.length == 0 || !intersectionObject(arrayObstacles, obstacle, "rect", "rect")) {
                    arrayObstacles.push({ x: coordX, y: coordY, size: lengthMin });
                }
            }
        }
        if (barrier == 2) {
            var coordX = Math.floor(Math.random() * (canvasSize - lengthMax - 1)) + 1;
            var coordY = Math.floor(Math.random() * (canvasSize - lengthMax - 1)) + 1;
            if ((coordX >= 2 * packmanModel.radius && coordX <= canvasSize - 2 * packmanModel.radius - lengthMax || coordX == 0 && coordX == canvasSize - lengthMax)
                && (coordY >= 2 * packmanModel.radius && coordY <= canvasSize - 2 * packmanModel.radius - lengthMax || coordY == 0 && coordY == canvasSize - lengthMax)) {
                var obstacle = { x: coordX, y: coordY, size: lengthMax };
                if (arrayObstacles.length == 0 || !intersectionObject(arrayObstacles, obstacle, "rect", "rect")) {
                    arrayObstacles.push(obstacle);
                }
            }
        }
    }
    return arrayObstacles;
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

function getVillain(count) {
    var arrayVillains = [];
    while (arrayVillains.length != count) {
        var coordX = Math.floor(Math.random() * ((canvasSize - radiusVillain) - radiusVillain + 1)) + radiusVillain;
        var coordY = Math.floor(Math.random() * ((canvasSize - radiusVillain) - radiusVillain + 1)) + radiusVillain;
        var villain = { x: coordX, y: coordY, radius: radiusVillain }
        if (!intersectionObject(arrayVillains, villain, "arc", "arc") && !intersectionObject(arrayObstacles, villain, "rect", "arc")) {
            arrayVillains.push({ x: coordX, y: coordY, radius: radiusVillain, size: radiusVillain });
        }
    }
    return arrayVillains;
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

function stopGame() {
    //$('.timer').text('00:00:00');
    clearInterval(timerInterval);
    clearInterval(drawingGamePlay);
    clearContext();

}

function drawPackman() {
    ctx.beginPath();
    ctx.fillStyle = "yellow";
    ctx.moveTo(packmanModel.x, packmanModel.y);
    ctx.arc(packmanModel.x, packmanModel.y, packmanModel.radius, packmanModel.alpha, packmanModel.betta, false);
    //ctx.lineTo(packmanModel.x, packmanModel.y);
    //ctx.stroke(); 
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "";

}

function clearContext() {
    if (ctx != null) {
        //ctx.beginPath();
        //ctx.moveTo(0, 0);
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

function moveVillains(arrayVillains) {
    arrayVillains.forEach(function (elem, i, arr) {
        do {
            var coordinate = Math.floor(Math.random() * (3 - 1)) + 1;
            if (coordinate == 1) {
                var direction = Math.floor(Math.random() * (3 - 1)) + 1;
                elem.x += direction == 1 ? packmanShiftDistance : - packmanShiftDistance;
            }
            if (coordinate == 2) {
                var direction = Math.floor(Math.random() * (3 - 1)) + 1;
                elem.y += direction == 1 ? packmanShiftDistance : - packmanShiftDistance;
            }
        } while (intersectionObject(arrayObstacles, elem, "rect", "arc") || endCanvas(elem));
        if (intersectionObject(arrayVillains, packmanModel, "arc", "arc")) {
            endGame();
        }
    })
    return arrayVillains;
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

function endCanvas(model) {
    var flagX;
    var flagY;
    if (model.x > canvasSize / 2) {
        flagX = canvasSize - model.x - model.radius <= -packmanShiftDistance;
    } else {
        flagX = model.x - model.radius <= -packmanShiftDistance;
    }
    if (model.y > canvasSize / 2) {
        flagY = canvasSize - model.y - model.radius <= -packmanShiftDistance;
    } else {
        flagY = model.y - model.radius <= -packmanShiftDistance;
    }
    return flagX || flagY;
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

$(document).keydown(function (e) {
    // 37 - left 
    // 38 - top 
    // 39 - right 
    // 40 - down    

    switch (e.keyCode) {
        case 37:
            packmanModel.x -= packmanShiftDistance
            packmanModel.alpha = 0.2 + 3.14;
            packmanModel.betta = 3.14 - 0.2;
            if (endCanvas(packmanModel) || intersectionObject(arrayObstacles, packmanModel, "rect", "arc")) {
                packmanModel.x += packmanShiftDistance;
            }
            eatFood();
            break;
        case 38:
            packmanModel.y -= packmanShiftDistance
            packmanModel.alpha = 3 * 3.14 / 2 + 0.2
            packmanModel.betta = 3 * 3.14 / 2 - 0.2
            if (endCanvas(packmanModel) || intersectionObject(arrayObstacles, packmanModel, "rect", "arc")) {
                packmanModel.y += packmanShiftDistance;
            }
            eatFood();
            break;
        case 39:
            packmanModel.x += packmanShiftDistance
            packmanModel.alpha = 0.2;
            packmanModel.betta = 2 * 3.14 - 0.2;
            if (endCanvas(packmanModel) || intersectionObject(arrayObstacles, packmanModel, "rect", "arc")) {
                packmanModel.x -= packmanShiftDistance;
            }
            eatFood();
            break;
        case 40:
            packmanModel.y += packmanShiftDistance
            packmanModel.alpha = 3.14 / 2 + 0.2
            packmanModel.betta = 3.14 / 2 - 0.2
            if (endCanvas(packmanModel) || intersectionObject(arrayObstacles, packmanModel, "rect", "arc")) {
                packmanModel.y -= packmanShiftDistance;
            }
            eatFood();
            break;
    }
});

