//logical block with logical coordinates
function Block(x, y) {
    this.x = x;
    this.y = y;
};

Block.prototype.toString = function() {
    return '('+this.x+', '+this.y+')';
}

function SnakeBlock(x, y, dir) {
    Block.apply(this, arguments);

    this.dir = dir;
}

SnakeBlock.prototype = Object.create(Block.prototype);
SnakeBlock.prototype.constructor = SnakeBlock;


/////////////////////////////////////////////////////


function Snake() {
    this.blocks = [new SnakeBlock(0, 0, Snake.direction.up), 
        new SnakeBlock(0, 1, Snake.direction.up), 
        new SnakeBlock(0, 2, Snake.direction.up), 
        new SnakeBlock(0, 3, Snake.direction.up), 
        new SnakeBlock(0, 4, Snake.direction.up), 
        new SnakeBlock(0, 5, Snake.direction.up), 
        new SnakeBlock(0, 6, Snake.direction.up), 
        new SnakeBlock(0, 7, Snake.direction.up), 
        new SnakeBlock(0, 8, Snake.direction.up), 
        new SnakeBlock(0, 9, Snake.direction.up), 
        new SnakeBlock(0, 10, Snake.direction.up),
        new SnakeBlock(0, 11, Snake.direction.up), 
        new SnakeBlock(0, 12, Snake.direction.up), 
        new SnakeBlock(0, 13, Snake.direction.up), 
        new SnakeBlock(0, 14, Snake.direction.up), 
        new SnakeBlock(0, 15, Snake.direction.up), 
        new SnakeBlock(0, 16, Snake.direction.up), 
        new SnakeBlock(0, 17, Snake.direction.up), 
        new SnakeBlock(0, 18, Snake.direction.up), 
        new SnakeBlock(0, 19, Snake.direction.up) 
    ];
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

function Scene(resolution, rectSize) {
    this.resolution = resolution;
    this.rectSize = rectSize;
    
    this.painter = new Painter(this.resolution, this.rectSize);
    this.snake = new Snake();
    this.apple = this.generateApple();

    this.painter.clear();
    this.painter.drawSnake(this.snake.blocks);
    this.painter.drawCircle(this.apple.x, this.apple.y);
}

Scene.prototype.generateApple = function () {
    var generateRandom = (function () {
        return (Math.random() * this.resolution) ^ 0;
    }).bind(this);
    
    var apple = new Block(generateRandom(), generateRandom());
    
    while (!this.isBlockValid(apple)) {
        apple = new Block(generateRandom(), generateRandom());
    }

    return apple;
}

Scene.prototype.isBlockValid = function(block) {
    for (var snakeBlock of this.snake.blocks)
        if(block.x === snakeBlock.x && block.y === snakeBlock.y)
            return false;
    
    if (block.x < 0 || block.x >= this.resolution 
        || block.y < 0 || block.y >= this.resolution)
        return false;

    return true;
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
    head.dir = this.snake.dir;
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
    this.painter.drawSnake(this.snake.blocks);
    this.painter.drawCircle(this.apple.x, this.apple.y);
}

Scene.prototype.onKeyPressed = function (keyEvent) {
    var code = keyEvent.keyCode;

    if (Math.abs(code - this.snake.dir) % 2
        && code > 36 && code < 41)
        this.snake.dir = keyEvent.keyCode;

    this.onTick();
}