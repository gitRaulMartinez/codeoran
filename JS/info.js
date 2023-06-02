$(document).ready(function(){
    $('.indiceInfo').each(function(i) {
        console.log($(this));
        console.log($('.cajaLinkInfo').eq(i));
    });
});

$(window).scroll(function() {
    var windscroll = $(window).scrollTop();
    if (windscroll >= 100) {
        $('.contenido-perfil').each(function(i) {
            //console.log($(this).position().top +' ? '+ windscroll);
            if ($(this).position().top - 20 <= windscroll) { // << here '+ 84' instead of '- 20'
                $('div.indiceInfo a.activoLink').removeClass('activoLink');
                $('div.indiceInfoResponsivo a.activoLink').removeClass('activoLink');
                $('div.indiceInfo a.cajaLinkInfo').eq(i).addClass('activoLink');
                $('div.indiceInfoResponsivo a.cajaLinkInfo').eq(i).addClass('activoLink');
            }
        });

    } else {
        $('div.indiceInfo a.activoLink').removeClass('activoLink');
        $('div.indiceInfoResponsivo a.activoLink').removeClass('activoLink');
    }
}).scroll();

$(document).on('click', '.cajaLinkInfo', function(){
    var scrollAnchor = $(this).attr('data-scroll');
    var scrollPoint = $('h4[data-anchor="'+scrollAnchor+'"]').offset().top - 90;
    $('body,html').animate({
        scrollTop: scrollPoint
    }, 100);
    return false;
});