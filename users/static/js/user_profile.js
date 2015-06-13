(function($){
    $(window).load(function(){
        $('#profile-cover').css('margin-top', parseFloat($('#top-header').css('height')));
        $('#favorites, #following, #followers').css('display', 'none');
        var $active_tab = $('#stats ul li:first-child');
        var $section_dict = {0: $('#following'), 1: $('#followers'), 2: $('#favorites'), 3: $('#user-posts')};
        var $current_tab = $section_dict[3];
        $('#stats ul li').on('click', function () {
            $current_tab.slideUp(500);
            $current_tab = $section_dict[$(this).nextAll().length];
            $current_tab.slideDown(1000);
            $active_tab.removeClass('stat-active');
            $active_tab = $(this);
            $active_tab.addClass('stat-active');
        });
    });
})(jQuery);