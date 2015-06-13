(function($){
    $(window).load(function(){

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
            console.log(getCookie('csrftoken'));
            if($content_type != '')
                request.setRequestHeader('Content-type', $content_type);
            request.send($params);
            return request.responseText;
        }
        $('.film-carousel').slick({
            slidesToShow: 2,
            slidesToScroll: 1,
            autoplay: true,
            autoplaySpeed: 2000
        });
        function set_film_cover_height(){
            var header_height = parseInt($('#top-header').css('height'));
            var film_cover_height_by_width = window.innerWidth/1.67;
            var film_cover_height_by_window = window.innerHeight - header_height;
            $('#film-cover').css({
                'height': parseInt(Math.min(film_cover_height_by_width, film_cover_height_by_window)) + 'px',
                'margin-top': header_height + 'px',
                'background-position': '0 ' + header_height + 'px'
            });
            var temp = $('#cover-film-info');
            if(parseInt($('#film-cover').css('height')) < 280)
                temp.css('display', 'none');
            else
                temp.css('display', 'block');
        }
        set_film_cover_height();
        function set_vertical_center($elem){
            var parent_height = parseFloat($elem.parent().css('height'));
            $elem.css('padding-top', (parent_height-parseFloat($elem.css('height')))/2+'px');
        }
        set_vertical_center($('#cover-film-synopsis'));
        set_vertical_center($('#cover-film-details'));
        set_vertical_center($('#cover-film-review'));
        $.fn.turn_on_star_rating = function () {
            if ($(this).length == 0)
                return;
            var $rating = parseFloat($(this).attr('class').match(/[0-9]*\.?[0-9]/)[0]);
            var $children_list = $(this).children();
            var $children_length = $children_list.length;
            var $limit = $rating / 0.5;
            var index;
            for (index = 0; index < $children_length; index++)
                $children_list.eq(index).removeClass('on').addClass('off');
            for (var i = 1; i <= $limit; i++)
                $children_list.eq($children_length - i).removeClass('off').addClass('on');
        };
        $('#rating textarea').on('focus', function () {
            $(this).css('text-align', 'right');
        }).on('focusout', function () {
            $(this).css('text-align', 'center');
        });
        $('#rating button').click(function () {
            try {
                var rating_str = "star-rating fixed-" + $(this).prev().prev().attr('class').split(' ')[1].slice(6)+" smaller";
            }
            catch (e) {
                var warning = $(this).next();
                warning.slideToggle();
                setTimeout(function () {
                    warning.slideToggle();
                }, 4000);
                return;
            }
            var rate_num = rating_str.split(' ')[1].slice(6);
            var result = send_ajax_request('post/add/', 'rate='+rate_num+
            '&film-id='+$(this).attr('film-id')+'&text='+$(this).parent().find('textarea').val(),
            'application/x-www-form-urlencoded');
            var arr_result = result.split('/');
            if(arr_result[0] != 'success')
                return;
            var new_comment = $('#new-comment');
            new_comment.attr('post-id', arr_result[1]);
            new_comment.find('.date').html(arr_result[2]);
            new_comment.find('.star-rating').attr('class', rating_str).attr('title', rate_num*2);
            new_comment.find('.star-rating').turn_on_star_rating();
            new_comment.find('.comment-text i').after($(this).prev().val());
            new_comment.slideToggle();
            var $num_of_comments = $('#full-details .nav-tabs li:last-child a span');
            $num_of_comments.text(parseInt($num_of_comments.text())+1);
            var $rating_section = $(this).parent();
            $rating_section.slideToggle(1000, function () {
                $rating_section.empty();
                var $vote_complete = $('<h3>نظر شما ثبت شد ، ممنون!</h3>');
                $rating_section.append($vote_complete).slideToggle(1000);
                setTimeout(function () {
                    $rating_section.slideToggle(1000, function () {
                        $(this).remove();
                    });
                }, 4000);
            });
        });
        if(window.innerWidth < 991){
            var left_side_bar = $('body > .container > aside:first-of-type');
            var right_side_bar = $('body > .container > aside:last-of-type');
            var right_side_bar_sections = right_side_bar.find('section.panel');
            right_side_bar_sections.each(function () {
                $(this).detach();
                left_side_bar.append($(this));
            });
            right_side_bar.remove();
        }
        if(window.innerWidth < 768) {
            var left_side_bar = $('body > .container > aside:first-of-type');
            left_side_bar.detach();
            $('body > .container').append(left_side_bar);
        }
        if(window.innerWidth < 580){
            $('body > .container > aside').removeClass('col-xs-4').addClass('col-xs-12');
            $('body > .container > main').removeClass('col-xs-8').addClass('col-xs-12');
        }
        if(window.innerWidth < 401){

        }
    });
})(jQuery);