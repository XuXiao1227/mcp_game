if(CurSite.COMP.BookDetailBlock == undefined) {

    var BookDetailBlock = function(config)
    {
        var self = this;
        self.id = config.id;    //控件标志
        self.parent = config.parent;    //控件所属容器
        self.block_id = config.block_id;
        self.content = CryptoJS.enc.Utf8.stringify(CryptoJS.enc.Base64.parse(config.content));
        self.isContentEmpty = false;    //章节内容是否为空
        self.listUrl = './book_blockList.html';
        self.curParaId = '';
        self.type = -2; //-2，非编辑模式，-1，上方插入内容，0，编辑，1，下方插入内容
        self._init();
    };

    BookDetailBlock.prototype._init = function()
    {
        var self = this;
        //左侧编辑按钮容器
        self.ctrlContainer = $('#' + self.id + '_ctrl');
        self.contentContainer = $('#' + self.id + '_content');
        if(self.content.length > 0)
        {
            self.contentContainer.html(self.content);
            var children = self.contentContainer.children();
            console.log(children);
            if(children.length > 0)
            {
                self.curParaId = children.first().attr("id");
            }
            children.hover(function(event) {
                if(self.type == -2)
                {
                    self.curParaId = event.target.id;
                    self.ctrlContainer.css("padding-top", event.target.offsetTop + 'px');
                }
            });
        }
        else
        {
            self.isContentEmpty = true;
        }

        self.textAreaId = self.id + "_editArea";
        var textAreaHtml = self._getEditHtml();
        self.editNode = $(textAreaHtml);
        //self._bindEditEvent(self.);


        //删除菜单
        var deleteMenuItem = $('#' + self.id + '_delete');
        deleteMenuItem.click(function(event){
            if(self.type == -2 && self.curParaId.length > 0)   //当前操作的段落不为空
            {
                var nextId = $('#' + self.curParaId + ' + div').attr('id');
                $('#' + self.curParaId).remove();
                if(nextId)
                {
                    self.curParaId = nextId;
                }
                else
                {
                    self.curParaId = '';
                }
                self._afterChange();
            }
        });

        //上方插入菜单
        var beforeMenuItem = $('#' + self.id + '_insertBefore');
        beforeMenuItem.click(function(event){
            if(self.type == -2 && self.curParaId.length > 0)   //当前操作的段落不为空
            {
                $('#' + self.curParaId).before(self.editNode);
                self._bindEditEvent(self.editNode);
                self.editNode.show();
                self.type = -1;
                $('#' + self.textAreaId).focus();
            }
        });

        //下方插入菜单
        var afterMenuItem = $('#' + self.id + '_insertAfter');
        afterMenuItem.click(function(event){
            if(self.type == -2 && self.curParaId.length > 0)   //当前操作的段落不为空
            {
                $('#' + self.curParaId).after(self.editNode);
                self._bindEditEvent(self.editNode);
                self.editNode.show();
                self.type = 1;
                $('#' + self.textAreaId).focus();
            }
        });

        //编辑
        var hereMenuItem = $('#' + self.id + '_insertHere');
        hereMenuItem.click(function(event){
            if(self.type == -2 && self.curParaId.length > 0)   //当前操作的段落不为空
            {
                var curParaNode = $('#' + self.curParaId);
                curParaNode.after(self.editNode);
                self._bindEditEvent(self.editNode);
                self.editNode.show();
                self.type = 0;
                curParaNode.hide(); //隐藏当前条目
                $('#' + self.textAreaId).val(curParaNode.html());
                $('#' + self.textAreaId).focus();
            }
            else if(self.isContentEmpty)    //内容为空
            {
                self.editNode.show();
                self.contentContainer.append(self.editNode);
                self._bindEditEvent(self.editNode);
                self.type = 0;
                $('#' + self.textAreaId).focus();
            }
        });

        //保存到服务器
        $('#' + self.id + '_saveToServer').click(function(event){
            var html = self.contentContainer.html();
            var str = CryptoJS.enc.Utf8.parse(html);
            var baseStr = CryptoJS.enc.Base64.stringify(str);
            var body = {
                id:self.block_id,
                content:baseStr
            };
            CurSite.postDigest({cmd:"BK07"}, null, body, function(err, backBody){
                if(err)
                {
                    alert(err.description);
                }
                else
                {
                    alert("操作成功");
                }
            });
        });

    };

    BookDetailBlock.prototype._getEditHtml = function()
    {
        var self = this;
        var html = '<div class="container-fluid", style="padding-left:0px;">';

        //文本区域
        html += '<div class="row">';
        html += '<div class="col-md-12">';
        html += '<textarea id="' + self.textAreaId + '" style="width:854px;height:300px;"></textarea>';
        html += '</div>';
        html += '</div>';

        //下方工具栏
        html += '<div class="row">';
        html += '<div class="col-md-12">';
        html += '<button id="' + self.id + '_save", type="button", class="btn btn-default">保存</button>';
        html += '</div>';
        html += '</div>';

        html += '</div>';
        return html;
    };

    /**
     * 内容发生了改变
     * @private
     */
    BookDetailBlock.prototype._afterChange = function()
    {
        var self = this;
        var html = self.contentContainer.html();
        if(!html)
        {
            self.isContentEmpty = true;
        }
        else
        {
            self.isContentEmpty = false;
        }
    };

    /**
     * 绑定编辑器事件
     * @private
     */
    BookDetailBlock.prototype._bindEditEvent = function(editNode)
    {
        var self = this;
        var editSaveButton = editNode.find('#' + self.id + '_save');
        editSaveButton.click(function(event){
            var appendText = $('#' + self.textAreaId).val();
            $('#' + self.textAreaId).val("");
            self.editNode.remove();
            self._append(appendText);
            self._afterChange();
            self._resetCursor();
            self.type = -2;
        });
    };

    /**
     * 追加内容
     * @param text
     * @private
     */
    BookDetailBlock.prototype._append = function(text)
    {
        var self = this;
        var curParaNode = $('#' + self.curParaId);
        if(!text)   //没有内容，会直接退出方法
        {
            if(self.type == 0)  //编辑模式下，删除当前条目
            {
                curParaNode.remove();
                self.curParaId = '';    //当前条目
            }
            return;
        }
        var textArray = text.split('\n');
        if(self.type == 1)  //在段落后面插入记录
        {
            for(var i = textArray.length - 1; i >= 0; i--)
            {
                var para = '<div id="' + CurSite.createUUID() + '">' + textArray[i] + '</div>';
                var paraNode = $(para);
                paraNode.hover(function(event){
                    if(self.type == -2)
                    {
                        self.curParaId = event.target.id;
                        self.ctrlContainer.css("padding-top", event.target.offsetTop + 'px');
                    }
                });
                if(self.isContentEmpty)
                {
                    self.contentContainer.prepend(paraNode);
                }
                else
                {
                    curParaNode.after(paraNode);
                }
            }
        }
        else if(self.type == -1 || self.type == 0)
        {
            var newCurId = '';
            for(var i = 0; i < textArray.length; i++)
            {
                var curId = CurSite.createUUID();
                var para = '<div id="' + curId + '">' + textArray[i] + '</div>';
                var paraNode = $(para);
                paraNode.hover(function(event){
                    if(self.type == -2)
                    {
                        self.curParaId = event.target.id;
                        self.ctrlContainer.css("padding-top", event.target.offsetTop + 'px');
                    }
                });
                if(self.isContentEmpty)
                {
                    self.contentContainer.append(paraNode);
                }
                else
                {
                    curParaNode.before(paraNode);
                }
                if(i == 0 && self.type == 0)
                {
                    newCurId = curId;
                }
            }
            if(self.type == 0)  //编辑模式下，删除当前条目
            {
                console.log("删除条目...........");
                console.log(self.curParaId);
                curParaNode.remove();
                self.curParaId = newCurId;    //当前条目
            }
        }
    };

    /**
     * 对游标进行重新定位
     * @param id
     * @private
     */
    BookDetailBlock.prototype._resetCursor = function()
    {
        var self = this;
        if(self.curParaId)
        {
            var offset = $('#' + self.curParaId).position().top;
            self.ctrlContainer.css("padding-top", parseInt(offset) + 'px');
        }
        else
        {
            self.ctrlContainer.css("padding-top", '0px');
        }
    };

    /**
     * 跳转到列表页面
     * @private
     */
    BookDetailBlock.prototype._toListPage = function()
    {
        var self = this;
        var id = CurSite.createUUID();
        CurSite.getHtml(self.listUrl, {id:id, parent:self.parent, chapter_id:self.chapter_id}, function(err, data){
            $('#' + self.parent).html(data);
        });
    };

    CurSite.COMP.BookDetailBlock = BookDetailBlock;
}