$(function() {
    //调用获取用户基本信息
    getUserInfo();
    var layer = layui.layer
        //退出
    $('#btnLogout').on('click', function() {
        //弹窗layer
        //提示用户是否退出
        layer.confirm('确定退出登录?', { icon: 3, title: '提示' }, function(index) {
            //清空本地token
            localStorage.removeItem('token');
            //跳转到登录页
            location.href = '/login.html';
            //关闭询问框
            layer.close();
        });

    })
})

//获取用户基本信息
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        //headers请求头配置对象
        // headers: {
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function(res) {
            if (res.status !== 0) {
                //失败
                return layui.layer.msg(res.message)
            } else {
                //成功,渲染头像
                renderAvatar(res.data);
            }
        },
        //无论成功与否一定会调用这个complete回调函数
        complete: function(res) {
            if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
                //清空token
                localStorage.removeItem('token');
                //跳转登录页面
                location.href = '/login.html'
            }
        }
    })
}

//头像渲染
function renderAvatar(user) {
    var name = user.nickname || user.username;
    $('#welcome').html('欢迎您,' + name)
        //按需渲染用户头像
    if (user.user_pic !== null) {
        //有头像
        $('.layui-nav-img').attr('src', user.user_pic).show();
        $('.text-avatar').hide();
    } else {
        //没头像,用文本头像
        $('.layui-nav-img').hide();
        var first = name[0].toUpperCase();
        $('.text-avatar').html(first).show();
    }
}