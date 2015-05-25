var async = require('async');

var esut = require('easy_util');
var log = esut.log;
var dateUtil = esut.dateUtil;

var dc = require('db').dc;

var cons = require('cons');
var customerType = cons.customerType;

async.waterfall([
    function(cb){
        dc.init(function(err){
            cb(err);
        });
    },
    function(cb){
        var table = dc.main.get("customer");
        table.drop(function(err, data){
            cb(null);
        });
    },
    function(cb)
    {
        var table = dc.main.get("customer");
        table.create(function(err, data){
            cb(err);
        });
    },
    function(cb)
    {
        var table = dc.main.get("customer");
        var customer = {
            username:"liming",
            password:"123456",
            type:customerType.NORMAL.id,
            regTime:new Date().getTime()
        }
        table.save(customer, [], function(err, data){
            cb(err);
        });
    }
], function (err, result) {
    log.info(err);
    log.info("end...........");
});