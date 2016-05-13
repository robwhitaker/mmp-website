var RendererInterface = (function() {

    var Renderer;
    var Reader = Elm.fullscreen(Elm.Reader.Reader,
        { location : window.location.hash
        , chapterRendered :
            { currentPage : 0
            , numPages : 0
            , headingsOnPage : []
            }
        , chapterReflowed : [0, 0, null, []]
        , headingUpdate : []
        , iframeArrows : { x : 0, y : 0 }
        , readEntries : getLocalStorage()
        , setPage : 0
        , mouseClick : []
        , changeHeadingFromCommentsLink : ""
        , readerShareClicked : ""
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

            var scrollToElem = function(elem, onScrollFinish) {
                if(elem == null) return;
                var elemPos = elem.getBoundingClientRect().top - parseInt((elem.currentStyle || window.getComputedStyle(elem)).marginTop);
                var scrollY = window.scrollY;
                var multiplier = 0;
                var multIncr = 0.0001;
                var step = setInterval(function() {
                    if(multiplier < 0.5)
                        multIncr += 0.0006;
                    else
                        multIncr -= 0.0006;
                    if(multIncr <= 0) multIncr = 0.0001;
                    multiplier += multIncr;
                    if(multiplier >= 1) {
                        window.scrollTo(0, elemPos + scrollY);
                        clearInterval(step);
                        step = null;
                        (onScrollFinish || function(){})();
                    } else {
                        window.scrollTo(0, elemPos * multiplier + scrollY);
                    }
                }, 10);
            }

            Renderer.on("rendered", function(renderData) {
                Reader.ports.chapterRendered.send(
                    { "currentPage" : renderData.currentPage
                    , "numPages" : renderData.numPages
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
                        scrollToElem(document.getElementById("comments-box"), function() {
                            Reader.ports.changeHeadingFromCommentsLink.send(id);
                        });
                        break;
                    case "authorsnote":
                        scrollToElem(document.getElementById("authors-note"), function() {
                            Reader.ports.changeHeadingFromCommentsLink.send(id);
                        });
                        break;
                    case "share":
                        Reader.ports.readerShareClicked.send(id);
                        break;
                    default:
                        console.log(link, id);

                }
            });

            Renderer.on("arrows", function(arrows) {
                Reader.ports.iframeArrows.send(arrows);
            });

            Renderer.on("setPage", function(pageNum) {
                // console.log("setPage", pageNum);
                Reader.ports.setPage.send(pageNum);
            });

            Renderer.on("click", function() {
                Reader.ports.mouseClick.send([]);
            });
        });
    }

    Reader.ports.currentChapter.subscribe(function renderChapter(data) {
        if(!Renderer || !Renderer.render) {
            console.log("Renderer not loaded: Waiting...");
            setTimeout(function() { renderChapter(data); }, 100);
        } else {
            // console.log("render", data);
            Renderer.render(data.renderObj, data.eId, data.isPageTurnBack);
        }
    });

    Reader.ports.currentEntry.subscribe(function(data) {
        // console.log("entryChange", data);
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
            // console.log("Goto page: " + pageNum);
            Renderer.goToPage(pageNum);
        }
    });

    Reader.ports.currentDisqusThread.subscribe(function(disqusData) {
        // console.log("disqus", disqusData);
        if(!DISQUS || !DISQUS.reset) return;
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
        document.title = title;
    });

    Reader.ports.shareClicked.subscribe(function(data) {
        var elem = document.getElementById(data.id);
        if(!elem) return;

        var endpoint = elem.getAttribute("data-endpoint");

        var top = (window.screen.availHeight/2 - data.height/2) * 0.3;
        var left = (window.screen.availWidth/2 - data.width/2) * 0.3;

        window.open(endpoint, "Share", "height="+data.height+",width="+data.width+",top="+top+",left="+left);
    });

    setInterval(function() {
        Renderer.refreshCommentCount();
    }, 1000*60*5);

    return { init : init };

})();
