var RendererInterface = (function() {

    var rendererFrame;
    var Renderer;
    var Reader = window.Reader = Elm.Reader.Main.fullscreen(
        { hash : window.location.hash
        , host : window.location.protocol + "//" + window.location.host    
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
        rendererFrame = document.getElementById(rendererFrameId);
        if(!rendererFrame) {
            setTimeout(function() { init(rendererFrameId); }, 100);
            return;
        }

        rendererFrame.addEventListener("load", function() {
            window.Renderer = Renderer = rendererFrame.contentWindow.Renderer;

            var scrollToElem = function(elem, onScrollFinish) {
                if(elem == null) return;
                var elemPos = elem.getBoundingClientRect().top - parseInt((elem.currentStyle || window.getComputedStyle(elem)).marginTop);
                var scrollY = window.scrollY || window.pageYOffset;
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

            Renderer.on("pageTurned", function(headingsOnPage, headingAtTop) {
                Reader.ports.headingsUpdated.send(
                    { headingsOnPage : Array.prototype.filter.call(headingsOnPage, function() { return true; })
                    , headingAtTop   : headingAtTop
                    }
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

    Reader.ports.renderChapter.subscribe(function(data) {
        var errCounter = 0;
        (function renderChapter(data) {
            if(!Renderer || !Renderer.render) {
                console.log("Renderer not loaded: Waiting...", errCounter);
                if(errCounter++ >= 20 && !!rendererFrame) {
                    console.log("Renderer timeout: Reloading frame...");
                    errCounter = 0;
                    rendererFrame.src = "/renderer.html";
                }
                setTimeout(function() { renderChapter(data); }, 100);
            } else {
                Renderer.render(data.renderObj, data.eId, data.isPageTurnBack);
            }
        })(data);
    });

    Reader.ports.setReadInStorage.subscribe(function(eId) {
        if(!localStorage) return;

        var data = JSON.parse(localStorage.getItem("MMP_ReaderData") || "{}");
        data[eId] = true;
        localStorage.setItem("MMP_ReaderData", JSON.stringify(data));
    });

    Reader.ports.jumpToEntry.subscribe(function(eId) {
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

        var top = (window.screen.availHeight/2 - data.height/2) * 0.3;
        var left = (window.screen.availWidth/2 - data.width/2) * 0.3;

        window.open(data.endpoint, "Share", "height="+data.height+",width="+data.width+",top="+top+",left="+left);
    });

    Reader.ports.rollCredits.subscribe(function() {
        var credits = null; 
        var errCounter = 0;
        var duration = 25000;
        var elapsed = 0;
        var lastTime = -1;

        (function creditsRetry() {
            credits = document.getElementsByClassName('credits-overlay')[0];
            if(!credits || credits.offsetHeight === 0) {
                console.log("Waiting for credits...", errCounter);
                if(errCounter < 15) {
                    errCounter++;
                    setTimeout(creditsRetry,100);
                }
                return;
            }

            credits.scrollTop = 0;
            window.requestAnimationFrame(roll);    
        })();

        function roll(cTime) {
            var dt;
            if(!credits || credits.style.display === "none") return;
            if(lastTime < 0) {
                lastTime = cTime;
            }
            dt = cTime - lastTime;
            lastTime = cTime;
            elapsed += dt;
            credits.scrollTop = (elapsed / duration) * (credits.scrollHeight - credits.clientHeight);
            // console.log(credits.scrollTop, (credits.scrollHeight - credits.clientHeight), elapsed);
            if(elapsed < duration)
                window.requestAnimationFrame(roll);
        }
    });

    Reader.ports.setScrollEnabled.subscribe(function(isEnabled) {
        if(isEnabled)
            document.body.classList.remove("no-scroll");
        else
            document.body.classList.add("no-scroll");
    });

    setInterval(function() {
        if(!Renderer) return;
        Renderer.refreshCommentCount();
    }, 1000*60*5);

    return { init : init };

})();
