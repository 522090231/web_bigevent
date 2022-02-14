$(function() {
    var layer = layui.layer;
    var form = layui.form;
    initCate();
    //富文本
    initEditor();
    //定义加载文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    //获取失败
                    return layer.msg(res.message);
                } else {
                    //获取成功,调用模板引擎渲染下拉选项
                    var htmlStr = template('tpl-cate', res);
                    $('[name=cate_id').html(htmlStr);
                    //记得调用form.render()
                    form.render();
                }
            }
        })
    }

    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    //为选择封面按钮绑定点击事件
    $('#btnChooseImage').on('click', function() {
        $('#coverFile').click();
    })

    //监听coverFile的change事件,获取用户选择的文件
    $('#coverFile').on('change', function(e) {
        //获取到用户选择文件的数组
        var files = e.target.files;
        if (files.length <= 0) {
            //没有选择文件
            return
        } else {
            //选择了文件
            var newImgURL = URL.createObjectURL(files[0]);
            $image
                .cropper('destroy') // 销毁旧的裁剪区域
                .attr('src', newImgURL) // 重新设置图片路径
                .cropper(options) // 重新初始化裁剪区域
        }
    })

    //定义文章的发布状态
    var art_state = '已发布';
    //存为草稿按钮
    $('#btnSave2').on('click', function() {
        art_state = '草稿';
    })

    $('#form-pub').on('submit', function(e) {
        e.preventDefault();
        var fd = new FormData($(this)[0]);
        fd.append('state', art_state);
        //把封面切好的图片输出为一个对象
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function(blob) { // 将 Canvas 画布上的内容，转化为文件对象
                // 文件对象存储到fd中
                fd.append('cover_img', blob);
                publishArticle(fd);

            });


    })

    //定义一个发布文章的方法
    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            // 注意：如果向服务器提交的是 FormData 格式的数据，
            // 必须添加以下两个配置项
            contentType: false,
            processData: false,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('发布文章失败！')
                }
                layer.msg('发布文章成功！')
                    // 发布文章成功后，跳转到文章列表页面
                location.href = '/article/art_list.html'
            }
        })
    }
})