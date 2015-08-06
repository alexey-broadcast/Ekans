(function () {
    "use strict"
    var scene;
    var loopId;

    function newGame() {
        scene = new Scene(20, 25);
        window.addEventListener("keydown", scene.onKeyPressed.bind(scene), true);
        window.addEventListener("touchstart", scene.onTouchStarted.bind(scene), true);
        window.addEventListener("touchend", scene.onTouchEnded.bind(scene), true);

        if (loopId)
            clearInterval(loopId);

        loopId = setInterval(function () {
            if (!scene.onTick())
                clearInterval(loopId);
        }, 300);
    }

    document.getElementById('btn-new').onclick = newGame;

    newGame();
}) ();  