if(CurSite.COMP.UserUploadAvatar == undefined)
{
    var UserUploadAvatar = function(config)
    {
        var self = this;
        self.id = config.id;
        self.parent = config.parent;
        self.selectImgId = CurSite.createUUID();
        self.imgId = 'sourceImg';
        self.previewId = self.id + '_preview';

        self.picWidth = -1; //图片变形的目标宽度
        self.picX = -1; //图片的起始点，x轴
        self.picY = -1; //图片起始点，y轴
        self._init();
    };

    UserUploadAvatar.prototype._init = function()
    {
        var self = this;
        $('#myModal').on('shown.bs.modal', function (e) {
            CurSite.getHtml("./user_selectImg.html", {id:self.selectImgId}, function(err, data){
                $('#myModalBody').html(data);
            });
        });

        $('#select').on('click', function(e){
            var comp = CurSite.IMPL[self.selectImgId];
            var selectId = comp.getSingle();
            if(selectId != undefined)
            {
                self.picId = selectId;
                self.picWidth = -1; //图片变形的目标宽度
                self.picX = -1; //图片的起始点，x轴
                self.picY = -1; //图片起始点，y轴

                $('#myModal').modal('hide');
                var url = CurSite.fileSite + "?fileId=" + selectId;
                $('#' + self.imgId).attr('src', url);
                $('#' + self.id + '_previewImg').attr('src', url);
                $('#' + self.imgId).imgAreaSelect({ maxWidth: 200, maxHeight: 200, handles: true,
                    aspectRatio: '1:1', onSelectChange: function(img, selection){
                        self._preview(selection);
                    }});
            }
        });

        $('#' + self.id + '_generate').on('click', function(e){
            if(self.picWidth > 0)
            {
                var body = {picId:self.picId, picWidth:self.picWidth,
                    picX:self.picX, picY:self.picY};
                CurSite.postDigest({cmd:"UP03"}, null, body, function(err, backBody){
                    if(err)
                    {
                        alert(err.description);
                    }
                    else
                    {
                        alert(backBody);
                    }
                });
            }
            else
            {
                alert("请选择图片的一个区域");
            }
        });

    };

    UserUploadAvatar.prototype._preview = function(selection)
    {
        var self = this;    //这儿的this是imageselect对象
        console.log(selection);
        var scaleX = 100 / (selection.width || 1);
        var width = Math.round(scaleX * 400);
        var marginLeft = Math.round(scaleX * selection.x1);
        var marginTop = Math.round(scaleX * selection.y1);

        self.picWidth = width; //图片变形的目标宽度
        self.picX = marginLeft; //图片的起始点，x轴
        self.picY = marginTop; //图片起始点，y轴

        var node = $('#' + self.id + '_previewImg');
        node.css({
            width: width + 'px',
            marginLeft: '-' + marginLeft + 'px',
            marginTop: '-' + marginTop + 'px'
        });
    };

    CurSite.COMP.UserUploadAvatar = UserUploadAvatar;
}