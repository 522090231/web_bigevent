$(function() {
    var layer = layui.layer;
    var form = layui.form;
    //获取文章分类列表
    initArtCateList();

    //获取文章分类列表函数
    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                var htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr);
            }
        })
    }

    var indexAdd = null;
    //给添加按钮绑定事件
    $('#btnAddCate').on('click', function() {
        indexAdd = layer.open({
            type: 1,
            title: '添加文章分类',
            content: $('#dialog-add').html(), //在html写好标签引入此处
            area: ['500px', '250px']
        })
    })

    //form是JS动态添加的,需要用户代理获得表单
    //绑定submit事件
    $('body').on('submit', '#form-add', function(e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    //新增失败
                    return layer.msg(res.message);
                } else {
                    //新增成功
                    initArtCateList();
                    layer.msg(res.message);
                    //弹出层关闭
                    layer.close(indexAdd);
                }
            }
        })
    })

    var indexEdit = null;
    //通过代理形式为编辑按钮绑定点击事件
    $('tbody').on('click', '#btn-edit', function() {
        indexEdit = layer.open({
            type: 1,
            title: '编辑文章分类',
            content: $('#dialog-edit').html(), //在html写好标签引入此处
            area: ['500px', '250px']
        })

        var id = $(this).attr('data-id');

        //发请求获得对应的数据
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function(res) {
                form.val('form-edit', res.data);
            }
        })

        //用代理的形式给动态生成的修改弹出层绑定submit事件
        $('body').on('submit', '#form-edit', function(e) {
            e.preventDefault();
            $.ajax({
                method: 'POST',
                url: '/my/article/updatecate',
                data: $(this).serialize(),
                success: function(res) {
                    if (res.status !== 0) {
                        //失败
                        return layer.msg(res.message);
                    } else {
                        //成功
                        layer.close(indexEdit);
                        initArtCateList();
                        layer.msg(res.message);
                    }
                }
            })
        })
    })

    //通过代理的形式绑定删除按钮事件
    $('tbody').on('click', '#btn-delete', function() {
        var id = $(this).attr('data-id');
        //提示用户是否要删除
        layer.confirm('确定删除?', { icon: 3, title: '提示' }, function(index) {
            //点确认后就删除
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        //失败
                        return layer.msg(res.message);
                    } else {
                        //删除成功
                        layer.msg(res.message);
                        layer.close(index);
                        initArtCateList();
                    }
                }
            })
        });
    })

})