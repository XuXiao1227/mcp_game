if(CurSite.COMP.UserManFile == undefined) {

    var UserManFile = function(config)
    {
        var self = this;
        self.id = config.id;    //控件标志
        self.parent = config.parent;    //控件所属容器
        self.contentId = self.id + '_content';
        self._init();
    };

    UserManFile.prototype._init = function()
    {
        var self = this;

        //新建文件夹
        $('#' + self.id + '_newFolder').on('click', function (event) {
            self._toPage('/user_file_newFolder.html');
        });

        //查询
        $('#' + self.id + '_search').on('click', function (event) {
            self._toPage('/user_myFile.html');
        });
    };

    UserManFile.prototype._toPage = function(url)
    {
        var self = this;
        var id = CurSite.createUUID();
        var pgData = {};
        pgData.id = id;
        pgData.parent = self.contentId;
        CurSite.getHtml(url, pgData, function(err, data){
            $('#' + self.contentId).html(data);
        });
    };

    CurSite.COMP.UserManFile = UserManFile;
}