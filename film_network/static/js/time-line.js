(function($) {
    $(window).load(function () {
        $('.post aside .author').hover(function () {
            $(this).find('.name').slideToggle();
        }, function () {
            $(this).find('.name').slideToggle();
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