var express = require('express'), app = express();
var http = require('http');
var async = require('async');
var path = require('path');
var mime = require('mime');
var fs = require('fs');
var httpServer = http.createServer(app);

var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser')

var pageCtl = require("control").pageCtl;

var esut = require("easy_util");
var log = esut.log;
var digestUtil = esut.digestUtil;

var config = require('config');
var ec = config.ec;

var factory = require('factory');
var cmdFac = factory.cmdFac;

var dc = require('db').dc;

var MgFileStream = require('mystream').MgFileStream;

var Gateway = function(){
    var self = this;
};

Gateway.prototype.start = function(){
    var self = this;
    async.waterfall([
        function(cb){   //连接数据库
            dc.init(function(err){
                cb(err);
            });
        },
        //start web
        function(cb)
        {
            self.startWeb();
            cb(null, "success");
        }
    ], function (err, result) {
        if(err)
        {
            console.error(err);
        }
        else
        {
            console.log(result);
        }
    });
};

Gateway.prototype.startWeb = function()
{
    var self = this;

    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');

    //是Connect內建的middleware，设置此处可以将client提交过来的post请求放入request.body中
    app.use(bodyParser.urlencoded({extended:true}));
    //cookie
    app.use(cookieParser());
    //public文件夹下面的文件，都暴露出来，客户端访问的时候，不需要使用public路径
    app.use(express.static(__dirname + '/public'));

    app.get('/', function(req, res){
        res.render('index', {
            title: 'Express',
            youAreUsingJade:true
        });
    });

    app.get('/index.html', function(req, res){
        res.render('index', {
            title: 'Express',
            youAreUsingJade:true
        });
    });

    app.post("/", function(req, res){
        var head = null;
        try {
            head = JSON.parse(req.body.head);
        }
        catch(err)
        {
            console.log("消息格式错误.");
        }
        finally
        {
            var bodyStr = req.body.body;
            bodyStr = bodyStr.replace(/ /g, '+');
            self.handle(head, bodyStr, function(backMsgNode){
                console.log(backMsgNode);
                res.json(backMsgNode);
            });
        }
    });

    app.post("/filter/interface.htm", function(req, res){
        var head = null;
        try {
            head = JSON.parse(req.body.head);
        }
        catch(err)
        {
            console.log("消息格式错误.");
        }
        finally
        {
            var bodyStr = req.body.body;
            self.handle(head, bodyStr, function(backMsgNode){
                console.log(backMsgNode);
                res.json(backMsgNode);
            });
        }
    });

    app.get('/:name', function(req, res, next){
        var path = req.params.name.match(/^([a-zA-Z0-9_]+)(\.html)$/);
        if(path)
        {
            var jadePathArray = path[1].split("_");
            var jadePath = jadePathArray.join("/");
            var headNode = {cmd:jadePathArray};
            headNode.userId = req.cookies.userId;
            headNode.userType = req.cookies.userType;
            headNode.key = req.cookies.st;
            console.log("page request info:");
            console.log(headNode);
            console.log(req.query);
            pageCtl.handle(headNode, req.query, function(err, data){
                if(err)
                {
                    res.render("sys/error", err);
                }
                else
                {
                    data.jadePath = jadePath;
                    res.render(jadePath, data);
                }
            });
        }
        else
        {
            next();
        }
    });

    httpServer.listen(8089);
    log.info("程序在端口8089启动成功.");
};

Gateway.prototype.handle = function(head, bodyStr, cb)
{
    var self = this;
    if(head.cmd != "UP02")
    {
        console.log(head);
        console.log(bodyStr);
    }
    cmdFac.handle(head, bodyStr, function(err, bodyNode) {
        var key = head.key;
        if(key == undefined)    //key标志着是否可以识别出是哪个用户
        {
            key = digestUtil.getEmptyKey();
            if(head.digestType == '3des')
            {
                head.digestType = "3des-empty";
            }
        }
        else
        {
            delete head.key;
        }
        if (err) {
            log.error(err);
            bodyNode.code = err.code;
            bodyNode.description = err.description;
        }
        else
        {
            bodyNode.code = ec[1].code;
            bodyNode.description = ec[1].description;
        }
        console.log(bodyNode);
        var decodedBodyStr = digestUtil.generate(head, key, JSON.stringify(bodyNode));
        cb({head:head, body:decodedBodyStr});
    });
};

var gateway = new Gateway();
gateway.start();