var RendererInterface = (function() {

    var Renderer;
    var Reader = Elm.fullscreen(Elm.Reader.Reader,
        { location : window.location.hash
        , chapterRendered :
            { numPages : 0
            , headingsOnPage : []
            }
        , chapterReflowed : [0, 0, null, []]
        , headingUpdate : []
        , iframeArrows : { x : 0, y : 0 }
        }
    );

    window.location.hash = "";


    function init(rendererFrame) {
        rendererFrame.addEventListener("load", function() {
            Renderer = rendererFrame.contentWindow.Renderer;

            Renderer.on("rendered", function(renderData) {
                Reader.ports.chapterRendered.send(
                    { "numPages" : renderData.numPages
                    , "headingsOnPage" : Array.prototype.filter.call(renderData.headingsOnPage, function() { return true; })
                    }
                );
            });

            Renderer.on("reflowed", function(renderData) {
                Reader.ports.chapterReflowed.send(
                    [ renderData.currentPage
                    , renderData.numPages
                    , renderData.focusedHeading
                    , Array.prototype.filter.call(renderData.headingsOnPage, function() { return true; })
                    ]
                );
            });

            Renderer.on("pageTurned", function(headingsOnPage) {
                Reader.ports.headingUpdate.send(
                    Array.prototype.filter.call(headingsOnPage, function() { return true; })
                );
            });

            Renderer.on("linkClick", function(link, id) {
                alert(link + " " + id);
            });

            Renderer.on("arrows", function(arrows) {
                Reader.ports.iframeArrows.send(arrows);
            });
        });
    }

    Reader.ports.currentChapter.subscribe(function(chapter) {
        Renderer.render(chapter);
    });

    Reader.ports.currentPage.subscribe(function(pageNum) {
        if(pageNum >= 0)
            Renderer.goToPage(pageNum);
    });

    return { init : init };

})();
