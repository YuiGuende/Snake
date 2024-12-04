class SnakeDot {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}


const ghost = document.getElementById("ghost");
const movementRange = 30;
let speed = 100;
let x = 120;
let y = 30;
let pt = 'r';

alert("Sẵn sàn chưa vợ iu <3");

let lastX;
let lastY;

let snakeDots = [];

for (let i = 0; i < 3; i++) {
    randomDot();
}



for (let i = 90; i >= 30; i -= 30) {//innit tail
    snakeDots.push(new SnakeDot(0, i));
    const dot = document.createElement("div");
    dot.id = "snakeDot";
    dot.style.top = `${0}px`;
    dot.style.left = `${i}px`;
    document.getElementById("snakeContainer").append(dot);
}


let interValid = setInterval(() => {
    reArrangeSnakeBodyLocation();
    switch (pt) {
        case "u":
            y -= movementRange;
            break;
        case "d":
            y += movementRange;
            break;
        case "l":
            x -= movementRange;
            break;
        case "r":
            x += movementRange;
            break;
    }
    reSnakeHeadLocation();

}, speed);


function reArrangeSnakeBodyLocation() {
    const dot = document.createElement("div");
    dot.id = "snakeDot";
    dot.style.top = `${y}px`;
    dot.style.left = `${x}px`;
    document.getElementById("snakeContainer").append(dot);
    changeArray();
    assignLastDotValue();
    document.getElementById("snakeContainer").firstElementChild.remove();
}

function changeArray() {
    snakeDots.push(new SnakeDot(x, y));
    snakeDots.reverse();
    snakeDots.pop();
    snakeDots.reverse();
}

function assignLastDotValue() {
    lastX = snakeDots[snakeDots.length - 1].x;
    lastY = snakeDots[snakeDots.length - 1].y;
}

function reSnakeHeadLocation() {
    ghost.style.top = `${y}px`;
    ghost.style.left = `${x}px`;
    const dots = document.querySelectorAll("#dot");
    dots.forEach(dot => {
        if (dot.style.top === `${y}px` && dot.style.left === `${x}px`) {
            const addDot = document.createElement("div");
            addDot.id = "snakeDot";
            addDot.style.top = `${lastY}px`;
            addDot.style.left = `${lastX}px`;
            document.getElementById("snakeContainer").append(addDot);

            snakeDots.push(new SnakeDot(lastX, lastY));
            speed -= 20;
            document.body.removeChild(dot);
            randomDot();
        }
    });

    checkBodyCrash()
    console.log(y);


}

function checkBodyCrash() {
    const dots = document.querySelectorAll("#snakeDot");
    if ((y <= 0 || y>=930 ) || (x <= 0 || x>=1600 )) {
        alert( `ĐIỂM CỦA VỢ LÀ ${snakeDots.length}, QUÁ GÀ !`);
        clearInterval(interValid);
        setTimeout(() => location.reload(), 0);
    }
    dots.forEach(dot => {
        if (dot.style.top === `${y}px` && dot.style.left === `${x}px`) {
            alert( `ĐIỂM CỦA VỢ LÀ ${snakeDots.length}, QUÁ GÀ !`);
            clearInterval(interValid);
            setTimeout(() => location.reload(), 0);
        }
    });

}

function randomDot() {
    let top = getRandomMultiple(30, 900, 30);
    let left = getRandomMultiple(30, 1600, 30);
    const dot = document.createElement("div");
    dot.id = "dot";
    dot.style.top = `${top}px`;
    dot.style.left = `${left}px`;
    document.body.append(dot);
}

function getRandomMultiple(a, b, c) {
    let min = Math.ceil(a / c) * c;
    let max = Math.floor(b / c) * c;
    let count = (max - min) / c + 1;
    let randomIndex = Math.floor(Math.random() * count);
    return min + randomIndex * c;
}

document.addEventListener("keydown", event => {
    if (event.key.startsWith("Arrow")) {
        switch (event.key) {
            case "ArrowUp":
                if (pt !== "d") {
                    pt = "u";
                }
                break;
            case "ArrowDown":
                if (pt !== "u") {
                    pt = "d";
                }
                break;
            case "ArrowLeft":
                if (pt !== "r") {
                    pt = "l";
                }
                break;
            case "ArrowRight":
                if (pt !== "l") {
                    pt = "r";
                }
                break;
        }
    }
});