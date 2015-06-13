(function($) {
    $(window).load(function () {
        if(window.innerWidth > 652){
            $('.chat-user img').hover(function () {
                $(this).parent().parent().css('margin-left', '5px').find('.chat-user-container').css('width', '100%')
                    .end().find('.chat-user-name').addClass('visible');
            }, function () {
                $(this).parent().parent().css('margin-left', '0').find('.chat-user-container').css('width', 'initial')
                    .end().find('.chat-user-name').removeClass('visible');
            });
            var temp = $('.chat-user .chat-user-name');
            temp.css('max-width', parseInt(temp.parent().parent().css('width')) -
            parseFloat(temp.prev().prev().css('width')) - 10 + 'px');
        }
        else {
            $('.chat-user .chat-user-name').addClass('visible');
        }
        if(window.innerWidth < 445){
            $('#dialog-boxes').css('left', '9%');
        }
        function add_text_to_box($box, $text) {
            var dialog_text = $('<div>', {class: 'dialog-text right'});
            var text_div = $('<div>', {class: 'text'}).text($text);
            dialog_text.append(text_div);
            $box.find('.dialog-content').append(dialog_text);
        }

        var arr_size = $('#users-list').children().length;
        var users_array = new Array(arr_size);
        for (var i = 0; i < arr_size; i++)
            users_array[i] = false;

        $('.chat-user').click(function () {
            if (users_array[$(this).prevAll().length])
                return;
            users_array[$(this).prevAll().length] = true;
            var chat_box = $('<div>', {class: 'chat-box'}).css('display', 'none');
            var chat_title = $('<div class="title"><i class="icon icon-remove"></i>' +
            $(this).find('.chat-user-name').text() + '</div>');
            var chat_dialog_content = $('<div>', {class: 'dialog-content'});
            var chat_text_area = $('<textarea>', {rows: '1'});
            chat_box.append(chat_title).append(chat_dialog_content).append(chat_text_area);
            $('#dialog-boxes').append(chat_box);
            chat_box.slideToggle();
            chat_text_area.keyup(function () {
                chat_key_up($(this));
            });
            chat_text_area.keypress(function () {
                chat_key_press($(this), event);
            });
            chat_box.find('i').click(function () {
                chat_remove($(this));
            });
        });
        function chat_key_up($chat_box) {
            var num_of_columns = (parseInt($chat_box.css('width')) - 4) / 9;
            var num_of_rows = parseInt($chat_box.val().length / num_of_columns);
            if ($chat_box.val().length - num_of_rows * num_of_columns > 0 || num_of_rows == 0)
                num_of_rows++;
            $chat_box.attr('rows', num_of_rows);
        }
        function chat_key_press($chat_box, event) {
            if (event.which == 13) {
                var text_area_text = $chat_box.val();
                $chat_box.val('');
                if (text_area_text != '')
                    add_text_to_box($chat_box.parent(), text_area_text);
                var dialog_content = $chat_box.prev()[0];
                dialog_content.scrollTop = dialog_content.scrollHeight;
                event.preventDefault();
            }
        }
        function chat_remove($chat_box) {
            $chat_box.parent().parent().slideToggle(function () {
                $chat_box.remove();
                users_array[$chat_box.prevAll().length] = false;
            });
        }
        $('.chat-box').each(function () {
            $(this).find('i').on('click', function () {
                chat_remove($(this));
            });
            $(this).find('textarea').keypress(function () {
                chat_key_press($(this), event);
            });
        });
    });
})(jQuery);