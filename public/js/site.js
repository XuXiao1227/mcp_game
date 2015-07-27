var CurSite = new function(){};
CurSite.host = window.document.location.protocol + "//" + window.document.location.hostname;
CurSite.site = CurSite.host;
var port = window.document.location.port;
if(port && port.length > 0)
{
    CurSite.site +=  ":" + port;
}
CurSite.getContextPath = function() {
    return "";
};
CurSite.loadFlag = {};  //组件加载标识
CurSite.conextPath = CurSite.getContextPath();
CurSite.getAbsolutePath = function(url) {
    return CurSite.site + CurSite.conextPath + "/" + url;
};
CurSite.interPath = CurSite.getAbsolutePath("filter/interface.htm");
CurSite.COMP = {};  //组件定义
CurSite.IMPL = {};  //组件实现

CurSite.fileSite = "http://file.versou.com:8081";

CurSite.createUUID = function() {
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "";
    var uuid = s.join("");
    return uuid;
};
/**
 * 格式化int，不够的位置补0
 * @param value
 * @param len
 */
CurSite.formatInt= function(value, len)
{
    var str = value + "";
    var prefix = "";
    for(var i = 0; i < len - str.length; i++)
    {
        prefix += "0";
    }
    return prefix + str;
};
CurSite.getDateStr = function()
{
    var date = new Date();
    var str = "";
    str += date.getFullYear();
    str += "-";
    str += CurSite.formatInt(date.getMonth() + 1, 2);
    str += "-";
    str += CurSite.formatInt(date.getDay(), 2);
    str += " ";
    str += CurSite.formatInt(date.getHours(), 2);
    str += ":";
    str += CurSite.formatInt(date.getMinutes(), 2);
    str += ":";
    str += CurSite.formatInt(date.getSeconds(), 2);
    str += ".";
    str += CurSite.formatInt(date.getMilliseconds(), 3);
    return str;
};

CurSite.arrayBufferToBase64 = function(buffer) {
    var binary = '';
    var bytes = new Uint8Array( buffer );
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    console.log(binary);
    return window.btoa(binary);
}

CurSite.getDefualtKey = function()
{
    return "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";
};

CurSite.getDefaultIv = function()
{
    return "AAAAAAAAAAA=";
};

/**
 * get cookies
 */
CurSite.getCookie = function()
{
    var cookieStr = document.cookie;
    var cookieStrArray = cookieStr.split(";");
    var siteCookies = {};
    for(var index in cookieStrArray)
    {
        if(cookieStrArray[index].length > 0)
        {
            var cookieArray = cookieStrArray[index].split("=");
            var key = cookieArray[0].trim();
            var value = cookieArray[1].trim();
            siteCookies[key] = value;
        }
    }
    return siteCookies;
};

CurSite.setCookie = function(name, value, expSeconds)
{
    var exp = new Date();
    if(expSeconds < 0)  //负数，表示不过期
    {
        expSeconds = 1000000;
    }
    exp.setTime(exp.getTime() + expSeconds*1000);
    document.cookie = name + "="+ value + ";expires=" + exp.toGMTString() + ";path=/";
};


/**
 * 接口数据进行加密
 * @param headNode
 * @param key
 * @param bodyStr
 * @returns {{head: *, body: string}}
 */
CurSite.encrypt = function(headNode, key, bodyStr)
{
    if(headNode.digestType == "3des-empty")
    {
        key = CurSite.getDefualtKey();
    }
    var arrayKey = CryptoJS.enc.Base64.parse(key);
    var iv  = CryptoJS.enc.Base64.parse(CurSite.getDefaultIv());
    var encrypted = CryptoJS.TripleDES.encrypt(bodyStr, arrayKey, {iv:iv, mode:CryptoJS.mode.CFB, padding: CryptoJS.pad.NoPadding}) + "";
    return {head:JSON.stringify(headNode), body:encrypted};
};

/**
 * 接口数据进行解密
 * @param headNode
 * @param key
 * @param encodedBodyStr
 * @returns {*}
 */
CurSite.decrypt = function(headNode, key, encodedBodyStr)
{
    if(headNode.digestType == "3des-empty")
    {
        key = CurSite.getDefualtKey();
    }
    var arrayKey = CryptoJS.enc.Base64.parse(key);
    var iv  = CryptoJS.enc.Base64.parse(CurSite.getDefaultIv());
    var decrypted = CryptoJS.TripleDES.decrypt(encodedBodyStr, arrayKey, {iv:iv, mode:CryptoJS.mode.CFB, padding: CryptoJS.pad.NoPadding});
    return decrypted.toString(CryptoJS.enc.Utf8);
};

/**
 * 获取指定url的html内容
 * @param url
 * @param params 要发送到服务器的参数
 * @param cb
 */
CurSite.getHtml = function(url, params, cb)
{
    var self = this;
    url += "?";
    for(var key in params)
    {
        url += key + "=";
        if(typeof params[key] == 'object')  //对象，需要转成字符串
        {
            url += encodeURIComponent(JSON.stringify(params[key]));
        }
        else
        {
            url += encodeURIComponent(params[key]);
        }
        url += "&";
    }
    $.ajax({
        url:url,
        type:'GET',
        cache:false,
        dataType:'html',
        success:function(data) {
            cb(null, data);
        },
        error : function() {
            cb("网络异常", "网络异常");
        }
    });
};

CurSite.postUnDigest = function(head, body, cb)
{
    var self = this;
    head.digestType = '3des-empty';
    head.userId = '';
    head.userType = 'GUEST';
    head.timeStamp = self.getDateStr();
    body.uuid = CurSite.createUUID();   //消息的唯一id
    console.log("send:");
    console.log(body);
    var bodyStr = JSON.stringify(body);
    var msgNode = CurSite.encrypt(head, null, bodyStr);
    $.ajax({
        url:CurSite.interPath,
        data:msgNode,
        type:'post',
        cache:false,
        dataType:'json',
        success:function(data) {
            var backBodyStr = data.body;
            var decodedBodyStr = CurSite.decrypt(data.head, null, backBodyStr);
            var backBody = JSON.parse(decodedBodyStr);
            console.log("back:");
            console.log(backBody);
            var err = null;
            if(backBody.code != 1)
            {
                err = {code:backBody.code, description:backBody.description};
            }
            delete backBody.code;
            delete backBody.description;
            cb(err, backBody);
        },
        error : function() {
            cb({code:-1, description:"网络错误"}, null); //unknown error
        }
    });
};

CurSite.postDigest = function(head, key, body, cb)
{
    var self = this;
    var cookies = self.getCookie();
    if(!key)
    {
        var key = cookies["st"];
    }
    head.digestType = '3des';
    head.userId = cookies["userId"];
    head.userType = cookies["userType"];
    head.timeStamp = self.getDateStr();
    body.uuid = CurSite.createUUID();   //消息的唯一id
    console.log("send:");
    console.log(body);
    var bodyStr = JSON.stringify(body);
    var msgNode = CurSite.encrypt(head, key, bodyStr);
    $.ajax({
        url:CurSite.interPath,
        data:msgNode,
        type:'post',
        cache:false,
        dataType:'json',
        success:function(data) {
            var backBodyStr = data.body;
            var decodedBodyStr = CurSite.decrypt(data.head, key, backBodyStr);
            var backBody = JSON.parse(decodedBodyStr);
            console.log("back:");
            console.log(backBody);
            var err = null;
            if(backBody.code != 1)
            {
                err = {code:backBody.code, description:backBody.description};
            }
            delete backBody.code;
            delete backBody.description;
            cb(err, backBody);
        },
        error : function() {
            cb({code:-1, description:"网络错误"}, null); //unknown error
        }
    });
};
