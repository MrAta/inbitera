(function($) {
    $(window).load(function () {
        $('.star-rating:not(.fixed) span').on('click', function () {
            console.log("hello ")
            var $elem_parent = $(this).parent();
            $elem_parent.attr('class', $elem_parent.attr('class').replace(/ fixed-[0-9]*\.?[0-9]*/, ''));
            $elem_parent.addClass('fixed-' + (($(this).nextAll().length + 1) / 2));
            $elem_parent.turn_on_star_rating();
        });
        $('.star-rating span').hover(function () {
            $(this).parent().attr('title', $(this).nextAll().length + 1);
        });
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
        $('.star-rating.fixed').each(function () {
            $(this).turn_on_star_rating();
        });
    });
})(jQuery);