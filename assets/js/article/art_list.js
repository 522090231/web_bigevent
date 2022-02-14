$(function() {
    var layer = layui.layer;
    var form = layui.form;
    var laypage = layui.laypage;
    //定义一个查询的参数对象,将来请求数据的时候
    //将请求对象提交到服务器
    var q = {
        pagenum: 1, //页码值,默认第一页
        pagesize: 2, //默认一页显示2行数据
        cate_id: '', // 分类Id,默认空
        state: '', //文章发布的状态,默认空
    }

    //初始化
    initTable();
    initCate();
    //获取文章列表数据的函数
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function(res) {
                if (res.status !== 0) {
                    //失败
                    return layer.msg(res.message);
                } else {
                    //成功,使用模板引擎渲染页面数据
                    var htmlStr = template('tpl-table', res);
                    $('tbody').html(htmlStr);
                    //渲染分页的方法
                    renderPage(res.total);
                }
            }
        })
    }

    //定义补0的函数
    function padZero(n) {
        return n > 9 ? n : '0' + n;
    }

    //用template修改时间样式
    template.defaults.imports.dataFormat = function(date) {
        const dt = new Date(date);
        var y = dt.getFullYear();
        var m = padZero(dt.getMonth() + 1);
        var d = padZero(dt.getDate());
        var hh = padZero(dt.getHours());
        var mm = padZero(dt.getMinutes());
        var ss = padZero(dt.getSeconds());
        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss;
    }

    //初始化文章分类下拉列表的函数
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    //获取失败
                    return layer.msg(res.message);
                } else {
                    //获取成功,需要模版引擎渲染
                    var htmlStr = template('tpl-cate', res);
                    $('[name=cate_id]').html(htmlStr);
                    // 不加下面一句话页面不会被渲染
                    form.render();
                }
            }
        })
    }

    //为筛选表单绑定submit事件
    $('#form-search').on('submit', function(e) {
        e.preventDefault();
        //获取表单中选中选项的值
        var cate_id = $('[name=cate_id').val();
        var state = $('[name=state').val();
        q.cate_id = cate_id;
        q.state = state;
        //根据最新筛选条件重新渲染表格内容
        initTable();
    })

    //渲染分页的方法,每次表格渲染就调用
    function renderPage(total) {
        //使用layui框架来渲染分页
        laypage.render({
            elem: 'pageBox', //注意，这里的 test1 是 ID，不用加 # 号
            count: total, //数据总数，从服务端得到
            limit: q.pagesize, //每页显示多少数据
            curr: q.pagenum, //默认第几页显示数据  
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            //触发jump回调的方式有2中
            //1.点击页码的时候会触发 first = undefined
            //2.laypage.render调用的时候会触发,这个项目是这个原因导致死循环 first = true

            jump: function(obj, first) {
                //obj包含了当前分页的所有参数，比如：
                //console.log(obj.curr); 得到当前页，以便向服务端请求对应页的数据。
                //console.log(obj.limit); 得到每页显示的条数
                //修改了q对象中的值再调用一次initTable,这样会无限死循环,因为initTable默认会第一页显示
                //死循环的原因是jump会不断被触发,因为两边相互互相调用,形成死锁
                q.pagenum = obj.curr;
                //把最新额条目数赋值到q查询对象pagesize
                q.pagesize = obj.limit;
                if (!first) {
                    //点击页码的时候
                    initTable();
                }
            }
        });
    }

    //通过代理为删除按钮绑定点击事件
    $('tbody').on('click', '.btn-delete', function() {
        var id = $(this).attr('data-id');
        //删除按钮的个数
        var len = $('.btn-delete').length;
        layer.confirm('确定删除?', { icon: 3, title: '提示' }, function(index) {

            //删除
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        //删除文章失败
                        return layer.msg(res.message);
                    } else {
                        //删除文章成功
                        layer.msg(res.message);
                        //当数据删除后,判断这一页是否还有其他数据
                        //如果没有其他数据,则页码值-1
                        if (len - 1 === 0) {
                            //删除后页面没有数据
                            //页码值最小必须为1
                            q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;
                        }
                        initTable();
                    }
                }
            })

            layer.close(index);
        });
    })
})