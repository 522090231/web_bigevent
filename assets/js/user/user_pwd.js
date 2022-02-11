$(function() {
    var form = layui.form;
    var layer = layui.layer;
    //自定义校验规则
    form.verify({
        pwd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        //校验原密码和新密码是否一致
        samepwd: function(value) {
            var pwd = $('.layui-input-block [name=oldPwd]').val();
            if (pwd === value) {
                return '新旧密码不能相同';
            }
        },

        //校验新密码和确认新密码是否一致
        repwd: function(value) {
            var pwd = $('.layui-input-block [name=newPwd]').val();
            if (pwd !== value) {
                return '新密码和确认密码不相同';
            }
        }
    })

    $('.layui-form').on('submit', function(e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    //更新失败
                    return layer.msg(res.message);
                } else {
                    //密码更新成功
                    $('.layui-form')[0].reset();
                }
            }
        })
    })
})