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


function onContactSubmit() {
    
    $('.contact-name').on('input', function () {
        var input = $(this);
        var is_name = input.val();
        if (is_name) { input.removeClass("invalid").addClass("valid"); }
        else { input.removeClass("valid").addClass("invalid"); }
    });

    $('.contact-email').on('input', function () {
        var input = $(this);
        var re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        var is_email = re.test(input.val());
        if (is_email) { input.removeClass("invalid").addClass("valid"); }
        else { input.removeClass("valid").addClass("invalid"); }
    });

    $('.contact-message').keyup(function (event) {
        var input = $(this);
        var message = $(this).val();
        console.log(message);
        if (message) { input.removeClass("invalid").addClass("valid"); }
        else { input.removeClass("valid").addClass("invalid"); }
    });


    $('#contact-form').on('submit', function () {
        e.preventDefault();

        $("#submit-button").click(function (event) {
            var form_data = $("#contact").serializeArray();
            var error_free = true;
            for (var input in form_data) {
                var element = $("#contact-" + form_data[input]['name']);
                var valid = element.hasClass("valid");
                var error_element = $("span", element.parent());
                if (!valid) { error_element.removeClass("error").addClass("error_show"); error_free = false; }
                else { error_element.removeClass("error_show").addClass("error"); }
            }
            if (!error_free) {
                event.preventDefault();
            }
            else {
                alert('No errors: Form will be submitted');
            }
        });

        $('#submit-button').find('.icon-spin').css('display', 'inline-block');

        $.ajax({
            type: "POST",
            url: '../php_mailer/mail_handler.php',
            data: $("#contact-form").serialize(),
            success: function (result) {
                setTimeout(function () {
                    $('.msg-sent').show()
                    $('#submit-button').find('.icon-spin').css('display', 'none');
                    $(".form-control").val("")
                }, 1000)
            }
        });
    })
}




$('#contact-form').submit(function () {

    if ($('#contact-form').hasClass('clicked')) {
        return false;
    }

    $('#contact-form').addClass('clicked');

    var buttonCopy = $('#contact-form button').html(),
        errorMessage = $('#contact-form button').data('error-message'),
        sendingMessage = $('#contact-form button').data('sending-message'),
        okMessage = $('#contact-form button').data('ok-message'),
        hasError = false;

    $('#contact-form .error-message').remove();

    $('.requiredField').each(function () {
        if ($.trim($(this).val()) == '') {
            var errorText = $(this).data('error-empty');
            $(this).parents('.controls').append('<span class="error-message" style="display:none;">' + errorText + '.</span>').find('.error-message').fadeIn('fast');
            $(this).addClass('inputError');
            hasError = true;
        } else if ($(this).is("input[type='email']") || $(this).attr('name') === 'email') {
            var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,10})?$/;
            if (!emailReg.test($.trim($(this).val()))) {
                var invalidEmail = $(this).data('error-invalid');
                $(this).parents('.controls').append('<span class="error-message" style="display:none;">' + invalidEmail + '.</span>').find('.error-message').fadeIn('fast');
                $(this).addClass('inputError');
                hasError = true;
            }
        }
    });

    if (hasError) {
        $('#contact-form button').html('<i class="fa fa-times"></i>' + errorMessage);
        setTimeout(function () {
            $('#contact-form button').html(buttonCopy);
            $('#contact-form').removeClass('clicked');
        }, 2000);
    } else {
        $('#contact-form button').html('<i class="fa fa-spinner fa-spin"></i>' + sendingMessage);

        var formInput = $(this).serialize();
        $.ajax({
            type: "POST",
            url: $(this).attr('action'),
            data: formInput,
            dataType: 'JSON',
            success: function (data) {
                if (data.success) {
                    $('#contact-form button').html('<i class="fa fa-check"></i>' + okMessage);
                    $('#contact-form')[0].reset();
                    setTimeout(function () {
                        $('#contact-form button').html(buttonCopy);
                        $('#contact-form').removeClass('clicked');
                    }, 2000);
                } else {

                    var invalidEmail = $('#contact-mail').data('error-invalid');
                    $('#contact-mail').parents('.controls').append('<span class="error-message" style="display:none;">' + invalidEmail + '.</span>').find('.error-message').fadeIn('fast');
                    $('#contact-mail').addClass('inputError');
                    $('#contact-form button').html('<i class="fa fa-times"></i>' + errorMessage);
                    $('#contact-form button').html('<i class="fa fa-times"></i>' + errorMessage);
                    setTimeout(function () {
                        $('#contact-form button').html(buttonCopy);
                        $('#contact-form').removeClass('clicked');
                    }, 2000);
                }

            },
            error: function (err) {
                console.error(err);

            }
        })
    }

    return false;
});


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
