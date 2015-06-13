(function($){
    $(window).load(function() {

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

        function send_ajax_request($url, $params){
            var request = new XMLHttpRequest();
            request.open('POST', $url, false);
            request.setRequestHeader('X-CSRFToken', getCookie('csrftoken'));
            request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
            request.send($params);
            return request.responseText;
        }

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

        $('.comment .submit-comment').on('click', function () {
            if (!$(this).parent().find('input').val())
                return false;
            var first_name = $(this).attr('first-name');
            var last_name = $(this).attr('last-name');
            var user_image = $(this).parent().find('img').attr('src');
            var closest_parent = $(this).closest('.film-profile-comment').length ? $(this).closest('.film-profile-comment'):$(this).closest('.post');
            var result = send_ajax_request('/comment/add/', 'post-id='+
            closest_parent.attr('post-id')+'&text='+$(this).parent().find('input').val());
            var arr_result = result.split('/');
            if(arr_result[0]!='success')
                return false;
            if(closest_parent.hasClass('post')){
                var num_of_comments = closest_parent.find('.num-of-comments');
                num_of_comments.text(parseInt(num_of_comments.text())+1);
            }
            var user_comment = $('<div>', {class: 'col col-md-12 col-sm-12 col-xs-12 comment'});
            user_comment.attr('comment-id', arr_result[1]);
            var comment_img = $('<img>', {src: user_image, class: 'avatar img-circle'});
            var hyper_link = $('<a>', {href: '#'});
            var hyper_span = $('<span>', {class: 'author'}).text(first_name+' '+last_name);
            hyper_link.append(hyper_span);
            var other_span = $('<span>', {class: 'light-black date'}).text(arr_result[2]);
            var comment_footer = $('<footer></footer>');
            var comment_likes = $('<div class="likes"></div>');
            var comment_footer_a = $('<a href="#"><i class="icon icon-heart"></i><span class="num-of-likes">0  </span><span>بار</span></a>');
            comment_likes.append(comment_footer_a);
            var remove_icon = $('<i class="icon icon-remove"></i>');
            remove_icon.on('click', function () {
                var result = multi_purpose($(this), '/delete/');
                if(result[0]!='success')
                    return;
                result[1].slideToggle(800, function () {
                    $(this).remove();
                });
            });
            comment_footer.append(comment_likes).append(remove_icon);
            var comment_text = $('<div class="comment-text editable"></div>').text($(this).parent().find('input').val());
            user_comment.append(comment_img).append(hyper_link).append(other_span).append(comment_footer).append(comment_text);
            $(this).closest('.comments').append(user_comment);
            $(this).parent().find('input').val('');
            var num_of_comments_elem = $(this).closest('.film-profile-comment').find('.num-of-comments');
            num_of_comments_elem.text(parseInt(num_of_comments_elem.text())+1);
            comment_text.on('click', function () {
            if($(this).attr('edit') == 'true')
                return;
            var url = $(this).parent().hasClass('film-profile-comment') ? 'post' : 'comment';
            var quote = '<i class="icon icon-quote-right"></i>';
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
            comment_footer_a.on('click', function () {
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
        });
        $('input.form-control').focus(function () {
            var height = parseFloat($(this).css('height'))*2;
            $(this).animate({'height': height+'px'});
        }).blur(function () {
            var height = parseFloat($(this).css('height'))/2;
            $(this).animate({'height': height+'px'});
        }).keyup(function (e) {
            if(e.which == 13)
                $(this).next().click();
        });
        $('footer .show-comments').on('click', function () {
            $(this).parent().parent().parent().find('.comments').slideToggle(500);
            return false;
        });
    });
})(jQuery);