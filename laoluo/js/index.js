var _iframe;
var isIphone=false, isWX=false, isIflymmp=false, isWebkit=false;
var _direct;
var WIN = window,
    DOC = document,
    LOC = location,
    NAV = navigator;
var body = DOC.body;
var config = {
    /*Android*/
    scheme_Adr: 'dubao://openhome?location=newslist&entry=h5',
    /*iPhone*/
    scheme_IOS: 'www.xiaofeidubao.com?src=',
    download_url: 'http://download.voicecloud.cn/WYDC45LB/57010003/NewsClient.apk',
};

$(document).ready(function(e) {
	$("#download_img").fadeIn(3000);
	checkBrowserVer();
	$("#download_img").click(function(){
		baidu('点击下载');
		openOrDownLoad(e);
	});
    $("#close img").click(function(){
        $("#close").hide();
        $("#mengceng").hide();
    });
});

function openOrDownLoad(e) {

	if (isIphone) {
        LOC.href = config.scheme_IOS;
        return;
    }

    if (isWX) {
        $("#close").show();
        $("#mengceng").show();
        return;
    };

    if (isIflymmp) {
        var matrixAppIntallType = getMatrixAppIntallType();
        if (matrixAppIntallType === 1) {
            openMatrixApp();
            return;
        }
        if ((matrixAppIntallType === 0 || matrixAppIntallType === 2)) {
            imeDownload(config.download_url,'小飞读报','');
            return;
        }
    }

    if (_iframe) {
        $("#ifr").remove();
    };
    $("body").append("<iframe id='ifr' style='display:none;'></iframe>");
    _iframe = $("#ifr");
    _iframe.attr("src", config.scheme_Adr);
    // _iframe.onload = function(){
    //     LOC.href = config.download_url;
    // }

    if (_iframe['open_call'] === 1)
        return;

    _iframe.clearBlur && clearTimeout(_iframe.clearBlur);
    _iframe.openTimeout && clearTimeout(_iframe.openTimeout);
    _iframe.openTimeout = setTimeout(function () {
        _iframe['open_call'] = 0;
        if (isIflymmp) {
            // 输入法浏览器中判断是否已安装 未安装则执行安装 词+页面 不支持调输入法浏览器下载
            var installedAppInfos = imeGetInstalledAppInfo();
            if (!installedAppInfos || installedAppInfos === 'undefined') {
                LOC.href = config.download_url;
            } else if (installedAppInfos.indexOf('com.iflytek.news') === -1) {
                if (src !== '57010011') {
                    imeDownload(config.download_url,'小飞读报','');
                } else {
                    LOC.href = config.download_url;
                }
            } else {
                // 不下载
            }
        } else {
            LOC.href = config.download_url;
        }
    }, 2000);
    _iframe.clearBlur = setTimeout(function () {
        WIN.onblur = '';
    }, 2400);
    WIN.onblur = function () {
        _iframe.openTimeout && clearTimeout(_iframe.openTimeout);
        _iframe['open_call'] = 1;
    };
    
}

function imeDownload(downloadUrl,title,content) {
        var arr=[];
        arr.push(downloadUrl);
        arr.push(title);
        arr.push(content);
        var e = exec("BrowserControl", "startDownload", arr),
            t = getResultMessage(e);
        return t;
    };

    function imeGetInstalledAppInfo() { 
        var e = exec("imeExtendComponents", "getInstalledAppInfo", []), 
            t = getResultMessage(e);
        return t;
    };

    function getMatrixAppIntallType() {
        var obj = {"sfsrftype":1};
        var _url = LOC.href.indexOf('?') >= 0 ? LOC.href + "&sfsrftype=1" : LOC.href + "?sfsrftype=1";
        var url = {"url":_url};
        var e = exec("imeExtendComponents", "getMatrixAppIntallType", url), 
            t = getResultMessage(e);
        return t;
    };

    function openMatrixApp() {
        var _url = LOC.href.indexOf('?') >= 0 ? LOC.href + "&sfsrftype=1" : LOC.href + "?sfsrftype=1";
        var url = {"url":_url};
        var e = exec("imeExtendComponents", "openMatrixApp", url), 
            t = getResultMessage(e);
        return t;
    };

function checkBrowserVer() {
    var v = getBrowserInfo();
    var t = v.split(' ');
    var x = t[1].split('.')[0] - 0;

    if (t[0] === 'Chrome' && x <= 31) {
        body[className] = 'ie';
    }

    if (t[0] === 'Safari' || (t[0] === 'Chrome' && x <= 33)) {
        isWebkit = true;
    }

    function getBrowserInfo() {
        var ua = NAV.userAgent,
                N = NAV.appName, tem,
                M = ua.match(/(opera|chrome|safari|firefox|msie|trident)\/?\s*([\d\.]+)/i) || [];
        M = M[2] ? [M[1], M[2]] : [N, NAV.appVersion, '-?'];
        if(ua.toLowerCase().indexOf('iflytek_mmp') !== -1) {
            isIflymmp = true;
        }
        if(ua.toLowerCase().indexOf("iphone") > 0){
            isIphone = true;
        }
        if(ua.toLowerCase().match(/MicroMessenger/i) == "micromessenger" && (typeof WeixinJSBridge !== undefined)){
            isWX = true;
        }
        if (ua.toLowerCase().indexOf("ucbrowser") > 0) {
            var m = document.getElementsByTagName("meta");
            m[2]["content"] = 'width=device-width,initial-scale=1,user-scalable=no';
        };
        if (M && (tem = ua.match(/version\/([\.\d]+)/i)) != null)
            M[2] = tem[1];
        return M.join(' ');
    }
}