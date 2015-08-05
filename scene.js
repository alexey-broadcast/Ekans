"use strict"
//logical block with logical coordinates
function Block(x, y) {
    this.x = x;
    this.y = y;
};

Block.prototype.toString = function() {
    return '('+this.x+', '+this.y+')';
}

Block.prototype.isEqual = function (another) {
    return this.x === another.x && this.y === another.y;
}

function SnakeBlock(x, y, dir) {
    Block.apply(this, arguments);
    this.dir = dir;
}

SnakeBlock.prototype = Object.create(Block.prototype);
SnakeBlock.prototype.constructor = SnakeBlock;


/////////////////////////////////////////////////////


function Snake() {
    this.blocks = [new SnakeBlock(0, 0, Scene.SnakeDirection.UP), 
        new SnakeBlock(0, 1, Scene.SnakeDirection.UP), 
        new SnakeBlock(0, 2, Scene.SnakeDirection.UP), 
        new SnakeBlock(0, 3, Scene.SnakeDirection.UP), 
        new SnakeBlock(0, 4, Scene.SnakeDirection.UP), 
        new SnakeBlock(0, 5, Scene.SnakeDirection.UP), 
        new SnakeBlock(0, 6, Scene.SnakeDirection.UP), 
        new SnakeBlock(0, 7, Scene.SnakeDirection.UP), 
        new SnakeBlock(0, 8, Scene.SnakeDirection.UP), 
        new SnakeBlock(0, 9, Scene.SnakeDirection.UP), 
        new SnakeBlock(0, 10, Scene.SnakeDirection.UP),
        new SnakeBlock(0, 11, Scene.SnakeDirection.UP), 
        new SnakeBlock(0, 12, Scene.SnakeDirection.UP), 
        new SnakeBlock(0, 13, Scene.SnakeDirection.UP), 
        new SnakeBlock(0, 14, Scene.SnakeDirection.UP), 
        new SnakeBlock(0, 15, Scene.SnakeDirection.UP), 
        new SnakeBlock(0, 16, Scene.SnakeDirection.UP), 
        new SnakeBlock(0, 17, Scene.SnakeDirection.UP), 
        new SnakeBlock(0, 18, Scene.SnakeDirection.UP), 
        new SnakeBlock(0, 19, Scene.SnakeDirection.UP)
    ];
    
    this.dir = Scene.SnakeDirection.RIGHT;
    this.nextDir = Scene.SnakeDirection.RIGHT;

    Object.defineProperties(this, {
        'head': {
            get: function () {
                return this.blocks[0];
            }
        },
        'tail': {
            get: function () {
                return this.blocks[this.blocks.length - 1];
            }
        }
    });
}

Snake.prototype.setDir = function (dir) {
    console.log('setDir:'+dir);
    if ( (dir - this.dir) % 2  &&  dir > 36  &&  dir < 41 )
        this.nextDir = dir;
}



/////////////////////////////////////////////////////

function Scene(resolution, rectSize) {
    this.resolution = resolution;
    this.rectSize = rectSize;
    
    this.painter = Painter(this.resolution, this.rectSize);
    this.snake = new Snake();
    this.apple = this.generateApple();
    
    this.painter.clear();
    this.painter.drawSnake(this.snake.blocks);
    this.painter.drawCircle(this.apple.x, this.apple.y);
}

Scene.SnakeDirection = {
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40
};

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
        if(block.isEqual(this.snake.blocks[i]))
            return false;

    return true;
}

Scene.prototype.move = function () {
    this.snake.dir = this.snake.nextDir;

    var newHead = Object.create(this.snake.head);
    switch (this.snake.dir) {
        case Scene.SnakeDirection.RIGHT:
            newHead.x++;
            break;
        case Scene.SnakeDirection.LEFT:
            newHead.x--;
            break;
        case Scene.SnakeDirection.UP:
            newHead.y--;
            break;
        case Scene.SnakeDirection.DOWN:
            newHead.y++;
    }
    
    if (!this.isEmptyBlock(newHead) && !newHead.isEqual(this.snake.tail))
        return false;
    
    newHead.dir = this.snake.dir;

    this.snake.blocks.unshift(newHead);

    if (newHead.x === this.apple.x && newHead.y === this.apple.y)
        this.apple = this.generateApple();
    else {
        this.snake.blocks.pop();
        this.snake.blocks[this.snake.blocks.length - 1].dir = 0;
    }

    return true;
}


//returns false if GAMEOVER
Scene.prototype.onTick = function () {
    if (!this.move())
        return false;
    this.painter.clear();
    this.painter.drawSnake(this.snake.blocks);
    this.painter.drawCircle(this.apple.x, this.apple.y);
    return true;
}

Scene.prototype.onKeyPressed = function (keyEvent) {
    this.snake.setDir(keyEvent.keyCode);
}

Scene.prototype.onTouchStarted = function (touchEvent) {
    touchEvent.preventDefault();

    var touch = touchEvent.touches[0];
    this.touchStart = { x: touch.pageX, y: touch.pageY };
}

Scene.prototype.onTouchEnded = function (touchEvent) {
    touchEvent.preventDefault();
    if (this.touchStart === undefined)
        return;
    
    console.log(touchEvent);
    var touch = touchEvent.changedTouches[0];

    var dx = touch.pageX - this.touchStart.x;
    var dy = touch.pageY - this.touchStart.y;
    
    if (Math.abs(dy) > Math.abs(dx)) {
        if (dy > 0)
            this.snake.setDir(Scene.SnakeDirection.DOWN);
        else
            this.snake.setDir(Scene.SnakeDirection.UP);
    }
    else {
        if (dx > 0)
            this.snake.setDir(Scene.SnakeDirection.RIGHT);
        else
            this.snake.setDir(Scene.SnakeDirection.LEFT);
    }

    this.touchStart = undefined;
}