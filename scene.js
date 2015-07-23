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
    up:     0,
    down:   1,
    left:   2,
    right:  3
}

Snake.prototype.move = function () {
    var head = Object.create(this.blocks[0]);
    switch (this.dir) {
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
    this.blocks.pop();
    this.blocks.unshift(head);
}



function Scene() {
    this.painter = new Painter();
    this.snake = new Snake();
}

Scene.prototype.onTick = function() {
    this.snake.move();
    this.painter.drawBlocks(this.snake.blocks);
}

Scene.prototype.onKeyPressed = function (keyEvent) {
    console.log(keyEvent);
    switch (keyEvent.keyIdentifier) {
        case "Left":
            this.snake.dir = Snake.direction.left;
            break;
        case "Right":
            this.snake.dir = Snake.direction.right;
            break;
        case "Up":
            this.snake.dir = Snake.direction.up;
            break;
        case "Down":
            this.snake.dir = Snake.direction.down;
            break;
    }

    this.onTick();
}