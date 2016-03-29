// (function() {
  var Reader = Elm.fullscreen(Elm.Reader.Reader, { location : window.location.href, chapterRendered : { numPages : 0, headingsOnPage : [] }, chapterReflowed : [0, 0, null, []], headingUpdate : [], reflow: [] });

  var Renderer;
  document.getElementById('book-text-frame').addEventListener("load", function() {
    Renderer = document.getElementById('book-text-frame').contentWindow.Renderer;

    Renderer.on("rendered", function(renderData) {
      console.log("render:", renderData);
      Reader.ports.chapterRendered.send(
        { "numPages" : renderData.numPages
        , "headingsOnPage" : Array.prototype.filter.call(renderData.headingsOnPage, function() { return true; })
        }
      );
    });

    Renderer.on("reflowed", function(renderData) {
      console.log("reflow:",renderData);
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
      alert(link + " " + id)
    });

    Renderer.on("arrows", function(arrows) {
      console.log(arrows);
    });
  });


  Reader.ports.currentChapter.subscribe(function(chapter) {
    // console.log(chapter)
    Renderer.render(chapter);
  });

  Reader.ports.focusedId.subscribe(function(id) {
    window.location.hash = "!/" + id;
  });

  Reader.ports.currentPage.subscribe(function(pageNum) {
    Renderer.goToPage(pageNum);
  });
// })();
