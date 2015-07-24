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

Painter.shape = {
    left:  0x1,
    up:    0x2,
    right: 0x4,
    down:  0x8
}

Painter.prototype.drawRect = function (x, y, shape) {

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
    var _bodySize = this.rectSize - 2;
    this.context.fillRect(_x + 1, _y + 1, _bodySize, _bodySize);
    console.log("drawRect: ("+x+", "+y+") with shape=" + shape);
    if (shape & Painter.shape.left) {
        console.log("Drawing Painter.shape.left!");
        this.context.fillRect(_x, _y + 1, 1, _bodySize);
    }
    if (shape & Painter.shape.right) {
        console.log("Drawing Painter.shape.right!");
        this.context.fillRect(_x + this.rectSize - 1, _y + 1, 1, _bodySize);
    }
    if (shape & Painter.shape.up) {
        console.log("Drawing Painter.shape.up!");
        this.context.fillRect(_x + 1, _y, _bodySize, 1);
    }
    if (shape & Painter.shape.down) {
        console.log("Drawing Painter.shape.down!");
        this.context.fillRect(_x + 1, _y + this.rectSize - 1, _bodySize, 1);
    }
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

Painter.prototype.drawBlock = function(block, shape) {
    this.drawRect(block.x, block.y, shape);
}

Painter.prototype.getShape = function (block, before, after) {
    console.log("getShape(" + block + ", " + before + ", " + after + ")");
    var shape = 0;
    console.log("0: shape =" + shape);
    if (before) {
        if (block.x === before.x)
            if (block.y < before.y)
                shape |= Painter.shape.down;
            else
                shape |= Painter.shape.up;
        
        console.log("1: shape =" + shape);
        if (block.y === before.y)
            if (block.x < before.x)
                shape |= Painter.shape.right;
            else
                shape |= Painter.shape.left;
        console.log("2: shape =" + shape);
    }
    
    console.log("3: shape =" + shape);
    if (after) {
        if (block.x === after.x)
            if (block.y < after.y)
                shape |= Painter.shape.down;
            else
                shape |= Painter.shape.up;
        
        
        console.log("4: shape =" + shape);
        if (block.y === after.y)
            if (block.x < after.x)
                shape |= Painter.shape.right;
            else
                shape |= Painter.shape.left;
        console.log("5: shape =" + shape);
    }
    console.log("10: shape =" + shape);
    return shape;
}

// list - array of Block instances
Painter.prototype.drawBlocks = function (list) {
    console.log();
    console.log("###### DRAW BLOCKS ######");
    this.context.fillStyle = Painter.colors.snake;
    if(!Array.isArray(list)) {
        console.log('drawBlocks: list is not array!');
        return;
    }
    
    this.drawBlock(list[0], this.getShape(list[0], null, list[1]));
    console.log("drawBlocks: "+list);
    for (var i = 1; i < list.length - 1; ++i) {
        var shape = this.getShape(list[i], list[i - 1], list[i + 1]);
        this.drawBlock(list[i], shape);
    }
    var last = list.length - 1;
    this.drawBlock(list[last], this.getShape(list[last], list[last - 1], null));
};

Painter.prototype.clear = function() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
}