//每次调用JQ ajax的时候,一定会先调用ajaxPrefilter函数
$.ajaxPrefilter(function(options) {
    //options就是Ajax对象,它的url就是我们所写的url
    //这样就不用每次都写根路径
    options.url = 'http://www.liulongbin.top:3007' + options.url;
})