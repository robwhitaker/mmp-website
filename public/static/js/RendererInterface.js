var RendererInterface = (function() {

    var Renderer;
    var Reader = window.Reader = Elm.Reader.Main.fullscreen(
        { location : window.location.hash
        , readEntries : getLocalStorage()
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

    function init(rendererFrameId) {
        var rendererFrame = document.getElementById(rendererFrameId);
        if(!rendererFrame) {
            setTimeout(function() { init(rendererFrameId); }, 100);
            return;
        }

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
                    , "focusedHeading" : null
                    , "headingsOnPage" : Array.prototype.filter.call(renderData.headingsOnPage, function() { return true; })
                    }
                );
            });

            Renderer.on("reflowed", function(renderData) {
                Reader.ports.chapterReflowed.send(
                    { "currentPage" : renderData.currentPage
                    , "numPages" : renderData.numPages
                    , "focusedHeading" : renderData.focusedHeading
                    , "headingsOnPage" : Array.prototype.filter.call(renderData.headingsOnPage, function() { return true; })
                    }
                );
            });

            Renderer.on("pageTurned", function(headingsOnPage) {
                Reader.ports.headingsUpdated.send(
                    Array.prototype.filter.call(headingsOnPage, function() { return true; })
                );
            });

            Renderer.on("linkClick", function(link, id) {
                switch(link) {
                    case "comments":
                        scrollToElem(document.getElementById("comments-box"), function() {
                            Reader.ports.inlineLinkClicked.send(id);
                        });
                        break;
                    case "authorsnote":
                        scrollToElem(document.getElementById("authors-note"), function() {
                            Reader.ports.inlineLinkClicked.send(id);
                        });
                        break;
                    case "share":
                        Reader.ports.inlineShareClicked.send(id);
                        break;
                    default:
                        console.log(link, id);

                }
            });

            Renderer.on("keyPress", function(keyCode) {
                Reader.ports.keyPressedInReader.send(keyCode);
            });

            Renderer.on("setPage", function(pageNum) {
                console.log(pageNum)
                Reader.ports.pageSet.send(pageNum);
            });

            Renderer.on("click", function() {
                Reader.ports.mouseClickedInReader.send(null);
            });
        });
    }

    Reader.ports.renderChapter.subscribe(function renderChapter(data) {
        if(!Renderer || !Renderer.render) {
            console.log("Renderer not loaded: Waiting...");
            setTimeout(function() { renderChapter(data); }, 100);
        } else {
            Renderer.render(data.renderObj, data.eId, data.isPageTurnBack);
        }
    });

    Reader.ports.setReadInStorage.subscribe(function(eId) {
        if(!localStorage) return;

        var data = JSON.parse(localStorage.getItem("MMP_ReaderData") || "{}");
        data[eId] = true;
        localStorage.setItem("MMP_ReaderData", JSON.stringify(data));
    });

    Reader.ports.jumpToEntry.subscribe(function(eId) {
        console.log(eId);
        Renderer.goToHeading(eId);
    });

    Reader.ports.setPage.subscribe(function(pageNum) {
        Renderer.goToPage(pageNum);
    });

    Reader.ports.switchDisqusThread.subscribe(function(disqusData) {
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

    Reader.ports.setTitle.subscribe(function(title) {
        document.title = title;
    });

    Reader.ports.openSharePopup.subscribe(function(data) {
        var elem = document.getElementsByClassName(data.srcBtnClass)[0];
        if(!elem) return;

        var endpoint = elem.getAttribute("data-endpoint");

        var top = (window.screen.availHeight/2 - data.height/2) * 0.3;
        var left = (window.screen.availWidth/2 - data.width/2) * 0.3;

        window.open(endpoint, "Share", "height="+data.height+",width="+data.width+",top="+top+",left="+left);
    });

    setInterval(function() {
        if(!Renderer) return;
        Renderer.refreshCommentCount();
    }, 1000*60*5);

    return { init : init };

})();
