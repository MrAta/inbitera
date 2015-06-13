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
            if($content_type != '')
                request.setRequestHeader('Content-type', $content_type);
            request.send($params);
            return request.responseText;
        }

        /* Change cover image */

        $('#profile-cover .pic-upload-form input[type="file"]').change(function () {
            var cover_pic = this.files[0];
            var form_data = new FormData();
            form_data.append('cover_pic', cover_pic);
            form_data.append('type', 'cover');
            var result = send_ajax_request('user/upload-pic/', form_data, '');
            var res_arr = result.split(' ');
            if(res_arr[0]=='uploaded'){
                $('#profile-cover .cover').attr('src', res_arr[1]);
            }
        });

        /* Change user image */

        $('aside .user-image .pic-upload-form input[type="file"]').change(function () {
            var user_image = this.files[0];
            var form_data = new FormData();
            form_data.append('user_image', user_image);
            form_data.append('type', 'user_image');
            var result = send_ajax_request('user/upload-pic/', form_data, '');
            var res_arr = result.split(' ');
            if(res_arr[0]=='uploaded'){
                $('aside .user-image > img').attr('src', res_arr[1]);
            }
        });
    });
})(jQuery);