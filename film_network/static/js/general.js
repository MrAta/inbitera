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

        $('.follow-btn').on('click', function () {
            if($(this).find('span').html().trim() == 'دنبال کردن'){
                var result1 = send_ajax_request('user/follow/', 'user-id='+$(this).attr('user-id'), 'application/x-www-form-urlencoded');
                if(result1 == 'success')
                    $(this).find('span').html("لغو دنبال کردن").end()
                        .find('.icon').removeClass('icon-link').addClass('icon-unlink');
            }
            else{
                var result2 = send_ajax_request('user/unfollow/', 'user-id='+$(this).attr('user-id'), 'application/x-www-form-urlencoded');
                if(result2 == 'success')
                    $(this).find('span').html("دنبال کردن").end()
                        .find('.icon').removeClass('icon-unlink').addClass('icon-link');
            }
        });

        function multi_purpose($elem, $str){
            var params = '';
            var url = '';
            var parent = '';
            var closest_profile_comment = $elem.closest('.film-profile-comment');
            var closest_post = $elem.closest('.post');
            var closest_comment = $elem.closest('.comment:not(.film-profile-comment)');
            if(closest_comment.length) {
                url = '/comment'+$str;
                params = 'comment-id='+closest_comment.attr('comment-id');
                parent = closest_comment;
            }
            else{
                url = '/post'+$str;
                if(closest_profile_comment.length) {
                    params = 'post-id=' + closest_profile_comment.attr('post-id');
                    parent = closest_profile_comment;
                }
                else {
                    params = 'post-id=' + closest_post.attr('post-id');
                    parent = closest_post;
                }
            }
            var result = send_ajax_request(url, params, 'application/x-www-form-urlencoded');
            return [result, parent];
        }

        $('footer .likes a').on('click', function () {
            var elem = $(this).find('i.icon');
            if (elem.hasClass('icon-heart')) {
                var result = multi_purpose($(this), '/like/');
                if(result[0]!='success')
                    return false;
                var temp = $(this).find('span.num-of-likes');
                temp.html(parseInt(temp.text()) + 1);
                elem.removeClass('icon-heart').addClass('icon-heart-empty');
            }
            else {
                var result = multi_purpose($(this), '/unlike/');
                if(result[0]!='success')
                    return false;
                var temp = $(this).find('span.num-of-likes');
                temp.html(parseInt(temp.text()) - 1);
                elem.removeClass('icon-heart-empty').addClass('icon-heart');
            }
            return false;
        });

        $('main .icon.icon-remove').on('click', function () {
            var result = multi_purpose($(this), '/delete/');
            if(result[0]!='success')
                return;
            var typical_comment = $(this).closest('.post-content');
            var film_profile_comment = $(this).closest('.comment:not(.film-profile-comment)');
            if(typical_comment.length){
                var num_of_comments = typical_comment.find('.num-of-comments');
                num_of_comments.text(parseInt(num_of_comments.text())-1);
            }
            else{
                if(film_profile_comment.length){
                    var num_of_comments = film_profile_comment.closest('.film-profile-comment').find('.num-of-comments');
                    num_of_comments.text(parseInt(num_of_comments.text())-1);
                }
                else{
                    var num_of_comments = $('li a[href="#comments"] span');
                    num_of_comments.html(parseInt(num_of_comments.html())-1);
                }
            }
            result[1].slideToggle(800, function () {
                $(this).remove();
            });
        });

    });
})(jQuery);