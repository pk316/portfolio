$(function () {
    lightbox();
    sticky();
    utils();
    demo();
    onContactSubmit()
});

/* =========================================
 *  mailer
 *  =======================================*/

$('.contact-name').on('input', function () {
    var input = $(this);
    var is_name = input.val();
    if (is_name) { input.removeClass("invalid").addClass("valid"); }
    else { input.removeClass("valid").addClass("invalid"); }
});

$('.contact-email').on('input', function() {
	var input=$(this);
    // var re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    var re = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,10})?$/;
	var is_email=re.test(input.val());
	if(is_email){input.removeClass("invalid").addClass("valid");}
	else{input.removeClass("valid").addClass("invalid");}
});

$('.contact-message').keyup(function (event) {
    var input = $(this);
    var message = $(this).val();
    console.log(message);
    if (message) { input.removeClass("invalid").addClass("valid"); }
    else { input.removeClass("valid").addClass("invalid"); }
});

function onContactSubmit() {
    $("#contact-form button").click(function (event) {
        event.preventDefault();
        var form_data = $("#contact-form").serializeArray();
        var error_free = true;
        for (var input in form_data) {
            var element = $(".contact-" + form_data[input]['name']);
            var valid = element.hasClass("valid");
            var error_element = $("span", element.parent());
            if (!valid) { error_element.removeClass("error").addClass("error_show"); error_free = false; }
            else { error_element.removeClass("error_show").addClass("error"); }
        }
        if (!error_free) {
            event.preventDefault();
        }
        else {
            $('.msg-sent').hide();
             $('#submit-button').find('.icon-spin').css('display', 'inline-block');
            $.ajax({
                type: "POST",
                url: '../php_mailer/mail_handler.php',
                data: $("#contact-form").serialize(),
                timeout: 10000,
                success: function (result) {
                    setTimeout(function () {
                        $('.msg-sent').show()
                        $('.alert-fail').hide()
                        $('#submit-button').find('.icon-spin').css('display', 'none');
                        $(".form-control").val("")
                    }, 1000)
                },
                error: function (error){
                    setTimeout(function () {
                        $('.alert-fail').show()
                    }, 1000)
                }
            });
        }
    });
}

//     $('#contact-form').on('submit', function () {
//         event.preventDefault();

//         $('#submit-button').find('.icon-spin').css('display', 'inline-block');

//     $.ajax({
//         type : "POST",
//         url : '../php_mailer/mail_handler.php',
//         data : $("#contact-form").serialize(),
//         success : function (result) { 
//             setTimeout(function () {
//                 $('.msg-sent').show()
//                 $('#submit-button').find('.icon-spin').css('display', 'none');
//                 $(".form-control").val("")
//             }, 1000)
//         }
//     });
// })}
    

function demo() {
    $("#page").change(function () {
        if ($(this).val() !== '') {
            window.location.href = $(this).val();
        }
        return false;
    });
}

/* =========================================
 *  lightbox
 *  =======================================*/

function lightbox() {
    $(document).delegate('*[data-toggle="lightbox"]', 'click', function (event) {
        event.preventDefault();
        $(this).ekkoLightbox();
    });
}

/* =========================================
 *  sticky header 
 *  =======================================*/

function sticky() {
    $(".header").sticky();
}



function utils() {

    /* tooltips */

    $('[data-toggle="tooltip"]').tooltip();

    /* click on the box activates the radio */

    $('#checkout').on('click', '.box.shipping-method, .box.payment-method', function (e) {
        var radio = $(this).find(':radio');
        radio.prop('checked', true);
    });
    /* click on the box activates the link in it */

    $('.box.clickable').on('click', function (e) {

        window.location = $(this).find('a').attr('href');
    });
    /* external links in new window*/

    $('.external').on('click', function (e) {

        e.preventDefault();
        window.open($(this).attr("href"));
    });
    /* animated scrolling */

    /* animated scrolling */

    $('.scroll-to, #navigation a').click(function (event) {
        event.preventDefault();
        var full_url = this.href;
        var parts = full_url.split("#");
        var trgt = parts[1];

        $('body').scrollTo($('#' + trgt), 800, {offset: -40});

    });

}

$.fn.alignElementsSameHeight = function () {
    $('.same-height-row').each(function () {

        var maxHeight = 0;
        var children = $(this).find('.same-height');
        children.height('auto');
        if ($(window).width() > 768) {
            children.each(function () {
                if ($(this).innerHeight() > maxHeight) {
                    maxHeight = $(this).innerHeight();
                }
            });
            children.innerHeight(maxHeight);
        }

        maxHeight = 0;
        children = $(this).find('.same-height-always');
        children.height('auto');
        children.each(function () {
            if ($(this).innerHeight() > maxHeight) {
                maxHeight = $(this).innerHeight();
            }
        });
        children.innerHeight(maxHeight);
    });
}

$(window).load(function () {

    windowWidth = $(window).width();
    windowHeight = $(window).height();

    $(this).alignElementsSameHeight();

});
$(window).resize(function () {

    newWindowWidth = $(window).width();
    newWindowHeight = $(window).height();

    if (windowWidth !== newWindowWidth) {
        setTimeout(function () {
            $(this).alignElementsSameHeight();
        }, 100);
        windowWidth = newWindowWidth;
        windowHeight = newWindowHeight;
    }

});
