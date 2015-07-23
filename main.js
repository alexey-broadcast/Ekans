(function () {
    // console.log("I'm working!");
    // var painter = new Painter();

    // var blocks = [];
    // var i = 0;
    // function updateScene() {
    //     var blocks = [];
    //     blocks.push(new Block(i, i));
    //     blocks.push(new Block(i, i+1));
    //     blocks.push(new Block(i+1, i+1));
    //     painter.drawBlocks(blocks);
    // }

    // setInterval(function() {
    //     updateScene();
    //     i++;
    // }, 500);

    var scene = new Scene();
    window.addEventListener("keydown", scene.onKeyPressed.bind(scene), true);
    //setInterval(scene.onTick.bind(scene), 500);
}) ();