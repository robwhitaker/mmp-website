window.onload = function() {
    [ { src             : "/static/img/MMPLogoFinal.png"
      , completionClass : "banner-logo-loaded"
      }

    , { src             : "/static/img/book-new-5.png"
      , completionClass : "book-cover-loaded"
      }

    , { src             : "/static/img/book-back.png"
      , completionClass : "book-back-loaded"
      }

    , { src             : "/static/img/wood-bg-11.png"
      , completionClass : "wood-bg-loaded"
      }

    ].forEach(function(imgData) {
        var img = new Image();
        img.src = imgData.src;
        img.onload = function() {
            document.body.classList.add(imgData.completionClass);
        };
    });
};
