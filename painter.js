//resolution - count of logical blocks in width and height
//rectSize - size of logical block in pixels
function Painter(res, rSize) {
    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');
    var rectSize = rSize;
    var resolution = res;
    
    var Color = {
        APPLE: '#15C23C',
        SNAKE: '#007ACC',
        BACKGROUND: '#3F3F46'
    }
    
    canvas.style.height = canvas.height = rectSize * resolution;
    canvas.style.width = canvas.width = rectSize * resolution;
    canvas.style['background-color'] = Color.BACKGROUND;
    
    function drawSnakeBlock(block) {
        if (block.x < 0 || block.x >= resolution || block.x === undefined) {
            console.log('block.x=' + block.x + ' is not valid! return');
            return;
        }
        if (block.y < 0 || block.y >= resolution || block.y === undefined) {
            console.log('block.y=' + block.y + ' is not valid! return');
            return;
        }
        
        //calculating fact coordinates
        var _x = block.x * rectSize;
        var _y = block.y * rectSize;
        var _bodySize = rectSize - 2;
        context.fillRect(_x + 1, _y + 1, _bodySize, _bodySize);
        
        if (block.dir === Snake.Direction.RIGHT)
            context.fillRect(_x - 1, _y + 1, 2, _bodySize);
        if (block.dir === Snake.Direction.LEFT)
            context.fillRect(_x + rectSize - 1, _y + 1, 2, _bodySize);
        if (block.dir === Snake.Direction.DOWN)
            context.fillRect(_x + 1, _y - 1, _bodySize, 2);
        if (block.dir === Snake.Direction.UP)
            context.fillRect(_x + 1, _y + rectSize - 1, _bodySize, 2);
    }

    return {
        drawSnake: function (list) {
            // list - array of SnakeBlock instances
            context.fillStyle = Color.SNAKE;
            if (!Array.isArray(list)) {
                console.log('drawSnake: list is not array!');
                return;
            }
    
            drawSnakeBlock(list[list.length - 1]);
            for (var i = list.length - 1; i > 0; --i)
                drawSnakeBlock(list[i]);
            drawSnakeBlock(list[0]);
        },
                
        drawCircle: function (x, y) {
            if (x < 0 || x >= resolution || x === undefined) {
                console.log('x=' + x + ' is not valid! return');
                return;
            }
            if (y < 0 || y >= resolution || y === undefined) {
                console.log('y=' + y + ' is not valid! return');
                return;
            }
            
            var _x = x * rectSize + rectSize * 0.5;
            var _y = y * rectSize + rectSize * 0.5;
            var _radius = rectSize * 0.5 - 1;
            context.fillStyle = Color.APPLE;
            context.beginPath();
            context.arc(_x, _y, _radius, 0, 2 * Math.PI, false);
            context.fill();
        },
        
        clear: function () {
            context.clearRect(0, 0, canvas.width, canvas.height);
        }
    }
};
