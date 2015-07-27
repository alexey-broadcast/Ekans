(function () {
    var scene = new Scene(20, 25);
    window.addEventListener("keydown", scene.onKeyPressed.bind(scene), true);
    window.addEventListener("touchstart", scene.onTouchStarted.bind(scene), true);
    window.addEventListener("touchend", scene.onTouchEnded.bind(scene), true);

    var loopId = setInterval(function () { 
            if (!scene.onTick())
                clearInterval(loopId);
        }, 300);
}) ();  