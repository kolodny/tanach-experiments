var LETTERS_PALETTE = (function(exports) {
    function GetTextureHeight(textureWidth) {
      return Math.ceil(TXP.TanachData.Letters.GetData().length / textureWidth);
    }

    exports.GetTextureHeight = GetTextureHeight;

    exports.GetLettersTexture = function(textureWidth) {
        var letters = TXP.TanachData.Letters.GetData();
        var textureHeight = GetTextureHeight(textureWidth);

        var canvas = document.createElement('canvas');
        canvas.width = textureWidth;
        canvas.height = textureHeight;

        var ctx = (function() {
            if (canvas.getContext == undefined) {
                return G_vmlCanvasManager.initElement(canvas).getContext("2d");
            }
            return canvas.getContext('2d')
        }());

        var imgData = ctx.createImageData(canvas.width, canvas.height);


        for (var letterIndex = 0, imageIndex = 0; letterIndex < letters.length; letterIndex++) {

            var letter = letters[letterIndex];
            var atBash = TXP.Utils.TextSubstitution.SUBSTITUTION_ATBASH[letter];
            var alBam = TXP.Utils.TextSubstitution.SUBSTITUTION_ALBAM[letter];
            imgData.data[imageIndex++] = letter; //red channel - baseLetter
            imgData.data[imageIndex++] = atBash; //blue channel - letter as atBash
            imgData.data[imageIndex++] = alBam; //green channel - letter as alBam
            imgData.data[imageIndex++] = 0xFF; //Unused for now....

            if(letterIndex < 20) {
              //console.log(letter + " " + atBash + " " + alBam);
            }
        }
        ctx.putImageData(imgData, 0, 0);
        return PIXI.Texture.fromCanvas(canvas);
    }
    return exports;
}(LETTERS_PALETTE || {}));