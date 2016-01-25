(function() {
    var Editor = Elm.fullscreen(Elm.Editor.Editor);

    Editor.ports.contextChange.subscribe(function() {
        document.getElementById("scroll-container").scrollTop = 0;;
    });
})();
