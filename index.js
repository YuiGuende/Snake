class SnakeDot {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

const ghost = document.getElementById("ghost");
const MOVEMENT_RANGE = 30; // Hằng số bước đi
let speed = 150; // Giảm tốc độ mặc định chút cho mobile dễ thở
let x = 120;
let y = 30;
let pt = 'r';

// --- BIẾN ĐỂ TÍNH TOÁN RESPONSIVE ---
let gameWidth;
let gameHeight;

// Tính toán lại kích thước sân chơi dựa trên màn hình hiện tại
function calculateGameArea() {
    // Lấy chiều rộng màn hình chia cho bước đi (30) rồi nhân lại
    // Để đảm bảo rắn không đi lỡ cỡ ra ngoài mép
    gameWidth = Math.floor(window.innerWidth / MOVEMENT_RANGE) * MOVEMENT_RANGE - MOVEMENT_RANGE;
    gameHeight = Math.floor(window.innerHeight / MOVEMENT_RANGE) * MOVEMENT_RANGE - MOVEMENT_RANGE;
}

calculateGameArea(); // Gọi ngay khi load

let lastX;
let lastY;
let snakeDots = [];
let interValid;

alert("Sẵn sàng chưa vợ iu <3");

// Khởi tạo mồi
for (let i = 0; i < 3; i++) {
    randomDot();
}

// Khởi tạo thân rắn ban đầu
for (let i = 90; i >= 30; i -= 30) {
    snakeDots.push(new SnakeDot(0, i));
    const dot = document.createElement("div");
    dot.id = "snakeDot";
    dot.style.top = `${0}px`;
    dot.style.left = `${i}px`;
    document.getElementById("snakeContainer").append(dot);
}

// --- MAIN LOOP ---
interValid = setInterval(() => {
    reArrangeSnakeBodyLocation();
    
    // Logic di chuyển
    switch (pt) {
        case "u": y -= MOVEMENT_RANGE; break;
        case "d": y += MOVEMENT_RANGE; break;
        case "l": x -= MOVEMENT_RANGE; break;
        case "r": x += MOVEMENT_RANGE; break;
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
    
    // Safe removal
    const container = document.getElementById("snakeContainer");
    if(container.firstElementChild) {
        container.firstElementChild.remove();
    }
}

function changeArray() {
    snakeDots.push(new SnakeDot(x, y));
    snakeDots.reverse();
    snakeDots.pop();
    snakeDots.reverse();
}

function assignLastDotValue() {
    // Kiểm tra an toàn để tránh lỗi undefined khi mảng rỗng (lúc start)
    if(snakeDots.length > 0) {
        lastX = snakeDots[snakeDots.length - 1].x;
        lastY = snakeDots[snakeDots.length - 1].y;
    } else {
        lastX = x; 
        lastY = y;
    }
}

function reSnakeHeadLocation() {
    ghost.style.top = `${y}px`;
    ghost.style.left = `${x}px`;
    
    const dots = document.querySelectorAll("#dot");
    dots.forEach(dot => {
        // So sánh vị trí (Lưu ý: style trả về chuỗi "120px")
        if (dot.style.top === `${y}px` && dot.style.left === `${x}px`) {
            const addDot = document.createElement("div");
            addDot.id = "snakeDot";
            addDot.style.top = `${lastY}px`;
            addDot.style.left = `${lastX}px`;
            document.getElementById("snakeContainer").append(addDot);

            snakeDots.push(new SnakeDot(lastX, lastY));
            if (speed > 50) speed -= 10; // Tăng tốc ít thôi
            
            document.body.removeChild(dot);
            randomDot();
            
            // Reset Interval để cập nhật tốc độ
            clearInterval(interValid);
            interValid = setInterval(() => {
                reArrangeSnakeBodyLocation();
                switch (pt) {
                    case "u": y -= MOVEMENT_RANGE; break;
                    case "d": y += MOVEMENT_RANGE; break;
                    case "l": x -= MOVEMENT_RANGE; break;
                    case "r": x += MOVEMENT_RANGE; break;
                }
                reSnakeHeadLocation();
            }, speed);
        }
    });

    checkBodyCrash();
}

function checkBodyCrash() {
    // 1. Check đâm tường (Dùng biến động gameWidth/Height thay vì số cứng)
    if (y < 0 || y > gameHeight || x < 0 || x > gameWidth) {
        endGame();
        return;
    }
    
    // 2. Check đâm thân
    // Logic cũ của ông so sánh style DOM, tôi giữ nguyên nhưng tối ưu chút
    const bodyDots = document.querySelectorAll("#snakeDot");
    // Bỏ qua cái dot mới nhất vừa thêm vào (nó trùng vị trí đầu là đương nhiên)
    for (let i = 0; i < bodyDots.length - 1; i++) {
        let dot = bodyDots[i];
        if (dot.style.top === `${y}px` && dot.style.left === `${x}px`) {
            endGame();
            return;
        }
    }
}

function endGame() {
    alert(`ĐIỂM CỦA VỢ LÀ ${snakeDots.length}, QUÁ GÀ!`);
    clearInterval(interValid);
    setTimeout(() => location.reload(), 0);
}

function randomDot() {
    // Random trong phạm vi màn hình hiện tại
    let top = getRandomMultiple(0, gameHeight, MOVEMENT_RANGE);
    let left = getRandomMultiple(0, gameWidth, MOVEMENT_RANGE);
    
    const dot = document.createElement("div");
    dot.id = "dot";
    dot.style.top = `${top}px`;
    dot.style.left = `${left}px`;
    document.body.append(dot);
}

function getRandomMultiple(min, max, multiple) {
    let count = Math.floor((max - min) / multiple) + 1;
    let randomIndex = Math.floor(Math.random() * count);
    return min + randomIndex * multiple;
}

// --- CONTROLS ---

// 1. Bàn phím
document.addEventListener("keydown", event => {
    if (event.key.startsWith("Arrow")) {
        switch (event.key) {
            case "ArrowUp": if (pt !== "d") pt = "u"; break;
            case "ArrowDown": if (pt !== "u") pt = "d"; break;
            case "ArrowLeft": if (pt !== "r") pt = "l"; break;
            case "ArrowRight": if (pt !== "l") pt = "r"; break;
        }
    }
});

// 2. Cảm ứng (Vuốt)
let touchStartX = 0;
let touchStartY = 0;

document.addEventListener('touchstart', function(event) {
    touchStartX = event.changedTouches[0].screenX;
    touchStartY = event.changedTouches[0].screenY;
}, false);

document.addEventListener('touchend', function(event) {
    let touchEndX = event.changedTouches[0].screenX;
    let touchEndY = event.changedTouches[0].screenY;
    handleSwipe(touchStartX, touchStartY, touchEndX, touchEndY);
}, false);

function handleSwipe(startX, startY, endX, endY) {
    let diffX = endX - startX;
    let diffY = endY - startY;

    if (Math.abs(diffX) < 30 && Math.abs(diffY) < 30) return; // Chạm nhẹ không tính

    if (Math.abs(diffX) > Math.abs(diffY)) {
        // Vuốt ngang
        if (diffX > 0 && pt !== "l") pt = "r";
        else if (diffX < 0 && pt !== "r") pt = "l";
    } else {
        // Vuốt dọc
        if (diffY > 0 && pt !== "u") pt = "d";
        else if (diffY < 0 && pt !== "d") pt = "u";
    }
}
