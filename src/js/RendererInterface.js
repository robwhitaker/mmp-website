var RendererInterface = (function() {

    window.onerror = function(errorMsg, url, lineNumber, column, errorObj) {
        logError('Error: ' + errorMsg
                +' Script: ' + url
                +' Line: ' + lineNumber
                +' Column: ' + column
                +' StackTrace: ' +  errorObj
                );
    };

    var rendererFrame;
    var Renderer;
    var receivedPingback = false;
    var isScrolling = false;
    var deferredDisqusData;
    var Reader = window.Reader = Elm.Reader.Main.fullscreen(
        { localStorage : getLocalStorage()
        , progStartTime : new Date().getTime()
        }
    );

    // window.location.hash = "";

    function getLocalStorage() {
        var items = [];
        var bookmark = null;
        var data = {};
        try {
            var storage = localStorage.getItem("MMP_ReaderData");
            data = JSON.parse(storage || "{}");
        } catch(e) {
            logError(e.stack);
        }
        for(key in data)
            if(key != "bookmark")
                items.push([key,data[key]]);
            else
                bookmark = data[key];

        return {
            readEntries : items,
            bookmark  : bookmark
        };
    }

    function logError(msg) {
        var err = new Error(msg);
        handleError(err);
    }

    function handleError(err) {
        console.error(err);
        receivedPingback = false;
        Reader.ports.ping.send("");
        setTimeout(showErrorPopup.bind(null,err),1000);
    }

    function showErrorPopup(err) {
        if(!receivedPingback) {
            sendAnalyticError(err,true);
            document.getElementById("error-popup").style.display = "block";
        } else {
            sendAnalyticError(err,false);
        }
    }

    function init(rendererFrameId,errCounter) {
        if(errCounter == null) errCounter = 0;
        rendererFrame = document.getElementById(rendererFrameId);
        if(!rendererFrame) {
            if(errCounter % 50 == 0 && errCounter > 0) {
                logError("Renderer frame is taking a long time to appear. Current duration: " + (errCounter / 10) + " seconds.");
            }
            if(errCounter > 150) {
                logError("Renderer frame appearance timeout: 15 seconds.");
                return;
            }
            setTimeout(function() { init(rendererFrameId, errCounter + 1); }, 100);
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
                    , "idsByPage": cloneIdsByPage(renderData.idsByPage)
                    }
                );
            });

            Renderer.on("requestedReflow", function() {
                Reader.ports.reflowRequest.send("");
            });

            Renderer.on("reflowed", function(renderData) {
                Reader.ports.chapterReflowed.send(
                    { "currentPage" : renderData.currentPage
                    , "idsByPage": cloneIdsByPage(renderData.idsByPage)
                    }
                );
            });

            Renderer.on("linkClick", function(link, id) {
                switch(link) {
                    case "comments":
                        isScrolling = true;
                        Reader.ports.inlineLinkClicked.send(id);
                        setTimeout(function() {                        
                            scrollToElem(document.getElementById("comments-box"), function() {
                                isScrolling = false;
                                if(!!deferredDisqusData) {
                                    switchDisqusThread(deferredDisqusData);
                                    deferredDisqusData = null;
                                }
                            });
                        }, 250); // janky timeout to account for the time `send` needs to take effect                        
                        sendAnalyticEvent(
                            { category : "Book"
                            , action   : "Inline Comments Link Click"
                            , label    : id
                            , value    : null
                            }
                        );
                        break;
                    case "authorsnote":
                        isScrolling = true;
                        Reader.ports.inlineLinkClicked.send(id);
                        setTimeout(function() {
                            scrollToElem(document.getElementById("authors-note"), function() {
                                isScrolling = false;
                                if(!!deferredDisqusData) { 
                                    switchDisqusThread(deferredDisqusData);
                                    deferredDisqusData = null;
                                }
                            });
                        }, 250); // janky timeout to account for the time `send` needs to take effect
                        break;
                    case "share":
                        Reader.ports.inlineShareClicked.send(id);
                        sendAnalyticEvent(
                            { category : "Book"
                            , action   : "Inline Share Link Click"
                            , label    : id
                            , value    : null
                            }
                        );
                        break;
                    case "interactive":
                        Reader.ports.inlineLinkClicked.send(id);
                        sendAnalyticEvent(
                            { category : "Book"
                            , action   : "Interactive Heading Click"
                            , label    : id
                            , value    : null                                
                            }
                        );
                        break;
                    default:
                        console.log(link, id);

                }
            });

            Renderer.on("keyPress", function(keyCode) {
                Reader.ports.keyPressedInReader.send(keyCode);
            });

            Renderer.on("click", function() {
                Reader.ports.mouseClickedInReader.send(null);
            });

            Renderer.on("error", function(err) {
                handleError(err);
            });
        });
    }

    Reader.ports.renderChapter.subscribe(function(data) {
        var errCounter = 0;
        (function renderChapter(data) {
            if(!Renderer || !Renderer.render) {
                console.log("Renderer not loaded: Waiting...", errCounter);
                if(errCounter++ >= 20 && !!rendererFrame) {
                    logError("Renderer timeout (2 seconds): Reloading frame...");
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
        try {
            if(!localStorage) return;

            var storage = localStorage.getItem("MMP_ReaderData");
            var data = JSON.parse(storage || "{}");

            data[eId] = true;
            localStorage.setItem("MMP_ReaderData", JSON.stringify(data));
        } catch(e) {
            logError(e.stack);
        }
    });

    Reader.ports.setBookmarkInStorage.subscribe(function(eId) {
        try {
            if(!localStorage) return;

            var storage = localStorage.getItem("MMP_ReaderData");
            var data = JSON.parse(storage || "{}");

            data["bookmark"] = eId;
            localStorage.setItem("MMP_ReaderData", JSON.stringify(data));
        } catch(e) {
            logError(e.stack);
        }
    });

    Reader.ports.setPage.subscribe(function(pageNum) {
        Renderer.goToPage(pageNum);
    });

    function switchDisqusThread(disqusData) {
        try {
            if(typeof DISQUS === "undefined" || !DISQUS || !DISQUS.reset) return;
            if(isScrolling) {
                deferredDisqusData = disqusData;
                return;
            }
            DISQUS.reset({
              reload: true,
              config: function () {
                this.page.identifier = disqusData.identifier;
                this.page.url = disqusData.url;
                this.page.title = disqusData.title;
              }
            });
        } catch(e) {
            handleError(e.stack);
        }
    }

    Reader.ports.switchDisqusThread.subscribe(switchDisqusThread);

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
            credits = document.getElementsByClassName('credits-container')[0];
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

    function sendAnalyticEvent(analyticData) {
        console.log("-----------------ANALYTIC---------------------");
        console.log(analyticData);
        console.log("----------------------------------------------");
        try {
            ga('send',
                { hitType : 'event'
                , eventCategory : analyticData.category
                , eventAction   : analyticData.action
                , eventLabel    : analyticData.label
                , eventValue    : analyticData.value
                }
            );
        } catch(e) {
            console.error(e);
        }
    }

    function sendAnalyticError(msg, isFatal) {
        console.log("--------------ERROR ANALYTIC------------------");
        console.log(msg, isFatal);
        console.log("----------------------------------------------");
        try {
            ga('send','exception',
                { exDescription : msg
                , exFatal : !!isFatal
                }
              );
        } catch(e) {
            console.error(e);
        }
    }

    Reader.ports.setScrollEnabled.subscribe(function(isEnabled) {
        if(isEnabled)
            document.body.classList.remove("no-scroll");
        else
            document.body.classList.add("no-scroll");
    });

    Reader.ports.setSelectedId.subscribe(function(sId) {
        Renderer.setSelectedId(sId);
    });

    Reader.ports.pingback.subscribe(function() {
        receivedPingback = true;
    });

    Reader.ports.sendAnalyticEvent.subscribe(sendAnalyticEvent);

    Reader.ports.beginReflow.subscribe(function() {
        Renderer.reflow();
    })

    //HELPERS
    function cloneIdsByPage(inArr) {
        //clone idsByPage because... uh... well, who knows, but Elm's ports were confused without this
        var idsByPage = [];
        inArr.forEach(function(arr) {
            var newArr = [];
            arr.forEach(function(elem) {
                newArr.push(elem);
            });
            idsByPage.push(newArr);
        });
        return idsByPage;
    }

    return { init : init };

})();
