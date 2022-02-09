$(function() {
    //点击去注册账号
    $('#link_reg').on('click', function() {
        $('.login-box').hide();
        $('.reg-box').show();
    })

    //点击去登录
    $('#link_login').on('click', function() {
        $('.login-box').show();
        $('.reg-box').hide();
    })

    //用户名密码正则
    var form = layui.form;
    //自定义校验规则
    form.verify({
        pwd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        //校验两次密码是否一致
        repwd: function(value) {
            var pwd = $('.reg-box [name=password]').val();
            if (pwd !== value) {
                return '两次密码不一致';
            }
        }
    })

    //layui中的对象
    var layer = layui.layer;
    //监听注册表单提交事件
    $('#form_reg').on('submit', function(e) {
        e.preventDefault();
        $.post('/api/reguser', { username: $('#form_reg [name=username]').val(), password: $('#form_reg [name=password]').val() }, function(res) {
            if (res.status !== 0) {
                return layer.msg(res.message);
            } else {
                //注册成功
                layer.msg('注册成功');
                //模拟点击事件回到登录界面
                $('#link_login').click();
            }
        })
    })

    //监听登录表单提交事件
    $('#form_login').on('submit', function(e) {
        e.preventDefault();
        $.ajax({
            url: '/api/login',
            method: 'POST',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    //登录失败
                    return layer.msg(res.message);

                } else {
                    //登录成功
                    layer.msg(res.message);
                    localStorage.setItem('token', res.token);
                    location.href = '/index.html';
                }
            }
        })
    })
})