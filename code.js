var moveX = 0, moveY = 0; // start positions
var speed = 10, interval_moving = 1000, interval_creation = 2000;  // how frequent moveX and moveY should be counted by
var w = document.body.clientWidth; var h = document.body.clientHeight;
/* The clientWidth and clientHeight property returns the viewable width of an element in pixels, including padding, but not the border, scrollbar or margin. */
var view_W = w - 280; var view_H = h - 180;
var colors = [{ "color": "green", "weight": 1 / 3 }, { "color": "red", "weight": 1 / 3 }, { "color": "	yellow", "weight": 1 / 3 }];
var shapes = [{ "shape": "circle", "weight": 1 / 5 }, { "shape": "square", "weight": 1 / 5 }, { "shape": "triangle", "weight": 1 / 5 }];
var currentShapes = [], hold_shapes = [];
var game_over = false, start_var = false, win = false;
var maxIdSquare = 0, maxIdCircle = 0, maxIdTriangle = 0, maxIdSkullBomb = 0;
window.addEventListener("keydown", Control);
let audio = document.getElementById("audio");
var shape_left = document.getElementById("shape_left");
var shape_right = document.getElementById("shape_right");
var time_start;
var prev_color_left = "", prev_color_right = "";
var score = 0, count_colors_left = 0, count_colors_right = 0, count_left = 0, count_right = 0;
var create_shapes;

function Control() {
    let key = event.key;
    let monster = document.getElementById('monster');
    if (game_over || !start_var || win) {
        return;
    }
    if (key == "ArrowLeft" && moveX > 0)  // left arrow key
    {
        moveX = moveX - speed;
        monster.style.left = moveX + "px";
        shape_left.style.left = (parseInt(shape_left.style.left, 10) - speed) + "px";
        shape_right.style.left = (parseInt(shape_right.style.left, 10) - speed) + "px";
        for (let i = 0; i < hold_shapes.length; i++) {
            document.getElementById(hold_shapes[i]['shape'] + "_" + hold_shapes[i]['ID']).style.left = (parseInt(document.getElementById(hold_shapes[i]['shape'] + "_" + hold_shapes[i]['ID']).style.left, 10) - speed) + "px";
        }
    }
    else if (key == "ArrowRight" && moveX < view_W)  // right arrow key
    {
        moveX = moveX + speed;
        monster.style.left = moveX + "px";
        shape_left.style.left = (parseInt(shape_left.style.left, 10) + speed) + "px";
        shape_right.style.left = (parseInt(shape_right.style.left, 10) + speed) + "px";
        for (let i = 0; i < hold_shapes.length; i++) {
            document.getElementById(hold_shapes[i]['shape'] + "_" + hold_shapes[i]['ID']).style.left = (parseInt(document.getElementById(hold_shapes[i]['shape'] + "_" + hold_shapes[i]['ID']).style.left, 10) + speed) + "px";
        }
    }
    else {  /* stay at current position  */
        monster.style.left = moveX + "px";
        shape_left.style.left = (parseInt(shape_left.style.left, 10)) + "px";
        shape_right.style.left = (parseInt(shape_right.style.left, 10)) + "px";
    }
}


function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

function get_start() {
    create_shapes = setInterval(function () {
        var random_left = Math.floor(getRandomArbitrary(0, (w - 50)));
        var shape = shapes[Math.floor(Math.random() * shapes.length)]['shape'];
        var color = colors[Math.floor(Math.random() * colors.length)]['color'];
        if (shape == "triangle") {
            document.getElementById("shapes").innerHTML += '<div style="position: absolute;left: ' + random_left + 'px;" class="' + shape + '" id="' + shape + '_' + maxIdTriangle + '"></div>';
            document.getElementById("triangle_" + maxIdTriangle).style.borderBottomColor = color;
            let R = setInterval(moving, interval_moving, "triangle", maxIdTriangle);
            currentShapes.push({ "ID": maxIdTriangle, "shape": "triangle", "color":color, "variable": R });
            maxIdTriangle += 1;
        } else if (shape == "circle") {
            document.getElementById("shapes").innerHTML += '<div style="position: absolute;left: ' + random_left + 'px;" class="' + shape + '" id="' + shape + '_' + maxIdCircle + '"></div>';
            document.getElementById(shape + "_" + maxIdCircle).style.backgroundColor = color;
            document.getElementById(shape + "_" + maxIdCircle).style.borderColor = color;
            let R = setInterval(moving, interval_moving, "circle", maxIdCircle);
            currentShapes.push({ "ID": maxIdCircle, "shape": "circle", "color":color, "variable": R });
            maxIdCircle += 1;
        } else if (shape == "square") {
            document.getElementById("shapes").innerHTML += '<div style="position: absolute;left: ' + random_left + 'px;" class="' + shape + '" id="' + shape + '_' + maxIdSquare + '"></div>';
            document.getElementById(shape + "_" + maxIdSquare).style.backgroundColor = color;
            document.getElementById(shape + "_" + maxIdSquare).style.borderColor = color;
            let R = setInterval(moving, interval_moving, "square", maxIdSquare);
            currentShapes.push({ "ID": maxIdSquare, "shape": "square", "color":color, "variable": R });
            maxIdSquare += 1;
        } else if (shape == "skull") {
            document.getElementById("shapes").innerHTML += '<div style="position: absolute;left: ' + random_left + 'px;" class="' + "skull_bomb" + '" id="' + "skull_bomb" + '_' + maxIdSkullBomb + '"></div>';
            document.getElementById("skull_bomb" + "_" + maxIdSkullBomb).style.backgroundImage = "url('./Images/skull.png')";
            let R = setInterval(moving, interval_moving, "skull_bomb", maxIdSkullBomb)
            currentShapes.push({ "ID": maxIdSkullBomb, "shape": "skull_bomb", "color":color, "variable": R });
            maxIdSkullBomb += 1;
        } else if (shape == "bomb") {
            document.getElementById("shapes").innerHTML += '<div style="position: absolute;left: ' + random_left + 'px;" class="' + "skull_bomb" + '" id="' + "skull_bomb" + '_' + maxIdSkullBomb + '"></div>';
            document.getElementById("skull_bomb" + "_" + maxIdSkullBomb).style.backgroundImage = "url('./Images/bomb.png')";
            let R = setInterval(moving, interval_moving, "skull_bomb", maxIdSkullBomb);
            currentShapes.push({ "ID": maxIdSkullBomb, "shape": "skull_bomb", "color":color, "variable": R });
            maxIdSkullBomb += 1;
        }
        if (new Date().getHours() - time_start.getHours() >= 1) {
            clearInterval(create_shapes);
            for (i = 0; i < currentShapes.length; i++) {
                clearInterval(currentShapes[i]['variable']);
            }
            game_over = true;
            document.getElementById("shapes").innerHTML += '<img id="image_gameOver" class="image" src="./Images/game_over.png"></img>';
            if (document.getElementById('i_music').className == 'fa fa-volume-up') {
                audio.src = './Music/gameOver.mp3';
            }
            setTimeout(() => {
                if (document.getElementById('i_music').className == 'fa fa-volume-up') {
                    audio.src = './Music/game_music.mp3';
                }
                document.getElementById("shapes").innerHTML = "";
                currentShapes = [];
                start_var = false;
                maxIdSquare = 0, maxIdCircle = 0, maxIdTriangle = 0, maxIdSkullBomb = 0;
                count_colors_left = 0, count_colors_right = 0, count_left = 0, count_right = 0;
                prev_color_left = "", prev_color_right = "";
                document.getElementById("menu").style.display = "block";
            }, 1700);
        }
    }, interval_creation);
}

var moving = function moving_shape(shape, idx) {
    if (!document.getElementById(shape + "_" + idx).style.top) {
        document.getElementById(shape + "_" + idx).style.top = "0px";
    }
    document.getElementById(shape + "_" + idx).style.top = (parseInt(document.getElementById(shape + "_" + idx).style.top, 10) + 30) + "px";
    if (document.getElementById(shape + "_" + idx).getBoundingClientRect().y >= (h - 50)) {
        // document.getElementById(shape + "_" + idx).style.top = "0px";
        var index = currentShapes.findIndex(x => x.ID === idx && x.shape ===shape);
        clearInterval(currentShapes[index]['variable']);
        document.getElementById(shape + "_" + idx).remove();
        currentShapes.splice(index, 1);
        return;
    }
    if (isLeft(shape, idx)
    ) {
        if (shape == "skull_bomb") {
            prob_lose();
            var index = currentShapes.findIndex(x => x.ID === idx && x.shape ===shape);
            clearInterval(currentShapes[index]['variable']);
            currentShapes.splice(index, 1);
            document.getElementById(shape + "_" + idx).remove();
            return;
        }
        var index = currentShapes.findIndex(x => x.ID === idx && x.shape ===shape);
        clearInterval(currentShapes[index]['variable']);
        check_color(shape, idx, "left");
        document.getElementById(shape + "_" + idx).style.top = parseInt(shape_left.style.top, 10) + "px";
        document.getElementById(shape + "_" + idx).style.left = parseInt(shape_left.style.left, 10) + "px";
        currentShapes.splice(index, 1);
        hold_shapes.push({ "ID": idx, "shape": shape });
        var elem = document.getElementById(shape + "_" + idx);
        document.getElementById(shape + "_" + idx).remove();
        document.getElementById("hold_shapes").appendChild(elem);
        shape_left.style.top = Math.abs((parseInt(shape_left.style.top, 10) - parseInt(shape_left.offsetHeight, 10))) + "px";
        count_left += 1;
        if(count_left == 7){
            prob_lose();
        }
        return;
    } else if (isRight(shape, idx)
    ) {
        if (shape == "skull_bomb") {
            prob_lose();
            var index = currentShapes.findIndex(x => x.ID === idx && x.shape ===shape);
            clearInterval(currentShapes[index]['variable']);
            currentShapes.splice(index, 1);
            document.getElementById(shape + "_" + idx).remove();
            return;
        }
        var index = currentShapes.findIndex(x => x.ID === idx && x.shape ===shape);
        clearInterval(currentShapes[index]['variable']);
        check_color(shape, idx, "right");
        document.getElementById(shape + "_" + idx).style.top = parseInt(shape_right.style.top, 10) + "px";
        document.getElementById(shape + "_" + idx).style.left = parseInt(shape_right.style.left, 10) + "px";
        currentShapes.splice(index, 1);
        hold_shapes.push({ "ID": idx, "shape": shape });
        var elem = document.getElementById(shape + "_" + idx);
        document.getElementById(shape + "_" + idx).remove();
        document.getElementById("hold_shapes").appendChild(elem);
        shape_right.style.top = Math.abs((parseInt(shape_right.style.top, 10) - parseInt(shape_right.offsetHeight, 10))) + "px";
        count_right += 1;
        if(count_right == 7){
            prob_lose();
        }
        return;
    }
}

function isLeft(shape, idx){
    return (Math.abs((shape_left.getBoundingClientRect().x + parseInt(shape_left.offsetWidth, 10) / 2) - (document.getElementById(shape + "_" + idx).getBoundingClientRect().x + parseInt(document.getElementById(shape + "_" + idx).offsetWidth, 10) / 2)) <= 15)
        && (Math.abs((shape_left.getBoundingClientRect().y + parseInt(shape_left.offsetHeight, 10) / 2) - (document.getElementById(shape + "_" + idx).getBoundingClientRect().y + parseInt(document.getElementById(shape + "_" + idx).offsetHeight, 10) / 2)) <= 15);
}

function isRight(shape, idx){
    return (Math.abs((shape_right.getBoundingClientRect().x + parseInt(shape_right.offsetWidth, 10) / 2) - (document.getElementById(shape + "_" + idx).getBoundingClientRect().x + parseInt(document.getElementById(shape + "_" + idx).offsetWidth, 10) / 2)) <= 15)
    && (Math.abs((shape_right.getBoundingClientRect().y + parseInt(shape_right.offsetHeight, 10) / 2) - (document.getElementById(shape + "_" + idx).getBoundingClientRect().y + parseInt(document.getElementById(shape + "_" + idx).offsetHeight, 10) / 2)) <= 15);
}

function check_color(shape, idx, direction){
    if(direction == "left"){
        var index = currentShapes.findIndex(x => x.ID === idx && x.shape ===shape);
        color = currentShapes[index]['color'];
        if(prev_color_left == ""){
            prev_color_left = color;
            count_colors_left += 1;
        }else {
            if(prev_color_left == color){
                count_colors_left += 1;
                if(count_colors_left == 3){
                    increase_score();
                    count_colors_left = 0;
                }
            }else{
                prev_color_left = color;
                count_colors_left = 1;
            }
        }
    }else{
        var index = currentShapes.findIndex(x => x.ID === idx && x.shape ===shape);
        color = currentShapes[index]['color'];
        if(prev_color_right == ""){
            prev_color_right = color;
            count_colors_right += 1;
        }else {
            if(prev_color_right == color){
                count_colors_right += 1;
                if(count_colors_right == 3){
                    increase_score();
                    count_colors_right = 0;
                }
            }else{
                prev_color_right = color;
                count_colors_right = 1;
            }
        }
    }
}

function increase_score(){
    score += 1;
    if(score == 5){
        clearInterval(create_shapes);
        for (i = 0; i < currentShapes.length; i++) {
            clearInterval(currentShapes[i]['variable']);
        }
        win = true;
        document.getElementById("shapes").innerHTML += '<img id="win" class="image" src="./Images/win.png"></img>';
        if (document.getElementById('i_music').className == 'fa fa-volume-up') {
            audio.src = './Music/win.mp3';
        }
        setTimeout(() => {
            if (document.getElementById('i_music').className == 'fa fa-volume-up') {
                audio.src = './Music/game_music.mp3';
            }
            document.getElementById("shapes").innerHTML = "";
            currentShapes = [];
            start_var = false;
            maxIdSquare = 0, maxIdCircle = 0, maxIdTriangle = 0, maxIdSkullBomb = 0;
            count_colors_left = 0, count_colors_right = 0, count_left = 0, count_right = 0;
            prev_color_left = "", prev_color_right = "";
            document.getElementById("menu").style.display = "block";
        }, 2700);
    }else {
        if (document.getElementById('i_music').className == 'fa fa-volume-up') {
            audio.src = './Music/increaseScore.mp3';
        }
        setTimeout(() => {
            if (document.getElementById('i_music').className == 'fa fa-volume-up') {
                audio.src = './Music/game_music.mp3';
            }
        }, 500);
    }
}

function prob_lose() {
    if(score != 0){
        score -= 1;
    }
    if (score == 0 || (count_left >= 7 && count_right >= 7)) {
        clearInterval(create_shapes);
        for (i = 0; i < currentShapes.length; i++) {
            clearInterval(currentShapes[i]['variable']);
        }
        game_over = true;
        document.getElementById("shapes").innerHTML += '<img id="image_gameOver" class="image" src="./Images/game_over.png"></img>';
        if (document.getElementById('i_music').className == 'fa fa-volume-up') {
            audio.src = './Music/gameOver.mp3';
        }
        setTimeout(() => {
            if (document.getElementById('i_music').className == 'fa fa-volume-up') {
                audio.src = './Music/game_music.mp3';
            }
            document.getElementById("shapes").innerHTML = "";
            currentShapes = [];
            start_var = false;
            maxIdSquare = 0, maxIdCircle = 0, maxIdTriangle = 0, maxIdSkullBomb = 0;
            count_colors_left = 0, count_colors_right = 0, count_left = 0, count_right = 0;
            prev_color_left = "", prev_color_right = "";
            document.getElementById("menu").style.display = "block";
        }, 1700);
    } else if(score > 0){
        if (document.getElementById('i_music').className == 'fa fa-volume-up') {
            audio.src = './Music/decreaseScore.mp3';
        }
        setTimeout(() => {
            if (document.getElementById('i_music').className == 'fa fa-volume-up') {
                audio.src = './Music/game_music.mp3';
            }
        }, 500);
    }
}

function start() {
    document.getElementById("menu").style.display = "none";
    start_var = true;
    game_over = false;
    win = false;
    time_start = new Date();
    count_colors_left = 0, count_colors_right = 0, count_left = 0, count_right = 0;
    prev_color_left = "", prev_color_right = "";
    if (shapes.length == 4) {
        shapes.pop();
    } else if (shapes.length == 5) {
        shapes.pop();
        shapes.pop();
    }
    if (document.getElementById("speed").value == "easy" || document.getElementById("speed").value == "level") {
        speed = 10;
        interval_moving = 1000;
        interval_creation = 2000;
    } else if (document.getElementById("speed").value == "medium") {
        speed = 30;
        interval_moving = 500;
        interval_creation = 1000;
        shapes.push({ "shape": "skull", "weight": 1 / 5 });
    } else {
        speed = 50;
        interval_moving = 250;
        interval_creation = 500;
        shapes.push({ "shape": "skull", "weight": 1 / 5 });
        shapes.push({ "shape": "bomb", "weight": 1 / 5 });
    }
    get_start();
}

function pause_resume() {
    if (document.getElementById('i_music').className == 'fa fa-volume-up') {
        document.getElementById('i_music').className = 'fas fa-volume-mute';
        audio.pause();
    } else {
        document.getElementById('i_music').className = 'fa fa-volume-up';
        audio.play();
    }
}

function show_instrs() {
    document.getElementById("menu").style.display = "none";
    document.getElementById("instrs").style.display = "block";
}

function return_to_menu() {
    document.getElementById("menu").style.display = "block";
    document.getElementById("instrs").style.display = "none";
}