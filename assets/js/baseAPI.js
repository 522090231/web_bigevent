//每次调用JQ ajax的时候,一定会先调用ajaxPrefilter函数
$.ajaxPrefilter(function(options) {
    //options就是Ajax对象,它的url就是我们所写的url
    //这样就不用每次都写根路径
    options.url = 'http://www.liulongbin.top:3007' + options.url;

    //统一为有权限的接口设置headers请求头

    // headers: {
    //     Authorization: localStorage.getItem('token') || ''
    // },
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }
    // options.complete = function(res) {
    //     if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
    //         //清空token
    //         localStorage.removeItem('token');
    //         //跳转登录页面
    //         location.href = '/login.html'
    //     }
    // }
})