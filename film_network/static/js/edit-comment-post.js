(function($) {
    $(window).load(function () {

        /* Get-Cookie */

        function getCookie(name){
            var cooki=null;
            if(document.cookie && String(document.cookie)!=""){
                var cookies = document.cookie.split(';');
                for(var i=0;i<cookies.length;i++){
                    var temp = cookies[i].trim();
                    if(temp.substring(0,name.length+1) == (name + '=')){
                        cooki = decodeURIComponent(temp.substring(name.length +1));
                        break;
                    }
                }
            }
            return cooki;
        }

        /* Ajax-Code */

        function send_ajax_request($url, $params, $content_type){
            var request = new XMLHttpRequest();
            request.open('POST', $url, false);
            request.setRequestHeader('X-CSRFToken', getCookie('csrftoken'));
            if($content_type != '')
                request.setRequestHeader('Content-type', $content_type);
            request.send($params);
            return request.responseText;
        }

        var comment_texts = $('.editable .comment-text');
        comment_texts.on('click', function () {
            if($(this).attr('edit') == 'true')
                return;
            var url = $(this).parent().hasClass('film-profile-comment') ? 'post' : 'comment';
            var quote = url == 'post' ? '<i class="icon icon-quote-right"></i>': '';
            $(this).attr('edit', 'true');
            var val = $(this).text();
            $(this).text('');
            var inp = $("<textarea type='text'/>");
            inp.val(val);
            inp.blur(function () {
                var parent = $(this).parent();
                var place = $(this).val();
                var result = send_ajax_request(url+'/update/',
                    url+'-id='+parent.parent().attr(url+'-id')+'&text='+place, 'application/x-www-form-urlencoded');
                if(result != 'success'){
                    parent.html(quote+val);
                    return;
                }
                parent.html(quote+place).attr('edit', 'false');
                $(this).remove();
            });
            $(this).append(inp);
            inp.focus();
        });
    });
})(jQuery);