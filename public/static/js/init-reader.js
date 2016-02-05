// (function() {
  var Reader = Elm.fullscreen(Elm.Reader.Reader, { location : window.location.href, chapterRendered : [0, []], chapterReflowed : [0, 0, null, []], headingUpdate : [], reflow: [] });

  var bookWidth = 530;
  var bookHeight = 600;
  var watcher = null;
  var currentPositionPercentage = 0;

  var collidesWithBook = function(item) {
    var storyTextFrame = document.getElementById("book-text-frame");
    if(storyTextFrame == null) return false;
    var storyTextArea = storyTextFrame.contentWindow.document.getElementById("text-container");
    if(storyTextArea == null) return false;
      var bookRect = storyTextArea.getBoundingClientRect();
      var itemRect = item.getBoundingClientRect();

      return !(bookRect.right - 10 <= itemRect.left || bookRect.left + 10 >= itemRect.right);
  };

  var getHeadingsOnPage = function() {
    var storyTextFrame = document.getElementById("book-text-frame");
    if(storyTextFrame == null) return [];
    var storyTextArea = storyTextFrame.contentWindow.document.getElementById("text-container");
    if(storyTextArea == null) return [];
    var headings = storyTextArea.querySelectorAll("h1,h2,h3,h4,h5,h6");
    return Array.prototype.filter.call(headings, collidesWithBook)
      .map(function(h) { return h.id; })
      .filter(function(hId) { return hId != null });
  }

  var getFocusedHeading = function() {
    var storyTextArea = getTextContainer();
    if(storyTextArea == null) return null;

    var headingsOnPage = getHeadingsOnPage();
    if(headingsOnPage.length > 0) return null;

    return Array.prototype.reduce.call(storyTextArea.querySelectorAll("h1,h2,h3,h4,h5,h6"), function(acc, h) {
      if(h.offsetLeft < Math.round(storyTextArea.scrollLeft)) { return h.id; }
      else { return acc; }
    }, null);

  }

  var getTextContainer = function() {
    var storyTextFrame = document.getElementById("book-text-frame");
    if(storyTextFrame == null) return null;
    var storyTextArea = storyTextFrame.contentWindow.document.getElementById("text-container");
    if(storyTextArea == null) return null;
    return storyTextArea;
  }

  var render = function(chapter, callback) {
    var storyTextArea = null;
    var timeout = 0;
    var isReflow = false;

    var storyTextFrame = document.getElementById("book-text-frame");
    if(storyTextFrame == null) return;


    if(watcher != null) watcher.stop(); // STOP WATCHER IF IT IS RUNNING


    //---- RENDER CHAPTER IF NECESSARY + SETUP VARS ----

    if(chapter != null) {
      storyTextFrame.contentWindow.document.open('text/htmlreplace');
      storyTextFrame.contentWindow.document.write(chapter);
      storyTextFrame.contentWindow.document.close();

      timeout = 1500;
      isReflow = false;
    } else {
      timeout = 0;
      isReflow = true;
    }

    storyTextArea = getTextContainer();
    if(storyTextArea == null) return;

    //---- REMOVE PLACEHOLDER DIVS FOR REFLOW ----

    if(isReflow) {
      Array.prototype.map.call(storyTextArea.getElementsByClassName("placeholder"), function(placeholder) {
        storyTextArea.removeChild(placeholder);
      });
    }

    //---- WAIT FOR TIMEOUT TO ENSURE RENDER HAS COMPLETED ----

    setTimeout(function() {

      //---- BUMP HEADINGS AT BOTTOM TO NEXT PAGE ----

      var headings = Array.prototype.filter.call(storyTextArea.querySelectorAll("h1,h2,h3,h4,h5,h6"), function(h) {return true;});
      var bookRect = storyTextArea.getBoundingClientRect();
      for(heading of headings) {
        var h = storyTextFrame.contentWindow.document.getElementById(heading.id);
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
      var numPages = Math.round(storyTextArea.scrollWidth/bookWidth) //TODO: replace bookWidth with dynamic width of storyTextArea
      var currentPage = Math.round(numPages * currentPositionPercentage);
      storyTextArea.scrollLeft = currentPage * bookWidth; //TODO: replace bookWidth with dynamic width of storyTextArea
      currentPositionPercentage = storyTextArea.scrollLeft / storyTextArea.scrollWidth;


      if(callback != null)
        callback(
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
        watcher = new Watcher(getTextContainerScrollWidth, handleScrollWidthChange);

    }, timeout);
  }

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
  }

  Watcher.prototype.stop = function() {
    console.log("WATCHER: Stopping...");
    clearInterval(this.interval);
    this.interval = null;
    return this;
  }

  var getTextContainerScrollWidth = function() {
    var storyTextArea = getTextContainer();
    if(storyTextArea == null) return null;
    else return storyTextArea.scrollWidth;
  }

  var handleScrollWidthChange = function(scrollWidth) {
    // Reader.ports.reflow.send([]);
    render(null, function(renderData) {
      console.log("reflow:",renderData);
      Reader.ports.chapterReflowed.send(
        [ renderData.currentPage
        , renderData.numPages
        , renderData.focusedHeading
        , renderData.headingsOnPage
        ]
      );
    });
  }

  Reader.ports.currentPage.subscribe(function(pageNum) {
    var storyTextArea = getTextContainer();
    if(storyTextArea != null) {
      storyTextArea.scrollLeft = bookWidth * pageNum; //TODO: replace bookWidth with dynamic width of storyTextArea
      currentPositionPercentage = storyTextArea.scrollLeft / storyTextArea.scrollWidth;
      console.log("TURNING PAGE", getHeadingsOnPage());
      Reader.ports.headingUpdate.send(getHeadingsOnPage());
    }
  });

  Reader.ports.currentChapter.subscribe(function(chapter) {
    render(chapter, function(renderData) {
      console.log("render:", renderData);
      Reader.ports.chapterRendered.send(
        [ renderData.numPages
        , renderData.headingsOnPage
        ]
      );
    });
  });

  Reader.ports.focusedId.subscribe(function(id) {
    window.location.hash = "!/" + id;
  });
// })();
