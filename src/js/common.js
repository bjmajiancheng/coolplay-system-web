;
(function ($, window, document, undefined) {
    $.extend($.fn.validatebox.defaults.rules, {
        telephone: {    //第三步,选中校验谁
            validator: function(value){    //第四步, 具体编写校验规则
                var reg = /^1[3,4,5,6,7,8,9][0-9]{9}$/;

                return reg.test(value);
            },
            message: '请输入正确的手机号!'   //第五步,如果输入内容不符合校验规则,出现的提示语.
        },
        idcard: {// 验证身份证
            validator: function (value) {
                return /^\d{15}(\d{2}[A-Za-z0-9])?$/i.test(value);
            },
            message: '身份证号码格式不正确'
        }
    });
})(jQuery, window, document);