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

Painter.colors = {
    apple:      '#15C23C',
    snake:      '#007ACC',
    background: '#3F3F46'
}

Painter.prototype.drawRect = function(x, y) {
    if(x < 0 || x >= this.resolution || x === undefined) {
        console.log('x='+x+' is not valid! return');
        return;
    }
    if(y < 0 || y >= this.resolution || y === undefined) {
        console.log('y='+y+' is not valid! return');
        return;
    }

    //calculating fact coordinates
    var _x = x * this.rectSize;
    var _y = y * this.rectSize;
    this.context.fillRect(_x, _y, this.rectSize, this.rectSize);
};

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
    this.context.fillStyle = Painter.colors.apple;
    this.context.beginPath();
    this.context.arc(_x, _y, _radius, 0, 2 * Math.PI, false);
    this.context.fill();
}

Painter.prototype.drawBlock = function(block) {
    this.drawRect(block.x, block.y);
}

// list - array of Block instances
Painter.prototype.drawBlocks = function(list) {
    this.context.fillStyle = Painter.colors.snake;
    if(!Array.isArray(list)) {
        console.log('drawBlocks: list is not array!');
        return;
    }
    list.forEach(this.drawBlock.bind(this));
};

Painter.prototype.clear = function() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
}