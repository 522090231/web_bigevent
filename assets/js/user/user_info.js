var form = layui.form;
var layer = layui.layer;
$(function() {

    //自定义校验规则
    form.verify({
        nickname: [
            /^[\S]{1,6}$/, '密码必须1到6位，且不能出现空格'
        ]
    })
    initUserInfo();

    //初始化用户信息函数
    function initUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function(res) {
                if (res.status !== 0) {
                    //获取用户信息失败
                    return layer.msg(res.message);
                } else {
                    //成功
                    //用form.val()为表单赋值,layui框架
                    form.val('formUserInfo', res.data)
                }
            }
        })
    }

    //重置表单数据函数
    $('#btnReset').on('click', function(e) {
        e.preventDefault();
        initUserInfo();
    })

    //表单数据的提交
    $('.layui-form').on('submit', function(e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    //提交修改信息失败
                    return layer.msg(res.message);
                } else {
                    //成功
                    layer.msg(res.message);
                    //调用父页面中的方法,重新渲染用户头像和信息
                    window.parent.getUserInfo();
                }
            }
        })
    })
})