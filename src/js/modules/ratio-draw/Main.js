var RATIO_DRAW = (function(exports) {

  function allReady() {
    //RATIO_DRAW.DrawAlphaImage();
    var data = TXP.Books.GetFlattened({
      benchMark: true,
      //gematriaPerWord: true,
      gematriaPerLetter: true,
      //bookEndIndex: 5,
    });

    RATIO_DRAW.DrawGematriaImage(data);
  }

    exports.Start = function(configOptions) {


        exports.configOptions = configOptions;
        TXP.Init(configOptions.canvasWidth, configOptions.canvasHeight, configOptions.bgColor);

        var loadingGateLocked = 2;

        TXP.Books.Load({
          onComplete: function () {

            if(!--loadingGateLocked) {
              allReady();
            }
          }
        });

        TXP.Shaders.Load({
          vertex: ['default'],
          fragment: ['default']
        }, {
          onComplete: function() {
            if(!--loadingGateLocked) {
              allReady();
            }
          }
        });

    }

    return exports;
}(RATIO_DRAW || {}));
