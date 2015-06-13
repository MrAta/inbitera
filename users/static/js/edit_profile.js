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

        var details = $('aside.user-info .detail .editable');
        details.on('click', function () {
            if($(this).attr('edit') == 'true' || $(this).hasClass('time'))
                return;
            $(this).attr('edit', 'true');
            var val = $(this).text();
            $(this).text('');
            var inp = null;
            if($(this).parent().attr('id') == 'short-description')
                inp = $("<textarea type='text'/>");
            else
                inp = $("<input type='text'/>");
            inp.attr('placeholder', $(this).attr('my_holder'));
            if(!$(this).hasClass('placeholder'))
                inp.val(val);
            inp.blur(function () {
                var parent = $(this).parent();
                var place = $(this).val();

                var result = send_ajax_request('user/edit-profile/',
                    'field='+parent.parent().attr('id')+'&text='+place, 'application/x-www-form-urlencoded');
                if(result != 'success')
                    return;
                var place_holder = $(this).attr('placeholder');
                var text = place == '' ? place_holder : place;
                parent.text(text).attr('edit', 'false');
                if(place == ''){
                    if(!parent.hasClass('placeholder'))
                        parent.addClass('placeholder');
                }
                else
                    parent.removeClass('placeholder');
                $(this).remove();

            });
            $(this).append(inp);
            inp.focus();
        });
    });
})(jQuery);