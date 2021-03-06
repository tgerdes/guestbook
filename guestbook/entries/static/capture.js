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
    }

    $(document).on("ready", function() {
        var thumbcanvas = document.createElement('canvas'),
            thumbctx = thumbcanvas.getContext('2d');
        var prev_canvas = document.createElement('canvas'),
            prev_ctx = prev_canvas.getContext('2d');

        var video = document.querySelector("video"),
            canvas = document.querySelector("canvas.capture"),
            ctx = canvas.getContext("2d");
        var sx = 0,
            sy = 0,
            sw = 640,
            sh = 480,
            dx = 0,
            dy = 0,
            dw = 640,
            dh = 480;
        var HAIR_MAX = 12,
            BODY_MAX = 12;
        var hair_val = 0,
            body_val = 0;
        thumbcanvas.width = 48;
        thumbcanvas.height = 66;
        prev_canvas.width = 48 * 4;
        prev_canvas.height = 66 * 4;
        function cancel() {
            $("div.success").hide();
            $("div.preview").hide();
            $("div.capture").show();
            $("#comment").val("");
        }
        $("div.success").on('click', cancel);
        $("img").on("click", cancel);
        $("#cancel").on("click", function(e) {
            cancel();
            e.preventDefault();
        });
        $("#upload").on("submit", function(e) {
            e.preventDefault();
            $("#comment").blur();

            var d = new FormData(),
            xhr = new XMLHttpRequest(),
            buttons = $(".buttons");
            working = $(".working");
            buttons.hide();
            working.show();
            xhr.onreadystatechange = function() {
                if(xhr.readyState == 4) {
                    buttons.show();
                    working.hide();
                    $("div.preview").hide();
                    if(xhr.status==200) {
                        $("div.success").show();
                    } else {
                        $("div.error").show();
                    }
                }
            }
            d.append("image", dataURItoBlob($("#output").attr("src")), "image.png");
            d.append("thumb", dataURItoBlob($("#thumb").attr("src")), "thumb.png");
            d.append("comment", $("#comment").val());
            d.append("body", body_val);
            d.append("hair", hair_val);
            xhr.open("post", "/upload", true);
            xhr.setRequestHeader("X-CSRFToken", getCookie("csrftoken"));

            xhr.send(d);
        });
        var hint = document.querySelector("div.video-hint");
        hint.innerHTML = "Allow access to the camera!";
        fileSel = $("#filesel");
        $('div.intro').on("click", function() {
            $('div.intro').hide();
            $("div.capture").show();
            compatibility.getUserMedia({video: true}, function(stream) {
                try {
                    video.src = window.URL.createObjectURL(stream);
                } catch (error) {
                    video.src = stream;
                }
                setTimeout(function() {
                    video.play();
                    sw = video.videoWidth;
                    sh = video.videoHeight;
                    // letterbox the sides.
                    pw = sw * (480 / sh);
                    dx = (640 - pw) / 2;
                    dw = pw;

                    compatibility.requestAnimationFrame(tick);
                    $(canvas).on("click", snapshot);
                    document.querySelector("div.video-hint").innerHTML = "Click picture to take a snapshot!";
                    ctx.translate(640, 0);
                    ctx.scale(-1, 1);
                }, 500);
            },
            function(error) {
                document.querySelector("div.video-hint").innerHTML = "Upload a picture from your camera.";
                $(canvas).hide();
                $("div.backup-capture").show().on("click", function(e) {
                    e.preventDefault();
                    fileSel.click();
                } );
            });
        });
        function snapshot() {
            ctx.drawImage(video, sx, sy, sw, sh, dx, dy, dw, dh);
            thumbctx.clearRect(0, 0, 48, 66);
            drawEllipse(thumbctx, 0, 0, 48, 66);
            thumbctx.clip();
            thumbctx.drawImage(canvas, 164, 25, 312, 430, 0, 0, 48, 66);
            document.querySelector("#thumb").src = thumbcanvas.toDataURL();

            prev_ctx.clearRect(0, 0, 48 * 4, 66 * 4);
            drawEllipse(prev_ctx, 0, 0, 48 * 4, 66 * 4);
            prev_ctx.clip();
            prev_ctx.drawImage(canvas, 164, 25, 312, 430, 0, 0, 48 * 4, 66 * 4);
            document.querySelector("#thumb-preview").src = prev_canvas.toDataURL();

            document.querySelector("#output").src = canvas.toDataURL();
            $("div.capture").hide();
            $("div.preview").show();
        };
        fileSel.on("change", function (e) {

            var file = e.originalEvent.target.files[0];
            $.canvasResize(file, {
                        width: 640,
                        height: 480,
                        crop: false,
                        quality: 80,
                        //rotate: 90,
                        callback: function(data, width, height) {
                            var img = new Image();
                            img.onload = function() {
                                ctx.clearRect(0,0, 640, 480);
                                if (img.height == 480) {
                                    x = (640 - img.width) / 2;
                                    ctx.drawImage(img, 0, 0, img.width, img.height, x, 0, img.width, img.height);
                                } else {
                                    y = (480 - img.height) / 2;
                                    ctx.drawImage(img, 0, 0, img.width, img.height, 0, y, img.width, img.height);
                                }
                                thumbctx.clearRect(0, 0, 48, 66);
                                drawEllipse(thumbctx, 0, 0, 48, 66);
                                thumbctx.clip();
                                thumbctx.drawImage(canvas, 164, 25, 312, 430, 0, 0, 48, 66);
                                document.querySelector("#thumb").src = thumbcanvas.toDataURL();

                                prev_ctx.clearRect(0, 0, 48 * 4, 66 * 4);
                                drawEllipse(prev_ctx, 0, 0, 48 * 4, 66 * 4);
                                prev_ctx.clip();
                                prev_ctx.drawImage(canvas, 164, 25, 312, 430, 0, 0, 48 * 4, 66 * 4);
                                document.querySelector("#thumb-preview").src = prev_canvas.toDataURL();

                                document.querySelector("#output").src = canvas.toDataURL();
                                $("div.capture").hide();
                                $("div.preview").show();
                            }
                            img.src = data;
                        }
            });
            e.preventDefault();
            // Clear the value so the same file can be selected again.
            e.originalEvent.target.value = "";
        });
        function tick() {
            compatibility.requestAnimationFrame(tick);
            if (video.readyState === video.HAVE_ENOUGH_DATA) {
                ctx.clearRect(0, 0, 640, 480);
                ctx.globalAlpha = 0.5;
                ctx.drawImage(video, sx, sy, sw, sh, dx, dy, dw, dh);
                drawEllipse(ctx, 164, 25, 312, 430);
                ctx.save();
                ctx.clip();
                ctx.globalAlpha = 1;
                ctx.drawImage(video, sx, sy, sw, sh, dx, dy, dw, dh);
                ctx.restore();
            }
        }
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

        // Everything is loaded. show OK.
        $("#ok").show();
    });
})(jQuery);
