//resolution - count of logical blocks in width and height
//rectSize - size of logical block in pixels
function Painter(resolution, rectSize) {
    this.canvas = document.getElementById('canvas');
    this.context = this.canvas.getContext('2d');
    this.rectSize = rectSize;
    this.resolution = resolution;
    
    this.canvas.style.height = this.canvas.height = rectSize * resolution;
    this.canvas.style.width  = this.canvas.width  = rectSize * resolution;
};

Painter.COLORS = {
    APPLE:      '#15C23C',
    SNAKE:      '#007ACC',
    BACKGROUND: '#3F3F46'
}

Painter.prototype.drawCircle = function (x, y) {
    if (x < 0 || x >= this.resolution || x === undefined) {
        console.log('x=' + x + ' is not valid! return');
        return;
    }
    if (y < 0 || y >= this.resolution || y === undefined) {
        console.log('y=' + y + ' is not valid! return');
        return;
    }
    
    var _x = x * this.rectSize + this.rectSize * 0.5;
    var _y = y * this.rectSize + this.rectSize * 0.5;
    var _radius = this.rectSize * 0.5 - 1;
    this.context.fillStyle = Painter.COLORS.APPLE;
    this.context.beginPath();
    this.context.arc(_x, _y, _radius, 0, 2 * Math.PI, false);
    this.context.fill();
}

Painter.prototype.drawSnakeBlock = function(block) {
    if (block.x < 0 || block.x >= this.resolution || block.x === undefined) {
        console.log('block.x=' + block.x + ' is not valid! return');
        return;
    }
    if (block.y < 0 || block.y >= this.resolution || block.y === undefined) {
        console.log('block.y=' + block.y + ' is not valid! return');
        return;
    }
    
    //calculating fact coordinates
    var _x = block.x * this.rectSize;
    var _y = block.y * this.rectSize;
    var _bodySize = this.rectSize - 2;
    this.context.fillRect(_x + 1, _y + 1, _bodySize, _bodySize);
    
    if (block.dir === Snake.DIRECTION_RIGHT)
        this.context.fillRect(_x - 1, _y + 1, 2, _bodySize);
    if (block.dir === Snake.DIRECTION_LEFT)
        this.context.fillRect(_x + this.rectSize - 1, _y + 1, 2, _bodySize);
    if (block.dir === Snake.DIRECTION_DOWN)
        this.context.fillRect(_x + 1, _y - 1, _bodySize, 2);
    if (block.dir === Snake.DIRECTION_UP)
        this.context.fillRect(_x + 1, _y + this.rectSize - 1, _bodySize, 2);
}

// list - array of SnakeBlock instances
Painter.prototype.drawSnake = function(list) {
    this.context.fillStyle = Painter.COLORS.SNAKE;
    if(!Array.isArray(list)) {
        console.log('drawBlocks: list is not array!');
        return;
    }
    
    this.drawSnakeBlock(list[list.length - 1]);
    for (var i = list.length - 1; i > 0; --i)
        this.drawSnakeBlock(list[i]);
    this.drawSnakeBlock(list[0]);
};


Painter.prototype.clear = function() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
}