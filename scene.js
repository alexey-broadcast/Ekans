//logical block with logical coordinates
function Block(x, y) {
    this.x = x;
    this.y = y;
};

Block.prototype.toString = function() {
    return '('+this.x+', '+this.y+')';
}


function Snake() {
    this.blocks = [new Block(0, 0), new Block(0, 1), new Block(0, 2)];
    this.dir = Snake.direction.right;

    Object.defineProperty(this, 'head', {
        get: function () {
            return this.blocks[0];
        }
    });
}

Snake.direction = {
    left:  37,
    up:    38,
    right: 39,
    down:  40
}




/////////////////////////////////////////////////////

function Scene() {
    this.rectSize = 25;
    this.resolution = 5;
    this.painter = new Painter(this.resolution, this.rectSize);
    this.snake = new Snake();
    this.apple = this.generateApple();
}

Scene.prototype.generateApple = function () {
    var generateRandom = (function () {
        return (Math.random() * this.resolution) ^ 0;
    }).bind(this);
    
    var apple = new Block(generateRandom(), generateRandom());
    
    var isAppleValid = (function () {
        console.log("isAppleValid: " + apple);
        for (block of this.snake.blocks) {
            if (block.x == apple.x && block.y == apple.y) {
                console.log("not ok!");
                return false;
            }
        }
        console.log("TRUE!")
        return true;
    }).bind(this);

    console.log("search in " + this.snake.blocks);
    while (!isAppleValid()) {
        apple = new Block(generateRandom(), generateRandom());
    }

    return apple;
}

Scene.prototype.move = function () {
    var head = Object.create(this.snake.head);
    switch (this.snake.dir) {
        case Snake.direction.right:
            head.x++;
            break;
        case Snake.direction.left:
            head.x--;
            break;
        case Snake.direction.up:
            head.y--;
            break;
        case Snake.direction.down:
            head.y++;
    }
    this.snake.blocks.unshift(head);

    if (head.x === this.apple.x && head.y === this.apple.y)
        this.apple = this.generateApple();
    else
        this.snake.blocks.pop();
}

Scene.prototype.onTick = function() {
    this.move();
    this.painter.clear();
    this.painter.drawBlocks(this.snake.blocks);
    this.painter.drawCircle(this.apple.x, this.apple.y);
}

Scene.prototype.onKeyPressed = function (keyEvent) {
    console.log();
    
    if(Math.abs(keyEvent.keyCode - this.snake.dir) % 2)
        this.snake.dir = keyEvent.keyCode;

    this.onTick();
}