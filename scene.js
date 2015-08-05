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
    this.blocks = [new SnakeBlock(0, 0, Snake.Direction.UP), 
        new SnakeBlock(0, 1, Snake.Direction.UP), 
        new SnakeBlock(0, 2, Snake.Direction.UP), 
        new SnakeBlock(0, 3, Snake.Direction.UP), 
        new SnakeBlock(0, 4, Snake.Direction.UP), 
        new SnakeBlock(0, 5, Snake.Direction.UP), 
        new SnakeBlock(0, 6, Snake.Direction.UP), 
        new SnakeBlock(0, 7, Snake.Direction.UP), 
        new SnakeBlock(0, 8, Snake.Direction.UP), 
        new SnakeBlock(0, 9, Snake.Direction.UP), 
        new SnakeBlock(0, 10, Snake.Direction.UP),
        new SnakeBlock(0, 11, Snake.Direction.UP), 
        new SnakeBlock(0, 12, Snake.Direction.UP), 
        new SnakeBlock(0, 13, Snake.Direction.UP), 
        new SnakeBlock(0, 14, Snake.Direction.UP), 
        new SnakeBlock(0, 15, Snake.Direction.UP), 
        new SnakeBlock(0, 16, Snake.Direction.UP), 
        new SnakeBlock(0, 17, Snake.Direction.UP), 
        new SnakeBlock(0, 18, Snake.Direction.UP), 
        new SnakeBlock(0, 19, Snake.Direction.UP)
    ];
    
    this.dir = Snake.Direction.RIGHT;
    this.nextDir = Snake.Direction.RIGHT;

    Object.defineProperty(this, 'head', {
        get: function () {
            return this.blocks[0];
        }
    });
}

Snake.prototype.setDir = function (dir) {
    console.log('setDir:'+dir);
    if ( (dir - this.dir) % 2  &&  dir > 36  &&  dir < 41 )
        this.nextDir = dir;
}


Snake.Direction = {
    LEFT  : 37,
    UP    : 38,
    RIGHT : 39,
    DOWN  : 40
};



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
    this.snake.dir = this.snake.nextDir;

    var head = Object.create(this.snake.head);
    switch (this.snake.dir) {
        case Snake.Direction.RIGHT:
            head.x++;
            break;
        case Snake.Direction.LEFT:
            head.x--;
            break;
        case Snake.Direction.UP:
            head.y--;
            break;
        case Snake.Direction.DOWN:
            head.y++;
    }
    
    if (!this.isEmptyBlock(head))
        return false;
    
    head.dir = this.snake.dir;

    this.snake.blocks.unshift(head);

    if (head.x === this.apple.x && head.y === this.apple.y)
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
            this.snake.setDir(Snake.Direction.DOWN);
        else
            this.snake.setDir(Snake.Direction.UP);
    }
    else {
        if (dx > 0)
            this.snake.setDir(Snake.Direction.RIGHT);
        else
            this.snake.setDir(Snake.Direction.LEFT);
    }

    this.touchStart = undefined;
}