/**
 * Created by chenguojun on 8/10/16.
 */
;
(function ($, window, document, undefined) {
    var vkey = "system_" + new Date().getTime() + "_" + Math.floor(Math.random() * 10);

    function initLogin() {
        $("#captcha_img").attr("src", App.href + "/api/noneAuth/captcha?vkey=" + vkey);
        $("#captcha_a").on("click", function () {
            vkey = "system_" + new Date().getTime() + "_" + Math.floor(Math.random() * 10);
            $("#captcha_img").attr("src", App.href + "/api/noneAuth/captcha?vkey=" + vkey + "&s=" + new Date().getTime());
        });
        $('#username,#password,#vcode').bind('keypress', function (event) {
            if (event.keyCode == "13") {
                login();
            }
        });
        $("#login_btn").on("click", login);
    }

    function alertValidate(alertText) {
        var alertTmpl = '<div class="alert alert-${type_} alert-dismissable" role="alert">'
            + '<button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>'
            + '${alert_}</div>';
        var alertDiv = $.tmpl(alertTmpl, {
            "type_": 'warning',
            "alert_": alertText
        });
        if($('div[role=alert]').size() == 0) {
            $("#login-form").prepend(alertDiv);
            alertDiv.delay(5 * 1000).fadeOut();
            App.scrollTo(alertDiv, -200);
        } else {
            $('div[role=alert]').show();
            $('div[role=alert]').text(alertText);

            $('div[role=alert]').delay(5 * 1000).fadeOut();
            App.scrollTo($('div[role=alert]'), -200);
        }
    }

    var login = function () {
        if ($.trim($("#username").val()) == "") {
            alertValidate("登录名不能为空!");
            $("#captcha_a").trigger("click");
            return;
        }
        if ($.trim($("#password").val()) == "") {
            alertValidate("密码不能为空!");
            $("#captcha_a").trigger("click");
            return;
        }
        if ($.trim($("#vcode").val()) == "") {
            alertValidate('验证码不能为空!');
            $("#captcha_a").trigger("click");
            return;
        }
        var fields = JSON.stringify(
            {
                "username": $("#username").val(),
                "password": $("#password").val(),
                "vcode": $("#vcode").val(),
                "vkey": vkey
            });
        $.ajax({
            type: 'POST',
            url: App.href + "/api/token/login",
            contentType: "application/json",
            dataType: "json",
            data: fields,
            success: function (result) {
                if (result.code === 200) {
                    $.cookie('coolplay_system_token', result.token, {expires: 7});
                    /*$.fn.cookie('coolplay_system_token', result.token, { expires: 7 });*/

                    window.location.href = App.href + "/index.html";
                } else {
                    alertValidate(result.message);
                    $("#captcha_a").trigger("click");
                }
            }
        });
    };
    $(document).ready(function () {
        initLogin();

        $("#forgetPass_btn").on('click', function() {
            window.location.href = App.href + "/forgetPass.html";
        });
    });

    function setCookie(name, value) {
        var date = new Date();
        var expires = 7;
        date.setTime(date.getTime() + expires * 24 * 60 * 60 * 1000)
        document.cookie = name + "=" + value + ";expires=" + date.toGMTString() + ";path=" + "/";
    }
})(jQuery, window, document);
