if(CurSite.COMP.AdminSysIndex == undefined) {

    var AdminSysIndex = function(config)
    {
        var self = this;
        self.id = config.id;    //控件标志
        self.parent = config.parent;    //控件所属容器
        self._init();
    };

    AdminSysIndex.prototype._init = function()
    {
        var self = this;

        //游戏管理
        $('#gameMan').on('click', function () {
            self._toPage("./admin_game_index.html");
        });

        //奖级管理
        $('#game_level_man').on('click', function () {
            self._toPage("./admin_game_manLevel.html");
        });

        //账户管理
        $('#customerMan').on('click', function () {
            self._toPage("./admin_user_index.html");
        })

        //投注管理
        $('#ticket_man').on('click', function () {
            self._toPage("./admin_ticket_manTicket.html");
        })

        //帐户管理
        $('#gold_log').on('click', function () {
            self._toPage("./admin_account_goldLog.html");
        })

        //商品管理
        $('#goodsMan').on('click', function () {
            self._toPage("./admin_goods_man.html");
        })

        //任务管理
        $('#task_man').on('click', function () {
            self._toPage("./admin_task_man.html");
        })

    };

    AdminSysIndex.prototype._toPage = function(url)
    {
        var self = this;
        var id = CurSite.createUUID();
        CurSite.getHtml(url, {id:id, parent:'content'}, function(err, data){
            $('#content').html(data);
        });
    };

    CurSite.COMP.AdminSysIndex = AdminSysIndex;
}

var id = CurSite.createUUID();
CurSite.IMPL[id] = new CurSite.COMP.AdminSysIndex({id:id, parent:null});

