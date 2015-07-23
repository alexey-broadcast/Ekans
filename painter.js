function Painter() {
    this.canvas = document.getElementById('canvas');
    this.context = this.canvas.getContext('2d');
    this.rectSize = 25;

    this.canvas.height = 500;
    this.canvas.width = 500;
};

Painter.prototype.drawRect = function(x, y) {
    if(x < 0 || x > 19 || x === undefined) {
        console.log('x='+x+' is not valid! return');
        return;
    }
    if(y < 0 || y > 19 || y === undefined) {
        console.log('y='+y+' is not valid! return');
        return;
    }

    //calculating fact coordinates
    var _x = x * this.rectSize;
    var _y = y * this.rectSize;
    this.context.fillRect(_x, _y, this.rectSize, this.rectSize);
};

Painter.prototype.drawBlock = function(block) {
    this.drawRect(block.x, block.y);
}

// list - array of Block instances
Painter.prototype.drawBlocks = function(list) {
    this.clear();
    if(!Array.isArray(list)) {
        console.log('drawBlocks: list is not array!');
        return;
    }
    list.forEach(this.drawBlock.bind(this));
};

Painter.prototype.clear = function() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
}