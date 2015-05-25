if(CurSite.COMP.UserUpload == undefined)
{
    var UserUpload = function(config)
    {
        var self = this;
        self.id = config.id;
        self.parent = config.parent;
        self._init();
    };

    UserUpload.prototype._init = function()
    {
        var self = this;
        if (!window.File && !window.FileReader) {
            alert('Your browser does not support the File API. Please use modern browser');
        }
        else
        {
            $('#choose-button').on('click', function () {
                $('#choose-file').click();
            })
            $('#choose-file').on('change', function(){

                $('#choose-button').button("loading");

                var cur = 0;    //当前读取进度
                var blockSize = 1024*10;   //读取的文件块大小,10KB
                var percent = 0;    //当前文件读取百分比进度
                var fileSize = 0;   //文件大小
                var file = null;    //文件句柄
                var fileReader = null;  //文件流句柄
                var fileId = null;
                var fileType = null;

                var readMore = function()
                {
                    var sendSize = blockSize;
                    if(cur + blockSize >= fileSize)
                    {
                        sendSize = fileSize - cur;
                    }
                    console.log("文件大小:" + fileSize + ",cur:" + cur + ",send:" + sendSize);
                    var newFile = file.slice(cur, cur + sendSize);
                    fileReader.readAsBinaryString(newFile);
                }

                var updatePg = function()
                {
                    percent = parseInt(cur*100/fileSize);
                    if(percent > 100)
                    {
                        percent = 100;
                    }
                    console.log(percent);
                    $('#file-pg').text(percent + '%');
                    $('#file-pg').css("width", percent + '%');
                }

                var start = function(cb)
                {
                    fileType = file.type;
                    var body = {name:file.name, size:file.size, type:fileType};
                    CurSite.postDigest({cmd:"UP01"}, null, body, function(err, backBody){
                        if(err)
                        {
                            alert(err.description);
                        }
                        else
                        {
                            fileSize = file.size;
                            cb(null, {fileId:backBody.fileId})
                        }
                    });
                }

                var finish = function()
                {
                    $('#file-pg').text(file.name + '已经成功上传!');
                    $('#choose-button').button("reset");
                }

                //处理数据
                var handle = function(event)
                {
                    var str = window.btoa(event.target.result);
                    var body = {start:cur, size:event.total, fileId:fileId, content:str};
                    CurSite.postDigest({cmd:"UP02"}, null, body, function(err, backBody){
                        if(err)
                        {
                            alert(err.description);
                        }
                        else
                        {
                            cur += blockSize;
                            updatePg();
                            if(cur < fileSize)
                            {
                                readMore();
                            }
                            else
                            {
                                finish();
                            }
                        }
                    });
                }

                var file = document.getElementById('choose-file').files[0];
                if (file) {
                    start(function(err, data){
                        fileId = data.fileId;
                        fileReader = new FileReader();
                        fileReader.onload = handle;
                        readMore();
                    })
                }
            })
        }
    };

    CurSite.COMP.UserUpload = UserUpload;
};