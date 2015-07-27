//logical block with logical coordinates
function Block(x, y) {
    this.x = x;
    this.y = y;
};

Block.prototype.toString = function() {
    return '('+this.x+', '+this.y+')';
}

function SnakeBlock(x, y, before) {
    Block.apply(this, arguments);
    this.setShape(before);
}

SnakeBlock.prototype = Object.create(Block.prototype);
SnakeBlock.prototype.constructor = SnakeBlock;

SnakeBlock.SHAPE_LEFT   = 1;
SnakeBlock.SHAPE_UP     = 2;
SnakeBlock.SHAPE_RIGHT  = 4;
SnakeBlock.SHAPE_DOWN   = 8;


SnakeBlock.prototype.setShape = function (before) {
    if (before === undefined || this.shape === undefined) {
        this.shape = 0;
        return;
    }
    this.shape = 0;

    if (before.x == this.x) {
        if (before.y < this.y) {
            this.shape |= SnakeBlock.SHAPE_UP;
            before.shape |= SnakeBlock.SHAPE_DOWN;
        }
        else {
            this.shape |= SnakeBlock.SHAPE_DOWN;
            before.shape |= SnakeBlock.SHAPE_UP;
        }
    }
    
    if (before.y == this.y) {
        if (before.x < this.x) {
            this.shape |= SnakeBlock.SHAPE_LEFT;
            before.shape |= SnakeBlock.SHAPE_RIGHT;
        }
        else {
            this.shape |= SnakeBlock.SHAPE_RIGHT;
            before.shape |= SnakeBlock.SHAPE_LEFT;
        }
    }
}

/////////////////////////////////////////////////////


function Snake() {
    this.blocks = [new SnakeBlock(0, 0), 
        new SnakeBlock(0, 1), 
        new SnakeBlock(0, 2), 
        new SnakeBlock(0, 3), 
        new SnakeBlock(0, 4), 
        new SnakeBlock(0, 5), 
        new SnakeBlock(0, 6), 
        new SnakeBlock(0, 7), 
        new SnakeBlock(0, 8), 
        new SnakeBlock(0, 9), 
        new SnakeBlock(0, 10),
        new SnakeBlock(0, 11), 
        new SnakeBlock(0, 12), 
        new SnakeBlock(0, 13), 
        new SnakeBlock(0, 14), 
        new SnakeBlock(0, 15), 
        new SnakeBlock(0, 16), 
        new SnakeBlock(0, 17), 
        new SnakeBlock(0, 18), 
        new SnakeBlock(0, 19)
    ];
    
    for (var i = 0; i < this.blocks.length; ++i)
        this.blocks[i].setShape(this.blocks[i - 1]);

    this.dir = Snake.DIRECTION_RIGHT;

    Object.defineProperty(this, 'head', {
        get: function () {
            return this.blocks[0];
        }
    });
}

Snake.prototype.cleanTailShape = function () {
    var tailInd = this.blocks.length - 1;
    this.blocks[tailInd].setShape(this.blocks[tailInd - 1]);
}

Snake.DIRECTION_LEFT  = 37;
Snake.DIRECTION_UP    = 38;
Snake.DIRECTION_RIGHT = 39;
Snake.DIRECTION_DOWN  = 40;




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
    
    while (!this.isEmptyBlock(apple)) {
        apple = new Block(generateRandom(), generateRandom());
    }

    return apple;
}

Scene.prototype.isEmptyBlock = function (block) {
    if (block.x < 0 || block.x >= this.resolution 
        || block.y < 0 || block.y >= this.resolution)
        return false;

    for (var i in this.snake.blocks)
        if(block.x === this.snake.blocks[i].x && block.y === this.snake.blocks[i].y)
            return false;

    return true;
}

Scene.prototype.move = function () {
    var head = Object.create(this.snake.head);
    switch (this.snake.dir) {
        case Snake.DIRECTION_RIGHT:
            head.x++;
            break;
        case Snake.DIRECTION_LEFT:
            head.x--;
            break;
        case Snake.DIRECTION_UP:
            head.y--;
            break;
        case Snake.DIRECTION_DOWN:
            head.y++;
    }
    
    if (!this.isEmptyBlock(head))
        return false;
    
    head.setShape(this.snake.head);
    this.snake.blocks.unshift(head);

    if (head.x === this.apple.x && head.y === this.apple.y)
        this.apple = this.generateApple();
    else {
        this.snake.blocks.pop();
        this.snake.cleanTailShape();
    }

    return true;
}

//returns false if GAMEOVER
Scene.prototype.onTick = function() {
    if (!this.move())
        return false;
    this.painter.clear();
    this.painter.drawSnake(this.snake.blocks);
    this.painter.drawCircle(this.apple.x, this.apple.y);
    return true;
}

Scene.prototype.onKeyPressed = function (keyEvent) {
    var code = keyEvent.keyCode;

    if (Math.abs(code - this.snake.dir) % 2
        && code > 36 && code < 41)
        this.snake.dir = keyEvent.keyCode;
}