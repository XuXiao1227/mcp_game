var async = require('async');
var http = require('http');
var dc = require('db').dc;

var cons = require('cons');
var fileType = cons.fileType;

var MgFileStream = require('mystream').MgFileStream;

async.waterfall([
    function (cb) {   //连接数据库
        dc.init(function (err) {
            cb(err);
        });
    },
    //start web
    function (cb) {
        http.createServer(function (req, res) {
            console.log(req.url);
            var url = req.url;
            var pathAndParam = url.split('?');
            async.waterfall([
                function(cb)
                {
                    if(pathAndParam.length == 1)
                    {
                        cb('文件不存在\n');
                    }
                    else
                    {
                        cb(null);
                    }
                },
                function(cb)
                {
                    var paramStr = pathAndParam[1];
                    var paramStrArray = paramStr.split('=');
                    if(paramStrArray[0] == 'fileId')
                    {
                        cb(null, parseInt(paramStrArray[1]));
                    }
                    else
                    {
                        cb('文件不存在\n');
                    }
                },
                function(fileId, cb)
                {
                    var cond = {id: fileId};
                    var table = dc.pg.get("customer_file");
                    table.find(cond, {}, function (err, data) {
                        if (data && data.affected > 0) {
                            var set = data.rst[0];
                            filename = encodeURIComponent(set.name);    //处理中文文件名称
                            res.writeHead(200, {
                                'Content-disposition': 'attachment; filename=' + filename,
                                'Content-type': fileType.id[set.type].mime,
                                'Content-Length': set.size
                            });
                            var stream = new MgFileStream({fileId: fileId});
                            stream.pipe(res);
                        }
                        else
                        {
                            cb('文件不存在\n');
                        }
                    });
                }
            ], function (err, result) {
                if (err)
                {
                    res.writeHead(200, {'Content-Type': 'text/plain'});
                    res.end(err);
                }
            });
        }).listen(8081);
        console.log('Server running at http://127.0.0.1:1337/');
        cb(null, "file server start success!");
    }
], function (err, result) {
    if (err)
    {
        console.error(err); // -> null
    }
    else
    {
        console.log(result); // -> 16
    }
});

