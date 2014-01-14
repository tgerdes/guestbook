(function($) {
  function getCookie(sKey) {
    sKey = encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&");
    var re = "(?:(?:^|.*;)\\s*" + sKey + "\\s*\\=\\s*([^;]*).*$)|^.*$";
    return decodeURIComponent(document.cookie.replace(new RegExp(re), "$1")) || null;
  }
  function dataURItoBlob(dataURI) {
      // convert base64 to raw binary data held in a string
      var byteString = atob(dataURI.split(',')[1]);

      // separate out the mime component
      var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

      // write the bytes of the string to an ArrayBuffer
      var ab = new ArrayBuffer(byteString.length);
      var ia = new Uint8Array(ab);
      for(var i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
      }

      // write the ArrayBuffer to a blob, and you're done
      return new Blob([ab], {type: mimeString});
  }
  navigator.getUserMedia  = navigator.getUserMedia ||
                      navigator.webkitGetUserMedia ||
                      navigator.mozGetUserMedia ||
                      navigator.msGetUserMedia;

  $(document).on('ready', function() {
    var video = document.querySelector('video'),
        canvas = document.querySelector('canvas'),
        ctx = canvas.getContext('2d');
        ctx.translate(640, 0);
        ctx.scale(-1, 1);
    function snapshot() {
        ctx.drawImage(video, 0, 0);
        document.querySelector('img').src = canvas.toDataURL();
        $("div.capture").hide();
        $("div.preview").show();
    }
    function cancel() {
        $("div.preview").hide();
        $("div.capture").show();
        $("textarea").val("");
    }

    $(video).on('click', snapshot);
    $('img').on('click', cancel);
    $('#cancel').on('click', cancel);
    $('#submit').on('click', function() {
        var d = new FormData();
        d.append('image', dataURItoBlob($('img').attr('src')));
        d.append('comment', $('textarea').val());
        var xhr = new XMLHttpRequest();
        xhr.open('post', '/upload', true);
        xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
        xhr.send(d);
        cancel();
    });

    navigator.getUserMedia({video: true}, function(stream) {
      video.src = window.URL.createObjectURL(stream);
    });
  });
})(jQuery);
