(function($) {
    function getCookie(sKey) {
        sKey = encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&");
        var re = "(?:(?:^|.*;)\\s*" + sKey + "\\s*\\=\\s*([^;]*).*$)|^.*$";
        return decodeURIComponent(document.cookie.replace(new RegExp(re), "$1")) || null;
    }
    function dataURItoBlob(dataURI) {
        // convert base64 to raw binary data held in a string
        var byteString = atob(dataURI.split(",")[1]),
            mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0],
            ab = new ArrayBuffer(byteString.length),
            ia = new Uint8Array(ab),
            i;
        for(i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }

        // write the ArrayBuffer to a blob, and you're done
        return new Blob([ab], {type: mimeString});
    }
    function drawEllipse(ctx, x, y, w, h) {
      var kappa = .5522848,
          ox = (w / 2) * kappa, // control point offset horizontal
          oy = (h / 2) * kappa, // control point offset vertical
          xe = x + w,           // x-end
          ye = y + h,           // y-end
          xm = x + w / 2,       // x-middle
          ym = y + h / 2;       // y-middle

      ctx.beginPath();
      ctx.moveTo(x, ym);
      ctx.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
      ctx.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
      ctx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
      ctx.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
      ctx.fillStyle = "white";
      ctx.fill();
      ctx.closePath();
      //ctx.stroke();
    }

    navigator.getUserMedia  = navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia;

    $(document).on("ready", function() {
        var thumbcanvas = document.createElement('canvas');
        var thumbctx = thumbcanvas.getContext('2d');

        var video = document.querySelector("video"),
            canvas = document.querySelector("canvas"),
            ctx = canvas.getContext("2d");
        var HAIR_MAX = 12,
            BODY_MAX = 12;
        var hair_val = 0,
            body_val = 0;
        ctx.translate(640, 0);
        ctx.scale(-1, 1);
        thumbcanvas.width = 48;
        thumbcanvas.height = 66;
        thumbctx.translate(48, 0);
        thumbctx.scale(-1, 1);
        function snapshot() {
            ctx.drawImage(video, 0, 0);
            thumbctx.clearRect(0, 0, 48, 66);
            thumbctx.drawImage(video, 164, 25, 312, 430, 0, 0, 48, 66);
            thumbctx.globalCompositeOperation = 'destination-in';
            drawEllipse(thumbctx, 0, 0, 48, 66);
            document.querySelector("#thumb").src = thumbcanvas.toDataURL();
            document.querySelector("#output").src = canvas.toDataURL();
            $("div.capture").hide();
            $("div.preview").show();
        }
        function cancel() {
            $("div.preview").hide();
            $("div.capture").show();
            $("textarea").val("");
        }

        $(video).on("click", snapshot);
        $("img").on("click", cancel);
        $("#cancel").on("click", cancel);
        $("#submit").on("click", function() {
            var d = new FormData(),
            xhr = new XMLHttpRequest();
            d.append("image", dataURItoBlob($("#output").attr("src")), "image.png");
            d.append("thumb", dataURItoBlob($("#thumb").attr("src")), "image.png");
            d.append("comment", $("textarea").val());
            d.append("body", body_val);
            d.append("hair", hair_val);
            xhr.open("post", "/upload", true);
            xhr.setRequestHeader("X-CSRFToken", getCookie("csrftoken"));
            xhr.send(d);
            cancel();
        });

        navigator.getUserMedia({video: true}, function(stream) {
            video.src = window.URL.createObjectURL(stream);
        },
        function(err) {
        });
        $("#hairup").on("click", function(e) { 
            hair_val = (hair_val + 1) % HAIR_MAX;
            document.querySelector("#preview-hair").className = "hair" + hair_val;
            e.preventDefault()
        }).hover(function() {
            $("#sprite-preview").addClass("back")
        }, function () {
            $("#sprite-preview").removeClass("back")
        });
        $("#hairdown").on("click", function() { 
            hair_val = hair_val - 1;
            if (hair_val < 0) hair_val = HAIR_MAX-1;
            document.querySelector("#preview-hair").className = "hair" + hair_val;
        }).hover(function() {
            $("#sprite-preview").addClass("back")
        }, function () {
            $("#sprite-preview").removeClass("back")
        });
        $("#bodyup").on("click", function() { 
            body_val = (body_val + 1) % BODY_MAX;
            document.querySelector("#preview-body").className = "body" + body_val;
        });
        $("#bodydown").on("click", function() { 
            body_val = body_val - 1;
            if (body_val < 0) body_val = BODY_MAX-1;
            document.querySelector("#preview-body").className = "body" + body_val;
        });
    });
})(jQuery);
