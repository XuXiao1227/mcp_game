if(CurSite.COMP.AdminBookAddType == undefined) {

    var AdminBookAddType = function(config)
    {
        var self = this;
        self.id = config.id;    //控件标志
        self.parent = config.parent;    //控件所属容器
        self._init();
    };

    AdminBookAddType.prototype._init = function()
    {
        var self = this;
        var submitButton = $('#' + self.id + '_submit');
        submitButton.on("click", function(){
            var name = $('#' + self.id + '_name').val();
            var body = {
                name:name
            };
            CurSite.postDigest({cmd:"AB01"}, null, body, function(err, backBody){
                if(err)
                {
                    alert(err.description);
                }
                else
                {
                    alert(backBody);
                }
            });
        });
    };

    CurSite.COMP.AdminBookAddType = AdminBookAddType;
}