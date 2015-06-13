(function($) {
    $(window).load(function () {

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
        var search_results = $('#search-results');
        var search_type = $('#search-type');
        search_type.on('click', function () {
            if(search_results.attr('type') == 'film'){
                search_results.attr('type', 'user');
                $('#search-input').attr('placeholder', 'برای جستجو در فیلم ها روی تصویر مقابل کلیک کنید ...');
                $(this).fadeOut(500, function () {
                    $(this).removeClass('icon-film').addClass('icon-group').fadeIn(100);
                });
            }
            else{
                search_results.attr('type', 'film');
                $('#search-input').attr('placeholder', 'برای جستجو در کاربران روی تصویر مقابل کلیک کنید ...');
                $(this).fadeOut(500, function () {
                    $(this).removeClass('icon-group').addClass('icon-film').fadeIn(100);
                });
            }
        });

        $('#search-form').on('submit', function (e) {
            e.preventDefault();
            if(search_results.attr('type')=='film'){
                window.location = '/search/film?'+$('#search-input').val();
            }
            else{
                window.location = '/search/user?'+$('#search-input').val();
            }
        });

        $('#search-input').keyup(function (e) {
            search_results.slideDown();
            search_results.empty();
            if(search_results.attr('type') == 'film'){
                var film_result = send_ajax_request('/search/film', 'q='+$(this).val(), 'application/x-www-form-urlencoded');
                film_result = JSON.parse(film_result);
                for (var i = 0; i < film_result.length; i++) {
                    search_results.append($('<a href="/film/'+film_result[i]['id']+'"><div class="search-res"><img src="'+film_result[i]['pic']+'"/><span class="search-name">'+film_result[i]['name']+
                    '</span><br/>به کارگردانی '+film_result[i]['director']+'، محصول'+film_result[i]['year']+'، '+film_result[i]['country']+'</div></a>'));
                }
            }
            else{
                var user_result = send_ajax_request('/search/user', 'q='+$(this).val(), 'application/x-www-form-urlencoded');
                user_result = JSON.parse(user_result);
                for (var j = 0; j < user_result.length; j++) {
                    search_results.append($('<a href="/user/'+user_result[j]['username']+'"><div class="search-res"><img src="'+user_result[j]['pic']+'"/><span class="search-name">'+user_result[j]['name']+
                    '</span><br/>'+user_result[j]['job']+'، '+user_result[j]['place']+'، '+user_result[j]['education']+'</div></a>'));
                }
            }
        }).blur(function () {
            $('#search-results').slideUp();
        }).focus(function () {
            $(this).keyup();
        });
    });
})(jQuery);