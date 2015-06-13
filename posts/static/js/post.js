(function($) {
    $(window).load(function () {
        var post_image = $('.post .post-image');
        post_image.css('height', (parseFloat(post_image.css('width'))*1.4146)+'px');
        $('.post .post-image').hover(function () {
            $(this).find('img').css("opacity", "0.3").end().find('.hover-film-info').css({"opacity": "1"});
        }, function () {
            $(this).find('img').css("opacity", "1").end().find('.hover-film-info').css({"opacity": "0"});
        });
        var info_height = 0;
        var cover = $('.hover-film-info');
        info_height += parseFloat(cover.find('h3').css('height'));
        info_height += parseFloat(cover.find('h4').css('height'));
        info_height += parseFloat(cover.find('h5').css('height'));
        info_height += parseFloat(cover.find('.star-rating').css('height'));
        $('.hover-film-info h3:first-child').css('padding-top', (parseFloat(cover.css('height'))-info_height)/2+'px');
        $('.post-content').each(function () {
            if(window.innerWidth > 767) {
                var father = $(this);
                var post_text = $(this).find('.post-text');
                var padding_top = (parseFloat(father.css('height')) - parseFloat(post_text.css('height'))
                    - parseFloat(father.find('.post-footer').css('height')) - 2) / 2;
                $(this).find('.post-text').css({
                    'padding-top': padding_top + 'px',
                    'padding-bottom': padding_top + 'px'
                });
            }
            else
                $(this).find('.post-text').css({'padding-top': '2%', 'padding-bottom': '2%'});
        });
        if(document.location.href.indexOf('post_view') != -1)
            $('.comments').css('display', 'block');
    });
})(jQuery);