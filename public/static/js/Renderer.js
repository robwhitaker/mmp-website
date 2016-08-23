var Renderer = window.Renderer = (function() {
    //---- VARS ----

    var listeners = {
        "keyPress"   : function() {},
        "rendered"   : function() {},
        "reflowed"   : function() {},
        "linkClick"  : function() {},
        "pageTurned" : function() {},
        "setPage"    : function() {},
        "click"      : function() {}
    };

    var keys = []; //list of currently pressed keys

    var watcher = null;

    var selectedId = null;

    var currentPositionPercentage = 0;

    var reflowCheckpointId = null;

    //---- PPREARE FOR RENDER ----

    updateDynamicStylesheet();

    //---- EXPOSED FUNCTIONS ----

    function on(event, fn) {
        if(!listeners[event])
            throw "Renderer.on provided with invalid listener.";
        else
            listeners[event] = fn;
    }

    function setSelectedId(sId) {
        selectedId = sId;
        updateReflowCheckpointId();
        console.log("set (selected,reflow): (", selectedId,",",reflowCheckpointId,")");
    }

    function goToPage(pageNum) {
        var storyTextArea = document.getElementById("text-container");
        storyTextArea.scrollLeft = getViewport().width * pageNum;
        currentPositionPercentage = storyTextArea.scrollLeft / storyTextArea.scrollWidth;
        var headings = getHeadingsOnPage();
        updateReflowCheckpointId();
        var headingAtTop = false;
        if(headings.length > 0) {
            headingAtTop = (document.getElementById(headings[0]) || {}).offsetTop == 0;
        }

        console.log("reflow checkpoint: ", reflowCheckpointId);

        listeners.pageTurned(headings, headingAtTop);
    }

    function render(renderObj, eId, isPageTurnBack) {
        var renderMode = !!renderObj ? "render" : "reflow";

        console.log("Beginning render in mode: " + renderMode);

        var storyTextArea = null;

        if(watcher != null) watcher.stop(); // STOP WATCHER IF IT IS RUNNING

        if(!!renderObj) {
            console.log("Rendering segments...");
            var style = document.createElement("style");
            style.innerHTML = renderObj.stylesheet;
            style.id = "injected-style";

            var oldStyle = document.getElementById("injected-style");
            if(oldStyle)
                document.head.replaceChild(style, oldStyle);
            else
                document.head.appendChild(style);

            function mkLinkLine(links) {
                var linkLine = links.reduce(function(acc, link, i, ls) {
                    acc.appendChild(link);
                    if(i < ls.length - 1) { acc.appendChild(mkDivider()); }
                    return acc;
                }, document.createElement("p"));
                linkLine.className = "link-line";
                return linkLine;
            }

            function mkDivider() {
                var divider = document.createElement("span");
                divider.className = "divider";
                divider.innerHTML = " | "
                return divider;
            }

            function attachListener(id, listener) {
                setTimeout(function() {
                    document.getElementById(id).addEventListener("click", listener);
                }, 0);
            }

            function mkAuthorsNoteLink(entry) {
                if(entry.authorsNote) {
                    var authorsNoteLink = document.createElement("span");
                    authorsNoteLink.innerHTML = "Author's Note";

                    var id = "authorsnote-" + entry.id;
                    authorsNoteLink.id = id;

                    attachListener(id, function() {
                        listeners.linkClick("authorsnote", entry.id);
                    });

                    return authorsNoteLink;
                } else {
                    return null;
                }
            }


            function mkCommentsLink(entry) {
                var commentsLink = document.createElement("span");
                commentsLink.innerHTML = "Comments";
                commentsLink.className = "disqus-comment-count";

                var id = "comments-" + entry.id;
                commentsLink.id = id;

                if(commentsLink.dataset)
                    commentsLink.dataset.disqusIdentifier = entry.disqusId;
                else
                    commentsLink.setAttribute("data-disqus-identifier", entry.disqusId);

                attachListener(id, function() {
                    listeners.linkClick("comments", entry.id, entry.disqusId);
                });

                return commentsLink;
            }

            function mkShareLink(entry) {
                var shareLink = document.createElement("span");
                shareLink.innerHTML = "Share";

                var id = "share-" + entry.id;
                shareLink.id = id;

                attachListener(id, function() {
                    listeners.linkClick("share", entry.id);
                });

                return shareLink;
            }

            storyTextArea = renderObj.renderElements.reduce(function(acc, entry) {
                acc.innerHTML += entry.heading + entry.body;

                if(entry.body === "") return acc;

                acc.appendChild(mkLinkLine(
                    [ mkAuthorsNoteLink(entry)
                    , mkCommentsLink(entry)
                    , mkShareLink(entry)
                    ].filter(function(item) { return item != null; })
                ));

                return acc;
            }, document.createElement("div"));

            storyTextArea.id = "text-container";

            document.body.innerHTML = "";
            document.body.appendChild(storyTextArea);

            //Assign a unique ID to every paragraph without an ID in the body
            Array.prototype.map.call(document.body.querySelectorAll("p"), function(elem,i) {
                if(elem.id == "" || elem.id == null)
                    elem.id = "genId-"+i;
            });

        }

        storyTextArea = storyTextArea || document.getElementById('text-container');
        var lastScrollWidth = getTextContainerScrollWidth();

        refreshCommentCount(true);

        setTimeout(function renderIfReady() {
            //remove any placeholders before rerendering anything
            Array.prototype.map.call(storyTextArea.getElementsByClassName("placeholder"), function(placeholder) {
                storyTextArea.removeChild(placeholder);
            });

            //if there are any placeholders or not all the headings are loaded, we're not ready to continue yet. Try again in 50ms.
            if(storyTextArea.getElementsByClassName("placeholder").length > 0 || (!!renderObj && renderObj.renderElements.length > getHeadings().length) || lastScrollWidth != getTextContainerScrollWidth()) {
                console.log("DOM not ready: Waiting...");
                lastScrollWidth = getTextContainerScrollWidth();
                setTimeout(renderIfReady, 100);
                return;
            }

            console.log("DOM " + renderMode + " complete: Correcting heading placement...");

            function prependPlaceholder(h) {
                var heading = document.getElementById(h.id);
                var headingRect = getBoundingClientRect(heading);
                if(heading == null || headingRect == null) return;
                var placeholder = document.createElement("div");
                placeholder.style.height = (document.getElementById("text-container").getBoundingClientRect().height - headingRect.top) + "px"; //TODO: (maybe) make sure hRect.height exists
                placeholder.className = "placeholder";
                (heading.parentElement || heading.parentNode).insertBefore(placeholder,heading); //TODO: double check on Element vs Node stuff
            }

            var headingIds = getHeadings().map(function(h) { return h.id; });
            var currentId = -1;
            var abortMission = 0;
            var hInterval = setInterval(function() {
                if(headingIds.length == 0) {
                    clearInterval(hInterval);
                    renderIfReadyP2();
                    return;
                }
                var heading = document.getElementById(headingIds[0]);
                if(isDangling(heading) && currentId != headingIds[0]) {
                    console.log("Found dangling heading: " + headingIds[0] + "; bumping to next page...");
                    prependPlaceholder(heading);
                    currentId = headingIds[0];
                } else if(!isDangling(heading)) {
                    headingIds.shift();
                } else {
                    if(abortMission++ >= 15) {
                        headingIds.shift();
                        abortMission = 0;
                    }
                }
            }, 0);

            function renderIfReadyP2() {
                console.log("No more dangling headings: Continuing...");

                //Force Firefox to draw as columns like every other browser
                firefoxReset();

                //---- TRY TO PLACE READER BACK NEAR PROPER PAGE ----
                //---- GET IMPORTANT VALUES FROM RENDER AND PASS TO CALLBACK ----
                var numPages = Math.round(storyTextArea.scrollWidth/getViewport().width)
                var currentPage = 0;


                if(!renderObj) {
                    currentPage = getPageOfId(reflowCheckpointId) || 0;
                    var reflowElem = document.getElementById(reflowCheckpointId);
                    if(!!reflowElem && reflowElem.classList.contains("reflowed")) {
                        var clone = reflowElem.cloneNode(true);
                        reflowElem.parentNode.replaceChild(clone, reflowElem);
                    } else if(!!reflowElem) {
                        reflowElem.classList.add("reflowed");
                    } else
                        currentPage = Math.round(numPages * currentPositionPercentage);
                } else
                    currentPage = isPageTurnBack ? (numPages - 1) : (getPageOfId(eId) || 0);

                //reset columns for FireFox again because we might have changed something
                firefoxReset();

                storyTextArea.scrollLeft = currentPage * getViewport().width;

                currentPositionPercentage = storyTextArea.scrollLeft / storyTextArea.scrollWidth;

                //if not reflow, reassign reflow checkpoint. If it is a reflow, we want to stick to the current point for further reflows
                if(!!renderObj) updateReflowCheckpointId();
                console.log("reflow checkpoint: ", reflowCheckpointId);


                refreshCommentCount();

                listeners[(!!renderObj ? "rendered" : "reflowed")](
                    { numPages : numPages
                    , headingsOnPage : getHeadingsOnPage()
                    , focusedHeading : getFocusedHeading()
                    , currentPage : currentPage
                    }
                );

                //---- RESTART WATCHER, OR START IT IF IT DOESN'T EXIST ----
                if(watcher != null)
                    watcher.start();
                else
                    watcher = new Watcher(getTextContainerScrollWidth, function() { render(); });
            }
        }, 100);
    }

    function refreshCommentCount(forceFF) {
        if(isFirefox() && !forceFF) return; //hack because Firefox is broken
        if(!(DISQUSWIDGETS && DISQUSWIDGETS.getCount)) {
            console.log("Error: DISQUSWIDGETS not defined.");
        } else {
            console.log("Refreshing comment counts.");
            DISQUSWIDGETS.getCount({reset: true});
        }
    }

    function firefoxReset() {
        //Force Firefox to draw as columns like every other browser
        var storyTextArea = document.getElementById("text-container");
        if(isFirefox() && !!storyTextArea) {
            console.log("Firefox detected: Checking for columns...");
            if(storyTextArea.scrollHeight > storyTextArea.getBoundingClientRect().height) {
                console.log("No columns found: Forcing Firefox to redraw...");
                storyTextArea.appendChild(document.createElement("div"));
            }
        }
    }

    function getPageOfId(eId) {
        var item = document.getElementById(eId);
        var itemRect = getBoundingClientRect(item);
        if(!item || !itemRect) return;

        var itemPos = itemRect.left;
        var scrollLeft = document.getElementById("text-container").scrollLeft;

        var page = Math.round((scrollLeft + itemPos)/getViewport().width);

        return page;
    }

    function goToHeading(eId) {
        var page = getPageOfId(eId);
        if(page != null) listeners.setPage(page);
    }

    //---- EVENT LISTENERS ----

    function updateDynamicStylesheet() {
        var dynamicStyle = document.getElementById("dynamic-style");
        dynamicStyle.innerHTML =
            dynamicStyle.innerHTML.replace(/width:\s*[0-9]+/gi, "width: " + getViewport().width)
                                  .replace(/height:\s*[0-9]+/gi, "height: " + getViewport().height);
    }

    var preventHold = false;
    var keysHeld = [];
    window.addEventListener("keydown", function(e) {
        if(keysHeld.indexOf(e.keyCode) !== -1 && preventHold) return;
        keysHeld.push(e.keyCode);
        listeners.keyPress(e.keyCode);
    });

    window.addEventListener("keyup", function(e) {
        keysHeld = keysHeld.filter(function(k) { return  k !== e.keyCode; });
    });

    window.addEventListener("resize", updateDynamicStylesheet);

    document.addEventListener("click", function() {
        listeners.click();
    });

    //---- HELPERS ----

    function getViewport() {
        return {
            width  : window.innerWidth,
            height : window.innerHeight
        };
    }

    var getHeadings = function() {
        var storyTextArea = document.getElementById('text-container');
        if(storyTextArea == null) return [];
        return Array.prototype.filter.call(storyTextArea.querySelectorAll("h1,h2,h3,h4,h5,h6"), function() { return true; });
    }

    var getHeadingsOnPage = function() {
        var storyTextArea = document.getElementById("text-container");
        if(storyTextArea == null) return [];
        var headings = storyTextArea.querySelectorAll("h1,h2,h3,h4,h5,h6");
        return Array.prototype.filter.call(headings, collidesWithBook)
            .map(function(h) { return h.id; })
            .filter(function(hId) { return hId != null });
    }

    var getReflowCheckpointsOnPage = function() {
        var storyTextArea = document.getElementById("text-container");
        if(storyTextArea == null) return [];
        var elems = storyTextArea.querySelectorAll("h1,h2,h3,h4,h5,h6,p");
        return Array.prototype.filter.call(elems, collidesWithBook)
            .map(function(e) { return e.id; })
            .filter(function(eId) { return eId != null });
    }

    function updateReflowCheckpointId() {
        var checkpoints = getReflowCheckpointsOnPage();
        if(checkpoints.indexOf(selectedId) != -1)
            reflowCheckpointId = selectedId;
        else
            reflowCheckpointId = checkpoints[0];
    }

    var collidesWithBook = function(item) {
        var storyTextArea = document.getElementById("text-container");
        var itemRect = getBoundingClientRect(item);
        if(storyTextArea == null || itemRect == null) return false;
        var bookRect = storyTextArea.getBoundingClientRect();

        var result = !(bookRect.right * 0.75 <= itemRect.left || bookRect.left * 1.25 >= itemRect.right);

        if(result) { console.log(item.id,itemRect.left,itemRect.right); }

        return result;
    };

    var getBoundingClientRect = function(item) {
        var storyTextArea = document.getElementById("text-container");
        if(storyTextArea == null || item == null || !item.getBoundingClientRect) return null;

        var bookRect = storyTextArea.getBoundingClientRect();
        var itemRect = item.getBoundingClientRect();

        var top = itemRect.top;
        var itemLeft = itemRect.left;
        var itemRight = itemRect.right;

        if(  itemRect.top < 0
          || itemRect.top >= bookRect.height
          || (itemRect.height > bookRect.height && itemRect.width <= bookRect.width)
          || (itemRect.top + itemRect.height > bookRect.height && itemRect.width <= bookRect.width)
          ) {
            top = (itemRect.top < 0) ? bookRect.height - (Math.abs(itemRect.top) % bookRect.height) : itemRect.top % bookRect.height;
            if(top == bookRect.height) top = 0;
            itemLeft = (itemRect.top < 0) ? itemRect.left-(bookRect.width*Math.ceil(Math.abs(itemRect.top) / bookRect.height)) : itemRect.left;
            itemRight = itemLeft + Math.ceil((top + itemRect.height) / bookRect.height) * bookRect.width;
        }

        return {
            top    : top,
            left   : itemLeft,
            right  : itemRight,
            height : bookRect.height
        };
    }

    var isDangling = function(heading) {
        var storyTextArea = document.getElementById("text-container");
        if(storyTextArea == null) return false;

        // multiply by 2 to lower the threshold to detect a dangling heading
        var textSize = parseFloat((heading.nextSibling.currentStyle || window.getComputedStyle(heading.nextSibling)).fontSize) * 2;

        var nextIsP = heading.nextSibling.tagName === "P";

        var nextOnPageButNoRoom = heading.offsetLeft == heading.nextSibling.offsetLeft && storyTextArea.offsetHeight - heading.nextSibling.offsetTop <= textSize;

        var nextNotOnPage = heading.nextSibling.offsetLeft >= heading.offsetLeft + heading.offsetWidth;

        return (nextOnPageButNoRoom || nextNotOnPage) && nextIsP;
    };

    var getFocusedHeading = function() {
        var storyTextArea = document.getElementById("text-container");
        if(storyTextArea == null) return null;

        var headingsOnPage = getHeadingsOnPage();
        if(headingsOnPage.length > 0) return null;

        return Array.prototype.reduce.call(storyTextArea.querySelectorAll("h1,h2,h3,h4,h5,h6"), function(acc, h) {
            if(h.offsetLeft < Math.round(storyTextArea.scrollLeft)) { return h.id; }
            else { return acc; }
        }, null);

    };

    var getTextContainerScrollWidth = function() {
        return document.getElementById('text-container').scrollWidth;
    }

    function isFirefox() {
        return navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
    }

    // ---- WATCHER ----

    function Watcher(getValue, callback) {
        this.interval = null;
        this.value = null;
        this.getValue = (typeof getValue === "function") ? getValue : function() {};
        this.callback = (typeof callback === "function") ? callback : function() {};

        this.start();
    }

    Watcher.prototype.start = function() {
        if(this.interval !== null) return;
        console.log("WATCHER: Starting...");
        this.value = this.getValue();

        this.interval = setInterval(function() {
            if(this.getValue() !== this.value) {
                this.value = this.getValue();
                this.callback(this.value);
            }
        }.bind(this), 500);

        return this;
    };

    Watcher.prototype.stop = function() {
        console.log("WATCHER: Stopping...");
        clearInterval(this.interval);
        this.interval = null;
        return this;
    };

    //---- RETURN OBJECT ----

    return {
        on                  : on,
        render              : render,
        refreshCommentCount : refreshCommentCount,
        goToPage            : goToPage,
        goToHeading         : goToHeading,
        setSelectedId       : setSelectedId
    };
})();
