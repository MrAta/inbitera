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

        if(window.innerWidth > 767){
            var left_bar = $('#left-bar');
            var margin_top = (parseFloat(left_bar.parent().css('height'))-parseFloat(left_bar.css('height')))/2;
            left_bar.css('padding-top', margin_top+'px');
        }
        $('body > .container:nth-child(3)').css('padding-top', parseFloat($('#top-header').css('height'))+10+'px');
        $('#menu-show i').click(function () {
            $('header #menu-items').slideToggle('slow');
        });
        $('#show-notifications').on('click', function(e){
            e.preventDefault();
            $('#notifications').slideToggle();
            $(this).parent().toggleClass('activated');
        }).blur(function () {
            $('#notifications').slideToggle();
        });
        $('.notification i').on('click', function () {
            $(this).parent().fadeOut(500, function () {
                var result = send_ajax_request('/notification/delete/', 'notification-id='+$(this).closest('.notification').attr('notification-id'), 'application/x-www-form-urlencoded');
                if(result!='success')
                    return;
                $(this).remove();
                change_num_of_notifications(-1);
            });
        });
        var num_of_notifs = $('#num-of-notifications');
        function change_num_of_notifications(offset){
            num_of_notifs.fadeOut(100, function () {
                num_of_notifs.text(parseInt(num_of_notifs.text())+offset);
                $(this).fadeIn(500);
            });
        }


    });
})(jQuery);