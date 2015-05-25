if(CurSite.COMP.SysCmd == undefined) {

    var SysCmd = function(config)
    {
        var self = this;
        self.id = config.id;    //控件标志
        self.parent = config.parent;    //控件所属容器
        self._init();
    };

    SysCmd.prototype._init = function()
    {
        var self = this;
        var submitButton = $('#' + self.id + '_submit');
        submitButton.click(function(event){
            var cmd = $('#' + self.id + '_cmd').val();
            var head = {cmd:cmd};

            var cookies = CurSite.getCookie();
            var key = cookies["st"];
            head.digestType = '3des';
            head.userId = cookies["userId"];
            head.userType = cookies["userType"];
            head.timeStamp = CurSite.getDateStr();

            var bodyStr = $('#' + self.id + '_body').val();
            var bodyNode = JSON.parse(bodyStr);
            bodyNode.uuid = CurSite.createUUID();
            bodyStr = JSON.stringify(bodyNode);
            $('#' + self.id + '_msg_body').val(bodyStr);

            var msgNode = CurSite.encrypt(head, key, bodyStr);

            $('#' + self.id + '_msg_encoded').val(JSON.stringify(msgNode));

            $.ajax({
                url:CurSite.interPath,
                data:msgNode,
                type:'post',
                cache:false,
                dataType:'json',
                success:function(data) {
                    $('#' + self.id + '_backmsg').val(JSON.stringify(data));
                    var backBodyStr = data.body;
                    var decodedBodyStr = CurSite.decrypt(data.head, key, backBodyStr);
                    $('#' + self.id + '_backmsg_decoded').val(decodedBodyStr);
                },
                error : function() {
                    console.log({code:-1, description:"网络错误"});
                }
            });

        });
    };

    CurSite.COMP.SysCmd = SysCmd;
}