var Renderer = window.Renderer = (function() {

    //---- VARS ----

    var listeners = {
        "arrows"     : function() {},
        "rendered"   : function() {},
        "reflowed"   : function() {},
        "linkClick"  : function() {},
        "pageTurned" : function() {},
        "setPage"    : function() {},
        "click"      : function() {}
    };

    var keys = []; //list of currently pressed keys

    var watcher = null;

    var currentPositionPercentage = 0;

    var lastHeadingId = null;

    //---- PPREARE FOR RENDER ----

    updateDynamicStylesheet();

    //---- EXPOSED FUNCTIONS ----

    function on(event, fn) {
        if(!listeners[event])
            throw "Renderer.on provided with invalid listener.";
        else
            listeners[event] = fn;
    }

    function goToPage(pageNum) {
        var storyTextArea = document.getElementById("text-container");
        storyTextArea.scrollLeft = getViewport().width * pageNum;
        currentPositionPercentage = storyTextArea.scrollLeft / storyTextArea.scrollWidth;
        lastHeadingId = getHeadingsOnPage()[0];

        listeners.pageTurned(getHeadingsOnPage());
    }

    function render(renderObj, eId) {
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
                if(entry.authorsNote || true) {
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

        }

        storyTextArea = storyTextArea || document.getElementById('text-container');

        setTimeout(function renderIfReady() {
            //remove any placeholders before rerendering anything
            Array.prototype.map.call(storyTextArea.getElementsByClassName("placeholder"), function(placeholder) {
                storyTextArea.removeChild(placeholder);
            });

            //if there are any placeholders or not all the headings are loaded, we're not ready to continue yet. Try again in 50ms.
            if(storyTextArea.getElementsByClassName("placeholder").length > 0 || (!!renderObj && renderObj.renderElements.length > getHeadings().length)) {
                console.log("DOM not ready: Waiting...");
                setTimeout(renderIfReady, 50);
                return;
            }

            console.log("DOM " + renderMode + " complete: Correcting heading placement...");

            function prependPlaceholder(h) {
                var heading = document.getElementById(h.id);
                if(heading == null) return;
                var placeholder = document.createElement("div");
                placeholder.style.height = (document.getElementById("text-container").getBoundingClientRect().height - heading.getBoundingClientRect().top) + "px"; //TODO: (maybe) make sure hRect.height exists
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

                //---- TRY TO PLACE READER BACK NEAR PROPER PAGE ----
                //---- GET IMPORTANT VALUES FROM RENDER AND PASS TO CALLBACK ----
                var numPages = Math.round(storyTextArea.scrollWidth/getViewport().width)
                var currentPage = 0;

                if(!renderObj) {
                    if(lastHeadingId != null)
                        currentPage = goToHeading_(lastHeadingId) || 0;
                    else
                        currentPage = Math.round(numPages * currentPositionPercentage);
                    storyTextArea.scrollLeft = currentPage * getViewport().width;
                } else
                    currentPage = goToHeading_(eId) || 0;

                currentPositionPercentage = storyTextArea.scrollLeft / storyTextArea.scrollWidth;

                lastHeadingId = getHeadingsOnPage()[0];

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
                    watcher = new Watcher(getTextContainerScrollWidth, function() {render();});
            }
        }, 0);
    }

    function refreshCommentCount() {
        if(!(DISQUSWIDGETS && DISQUSWIDGETS.getCount))
            throw "Unable to refresh comment count: Cannot find DISQUSWIDGETS or DISQUSWIDGETS.getCount.";
        else {
            console.log("Refreshing comment counts.");
            DISQUSWIDGETS.getCount({reset: true});
        }
    }

    function goToHeading_(eId) {
        if(!document.getElementById(eId)) return;

        if(getHeadingsOnPage().indexOf(eId) !== -1) return;

        var headingPos = document.getElementById(eId).getBoundingClientRect().left;
        var scrollLeft = document.getElementById("text-container").scrollLeft;

        var page = (scrollLeft + headingPos)/getViewport().width;

        return page;
    }

    function goToHeading(eId) {
        var page = goToHeading_(eId);
        if(page != null) listeners.setPage(page);
    }

    //---- EVENT LISTENERS ----

    function triggerArrowListener() {
        var arrows = {
            up    : keys.indexOf(38) >= 0 ? 1 : 0,
            down  : keys.indexOf(40) >= 0 ? 1 : 0,
            left  : keys.indexOf(37) >= 0 ? 1 : 0,
            right : keys.indexOf(39) >= 0 ? 1 : 0
        }

        listeners.arrows({
            x : arrows.right - arrows.left,
            y : arrows.up - arrows.down
        });
    };

    function updateDynamicStylesheet() {
        var dynamicStyle = document.getElementById("dynamic-style");
        dynamicStyle.innerHTML =
            dynamicStyle.innerHTML.replace(/width:\s*[0-9]+/gi, "width: " + getViewport().width)
                                  .replace(/height:\s*[0-9]+/gi, "height: " + getViewport().height);
    }

    window.addEventListener("keydown", function(e) {
        if(keys.indexOf(e.keyCode) < 0)
            keys.push(e.keyCode);

        triggerArrowListener();
    });

    window.addEventListener("keyup", function(e) {
        keys = keys.filter(function(val) {
            return val !== e.keyCode;
        });

        triggerArrowListener();
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

    var collidesWithBook = function(item) {
        var storyTextArea = document.getElementById("text-container");
        if(storyTextArea == null) return false;
        var bookRect = storyTextArea.getBoundingClientRect();
        var itemRect = item.getBoundingClientRect();

        return !(bookRect.right - 10 <= itemRect.left || bookRect.left + 10 >= itemRect.right);
    };

    var isDangling = function(heading) {
        var storyTextArea = document.getElementById("text-container");
        if(storyTextArea == null) return false;
        var hRect = heading.getBoundingClientRect();
        var nRect = heading.nextSibling.getBoundingClientRect();

        // console.log("pos " + heading.id, !(nRect.right == hRect.right && nRect.left == hRect.left) && heading.nextSibling.tagName === "P");

        return !(nRect.right == hRect.right && nRect.left == hRect.left) && heading.nextSibling.tagName === "P";
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
        goToHeading         : goToHeading
    };
})();
