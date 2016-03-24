var Renderer = window.Renderer = (function() {

    //---- VARS ----

    var listeners = {
        "arrows"     : function() {},
        "rendered"   : function() {},
        "reflowed"   : function() {},
        "linkClick"  : function() {},
        "pageTurned" : function() {}
    };

    var keys = []; //list of currently pressed keys

    var watcher = null;

    var currentPositionPercentage = 0;


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
        console.log("TURNING PAGE", getHeadingsOnPage());
        listeners.pageTurned(getHeadingsOnPage());
    }

    function render(renderObj) {
        var storyTextArea = null;
        var timeout = 0;

        if(watcher != null) watcher.stop(); // STOP WATCHER IF IT IS RUNNING

        if(!!renderObj) {
            var style = document.createElement("style");
            style.innerHTML = renderObj.stylesheet;
            style.id = "injected-style";

            var oldStyle = document.getElementById("injected-style");
            if(oldStyle)
                document.head.replaceChild(style, oldStyle);
            else
                document.head.appendChild(style);

            var storyTextArea = document.createElement("div");
            storyTextArea.id = "text-container";

            for(var entry of renderObj.entryData) {
                storyTextArea.innerHTML += entry.heading + entry.body;

                var linkLine = document.createElement("p");
                linkLine.className = "link-line";

                if(entry.authorsNote) {
                    var authorsNoteLink = document.createElement("span");
                    authorsNoteLink.innerHtml = "Author's Note";
                    authorsNoteLink.addEventListener("click", function() {
                        listeners.linkClick("authorsnote", entry.id);
                    });
                    linkLine.appendChild(authorsNoteLink);
                }

                var commentsLink = document.createElement("span");
                commentsLink.innerHtml = "Comments";
                commentsLink.className = "disqus-comment-count";
                if(commentsLink.dataset)
                    commentsLink.dataset.disqusIdentifier = entry.disqusIdentifier;
                else
                    commentsLink.setAttribute("data-disqus-identifier", entry.disqusIdentifier);
                commentsLink.addEventListener("click", function() {
                    listeners.linkClick("comments", entry.id);
                });
                linkLine.appendChild(commentsLink);

                var shareLink = document.createElement("span");
                shareLink.innerHtml = "Share";
                shareLink.addEventListener("click", function() {
                    listeners.linkClick("share", entry.id);
                });
                linkLine.appendChild(shareLink);

                storyTextArea.appendChild(linkLine);
            }

            document.body.innerHTML = "";
            document.body.appendChild(storyTextArea);

            timeout = 0;
        } else { timeout = 0; /* handle reflow */ }

        //remove any placeholders before rerendering anything
        storyTextArea = storyTextArea || document.getElementById('text-container');
        Array.prototype.map.call(storyTextArea.getElementsByClassName("placeholder"), function(placeholder) {
            (storyTextArea).removeChild(placeholder);
        });

        setTimeout(function() {

            //---- BUMP HEADINGS AT BOTTOM TO NEXT PAGE ----

            var headings = Array.prototype.filter.call(storyTextArea.querySelectorAll("h1,h2,h3,h4,h5,h6"), function(h) {return true;});
            var bookRect = storyTextArea.getBoundingClientRect();
            for(heading of headings) {
                var h = document.getElementById(heading.id);
                if(h == null) continue;
                var headingRect = h.getBoundingClientRect();
                if(headingRect.bottom >= bookRect.bottom - Math.max(bookRect.bottom * 0.04, headingRect.height)) { //TODO: (maybe) make sure hRect.height exists
                    var placeholder = document.createElement("div");
                    placeholder.style.height = (bookRect.height - headingRect.top) + "px"; //TODO: (maybe) make sure hRect.height exists
                    placeholder.className = "placeholder";
                    (heading.parentElement || heading.parentNode).insertBefore(placeholder,heading); //TODO: double check on Element vs Node stuff
                }
            }

            //---- TRY TO PLACE READER BACK NEAR PROPER PAGE ----
            //---- GET IMPORTANT VALUES FROM RENDER AND PASS TO CALLBACK ----
            var numPages = Math.round(storyTextArea.scrollWidth/getViewport().width)
            var currentPage = Math.round(numPages * currentPositionPercentage);
            storyTextArea.scrollLeft = currentPage * getViewport().width;
            currentPositionPercentage = storyTextArea.scrollLeft / storyTextArea.scrollWidth;

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
        }, timeout);
    }

    function refreshCommentCount() {
        if(!(DISQUSWIDGETS && DISQUSWIDGETS.getCount))
            throw "Unable to refresh comment count: Cannot find DISQUSWIDGETS or DISQUSWIDGETS.getCount.";
        else
            DISQUSWIDGETS.getCount({reset: true});
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

    //---- HELPERS ----

    function getViewport() {
        return {
            width  : window.innerWidth,
            height : window.innerHeight
        };
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
        goToPage            : goToPage
    };
})();
