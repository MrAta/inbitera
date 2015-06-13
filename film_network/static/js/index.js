(function($){
    $(window).load(function() {

        $('#show-notifications').on('click', function(e){
            e.preventDefault();
            $('#notifications').slideToggle();
            $(this).parent().toggleClass('activated');
        }).blur(function () {
            $('#notifications').slideToggle();
        });
        $('.notification i').on('click', function () {
            $(this).parent().fadeOut(500, function () {
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

        /* Next Location */

        function next_location($search_string){
            var result = '';
            var next_location = $search_string.indexOf('next');
            if(next_location != -1){
                for(var i = next_location+5; i < $search_string.length ; i++)
                    if($search_string[i] == '&')
                        break;
                result = $search_string.slice(next_location+5, i);
            }
            return result;
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

        /* Variables */

        var login_email = $('#login-email');
        var login_password = $('#login-password');

        var register_menu_item = $('#register');
        var login_menu_item = $('#login');
        var recover_menu_item = $('#recover');

        var result_dictionary = {'recover-email': false,'login-email': false, 'login-password': false, 'register-first-name': false,
                                 'register-last-name': false, 'register-password': false, 'register-password-re': false,
                                 'register-email': false, 'register-birth-date': false};

        var recover_email = $('#recover-email');

        var reg_first_name = $('#register-first-name');
        var reg_last_name = $('#register-last-name');
        var reg_birth_date = $('#register-birth-date');
        var reg_password = $('#register-password');
        var reg_password_re = $('#register-password-re');
        var reg_email = $('#register-email');

        /* UI-Code */

        function set_film_cover_height(){
            var header_height = parseInt($('#top-header').css('height'));
            var film_cover_height_by_width = window.innerWidth/1.67;
            var film_cover_height_by_window = window.innerHeight - header_height;
            $('.carousel-container').css({
                'height': parseInt(Math.min(film_cover_height_by_width, film_cover_height_by_window)) + 'px',
                'margin-top': header_height + 'px'
            });
            var temp = $('#cover-film-info');
            if(parseInt($('#film-cover').css('height')) < 280)
                temp.css('display', 'none');
            else
                temp.css('display', 'block');
        }
        set_film_cover_height();

        if(window.innerWidth > 767){
            var left_bar = $('#left-bar');
            var margin_top = (parseFloat(left_bar.parent().css('height'))-parseFloat(left_bar.css('height')))/2;
            left_bar.css('padding-top', margin_top+'px');
        }

        reg_birth_date.datepicker({
            format: 'yyyy/mm/dd'
        }).on('show', function () {
            var temp = document.querySelector('.datepicker.dropdown-menu');
            var offset = parseFloat($(this).css('width'))-parseFloat($('.datepicker.dropdown-menu').css('width'));
            temp.style.left = parseFloat(temp.style.left) + offset + 'px';
        });

        $('#film-carousel').slick({
            slidesToShow: 1,
            slidesToScroll: 1,
            autoplay: true,
            autoplaySpeed: 5000
        }).on('click', function () {
            var login_form = $('#login-form');
            if (login_form.css('display') == 'block')
                login_form.slideToggle();
            var registration_form = $('#registration-form');
            if (registration_form.css('display') == 'block')
                registration_form.slideToggle();
            var recovery_form = $('#recovery-form');
            if (recovery_form.css('display') == 'block')
                recovery_form.slideToggle();
            $(this).css('opacity', '1');
            login_menu_item.removeClass('activated');
            register_menu_item.removeClass('activated');
            recover_menu_item.removeClass('activated');
        });
        function set_vertical_center($elem){
            var parent_height = parseFloat($elem.parent().css('height'));
            $elem.css('padding-top', (parent_height-parseFloat($elem.css('height')))/2+'px');
        }
        set_vertical_center($('.cover-film-synopsis'));
        set_vertical_center($('.cover-film-details'));
        set_vertical_center($('.cover-film-review'));

        recover_menu_item.click(function (e) {
            e.preventDefault();
            register_menu_item.removeClass('activated');
            login_menu_item.removeClass('activated');
            var registration_form = $('#registration-form');
            if (registration_form.css('display') == 'block')
                registration_form.slideToggle();
            var login_form = $('#login-form');
            if (login_form.css('display') == 'block')
                login_form.slideToggle();
            var recovery_form = $('#recovery-form');
            var display = recovery_form.css('display');
            recovery_form.slideToggle();
            var film_carousel = $('#film-carousel');
            if (display == 'block') {
                film_carousel.css('opacity', '1');
                $(this).removeClass('activated');
            }
            else {
                film_carousel.css('opacity', '0.4');
                $(this).addClass('activated');
            }
        });
        $('#pass-recover').click(function (e) {
            e.preventDefault();
            recover_menu_item.click();
        });
        $('#login-recover').click(function (e) {
            e.preventDefault();
            login_menu_item.click();
        });
        login_menu_item.click(function (e) {
            e.preventDefault();
            register_menu_item.removeClass('activated');
            recover_menu_item.removeClass('activated');
            var registration_form = $('#registration-form');
            if (registration_form.css('display') == 'block')
                registration_form.slideToggle();
            var recovery_form = $('#recovery-form');
            if (recovery_form.css('display') == 'block')
                recovery_form.slideToggle();
            var login_form = $('#login-form');
            var display = login_form.css('display');
            login_form.slideToggle();
            var film_carousel = $('#film-carousel');
            if (display == 'block') {
                film_carousel.css('opacity', '1');
                $(this).removeClass('activated');
            }
            else {
                film_carousel.css('opacity', '0.4');
                $(this).addClass('activated');
            }
        });
        $('#login-link').click(function (e) {
            e.preventDefault();
            login_menu_item.click();
        });
        register_menu_item.click(function (e) {
            e.preventDefault();
            login_menu_item.removeClass('activated');
            recover_menu_item.removeClass('activated');
            var login_form = $('#login-form');
            if (login_form.css('display') == 'block')
                login_form.slideToggle();
            var recovery_form = $('#recovery-form');
            if (recovery_form.css('display') == 'block')
                recovery_form.slideToggle();
            var registration_form = $('#registration-form');
            var display = registration_form.css('display');
            registration_form.slideToggle();
            var film_carousel = $('#film-carousel');
            if (display == 'block') {
                film_carousel.css('opacity', '1');
                $(this).removeClass('activated');
            }
            else {
                film_carousel.css('opacity', '0.4');
                $(this).addClass('activated');
            }
        });
        $('#register-link').click(function (e) {
            e.preventDefault();
            register_menu_item.click();
        });

        /* Show errors */

        function show_hint($box, $hint_str){
            if(!$box.parent().next().hasClass('hint')){
                var hint = $('<div class="hint">'+$hint_str+'</div>');
                hint.insertAfter($box.parent()).animate({'opacity': '1'});
                setTimeout(function () {
                    hint.fadeOut(function () {
                        $(this).remove();
                    });
                }, 3000);
            }
        }

        function show_condition($box, $hint_str, $dictionary_key){
            show_hint($box, $hint_str);
            result_dictionary[$dictionary_key] = false;
        }

        function append_error($error_str, $error){
            if($error_str != '')
                $error_str += '<br/>';
            $error_str += $error;
            return $error_str;
        }

        /* Client-side checks */

            /* Login-checks */

        login_email.blur(function () {
            var err_str = '';
            if(!isEmail($(this).val()))
                err_str = append_error(err_str, 'ایمیل وارد شده معتبر نیست');
            if(err_str != '')
                show_condition($(this), err_str, 'login-email');
            else
                result_dictionary['login-email'] = true;
        });
        login_password.blur(function () {
            var err_str = '';
            if($(this).val().length < 6)
                err_str = append_error(err_str, 'رمز عبور باید بیشتر از ۶ حرف باشد!');
            if(err_str != '')
                show_condition($(this), err_str, 'login-password');
            else
                result_dictionary['login-password'] = true;
        });

            /* Recover-checks */

        recover_email.blur(function () {
            var err_str = '';
            if(!isEmail($(this).val()))
                err_str = append_error(err_str, 'ایمیل وارد شده معتبر نیست');
            if(err_str != '')
                show_condition($(this), err_str, 'recover-email');
            else
                result_dictionary['recover-email'] = true;
        });

            /* Register-checks */

        reg_first_name.blur(function () {
            var err_str = '';
            if($(this).val() == '')
                err_str = append_error(err_str, 'نامتان را وارد کنید!');
            if(!valid_name($(this).val()))
                err_str = append_error(err_str, 'نام تنها می تواند شامل حروف، ارقام، @، +، - و _ باشد!');
            if(err_str != '')
                show_condition($(this), err_str, 'register-first-name');
            else
                result_dictionary['register-first-name'] = true;
        });
        reg_last_name.blur(function () {
            var err_str = '';
            if($(this).val() == '')
                err_str = append_error(err_str, 'نام خانوادگی؟');
            if(!valid_name($(this).val()))
                err_str = append_error(err_str, 'نام تنها می تواند شامل حروف، ارقام، @، +، - و _ باشد!');
            if(err_str != '')
                show_condition($(this), err_str, 'register-last-name');
            else
                result_dictionary['register-last-name'] = true;
        });
        reg_birth_date.blur(function () {
            var err_str = '';
            if(!isValidDate($(this).val()))
                err_str = append_error(err_str, 'فرمت تاریخ وارد شده درست نیست!');
            if(err_str != '')
                show_condition($(this), err_str, 'register-birth-date');
            else
                result_dictionary['register-birth-date'] = true;
        });
        reg_password.blur(function () {
            var err_str = '';
            if($(this).val().length < 5)
                err_str = append_error(err_str, 'رمز عبور باید بیشتر از ۴ حرف باشد!');
            if(err_str != '')
                show_condition($(this), err_str, 'register-password');
            else
                result_dictionary['register-password'] = true;
        });
        reg_password_re.blur(function () {
            var err_str = '';
            if(reg_password.val() != reg_password_re.val())
                err_str = append_error(err_str, 'رمزهای عبور مطابقت ندارند !');
            if(err_str != '')
                show_condition($(this), err_str, 'register-password-re');
            else
                result_dictionary['register-password-re'] = true;
        });
        reg_email.blur(function () {
            var err_str = '';
            if(!isEmail($(this).val()))
                err_str = append_error(err_str, 'ایمیل وارد شده معتبر نیست!');
            if(err_str != '')
                show_condition($(this), err_str, 'register-email');
            else
                result_dictionary['register-email'] = true;
        });
        reg_password.focus(function () {
            show_hint($(this), 'رمزعبورتون باید بیشتر از ۴ حرف باشه!<br/>حواستون به زبان کیبورد باشه! رمزعبورتون به همین زبان داخل سیستم ذخیره میشه!');
        });

        /* Registration */

        $('#btn-register').click(function (e) {
            e.preventDefault();
            reg_first_name.blur();
            reg_last_name.blur();
            reg_password.blur();
            reg_password_re.blur();
            reg_email.blur();
            reg_birth_date.blur();
            if(result_dictionary['register-first-name'] && result_dictionary['register-last-name'] &&
               result_dictionary['register-password'] && result_dictionary['register-password-re'] &&
               result_dictionary['register-email'] && result_dictionary['register-birth-date']){
                var result = send_ajax_request('user/register/',
                    'first-name='+reg_first_name.val()+'&last-name='+reg_last_name.val()+
                    '&password='+reg_password.val()+'&email='+reg_email.val()+'&birth-date='+reg_birth_date.val());
                var arr_result = result.split(' ');
                if(arr_result[0] == 'success')
                    window.location = '/user/'+arr_result[1];
                else{
                    var errors = result.split(' ');
                    for(var j = 0 ; j < errors.length ; j++){
                        if(errors[j]=='')
                            continue;
                        else{
                            switch (errors[j]){
                                case 'empty_first_name':
                                    show_hint(reg_first_name, 'نامتان را وارد کنید!');
                                    break;
                                case 'invalid_first_name':
                                    show_hint(reg_first_name, 'نام تنها می تواند شامل حروف، ارقام، @، +، - و _ باشد!');
                                    break;
                                case 'empty_last_name':
                                    show_hint(reg_last_name, 'نام خانوادگی؟');
                                    break;
                                case 'invalid_last_name':
                                    show_hint(reg_last_name, 'نام تنها می تواند شامل حروف، ارقام، @، +، - و _ باشد!');
                                    break;
                                case 'date':
                                    console.log('hello');
                                    show_hint(reg_birth_date, 'تاریخ وارد شده معتبر نیست!');
                                    break;
                                case 'password':
                                    show_hint(reg_password, 'رمز عبور وارد شده ضعیف است!');
                                    break;
                                case 'registered_email':
                                    show_hint(reg_email, 'ایمیل وارد شده قبلا ثبت شده است!');
                                    break;
                                case 'invalid_email':
                                    show_hint(reg_email, 'ایمیل وارد شده معتبر نیست!');
                                    break;
                            }
                        }
                    }
                }
            }
        });

        /* Login */

        $('#btn-login').click(function (e) {
            e.preventDefault();
            login_email.blur();
            login_password.blur();
            if(result_dictionary['login-email'] && result_dictionary['login-password']){
                var result = send_ajax_request('user/login/', 'email='+login_email.val()+'&password='+login_password.val());
                if(result == 'success'){
                    var next_loc = next_location(window.location.search);
                    if(next_loc != '')
                        window.location = next_loc;
                    else
                        window.location = '/time-line/';
                }
                else{
                    show_hint(login_email, 'شاید نام کاربری نادرست است!');
                    show_hint(login_password, 'شاید رمز وارد شده نادرست است!');
                }
            }
        });

        /* Logout */

        /* Recover */

        $('#btn-recovery').click(function (e) {
            e.preventDefault();
            recover_email.blur();
            if(result_dictionary['recover_email']){

            }
        });

        /* Test functions */

        function isEmail(email){
            var emailReg = /^([a-zA-Z0-9_.+-])+@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
            return emailReg.test(email);
        }
        function isValidDate($date){
            if($date == "" || $date == null)
                return false;
            var m = $date.match(/(\d{4})\/(\d{2})\/(\d{2})/);
            if( m === null || typeof m !== 'object')
                return false;
            if (typeof m !== 'object' && m !== null && m.size!==3)
                return false;
            var ret = true;
            var thisYear = new Date().getFullYear();
            var minYear = 1900;
            if( (m[1].length < 4) || m[1] < minYear || m[1] > thisYear)
                ret = false;
            if( (m[1].length < 2) || m[2] < 1 || m[2] > 12)
                ret = false;
            if( (m[1].length < 2) || m[3] < 1 || m[3] > 31)
                ret = false;
            return ret;
        }
        function valid_name($name){
            var result = $name.match(/[\u0600-\u06FFA-Za-z0-9-@+_]+/g);
            if (!result || result.length != 1)
                return false;
            return result[0].length == $name.length;
        }
    });
})(jQuery);