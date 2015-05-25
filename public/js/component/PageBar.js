if(CurSite.COMP.PageBar == undefined) {

    var PageBar = function(id, path, cur, limit){
        var self = this;
        this.id = id;   //容器id
        self.path = path;
        self.cur = parseInt(cur);
        this.limit = limit; //每页的条数
        var liNodes = $("#" + this.id).children(".pagination").children();
        liNodes.on("click", function(Event){
            var curEle = $(this).children("a:first");
            var pIndex = parseInt(curEle.attr("pIndex"));
            self.toPage(pIndex);
        });
    };

    /**
     * 调转到指定页，如果未传递pIndex参数，则调转至当前页号
     */
    PageBar.prototype.toPage = function(pIndex)
    {
        var self = this;
        var url = self.path;
        if(pIndex == undefined)
        {
            pIndex = self.cur;
        }
        var skip = (pIndex - 1)*self.limit;
        url += '?skip=' + skip + "&limit=" + self.limit;
        if(self.getCondition)
        {
            var cond = self.getCondition();
            var condStr = encodeURIComponent(JSON.stringify(cond));
            url += "&cond=" + condStr;
        }
        window.location = url;
    };

    CurSite.COMP.PageBar = PageBar;
}


