(function () {
    "use strict";
    var scene;
    var loopId;

    var newGame_btn = document.getElementById('btn-new');
    var pause_btn = document.getElementById('btn-pause');
    var pauseText = document.querySelector('#btn-pause i');
    var PLAY_TEXT = "play_arrow";
    var PAUSE_TEXT = "pause";

    function gameInterval() {
        return setInterval(function () {
            if (!scene.onTick())
                clearInterval(loopId);
        }, 150);
    }

    function newGame() {
        scene = new Scene(20, 25);
        window.addEventListener("keydown", scene.onKeyPressed.bind(scene), true);
        window.addEventListener("touchstart", scene.onTouchStarted.bind(scene), true);
        window.addEventListener("touchend", scene.onTouchEnded.bind(scene), true);

        if (loopId)
            clearInterval(loopId);

        loopId = gameInterval();
        pauseText.innerHTML = PAUSE_TEXT;
    }

    function togglePause() {
        if(loopId) {
            clearInterval(loopId);
            loopId = false;
            pauseText.innerHTML = PLAY_TEXT;
        }
        else {
            loopId = gameInterval();
            pauseText.innerHTML = PAUSE_TEXT;
        }
    }

    newGame_btn.onclick = newGame;
    pause_btn.onclick = togglePause;

    newGame();
}) ();  