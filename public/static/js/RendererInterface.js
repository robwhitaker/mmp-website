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
        , readEntries : getLocalStorage()
        , setPage : 0
        }
    );

    window.location.hash = "";

    function getLocalStorage() {
        var items = [];
        var data = JSON.parse(localStorage.getItem("MMP_ReaderData") || "{}");
        for(key in data)
            items.push([key,data[key]]);

        return items;
    }

    function init(rendererFrame) {
        rendererFrame.addEventListener("load", function() {
            window.Renderer = Renderer = rendererFrame.contentWindow.Renderer;

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
                switch(link) {
                    case "comments":
                        console.log("jump to comments");
                    default:
                        console.log(link, id);

                }
            });

            Renderer.on("arrows", function(arrows) {
                Reader.ports.iframeArrows.send(arrows);
            });

            Renderer.on("setPage", function(pageNum) {
                console.log("setPage", pageNum);
                Reader.ports.setPage.send(pageNum);
            });
        });
    }

    Reader.ports.currentChapter.subscribe(function(chapter) {
        Renderer.render(chapter);
    });

    Reader.ports.currentEntry.subscribe(function(data) {
        var eId = data[0];
        var shouldJump = data[1];

        if(shouldJump) Renderer.goToHeading(eId);

        if(!localStorage) return;

        var data = JSON.parse(localStorage.getItem("MMP_ReaderData") || "{}");
        data[eId] = true;
        localStorage.setItem("MMP_ReaderData", JSON.stringify(data));
    });

    Reader.ports.currentPage.subscribe(function(pageNum) {
        if(pageNum >= 0) {
            Renderer.goToPage(pageNum);
        }
    });

    Reader.ports.currentDisqusThread.subscribe(function(disqusData) {
        DISQUS.reset({
          reload: true,
          config: function () {
            this.page.identifier = disqusData.identifier;
            this.page.url = disqusData.url;
            this.page.title = disqusData.title;
          }
        });
    });

    Reader.ports.title.subscribe(function(title) {
        document.title = title + " | Midnight Murder Party";
    });

    setInterval(function() {
        Renderer.refreshCommentCount();
    }, 1000*60*5);

    return { init : init };

})();
