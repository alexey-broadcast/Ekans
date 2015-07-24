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

    if (head.x < 0 || head.x >= this.resolution 
        || head.y < 0 || head.y >= this.resolution)
        console.log('GAME OVER!');
}

Scene.prototype.onTick = function() {
    this.move();
    this.painter.clear();
    this.painter.drawBlocks(this.snake.blocks);
    this.painter.drawCircle(this.apple.x, this.apple.y);

    //var arr = [new Block(0, 0), new Block(0, 1), new Block(0, 2)];
    //console.log("SHAPE: "+this.painter.getShape(arr[1], arr[0], arr[2]));
}

Scene.prototype.onKeyPressed = function (keyEvent) {
    var code = keyEvent.keyCode;
    
    //PAPA todelete>>
    if (code < 37 || code > 40)
        return;
    //PAPA<<

    if (Math.abs(code - this.snake.dir) % 2
        && code > 36 && code < 41)
        this.snake.dir = keyEvent.keyCode;

    this.onTick();
}