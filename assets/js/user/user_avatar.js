$(function() {
    var layer = layui.layer;

    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
        // 1.2 配置选项
    const options = {
            // 纵横比
            aspectRatio: 1 / 1,
            // 指定预览区域
            preview: '.img-preview'
        }
        // 1.3 创建裁剪区域
    $image.cropper(options)


    //上传按钮点击事件
    $('#btnChooseImage').on('click', function() {
        $('#file').click();
    })

    //文件改变的时候图片改变
    $('#file').on('change', function(e) {
        //用户选择的文件
        var filelist = e.target.files;
        if (filelist.length === 0) {
            return layer.msg('请选择图片');
        } else {
            //选了图片,渲染到页面,copper中的步骤
            var file = e.target.files[0];
            var imgURL = URL.createObjectURL(file);
            $image
                .cropper('destroy') // 销毁旧的裁剪区域
                .attr('src', imgURL) // 重新设置图片路径
                .cropper(options) // 重新初始化裁剪区域
        }
    })

    //确定上传头像
    $('#btnUpload').on('click', function() {
        //拿到用户裁剪后的图片,copper中的步骤
        var dataURL = $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png') // 将 Canvas 画布上的内容，转化为 base64 格式的字符串

        $.ajax({
            method: 'POST',
            url: '/my/update/avatar',
            data: {
                avatar: dataURL
            },
            success: function(res) {
                if (res.status !== 0) {
                    console.log(res);

                    return layer.msg('更换头像失败');
                } else {
                    layer.msg('更换头像成功');
                    //此时调用父页面的方法渲染头像
                    window.parent.getUserInfo();
                }
            }
        })
    })
})