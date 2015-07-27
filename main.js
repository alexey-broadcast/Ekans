(function () {
    var scene = new Scene(20, 25);
    window.addEventListener("keydown", scene.onKeyPressed.bind(scene), true);

    //setInterval(scene.onTick.bind(scene), 300);
}) ();