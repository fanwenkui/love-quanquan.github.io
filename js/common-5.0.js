var publicResource = baseUrl ? (baseUrl + '/cwtools/courseware/public/videohtml5/') : '';
var userResource = baseUrl ? (baseUrl + '/') : '';   
// console.log('代理')
var clientType={
    IS_ANDROID:false,
    IS_IOS:false,
    IS_WECHAT:false,
    IS_ZN:false, //知鸟原生打开，非扫一扫
    IS_PC:false,
    ZN_VERSION:0,//知鸟版本号
    IS_PREVIEW:false,
    IS_H5:false, //判断是否是h5插件
    IS_ZN_All:false, // //包含知鸟native打开和知鸟扫一扫打开。
    IS_IFRME:false,
    IS_ESALESAPP:false,
    IS_IPad:false
};

courseWareJson = JSON.parse(JSON.stringify(courseWareJson).replace("onerror",""));  // 将onerror字符全部过滤掉


var constant = {
    appId : "%83%E6%E5%9Dbahhaah%7E%90%8E%90%8F%85rdw%8A%8B%89",
    accessKey : "%82%97edh%96%99i%96%98%98%C8%98%99%9En%97%96g%98%97%94%C6%97%99%C8%98m%9D%CC%9C%9B",
    version : "8aaae"
}
var escapeHTMLPure = function(str){
    return filterXSS(str);
}
var isScroll = function (el) {
    var scrollX=false,scrollY=false;
    scrollX=document.documentElement.clientWidth!=window.innerWidth;
    scrollY=document.documentElement.clientHeight!=window.innerHeight;
    return {
        scrollX: scrollX,
        scrollY: scrollY
    };
};

function initClientType () {
    var userAgent=navigator.userAgent.toUpperCase();
    clientType.IS_ANDROID = userAgent.indexOf('ANDROID') != -1;
    clientType.IS_IOS = userAgent.indexOf('IPHONE OS') != -1 || userAgent.indexOf('IPAD') != -1;
    clientType.IS_WECHAT = userAgent.indexOf('MICROMESSENGER') != -1;
    clientType.IS_ZN_All = userAgent.indexOf('PINGANZHINIAO') != -1;  // 判断是否是知鸟app
    clientType.IS_ESALESAPP = userAgent.indexOf('ESALESAPP') != -1;  // 判断是否是口袋e app
    if(!(clientType.IS_ANDROID || clientType.IS_IOS || clientType.IS_WECHAT || clientType.IS_ZN)){
        clientType.IS_PC=true;
     }
    if(window.frames.length != parent.frames.length){ //在iframe中,是h5插件的形式
        clientType.IS_IFRME = true;
    }
    if(userAgent.indexOf('IPAD') != -1){
        clientType.IS_IPad = false
    }
    if(clientType.IS_ZN_All){  
        if (userAgent.indexOf('PINGANZHINIAO_') > -1) {
            var num=userAgent.indexOf('PINGANZHINIAO_');
            clientType.ZN_VERSION =  parseInt(userAgent.substring((num+14),(num+19)).replace(/\./g,''));
        }
        // 判断当前是否在iframe中,
        if(!clientType.IS_IFRME){ //不在iframe中，不是h5插件，是原生
            clientType.IS_ZN = true;    //不是知鸟扫一扫打开走原生的那套逻辑。
        }
    }
    if(window.location.search.indexOf('m=pre')>-1){
        clientType.IS_PREVIEW=true;
    }
    // 判断当前客户端是h5 旋转屏幕
    if(!clientType.IS_PC && !clientType.IS_ZN && !clientType.IS_ESALESAPP){
        clientType.IS_H5 = true;
    }
};

initClientType();//初始化客户端类型
// console.log('common5.j',courseWareJson)
//页面标题
document.write('<title>' + escapeHTMLPure(courseWareJson.courseName) + '</title>');

//背景音乐
if(courseWareJson.bgMusic&&courseWareJson.bgMusic.audioLzkSrc){
    document.write('<audio preload="auto" loop="loop" id="bgMusic" src="' + userResource + courseWareJson.bgMusic.audioLzkSrc + '"></audio>');
}
//测试题音乐
document.write('<audio preload="auto" loop="loop" id="testStart" src="'+publicResource+'resource/testStart.mp3"></audio>');
document.write('<audio preload="auto" id="testEnd" src="'+publicResource+'resource/testEnd.mp3"></audio>');

// 将所有的字体样式插入到head头中。
function insertFontFamily(){
    var head = document.head || document.getElementsByTagName('head')[0];
    var css = document.createElement('style');
    if(courseWareJson.pageList){
        for(var i = 0; i < courseWareJson.pageList.length; i++){
            var pageItem = courseWareJson.pageList[i];
            if(pageItem.componentList.length != 0){
                for(var j = 0; j < pageItem.componentList.length; j++){
                    var componentItem = pageItem.componentList[j];
                    if(componentItem.textStyle && componentItem.textStyle.fontLzkSrc){
                        css.innerHTML+='@font-face{font-family:'+componentItem.textStyle['font-family']+';src:url('+userResource+componentItem.textStyle.fontLzkSrc+');}';
                    }
                }
            }
        }
    }
    head.appendChild(css);
}
insertFontFamily();

function playAllAudio() {
    var audioList = document.querySelectorAll('audio');
    var videoList = document.querySelectorAll('video');
    for (var i = 0; i < audioList.length; i++) {
        var audio = audioList[i];
        (function(aud, j) {
            aud.onplay = function () {
                if (this.getAttribute('id') != 'bgMusic') {
                    var attr_num = this.getAttribute('num')
                    if(attr_num != 0){
                        this.muted = true;
                        this.pause();
                    }
                    if (currentAudio_num &&  attr_num == currentAudio_num.getAttribute('num')) {
                        this.muted = false
                        this.play();
                    }
                }else if(courseWareJson.pageList&&courseWareJson.pageList[0].audio.length!=0){
                    this.muted = true;
                    this.pause();
                }
                this.onplay = null;
            };
        })(audio, i)
        audio.play();
    }
    if(clientType.IS_IOS){
        for (var i = 0; i < videoList.length; i++) {
            var video = videoList[i];
            video.onplay = function () {
                this.pause();
                this.onplay = null;
            };
            video.play();
        }
    }
}
// --------------对字符串解密---------
function uncompileStr(code){
    code = unescape(code);        
    var c=String.fromCharCode(code.charCodeAt(0)-code.length);        
    for(var i=1;i<code.length;i++){        
        c+=String.fromCharCode(code.charCodeAt(i)-c.charCodeAt(i-1));        
    }        
    return c;
} 
// --------------对字符串解密---------

// ------------------sha1加密算法---------------
function SHA1(sIn) {  
    var x = AlignSHA1(sIn);  
    var w = new Array(80);  
    var a = 1732584193;  
    var b = -271733879;  
    var c = -1732584194;  
    var d = 271733878;  
    var e = -1009589776;  
    for(var i = 0; i < x.length; i += 16) {  
        var olda = a;  
        var oldb = b;  
        var oldc = c;  
        var oldd = d;  
        var olde = e;  
        for(var j = 0; j < 80; j++) {  
            if(j < 16) w[j] = x[i + j];  
            else w[j] = rol(w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16], 1);  
            t = add(add(rol(a, 5), ft(j, b, c, d)), add(add(e, w[j]), kt(j)));  
            e = d;  
            d = c;  
            c = rol(b, 30);  
            b = a;  
            a = t;  
        }  
        a = add(a, olda);  
        b = add(b, oldb);  
        c = add(c, oldc);  
        d = add(d, oldd);  
        e = add(e, olde);  
    }  
    SHA1Value = SHA1hex(a) + SHA1hex(b) + SHA1hex(c) + SHA1hex(d) + SHA1hex(e);  
    return SHA1Value.toUpperCase();  
}  
function AlignSHA1(sIn) {  
    var nblk = ((sIn.length + 8) >> 6) + 1,  
        blks = new Array(nblk * 16);  
    for(var i = 0; i < nblk * 16; i++) blks[i] = 0;  
    for(i = 0; i < sIn.length; i++)  
        blks[i >> 2] |= sIn.charCodeAt(i) << (24 - (i & 3) * 8);  
    blks[i >> 2] |= 0x80 << (24 - (i & 3) * 8);  
    blks[nblk * 16 - 1] = sIn.length * 8;  
    return blks;  
}  
function rol(num, cnt) {  
    return(num << cnt) | (num >>> (32 - cnt));  
}  
function add(x, y) {  
    return((x & 0x7FFFFFFF) + (y & 0x7FFFFFFF)) ^ (x & 0x80000000) ^ (y & 0x80000000);  
}  
function ft(t, b, c, d) {  
    if(t < 20) return(b & c) | ((~b) & d);  
    if(t < 40) return b ^ c ^ d;  
    if(t < 60) return(b & c) | (b & d) | (c & d);  
    return b ^ c ^ d;  
}  
function kt(t) {  
    return(t < 20) ? 1518500249 : (t < 40) ? 1859775393 :  
        (t < 60) ? -1894007588 : -899497514;  
}  
function SHA1hex(num) {  
    var sHEXChars = "0123456789abcdef";  
    var str = "";  
    for(var j = 7; j >= 0; j--)  
        str += sHEXChars.charAt((num >> (j * 4)) & 0x0F);  
    return str;  
} 
function utf16to8(str)	{
    var out, i, len, c;

    out = "";
    len = str.length;
    for(i = 0; i < len; i++){
        c = str.charCodeAt(i);
        if ((c >= 0x0001) && (c <= 0x007F)) {
            out += str.charAt(i);
        } else if (c > 0x07FF){
            out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
            out += String.fromCharCode(0x80 | ((c >>  6) & 0x3F));
            out += String.fromCharCode(0x80 | ((c >>  0) & 0x3F));
        } else {
            out += String.fromCharCode(0xC0 | ((c >>  6) & 0x1F));
            out += String.fromCharCode(0x80 | ((c >>  0) & 0x3F));
        }
    }
    return out;
}
function SHA2(sIn) {
    var str = utf16to8(sIn);
    return SHA1(str).toLowerCase();  
}  
// ------------------sha1加密算法---------------

// ----------获取随机字符串-------------
function randomString(len) {
    var len = len || 32;
    var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
    var maxPos = $chars.length;
    var pwd = '';
    for (i = 0; i < len; i++) {
        pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd;
}

function objKeySort(obj) {
    var keys = [];
    for(var p in obj){
       if(obj.hasOwnProperty(p)){
          keys.push(p);
       }
    }
    var newkey = keys.sort();
    var newObj = {};
    for (var i = 0; i < newkey.length; i++) {
        newObj[newkey[i]] = obj[newkey[i]];
    }
    return newObj;
}
// ----------获取随机字符串-------------

//微信端自动播放音频
var currentAudio_num = null
document.removeEventListener("WeixinJSBridgeReady", playAllAudio, false);
document.addEventListener("WeixinJSBridgeReady", playAllAudio, false);
//页面内容
document.write('\
    <body :style="bodyStyle">\
        <div :style="contentStyle">\
            <div :class=["scaleDiv",hSlide] :style="scaleStyle">\
                <div :style="courseStyle">\
                    <tips :load-progress="loadProgress" :page-image-style="pageImageStyle" :load-tips="loadTips" :slide-tips="slideTips"\
                       :transition="transitionName" :load-page="courseWare.loadPage" :course-ware.sync="courseWare" :current-time="currentTime"\
                       :total-time="currentTotalTime" :send-post-ajax="sendPostAjax" :user-info="userInfo" :client-height="clientHeight/scale" \
                       :is-preview="isPreview"></tips>\
                    <page v-for="item in courseWare.pageList" :transition="transitionName" :page-data="item"\
                        :page-image-style="pageImageStyle" :current-page-no="currentPageNo"\
                        :current-time="currentTime" :course-ware.sync="courseWare" :total-time="currentTotalTime"\
                        :pass-test.sync="passTest" :load-page-no="loadPageNo" :send-post-ajax="sendPostAjax" \
                        :user-info="userInfo" :client-height="clientHeight/scale" :is-preview="isPreview"></page>\
                </div>\
            </div>\
            <div v-show="pageTips" class="pageTips" :style={"width":clientWidth+"px"}><div class="pageProgress" :style={"width":pageProgress}></div></div>\
            <div v-show="turnTips" transition="fade" class="turnTipsBox" :style={"width":clientWidth+"px","display":"none"}>\
                <div  class="turnTips">没有通过测试题，不能进入下一页</div>\
            </div>\
            <div v-show="turnScreenTips">\
                <div  class="turnScreenBox" :style="turnScreenBoxStyle">\
                   <div v-if="portraitPage">\
                        <p>建议关掉手机自动旋转后</p>\
                        <p>以竖屏横放方式观看</p>\
                   </div>\
                   <div v-else >\
                        <p class="turnScreenLand">建议以竖屏方式观看</p>\
                    </div>\
                </div>\
            </div>\
        </div>\
    </body>');
/*!
 * Vue.js v1.0.28
 * (c) 2016 Evan You
 * Released under the MIT License.
 */
!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?module.exports=e():"function"==typeof define&&define.amd?define(e):t.Vue=e()}(this,function(){"use strict";function t(e,n,r){if(i(e,n))return void(e[n]=r);if(e._isVue)return void t(e._data,n,r);var s=e.__ob__;if(!s)return void(e[n]=r);if(s.convert(n,r),s.dep.notify(),s.vms)for(var o=s.vms.length;o--;){var a=s.vms[o];a._proxy(n),a._digest()}return r}function e(t,e){if(i(t,e)){delete t[e];var n=t.__ob__;if(!n)return void(t._isVue&&(delete t._data[e],t._digest()));if(n.dep.notify(),n.vms)for(var r=n.vms.length;r--;){var s=n.vms[r];s._unproxy(e),s._digest()}}}function i(t,e){return Mi.call(t,e)}function n(t){return Wi.test(t)}function r(t){var e=(t+"").charCodeAt(0);return 36===e||95===e}function s(t){return null==t?"":t.toString()}function o(t){if("string"!=typeof t)return t;var e=Number(t);return isNaN(e)?t:e}function a(t){return"true"===t||"false"!==t&&t}function h(t){var e=t.charCodeAt(0),i=t.charCodeAt(t.length-1);return e!==i||34!==e&&39!==e?t:t.slice(1,-1)}function l(t){return t.replace(Vi,c)}function c(t,e){return e?e.toUpperCase():""}function u(t){return t.replace(Bi,"$1-$2").replace(Bi,"$1-$2").toLowerCase()}function f(t){return t.replace(zi,c)}function p(t,e){return function(i){var n=arguments.length;return n?n>1?t.apply(e,arguments):t.call(e,i):t.call(e)}}function d(t,e){e=e||0;for(var i=t.length-e,n=new Array(i);i--;)n[i]=t[i+e];return n}function v(t,e){for(var i=Object.keys(e),n=i.length;n--;)t[i[n]]=e[i[n]];return t}function m(t){return null!==t&&"object"==typeof t}function g(t){return Ui.call(t)===Ji}function _(t,e,i,n){Object.defineProperty(t,e,{value:i,enumerable:!!n,writable:!0,configurable:!0})}function y(t,e){var i,n,r,s,o,a=function a(){var h=Date.now()-s;h<e&&h>=0?i=setTimeout(a,e-h):(i=null,o=t.apply(r,n),i||(r=n=null))};return function(){return r=this,n=arguments,s=Date.now(),i||(i=setTimeout(a,e)),o}}function b(t,e){for(var i=t.length;i--;)if(t[i]===e)return i;return-1}function w(t){var e=function e(){if(!e.cancelled)return t.apply(this,arguments)};return e.cancel=function(){e.cancelled=!0},e}function C(t,e){return t==e||!(!m(t)||!m(e))&&JSON.stringify(t)===JSON.stringify(e)}function $(t){return/native code/.test(t.toString())}function k(t){this.size=0,this.limit=t,this.head=this.tail=void 0,this._keymap=Object.create(null)}function x(){return fn.charCodeAt(vn+1)}function A(){return fn.charCodeAt(++vn)}function O(){return vn>=dn}function T(){for(;x()===Tn;)A()}function N(t){return t===kn||t===xn}function j(t){return Nn[t]}function E(t,e){return jn[t]===e}function S(){for(var t,e=A();!O();)if(t=A(),t===On)A();else if(t===e)break}function F(t){for(var e=0,i=t;!O();)if(t=x(),N(t))S();else if(i===t&&e++,E(i,t)&&e--,A(),0===e)break}function D(){for(var t=vn;!O();)if(mn=x(),N(mn))S();else if(j(mn))F(mn);else if(mn===An){if(A(),mn=x(),mn!==An){gn!==bn&&gn!==$n||(gn=wn);break}A()}else{if(mn===Tn&&(gn===Cn||gn===$n)){T();break}gn===wn&&(gn=Cn),A()}return fn.slice(t+1,vn)||null}function P(){for(var t=[];!O();)t.push(R());return t}function R(){var t,e={};return gn=wn,e.name=D().trim(),gn=$n,t=L(),t.length&&(e.args=t),e}function L(){for(var t=[];!O()&&gn!==wn;){var e=D();if(!e)break;t.push(H(e))}return t}function H(t){if(yn.test(t))return{value:o(t),dynamic:!1};var e=h(t),i=e===t;return{value:i?t:e,dynamic:i}}function I(t){var e=_n.get(t);if(e)return e;fn=t,pn={},dn=fn.length,vn=-1,mn="",gn=bn;var i;return fn.indexOf("|")<0?pn.expression=fn.trim():(pn.expression=D().trim(),i=P(),i.length&&(pn.filters=i)),_n.put(t,pn),pn}function M(t){return t.replace(Sn,"\\$&")}function W(){var t=M(Mn.delimiters[0]),e=M(Mn.delimiters[1]),i=M(Mn.unsafeDelimiters[0]),n=M(Mn.unsafeDelimiters[1]);Dn=new RegExp(i+"((?:.|\\n)+?)"+n+"|"+t+"((?:.|\\n)+?)"+e,"g"),Pn=new RegExp("^"+i+"((?:.|\\n)+?)"+n+"$"),Fn=new k(1e3)}function V(t){Fn||W();var e=Fn.get(t);if(e)return e;if(!Dn.test(t))return null;for(var i,n,r,s,o,a,h=[],l=Dn.lastIndex=0;i=Dn.exec(t);)n=i.index,n>l&&h.push({value:t.slice(l,n)}),r=Pn.test(i[0]),s=r?i[1]:i[2],o=s.charCodeAt(0),a=42===o,s=a?s.slice(1):s,h.push({tag:!0,value:s.trim(),html:r,oneTime:a}),l=n+i[0].length;return l<t.length&&h.push({value:t.slice(l)}),Fn.put(t,h),h}function B(t,e){return t.length>1?t.map(function(t){return z(t,e)}).join("+"):z(t[0],e,!0)}function z(t,e,i){return t.tag?t.oneTime&&e?'"'+e.$eval(t.value)+'"':U(t.value,i):'"'+t.value+'"'}function U(t,e){if(Rn.test(t)){var i=I(t);return i.filters?"this._applyFilters("+i.expression+",null,"+JSON.stringify(i.filters)+",false)":"("+t+")"}return e?t:"("+t+")"}function J(t,e,i,n){G(t,1,function(){e.appendChild(t)},i,n)}function q(t,e,i,n){G(t,1,function(){et(t,e)},i,n)}function Q(t,e,i){G(t,-1,function(){nt(t)},e,i)}function G(t,e,i,n,r){var s=t.__v_trans;if(!s||!s.hooks&&!rn||!n._isCompiled||n.$parent&&!n.$parent._isCompiled)return i(),void(r&&r());var o=e>0?"enter":"leave";s[o](i,r)}function Z(t){if("string"==typeof t){t=document.querySelector(t)}return t}function X(t){if(!t)return!1;var e=t.ownerDocument.documentElement,i=t.parentNode;return e===t||e===i||!(!i||1!==i.nodeType||!e.contains(i))}function Y(t,e){var i=t.getAttribute(e);return null!==i&&t.removeAttribute(e),i}function K(t,e){var i=Y(t,":"+e);return null===i&&(i=Y(t,"v-bind:"+e)),i}function tt(t,e){return t.hasAttribute(e)||t.hasAttribute(":"+e)||t.hasAttribute("v-bind:"+e)}function et(t,e){e.parentNode.insertBefore(t,e)}function it(t,e){e.nextSibling?et(t,e.nextSibling):e.parentNode.appendChild(t)}function nt(t){t.parentNode.removeChild(t)}function rt(t,e){e.firstChild?et(t,e.firstChild):e.appendChild(t)}function st(t,e){var i=t.parentNode;i&&i.replaceChild(e,t)}function ot(t,e,i,n){t.addEventListener(e,i,n)}function at(t,e,i){t.removeEventListener(e,i)}function ht(t){var e=t.className;return"object"==typeof e&&(e=e.baseVal||""),e}function lt(t,e){Ki&&!/svg$/.test(t.namespaceURI)?t.className=e:t.setAttribute("class",e)}function ct(t,e){if(t.classList)t.classList.add(e);else{var i=" "+ht(t)+" ";i.indexOf(" "+e+" ")<0&&lt(t,(i+e).trim())}}function ut(t,e){if(t.classList)t.classList.remove(e);else{for(var i=" "+ht(t)+" ",n=" "+e+" ";i.indexOf(n)>=0;)i=i.replace(n," ");lt(t,i.trim())}t.className||t.removeAttribute("class")}function ft(t,e){var i,n;if(vt(t)&&bt(t.content)&&(t=t.content),t.hasChildNodes())for(pt(t),n=e?document.createDocumentFragment():document.createElement("div");i=t.firstChild;)n.appendChild(i);return n}function pt(t){for(var e;e=t.firstChild,dt(e);)t.removeChild(e);for(;e=t.lastChild,dt(e);)t.removeChild(e)}function dt(t){return t&&(3===t.nodeType&&!t.data.trim()||8===t.nodeType)}function vt(t){return t.tagName&&"template"===t.tagName.toLowerCase()}function mt(t,e){var i=Mn.debug?document.createComment(t):document.createTextNode(e?" ":"");return i.__v_anchor=!0,i}function gt(t){if(t.hasAttributes())for(var e=t.attributes,i=0,n=e.length;i<n;i++){var r=e[i].name;if(Bn.test(r))return l(r.replace(Bn,""))}}function _t(t,e,i){for(var n;t!==e;)n=t.nextSibling,i(t),t=n;i(e)}function yt(t,e,i,n,r){function s(){if(a++,o&&a>=h.length){for(var t=0;t<h.length;t++)n.appendChild(h[t]);r&&r()}}var o=!1,a=0,h=[];_t(t,e,function(t){t===e&&(o=!0),h.push(t),Q(t,i,s)})}function bt(t){return t&&11===t.nodeType}function wt(t){if(t.outerHTML)return t.outerHTML;var e=document.createElement("div");return e.appendChild(t.cloneNode(!0)),e.innerHTML}function Ct(t,e){var i=t.tagName.toLowerCase(),n=t.hasAttributes();if(zn.test(i)||Un.test(i)){if(n)return $t(t,e)}else{if(jt(e,"components",i))return{id:i};var r=n&&$t(t,e);if(r)return r}}function $t(t,e){var i=t.getAttribute("is");if(null!=i){if(jt(e,"components",i))return t.removeAttribute("is"),{id:i}}else if(i=K(t,"is"),null!=i)return{id:i,dynamic:!0}}function kt(e,n){var r,s,o;for(r in n)s=e[r],o=n[r],i(e,r)?m(s)&&m(o)&&kt(s,o):t(e,r,o);return e}function xt(t,e){var i=Object.create(t||null);return e?v(i,Tt(e)):i}function At(t){if(t.components)for(var e,i=t.components=Tt(t.components),n=Object.keys(i),r=0,s=n.length;r<s;r++){var o=n[r];zn.test(o)||Un.test(o)||(e=i[o],g(e)&&(i[o]=Di.extend(e)))}}function Ot(t){var e,i,n=t.props;if(qi(n))for(t.props={},e=n.length;e--;)i=n[e],"string"==typeof i?t.props[i]=null:i.name&&(t.props[i.name]=i);else if(g(n)){var r=Object.keys(n);for(e=r.length;e--;)i=n[r[e]],"function"==typeof i&&(n[r[e]]={type:i})}}function Tt(t){if(qi(t)){for(var e,i={},n=t.length;n--;){e=t[n];var r="function"==typeof e?e.options&&e.options.name||e.id:e.name||e.id;r&&(i[r]=e)}return i}return t}function Nt(t,e,n){function r(i){var r=Jn[i]||qn;o[i]=r(t[i],e[i],n,i)}At(e),Ot(e);var s,o={};if(e.extends&&(t="function"==typeof e.extends?Nt(t,e.extends.options,n):Nt(t,e.extends,n)),e.mixins)for(var a=0,h=e.mixins.length;a<h;a++){var l=e.mixins[a],c=l.prototype instanceof Di?l.options:l;t=Nt(t,c,n)}for(s in t)r(s);for(s in e)i(t,s)||r(s);return o}function jt(t,e,i,n){if("string"==typeof i){var r,s=t[e],o=s[i]||s[r=l(i)]||s[r.charAt(0).toUpperCase()+r.slice(1)];return o}}function Et(){this.id=Qn++,this.subs=[]}function St(t){Yn=!1,t(),Yn=!0}function Ft(t){if(this.value=t,this.dep=new Et,_(t,"__ob__",this),qi(t)){var e=Qi?Dt:Pt;e(t,Zn,Xn),this.observeArray(t)}else this.walk(t)}function Dt(t,e){t.__proto__=e}function Pt(t,e,i){for(var n=0,r=i.length;n<r;n++){var s=i[n];_(t,s,e[s])}}function Rt(t,e){if(t&&"object"==typeof t){var n;return i(t,"__ob__")&&t.__ob__ instanceof Ft?n=t.__ob__:Yn&&(qi(t)||g(t))&&Object.isExtensible(t)&&!t._isVue&&(n=new Ft(t)),n&&e&&n.addVm(e),n}}function Lt(t,e,i){var n=new Et,r=Object.getOwnPropertyDescriptor(t,e);if(!r||r.configurable!==!1){var s=r&&r.get,o=r&&r.set,a=Rt(i);Object.defineProperty(t,e,{enumerable:!0,configurable:!0,get:function(){var e=s?s.call(t):i;if(Et.target&&(n.depend(),a&&a.dep.depend(),qi(e)))for(var r,o=0,h=e.length;o<h;o++)r=e[o],r&&r.__ob__&&r.__ob__.dep.depend();return e},set:function(e){var r=s?s.call(t):i;e!==r&&(o?o.call(t,e):i=e,a=Rt(e),n.notify())}})}}function Ht(t){t.prototype._init=function(t){t=t||{},this.$el=null,this.$parent=t.parent,this.$root=this.$parent?this.$parent.$root:this,this.$children=[],this.$refs={},this.$els={},this._watchers=[],this._directives=[],this._uid=tr++,this._isVue=!0,this._events={},this._eventsCount={},this._isFragment=!1,this._fragment=this._fragmentStart=this._fragmentEnd=null,this._isCompiled=this._isDestroyed=this._isReady=this._isAttached=this._isBeingDestroyed=this._vForRemoving=!1,this._unlinkFn=null,this._context=t._context||this.$parent,this._scope=t._scope,this._frag=t._frag,this._frag&&this._frag.children.push(this),this.$parent&&this.$parent.$children.push(this),t=this.$options=Nt(this.constructor.options,t,this),this._updateRef(),this._data={},this._callHook("init"),this._initState(),this._initEvents(),this._callHook("created"),t.el&&this.$mount(t.el)}}function It(t){if(void 0===t)return"eof";var e=t.charCodeAt(0);switch(e){case 91:case 93:case 46:case 34:case 39:case 48:return t;case 95:case 36:return"ident";case 32:case 9:case 10:case 13:case 160:case 65279:case 8232:case 8233:return"ws"}return e>=97&&e<=122||e>=65&&e<=90?"ident":e>=49&&e<=57?"number":"else"}function Mt(t){var e=t.trim();return("0"!==t.charAt(0)||!isNaN(t))&&(n(e)?h(e):"*"+e)}function Wt(t){function e(){var e=t[c+1];if(u===ur&&"'"===e||u===fr&&'"'===e)return c++,n="\\"+e,p[ir](),!0}var i,n,r,s,o,a,h,l=[],c=-1,u=or,f=0,p=[];for(p[nr]=function(){void 0!==r&&(l.push(r),r=void 0)},p[ir]=function(){void 0===r?r=n:r+=n},p[rr]=function(){p[ir](),f++},p[sr]=function(){if(f>0)f--,u=cr,p[ir]();else{if(f=0,r=Mt(r),r===!1)return!1;p[nr]()}};null!=u;)if(c++,i=t[c],"\\"!==i||!e()){if(s=It(i),h=vr[u],o=h[s]||h.else||dr,o===dr)return;if(u=o[0],a=p[o[1]],a&&(n=o[2],n=void 0===n?i:n,a()===!1))return;if(u===pr)return l.raw=t,l}}function Vt(t){var e=er.get(t);return e||(e=Wt(t),e&&er.put(t,e)),e}function Bt(t,e){return Yt(e).get(t)}function zt(e,i,n){var r=e;if("string"==typeof i&&(i=Wt(i)),!i||!m(e))return!1;for(var s,o,a=0,h=i.length;a<h;a++)s=e,o=i[a],"*"===o.charAt(0)&&(o=Yt(o.slice(1)).get.call(r,r)),a<h-1?(e=e[o],m(e)||(e={},t(s,o,e))):qi(e)?e.$set(o,n):o in e?e[o]=n:t(e,o,n);return!0}function Ut(){}function Jt(t,e){var i=Nr.length;return Nr[i]=e?t.replace($r,"\\n"):t,'"'+i+'"'}function qt(t){var e=t.charAt(0),i=t.slice(1);return yr.test(i)?t:(i=i.indexOf('"')>-1?i.replace(xr,Qt):i,e+"scope."+i)}function Qt(t,e){return Nr[e]}function Gt(t){wr.test(t),Nr.length=0;var e=t.replace(kr,Jt).replace(Cr,"");return e=(" "+e).replace(Or,qt).replace(xr,Qt),Zt(e)}function Zt(t){try{return new Function("scope","return "+t+";")}catch(t){return Ut}}function Xt(t){var e=Vt(t);if(e)return function(t,i){zt(t,e,i)}}function Yt(t,e){t=t.trim();var i=gr.get(t);if(i)return e&&!i.set&&(i.set=Xt(i.exp)),i;var n={exp:t};return n.get=Kt(t)&&t.indexOf("[")<0?Zt("scope."+t):Gt(t),e&&(n.set=Xt(t)),gr.put(t,n),n}function Kt(t){return Ar.test(t)&&!Tr.test(t)&&"Math."!==t.slice(0,5)}function te(){Er.length=0,Sr.length=0,Fr={},Dr={},Pr=!1}function ee(){for(var t=!0;t;)t=!1,ie(Er),ie(Sr),Er.length?t=!0:(Zi&&Mn.devtools&&Zi.emit("flush"),te())}function ie(t){for(var e=0;e<t.length;e++){var i=t[e],n=i.id;Fr[n]=null,i.run()}t.length=0}function ne(t){var e=t.id;if(null==Fr[e]){var i=t.user?Sr:Er;Fr[e]=i.length,i.push(t),Pr||(Pr=!0,ln(ee))}}function re(t,e,i,n){n&&v(this,n);var r="function"==typeof e;if(this.vm=t,t._watchers.push(this),this.expression=e,this.cb=i,this.id=++Rr,this.active=!0,this.dirty=this.lazy,this.deps=[],this.newDeps=[],this.depIds=new cn,this.newDepIds=new cn,this.prevError=null,r)this.getter=e,this.setter=void 0;else{var s=Yt(e,this.twoWay);this.getter=s.get,this.setter=s.set}this.value=this.lazy?void 0:this.get(),this.queued=this.shallow=!1}function se(t,e){var i=void 0,n=void 0;e||(e=Lr,e.clear());var r=qi(t),s=m(t);if((r||s)&&Object.isExtensible(t)){if(t.__ob__){var o=t.__ob__.dep.id;if(e.has(o))return;e.add(o)}if(r)for(i=t.length;i--;)se(t[i],e);else if(s)for(n=Object.keys(t),i=n.length;i--;)se(t[n[i]],e)}}function oe(t){return vt(t)&&bt(t.content)}function ae(t,e){var i=e?t:t.trim(),n=Ir.get(i);if(n)return n;var r=document.createDocumentFragment(),s=t.match(Vr),o=Br.test(t),a=zr.test(t);if(s||o||a){var h=s&&s[1],l=Wr[h]||Wr.efault,c=l[0],u=l[1],f=l[2],p=document.createElement("div");for(p.innerHTML=u+t+f;c--;)p=p.lastChild;for(var d;d=p.firstChild;)r.appendChild(d)}else r.appendChild(document.createTextNode(t));return e||pt(r),Ir.put(i,r),r}function he(t){if(oe(t))return ae(t.innerHTML);if("SCRIPT"===t.tagName)return ae(t.textContent);for(var e,i=le(t),n=document.createDocumentFragment();e=i.firstChild;)n.appendChild(e);return pt(n),n}function le(t){if(!t.querySelectorAll)return t.cloneNode();var e,i,n,r=t.cloneNode(!0);if(Ur){var s=r;if(oe(t)&&(t=t.content,s=r.content),i=t.querySelectorAll("template"),i.length)for(n=s.querySelectorAll("template"),e=n.length;e--;)n[e].parentNode.replaceChild(le(i[e]),n[e])}if(Jr)if("TEXTAREA"===t.tagName)r.value=t.value;else if(i=t.querySelectorAll("textarea"),i.length)for(n=r.querySelectorAll("textarea"),e=n.length;e--;)n[e].value=i[e].value;return r}function ce(t,e,i){var n,r;return bt(t)?(pt(t),e?le(t):t):("string"==typeof t?i||"#"!==t.charAt(0)?r=ae(t,i):(r=Mr.get(t),r||(n=document.getElementById(t.slice(1)),n&&(r=he(n),Mr.put(t,r)))):t.nodeType&&(r=he(t)),r&&e?le(r):r)}function ue(t,e,i,n,r,s){this.children=[],this.childFrags=[],this.vm=e,this.scope=r,this.inserted=!1,this.parentFrag=s,s&&s.childFrags.push(this),this.unlink=t(e,i,n,r,this);var o=this.single=1===i.childNodes.length&&!i.childNodes[0].__v_anchor;o?(this.node=i.childNodes[0],this.before=fe,this.remove=pe):(this.node=mt("fragment-start"),this.end=mt("fragment-end"),this.frag=i,rt(this.node,i),i.appendChild(this.end),this.before=de,this.remove=ve),this.node.__v_frag=this}function fe(t,e){this.inserted=!0;var i=e!==!1?q:et;i(this.node,t,this.vm),X(this.node)&&this.callHook(me)}function pe(){this.inserted=!1;var t=X(this.node),e=this;this.beforeRemove(),Q(this.node,this.vm,function(){t&&e.callHook(ge),e.destroy()})}function de(t,e){this.inserted=!0;var i=this.vm,n=e!==!1?q:et;_t(this.node,this.end,function(e){n(e,t,i)}),X(this.node)&&this.callHook(me)}function ve(){this.inserted=!1;var t=this,e=X(this.node);this.beforeRemove(),yt(this.node,this.end,this.vm,this.frag,function(){e&&t.callHook(ge),t.destroy()})}function me(t){!t._isAttached&&X(t.$el)&&t._callHook("attached")}function ge(t){t._isAttached&&!X(t.$el)&&t._callHook("detached")}function _e(t,e){this.vm=t;var i,n="string"==typeof e;n||vt(e)&&!e.hasAttribute("v-if")?i=ce(e,!0):(i=document.createDocumentFragment(),i.appendChild(e)),this.template=i;var r,s=t.constructor.cid;if(s>0){var o=s+(n?e:wt(e));r=Gr.get(o),r||(r=qe(i,t.$options,!0),Gr.put(o,r))}else r=qe(i,t.$options,!0);this.linker=r}function ye(t,e,i){var n=t.node.previousSibling;if(n){for(t=n.__v_frag;!(t&&t.forId===i&&t.inserted||n===e);){if(n=n.previousSibling,!n)return;t=n.__v_frag}return t}}function be(t){for(var e=-1,i=new Array(Math.floor(t));++e<t;)i[e]=e;return i}function we(t,e,i,n){return n?"$index"===n?t:n.charAt(0).match(/\w/)?Bt(i,n):i[n]:e||i}function Ce(t){var e=t.node;if(t.end)for(;!e.__vue__&&e!==t.end&&e.nextSibling;)e=e.nextSibling;return e.__vue__}function $e(t,e,i){for(var n,r,s,o=e?[]:null,a=0,h=t.options.length;a<h;a++)if(n=t.options[a],s=i?n.hasAttribute("selected"):n.selected){if(r=n.hasOwnProperty("_value")?n._value:n.value,!e)return r;o.push(r)}return o}function ke(t,e){for(var i=t.length;i--;)if(C(t[i],e))return i;return-1}function xe(t,e){var i=e.map(function(t){var e=t.charCodeAt(0);return e>47&&e<58?parseInt(t,10):1===t.length&&(e=t.toUpperCase().charCodeAt(0),e>64&&e<91)?e:ms[t]});return i=[].concat.apply([],i),function(e){if(i.indexOf(e.keyCode)>-1)return t.call(this,e)}}function Ae(t){return function(e){return e.stopPropagation(),t.call(this,e)}}function Oe(t){return function(e){return e.preventDefault(),t.call(this,e)}}function Te(t){return function(e){if(e.target===e.currentTarget)return t.call(this,e)}}function Ne(t){if(ws[t])return ws[t];var e=je(t);return ws[t]=ws[e]=e,e}function je(t){t=u(t);var e=l(t),i=e.charAt(0).toUpperCase()+e.slice(1);Cs||(Cs=document.createElement("div"));var n,r=_s.length;if("filter"!==e&&e in Cs.style)return{kebab:t,camel:e};for(;r--;)if(n=ys[r]+i,n in Cs.style)return{kebab:_s[r]+t,camel:n}}function Ee(t){var e=[];if(qi(t))for(var i=0,n=t.length;i<n;i++){var r=t[i];if(r)if("string"==typeof r)e.push(r);else for(var s in r)r[s]&&e.push(s)}else if(m(t))for(var o in t)t[o]&&e.push(o);return e}function Se(t,e,i){if(e=e.trim(),e.indexOf(" ")===-1)return void i(t,e);for(var n=e.split(/\s+/),r=0,s=n.length;r<s;r++)i(t,n[r])}function Fe(t,e,i){function n(){++s>=r?i():t[s].call(e,n)}var r=t.length,s=0;t[0].call(e,n)}function De(t,e,i){for(var r,s,o,a,h,c,f,p=[],d=i.$options.propsData,v=Object.keys(e),m=v.length;m--;)s=v[m],r=e[s]||Hs,h=l(s),Is.test(h)&&(f={name:s,path:h,options:r,mode:Ls.ONE_WAY,raw:null},o=u(s),null===(a=K(t,o))&&(null!==(a=K(t,o+".sync"))?f.mode=Ls.TWO_WAY:null!==(a=K(t,o+".once"))&&(f.mode=Ls.ONE_TIME)),null!==a?(f.raw=a,c=I(a),a=c.expression,f.filters=c.filters,n(a)&&!c.filters?f.optimizedLiteral=!0:f.dynamic=!0,f.parentPath=a):null!==(a=Y(t,o))?f.raw=a:d&&null!==(a=d[s]||d[h])&&(f.raw=a),p.push(f));return Pe(p)}function Pe(t){return function(e,n){e._props={};for(var r,s,l,c,f,p=e.$options.propsData,d=t.length;d--;)if(r=t[d],f=r.raw,s=r.path,l=r.options,e._props[s]=r,p&&i(p,s)&&Le(e,r,p[s]),null===f)Le(e,r,void 0);else if(r.dynamic)r.mode===Ls.ONE_TIME?(c=(n||e._context||e).$get(r.parentPath),Le(e,r,c)):e._context?e._bindDir({name:"prop",def:Ws,prop:r},null,null,n):Le(e,r,e.$get(r.parentPath));else if(r.optimizedLiteral){var v=h(f);c=v===f?a(o(f)):v,Le(e,r,c)}else c=l.type===Boolean&&(""===f||f===u(r.name))||f,Le(e,r,c)}}function Re(t,e,i,n){var r=e.dynamic&&Kt(e.parentPath),s=i;void 0===s&&(s=Ie(t,e)),s=We(e,s,t);var o=s!==i;Me(e,s,t)||(s=void 0),r&&!o?St(function(){n(s)}):n(s)}function Le(t,e,i){Re(t,e,i,function(i){Lt(t,e.path,i)})}function He(t,e,i){Re(t,e,i,function(i){t[e.path]=i})}function Ie(t,e){var n=e.options;if(!i(n,"default"))return n.type!==Boolean&&void 0;var r=n.default;return m(r),"function"==typeof r&&n.type!==Function?r.call(t):r}function Me(t,e,i){if(!t.options.required&&(null===t.raw||null==e))return!0;var n=t.options,r=n.type,s=!r,o=[];if(r){qi(r)||(r=[r]);for(var a=0;a<r.length&&!s;a++){var h=Ve(e,r[a]);o.push(h.expectedType),s=h.valid}}if(!s)return!1;var l=n.validator;return!(l&&!l(e))}function We(t,e,i){var n=t.options.coerce;return n&&"function"==typeof n?n(e):e}function Ve(t,e){var i,n;return e===String?(n="string",i=typeof t===n):e===Number?(n="number",i=typeof t===n):e===Boolean?(n="boolean",i=typeof t===n):e===Function?(n="function",i=typeof t===n):e===Object?(n="object",i=g(t)):e===Array?(n="array",i=qi(t)):i=t instanceof e,{valid:i,expectedType:n}}function Be(t){Vs.push(t),Bs||(Bs=!0,ln(ze))}function ze(){for(var t=document.documentElement.offsetHeight,e=0;e<Vs.length;e++)Vs[e]();return Vs=[],Bs=!1,t}function Ue(t,e,i,n){this.id=e,this.el=t,this.enterClass=i&&i.enterClass||e+"-enter",this.leaveClass=i&&i.leaveClass||e+"-leave",this.hooks=i,this.vm=n,this.pendingCssEvent=this.pendingCssCb=this.cancel=this.pendingJsCb=this.op=this.cb=null,this.justEntered=!1,this.entered=this.left=!1,this.typeCache={},this.type=i&&i.type;var r=this;["enterNextTick","enterDone","leaveNextTick","leaveDone"].forEach(function(t){r[t]=p(r[t],r)})}function Je(t){if(/svg$/.test(t.namespaceURI)){var e=t.getBoundingClientRect();return!(e.width||e.height)}return!(t.offsetWidth||t.offsetHeight||t.getClientRects().length)}function qe(t,e,i){var n=i||!e._asComponent?ti(t,e):null,r=n&&n.terminal||gi(t)||!t.hasChildNodes()?null:oi(t.childNodes,e);return function(t,e,i,s,o){var a=d(e.childNodes),h=Qe(function(){n&&n(t,e,i,s,o),r&&r(t,a,i,s,o)},t);return Ze(t,h)}}function Qe(t,e){e._directives=[];var i=e._directives.length;t();var n=e._directives.slice(i);Ge(n);for(var r=0,s=n.length;r<s;r++)n[r]._bind();return n}function Ge(t){if(0!==t.length){var e,i,n,r,s={},o=0,a=[];for(e=0,i=t.length;e<i;e++){var h=t[e],l=h.descriptor.def.priority||ro,c=s[l];c||(c=s[l]=[],a.push(l)),c.push(h)}for(a.sort(function(t,e){return t>e?-1:t===e?0:1}),e=0,i=a.length;e<i;e++){var u=s[a[e]];for(n=0,r=u.length;n<r;n++)t[o++]=u[n]}}}function Ze(t,e,i,n){function r(r){Xe(t,e,r),i&&n&&Xe(i,n)}return r.dirs=e,r}function Xe(t,e,i){for(var n=e.length;n--;)e[n]._teardown()}function Ye(t,e,i,n){var r=De(e,i,t),s=Qe(function(){r(t,n)},t);return Ze(t,s)}function Ke(t,e,i){var n,r,s=e._containerAttrs,o=e._replacerAttrs;return 11!==t.nodeType&&(e._asComponent?(s&&i&&(n=pi(s,i)),o&&(r=pi(o,e))):r=pi(t.attributes,e)),e._containerAttrs=e._replacerAttrs=null,function(t,e,i){var s,o=t._context;o&&n&&(s=Qe(function(){n(o,e,null,i)},o));var a=Qe(function(){r&&r(t,e)},t);return Ze(t,a,o,s)}}function ti(t,e){var i=t.nodeType;return 1!==i||gi(t)?3===i&&t.data.trim()?ii(t,e):null:ei(t,e)}function ei(t,e){if("TEXTAREA"===t.tagName){if(null!==Y(t,"v-pre"))return ui;var i=V(t.value);i&&(t.setAttribute(":value",B(i)),t.value="")}var n,r=t.hasAttributes(),s=r&&d(t.attributes);return r&&(n=ci(t,s,e)),n||(n=hi(t,e)),n||(n=li(t,e)),!n&&r&&(n=pi(s,e)),n}function ii(t,e){if(t._skip)return ni;var i=V(t.wholeText);if(!i)return null;for(var n=t.nextSibling;n&&3===n.nodeType;)n._skip=!0,n=n.nextSibling;for(var r,s,o=document.createDocumentFragment(),a=0,h=i.length;a<h;a++)s=i[a],r=s.tag?ri(s,e):document.createTextNode(s.value),o.appendChild(r);return si(i,o,e)}function ni(t,e){nt(e)}function ri(t,e){function i(e){if(!t.descriptor){var i=I(t.value);t.descriptor={name:e,def:Ds[e],expression:i.expression,filters:i.filters}}}var n;return t.oneTime?n=document.createTextNode(t.value):t.html?(n=document.createComment("v-html"),i("html")):(n=document.createTextNode(" "),i("text")),n}function si(t,e){return function(i,n,r,o){for(var a,h,l,c=e.cloneNode(!0),u=d(c.childNodes),f=0,p=t.length;f<p;f++)a=t[f],h=a.value,a.tag&&(l=u[f],a.oneTime?(h=(o||i).$eval(h),a.html?st(l,ce(h,!0)):l.data=s(h)):i._bindDir(a.descriptor,l,r,o));st(n,c)}}function oi(t,e){for(var i,n,r,s=[],o=0,a=t.length;o<a;o++)r=t[o],i=ti(r,e),n=i&&i.terminal||"SCRIPT"===r.tagName||!r.hasChildNodes()?null:oi(r.childNodes,e),s.push(i,n);return s.length?ai(s):null}function ai(t){return function(e,i,n,r,s){for(var o,a,h,l=0,c=0,u=t.length;l<u;c++){o=i[c],a=t[l++],h=t[l++];var f=d(o.childNodes);a&&a(e,o,n,r,s),h&&h(e,f,n,r,s)}}}function hi(t,e){var i=t.tagName.toLowerCase();if(!zn.test(i)){var n=jt(e,"elementDirectives",i);return n?fi(t,i,"",e,n):void 0}}function li(t,e){var i=Ct(t,e);if(i){var n=gt(t),r={name:"component",ref:n,expression:i.id,def:Ys.component,modifiers:{literal:!i.dynamic}},s=function(t,e,i,s,o){n&&Lt((s||t).$refs,n,null),t._bindDir(r,e,i,s,o)};return s.terminal=!0,s}}function ci(t,e,i){if(null!==Y(t,"v-pre"))return ui;if(t.hasAttribute("v-else")){var n=t.previousElementSibling;if(n&&n.hasAttribute("v-if"))return ui}for(var r,s,o,a,h,l,c,u,f,p,d=0,v=e.length;d<v;d++)r=e[d],s=r.name.replace(io,""),(h=s.match(eo))&&(f=jt(i,"directives",h[1]),f&&f.terminal&&(!p||(f.priority||so)>p.priority)&&(p=f,c=r.name,a=di(r.name),o=r.value,l=h[1],u=h[2]));return p?fi(t,l,o,i,p,c,u,a):void 0}function ui(){}function fi(t,e,i,n,r,s,o,a){var h=I(i),l={name:e,arg:o,expression:h.expression,filters:h.filters,raw:i,attr:s,modifiers:a,def:r};"for"!==e&&"router-view"!==e||(l.ref=gt(t));var c=function(t,e,i,n,r){l.ref&&Lt((n||t).$refs,l.ref,null),t._bindDir(l,e,i,n,r)};return c.terminal=!0,c}function pi(t,e){function i(t,e,i){var n=i&&mi(i),r=!n&&I(s);v.push({name:t,attr:o,raw:a,def:e,arg:l,modifiers:c,expression:r&&r.expression,filters:r&&r.filters,interp:i,hasOneTime:n})}for(var n,r,s,o,a,h,l,c,u,f,p,d=t.length,v=[];d--;)if(n=t[d],r=o=n.name,s=a=n.value,f=V(s),l=null,c=di(r),r=r.replace(io,""),f)s=B(f),l=r,i("bind",Ds.bind,f);else if(no.test(r))c.literal=!Ks.test(r),i("transition",Ys.transition);else if(to.test(r))l=r.replace(to,""),i("on",Ds.on);else if(Ks.test(r))h=r.replace(Ks,""),"style"===h||"class"===h?i(h,Ys[h]):(l=h,i("bind",Ds.bind));else if(p=r.match(eo)){if(h=p[1],l=p[2],"else"===h)continue;u=jt(e,"directives",h,!0),u&&i(h,u)}if(v.length)return vi(v)}function di(t){var e=Object.create(null),i=t.match(io);if(i)for(var n=i.length;n--;)e[i[n].slice(1)]=!0;return e}function vi(t){return function(e,i,n,r,s){for(var o=t.length;o--;)e._bindDir(t[o],i,n,r,s)}}function mi(t){for(var e=t.length;e--;)if(t[e].oneTime)return!0}function gi(t){return"SCRIPT"===t.tagName&&(!t.hasAttribute("type")||"text/javascript"===t.getAttribute("type"))}function _i(t,e){return e&&(e._containerAttrs=bi(t)),vt(t)&&(t=ce(t)),e&&(e._asComponent&&!e.template&&(e.template="<slot></slot>"),e.template&&(e._content=ft(t),t=yi(t,e))),bt(t)&&(rt(mt("v-start",!0),t),t.appendChild(mt("v-end",!0))),t}function yi(t,e){var i=e.template,n=ce(i,!0);if(n){var r=n.firstChild;if(!r)return n;var s=r.tagName&&r.tagName.toLowerCase();return e.replace?(t===document.body,n.childNodes.length>1||1!==r.nodeType||"component"===s||jt(e,"components",s)||tt(r,"is")||jt(e,"elementDirectives",s)||r.hasAttribute("v-for")||r.hasAttribute("v-if")?n:(e._replacerAttrs=bi(r),wi(t,r),r)):(t.appendChild(n),t)}}function bi(t){if(1===t.nodeType&&t.hasAttributes())return d(t.attributes)}function wi(t,e){for(var i,n,r=t.attributes,s=r.length;s--;)i=r[s].name,n=r[s].value,e.hasAttribute(i)||oo.test(i)?"class"===i&&!V(n)&&(n=n.trim())&&n.split(/\s+/).forEach(function(t){ct(e,t)}):e.setAttribute(i,n)}function Ci(t,e){if(e){for(var i,n,r=t._slotContents=Object.create(null),s=0,o=e.children.length;s<o;s++)i=e.children[s],(n=i.getAttribute("slot"))&&(r[n]||(r[n]=[])).push(i);for(n in r)r[n]=$i(r[n],e);if(e.hasChildNodes()){var a=e.childNodes;if(1===a.length&&3===a[0].nodeType&&!a[0].data.trim())return;r.default=$i(e.childNodes,e)}}}function $i(t,e){var i=document.createDocumentFragment();t=d(t);for(var n=0,r=t.length;n<r;n++){var s=t[n];!vt(s)||s.hasAttribute("v-if")||s.hasAttribute("v-for")||(e.removeChild(s),s=ce(s,!0)),i.appendChild(s)}return i}function ki(t){function e(){}function n(t,e){var i=new re(e,t,null,{lazy:!0});return function(){return i.dirty&&i.evaluate(),Et.target&&i.depend(),i.value}}Object.defineProperty(t.prototype,"$data",{get:function(){return this._data},set:function(t){t!==this._data&&this._setData(t)}}),t.prototype._initState=function(){this._initProps(),this._initMeta(),this._initMethods(),this._initData(),this._initComputed()},t.prototype._initProps=function(){var t=this.$options,e=t.el,i=t.props;e=t.el=Z(e),this._propsUnlinkFn=e&&1===e.nodeType&&i?Ye(this,e,i,this._scope):null},t.prototype._initData=function(){var t=this.$options.data,e=this._data=t?t():{};g(e)||(e={});var n,r,s=this._props,o=Object.keys(e);for(n=o.length;n--;)r=o[n],s&&i(s,r)||this._proxy(r);Rt(e,this)},t.prototype._setData=function(t){t=t||{};var e=this._data;this._data=t;var n,r,s;for(n=Object.keys(e),s=n.length;s--;)r=n[s],r in t||this._unproxy(r);for(n=Object.keys(t),s=n.length;s--;)r=n[s],i(this,r)||this._proxy(r);e.__ob__.removeVm(this),Rt(t,this),this._digest()},t.prototype._proxy=function(t){if(!r(t)){var e=this;Object.defineProperty(e,t,{configurable:!0,enumerable:!0,get:function(){return e._data[t]},set:function(i){e._data[t]=i}})}},t.prototype._unproxy=function(t){r(t)||delete this[t]},t.prototype._digest=function(){for(var t=0,e=this._watchers.length;t<e;t++)this._watchers[t].update(!0)},t.prototype._initComputed=function(){var t=this.$options.computed;if(t)for(var i in t){var r=t[i],s={enumerable:!0,configurable:!0};"function"==typeof r?(s.get=n(r,this),s.set=e):(s.get=r.get?r.cache!==!1?n(r.get,this):p(r.get,this):e,s.set=r.set?p(r.set,this):e),Object.defineProperty(this,i,s)}},t.prototype._initMethods=function(){var t=this.$options.methods;if(t)for(var e in t)this[e]=p(t[e],this)},t.prototype._initMeta=function(){var t=this.$options._meta;if(t)for(var e in t)Lt(this,e,t[e])}}function xi(t){function e(t,e){for(var i,n,r,s=e.attributes,o=0,a=s.length;o<a;o++)i=s[o].name,ho.test(i)&&(i=i.replace(ho,""),n=s[o].value,Kt(n)&&(n+=".apply(this, $arguments)"),r=(t._scope||t._context).$eval(n,!0),r._fromParent=!0,t.$on(i.replace(ho),r))}function i(t,e,i){if(i){var r,s,o,a;for(s in i)if(r=i[s],qi(r))for(o=0,a=r.length;o<a;o++)n(t,e,s,r[o]);else n(t,e,s,r)}}function n(t,e,i,r,s){var o=typeof r;if("function"===o)t[e](i,r,s);else if("string"===o){var a=t.$options.methods,h=a&&a[r];h&&t[e](i,h,s)}else r&&"object"===o&&n(t,e,i,r.handler,r)}function r(){this._isAttached||(this._isAttached=!0,this.$children.forEach(s))}function s(t){!t._isAttached&&X(t.$el)&&t._callHook("attached")}function o(){this._isAttached&&(this._isAttached=!1,this.$children.forEach(a))}function a(t){t._isAttached&&!X(t.$el)&&t._callHook("detached")}t.prototype._initEvents=function(){var t=this.$options;t._asComponent&&e(this,t.el),i(this,"$on",t.events),i(this,"$watch",t.watch)},t.prototype._initDOMHooks=function(){this.$on("hook:attached",r),this.$on("hook:detached",o)},t.prototype._callHook=function(t){this.$emit("pre-hook:"+t);var e=this.$options[t];if(e)for(var i=0,n=e.length;i<n;i++)e[i].call(this);this.$emit("hook:"+t)}}function Ai(){}function Oi(t,e,i,n,r,s){this.vm=e,this.el=i,this.descriptor=t,this.name=t.name,this.expression=t.expression,this.arg=t.arg,this.modifiers=t.modifiers,this.filters=t.filters,this.literal=this.modifiers&&this.modifiers.literal,this._locked=!1,this._bound=!1,this._listeners=null,this._host=n,this._scope=r,this._frag=s}function Ti(t){t.prototype._updateRef=function(t){var e=this.$options._ref;if(e){var i=(this._scope||this._context).$refs;t?i[e]===this&&(i[e]=null):i[e]=this}},t.prototype._compile=function(t){var e=this.$options,i=t;if(t=_i(t,e),this._initElement(t),1!==t.nodeType||null===Y(t,"v-pre")){var n=this._context&&this._context.$options,r=Ke(t,e,n);Ci(this,e._content);var s,o=this.constructor;e._linkerCachable&&(s=o.linker,s||(s=o.linker=qe(t,e)));var a=r(this,t,this._scope),h=s?s(this,t):qe(t,e)(this,t);
    this._unlinkFn=function(){a(),h(!0)},e.replace&&st(i,t),this._isCompiled=!0,this._callHook("compiled")}},t.prototype._initElement=function(t){bt(t)?(this._isFragment=!0,this.$el=this._fragmentStart=t.firstChild,this._fragmentEnd=t.lastChild,3===this._fragmentStart.nodeType&&(this._fragmentStart.data=this._fragmentEnd.data=""),this._fragment=t):this.$el=t,this.$el.__vue__=this,this._callHook("beforeCompile")},t.prototype._bindDir=function(t,e,i,n,r){this._directives.push(new Oi(t,this,e,i,n,r))},t.prototype._destroy=function(t,e){if(this._isBeingDestroyed)return void(e||this._cleanup());var i,n,r=this,s=function(){!i||n||e||r._cleanup()};t&&this.$el&&(n=!0,this.$remove(function(){n=!1,s()})),this._callHook("beforeDestroy"),this._isBeingDestroyed=!0;var o,a=this.$parent;for(a&&!a._isBeingDestroyed&&(a.$children.$remove(this),this._updateRef(!0)),o=this.$children.length;o--;)this.$children[o].$destroy();for(this._propsUnlinkFn&&this._propsUnlinkFn(),this._unlinkFn&&this._unlinkFn(),o=this._watchers.length;o--;)this._watchers[o].teardown();this.$el&&(this.$el.__vue__=null),i=!0,s()},t.prototype._cleanup=function(){this._isDestroyed||(this._frag&&this._frag.children.$remove(this),this._data&&this._data.__ob__&&this._data.__ob__.removeVm(this),this.$el=this.$parent=this.$root=this.$children=this._watchers=this._context=this._scope=this._directives=null,this._isDestroyed=!0,this._callHook("destroyed"),this.$off())}}function Ni(t){t.prototype._applyFilters=function(t,e,i,n){var r,s,o,a,h,l,c,u,f;for(l=0,c=i.length;l<c;l++)if(r=i[n?c-l-1:l],s=jt(this.$options,"filters",r.name,!0),s&&(s=n?s.write:s.read||s,"function"==typeof s)){if(o=n?[t,e]:[t],h=n?2:1,r.args)for(u=0,f=r.args.length;u<f;u++)a=r.args[u],o[u+h]=a.dynamic?this.$get(a.value):a.value;t=s.apply(this,o)}return t},t.prototype._resolveComponent=function(e,i){var n;if(n="function"==typeof e?e:jt(this.$options,"components",e,!0))if(n.options)i(n);else if(n.resolved)i(n.resolved);else if(n.requested)n.pendingCallbacks.push(i);else{n.requested=!0;var r=n.pendingCallbacks=[i];n.call(this,function(e){g(e)&&(e=t.extend(e)),n.resolved=e;for(var i=0,s=r.length;i<s;i++)r[i](e)},function(t){})}}}function ji(t){function i(t){return JSON.parse(JSON.stringify(t))}t.prototype.$get=function(t,e){var i=Yt(t);if(i){if(e){var n=this;return function(){n.$arguments=d(arguments);var t=i.get.call(n,n);return n.$arguments=null,t}}try{return i.get.call(this,this)}catch(t){}}},t.prototype.$set=function(t,e){var i=Yt(t,!0);i&&i.set&&i.set.call(this,this,e)},t.prototype.$delete=function(t){e(this._data,t)},t.prototype.$watch=function(t,e,i){var n,r=this;"string"==typeof t&&(n=I(t),t=n.expression);var s=new re(r,t,e,{deep:i&&i.deep,sync:i&&i.sync,filters:n&&n.filters,user:!i||i.user!==!1});return i&&i.immediate&&e.call(r,s.value),function(){s.teardown()}},t.prototype.$eval=function(t,e){if(lo.test(t)){var i=I(t),n=this.$get(i.expression,e);return i.filters?this._applyFilters(n,null,i.filters):n}return this.$get(t,e)},t.prototype.$interpolate=function(t){var e=V(t),i=this;return e?1===e.length?i.$eval(e[0].value)+"":e.map(function(t){return t.tag?i.$eval(t.value):t.value}).join(""):t},t.prototype.$log=function(t){var e=t?Bt(this._data,t):this._data;if(e&&(e=i(e)),!t){var n;for(n in this.$options.computed)e[n]=i(this[n]);if(this._props)for(n in this._props)e[n]=i(this[n])}console.log(e)}}function Ei(t){function e(t,e,n,r,s,o){e=i(e);var a=!X(e),h=r===!1||a?s:o,l=!a&&!t._isAttached&&!X(t.$el);return t._isFragment?(_t(t._fragmentStart,t._fragmentEnd,function(i){h(i,e,t)}),n&&n()):h(t.$el,e,t,n),l&&t._callHook("attached"),t}function i(t){return"string"==typeof t?document.querySelector(t):t}function n(t,e,i,n){e.appendChild(t),n&&n()}function r(t,e,i,n){et(t,e),n&&n()}function s(t,e,i){nt(t),i&&i()}t.prototype.$nextTick=function(t){ln(t,this)},t.prototype.$appendTo=function(t,i,r){return e(this,t,i,r,n,J)},t.prototype.$prependTo=function(t,e,n){return t=i(t),t.hasChildNodes()?this.$before(t.firstChild,e,n):this.$appendTo(t,e,n),this},t.prototype.$before=function(t,i,n){return e(this,t,i,n,r,q)},t.prototype.$after=function(t,e,n){return t=i(t),t.nextSibling?this.$before(t.nextSibling,e,n):this.$appendTo(t.parentNode,e,n),this},t.prototype.$remove=function(t,e){if(!this.$el.parentNode)return t&&t();var i=this._isAttached&&X(this.$el);i||(e=!1);var n=this,r=function(){i&&n._callHook("detached"),t&&t()};if(this._isFragment)yt(this._fragmentStart,this._fragmentEnd,this,this._fragment,r);else{var o=e===!1?s:Q;o(this.$el,this,r)}return this}}function Si(t){function e(t,e,n){var r=t.$parent;if(r&&n&&!i.test(e))for(;r;)r._eventsCount[e]=(r._eventsCount[e]||0)+n,r=r.$parent}t.prototype.$on=function(t,i){return(this._events[t]||(this._events[t]=[])).push(i),e(this,t,1),this},t.prototype.$once=function(t,e){function i(){n.$off(t,i),e.apply(this,arguments)}var n=this;return i.fn=e,this.$on(t,i),this},t.prototype.$off=function(t,i){var n;if(!arguments.length){if(this.$parent)for(t in this._events)n=this._events[t],n&&e(this,t,-n.length);return this._events={},this}if(n=this._events[t],!n)return this;if(1===arguments.length)return e(this,t,-n.length),this._events[t]=null,this;for(var r,s=n.length;s--;)if(r=n[s],r===i||r.fn===i){e(this,t,-1),n.splice(s,1);break}return this},t.prototype.$emit=function(t){var e="string"==typeof t;t=e?t:t.name;var i=this._events[t],n=e||!i;if(i){i=i.length>1?d(i):i;var r=e&&i.some(function(t){return t._fromParent});r&&(n=!1);for(var s=d(arguments,1),o=0,a=i.length;o<a;o++){var h=i[o],l=h.apply(this,s);l!==!0||r&&!h._fromParent||(n=!0)}}return n},t.prototype.$broadcast=function(t){var e="string"==typeof t;if(t=e?t:t.name,this._eventsCount[t]){var i=this.$children,n=d(arguments);e&&(n[0]={name:t,source:this});for(var r=0,s=i.length;r<s;r++){var o=i[r],a=o.$emit.apply(o,n);a&&o.$broadcast.apply(o,n)}return this}},t.prototype.$dispatch=function(t){var e=this.$emit.apply(this,arguments);if(e){var i=this.$parent,n=d(arguments);for(n[0]={name:t,source:this};i;)e=i.$emit.apply(i,n),i=e?i.$parent:null;return this}};var i=/^hook:/}function Fi(t){function e(){this._isAttached=!0,this._isReady=!0,this._callHook("ready")}t.prototype.$mount=function(t){if(!this._isCompiled)return t=Z(t),t||(t=document.createElement("div")),this._compile(t),this._initDOMHooks(),X(this.$el)?(this._callHook("attached"),e.call(this)):this.$once("hook:attached",e),this},t.prototype.$destroy=function(t,e){this._destroy(t,e)},t.prototype.$compile=function(t,e,i,n){return qe(t,this.$options,!0)(this,t,e,i,n)}}function Di(t){this._init(t)}function Pi(t,e,i){return i=i?parseInt(i,10):0,e=o(e),"number"==typeof e?t.slice(i,i+e):t}function Ri(t,e,i){if(t=po(t),null==e)return t;if("function"==typeof e)return t.filter(e);e=(""+e).toLowerCase();for(var n,r,s,o,a="in"===i?3:2,h=Array.prototype.concat.apply([],d(arguments,a)),l=[],c=0,u=t.length;c<u;c++)if(n=t[c],s=n&&n.$value||n,o=h.length){for(;o--;)if(r=h[o],"$key"===r&&Hi(n.$key,e)||Hi(Bt(s,r),e)){l.push(n);break}}else Hi(n,e)&&l.push(n);return l}function Li(t){function e(t,e,i){var r=n[i];return r&&("$key"!==r&&(m(t)&&"$value"in t&&(t=t.$value),m(e)&&"$value"in e&&(e=e.$value)),t=m(t)?Bt(t,r):t,e=m(e)?Bt(e,r):e),t===e?0:t>e?s:-s}var i=null,n=void 0;t=po(t);var r=d(arguments,1),s=r[r.length-1];"number"==typeof s?(s=s<0?-1:1,r=r.length>1?r.slice(0,-1):r):s=1;var o=r[0];return o?("function"==typeof o?i=function(t,e){return o(t,e)*s}:(n=Array.prototype.concat.apply([],r),i=function(t,r,s){return s=s||0,s>=n.length-1?e(t,r,s):e(t,r,s)||i(t,r,s+1)}),t.slice().sort(i)):t}function Hi(t,e){var i;if(g(t)){var n=Object.keys(t);for(i=n.length;i--;)if(Hi(t[n[i]],e))return!0}else if(qi(t)){for(i=t.length;i--;)if(Hi(t[i],e))return!0}else if(null!=t)return t.toString().toLowerCase().indexOf(e)>-1}function Ii(i){function n(t){return new Function("return function "+f(t)+" (options) { this._init(options) }")()}i.options={directives:Ds,elementDirectives:fo,filters:mo,transitions:{},components:{},partials:{},replace:!0},i.util=Kn,i.config=Mn,i.set=t,i.delete=e,i.nextTick=ln,i.compiler=ao,i.FragmentFactory=_e,i.internalDirectives=Ys,i.parsers={path:mr,text:Ln,template:qr,directive:En,expression:jr},i.cid=0;var r=1;i.extend=function(t){t=t||{};var e=this,i=0===e.cid;if(i&&t._Ctor)return t._Ctor;var s=t.name||e.options.name,o=n(s||"VueComponent");return o.prototype=Object.create(e.prototype),o.prototype.constructor=o,o.cid=r++,o.options=Nt(e.options,t),o.super=e,o.extend=e.extend,Mn._assetTypes.forEach(function(t){o[t]=e[t]}),s&&(o.options.components[s]=o),i&&(t._Ctor=o),o},i.use=function(t){if(!t.installed){var e=d(arguments,1);return e.unshift(this),"function"==typeof t.install?t.install.apply(t,e):t.apply(null,e),t.installed=!0,this}},i.mixin=function(t){i.options=Nt(i.options,t)},Mn._assetTypes.forEach(function(t){i[t]=function(e,n){return n?("component"===t&&g(n)&&(n.name||(n.name=e),n=i.extend(n)),this.options[t+"s"][e]=n,n):this.options[t+"s"][e]}}),v(i.transition,Vn)}var Mi=Object.prototype.hasOwnProperty,Wi=/^\s?(true|false|-?[\d\.]+|'[^']*'|"[^"]*")\s?$/,Vi=/-(\w)/g,Bi=/([^-])([A-Z])/g,zi=/(?:^|[-_\/])(\w)/g,Ui=Object.prototype.toString,Ji="[object Object]",qi=Array.isArray,Qi="__proto__"in{},Gi="undefined"!=typeof window&&"[object Object]"!==Object.prototype.toString.call(window),Zi=Gi&&window.__VUE_DEVTOOLS_GLOBAL_HOOK__,Xi=Gi&&window.navigator.userAgent.toLowerCase(),Yi=Xi&&Xi.indexOf("trident")>0,Ki=Xi&&Xi.indexOf("msie 9.0")>0,tn=Xi&&Xi.indexOf("android")>0,en=Xi&&/iphone|ipad|ipod|ios/.test(Xi),nn=void 0,rn=void 0,sn=void 0,on=void 0;if(Gi&&!Ki){var an=void 0===window.ontransitionend&&void 0!==window.onwebkittransitionend,hn=void 0===window.onanimationend&&void 0!==window.onwebkitanimationend;nn=an?"WebkitTransition":"transition",rn=an?"webkitTransitionEnd":"transitionend",sn=hn?"WebkitAnimation":"animation",on=hn?"webkitAnimationEnd":"animationend"}var ln=function(){function t(){i=!1;var t=e.slice(0);e.length=0;for(var n=0;n<t.length;n++)t[n]()}var e=[],i=!1,n=void 0;if("undefined"!=typeof Promise&&$(Promise)){var r=Promise.resolve(),s=function(){};n=function(){r.then(t),en&&setTimeout(s)}}else if("undefined"!=typeof MutationObserver){var o=1,a=new MutationObserver(t),h=document.createTextNode(String(o));a.observe(h,{characterData:!0}),n=function(){o=(o+1)%2,h.data=String(o)}}else n=setTimeout;return function(r,s){var o=s?function(){r.call(s)}:r;e.push(o),i||(i=!0,n(t,0))}}(),cn=void 0;"undefined"!=typeof Set&&$(Set)?cn=Set:(cn=function(){this.set=Object.create(null)},cn.prototype.has=function(t){return void 0!==this.set[t]},cn.prototype.add=function(t){this.set[t]=1},cn.prototype.clear=function(){this.set=Object.create(null)});var un=k.prototype;un.put=function(t,e){var i,n=this.get(t,!0);return n||(this.size===this.limit&&(i=this.shift()),n={key:t},this._keymap[t]=n,this.tail?(this.tail.newer=n,n.older=this.tail):this.head=n,this.tail=n,this.size++),n.value=e,i},un.shift=function(){var t=this.head;return t&&(this.head=this.head.newer,this.head.older=void 0,t.newer=t.older=void 0,this._keymap[t.key]=void 0,this.size--),t},un.get=function(t,e){var i=this._keymap[t];if(void 0!==i)return i===this.tail?e?i:i.value:(i.newer&&(i===this.head&&(this.head=i.newer),i.newer.older=i.older),i.older&&(i.older.newer=i.newer),i.newer=void 0,i.older=this.tail,this.tail&&(this.tail.newer=i),this.tail=i,e?i:i.value)};var fn,pn,dn,vn,mn,gn,_n=new k(1e3),yn=/^in$|^-?\d+/,bn=0,wn=1,Cn=2,$n=3,kn=34,xn=39,An=124,On=92,Tn=32,Nn={91:1,123:1,40:1},jn={91:93,123:125,40:41},En=Object.freeze({parseDirective:I}),Sn=/[-.*+?^${}()|[\]\/\\]/g,Fn=void 0,Dn=void 0,Pn=void 0,Rn=/[^|]\|[^|]/,Ln=Object.freeze({compileRegex:W,parseText:V,tokensToExp:B}),Hn=["{{","}}"],In=["{{{","}}}"],Mn=Object.defineProperties({debug:!1,silent:!1,async:!0,warnExpressionErrors:!0,devtools:!1,_delimitersChanged:!0,_assetTypes:["component","directive","elementDirective","filter","transition","partial"],_propBindingModes:{ONE_WAY:0,TWO_WAY:1,ONE_TIME:2},_maxUpdateCount:100},{delimiters:{get:function(){return Hn},set:function(t){Hn=t,W()},configurable:!0,enumerable:!0},unsafeDelimiters:{get:function(){return In},set:function(t){In=t,W()},configurable:!0,enumerable:!0}}),Wn=void 0,Vn=Object.freeze({appendWithTransition:J,beforeWithTransition:q,removeWithTransition:Q,applyTransition:G}),Bn=/^v-ref:/,zn=/^(div|p|span|img|a|b|i|br|ul|ol|li|h1|h2|h3|h4|h5|h6|code|pre|table|th|td|tr|form|label|input|select|option|nav|article|section|header|footer)$/i,Un=/^(slot|partial|component)$/i,Jn=Mn.optionMergeStrategies=Object.create(null);Jn.data=function(t,e,i){return i?t||e?function(){var n="function"==typeof e?e.call(i):e,r="function"==typeof t?t.call(i):void 0;return n?kt(n,r):r}:void 0:e?"function"!=typeof e?t:t?function(){return kt(e.call(this),t.call(this))}:e:t},Jn.el=function(t,e,i){if(i||!e||"function"==typeof e){var n=e||t;return i&&"function"==typeof n?n.call(i):n}},Jn.init=Jn.created=Jn.ready=Jn.attached=Jn.detached=Jn.beforeCompile=Jn.compiled=Jn.beforeDestroy=Jn.destroyed=Jn.activate=function(t,e){return e?t?t.concat(e):qi(e)?e:[e]:t},Mn._assetTypes.forEach(function(t){Jn[t+"s"]=xt}),Jn.watch=Jn.events=function(t,e){if(!e)return t;if(!t)return e;var i={};v(i,t);for(var n in e){var r=i[n],s=e[n];r&&!qi(r)&&(r=[r]),i[n]=r?r.concat(s):[s]}return i},Jn.props=Jn.methods=Jn.computed=function(t,e){if(!e)return t;if(!t)return e;var i=Object.create(null);return v(i,t),v(i,e),i};var qn=function(t,e){return void 0===e?t:e},Qn=0;Et.target=null,Et.prototype.addSub=function(t){this.subs.push(t)},Et.prototype.removeSub=function(t){this.subs.$remove(t)},Et.prototype.depend=function(){Et.target.addDep(this)},Et.prototype.notify=function(){for(var t=d(this.subs),e=0,i=t.length;e<i;e++)t[e].update()};var Gn=Array.prototype,Zn=Object.create(Gn);["push","pop","shift","unshift","splice","sort","reverse"].forEach(function(t){var e=Gn[t];_(Zn,t,function(){for(var i=arguments.length,n=new Array(i);i--;)n[i]=arguments[i];var r,s=e.apply(this,n),o=this.__ob__;switch(t){case"push":r=n;break;case"unshift":r=n;break;case"splice":r=n.slice(2)}return r&&o.observeArray(r),o.dep.notify(),s})}),_(Gn,"$set",function(t,e){return t>=this.length&&(this.length=Number(t)+1),this.splice(t,1,e)[0]}),_(Gn,"$remove",function(t){if(this.length){var e=b(this,t);return e>-1?this.splice(e,1):void 0}});var Xn=Object.getOwnPropertyNames(Zn),Yn=!0;Ft.prototype.walk=function(t){for(var e=Object.keys(t),i=0,n=e.length;i<n;i++)this.convert(e[i],t[e[i]])},Ft.prototype.observeArray=function(t){for(var e=0,i=t.length;e<i;e++)Rt(t[e])},Ft.prototype.convert=function(t,e){Lt(this.value,t,e)},Ft.prototype.addVm=function(t){(this.vms||(this.vms=[])).push(t)},Ft.prototype.removeVm=function(t){this.vms.$remove(t)};var Kn=Object.freeze({defineReactive:Lt,set:t,del:e,hasOwn:i,isLiteral:n,isReserved:r,_toString:s,toNumber:o,toBoolean:a,stripQuotes:h,camelize:l,hyphenate:u,classify:f,bind:p,toArray:d,extend:v,isObject:m,isPlainObject:g,def:_,debounce:y,indexOf:b,cancellable:w,looseEqual:C,isArray:qi,hasProto:Qi,inBrowser:Gi,devtools:Zi,isIE:Yi,isIE9:Ki,isAndroid:tn,isIOS:en,get transitionProp(){return nn},get transitionEndEvent(){return rn},get animationProp(){return sn},get animationEndEvent(){return on},nextTick:ln,get _Set(){return cn},query:Z,inDoc:X,getAttr:Y,getBindAttr:K,hasBindAttr:tt,before:et,after:it,remove:nt,prepend:rt,replace:st,on:ot,off:at,setClass:lt,addClass:ct,removeClass:ut,extractContent:ft,trimNode:pt,isTemplate:vt,createAnchor:mt,findRef:gt,mapNodeRange:_t,removeNodeRange:yt,isFragment:bt,getOuterHTML:wt,mergeOptions:Nt,resolveAsset:jt,checkComponentAttr:Ct,commonTagRE:zn,reservedTagRE:Un,warn:Wn}),tr=0,er=new k(1e3),ir=0,nr=1,rr=2,sr=3,or=0,ar=1,hr=2,lr=3,cr=4,ur=5,fr=6,pr=7,dr=8,vr=[];vr[or]={ws:[or],ident:[lr,ir],"[":[cr],eof:[pr]},vr[ar]={ws:[ar],".":[hr],"[":[cr],eof:[pr]},vr[hr]={ws:[hr],ident:[lr,ir]},vr[lr]={ident:[lr,ir],0:[lr,ir],number:[lr,ir],ws:[ar,nr],".":[hr,nr],"[":[cr,nr],eof:[pr,nr]},vr[cr]={"'":[ur,ir],'"':[fr,ir],"[":[cr,rr],"]":[ar,sr],eof:dr,else:[cr,ir]},vr[ur]={"'":[cr,ir],eof:dr,else:[ur,ir]},vr[fr]={'"':[cr,ir],eof:dr,else:[fr,ir]};var mr=Object.freeze({parsePath:Vt,getPath:Bt,setPath:zt}),gr=new k(1e3),_r="Math,Date,this,true,false,null,undefined,Infinity,NaN,isNaN,isFinite,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,parseInt,parseFloat",yr=new RegExp("^("+_r.replace(/,/g,"\\b|")+"\\b)"),br="break,case,class,catch,const,continue,debugger,default,delete,do,else,export,extends,finally,for,function,if,import,in,instanceof,let,return,super,switch,throw,try,var,while,with,yield,enum,await,implements,package,protected,static,interface,private,public",wr=new RegExp("^("+br.replace(/,/g,"\\b|")+"\\b)"),Cr=/\s/g,$r=/\n/g,kr=/[\{,]\s*[\w\$_]+\s*:|('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*\$\{|\}(?:[^`\\"']|\\.)*`|`(?:[^`\\]|\\.)*`)|new |typeof |void /g,xr=/"(\d+)"/g,Ar=/^[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*|\['.*?'\]|\[".*?"\]|\[\d+\]|\[[A-Za-z_$][\w$]*\])*$/,Or=/[^\w$\.](?:[A-Za-z_$][\w$]*)/g,Tr=/^(?:true|false|null|undefined|Infinity|NaN)$/,Nr=[],jr=Object.freeze({parseExpression:Yt,isSimplePath:Kt}),Er=[],Sr=[],Fr={},Dr={},Pr=!1,Rr=0;re.prototype.get=function(){this.beforeGet();var t,e=this.scope||this.vm;try{t=this.getter.call(e,e)}catch(t){}return this.deep&&se(t),this.preProcess&&(t=this.preProcess(t)),this.filters&&(t=e._applyFilters(t,null,this.filters,!1)),this.postProcess&&(t=this.postProcess(t)),this.afterGet(),t},re.prototype.set=function(t){var e=this.scope||this.vm;this.filters&&(t=e._applyFilters(t,this.value,this.filters,!0));try{this.setter.call(e,e,t)}catch(t){}var i=e.$forContext;if(i&&i.alias===this.expression){if(i.filters)return;i._withLock(function(){e.$key?i.rawValue[e.$key]=t:i.rawValue.$set(e.$index,t)})}},re.prototype.beforeGet=function(){Et.target=this},re.prototype.addDep=function(t){var e=t.id;this.newDepIds.has(e)||(this.newDepIds.add(e),this.newDeps.push(t),this.depIds.has(e)||t.addSub(this))},re.prototype.afterGet=function(){Et.target=null;for(var t=this.deps.length;t--;){var e=this.deps[t];this.newDepIds.has(e.id)||e.removeSub(this)}var i=this.depIds;this.depIds=this.newDepIds,this.newDepIds=i,this.newDepIds.clear(),i=this.deps,this.deps=this.newDeps,this.newDeps=i,this.newDeps.length=0},re.prototype.update=function(t){this.lazy?this.dirty=!0:this.sync||!Mn.async?this.run():(this.shallow=this.queued?!!t&&this.shallow:!!t,this.queued=!0,ne(this))},re.prototype.run=function(){if(this.active){var t=this.get();if(t!==this.value||(m(t)||this.deep)&&!this.shallow){var e=this.value;this.value=t;this.prevError;this.cb.call(this.vm,t,e)}this.queued=this.shallow=!1}},re.prototype.evaluate=function(){var t=Et.target;this.value=this.get(),this.dirty=!1,Et.target=t},re.prototype.depend=function(){for(var t=this.deps.length;t--;)this.deps[t].depend()},re.prototype.teardown=function(){if(this.active){this.vm._isBeingDestroyed||this.vm._vForRemoving||this.vm._watchers.$remove(this);for(var t=this.deps.length;t--;)this.deps[t].removeSub(this);this.active=!1,this.vm=this.cb=this.value=null}};var Lr=new cn,Hr={bind:function(){this.attr=3===this.el.nodeType?"data":"textContent"},update:function(t){this.el[this.attr]=s(t)}},Ir=new k(1e3),Mr=new k(1e3),Wr={efault:[0,"",""],legend:[1,"<fieldset>","</fieldset>"],tr:[2,"<table><tbody>","</tbody></table>"],col:[2,"<table><tbody></tbody><colgroup>","</colgroup></table>"]};Wr.td=Wr.th=[3,"<table><tbody><tr>","</tr></tbody></table>"],Wr.option=Wr.optgroup=[1,'<select multiple="multiple">',"</select>"],Wr.thead=Wr.tbody=Wr.colgroup=Wr.caption=Wr.tfoot=[1,"<table>","</table>"],Wr.g=Wr.defs=Wr.symbol=Wr.use=Wr.image=Wr.text=Wr.circle=Wr.ellipse=Wr.line=Wr.path=Wr.polygon=Wr.polyline=Wr.rect=[1,'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:ev="http://www.w3.org/2001/xml-events"version="1.1">',"</svg>"];var Vr=/<([\w:-]+)/,Br=/&#?\w+?;/,zr=/<!--/,Ur=function(){if(Gi){var t=document.createElement("div");return t.innerHTML="<template>1</template>",!t.cloneNode(!0).firstChild.innerHTML}return!1}(),Jr=function(){if(Gi){var t=document.createElement("textarea");return t.placeholder="t","t"===t.cloneNode(!0).value}return!1}(),qr=Object.freeze({cloneNode:le,parseTemplate:ce}),Qr={bind:function(){8===this.el.nodeType&&(this.nodes=[],this.anchor=mt("v-html"),st(this.el,this.anchor))},update:function(t){t=s(t),this.nodes?this.swap(t):this.el.innerHTML=t},swap:function(t){for(var e=this.nodes.length;e--;)nt(this.nodes[e]);var i=ce(t,!0,!0);this.nodes=d(i.childNodes),et(i,this.anchor)}};ue.prototype.callHook=function(t){var e,i;for(e=0,i=this.childFrags.length;e<i;e++)this.childFrags[e].callHook(t);for(e=0,i=this.children.length;e<i;e++)t(this.children[e])},ue.prototype.beforeRemove=function(){var t,e;for(t=0,e=this.childFrags.length;t<e;t++)this.childFrags[t].beforeRemove(!1);for(t=0,e=this.children.length;t<e;t++)this.children[t].$destroy(!1,!0);var i=this.unlink.dirs;for(t=0,e=i.length;t<e;t++)i[t]._watcher&&i[t]._watcher.teardown()},ue.prototype.destroy=function(){this.parentFrag&&this.parentFrag.childFrags.$remove(this),this.node.__v_frag=null,this.unlink()};var Gr=new k(5e3);_e.prototype.create=function(t,e,i){var n=le(this.template);return new ue(this.linker,this.vm,n,t,e,i)};var Zr=700,Xr=800,Yr=850,Kr=1100,ts=1500,es=1500,is=1750,ns=2100,rs=2200,ss=2300,os=0,as={priority:rs,terminal:!0,params:["track-by","stagger","enter-stagger","leave-stagger"],bind:function(){var t=this.expression.match(/(.*) (?:in|of) (.*)/);if(t){var e=t[1].match(/\((.*),(.*)\)/);e?(this.iterator=e[1].trim(),this.alias=e[2].trim()):this.alias=t[1].trim(),this.expression=t[2]}if(this.alias){this.id="__v-for__"+ ++os;var i=this.el.tagName;this.isOption=("OPTION"===i||"OPTGROUP"===i)&&"SELECT"===this.el.parentNode.tagName,this.start=mt("v-for-start"),this.end=mt("v-for-end"),st(this.el,this.end),et(this.start,this.end),this.cache=Object.create(null),this.factory=new _e(this.vm,this.el)}},update:function(t){this.diff(t),this.updateRef(),this.updateModel()},diff:function(t){var e,n,r,s,o,a,h=t[0],l=this.fromObject=m(h)&&i(h,"$key")&&i(h,"$value"),c=this.params.trackBy,u=this.frags,f=this.frags=new Array(t.length),p=this.alias,d=this.iterator,v=this.start,g=this.end,_=X(v),y=!u;for(e=0,n=t.length;e<n;e++)h=t[e],s=l?h.$key:null,o=l?h.$value:h,a=!m(o),r=!y&&this.getCachedFrag(o,e,s),r?(r.reused=!0,r.scope.$index=e,s&&(r.scope.$key=s),d&&(r.scope[d]=null!==s?s:e),(c||l||a)&&St(function(){r.scope[p]=o})):(r=this.create(o,p,e,s),r.fresh=!y),f[e]=r,y&&r.before(g);if(!y){var b=0,w=u.length-f.length;for(this.vm._vForRemoving=!0,e=0,n=u.length;e<n;e++)r=u[e],r.reused||(this.deleteCachedFrag(r),this.remove(r,b++,w,_));this.vm._vForRemoving=!1,b&&(this.vm._watchers=this.vm._watchers.filter(function(t){return t.active}));var C,$,k,x=0;for(e=0,n=f.length;e<n;e++)r=f[e],C=f[e-1],$=C?C.staggerCb?C.staggerAnchor:C.end||C.node:v,r.reused&&!r.staggerCb?(k=ye(r,v,this.id),k===C||k&&ye(k,v,this.id)===C||this.move(r,$)):this.insert(r,x++,$,_),r.reused=r.fresh=!1}},create:function(t,e,i,n){var r=this._host,s=this._scope||this.vm,o=Object.create(s);o.$refs=Object.create(s.$refs),o.$els=Object.create(s.$els),o.$parent=s,o.$forContext=this,St(function(){Lt(o,e,t)}),Lt(o,"$index",i),n?Lt(o,"$key",n):o.$key&&_(o,"$key",null),this.iterator&&Lt(o,this.iterator,null!==n?n:i);var a=this.factory.create(r,o,this._frag);return a.forId=this.id,this.cacheFrag(t,a,i,n),a},updateRef:function(){var t=this.descriptor.ref;if(t){var e,i=(this._scope||this.vm).$refs;this.fromObject?(e={},this.frags.forEach(function(t){e[t.scope.$key]=Ce(t)})):e=this.frags.map(Ce),i[t]=e}},updateModel:function(){if(this.isOption){var t=this.start.parentNode,e=t&&t.__v_model;e&&e.forceUpdate()}},insert:function(t,e,i,n){t.staggerCb&&(t.staggerCb.cancel(),t.staggerCb=null);var r=this.getStagger(t,e,null,"enter");if(n&&r){var s=t.staggerAnchor;s||(s=t.staggerAnchor=mt("stagger-anchor"),s.__v_frag=t),it(s,i);var o=t.staggerCb=w(function(){t.staggerCb=null,t.before(s),nt(s)});setTimeout(o,r)}else{var a=i.nextSibling;a||(it(this.end,i),a=this.end),t.before(a)}},remove:function(t,e,i,n){if(t.staggerCb)return t.staggerCb.cancel(),void(t.staggerCb=null);var r=this.getStagger(t,e,i,"leave");if(n&&r){var s=t.staggerCb=w(function(){t.staggerCb=null,t.remove()});setTimeout(s,r)}else t.remove()},move:function(t,e){e.nextSibling||this.end.parentNode.appendChild(this.end),t.before(e.nextSibling,!1)},cacheFrag:function(t,e,n,r){var s,o=this.params.trackBy,a=this.cache,h=!m(t);r||o||h?(s=we(n,r,t,o),a[s]||(a[s]=e)):(s=this.id,i(t,s)?null===t[s]&&(t[s]=e):Object.isExtensible(t)&&_(t,s,e)),e.raw=t},getCachedFrag:function(t,e,i){var n,r=this.params.trackBy,s=!m(t);if(i||r||s){var o=we(e,i,t,r);n=this.cache[o]}else n=t[this.id];return n&&(n.reused||n.fresh),n},deleteCachedFrag:function(t){var e=t.raw,n=this.params.trackBy,r=t.scope,s=r.$index,o=i(r,"$key")&&r.$key,a=!m(e);if(n||o||a){var h=we(s,o,e,n);this.cache[h]=null}else e[this.id]=null,t.raw=null},getStagger:function(t,e,i,n){n+="Stagger";var r=t.node.__v_trans,s=r&&r.hooks,o=s&&(s[n]||s.stagger);return o?o.call(t,e,i):e*parseInt(this.params[n]||this.params.stagger,10)},_preProcess:function(t){return this.rawValue=t,t},_postProcess:function(t){if(qi(t))return t;if(g(t)){for(var e,i=Object.keys(t),n=i.length,r=new Array(n);n--;)e=i[n],r[n]={$key:e,$value:t[e]};return r}return"number"!=typeof t||isNaN(t)||(t=be(t)),t||[]},unbind:function(){if(this.descriptor.ref&&((this._scope||this.vm).$refs[this.descriptor.ref]=null),this.frags)for(var t,e=this.frags.length;e--;)t=this.frags[e],this.deleteCachedFrag(t),t.destroy()}},hs={priority:ns,terminal:!0,bind:function(){var t=this.el;if(t.__vue__)this.invalid=!0;else{var e=t.nextElementSibling;e&&null!==Y(e,"v-else")&&(nt(e),this.elseEl=e),this.anchor=mt("v-if"),st(t,this.anchor)}},update:function(t){this.invalid||(t?this.frag||this.insert():this.remove())},insert:function(){this.elseFrag&&(this.elseFrag.remove(),this.elseFrag=null),this.factory||(this.factory=new _e(this.vm,this.el)),this.frag=this.factory.create(this._host,this._scope,this._frag),this.frag.before(this.anchor)},remove:function(){this.frag&&(this.frag.remove(),this.frag=null),this.elseEl&&!this.elseFrag&&(this.elseFactory||(this.elseFactory=new _e(this.elseEl._context||this.vm,this.elseEl)),this.elseFrag=this.elseFactory.create(this._host,this._scope,this._frag),this.elseFrag.before(this.anchor))},unbind:function(){this.frag&&this.frag.destroy(),this.elseFrag&&this.elseFrag.destroy()}},ls={bind:function(){var t=this.el.nextElementSibling;t&&null!==Y(t,"v-else")&&(this.elseEl=t)},update:function(t){this.apply(this.el,t),this.elseEl&&this.apply(this.elseEl,!t)},apply:function(t,e){function i(){t.style.display=e?"":"none"}X(t)?G(t,e?1:-1,i,this.vm):i()}},cs={bind:function(){var t=this,e=this.el,i="range"===e.type,n=this.params.lazy,r=this.params.number,s=this.params.debounce,a=!1;if(tn||i||(this.on("compositionstart",function(){a=!0}),this.on("compositionend",function(){a=!1,n||t.listener()})),this.focused=!1,i||n||(this.on("focus",function(){t.focused=!0}),this.on("blur",function(){t.focused=!1,t._frag&&!t._frag.inserted||t.rawListener()})),this.listener=this.rawListener=function(){if(!a&&t._bound){var n=r||i?o(e.value):e.value;t.set(n),ln(function(){t._bound&&!t.focused&&t.update(t._watcher.value)})}},s&&(this.listener=y(this.listener,s)),this.hasjQuery="function"==typeof jQuery,this.hasjQuery){var h=jQuery.fn.on?"on":"bind";jQuery(e)[h]("change",this.rawListener),n||jQuery(e)[h]("input",this.listener)}else this.on("change",this.rawListener),n||this.on("input",this.listener);!n&&Ki&&(this.on("cut",function(){ln(t.listener)}),this.on("keyup",function(e){46!==e.keyCode&&8!==e.keyCode||t.listener()})),(e.hasAttribute("value")||"TEXTAREA"===e.tagName&&e.value.trim())&&(this.afterBind=this.listener)},update:function(t){t=s(t),t!==this.el.value&&(this.el.value=t)},unbind:function(){var t=this.el;if(this.hasjQuery){var e=jQuery.fn.off?"off":"unbind";jQuery(t)[e]("change",this.listener),jQuery(t)[e]("input",this.listener)}}},us={bind:function(){var t=this,e=this.el;this.getValue=function(){if(e.hasOwnProperty("_value"))return e._value;var i=e.value;return t.params.number&&(i=o(i)),i},this.listener=function(){t.set(t.getValue())},this.on("change",this.listener),e.hasAttribute("checked")&&(this.afterBind=this.listener)},update:function(t){this.el.checked=C(t,this.getValue())}},fs={bind:function(){var t=this,e=this,i=this.el;this.forceUpdate=function(){e._watcher&&e.update(e._watcher.get())};var n=this.multiple=i.hasAttribute("multiple");this.listener=function(){var t=$e(i,n);t=e.params.number?qi(t)?t.map(o):o(t):t,e.set(t)},this.on("change",this.listener);var r=$e(i,n,!0);(n&&r.length||!n&&null!==r)&&(this.afterBind=this.listener),this.vm.$on("hook:attached",function(){ln(t.forceUpdate)}),X(i)||ln(this.forceUpdate)},update:function(t){var e=this.el;e.selectedIndex=-1;for(var i,n,r=this.multiple&&qi(t),s=e.options,o=s.length;o--;)i=s[o],n=i.hasOwnProperty("_value")?i._value:i.value,i.selected=r?ke(t,n)>-1:C(t,n)},unbind:function(){this.vm.$off("hook:attached",this.forceUpdate)}},ps={bind:function(){function t(){var t=i.checked;return t&&i.hasOwnProperty("_trueValue")?i._trueValue:!t&&i.hasOwnProperty("_falseValue")?i._falseValue:t}var e=this,i=this.el;this.getValue=function(){return i.hasOwnProperty("_value")?i._value:e.params.number?o(i.value):i.value},this.listener=function(){var n=e._watcher.get();if(qi(n)){var r=e.getValue(),s=b(n,r);i.checked?s<0&&e.set(n.concat(r)):s>-1&&e.set(n.slice(0,s).concat(n.slice(s+1)))}else e.set(t())},this.on("change",this.listener),i.hasAttribute("checked")&&(this.afterBind=this.listener)},update:function(t){var e=this.el;qi(t)?e.checked=b(t,this.getValue())>-1:e.hasOwnProperty("_trueValue")?e.checked=C(t,e._trueValue):e.checked=!!t}},ds={text:cs,radio:us,select:fs,checkbox:ps},vs={priority:Xr,twoWay:!0,handlers:ds,params:["lazy","number","debounce"],bind:function(){this.checkFilters(),this.hasRead&&!this.hasWrite;var t,e=this.el,i=e.tagName;if("INPUT"===i)t=ds[e.type]||ds.text;else if("SELECT"===i)t=ds.select;else{if("TEXTAREA"!==i)return;t=ds.text}e.__v_model=this,t.bind.call(this),this.update=t.update,this._unbind=t.unbind},checkFilters:function(){var t=this.filters;if(t)for(var e=t.length;e--;){var i=jt(this.vm.$options,"filters",t[e].name);("function"==typeof i||i.read)&&(this.hasRead=!0),i.write&&(this.hasWrite=!0)}},unbind:function(){this.el.__v_model=null,this._unbind&&this._unbind()}},ms={esc:27,tab:9,enter:13,space:32,delete:[8,46],up:38,left:37,right:39,down:40},gs={priority:Zr,acceptStatement:!0,keyCodes:ms,bind:function(){if("IFRAME"===this.el.tagName&&"load"!==this.arg){var t=this;this.iframeBind=function(){ot(t.el.contentWindow,t.arg,t.handler,t.modifiers.capture)},this.on("load",this.iframeBind)}},update:function(t){if(this.descriptor.raw||(t=function(){}),"function"==typeof t){this.modifiers.stop&&(t=Ae(t)),this.modifiers.prevent&&(t=Oe(t)),this.modifiers.self&&(t=Te(t));var e=Object.keys(this.modifiers).filter(function(t){return"stop"!==t&&"prevent"!==t&&"self"!==t&&"capture"!==t});e.length&&(t=xe(t,e)),this.reset(),this.handler=t,this.iframeBind?this.iframeBind():ot(this.el,this.arg,this.handler,this.modifiers.capture)}},reset:function(){var t=this.iframeBind?this.el.contentWindow:this.el;this.handler&&at(t,this.arg,this.handler)},unbind:function(){this.reset()}},_s=["-webkit-","-moz-","-ms-"],ys=["Webkit","Moz","ms"],bs=/!important;?$/,ws=Object.create(null),Cs=null,$s={deep:!0,update:function(t){"string"==typeof t?this.el.style.cssText=t:qi(t)?this.handleObject(t.reduce(v,{})):this.handleObject(t||{})},handleObject:function(t){var e,i,n=this.cache||(this.cache={});for(e in n)e in t||(this.handleSingle(e,null),delete n[e]);for(e in t)i=t[e],i!==n[e]&&(n[e]=i,this.handleSingle(e,i))},handleSingle:function(t,e){if(t=Ne(t))if(null!=e&&(e+=""),e){var i=bs.test(e)?"important":"";i?(e=e.replace(bs,"").trim(),this.el.style.setProperty(t.kebab,e,i)):this.el.style[t.camel]=e;
}else this.el.style[t.camel]=""}},ks="http://www.w3.org/1999/xlink",xs=/^xlink:/,As=/^v-|^:|^@|^(?:is|transition|transition-mode|debounce|track-by|stagger|enter-stagger|leave-stagger)$/,Os=/^(?:value|checked|selected|muted)$/,Ts=/^(?:draggable|contenteditable|spellcheck)$/,Ns={value:"_value","true-value":"_trueValue","false-value":"_falseValue"},js={priority:Yr,bind:function(){var t=this.arg,e=this.el.tagName;t||(this.deep=!0);var i=this.descriptor,n=i.interp;n&&(i.hasOneTime&&(this.expression=B(n,this._scope||this.vm)),(As.test(t)||"name"===t&&("PARTIAL"===e||"SLOT"===e))&&(this.el.removeAttribute(t),this.invalid=!0))},update:function(t){if(!this.invalid){var e=this.arg;this.arg?this.handleSingle(e,t):this.handleObject(t||{})}},handleObject:$s.handleObject,handleSingle:function(t,e){var i=this.el,n=this.descriptor.interp;if(this.modifiers.camel&&(t=l(t)),!n&&Os.test(t)&&t in i){var r="value"===t&&null==e?"":e;i[t]!==r&&(i[t]=r)}var s=Ns[t];if(!n&&s){i[s]=e;var o=i.__v_model;o&&o.listener()}return"value"===t&&"TEXTAREA"===i.tagName?void i.removeAttribute(t):void(Ts.test(t)?i.setAttribute(t,e?"true":"false"):null!=e&&e!==!1?"class"===t?(i.__v_trans&&(e+=" "+i.__v_trans.id+"-transition"),lt(i,e)):xs.test(t)?i.setAttributeNS(ks,t,e===!0?"":e):i.setAttribute(t,e===!0?"":e):i.removeAttribute(t))}},Es={priority:ts,bind:function(){if(this.arg){var t=this.id=l(this.arg),e=(this._scope||this.vm).$els;i(e,t)?e[t]=this.el:Lt(e,t,this.el)}},unbind:function(){var t=(this._scope||this.vm).$els;t[this.id]===this.el&&(t[this.id]=null)}},Ss={bind:function(){}},Fs={bind:function(){var t=this.el;this.vm.$once("pre-hook:compiled",function(){t.removeAttribute("v-cloak")})}},Ds={text:Hr,html:Qr,for:as,if:hs,show:ls,model:vs,on:gs,bind:js,el:Es,ref:Ss,cloak:Fs},Ps={deep:!0,update:function(t){t?"string"==typeof t?this.setClass(t.trim().split(/\s+/)):this.setClass(Ee(t)):this.cleanup()},setClass:function(t){this.cleanup(t);for(var e=0,i=t.length;e<i;e++){var n=t[e];n&&Se(this.el,n,ct)}this.prevKeys=t},cleanup:function(t){var e=this.prevKeys;if(e)for(var i=e.length;i--;){var n=e[i];(!t||t.indexOf(n)<0)&&Se(this.el,n,ut)}}},Rs={priority:es,params:["keep-alive","transition-mode","inline-template"],bind:function(){this.el.__vue__||(this.keepAlive=this.params.keepAlive,this.keepAlive&&(this.cache={}),this.params.inlineTemplate&&(this.inlineTemplate=ft(this.el,!0)),this.pendingComponentCb=this.Component=null,this.pendingRemovals=0,this.pendingRemovalCb=null,this.anchor=mt("v-component"),st(this.el,this.anchor),this.el.removeAttribute("is"),this.el.removeAttribute(":is"),this.descriptor.ref&&this.el.removeAttribute("v-ref:"+u(this.descriptor.ref)),this.literal&&this.setComponent(this.expression))},update:function(t){this.literal||this.setComponent(t)},setComponent:function(t,e){if(this.invalidatePending(),t){var i=this;this.resolveComponent(t,function(){i.mountComponent(e)})}else this.unbuild(!0),this.remove(this.childVM,e),this.childVM=null},resolveComponent:function(t,e){var i=this;this.pendingComponentCb=w(function(n){i.ComponentName=n.options.name||("string"==typeof t?t:null),i.Component=n,e()}),this.vm._resolveComponent(t,this.pendingComponentCb)},mountComponent:function(t){this.unbuild(!0);var e=this,i=this.Component.options.activate,n=this.getCached(),r=this.build();i&&!n?(this.waitingFor=r,Fe(i,r,function(){e.waitingFor===r&&(e.waitingFor=null,e.transition(r,t))})):(n&&r._updateRef(),this.transition(r,t))},invalidatePending:function(){this.pendingComponentCb&&(this.pendingComponentCb.cancel(),this.pendingComponentCb=null)},build:function(t){var e=this.getCached();if(e)return e;if(this.Component){var i={name:this.ComponentName,el:le(this.el),template:this.inlineTemplate,parent:this._host||this.vm,_linkerCachable:!this.inlineTemplate,_ref:this.descriptor.ref,_asComponent:!0,_isRouterView:this._isRouterView,_context:this.vm,_scope:this._scope,_frag:this._frag};t&&v(i,t);var n=new this.Component(i);return this.keepAlive&&(this.cache[this.Component.cid]=n),n}},getCached:function(){return this.keepAlive&&this.cache[this.Component.cid]},unbuild:function(t){this.waitingFor&&(this.keepAlive||this.waitingFor.$destroy(),this.waitingFor=null);var e=this.childVM;return!e||this.keepAlive?void(e&&(e._inactive=!0,e._updateRef(!0))):void e.$destroy(!1,t)},remove:function(t,e){var i=this.keepAlive;if(t){this.pendingRemovals++,this.pendingRemovalCb=e;var n=this;t.$remove(function(){n.pendingRemovals--,i||t._cleanup(),!n.pendingRemovals&&n.pendingRemovalCb&&(n.pendingRemovalCb(),n.pendingRemovalCb=null)})}else e&&e()},transition:function(t,e){var i=this,n=this.childVM;switch(n&&(n._inactive=!0),t._inactive=!1,this.childVM=t,i.params.transitionMode){case"in-out":t.$before(i.anchor,function(){i.remove(n,e)});break;case"out-in":i.remove(n,function(){t.$before(i.anchor,e)});break;default:i.remove(n),t.$before(i.anchor,e)}},unbind:function(){if(this.invalidatePending(),this.unbuild(),this.cache){for(var t in this.cache)this.cache[t].$destroy();this.cache=null}}},Ls=Mn._propBindingModes,Hs={},Is=/^[$_a-zA-Z]+[\w$]*$/,Ms=Mn._propBindingModes,Ws={bind:function(){var t=this.vm,e=t._context,i=this.descriptor.prop,n=i.path,r=i.parentPath,s=i.mode===Ms.TWO_WAY,o=this.parentWatcher=new re(e,r,function(e){He(t,i,e)},{twoWay:s,filters:i.filters,scope:this._scope});if(Le(t,i,o.value),s){var a=this;t.$once("pre-hook:created",function(){a.childWatcher=new re(t,n,function(t){o.set(t)},{sync:!0})})}},unbind:function(){this.parentWatcher.teardown(),this.childWatcher&&this.childWatcher.teardown()}},Vs=[],Bs=!1,zs="transition",Us="animation",Js=nn+"Duration",qs=sn+"Duration",Qs=Gi&&window.requestAnimationFrame,Gs=Qs?function(t){Qs(function(){Qs(t)})}:function(t){setTimeout(t,50)},Zs=Ue.prototype;Zs.enter=function(t,e){this.cancelPending(),this.callHook("beforeEnter"),this.cb=e,ct(this.el,this.enterClass),t(),this.entered=!1,this.callHookWithCb("enter"),this.entered||(this.cancel=this.hooks&&this.hooks.enterCancelled,Be(this.enterNextTick))},Zs.enterNextTick=function(){var t=this;this.justEntered=!0,Gs(function(){t.justEntered=!1});var e=this.enterDone,i=this.getCssTransitionType(this.enterClass);this.pendingJsCb?i===zs&&ut(this.el,this.enterClass):i===zs?(ut(this.el,this.enterClass),this.setupCssCb(rn,e)):i===Us?this.setupCssCb(on,e):e()},Zs.enterDone=function(){this.entered=!0,this.cancel=this.pendingJsCb=null,ut(this.el,this.enterClass),this.callHook("afterEnter"),this.cb&&this.cb()},Zs.leave=function(t,e){this.cancelPending(),this.callHook("beforeLeave"),this.op=t,this.cb=e,ct(this.el,this.leaveClass),this.left=!1,this.callHookWithCb("leave"),this.left||(this.cancel=this.hooks&&this.hooks.leaveCancelled,this.op&&!this.pendingJsCb&&(this.justEntered?this.leaveDone():Be(this.leaveNextTick)))},Zs.leaveNextTick=function(){var t=this.getCssTransitionType(this.leaveClass);if(t){var e=t===zs?rn:on;this.setupCssCb(e,this.leaveDone)}else this.leaveDone()},Zs.leaveDone=function(){this.left=!0,this.cancel=this.pendingJsCb=null,this.op(),ut(this.el,this.leaveClass),this.callHook("afterLeave"),this.cb&&this.cb(),this.op=null},Zs.cancelPending=function(){this.op=this.cb=null;var t=!1;this.pendingCssCb&&(t=!0,at(this.el,this.pendingCssEvent,this.pendingCssCb),this.pendingCssEvent=this.pendingCssCb=null),this.pendingJsCb&&(t=!0,this.pendingJsCb.cancel(),this.pendingJsCb=null),t&&(ut(this.el,this.enterClass),ut(this.el,this.leaveClass)),this.cancel&&(this.cancel.call(this.vm,this.el),this.cancel=null)},Zs.callHook=function(t){this.hooks&&this.hooks[t]&&this.hooks[t].call(this.vm,this.el)},Zs.callHookWithCb=function(t){var e=this.hooks&&this.hooks[t];e&&(e.length>1&&(this.pendingJsCb=w(this[t+"Done"])),e.call(this.vm,this.el,this.pendingJsCb))},Zs.getCssTransitionType=function(t){if(!(!rn||document.hidden||this.hooks&&this.hooks.css===!1||Je(this.el))){var e=this.type||this.typeCache[t];if(e)return e;var i=this.el.style,n=window.getComputedStyle(this.el),r=i[Js]||n[Js];if(r&&"0s"!==r)e=zs;else{var s=i[qs]||n[qs];s&&"0s"!==s&&(e=Us)}return e&&(this.typeCache[t]=e),e}},Zs.setupCssCb=function(t,e){this.pendingCssEvent=t;var i=this,n=this.el,r=this.pendingCssCb=function(s){s.target===n&&(at(n,t,r),i.pendingCssEvent=i.pendingCssCb=null,!i.pendingJsCb&&e&&e())};ot(n,t,r)};var Xs={priority:Kr,update:function(t,e){var i=this.el,n=jt(this.vm.$options,"transitions",t);t=t||"v",e=e||"v",i.__v_trans=new Ue(i,t,n,this.vm),ut(i,e+"-transition"),ct(i,t+"-transition")}},Ys={style:$s,class:Ps,component:Rs,prop:Ws,transition:Xs},Ks=/^v-bind:|^:/,to=/^v-on:|^@/,eo=/^v-([^:]+)(?:$|:(.*)$)/,io=/\.[^\.]+/g,no=/^(v-bind:|:)?transition$/,ro=1e3,so=2e3;ui.terminal=!0;var oo=/[^\w\-:\.]/,ao=Object.freeze({compile:qe,compileAndLinkProps:Ye,compileRoot:Ke,transclude:_i,resolveSlots:Ci}),ho=/^v-on:|^@/;Oi.prototype._bind=function(){var t=this.name,e=this.descriptor;if(("cloak"!==t||this.vm._isCompiled)&&this.el&&this.el.removeAttribute){var i=e.attr||"v-"+t;this.el.removeAttribute(i)}var n=e.def;if("function"==typeof n?this.update=n:v(this,n),this._setupParams(),this.bind&&this.bind(),this._bound=!0,this.literal)this.update&&this.update(e.raw);else if((this.expression||this.modifiers)&&(this.update||this.twoWay)&&!this._checkStatement()){var r=this;this.update?this._update=function(t,e){r._locked||r.update(t,e)}:this._update=Ai;var s=this._preProcess?p(this._preProcess,this):null,o=this._postProcess?p(this._postProcess,this):null,a=this._watcher=new re(this.vm,this.expression,this._update,{filters:this.filters,twoWay:this.twoWay,deep:this.deep,preProcess:s,postProcess:o,scope:this._scope});this.afterBind?this.afterBind():this.update&&this.update(a.value)}},Oi.prototype._setupParams=function(){if(this.params){var t=this.params;this.params=Object.create(null);for(var e,i,n,r=t.length;r--;)e=u(t[r]),n=l(e),i=K(this.el,e),null!=i?this._setupParamWatcher(n,i):(i=Y(this.el,e),null!=i&&(this.params[n]=""===i||i))}},Oi.prototype._setupParamWatcher=function(t,e){var i=this,n=!1,r=(this._scope||this.vm).$watch(e,function(e,r){if(i.params[t]=e,n){var s=i.paramWatchers&&i.paramWatchers[t];s&&s.call(i,e,r)}else n=!0},{immediate:!0,user:!1});(this._paramUnwatchFns||(this._paramUnwatchFns=[])).push(r)},Oi.prototype._checkStatement=function(){var t=this.expression;if(t&&this.acceptStatement&&!Kt(t)){var e=Yt(t).get,i=this._scope||this.vm,n=function(t){i.$event=t,e.call(i,i),i.$event=null};return this.filters&&(n=i._applyFilters(n,null,this.filters)),this.update(n),!0}},Oi.prototype.set=function(t){this.twoWay&&this._withLock(function(){this._watcher.set(t)})},Oi.prototype._withLock=function(t){var e=this;e._locked=!0,t.call(e),ln(function(){e._locked=!1})},Oi.prototype.on=function(t,e,i){ot(this.el,t,e,i),(this._listeners||(this._listeners=[])).push([t,e])},Oi.prototype._teardown=function(){if(this._bound){this._bound=!1,this.unbind&&this.unbind(),this._watcher&&this._watcher.teardown();var t,e=this._listeners;if(e)for(t=e.length;t--;)at(this.el,e[t][0],e[t][1]);var i=this._paramUnwatchFns;if(i)for(t=i.length;t--;)i[t]();this.vm=this.el=this._watcher=this._listeners=null}};var lo=/[^|]\|[^|]/;Ht(Di),ki(Di),xi(Di),Ti(Di),Ni(Di),ji(Di),Ei(Di),Si(Di),Fi(Di);var co={priority:ss,params:["name"],bind:function(){var t=this.params.name||"default",e=this.vm._slotContents&&this.vm._slotContents[t];e&&e.hasChildNodes()?this.compile(e.cloneNode(!0),this.vm._context,this.vm):this.fallback()},compile:function(t,e,i){if(t&&e){if(this.el.hasChildNodes()&&1===t.childNodes.length&&1===t.childNodes[0].nodeType&&t.childNodes[0].hasAttribute("v-if")){var n=document.createElement("template");n.setAttribute("v-else",""),n.innerHTML=this.el.innerHTML,n._context=this.vm,t.appendChild(n)}var r=i?i._scope:this._scope;this.unlink=e.$compile(t,i,r,this._frag)}t?st(this.el,t):nt(this.el)},fallback:function(){this.compile(ft(this.el,!0),this.vm)},unbind:function(){this.unlink&&this.unlink()}},uo={priority:is,params:["name"],paramWatchers:{name:function(t){hs.remove.call(this),t&&this.insert(t)}},bind:function(){this.anchor=mt("v-partial"),st(this.el,this.anchor),this.insert(this.params.name)},insert:function(t){var e=jt(this.vm.$options,"partials",t,!0);e&&(this.factory=new _e(this.vm,e),hs.insert.call(this))},unbind:function(){this.frag&&this.frag.destroy()}},fo={slot:co,partial:uo},po=as._postProcess,vo=/(\d{3})(?=\d)/g,mo={orderBy:Li,filterBy:Ri,limitBy:Pi,json:{read:function(t,e){return"string"==typeof t?t:JSON.stringify(t,null,arguments.length>1?e:2)},write:function(t){try{return JSON.parse(t)}catch(e){return t}}},capitalize:function(t){return t||0===t?(t=t.toString(),t.charAt(0).toUpperCase()+t.slice(1)):""},uppercase:function(t){return t||0===t?t.toString().toUpperCase():""},lowercase:function(t){return t||0===t?t.toString().toLowerCase():""},currency:function(t,e,i){if(t=parseFloat(t),!isFinite(t)||!t&&0!==t)return"";e=null!=e?e:"$",i=null!=i?i:2;var n=Math.abs(t).toFixed(i),r=i?n.slice(0,-1-i):n,s=r.length%3,o=s>0?r.slice(0,s)+(r.length>3?",":""):"",a=i?n.slice(-1-i):"",h=t<0?"-":"";return h+e+o+r.slice(s).replace(vo,"$1,")+a},pluralize:function(t){var e=d(arguments,1),i=e.length;if(i>1){var n=t%10-1;return n in e?e[n]:e[i-1]}return e[0]+(1===t?"":"s")},debounce:function(t,e){if(t)return e||(e=300),y(t,e)}};return Ii(Di),Di.version="1.0.28",setTimeout(function(){Mn.devtools&&Zi&&Zi.emit("init",Di)},0),Di});


/*!
 *
 * MobileAPI.js
 *
 */
(function(window, undefined) {
    window.App = {};
    /**
     * variables
     */
    var ua = navigator.userAgent.toUpperCase(), callindex = 0;
    // Android
    App.IS_ANDROID = ua.indexOf('ANDROID') != -1;
    // IOS
    App.IS_IOS = ua.indexOf('IPHONE OS') != -1 || ua.indexOf('IPAD') != -1;

    App.IS_WEICHAT = ua.indexOf("MICROMESSENGER") != -1;

    App.setSidUmid = function(userInfo){
        window.localStorage.setItem('userInfo', JSON.stringify(userInfo));
        App.sid = userInfo.sid;
        App.umId = userInfo.umId;
    };


    /**
     * Callback native method
     * @param {String} name (Method Name)
     */

    App.call = function(name) {
        // Native parameters
        var args = Array.prototype.slice.call(arguments, 1);
        var callback = '', item = null;
        // parameters
        for ( var i = 0, len = args.length; i < len; i++) {
            item = args[i];
            if (item === "undefined") {
                item = '';
            }

            // Parameter is Function,Function save as window object, Native get function name
            if (typeof (item) == 'function') {
                callback = name + 'Callback' + i;
                window[callback] = item;
                item = callback;
            }
            args[i] = item;
        }

        // Android
        if (App.IS_ANDROID) {
            if (name == "setTitle") {
                return;
            }
            try {
                for ( i = 0, len = args.length; i < len; i++) {
                    // args[i] = '"' + args[i] + '"';
                    args[i] = (args[i]+"").replace(/'/g,"\\'");
                    args[i] = '\'' + args[i] + '\'';
                }
                eval('window.android.' + name + '(' + args.join(',') + ')');
            } catch (e) {
            }

        } else if (App.IS_IOS) {// IOS
            if (args.length) {
                args = '|' + args.join('|');
            }

            // IOS location.href callback native method
            callindex++;

            //location.href = '#ios:' + name + args + '|' + callindex;(
            var iframe = document.createElement("iframe");
            iframe.src = '#ios:' + name + args + '|' + callindex;
            iframe.style.display = "none";
            document.body.appendChild(iframe);
            iframe.parentNode.removeChild(iframe);
            iframe= null;
        }
    };
}(window));

/*!
 *
 * SCORM12Adapter.js
 *
 */
var _Debug = false;
var _NoError = 0;
var _GeneralException = 101;
var _ServerBusy = 102;
var _InvalidArgumentError = 201;
var _ElementCannotHaveChildren = 202;
var _ElementIsNotAnArray = 203;
var _NotInitialized = 301;
var _NotImplementedError = 401;
var _InvalidSetValue = 402;
var _ElementIsReadOnly = 403;
var _ElementIsWriteOnly = 404;
var _IncorrectDataType = 405;
var apiHandle = null;
var API = null;
var findAPITries = 0;
var startDate;
var exitPageStatus;

function doLMSInitialize(){
    var api = getAPIHandle();
    if (api == null) {
        return "false";
    }
    var result = api.LMSInitialize("");
    if (result.toString() != "true") {
        var err = ErrorHandler();
    }
    return result.toString();
}
function doLMSFinish(){
    var api = getAPIHandle();
    if (api == null) {
        return "false";
    }else{
        var result = api.LMSFinish("");
        if (result.toString() != "true"){
            var err = ErrorHandler();
        }
    }
    return result.toString();
}
function doLMSGetValue(name){
    var api = getAPIHandle();
    if (api == null) {
        return "";
    }else{
        var value = api.LMSGetValue(name);
        var errCode = api.LMSGetLastError().toString();
        if (errCode != _NoError) {
            var errDescription = api.LMSGetErrorString(errCode);
            return "";
        } else {
            return value.toString();
        }
    }
}
function doLMSSetValue(name, value){
    var api = getAPIHandle();
    if (api == null) {
        return;
    }else{
        var result = api.LMSSetValue(name, value);
        if (result.toString() != "true"){
            var err = ErrorHandler();
        }
    }
    return;
}
function doLMSCommit(){
    var api = getAPIHandle();
    if (api == null) {
        return "false";
    }else{
        var result = api.LMSCommit("");
        if (result != "true") {
            var err = ErrorHandler();
        }
    }
    return result.toString();
}
function doLMSGetLastError(){
    var api = getAPIHandle();
    if (api == null){
        return _GeneralError;
    }
    return api.LMSGetLastError().toString();
}
function doLMSGetErrorString(errorCode){
    var api = getAPIHandle();
    if (api == null){
    }
    return api.LMSGetErrorString(errorCode).toString();
}
function doLMSGetDiagnostic(errorCode){
    var api = getAPIHandle();
    if (api == null) {
    }
    return api.LMSGetDiagnostic(errorCode).toString();
}
function LMSIsInitialized(){
    var api = getAPIHandle();
    if (api == null){
        return false;
    }else{
        var value = api.LMSGetValue("cmi.core.student_name");
        var errCode = api.LMSGetLastError().toString();
        if (errCode == _NotInitialized){
            return false;
        } else {
            return true;
        }
    }
}
function ErrorHandler(){
    var api = getAPIHandle();
    if (api == null){
        return;
    }
    var errCode = api.LMSGetLastError().toString();
    if (errCode != _NoError) {
        var errDescription = api.LMSGetErrorString(errCode);
        if (_Debug == true) {
            errDescription += "\n";
            errDescription += api.LMSGetDiagnostic(null);
        }
    }
    return errCode;
}
function getAPIHandle(){
    if (apiHandle == null) {
        apiHandle = getAPI();
    }
    return apiHandle;
}
function findAPI(win){
    while ((win.API == null) && (win.parent != null) && (win.parent != win)) {
        findAPITries++;
        if (findAPITries > 7)  {
            return null;
        }
        win = win.parent;
    }
    return win.API;
}
function getAPI(){
    var theAPI = findAPI(window);
    if ((theAPI == null) && (window.opener != null) && (typeof(window.opener) != "undefined")) {
        theAPI = findAPI(window.opener);
    }
    if (theAPI == null) {
    }
    return theAPI
}
function loadPage(){
    var result = doLMSInitialize();
    var status = doLMSGetValue( "cmi.core.lesson_status" );
    if (status == "not attempted") {
        // the student is now attempting the lesson
        doLMSSetValue( "cmi.core.lesson_status", "incomplete" );
    }
    exitPageStatus = false;
    startTimer();
}
function startTimer(){
    startDate = new Date().getTime();
}
function computeTime(){
    if ( startDate != 0 ){
        var currentDate = new Date().getTime();
        var elapsedSeconds = ( (currentDate - startDate) / 1000 );
        var formattedTime = convertTotalSeconds( elapsedSeconds );
    }else {
        formattedTime = "00:00:00.0";
    }
    doLMSSetValue( "cmi.core.session_time", formattedTime );
}
function doBack(){
    doLMSSetValue( "cmi.core.exit", "suspend" );
    computeTime();
    exitPageStatus = true;
    var result;
    result = doLMSCommit();
    result = doLMSFinish();
}
function doContinue( status ){
    // Reinitialize Exit to blank
    doLMSSetValue( "cmi.core.exit", "" );
    var mode = doLMSGetValue( "cmi.core.lesson_mode" );
    if ( mode != "review"  &&  mode != "browse" ) {
        doLMSSetValue( "cmi.core.lesson_status", status );
    }
    computeTime();
    exitPageStatus = true;
    var result;
    result = doLMSCommit();
    result = doLMSFinish();
}
function doQuit( status ){
    computeTime();
    exitPageStatus = true;
    var result;
    result = doLMSCommit();
    result = doLMSSetValue("cmi.core.lesson_status", status);
    result = doLMSFinish();
}
function unloadPage( status ){
    if (exitPageStatus != true){
        doQuit( status );
    }
}
function convertTotalSeconds(ts){
    var sec = (ts % 60);
    ts -= sec;
    var tmp = (ts % 3600);
    ts -= tmp;
    sec = Math.round(sec*100)/100;
    var strSec = new String(sec);
    var strWholeSec = strSec;
    var strFractionSec = "";
    if (strSec.indexOf(".") != -1) {
        strWholeSec =  strSec.substring(0, strSec.indexOf("."));
        strFractionSec = strSec.substring(strSec.indexOf(".")+1, strSec.length);
    }
    if (strWholeSec.length < 2) {
        strWholeSec = "0" + strWholeSec;
    }
    strSec = strWholeSec;
    if (strFractionSec.length) {
        strSec = strSec+ "." + strFractionSec;
    }
    if ((ts % 3600) != 0 )
        var hour = 0;
    else var hour = (ts / 3600);
    if ( (tmp % 60) != 0 )
        var min = 0;
    else var min = (tmp / 60);

    if ((new String(hour)).length < 2)
        hour = "0"+hour;
    if ((new String(min)).length < 2)
        min = "0"+min;

    var rtnVal = hour+":"+min+":"+strSec;
    return rtnVal;
}


/*!
 *
 * 我的代码.js
 *
 */
Vue.component('textComp', {
    props: ['component'],
    template: '<div :style="compStyle" class="textComponent">{{{component.text}}}</div>',
    computed:{
        compStyle:function(){
            return{
                "opacity":this.component.compStyle.opacity,
            }
        }
    }
});

Vue.component('wordComp', {
    props: ['component'],
    template: '<div :id="component.unique" class="wordEdit" :style="component.textStyle" v-html="decodeText"></div>',
    computed:{
        decodeText: function () {
            return this.component.text.replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/&lt;br&gt;/g,'<br>').replace(/ /g,'&nbsp;');
        },
    }
});

Vue.component('pictureComp', {
    props: ['component','isLoadResource','pageData'],
    template: '\
    <div v-if="component.clipStyle && component.filterStyle" class="pictureComponent" :style="compStyle">\
        <svg :id="\'presvg\'+component.unique" :style="svgSize">\
            <defs>\
                <clipPath v-if=type=="rect" :id="\'clipPath\'+component.unique" clipPathUnits="objectBoundingBox" v-html="clipInfo[type].cPath"></clipPath>\
                <clipPath v-else :id="\'clipPath\'+component.unique" clipPathUnits="userSpaceOnUse" v-html="clipInfo[type].cPath"></clipPath>\
            </defs>\
            <image :xlink:href=\'"'+userResource+'"+component.pictureLzkSrc\' :clip-path="\'url(#clipPath\'+component.unique+\')\'" :x="sizeInfo.imgX" :y="sizeInfo.imgY" :width="sizeInfo.imgW" :height="sizeInfo.imgH"></image>\
            <rect :clip-path="\'url(#clipPath\'+component.unique+\')\'" :x="sizeInfo.imgX" :y="sizeInfo.imgY" :width="sizeInfo.imgW" :height="sizeInfo.imgH" :style={"mix-blend-mode":component.filterStyle.mixBlendMode} :fill="component.filterStyle.background"></rect>\
            <g v-html="clipInfo[type].gPath"></g>\
        </svg>\
    </div>\
    <img v-show="!(component.clipStyle && component.filterStyle)" class="pictureComponent" :style={opacity:component.compStyle.opacity,borderRadius:component.compStyle.border_radius,transform:"scaleX("+component.compStyle.turn+")"} ondragstart="return false;" :src=isLoadResource?"'+userResource+'"+component.pictureLzkSrc:null  @load="loadSuccess" @error="loadError"/>',
    data: function () {
        return {
            clipInfo:{
                rect: {
                    width: 1,
                    height: 1,
                    cPath: '<rect x="0" y="0" width="1" height="1"></rect>',
                },
                peach: {
                    width: 640,
                    height: 552,
                    cPath: '<path d="M320.35,120.63C237.52-70.78,2.05-26.11.5,196c-.86,122,112.12,167.62,187.35,216.4,72.94,47.31,124.86,112,133,139.56,7-27,64.79-93.53,132.31-140.89C527,359.34,641.36,316.73,640.5,194.72,638.94-28,399.38-63.14,320.35,120.63Z"></path>',
                    gPath: '<path d="M313.86,137.3S272,63.81,191.2,58.36c.71-.06-93.77-10.1-126.64,100.92-2.33,6.54-27.28,85.87,22.27,142.31-3.37-3.83,17.34,23.62,60.83,49.5,10.61,6.31,23,14.74,38.76,24,12.92,8.64,63.64,42.46,87.56,68.93,10.59,11.72,32.43,35.33,43.88,52,.39,1.56-.17,25.83,0,26C310,508.75,290.31,483.53,272,467c-5.34-7-31.92-32.74-69.8-57-21.74-13.9-50-30.37-71.8-44-47-29.38-64.18-48.53-65.82-50-4-3.5-52.85-47-45.87-124.91,1.2-8.38,3.66-95.24,69.22-141,23.53-18.24,92-49.86,158.6-2,25.8,18.55,50.47,50.64,60.74,69.62C313.61,129.64,313.86,137.3,313.86,137.3Z" fill="#fff"></path><path d="M324,137.59s41.82-73.44,122.69-78.88c-.7-.06,93.76-10.09,126.69,100.8,2.33,6.53,27.28,85.8-22.27,142.2,3.37-3.83-17.35,23.6-60.85,49.47-10.61,6.31-23,14.73-38.77,24-12.92,8.64-63.66,42.43-87.58,68.88-10.6,11.71-31.66,35.28-43.11,51.9-.77,15.33-.58,18.82-1,26,6.6-10.67,27.77-38.46,46.1-54.92,5.34-7,31.93-32.71,69.83-56.91,21.74-13.89,50.06-30.35,71.82-43.93,47-29.36,64.2-48.5,65.84-49.92,4-3.49,52.87-46.93,45.89-124.81-1.2-8.38-3.66-95.17-69.24-140.92C526.55,32.33,458,.72,391.44,48.55c-25.81,18.54-50.48,50.6-60.76,69.57C324.29,129.93,324,137.59,324,137.59Z" fill="#fff"></path>'
                },
                scaldfish_1:{
                    width:300,
                    height:190,
                    cPath:'<path d="M0,131.8V58.1c0-8.2,6.6-14.9,14.8-15h0.9c2.6,0,4.7-2.1,4.7-4.8V21.6h16.6c2.6,0,4.7-2.2,4.7-4.8v-0.9C41.7,7.2,48.8,0.1,57.5,0h185c8.7,0.1,15.8,7.2,15.7,15.9v0.9c0,2.6,2.1,4.7,4.7,4.8h16.6v16.8c0,2.6,2.1,4.7,4.7,4.8h0.9c8.2,0.1,14.9,6.8,14.8,15v73.7c0,8.2-6.6,14.9-14.8,15h-0.9c-2.6,0-4.7,2.2-4.7,4.8v16.8h-16.6c-2.6,0-4.7,2.2-4.7,4.8c0,0,0,0,0,0v0.9c0.1,8.7-7,15.9-15.7,15.9h-185c-8.7-0.1-15.8-7.2-15.7-15.9v-0.9c0-2.6-2.1-4.8-4.7-4.8H20.4v-16.8c0-2.6-2.1-4.7-4.7-4.8h-0.9C6.6,146.8,0,140.1,0,131.8z"></path>'
                },
                scaldfish_2:{
                    width:300,
                    height:168,
                    cPath:'<path  d="M85,0v8.3c-16.6,4.5-31.5,10.6-44,18H26.3v10.2C9.7,50,0,66.4,0,84s9.7,34,26.3,47.5v10.2H41c12.5,7.4,27.4,13.6,44,18v8.3h130v-8.3c16.6-4.5,31.5-10.6,44-18h14.7v-10.2C290.3,118,300,101.6,300,84s-9.7-34-26.3-47.5V26.3H259c-12.5-7.4-27.4-13.6-44-18V0H85z"/>'
                },
                polygon_1:{
                    width:300,
                    height:308,
                    cPath:'<path d="M278.7,164.7c15.8-14.3,26.6-32.1,18.5-51c-5.9-13.5-18.2-20-32.7-22.2c5.6-20.8,5.3-41.8-11.6-53.1c-12.1-8.1-25.9-6.6-39.2-0.4c-6.4-20.6-17.8-38-38-38c-12.9,0-22.8,7.1-30.5,17.6C130.5,5.3,113.8-1.6,97.8,7.8c-12.5,7.4-17.5,20.7-18.2,35.6c-20.8-3.6-41.1-1-50.3,17.4c-6.6,13.2-3.7,27.1,3.7,40c-19.3,8.6-35,22.1-32.9,42.7c1.5,14.7,11.3,24.8,24.4,31.5c-11.6,18-17.6,38.1-4.9,54.1c9.1,11.5,22.7,14.5,37.2,12.8c-0.2,21.6,5.5,41.8,24.6,48.2c13.7,4.6,26.7-0.5,38-10c11.3,18.2,26.8,32,46.3,26.7c13.9-3.8,22.1-15.3,26.6-29.6c19.2,9,39.5,11.9,53-3.5c9.7-11,10.4-25.2,6.5-39.7c20.9-3.2,39.4-12.1,42.6-32.5C296.6,187,289.7,174.7,278.7,164.7z"/>'
                },
                polygon_2:{
                    width:300,
                    height:212,
                    cPath:'<path d="M0,106l2.79-1.63A27.93,27.93,0,0,0,14.37,91.45,37.35,37.35,0,0,1,44.09,69.13,3.28,3.28,0,0,0,47,65.87V60.14A20.28,20.28,0,0,1,67.24,39.89h33.27a3.29,3.29,0,0,0,2.66-1.36c8.69-12.05,19.51-20.61,31.28-24.75a28.35,28.35,0,0,0,13.42-9.71q.87-1.16,1.62-2.13L151,0l1.49,1.94c.5.65,1,1.36,1.62,2.13a28.37,28.37,0,0,0,13.42,9.71c11.77,4.14,22.59,12.69,31.28,24.75a3.29,3.29,0,0,0,2.66,1.36h31.29A20.28,20.28,0,0,1,253,60.14v5.73a3.28,3.28,0,0,0,2.89,3.26,37.36,37.36,0,0,1,29.73,22.32,27.92,27.92,0,0,0,11.57,12.92L300,106l-2.79,1.63a27.91,27.91,0,0,0-11.57,12.92,37.36,37.36,0,0,1-29.73,22.32,3.29,3.29,0,0,0-2.89,3.26v5.73a20.28,20.28,0,0,1-20.26,20.25H201.47a3.29,3.29,0,0,0-2.66,1.36c-8.69,12.05-19.51,20.61-31.28,24.75a28.37,28.37,0,0,0-13.42,9.71c-.58.77-1.12,1.48-1.62,2.13L151,212l-1.5-1.94c-.5-.65-1-1.36-1.62-2.14a28.34,28.34,0,0,0-13.42-9.71c-11.77-4.14-22.59-12.69-31.28-24.75a3.29,3.29,0,0,0-2.66-1.36H67.24A20.28,20.28,0,0,1,47,151.86v-5.73a3.29,3.29,0,0,0-2.89-3.26,37.36,37.36,0,0,1-29.72-22.32A27.92,27.92,0,0,0,2.79,107.63Z" fill="#fff" opacity="0"/>'
                },
                science:{
                    width:300,
                    height:286,
                    cPath:'<ellipse style="fill:#FAFAFA;fill-opacity:0" cx="150" cy="142.9" rx="114.6" ry="114.5"/>',
                    gPath:'<path fill="#FAFAFA" d="M294.2,137.1c-0.9,0-1.7,0.2-2.5,0.6l-7.2-12.5l4.3-15.9c0.2,0,0.4,0.1,0.5,0.1c2.1,0,3.8-1.7,3.8-3.8s-1.7-3.8-3.8-3.8c-0.9,0-1.7,0.3-2.4,0.8l-24.6-24.6l-9-33.6c1.9-0.7,2.9-2.9,2.2-4.9c-0.7-1.9-2.9-2.9-4.9-2.2c-1,0.4-1.8,1.2-2.2,2.2l-15.9-4.2L225.4,23c2.7-1.8,3.4-5.4,1.6-8.1s-5.4-3.4-8.1-1.6c-1.5,1-2.4,2.6-2.5,4.4h-14.4L190.3,6.1c1.3-1.6,1-4-0.6-5.3s-4-1-5.3,0.6c-0.5,0.7-0.8,1.5-0.8,2.4c0,0.2,0,0.4,0.1,0.5l-33.6,9l-33.6-9c0-0.2,0.1-0.4,0.1-0.5c0-2.1-1.7-3.8-3.8-3.8s-3.8,1.7-3.8,3.8c0,0.9,0.3,1.7,0.8,2.4L98.1,17.8H83.7c-0.2-3.2-3-5.6-6.2-5.3c-3.2,0.2-5.6,3-5.3,6.2c0.1,1.8,1.1,3.4,2.5,4.4l-7.2,12.4l-15.9,4.2c-0.7-2-2.9-2.9-4.9-2.2c-2,0.7-2.9,2.9-2.2,4.9c0.4,1,1.2,1.8,2.2,2.2l-9,33.6l-24.6,24.6c-1.6-1.3-4-1.1-5.4,0.5c-1.3,1.6-1.1,4,0.5,5.4c0.9,0.7,2,1,3.1,0.8l4.3,15.9l-7.2,12.5c-2.9-1.4-6.4-0.2-7.8,2.7s-0.2,6.4,2.7,7.8c1.6,0.8,3.5,0.8,5.1,0l7.2,12.5l-4.3,15.9c-0.2,0-0.4-0.1-0.5-0.1c-2.1,0-3.8,1.7-3.8,3.8c0,2.1,1.7,3.8,3.8,3.8c0.9,0,1.7-0.3,2.4-0.8l24.6,24.6l9,33.6c-1.9,0.8-2.9,3-2.1,4.9c0.8,1.9,3,2.9,4.9,2.1c1-0.4,1.7-1.1,2.1-2.1l15.9,4.3l7.2,12.4c-2.7,1.8-3.4,5.4-1.6,8.1c1.8,2.7,5.4,3.4,8.1,1.6c1.5-1,2.4-2.6,2.5-4.4h14.4l11.6,11.6c-1.3,1.6-1.1,4,0.5,5.4c1.6,1.3,4,1.1,5.4-0.5c0.7-0.9,1-2,0.8-3.1l33.6-9l33.6,9c0,0.2-0.1,0.4-0.1,0.5c0,2.1,1.7,3.8,3.8,3.8c2.1,0,3.8-1.7,3.8-3.8c0-0.9-0.3-1.7-0.8-2.4l11.6-11.6h14.4c0.2,3.2,3,5.6,6.2,5.3c3.2-0.2,5.6-3,5.3-6.2c-0.1-1.8-1.1-3.4-2.5-4.4l7.2-12.4l15.9-4.2c0.8,1.9,3,2.9,4.9,2.1c1.9-0.8,2.9-3,2.1-4.9c-0.4-1-1.2-1.7-2.1-2.1l9-33.6l24.6-24.6c1.6,1.3,4,1.1,5.4-0.5c1.3-1.6,1.1-4-0.5-5.4c-0.9-0.7-2-1-3.1-0.8l-4.3-15.9l7.2-12.5c2.9,1.4,6.4,0.2,7.8-2.7s0.2-6.4-2.7-7.8C295.9,137.3,295,137.1,294.2,137.1L294.2,137.1z M286.3,103.3c-1.3,1.6-1,4,0.6,5.3c0.3,0.2,0.6,0.4,1,0.6l-4,15l-17.1-29.5l-4-14.8L286.3,103.3z M265.9,190.9l-16.4,28.3l-35.1,35.1l-48,12.9h-32.8l-48-12.9l-35.1-35.1l-16.4-28.4l-12.9-48l12.9-48l16.4-28.3l35.1-35.1l48-12.9h32.8l48,12.9l35.2,35.1L265.9,95l12.9,48L265.9,190.9z M279.3,144.6l4.3,15.9L267.6,188L279.3,144.6zM265.1,194.2l-3.5,13.1l-9.6,9.6L265.1,194.2z M247.9,222.2L232,249.7l-15.9,4.3L247.9,222.2z M213.2,255.6l-11.6,11.6h-31.8L213.2,255.6z M163.1,268.1l-13.1,3.5l-13.1-3.5L163.1,268.1z M130.3,267.3H98.5l-11.6-11.6L130.3,267.3z M83.9,254L68,249.7l-15.9-27.5L83.9,254z M48.1,216.9l-9.6-9.6L35,194.2L48.1,216.9z M32.4,188l-15.9-27.5l4.3-15.9L32.4,188z M20.8,141.3l-4.3-15.9l15.9-27.5L20.8,141.3z M35,91.7l3.5-13.1l9.6-9.6L35,91.7z M52.2,63.7L68,36.2l15.9-4.3L52.2,63.7z M86.8,30.3l11.6-11.6h31.8L86.8,30.3z M136.9,17.8l13.1-3.5l13.1,3.5H136.9z M169.8,18.6h31.8l11.6,11.6L169.8,18.6z M216.1,31.9l15.9,4.3l15.9,27.5L216.1,31.9z M252,69l9.6,9.6l3.5,13.1L252,69z M267.6,97.9l15.9,27.5l-4.3,15.9L267.6,97.9z M248.2,40.5c-0.3,2,1,3.9,3,4.2c0.4,0.1,0.8,0.1,1.2,0l8.6,32.2l-10.8-10.9l-17.1-29.5L248.2,40.5z M216.3,18.6c0.2,3.2,2.9,5.6,6.1,5.4c0.8,0,1.5-0.2,2.2-0.6l6.8,11.7l-16.5-4.4l-12.1-12.1H216.3z M183.8,5.2c0.7,1.9,2.9,2.9,4.9,2.1c0.4-0.1,0.7-0.3,1-0.6l11,11h-34.2l-14.8-4L183.8,5.2zM110.4,6.8c1.6,1.3,4,1,5.3-0.6c0.2-0.3,0.4-0.6,0.6-1l32.1,8.6l-14.8,4H99.4L110.4,6.8z M75.4,23.4c2.9,1.4,6.3,0.2,7.7-2.6c0.3-0.7,0.5-1.4,0.6-2.2h13.5L85.2,30.7l-16.5,4.4L75.4,23.4z M47.6,44.8c2,0.4,3.9-1,4.3-3c0.1-0.4,0.1-0.8,0-1.3l15-4L49.8,66.1L38.9,76.9L47.6,44.8z M12.2,109.1c1.9-0.7,2.9-2.9,2.1-4.8c-0.1-0.4-0.3-0.7-0.6-1l23.5-23.5l-4,14.8l-17.1,29.6L12.2,109.1zM9.1,147.7c2.7-1.8,3.3-5.4,1.5-8.1c-0.4-0.6-0.9-1.1-1.5-1.5l6.8-11.7l4.4,16.5l-4.4,16.5L9.1,147.7z M13.7,182.5c1.3-1.6,1-4-0.6-5.3c-0.3-0.2-0.6-0.4-1-0.6l4-15l17.1,29.6l4,14.8L13.7,182.5z M51.8,245.3c0.4-2-1-3.9-3-4.3c-0.4-0.1-0.9-0.1-1.3,0L38.9,209l10.8,10.8l17.1,29.6L51.8,245.3z M83.7,267.2c-0.2-3.2-2.9-5.6-6.1-5.4c-0.8,0-1.5,0.2-2.2,0.6l-6.8-11.7l16.5,4.4l12.1,12.1H83.7z M116.2,280.7c-0.8-1.9-2.9-2.9-4.9-2.1c-0.4,0.1-0.7,0.3-1,0.6l-11-11h34.2l14.8,4L116.2,280.7z M189.7,279.2c-1.6-1.3-4-1-5.3,0.6c-0.2,0.3-0.4,0.6-0.6,1l-32.1-8.6l14.8-4h34.2L189.7,279.2z M224.6,262.5c-2.9-1.4-6.3-0.2-7.7,2.6c-0.3,0.7-0.5,1.4-0.6,2.2h-13.5l12.1-12.1l16.5-4.4L224.6,262.5z M252.5,241.1c-2-0.4-3.9,1-4.3,3c-0.1,0.4-0.1,0.9,0,1.3l-15,4l17.1-29.6l10.8-10.9L252.5,241.1z M287.9,176.7c-1.9,0.8-2.9,2.9-2.1,4.9c0.1,0.4,0.3,0.7,0.6,1l-23.5,23.5l4-14.8l17.1-29.6L287.9,176.7z M284.1,159.5l-4.4-16.5l4.4-16.5l6.8,11.7c-2.7,1.8-3.3,5.4-1.5,8.1c0.4,0.6,0.9,1.1,1.5,1.5L284.1,159.5z"/>'
                },
                mac:{
                    width:300,
                    height:248,
                    cPath:'<path d="M13.76,12.83q136.33,0,272.66,0,0,76.28,0,152.56-136.34,0-272.67,0,0-76.27,0-152.53M286.34,165.22H13.65V12.75H286.34Z" fill="#e2f9ff" stroke="#ee695c" stroke-width="0.09" opacity="0"/>',
                    gPath:'<g><path d="M.06,4.51C-.08,2.42,1.38,0,3.62.06H296.23c2.33-.2,4,2.29,3.79,4.46q0,86.79,0,173.57H28.77c-9.53-.05-19.08.1-28.61-.08l-.11.08Q.06,91.3.06,4.51M13.7,12.81q0,76.27,0,152.53,136.33.08,272.67,0,0-76.28,0-152.56Q150,12.8,13.7,12.81Z" fill="#131f2d" stroke="#131f2d" stroke-width="0.09"/></g><g><path d="M126.36,203.5c16.73-.06,33.45,0,50.18,0,.43,4.26,1.06,8.48,1.6,12.72-16.58.06-33.17,0-49.75,0-1.29.11-3.17-.54-3.73,1.09C125.27,212.71,125.9,208.11,126.36,203.5Z" fill="#d1d2d4" stroke="#d1d2d4" stroke-width="0.09"/></g><g><path d="M.19,178c9.53.17,19.07,0,28.61.08H300q0,10.94,0,21.87a3.53,3.53,0,0,1-3.8,3.54q-59.85,0-119.7,0c-16.73,0-33.45,0-50.18,0q-61.34,0-122.68,0A3.48,3.48,0,0,1,.1,199.91c.06-7.3-.12-14.6.09-21.9m149.23,6.74a6.42,6.42,0,0,0-4.08,7.43,6.29,6.29,0,0,0,7.27,4.87,6.4,6.4,0,0,0,4.83-8.17A6.28,6.28,0,0,0,149.42,184.75Z" fill="#eceff5" stroke="#eceff5" stroke-width="0.09"/><path d="M124.65,217.3c.56-1.62,2.45-1,3.73-1.09,16.58,0,33.17,0,49.75,0,.53,4.62,1.3,9.22,2.19,13.78.55,2.51.95,5.4,3.16,7a22.21,22.21,0,0,0,8.25,3.77c1.76,1.2,4.11,1.73,5.26,3.67a3.16,3.16,0,0,1-3.14,3.57c-28.45,0-56.9,0-85.34,0-1.56-.31-3.54-2.36-2.32-4s3.31-2.05,4.88-3.23a21.77,21.77,0,0,0,5.66-2.07c2.3-1.09,4.56-2.87,5.1-5.54A143.87,143.87,0,0,0,124.65,217.3Z" fill="#eceff5" stroke="#eceff5" stroke-width="0.09"/></g><g><path d="M149.42,184.75a6.28,6.28,0,0,1,8,4.13,6.4,6.4,0,0,1-4.83,8.17,6.29,6.29,0,0,1-7.27-4.87A6.42,6.42,0,0,1,149.42,184.75Z" fill="#001647" stroke="#3d4a54" stroke-width="0.09"/></g>'
                },
                phone:{
                    width:300,
                    height:480,
                    cPath:'<path d="M22,43.91H279V423.12H22Z" fill="#fff" fill-rule="evenodd" opacity="0"/>',
                    gPath:'<path d="M270,0H30A30,30,0,0,0,0,29.94V450.06A30,30,0,0,0,30,480H270a30,30,0,0,0,30-29.94V29.94A30,30,0,0,0,270,0Zm9,423.12H22V43.91H279Z" fill="#fff" fill-rule="evenodd"/><path d="M149.91,441.94a10,10,0,1,1-10,10A10,10,0,0,1,149.91,441.94Z" fill="#aaa" fill-rule="evenodd"/><path d="M132.91,19.94h47a3,3,0,0,1,0,6h-47a3,3,0,0,1,0-6Z" fill="#aaa" fill-rule="evenodd"/><path d="M119.91,19.82a3,3,0,1,1-3,3A3,3,0,0,1,119.91,19.82Z" fill="#aaa" fill-rule="evenodd"/>'
                },
                circle:{
                    width:301,
                    height:301,
                    cPath:'<circle cx="150.5" cy="150.5" r="150" fill="#fff" stroke="#000" stroke-miterlimit="10" opacity="0"/>'
                },
                trigon:{
                    width:300,
                    height:262,
                    cPath:'<path d="M300.5,262.5H.5L149.4.5Z" transform="translate(-0.5 -0.5)" fill="none" opacity="0"/>'
                },
                pentagon:{
                    width:300,
                    height:286,
                    cPath:'<path d="M239.92,286H55L0,106.43,151.72,0,300,111Z" fill="#e2f9ff" opacity="0"/>'
                },
                pf1:{
                    width:300,
                    height:227,
                    cPath:'<rect width="300" height="227"/>',
                    gPath:'<path d="M286.9,113.76V66.31a.47.47,0,0,0-.36-.45.48.48,0,0,0-.52.25,3.78,3.78,0,0,1-3.88,1.76c-1.88-.18-2.83-1.54-2.83-4,0-1.46,1-3.63,2.2-6.39,2.41-5.38,5.71-12.76,5.71-22.6a20.65,20.65,0,0,0-3-11.33,2.59,2.59,0,0,0,1.83-.91,2.81,2.81,0,0,0,.62-2.28,3.12,3.12,0,0,0-.88-1.76,3.35,3.35,0,0,0-1.7-.81,2.79,2.79,0,0,0-2.27.62,2.59,2.59,0,0,0-.91,1.83,20.67,20.67,0,0,0-11.33-3c-9.86,0-17.23,3.3-22.62,5.71-2.75,1.24-4.92,2.2-6.38,2.2-2.49,0-3.85-.95-4-2.83a3.78,3.78,0,0,1,1.76-3.88.47.47,0,0,0-.21-.88H190.33v.94h46.46a5,5,0,0,0-1.15,3.92c.23,2.36,2,3.67,5,3.67,1.65,0,3.9-1,6.76-2.28,5.31-2.38,12.58-5.62,22.23-5.62,7.62,0,11.59,3.41,11.63,3.45a.47.47,0,0,0,.58,0,.49.49,0,0,0,.15-.56,1.78,1.78,0,0,1,.47-2,1.82,1.82,0,0,1,1.53-.41,2,2,0,0,1,1.14.67,2,2,0,0,1,.67,1.13,1.84,1.84,0,0,1-.41,1.54,1.78,1.78,0,0,1-2,.47.47.47,0,0,0-.56.15.47.47,0,0,0,0,.58s3.45,4,3.45,11.63c0,9.65-3.25,16.93-5.62,22.23-1.28,2.85-2.28,5.12-2.28,6.76,0,3,1.31,4.73,3.67,5A4.9,4.9,0,0,0,286,67.63v46.13Z" fill="#fff" fill-rule="evenodd"/><path d="M284,113.76V79.65s.38-3.41-1.24-3.41-10.63,2.41-10.63-9.69c0-10.7,12.1-15,12.1-31.79,0-4.5-1.62-4.41-1.62-4.41a7.62,7.62,0,0,1-5.13,1.94,5.3,5.3,0,0,1-3.69-1.6A5,5,0,0,1,272.16,27a7.14,7.14,0,0,1,1.94-5.11s.07-1.64-4.43-1.64c-16.82,0-21.08,12.1-31.77,12.1-12.1,0-9.69-9-9.69-10.63s-3.41-1.2-3.41-1.2H190.33v-.81h43c-2.71,0-4.11,3.49-4.11,5.35s.7,6.35,8.46,6.35c12.17,0,13.41-11.93,33.56-11.93,2.87,0,4.5,1.47,6.28,2.56s1.16,1.55,1.16,1.55c-3-1.25-5.68.74-5.65,3.48a3.93,3.93,0,0,0,1.4,3,4.74,4.74,0,0,0,3,1.4c2.86,0,4.73-2.64,3.48-5.66,0,0,.47-.62,1.55,1.17S285,30.35,285,33.22C285,53.38,273,54.61,273,66.78c0,7.75,4.5,8.44,6.35,8.44s5-1.39,5-4.1v42.64Z" fill="#fff" fill-rule="evenodd"/><path d="M155,8.55a8.68,8.68,0,0,0,2.34,6c2.47,2.46,6.32,3,9.12,3h23.92v.94H166.41c-3,0-7.07-.58-9.76-3.27A9.61,9.61,0,0,1,154,8.08V7.67l.41-.05a8.1,8.1,0,0,1,5.86,1.91c1.91,1.71,2.87,4.4,2.87,8,0,5.21-1.49,9.45-4.3,12.26A12.35,12.35,0,0,1,150,33.36v-.93c5.61,0,12.21-3.89,12.21-14.88,0-3.33-.87-5.79-2.57-7.31A7.11,7.11,0,0,0,155,8.55Z" fill="#fff" fill-rule="evenodd"/><path d="M166.74,12.62s.27-2,1.94-2,3.37,1.33,3.35,6c-.55,10.81-11.63,14.31-11.63,14.31,5.38-2.65,8.32-7,8.54-13S166.74,12.62,166.74,12.62Z" fill="#fff" fill-rule="evenodd"/><path d="M13.12,113.76V66.31a.46.46,0,0,1,.36-.45.48.48,0,0,1,.52.25,3.78,3.78,0,0,0,3.88,1.76c1.88-.18,2.83-1.54,2.83-4,0-1.46-1-3.63-2.2-6.39-2.41-5.38-5.71-12.76-5.71-22.6a20.65,20.65,0,0,1,3-11.33,2.59,2.59,0,0,1-1.83-.91,2.81,2.81,0,0,1-.62-2.28,3.12,3.12,0,0,1,.88-1.76,3.36,3.36,0,0,1,1.69-.81,2.8,2.8,0,0,1,2.28.62,2.6,2.6,0,0,1,.91,1.83,20.67,20.67,0,0,1,11.33-3c9.86,0,17.23,3.3,22.62,5.71,2.75,1.24,4.92,2.2,6.38,2.2,2.49,0,3.85-.95,4-2.83a3.78,3.78,0,0,0-1.76-3.88.46.46,0,0,1,.21-.88h47.79v.94H63.21a4.94,4.94,0,0,1,1.17,3.92c-.23,2.36-2,3.67-5,3.67-1.65,0-3.91-1-6.76-2.28-5.31-2.38-12.58-5.62-22.23-5.62-7.62,0-11.59,3.41-11.63,3.45a.47.47,0,0,1-.58,0,.47.47,0,0,1-.15-.56,1.79,1.79,0,0,0-.47-2,1.82,1.82,0,0,0-1.53-.41,2,2,0,0,0-1.14.67,2,2,0,0,0-.69,1.13A1.91,1.91,0,0,0,14.66,22a1.78,1.78,0,0,0,2,.47.46.46,0,0,1,.54.73s-3.45,4-3.45,11.63c0,9.65,3.24,16.93,5.62,22.23,1.27,2.85,2.28,5.12,2.28,6.76,0,3-1.31,4.73-3.69,5a4.89,4.89,0,0,1-3.9-1.15v46.13Z" fill="#fff" fill-rule="evenodd"/><path d="M16.06,113.76V79.65s-.38-3.41,1.24-3.41,10.63,2.41,10.63-9.69c0-10.7-12.1-15-12.1-31.79,0-4.5,1.62-4.41,1.62-4.41a7.62,7.62,0,0,0,5.13,1.94,5.3,5.3,0,0,0,3.68-1.6A5,5,0,0,0,27.86,27a7.14,7.14,0,0,0-1.94-5.11s-.08-1.64,4.43-1.64c16.82,0,21.08,12.1,31.77,12.1,12.1,0,9.69-9,9.69-10.63s3.41-1.2,3.41-1.2h34.46v-.81h-43c2.71,0,4.11,3.49,4.11,5.35s-.7,6.35-8.46,6.35c-12.17,0-13.41-11.93-33.56-11.93-2.87,0-4.5,1.47-6.28,2.56s-1.17,1.55-1.17,1.55c3-1.25,5.69.74,5.66,3.48a3.93,3.93,0,0,1-1.4,3,4.73,4.73,0,0,1-3,1.4c-2.87,0-4.73-2.64-3.49-5.66,0,0-.45-.62-1.54,1.17s-2.56,3.41-2.56,6.28C15.06,53.38,27,54.61,27,66.78c0,7.75-4.5,8.44-6.37,8.44s-5-1.39-5-4.1v42.64Z" fill="#fff" fill-rule="evenodd"/><path d="M145.06,8.55a8.64,8.64,0,0,1-2.35,6c-2.46,2.46-6.31,3-9.1,3H109.68v.94H133.6c3,0,7.07-.58,9.76-3.27A9.67,9.67,0,0,0,146,8.08V7.67l-.41-.05a8.1,8.1,0,0,0-5.86,1.91c-1.91,1.71-2.87,4.4-2.87,8,0,5.21,1.48,9.45,4.3,12.26A12.35,12.35,0,0,0,150,33.36v-.93c-5.61,0-12.21-3.89-12.21-14.88,0-3.33.87-5.79,2.57-7.31A7.09,7.09,0,0,1,145.06,8.55Z" fill="#fff" fill-rule="evenodd"/><path d="M133.27,12.62s-.27-2-1.94-2-3.38,1.33-3.36,6c.54,10.81,11.63,14.31,11.63,14.31a14.3,14.3,0,0,1-8.54-13C130.84,11.84,133.27,12.62,133.27,12.62Z" fill="#fff" fill-rule="evenodd"/><path d="M286.9,113.57V161a.47.47,0,0,1-.36.45.48.48,0,0,1-.52-.25,3.78,3.78,0,0,0-3.88-1.76c-1.88.18-2.83,1.54-2.83,4,0,1.46,1,3.63,2.2,6.39,2.41,5.37,5.71,12.75,5.71,22.6a20.68,20.68,0,0,1-3,11.33,2.65,2.65,0,0,1,1.83.91,2.8,2.8,0,0,1,.62,2.28,3.12,3.12,0,0,1-.88,1.76,3.35,3.35,0,0,1-1.7.81,2.74,2.74,0,0,1-2.27-.63,2.54,2.54,0,0,1-.91-1.81,20.69,20.69,0,0,1-11.33,3c-9.86,0-17.23-3.3-22.62-5.71-2.75-1.24-4.92-2.21-6.38-2.21-2.49,0-3.85,1-4,2.85a3.78,3.78,0,0,0,1.76,3.88.47.47,0,0,1-.21.88H190.33v-.93h46.46a5,5,0,0,1-1.15-3.92c.23-2.36,2-3.67,5-3.67,1.65,0,3.9,1,6.76,2.28,5.31,2.38,12.58,5.62,22.23,5.62,7.62,0,11.59-3.42,11.63-3.45a.48.48,0,0,1,.58,0,.49.49,0,0,1,.15.56,1.78,1.78,0,0,0,.47,2,1.82,1.82,0,0,0,1.53.41,2.67,2.67,0,0,0,1.81-1.8,1.84,1.84,0,0,0-.41-1.54,1.78,1.78,0,0,0-2-.47.45.45,0,0,1-.56-.15.47.47,0,0,1,0-.58s3.45-4,3.45-11.63c0-9.65-3.25-16.92-5.62-22.23-1.28-2.86-2.28-5.11-2.28-6.76,0-3,1.31-4.73,3.67-4.95A4.89,4.89,0,0,1,286,159.7V113.57Z" fill="#fff" fill-rule="evenodd"/><path d="M284,113.57v34.11s.38,3.41-1.24,3.41-10.63-2.41-10.63,9.69c0,10.7,12.1,15,12.1,31.79,0,4.5-1.62,4.41-1.62,4.41a7.62,7.62,0,0,0-5.13-1.94,5.29,5.29,0,0,0-3.69,1.6,5,5,0,0,0-1.59,3.68,7.14,7.14,0,0,0,1.94,5.11s.07,1.64-4.43,1.64c-16.82,0-21.08-12.1-31.77-12.1-12.1,0-9.69,9-9.69,10.61s-3.41,1.21-3.41,1.21H190.33v.81h43c-2.71,0-4.11-3.48-4.11-5.35s.7-6.35,8.46-6.35c12.17,0,13.41,11.93,33.56,11.93,2.87,0,4.5-1.47,6.28-2.56s1.16-1.55,1.16-1.55c-3,1.24-5.68-.74-5.65-3.48a3.93,3.93,0,0,1,1.4-3,4.73,4.73,0,0,1,3-1.4c2.86,0,4.73,2.64,3.48,5.66,0,0,.47.62,1.55-1.17S285,197,285,194.11C285,174,273,172.72,273,160.55c0-7.76,4.5-8.46,6.35-8.46s5,1.4,5,4.11V113.57Z" fill="#fff" fill-rule="evenodd"/><path d="M155,218.78a8.66,8.66,0,0,1,2.34-6c2.47-2.46,6.32-3,9.12-3h23.92v-.93H166.41c-3,0-7.07.56-9.76,3.26a9.66,9.66,0,0,0-2.64,7.14v.41l.41,0a8,8,0,0,0,5.86-1.9c1.91-1.71,2.87-4.4,2.87-8,0-5.21-1.49-9.46-4.3-12.28A12.39,12.39,0,0,0,150,194v.93c5.61,0,12.21,3.89,12.21,14.88,0,3.33-.87,5.79-2.57,7.32A7.12,7.12,0,0,1,155,218.78Z" fill="#fff" fill-rule="evenodd"/><path d="M166.74,214.71s.27,2,1.94,2,3.37-1.33,3.35-6c-.55-10.81-11.63-14.31-11.63-14.31,5.38,2.65,8.32,7,8.54,13S166.74,214.71,166.74,214.71Z" fill="#fff" fill-rule="evenodd"/><path d="M13.12,113.57V161a.46.46,0,0,0,.36.45.48.48,0,0,0,.52-.25,3.78,3.78,0,0,1,3.88-1.76c1.88.18,2.83,1.54,2.83,4,0,1.46-1,3.63-2.2,6.39-2.41,5.37-5.71,12.75-5.71,22.6a20.68,20.68,0,0,0,3,11.33,2.65,2.65,0,0,0-1.83.91,2.81,2.81,0,0,0-.62,2.28,3.12,3.12,0,0,0,.88,1.76,3.36,3.36,0,0,0,1.69.81,2.76,2.76,0,0,0,2.28-.63,2.55,2.55,0,0,0,.91-1.81,20.68,20.68,0,0,0,11.33,3c9.86,0,17.23-3.3,22.62-5.71,2.75-1.24,4.92-2.21,6.38-2.21,2.49,0,3.85,1,4,2.85a3.78,3.78,0,0,1-1.76,3.88.48.48,0,0,0-.25.52.48.48,0,0,0,.45.36h47.79v-.93H63.21a4.94,4.94,0,0,0,1.17-3.92c-.23-2.36-2-3.67-5-3.67-1.65,0-3.91,1-6.76,2.28-5.31,2.38-12.58,5.62-22.23,5.62-7.62,0-11.59-3.42-11.63-3.45a.48.48,0,0,0-.58,0,.47.47,0,0,0-.15.56,1.79,1.79,0,0,1-.47,2,1.82,1.82,0,0,1-1.53.41,2,2,0,0,1-1.14-.67,2.07,2.07,0,0,1-.69-1.13,1.91,1.91,0,0,1,.43-1.54,1.78,1.78,0,0,1,2-.47.45.45,0,0,0,.56-.15.48.48,0,0,0,0-.58s-3.45-4-3.45-11.63c0-9.65,3.24-16.92,5.62-22.23,1.27-2.86,2.28-5.11,2.28-6.76,0-3-1.31-4.73-3.69-4.95a4.88,4.88,0,0,0-3.9,1.15V113.57Z" fill="#fff" fill-rule="evenodd"/><path d="M16.06,113.57v34.11s-.38,3.41,1.24,3.41,10.63-2.41,10.63,9.69c0,10.7-12.1,15-12.1,31.79,0,4.5,1.62,4.41,1.62,4.41a7.62,7.62,0,0,1,5.13-1.94,5.29,5.29,0,0,1,3.68,1.6,5,5,0,0,1,1.6,3.68,7.14,7.14,0,0,1-1.94,5.11s-.08,1.64,4.43,1.64c16.82,0,21.08-12.1,31.77-12.1,12.1,0,9.69,9,9.69,10.61s3.41,1.21,3.41,1.21h34.46v.81h-43c2.71,0,4.11-3.48,4.11-5.35s-.7-6.35-8.46-6.35c-12.17,0-13.41,11.93-33.56,11.93-2.87,0-4.5-1.47-6.28-2.56s-1.17-1.55-1.17-1.55c3,1.24,5.69-.74,5.66-3.48a3.93,3.93,0,0,0-1.4-3,4.73,4.73,0,0,0-3-1.4c-2.87,0-4.73,2.64-3.49,5.66,0,0-.45.62-1.54-1.17s-2.56-3.41-2.56-6.28C15.06,174,27,172.72,27,160.55c0-7.76-4.5-8.46-6.37-8.46s-5,1.4-5,4.11V113.57Z" fill="#fff" fill-rule="evenodd"/><path d="M145.06,218.78a8.61,8.61,0,0,0-2.35-6c-2.46-2.46-6.31-3-9.1-3H109.68v-.93H133.6c3,0,7.07.56,9.76,3.26a9.72,9.72,0,0,1,2.64,7.14v.41l-.41,0a8,8,0,0,1-5.86-1.9c-1.91-1.71-2.87-4.4-2.87-8,0-5.21,1.48-9.46,4.3-12.28A12.39,12.39,0,0,1,150,194v.93c-5.61,0-12.21,3.89-12.21,14.88,0,3.33.87,5.79,2.57,7.32A7.1,7.1,0,0,0,145.06,218.78Z" fill="#fff" fill-rule="evenodd"/><path d="M133.27,214.71s-.27,2-1.94,2-3.38-1.33-3.36-6c.54-10.81,11.63-14.31,11.63-14.31-5.38,2.65-8.32,7-8.54,13S133.27,214.71,133.27,214.71Z" fill="#fff" fill-rule="evenodd"/>'
                },
                pf13:{
                    width:300,
                    height:300,
                    cPath:'<path d="M287.34,177.33C289.15,168.18,300,159.69,300,150s-10.85-18.17-12.66-27.32c-1.87-9.43,4.87-21.41,1.27-30.09s-16.93-12.52-22.19-20.37-3.65-21.58-10.36-28.28-20.37-5.07-28.28-10.36S216.25,15,207.42,11.38c-8.68-3.6-20.67,3.14-30.09,1.28C168.18,10.85,159.69,0,150,0s-18.17,10.85-27.33,12.66c-9.43,1.86-21.42-4.88-30.09-1.28S80.06,28.32,72.21,33.57,50.64,37.23,43.93,43.93,38.87,64.31,33.57,72.21,15,83.76,11.38,92.58s3.15,20.67,1.28,30.09C10.85,131.82,0,140.32,0,150s10.85,18.18,12.66,27.33c1.87,9.43-4.87,21.42-1.28,30.09,3.66,8.83,16.94,12.52,22.19,20.37s3.66,21.58,10.36,28.28,20.38,5.07,28.28,10.36S83.76,285,92.58,288.62s20.67-3.14,30.09-1.28C131.83,289.16,140.32,300,150,300s18.18-10.85,27.33-12.66c9.43-1.86,21.41,4.88,30.09,1.28s12.52-16.94,20.37-22.19,21.58-3.65,28.28-10.36,5.07-20.37,10.36-28.28,18.53-11.54,22.19-20.37C292.22,198.74,285.48,186.76,287.34,177.33Z" fill="#5b5b5f" opacity="0"/>',
                    gPath:'<circle cx="150" cy="150" r="121.32" fill="none" stroke="#fff" stroke-miterlimit="10" stroke-width="8"/>'
                },
                pf14:{
                    width:300,
                    height:332,
                    cPath:'<path d="M279.39,67.64,170.59,4.9c-11.33-6.54-29.88-6.54-41.21,0L20.59,67.64C9.28,74.19,0,90.22,0,103.25V228.72c0,13.07,9.28,29.1,20.61,35.64L129.41,327.1c11.33,6.54,29.88,6.54,41.21,0l108.79-62.74c11.31-6.58,20.59-22.6,20.59-35.64V103.25c0-13.07-9.26-29.1-20.61-35.64Z" fill="#d1fff9" opacity="0"/>',
                },
                pf15:{
                    width:300,
                    height:134,
                    cPath:'<path d="M0,65.82s139.27-148,300-.11c.08,0-78.95,68.29-78.95,68.29S190,98.61,148.54,100.06c-21.08.73-45,8.33-69.22,33.94C76.65,133.56,0,65.82,0,65.82Z" fill="#fff" fill-rule="evenodd" opacity="0"/>',
                },
                pf16:{
                    width:300,
                    height:242,
                    cPath:'<path d="M148.94,0H300a0,0,0,0,1,0,0V93.06A148.94,148.94,0,0,1,151.06,242H0a0,0,0,0,1,0,0V148.94A148.94,148.94,0,0,1,148.94,0Z" fill="#5fffc0" opacity="0"/>',
                },
                pf17:{
                    width:300,
                    height:390,
                    cPath:'<polygon points="188.02 390 0 390 111.98 0 300 0 188.02 390" fill="#678a37" opacity="0"/>',
                },
                pf18:{
                    width:300,
                    height:248,
                    cPath:'<path d="M172.75,244.47c63.83-19,143.47-90.45,124.36-153.92s-129.74-95-193.56-76S-15.26,75.43,3.85,138.91,108.92,263.48,172.75,244.47Z" fill="#88f7ff" opacity="0"/>',
                    gPath:'<path d="M151.49,232.45h0c-27.35,0-58.59-12.21-85.72-33.5C39.08,178,19.45,150.9,11.92,124.57,3.67,95.74,10.17,70,31.25,47.92,53.69,24.46,86.7,11.53,110.44,4.81A140.59,140.59,0,0,1,148.58,0a211.18,211.18,0,0,1,91.61,21.6c30.26,15.18,50.6,36.37,57.26,59.67,8,28.11-3.12,60.36-31.45,90.8-24.47,26.3-59.46,48.24-91.31,57.26A85.14,85.14,0,0,1,151.49,232.45Zm-2.92-231a139.21,139.21,0,0,0-37.74,4.75c-28.49,8.07-119.73,40.41-97.53,118C29.31,180.08,95.17,231,151.48,231h0a83.77,83.77,0,0,0,22.8-3.06c31.61-8.95,66.34-30.73,90.65-56.85,28-30.06,39-61.82,31.12-89.43C281.88,32.11,208.47,1.44,148.58,1.44Z" fill="#ecfffc"/>'
                },
                pf19:{
                    width:300,
                    height:200,
                    cPath:'<path d="M2.42,84.89C-4.91,60.13.14,12.65,79.1,18.91c8.94.76,50.42,6.23,85.21-8.86,21-8.78,111.71-29.44,132.74,37,3.67,16.34,1.35,23.88-2.79,47.06-2.73,15.27.32,25.23,3.72,38.75,5.72,22.74,3,64.81-58.55,64.59-5.65.06-27.68-4.54-47.4-9.69-33-8.61-63.63-4.67-130.59,10.15-13.51,5.11-72.28,5.41-56.1-55.39C8.69,124.47,8.88,106.71,2.42,84.89Z" fill="none" fill-rule="evenodd" opacity="0"/>',
                },
                pf20:{
                    width:300,
                    height:300,
                    cPath:'<path d="M150,0,300,150,150,300,0,150Z" fill="#fff" fill-rule="evenodd" opacity="0"/>',
                },
                pf21:{
                    width:300,
                    height:300,
                    cPath:'<path d="M0,0H180.72L300,300H0Z" fill="none" fill-rule="evenodd" opacity="0"/>',
                },
                pf22:{
                    width:300,
                    height:288,
                    cPath:'<path d="M149.88,248.52Q8.81,351.52,63.2,185.34-78.07,82.77,96.43,83.18q53.75-166.39,107.21,0,174.49-.26,33,102.19Q290.76,351.64,149.88,248.52Z" fill="none" opacity="0"/>',
                },
                pf23:{
                    width:300,
                    height:300,
                    cPath:'<circle cx="150" cy="150" r="120.58" fill="#f6ffec" opacity="0"/>',
                    gPath:'<g><g><g><path d="M268.55,191.48c3.67-2.2,4.59-6.95,4-10.94,0-.12-.44-.28-.43-.22.59,4-.3,8.69-4,10.88-.07,0,.29.34.39.28Z" fill="#3b4437"/><path d="M273.16,196.92c3.49-2,7.33-3,10.92-.59.15.1.46.15.18,0-3.77-2.57-7.69-1.8-11.49.36-.08,0,.29.34.39.28Z" fill="#3b4437"/><path id="_路径_3" data-name="&lt;路径&gt;" d="M270.14,193.15c3.26-1.26,5.89-4.08,7.74-7,.05-.08-.37-.35-.42-.26-1.84,2.89-4.47,5.72-7.7,7-.07,0,.27.33.39.28Z" fill="#3b4437"/><path id="_路径_4" data-name="&lt;路径&gt;" d="M283.33,190.28a16.4,16.4,0,0,0-11.59,4.64c-.17.17.22.46.36.32a16.13,16.13,0,0,1,11.41-4.58c.3,0,0-.37-.18-.38Z" fill="#3b4437"/><circle id="_路径_5" data-name="&lt;路径&gt;" cx="272.33" cy="180.43" r="1.13" transform="translate(-49.27 237.84) rotate(-43.65)" fill="#8dcecc"/><circle id="_路径_6" data-name="&lt;路径&gt;" cx="277.48" cy="185.83" r="1.13" transform="translate(-51.57 242.88) rotate(-43.65)" fill="#8dcecc"/><circle id="_路径_7" data-name="&lt;路径&gt;" cx="283.68" cy="190.23" r="1.13" transform="translate(-52.89 248.39) rotate(-43.65)" fill="#8dcecc"/><circle id="_路径_8" data-name="&lt;路径&gt;" cx="284.37" cy="196.51" r="1.13" transform="translate(-57.04 250.59) rotate(-43.65)" fill="#8dcecc"/></g><g id="_编组_6" data-name="&lt;编组&gt;"><g id="_编组_7" data-name="&lt;编组&gt;"><path id="_路径_9" data-name="&lt;路径&gt;" d="M262.68,202.35c9.06-2.87,16.66-7,20.79-.33s-9.94,6.88-15.9,5.67S258.14,203.79,262.68,202.35Z" fill="#7dbbbc"/><path id="_路径_10" data-name="&lt;路径&gt;" d="M262.35,201.72c3.79-8.72,8.72-15.85,2.46-20.65s-7.87,9.18-7.28,15.23S260.45,206.09,262.35,201.72Z" fill="#7dbbbc"/><path id="_路径_11" data-name="&lt;路径&gt;" d="M260.18,203c.38-7.87,2-13.23,7.34-14.43s9.84,3.43,9.55,7.55-9.81,6.86-12.2,7.35S260.1,204.65,260.18,203Z" fill="#9ae3e8"/><g id="_编组_8" data-name="&lt;编组&gt;"><path id="_路径_12" data-name="&lt;路径&gt;" d="M258.6,187.38c-1.23,4.8-1.42,10.7.85,15.28.05.11.42.16.4.11-2.27-4.58-2.08-10.44-.85-15.24,0-.1-.38-.23-.4-.15Z" fill="#fff"/><path id="_路径_13" data-name="&lt;路径&gt;" d="M259.5,190.22a19.54,19.54,0,0,0,0,12.44c0,.11.42.18.4.11a19.46,19.46,0,0,1,0-12.4c0-.1-.37-.24-.4-.15Z" fill="#fff"/><path id="_路径_14" data-name="&lt;路径&gt;" d="M261.4,189.4c-1.79,4.29-3.18,8.9-1.79,13.5,0,.11.42.2.4.11-1.38-4.58,0-9.18,1.79-13.45,0-.1-.36-.25-.4-.15Z" fill="#fff"/><path id="_路径_15" data-name="&lt;路径&gt;" d="M262,191.46A18.26,18.26,0,0,0,259.71,203c0,.16.43.26.41.08a18.14,18.14,0,0,1,2.23-11.46c.08-.14-.31-.31-.4-.15Z" fill="#fff"/></g><path id="_路径_16" data-name="&lt;路径&gt;" d="M273.35,198.94c-3.68,2.11-8.18,4.51-12.56,4.51-.28,0,0,.25.13.25,4.46,0,9-2.38,12.73-4.53.17-.1-.18-.3-.3-.23Z" fill="#fff"/><path id="_路径_17" data-name="&lt;路径&gt;" d="M265.14,193.47a23.24,23.24,0,0,0-3.89,6.6,21.2,21.2,0,0,0-.76,2.37c0,.1-.24,1.13,0,.75a5.09,5.09,0,0,0,.17-1.48,31.53,31.53,0,0,1,.6-3.1,16,16,0,0,1,3.13-6.77c.06-.07-.12-.17-.18-.11-2.64,3.05-3.65,7.56-3.93,11.51,0,.08.19.14.2.06a21.67,21.67,0,0,1,4.81-9.72c.06-.08-.12-.17-.18-.11Z" fill="#fff"/><path id="_路径_18" data-name="&lt;路径&gt;" d="M271.54,197.61c-3,2.24-6.78,4.79-10.62,5.41-.26,0,0,.34.21.31,3.87-.63,7.64-3.19,10.71-5.44.19-.14-.14-.39-.29-.27Z" fill="#fff"/><path id="_路径_19" data-name="&lt;路径&gt;" d="M269,194.24a32.28,32.28,0,0,0-8.5,8.91c-.06.1.32.27.4.15a32.14,32.14,0,0,1,8.47-8.87c.1-.08-.26-.27-.37-.19Z" fill="#fff"/><path id="_路径_20" data-name="&lt;路径&gt;" d="M261.71,204.78l-.32-.25.09-.11c2.91,2.33,8.57,3.36,15.94,2.88v.14C270.28,207.9,264.73,207,261.71,204.78Z" fill="#fff"/><path id="_路径_21" data-name="&lt;路径&gt;" d="M274.75,205.79c-4.41.44-9.59.85-13.49-1.69-.24-.15-1-.15-.52.16,4.24,2.77,9.66,2.49,14.48,2,.46,0-.22-.49-.47-.47Z" fill="#fff"/><path id="_路径_22" data-name="&lt;路径&gt;" d="M271.92,203.35c-3.3,1.28-6.84,2-10.23.66-.48-.19-.66.28-.18.47,3.64,1.45,7.44.75,11-.63.39-.15-.3-.62-.6-.5Z" fill="#fff"/></g><path id="_路径_23" data-name="&lt;路径&gt;" d="M260,204.55a4.9,4.9,0,0,1-1.05-5.08c.5-1,.81-.88.9.13s-.09,1.79.63,1.27,2.18-1.16,2.09-.55-1.92,2.26-.92,2,3.51-.41,2.54.2-2.2,1.07-.73,1.11,2.16.1,1.33.93A3.56,3.56,0,0,1,260,204.55Z" fill="#5a7958"/><path id="_路径_24" data-name="&lt;路径&gt;" d="M259.83,202.72A20.05,20.05,0,0,0,250.72,216c-.14.78,1.46,1.35,1.59.61A19.26,19.26,0,0,1,261,203.79c.81-.48-.54-1.45-1.16-1.07Z" fill="#5a7958"/></g></g><g id="_编组_9" data-name="&lt;编组&gt;"><g id="_编组_10" data-name="&lt;编组&gt;"><path id="_路径_25" data-name="&lt;路径&gt;" d="M230.62,234.54c7.31-5.94,14.85-12.2,23.67-15.78,8.1-3.29,16.79-3.48,25.37-2.53.36,0,1.12.67.39.59-8.61-.95-17.25-.7-25.34,2.68-8.58,3.59-16,9.73-23.12,15.55-.26.21-1.25-.29-1-.5Z" fill="#2d9c9e"/><path id="_路径_26" data-name="&lt;路径&gt;" d="M277.56,216.29c6.43-.26,14.68.42,14.46,3.44s-8.71-1.64-11.73-2.55S277.56,216.29,277.56,216.29Z" fill="#2d9c9e"/><path id="_路径_27" data-name="&lt;路径&gt;" d="M273.1,216c2.14,5.29,9,10.44,9.58,7.48s-6.07-6.78-7.5-7.12A12.17,12.17,0,0,0,273.1,216Z" fill="#2d9c9e"/><path id="_路径_28" data-name="&lt;路径&gt;" d="M273,216.08c2.15-5.29,9-10.43,9.59-7.46s-6.08,6.77-7.5,7.11A12.17,12.17,0,0,1,273,216.08Z" fill="#2d9c9e"/><path id="_路径_29" data-name="&lt;路径&gt;" d="M260.95,216.93c2.15-5.29,9-10.43,9.59-7.46s-6.08,6.77-7.5,7.11A12.17,12.17,0,0,1,260.95,216.93Z" fill="#2d9c9e"/><path id="_路径_30" data-name="&lt;路径&gt;" d="M252.57,220.09c1-5.62,6.73-12,7.87-9.26s-4.57,7.86-5.91,8.48A12.17,12.17,0,0,1,252.57,220.09Z" fill="#2d9c9e"/><path id="_路径_31" data-name="&lt;路径&gt;" d="M245,224.22c-.4-4.53,2.62-10.67,4.09-8.77s-1.85,7-2.74,7.76A9.69,9.69,0,0,1,245,224.22Z" fill="#2d9c9e"/><path id="_路径_32" data-name="&lt;路径&gt;" d="M239.18,228.48c-.4-4.53,2.62-10.67,4.09-8.77s-1.85,7-2.74,7.76A9.69,9.69,0,0,1,239.18,228.48Z" fill="#2d9c9e"/><path id="_路径_33" data-name="&lt;路径&gt;" d="M260.95,216.92c3.63,4.41,11.74,7.25,11.38,4.26s-7.82-4.65-9.29-4.54A12.18,12.18,0,0,0,260.95,216.92Z" fill="#2d9c9e"/><path id="_路径_34" data-name="&lt;路径&gt;" d="M252.57,220c3.92,3.24,11.51,4.36,10.68,1.8s-7.63-2.75-8.9-2.41A10.86,10.86,0,0,0,252.57,220Z" fill="#2d9c9e"/><path id="_路径_35" data-name="&lt;路径&gt;" d="M245,224.12c4.43,2.51,12.09,2.28,10.83-.1s-8-1.37-9.18-.81A10.85,10.85,0,0,0,245,224.12Z" fill="#2d9c9e"/><path id="_路径_36" data-name="&lt;路径&gt;" d="M239.16,228.49c4.43,2.51,12.09,2.28,10.83-.1s-8-1.37-9.18-.81A10.85,10.85,0,0,0,239.16,228.49Z" fill="#2d9c9e"/></g><g id="_编组_11" data-name="&lt;编组&gt;"><path id="_路径_37" data-name="&lt;路径&gt;" d="M192.43,262.36c11.43-5.47,23.38-11,32.81-19.71,8.66-8,13.89-18.41,17.68-29.4.16-.46-.17-1.75-.49-.82-3.8,11-9.07,21.38-17.84,29.27-9.31,8.37-21,13.81-32.2,19.17-.41.2-.37,1.69,0,1.49Z" fill="#a49900"/><path id="_路径_38" data-name="&lt;路径&gt;" d="M241.62,215.79c4-7.67,7.93-18.09,4.14-19.57s-3,11.53-3.64,15.73S241.62,215.79,241.62,215.79Z" fill="#a49900"/><path id="_路径_39" data-name="&lt;路径&gt;" d="M239.38,221.36c-5.2-5.65-7.5-17-3.58-15.95s4.75,11.28,4.34,13.21A16.38,16.38,0,0,1,239.38,221.36Z" fill="#a49900"/><path id="_路径_40" data-name="&lt;路径&gt;" d="M239.27,221.4c7.67.43,17.88-5,14.59-7.37s-11.73,3.49-13,5A16.38,16.38,0,0,0,239.27,221.4Z" fill="#a49900"/><path id="_路径_41" data-name="&lt;路径&gt;" d="M231.28,235.61c7.67.43,17.88-5,14.59-7.37s-11.73,3.49-13,5A16.38,16.38,0,0,0,231.28,235.61Z" fill="#a49900"/><path id="_路径_42" data-name="&lt;路径&gt;" d="M222.63,244c7.42,2,18.52-1.26,15.78-4.25s-12.19,1-13.71,2.3A16.37,16.37,0,0,0,222.63,244Z" fill="#a49900"/><path id="_路径_43" data-name="&lt;路径&gt;" d="M213.24,250.83c5.28,3.09,14.48,2.95,13,.08s-9.58-1.78-11-1.13A13,13,0,0,0,213.24,250.83Z" fill="#a49900"/><path id="_路径_44" data-name="&lt;路径&gt;" d="M204.72,255.44c5.28,3.09,14.48,2.95,13,.07s-9.58-1.78-11-1.13A13,13,0,0,0,204.72,255.44Z" fill="#a49900"/><path id="_路径_45" data-name="&lt;路径&gt;" d="M231.3,235.61c-3.27-7-2.06-18.45,1.37-16.29s1.15,12.18.18,13.9A16.37,16.37,0,0,1,231.3,235.61Z" fill="#a49900"/><path id="_路径_46" data-name="&lt;路径&gt;" d="M222.69,244c-1.69-6.64,1.31-16.5,4-14s-1.05,10.86-2.19,12.2A14.6,14.6,0,0,1,222.69,244Z" fill="#a49900"/><path id="_路径_47" data-name="&lt;路径&gt;" d="M213.35,250.9c-.5-6.83,4.18-16,6.35-13.12s-2.94,10.51-4.3,11.63A14.6,14.6,0,0,1,213.35,250.9Z" fill="#a49900"/><path id="_路径_48" data-name="&lt;路径&gt;" d="M204.7,255.45c-.5-6.83,4.18-16,6.35-13.12s-2.94,10.51-4.3,11.63A14.59,14.59,0,0,1,204.7,255.45Z" fill="#a49900"/></g></g><g id="_编组_12" data-name="&lt;编组&gt;"><path id="_路径_49" data-name="&lt;路径&gt;" d="M251.28,206.07c-1.2.66-3.5,1.15-3.41-.94s2.33-1.65,1-2.22-1.94-2.91-.41-3.86,2.73,1.3,2.52-.07,1.61-3.4,3.46-2a2.66,2.66,0,0,1,.44,3.86c-.41.3-.43.38.92.53s2.89,2.72.9,3.5-2.51-.63-2,.78.54,3.06-1,3.17C250.88,209,252.18,205.58,251.28,206.07Z" fill="#f47888"/><circle id="_路径_50" data-name="&lt;路径&gt;" cx="252.07" cy="202.39" r="1.99" transform="translate(-21.36 29.94) rotate(-6.52)" fill="#a45"/></g><g id="_编组_13" data-name="&lt;编组&gt;"><path id="_路径_51" data-name="&lt;路径&gt;" d="M245.23,240.22c-1.2.66-3.5,1.15-3.41-.94s2.33-1.65,1-2.22-1.94-2.91-.41-3.86,2.73,1.3,2.52-.07,1.61-3.4,3.46-2a2.66,2.66,0,0,1,.44,3.86c-.41.3-.43.38.92.53s2.89,2.72.9,3.5-2.51-.63-2,.78.54,3.06-1,3.17C244.82,243.14,246.12,239.73,245.23,240.22Z" fill="#f47888"/><circle id="_路径_52" data-name="&lt;路径&gt;" cx="246.01" cy="236.54" r="1.99" transform="translate(-25.28 29.48) rotate(-6.52)" fill="#a45"/></g><g id="_编组_14" data-name="&lt;编组&gt;"><path id="_路径_53" data-name="&lt;路径&gt;" d="M196.27,251.41c-1.27-.51-3.1-2-1.42-3.24s2.76.77,2.33-.65,1-3.34,2.73-2.76.72,2.93,1.64,1.91,3.65-.9,3.76,1.4a2.66,2.66,0,0,1-2.71,2.78c-.49-.13-.56-.09.17,1.05s-.28,4-2.15,2.91-1.1-2.34-1.86-1-2,2.35-3.1,1.21C193.75,252.94,197.22,251.79,196.27,251.41Z" fill="#f47888"/><circle id="_路径_54" data-name="&lt;路径&gt;" cx="199.62" cy="249.69" r="1.99" transform="translate(-118.5 218.11) rotate(-45.69)" fill="#a45"/></g></g><g id="_编组_15" data-name="&lt;编组&gt;"><g id="_编组_16" data-name="&lt;编组&gt;"><g id="_编组_17" data-name="&lt;编组&gt;"><path id="_路径_55" data-name="&lt;路径&gt;" d="M263.16,95.51c1-4.15-1.67-8.16-4.91-10.56-.1-.08-.51.11-.46.15,3.22,2.38,5.93,6.36,4.89,10.49,0,.08.44,0,.47-.08Z" fill="#3b4437"/><path id="_路径_56" data-name="&lt;路径&gt;" d="M270.27,96.09c1.07-3.87,3-7.33,7.3-8.14.18,0,.43-.22.1-.16-4.48.85-6.71,4.17-7.87,8.38,0,.08.44,0,.47-.08Z" fill="#3b4437"/><path id="_路径_57" data-name="&lt;路径&gt;" d="M265.47,95.56c1.42-3.2,1.28-7,.53-10.42,0-.1-.5,0-.48.12.75,3.34.88,7.2-.52,10.37,0,.07.42,0,.47-.08Z" fill="#3b4437"/><path id="_路径_58" data-name="&lt;路径&gt;" d="M272.76,84.2a16.4,16.4,0,0,0-4.92,11.48c0,.24.48.17.48,0a16.13,16.13,0,0,1,4.83-11.31c.21-.2-.25-.28-.39-.14Z" fill="#3b4437"/><circle id="_路径_59" data-name="&lt;路径&gt;" cx="258.02" cy="85.02" r="1.13" transform="translate(166.93 340.96) rotate(-88.65)" fill="#8dcecc"/><circle id="_路径_60" data-name="&lt;路径&gt;" cx="265.48" cy="85.2" r="1.13" transform="translate(174.03 348.59) rotate(-88.65)" fill="#8dcecc"/><circle id="_路径_61" data-name="&lt;路径&gt;" cx="272.97" cy="83.92" r="1.13" transform="translate(182.62 354.84) rotate(-88.65)" fill="#8dcecc"/><circle id="_路径_62" data-name="&lt;路径&gt;" cx="277.9" cy="87.88" r="1.13" transform="translate(183.5 363.63) rotate(-88.65)" fill="#8dcecc"/></g><g id="_编组_18" data-name="&lt;编组&gt;"><g id="_编组_19" data-name="&lt;编组&gt;"><path id="_路径_63" data-name="&lt;路径&gt;" d="M266.69,107.34c4.37-8.44,6.79-16.76,14.47-14.93s-2.16,11.9-7.23,15.25S264.5,111.57,266.69,107.34Z" fill="#7dbbbc"/><path id="_路径_64" data-name="&lt;路径&gt;" d="M266,107.12c-3.48-8.84-5-17.37-12.86-16.34s.93,12.06,5.62,15.91S267.76,111.56,266,107.12Z" fill="#7dbbbc"/><path id="_路径_65" data-name="&lt;路径&gt;" d="M265.37,109.56c-5.29-5.83-8-10.75-5-15.39s9.38-4.53,12.09-1.42-2.08,11.79-3.43,13.83S266.49,110.79,265.37,109.56Z" fill="#9ae3e8"/><g id="_编组_20" data-name="&lt;编组&gt;"><path id="_路径_66" data-name="&lt;路径&gt;" d="M253.22,99.64c2.52,4.27,6.56,8.57,11.4,10.2.11,0,.41-.18.36-.2-4.84-1.63-8.85-5.91-11.38-10.17-.05-.09-.43.1-.39.17Z" fill="#fff"/><path id="_路径_67" data-name="&lt;路径&gt;" d="M255.87,101a19.54,19.54,0,0,0,8.76,8.82c.11,0,.42-.17.36-.2a19.46,19.46,0,0,1-8.73-8.8c0-.09-.43.1-.39.17Z" fill="#fff"/><path id="_路径_68" data-name="&lt;路径&gt;" d="M256.63,99.09c1.77,4.3,4,8.54,8.27,10.81.11.06.44-.16.36-.2-4.22-2.26-6.48-6.5-8.24-10.78,0-.1-.43.07-.39.17Z" fill="#fff"/><path id="_路径_69" data-name="&lt;路径&gt;" d="M258.48,100.16a18.25,18.25,0,0,0,6.56,9.73c.13.1.49-.12.35-.23a18.14,18.14,0,0,1-6.52-9.68c0-.16-.44,0-.39.17Z" fill="#fff"/></g><path id="_路径_70" data-name="&lt;路径&gt;" d="M271.83,97.39c-1.11,4.09-2.6,9-5.69,12.07-.2.2.16.2.27.09,3.15-3.16,4.67-8,5.8-12.21.05-.19-.34-.08-.38,0Z" fill="#fff"/><path id="_路径_71" data-name="&lt;路径&gt;" d="M262.15,99.32a23.24,23.24,0,0,0,1.91,7.42,21.21,21.21,0,0,0,1.14,2.22c.05.09.63,1,.56.51s-.74-.92-.93-1.17a31.53,31.53,0,0,1-1.77-2.62,16,16,0,0,1-2.57-7c0-.1-.21,0-.2.05.29,4,2.77,7.93,5.36,10.92,0,.06.23,0,.18-.1a21.67,21.67,0,0,1-3.47-10.28c0-.1-.21,0-.2.05Z" fill="#fff"/><path id="_路径_72" data-name="&lt;路径&gt;" d="M269.61,97.72c-.57,3.74-1.41,8.18-3.69,11.34-.15.21.25.23.36.07,2.3-3.18,3.15-7.66,3.72-11.42,0-.24-.37-.18-.4,0Z" fill="#fff"/><path id="_路径_73" data-name="&lt;路径&gt;" d="M265.44,97.12a32.28,32.28,0,0,0,.29,12.31c0,.11.42,0,.39-.17A32.14,32.14,0,0,1,265.84,97c0-.13-.38,0-.4.12Z" fill="#fff"/><path id="_路径_74" data-name="&lt;路径&gt;" d="M267.73,109.74l-.4.05,0-.14c3.7-.41,8.43-3.68,13.31-9.24l.11.09C276,105.89,271.4,109.15,267.73,109.74Z" fill="#fff"/><path id="_路径_75" data-name="&lt;路径&gt;" d="M277.66,101.24c-2.8,3.43-6.18,7.39-10.74,8.35-.28.06-.79.59-.26.48,5-1,8.59-5.07,11.66-8.82.29-.36-.5-.19-.66,0Z" fill="#fff"/><path id="_路径_76" data-name="&lt;路径&gt;" d="M273.93,101.52c-1.43,3.24-3.42,6.26-6.77,7.7-.48.2-.27.67.21.46,3.61-1.55,5.79-4.73,7.33-8.23.17-.38-.65-.22-.78.07Z" fill="#fff"/></g><path id="_路径_77" data-name="&lt;路径&gt;" d="M266.36,110.78a4.9,4.9,0,0,1-4.34-2.85c-.34-1,0-1.19.73-.55s1.2,1.33,1.34.45.72-2.36,1.09-1.87.24,3,.74,2,2.19-2.77,1.94-1.65-.8,2.31.27,1.3,1.6-1.46,1.6-.28A3.56,3.56,0,0,1,266.36,110.78Z" fill="#5a7958"/><path id="_路径_78" data-name="&lt;路径&gt;" d="M264.94,109.62a20.05,20.05,0,0,0,2.93,15.82c.45.65,2-.08,1.55-.7a19.26,19.26,0,0,1-2.9-15.19c.23-.91-1.41-.65-1.58.06Z" fill="#5a7958"/></g></g><g id="_编组_21" data-name="&lt;编组&gt;"><g id="_编组_22" data-name="&lt;编组&gt;"><path id="_路径_79" data-name="&lt;路径&gt;" d="M266.79,152.77c1-9.37,1.88-19.13,5.58-27.9,3.4-8.06,9.41-14.33,16.15-19.73.28-.23,1.27-.32.7.14-6.76,5.42-12.69,11.7-16,19.81-3.53,8.61-4.41,18.17-5.35,27.34,0,.34-1.09.68-1.05.34Z" fill="#2d9c9e"/><path id="_路径_80" data-name="&lt;路径&gt;" d="M287.07,106.68c4.36-4.73,10.68-10.08,12.66-7.8s-7.32,5-10.1,6.49S287.07,106.68,287.07,106.68Z" fill="#2d9c9e"/><path id="_路径_81" data-name="&lt;路径&gt;" d="M283.73,109.64c5.26,2.23,13.76,1,12.06-1.49s-9.08-.5-10.33.27A12.17,12.17,0,0,0,283.73,109.64Z" fill="#2d9c9e"/><path id="_路径_82" data-name="&lt;路径&gt;" d="M283.73,109.73c-2.22-5.26-1-13.77,1.5-12.06s.49,9.08-.28,10.33A12.17,12.17,0,0,1,283.73,109.73Z" fill="#2d9c9e"/><path id="_路径_83" data-name="&lt;路径&gt;" d="M275.78,118.88c-2.22-5.26-1-13.77,1.5-12.06s.49,9.08-.28,10.33A12.17,12.17,0,0,1,275.78,118.88Z" fill="#2d9c9e"/><path id="_路径_84" data-name="&lt;路径&gt;" d="M272.09,127c-3.24-4.7-3.75-13.28-1-12.11s2.33,8.79,1.82,10.17A12.18,12.18,0,0,1,272.09,127Z" fill="#2d9c9e"/><path id="_路径_85" data-name="&lt;路径&gt;" d="M269.65,135.32c-3.48-2.92-5.69-9.4-3.31-9.09s3.64,6.26,3.55,7.42A9.69,9.69,0,0,1,269.65,135.32Z" fill="#2d9c9e"/><path id="_路径_86" data-name="&lt;路径&gt;" d="M268.55,142.44c-3.48-2.92-5.69-9.4-3.31-9.09s3.64,6.26,3.55,7.42A9.68,9.68,0,0,1,268.55,142.44Z" fill="#2d9c9e"/><path id="_路径_87" data-name="&lt;路径&gt;" d="M275.78,118.87c5.68.55,13.43-3.18,11.06-5s-8.82,2.25-9.78,3.36A12.17,12.17,0,0,0,275.78,118.87Z" fill="#2d9c9e"/><path id="_路径_88" data-name="&lt;路径&gt;" d="M272.05,127c5.07-.48,11.22-5.05,8.83-6.28s-7.34,3.46-8,4.59A10.85,10.85,0,0,0,272.05,127Z" fill="#2d9c9e"/><path id="_路径_89" data-name="&lt;路径&gt;" d="M269.57,135.26c4.91-1.36,10.16-6.94,7.59-7.73s-6.62,4.69-7.06,5.92A10.85,10.85,0,0,0,269.57,135.26Z" fill="#2d9c9e"/><path id="_路径_90" data-name="&lt;路径&gt;" d="M268.55,142.45c4.91-1.36,10.16-6.94,7.59-7.73s-6.62,4.69-7.06,5.92A10.85,10.85,0,0,0,268.55,142.45Z" fill="#2d9c9e"/></g><g id="_编组_23" data-name="&lt;编组&gt;"><path id="_路径_91" data-name="&lt;路径&gt;" d="M259.45,199.45c4.21-12,8.72-24.34,9.26-37.13.5-11.75-3.2-22.84-8.29-33.29-.21-.44-1.36-1.12-.93-.23,5.1,10.47,8.71,21.53,8.08,33.31-.66,12.5-5.09,24.63-9.22,36.32-.15.43.93,1.46,1.08,1Z" fill="#a49900"/><path id="_路径_92" data-name="&lt;路径&gt;" d="M261.3,131.73c-2.58-8.27-7.18-18.4-10.91-16.76s6,10.28,8.55,13.7S261.3,131.73,261.3,131.73Z" fill="#a49900"/><path id="_路径_93" data-name="&lt;路径&gt;" d="M263.66,137.26c-7.67-.31-17.31-6.7-13.81-8.75s11.33,4.61,12.41,6.27A16.38,16.38,0,0,1,263.66,137.26Z" fill="#a49900"/><path id="_路径_94" data-name="&lt;路径&gt;" d="M263.61,137.36c5.73-5.12,9.11-16.17,5.11-15.53s-5.82,10.76-5.6,12.73A16.37,16.37,0,0,0,263.61,137.36Z" fill="#a49900"/><path id="_路径_95" data-name="&lt;路径&gt;" d="M268,153.06c5.73-5.12,9.11-16.17,5.11-15.53s-5.82,10.76-5.6,12.73A16.37,16.37,0,0,0,268,153.06Z" fill="#a49900"/><path id="_路径_96" data-name="&lt;路径&gt;" d="M267.81,165.1c6.65-3.85,12.2-14,8.15-14.17s-7.89,9.36-8.07,11.32A16.38,16.38,0,0,0,267.81,165.1Z" fill="#a49900"/><path id="_路径_97" data-name="&lt;路径&gt;" d="M266,176.58c5.92-1.55,12.32-8.15,9.25-9.15s-8,5.51-8.59,7A13,13,0,0,0,266,176.58Z" fill="#a49900"/><path id="_路径_98" data-name="&lt;路径&gt;" d="M263.25,185.87c5.92-1.55,12.32-8.15,9.25-9.15s-8,5.51-8.59,7A13,13,0,0,0,263.25,185.87Z" fill="#a49900"/><path id="_路径_99" data-name="&lt;路径&gt;" d="M268,153.05c-7.23-2.6-14.5-11.59-10.55-12.49s9.43,7.8,10,9.7A16.38,16.38,0,0,1,268,153.05Z" fill="#a49900"/><path id="_路径_100" data-name="&lt;路径&gt;" d="M267.87,165.08c-5.89-3.5-10.74-12.6-7.13-12.71s6.94,8.42,7.08,10.18A14.6,14.6,0,0,1,267.87,165.08Z" fill="#a49900"/><path id="_路径_101" data-name="&lt;路径&gt;" d="M266.14,176.55c-5.18-4.48-8.37-14.28-4.79-13.77s5.35,9.51,5.18,11.26A14.6,14.6,0,0,1,266.14,176.55Z" fill="#a49900"/><path id="_路径_102" data-name="&lt;路径&gt;" d="M263.24,185.89c-5.18-4.48-8.37-14.28-4.79-13.77s5.35,9.51,5.18,11.26A14.6,14.6,0,0,1,263.24,185.89Z" fill="#a49900"/></g></g><g id="_编组_24" data-name="&lt;编组&gt;"><path id="_路径_103" data-name="&lt;路径&gt;" d="M261.27,118c-.38,1.31-1.66,3.29-3.07,1.74s.48-2.82-.88-2.25-3.43-.69-3-2.44,2.85-1,1.73-1.83-1.27-3.54,1-3.88a2.66,2.66,0,0,1,3,2.42c-.08.5,0,.57,1-.27s4-.12,3.11,1.84-2.22,1.33-.85,2,2.55,1.78,1.52,3C263,120.38,261.55,117,261.27,118Z" fill="#f47888"/><circle id="_路径_104" data-name="&lt;路径&gt;" cx="259.22" cy="114.87" r="1.99" transform="translate(8.01 246.33) rotate(-51.52)" fill="#a45"/></g><g id="_编组_25" data-name="&lt;编组&gt;"><path id="_路径_105" data-name="&lt;路径&gt;" d="M281.13,146.46c-.38,1.31-1.66,3.29-3.07,1.74s.48-2.82-.88-2.25-3.43-.69-3-2.44,2.85-1,1.73-1.83-1.27-3.54,1-3.88a2.66,2.66,0,0,1,3,2.42c-.08.5,0,.57,1-.27s4-.12,3.11,1.84-2.22,1.33-.85,2,2.55,1.78,1.52,3C282.91,148.81,281.42,145.48,281.13,146.46Z" fill="#f47888"/><circle id="_路径_106" data-name="&lt;路径&gt;" cx="279.08" cy="143.3" r="1.99" transform="translate(-6.74 272.62) rotate(-51.52)" fill="#a45"/></g><g id="_编组_26" data-name="&lt;编组&gt;"><path id="_路径_107" data-name="&lt;路径&gt;" d="M254.43,189c-1.26.54-3.6.79-3.29-1.28s2.49-1.41,1.19-2.11-1.64-3.09,0-3.88,2.58,1.57,2.51.19,1.94-3.22,3.64-1.67a2.66,2.66,0,0,1,0,3.88c-.44.25-.46.34.86.62s2.6,3,.54,3.58-2.44-.88-2.06.58.23,3.1-1.34,3C253.73,191.85,255.37,188.59,254.43,189Z" fill="#f47888"/><circle id="_路径_108" data-name="&lt;路径&gt;" cx="255.58" cy="185.41" r="1.99" transform="translate(-2.21 3.09) rotate(-0.69)" fill="#a45"/></g></g><g id="_编组_27" data-name="&lt;编组&gt;"><g id="_编组_28" data-name="&lt;编组&gt;"><g id="_编组_29" data-name="&lt;编组&gt;"><path id="_路径_109" data-name="&lt;路径&gt;" d="M191.48,31.45c-2.2-3.67-6.95-4.59-10.94-4-.12,0-.28.44-.22.43,4-.59,8.69.3,10.88,4,0,.07.34-.29.28-.39Z" fill="#3b4437"/><path id="_路径_110" data-name="&lt;路径&gt;" d="M196.92,26.84c-2-3.49-3-7.33-.59-10.92.1-.15.15-.46,0-.18-2.57,3.77-1.8,7.69.36,11.49,0,.08.34-.29.28-.39Z" fill="#3b4437"/><path id="_路径_111" data-name="&lt;路径&gt;" d="M193.15,29.86c-1.26-3.26-4.08-5.89-7-7.74-.08-.05-.35.37-.26.42,2.89,1.84,5.72,4.47,7,7.7,0,.07.33-.27.28-.39Z" fill="#3b4437"/><path id="_路径_112" data-name="&lt;路径&gt;" d="M190.28,16.67a16.39,16.39,0,0,0,4.64,11.59c.17.17.46-.22.32-.36a16.13,16.13,0,0,1-4.58-11.41c0-.3-.37,0-.38.18Z" fill="#3b4437"/><circle id="_路径_113" data-name="&lt;路径&gt;" cx="180.43" cy="27.67" r="1.13" transform="translate(30.77 132.19) rotate(-43.65)" fill="#8dcecc"/><circle id="_路径_114" data-name="&lt;路径&gt;" cx="185.83" cy="22.52" r="1.13" transform="translate(35.82 134.49) rotate(-43.65)" fill="#8dcecc"/><circle id="_路径_115" data-name="&lt;路径&gt;" cx="190.23" cy="16.32" r="1.13" transform="translate(41.31 135.81) rotate(-43.65)" fill="#8dcecc"/><circle id="_路径_116" data-name="&lt;路径&gt;" cx="196.51" cy="15.63" r="1.13" transform="translate(43.52 139.96) rotate(-43.65)" fill="#8dcecc"/></g><g id="_编组_30" data-name="&lt;编组&gt;"><g id="_编组_31" data-name="&lt;编组&gt;"><path id="_路径_117" data-name="&lt;路径&gt;" d="M202.35,37.32c-2.87-9.06-7-16.66-.33-20.79s6.88,9.94,5.67,15.9S203.79,41.86,202.35,37.32Z" fill="#7dbbbc"/><path id="_路径_118" data-name="&lt;路径&gt;" d="M201.72,37.65c-8.72-3.79-15.85-8.72-20.65-2.46s9.18,7.87,15.23,7.28S206.09,39.55,201.72,37.65Z" fill="#7dbbbc"/><path id="_路径_119" data-name="&lt;路径&gt;" d="M203,39.82c-7.87-.38-13.23-2-14.43-7.34s3.43-9.84,7.55-9.55,6.86,9.81,7.35,12.2S204.65,39.9,203,39.82Z" fill="#9ae3e8"/><g id="_编组_32" data-name="&lt;编组&gt;"><path id="_路径_120" data-name="&lt;路径&gt;" d="M187.38,41.4c4.8,1.23,10.7,1.42,15.28-.85.11-.05.16-.42.11-.4-4.58,2.27-10.44,2.08-15.24.85-.1,0-.23.38-.15.4Z" fill="#fff"/><path id="_路径_121" data-name="&lt;路径&gt;" d="M190.22,40.5a19.54,19.54,0,0,0,12.44,0c.11,0,.18-.42.11-.4a19.46,19.46,0,0,1-12.4,0c-.1,0-.24.37-.15.4Z" fill="#fff"/><path id="_路径_122" data-name="&lt;路径&gt;" d="M189.4,38.6c4.29,1.79,8.9,3.18,13.5,1.79.11,0,.2-.42.11-.4-4.58,1.38-9.18,0-13.45-1.79-.1,0-.25.36-.15.4Z" fill="#fff"/><path id="_路径_123" data-name="&lt;路径&gt;" d="M191.46,38A18.25,18.25,0,0,0,203,40.29c.16,0,.26-.43.08-.41a18.14,18.14,0,0,1-11.46-2.23c-.14-.08-.31.31-.15.4Z" fill="#fff"/></g><path id="_路径_124" data-name="&lt;路径&gt;" d="M198.94,26.65c2.11,3.68,4.51,8.18,4.51,12.56,0,.28.25,0,.25-.13,0-4.46-2.38-9-4.53-12.73-.1-.17-.3.18-.23.3Z" fill="#fff"/><path id="_路径_125" data-name="&lt;路径&gt;" d="M193.47,34.86a23.24,23.24,0,0,0,6.6,3.89,21.22,21.22,0,0,0,2.37.76c.1,0,1.13.24.75,0a5.09,5.09,0,0,0-1.48-.17,31.5,31.5,0,0,1-3.1-.6,16,16,0,0,1-6.77-3.13c-.07-.06-.17.12-.11.18,3.05,2.64,7.56,3.65,11.51,3.93.08,0,.14-.19.06-.2a21.67,21.67,0,0,1-9.72-4.81c-.08-.06-.17.12-.11.18Z" fill="#fff"/><path id="_路径_126" data-name="&lt;路径&gt;" d="M197.61,28.46c2.24,3,4.79,6.78,5.41,10.62,0,.26.34,0,.31-.21-.63-3.87-3.19-7.64-5.44-10.71-.14-.19-.39.14-.27.29Z" fill="#fff"/><path id="_路径_127" data-name="&lt;路径&gt;" d="M194.24,31a32.29,32.29,0,0,0,8.91,8.5c.1.06.27-.32.15-.4a32.14,32.14,0,0,1-8.87-8.47c-.08-.1-.27.26-.19.37Z" fill="#fff"/><path id="_路径_128" data-name="&lt;路径&gt;" d="M204.78,38.29l-.25.32-.11-.09c2.33-2.91,3.36-8.57,2.88-15.94h.14C207.9,29.72,207,35.27,204.78,38.29Z" fill="#fff"/><path id="_路径_129" data-name="&lt;路径&gt;" d="M205.79,25.25c.44,4.41.85,9.59-1.69,13.49-.15.24-.15,1,.16.52,2.77-4.24,2.49-9.66,2-14.48,0-.46-.49.22-.47.47Z" fill="#fff"/><path id="_路径_130" data-name="&lt;路径&gt;" d="M203.35,28.08c1.28,3.3,2,6.84.66,10.23-.19.48.28.66.47.18,1.45-3.64.75-7.44-.63-11-.15-.39-.62.3-.5.6Z" fill="#fff"/></g><path id="_路径_131" data-name="&lt;路径&gt;" d="M204.55,40A4.9,4.9,0,0,1,199.47,41c-1-.5-.88-.81.13-.9s1.79.09,1.27-.63-1.16-2.18-.55-2.09,2.26,1.92,2,.92-.41-3.51.2-2.54,1.07,2.2,1.11.73.1-2.16.93-1.33A3.56,3.56,0,0,1,204.55,40Z" fill="#5a7958"/><path id="_路径_132" data-name="&lt;路径&gt;" d="M202.72,40.17A20.05,20.05,0,0,0,216,49.28c.78.14,1.35-1.46.61-1.59A19.26,19.26,0,0,1,203.79,39c-.48-.81-1.45.54-1.07,1.16Z" fill="#5a7958"/></g></g><g id="_编组_33" data-name="&lt;编组&gt;"><g id="_编组_34" data-name="&lt;编组&gt;"><path id="_路径_133" data-name="&lt;路径&gt;" d="M234.54,69.38c-5.94-7.31-12.2-14.85-15.78-23.67-3.29-8.1-3.48-16.79-2.53-25.37,0-.36.67-1.12.59-.39-.95,8.61-.7,17.25,2.68,25.34,3.59,8.58,9.73,16,15.55,23.12.21.26-.29,1.25-.5,1Z" fill="#2d9c9e"/><path id="_路径_134" data-name="&lt;路径&gt;" d="M216.29,22.44C216,16,216.71,7.76,219.72,8s-1.64,8.71-2.55,11.73S216.29,22.44,216.29,22.44Z" fill="#2d9c9e"/><path id="_路径_135" data-name="&lt;路径&gt;" d="M216,26.9c5.29-2.14,10.44-9,7.48-9.58s-6.78,6.07-7.12,7.5A12.17,12.17,0,0,0,216,26.9Z" fill="#2d9c9e"/><path id="_路径_136" data-name="&lt;路径&gt;" d="M216.08,27c-5.29-2.15-10.43-9-7.46-9.59s6.77,6.07,7.11,7.5A12.17,12.17,0,0,1,216.08,27Z" fill="#2d9c9e"/><path id="_路径_137" data-name="&lt;路径&gt;" d="M216.93,39.05c-5.29-2.15-10.43-9-7.46-9.59s6.77,6.07,7.11,7.5A12.17,12.17,0,0,1,216.93,39.05Z" fill="#2d9c9e"/><path id="_路径_138" data-name="&lt;路径&gt;" d="M220.09,47.43c-5.62-1-12-6.74-9.26-7.87s7.86,4.57,8.48,5.91A12.18,12.18,0,0,1,220.09,47.43Z" fill="#2d9c9e"/><path id="_路径_139" data-name="&lt;路径&gt;" d="M224.22,55c-4.53.4-10.67-2.62-8.77-4.09s7,1.85,7.76,2.74A9.69,9.69,0,0,1,224.22,55Z" fill="#2d9c9e"/><path id="_路径_140" data-name="&lt;路径&gt;" d="M228.48,60.82c-4.53.4-10.67-2.62-8.77-4.09s7,1.85,7.76,2.74A9.7,9.7,0,0,1,228.48,60.82Z" fill="#2d9c9e"/><path id="_路径_141" data-name="&lt;路径&gt;" d="M216.92,39.05c4.41-3.63,7.25-11.74,4.26-11.38s-4.65,7.82-4.54,9.29A12.18,12.18,0,0,0,216.92,39.05Z" fill="#2d9c9e"/><path id="_路径_142" data-name="&lt;路径&gt;" d="M220,47.43c3.24-3.92,4.36-11.51,1.8-10.68s-2.75,7.63-2.41,8.9A10.85,10.85,0,0,0,220,47.43Z" fill="#2d9c9e"/><path id="_路径_143" data-name="&lt;路径&gt;" d="M224.12,55c2.51-4.43,2.28-12.09-.1-10.83s-1.37,8-.81,9.18A10.85,10.85,0,0,0,224.12,55Z" fill="#2d9c9e"/><path id="_路径_144" data-name="&lt;路径&gt;" d="M228.49,60.84c2.51-4.43,2.28-12.09-.1-10.83s-1.37,8-.81,9.18A10.86,10.86,0,0,0,228.49,60.84Z" fill="#2d9c9e"/></g><g id="_编组_35" data-name="&lt;编组&gt;"><path id="_路径_145" data-name="&lt;路径&gt;" d="M262.36,107.57c-5.47-11.43-11-23.38-19.71-32.81-8-8.66-18.41-13.89-29.4-17.68-.46-.16-1.75.17-.82.49,11,3.8,21.38,9.07,29.27,17.84,8.37,9.31,13.81,21,19.17,32.2.2.41,1.69.37,1.49,0Z" fill="#a49900"/><path id="_路径_146" data-name="&lt;路径&gt;" d="M215.79,58.38c-7.67-4-18.09-7.93-19.57-4.14s11.53,3,15.73,3.64S215.79,58.38,215.79,58.38Z" fill="#a49900"/><path id="_路径_147" data-name="&lt;路径&gt;" d="M221.36,60.62c-5.65,5.2-17,7.5-15.95,3.58s11.28-4.75,13.21-4.34A16.37,16.37,0,0,1,221.36,60.62Z" fill="#a49900"/><path id="_路径_148" data-name="&lt;路径&gt;" d="M221.4,60.73c.43-7.67-5-17.88-7.37-14.59s3.49,11.73,5,13A16.37,16.37,0,0,0,221.4,60.73Z" fill="#a49900"/><path id="_路径_149" data-name="&lt;路径&gt;" d="M235.61,68.72c.43-7.67-5-17.88-7.37-14.59s3.49,11.73,5,13A16.37,16.37,0,0,0,235.61,68.72Z" fill="#a49900"/><path id="_路径_150" data-name="&lt;路径&gt;" d="M244,77.37c2-7.42-1.26-18.52-4.25-15.78s1,12.19,2.3,13.71A16.38,16.38,0,0,0,244,77.37Z" fill="#a49900"/><path id="_路径_151" data-name="&lt;路径&gt;" d="M250.83,86.76c3.09-5.28,2.95-14.48.08-13s-1.78,9.58-1.13,11A13,13,0,0,0,250.83,86.76Z" fill="#a49900"/><path id="_路径_152" data-name="&lt;路径&gt;" d="M255.44,95.28c3.09-5.28,2.95-14.48.07-13s-1.78,9.58-1.13,11A13,13,0,0,0,255.44,95.28Z" fill="#a49900"/><path id="_路径_153" data-name="&lt;路径&gt;" d="M235.61,68.7c-7,3.27-18.45,2.06-16.29-1.37s12.18-1.15,13.9-.18A16.38,16.38,0,0,1,235.61,68.7Z" fill="#a49900"/><path id="_路径_154" data-name="&lt;路径&gt;" d="M244,77.31c-6.64,1.69-16.5-1.31-14-4s10.86,1.05,12.2,2.19A14.6,14.6,0,0,1,244,77.31Z" fill="#a49900"/><path id="_路径_155" data-name="&lt;路径&gt;" d="M250.9,86.65c-6.83.5-16-4.18-13.12-6.35s10.51,2.94,11.63,4.3A14.59,14.59,0,0,1,250.9,86.65Z" fill="#a49900"/><path id="_路径_156" data-name="&lt;路径&gt;" d="M255.45,95.3c-6.83.5-16-4.18-13.12-6.35s10.51,2.94,11.63,4.3A14.59,14.59,0,0,1,255.45,95.3Z" fill="#a49900"/></g></g><g id="_编组_36" data-name="&lt;编组&gt;"><path id="_路径_157" data-name="&lt;路径&gt;" d="M206.07,48.72c.66,1.2,1.15,3.5-.94,3.41s-1.65-2.33-2.22-1-2.91,1.94-3.86.41,1.3-2.73-.07-2.52-3.4-1.61-2-3.46a2.66,2.66,0,0,1,3.86-.44c.3.41.38.43.53-.92s2.72-2.89,3.5-.9-.63,2.51.78,2,3.06-.54,3.17,1C209,49.12,205.58,47.82,206.07,48.72Z" fill="#f47888"/><circle id="_路径_158" data-name="&lt;路径&gt;" cx="202.39" cy="47.93" r="1.99" transform="translate(-4.13 23.3) rotate(-6.52)" fill="#a45"/></g><g id="_编组_37" data-name="&lt;编组&gt;"><path id="_路径_159" data-name="&lt;路径&gt;" d="M240.22,54.77c.66,1.2,1.15,3.5-.94,3.41s-1.65-2.33-2.22-1-2.91,1.94-3.86.41,1.3-2.73-.07-2.52-3.4-1.61-2-3.46a2.66,2.66,0,0,1,3.86-.44c.3.41.38.43.53-.92s2.72-2.89,3.5-.9-.63,2.51.78,2,3.06-.54,3.17,1C243.14,55.18,239.73,53.88,240.22,54.77Z" fill="#f47888"/><circle id="_路径_160" data-name="&lt;路径&gt;" cx="236.54" cy="53.99" r="1.99" transform="translate(-4.6 27.22) rotate(-6.52)" fill="#a45"/></g><g id="_编组_38" data-name="&lt;编组&gt;"><path id="_路径_161" data-name="&lt;路径&gt;" d="M251.41,103.73c-.51,1.27-2,3.1-3.24,1.42s.77-2.76-.65-2.33-3.34-1-2.76-2.73,2.93-.72,1.91-1.64-.9-3.65,1.4-3.76a2.66,2.66,0,0,1,2.78,2.71c-.13.49-.09.56,1.05-.17s4,.28,2.91,2.15-2.34,1.1-1,1.86,2.35,2,1.21,3.1C252.94,106.25,251.79,102.78,251.41,103.73Z" fill="#f47888"/><circle id="_路径_162" data-name="&lt;路径&gt;" cx="249.69" cy="100.38" r="1.99" transform="translate(3.45 208.94) rotate(-45.69)" fill="#a45"/></g></g><g id="_编组_39" data-name="&lt;编组&gt;"><g id="_编组_40" data-name="&lt;编组&gt;"><g id="_编组_41" data-name="&lt;编组&gt;"><path id="_路径_163" data-name="&lt;路径&gt;" d="M95.51,36.84c-4.15-1-8.16,1.67-10.56,4.91-.08.1.11.51.15.46,2.38-3.22,6.36-5.93,10.49-4.89.08,0,0-.44-.08-.47Z" fill="#3b4437"/><path id="_路径_164" data-name="&lt;路径&gt;" d="M96.09,29.73c-3.87-1.07-7.33-3-8.14-7.3,0-.18-.22-.43-.16-.1.85,4.48,4.17,6.71,8.38,7.87.08,0,0-.44-.08-.47Z" fill="#3b4437"/><path id="_路径_165" data-name="&lt;路径&gt;" d="M95.56,34.53c-3.2-1.42-7-1.28-10.42-.53-.1,0,0,.5.12.48,3.34-.75,7.2-.88,10.37.52.07,0,0-.42-.08-.47Z" fill="#3b4437"/><path id="_路径_166" data-name="&lt;路径&gt;" d="M84.2,27.24a16.39,16.39,0,0,0,11.48,4.92c.24,0,.17-.48,0-.48a16.13,16.13,0,0,1-11.31-4.83c-.2-.21-.28.25-.14.39Z" fill="#3b4437"/><circle id="_路径_167" data-name="&lt;路径&gt;" cx="85.02" cy="41.98" r="1.13" transform="translate(41.04 125.99) rotate(-88.65)" fill="#8dcecc"/><circle id="_路径_168" data-name="&lt;路径&gt;" cx="85.2" cy="34.52" r="1.13" transform="translate(48.67 118.88) rotate(-88.65)" fill="#8dcecc"/><circle id="_路径_169" data-name="&lt;路径&gt;" cx="83.92" cy="27.03" r="1.13" transform="translate(54.92 110.29) rotate(-88.65)" fill="#8dcecc"/><circle id="_路径_170" data-name="&lt;路径&gt;" cx="87.88" cy="22.1" r="1.13" transform="translate(63.71 109.43) rotate(-88.65)" fill="#8dcecc"/></g><g id="_编组_42" data-name="&lt;编组&gt;"><g id="_编组_43" data-name="&lt;编组&gt;"><path id="_路径_171" data-name="&lt;路径&gt;" d="M107.34,33.31c-8.44-4.37-16.76-6.79-14.93-14.47s11.9,2.16,15.25,7.23S111.57,35.5,107.34,33.31Z" fill="#7dbbbc"/><path id="_路径_172" data-name="&lt;路径&gt;" d="M107.12,34c-8.84,3.48-17.37,5-16.34,12.86s12.06-.93,15.91-5.62S111.56,32.24,107.12,34Z" fill="#7dbbbc"/><path id="_路径_173" data-name="&lt;路径&gt;" d="M109.56,34.63c-5.83,5.29-10.75,8-15.39,5s-4.53-9.38-1.42-12.09,11.79,2.08,13.83,3.43S110.79,33.51,109.56,34.63Z" fill="#9ae3e8"/><g id="_编组_44" data-name="&lt;编组&gt;"><path id="_路径_174" data-name="&lt;路径&gt;" d="M99.64,46.78c4.27-2.52,8.57-6.56,10.2-11.4,0-.11-.18-.41-.2-.36-1.63,4.84-5.91,8.85-10.17,11.38-.09.05.1.43.17.39Z" fill="#fff"/><path id="_路径_175" data-name="&lt;路径&gt;" d="M101,44.13a19.54,19.54,0,0,0,8.82-8.76c0-.11-.17-.42-.2-.36a19.46,19.46,0,0,1-8.8,8.73c-.09,0,.1.43.17.39Z" fill="#fff"/><path id="_路径_176" data-name="&lt;路径&gt;" d="M99.09,43.37c4.3-1.77,8.54-4,10.81-8.27.06-.11-.16-.44-.2-.36-2.26,4.22-6.5,6.48-10.78,8.24-.1,0,.07.43.17.39Z" fill="#fff"/><path id="_路径_177" data-name="&lt;路径&gt;" d="M100.16,41.52A18.26,18.26,0,0,0,109.89,35c.1-.13-.12-.49-.23-.35A18.14,18.14,0,0,1,100,41.13c-.16,0,0,.44.17.39Z" fill="#fff"/></g><path id="_路径_178" data-name="&lt;路径&gt;" d="M97.39,28.17c4.09,1.11,9,2.6,12.07,5.69.2.2.2-.16.09-.27-3.16-3.15-8-4.67-12.21-5.8-.19-.05-.08.34,0,.38Z" fill="#fff"/><path id="_路径_179" data-name="&lt;路径&gt;" d="M99.32,37.85a23.24,23.24,0,0,0,7.42-1.91A21.2,21.2,0,0,0,109,34.79c.09-.05,1-.63.51-.56s-.92.74-1.17.93a31.5,31.5,0,0,1-2.62,1.77,16,16,0,0,1-7,2.57c-.1,0,0,.21.05.2,4-.29,7.93-2.77,10.92-5.36.06,0,0-.23-.1-.18a21.67,21.67,0,0,1-10.28,3.47c-.1,0,0,.21.05.2Z" fill="#fff"/><path id="_路径_180" data-name="&lt;路径&gt;" d="M97.72,30.39c3.74.57,8.18,1.41,11.34,3.69.21.15.23-.25.07-.36-3.18-2.3-7.66-3.15-11.42-3.72-.24,0-.18.37,0,.4Z" fill="#fff"/><path id="_路径_181" data-name="&lt;路径&gt;" d="M97.12,34.56a32.28,32.28,0,0,0,12.31-.29c.11,0,0-.42-.17-.39A32.14,32.14,0,0,1,97,34.16c-.13,0,0,.38.12.39Z" fill="#fff"/><path id="_路径_182" data-name="&lt;路径&gt;" d="M109.74,32.27c0,.14,0,.27.05.4l-.14,0c-.41-3.7-3.68-8.43-9.24-13.31l.09-.11C105.89,24,109.15,28.6,109.74,32.27Z" fill="#fff"/><path id="_路径_183" data-name="&lt;路径&gt;" d="M101.24,22.34c3.43,2.8,7.39,6.18,8.35,10.74.06.27.59.79.48.26-1-5-5.07-8.59-8.82-11.66-.36-.29-.19.5,0,.66Z" fill="#fff"/><path id="_路径_184" data-name="&lt;路径&gt;" d="M101.52,26.07c3.24,1.43,6.26,3.42,7.7,6.77.2.48.67.27.46-.21-1.55-3.61-4.73-5.79-8.23-7.33-.38-.17-.22.65.07.78Z" fill="#fff"/></g><path id="_路径_185" data-name="&lt;路径&gt;" d="M110.78,33.64A4.9,4.9,0,0,1,107.93,38c-1,.34-1.19,0-.55-.73s1.33-1.2.45-1.34-2.36-.72-1.87-1.09,3-.24,2-.73-2.77-2.19-1.65-1.94,2.31.8,1.3-.27-1.46-1.6-.28-1.6A3.56,3.56,0,0,1,110.78,33.64Z" fill="#5a7958"/><path id="_路径_186" data-name="&lt;路径&gt;" d="M109.62,35.06a20.05,20.05,0,0,0,15.82-2.93c.65-.45-.08-2-.7-1.55a19.26,19.26,0,0,1-15.19,2.9c-.91-.23-.65,1.41.06,1.58Z" fill="#5a7958"/></g></g><g id="_编组_45" data-name="&lt;编组&gt;"><g id="_编组_46" data-name="&lt;编组&gt;"><path id="_路径_187" data-name="&lt;路径&gt;" d="M152.77,33.21c-9.37-1-19.13-1.88-27.9-5.58-8.06-3.4-14.33-9.41-19.73-16.15-.23-.28-.32-1.27.14-.7,5.42,6.76,11.7,12.69,19.81,16,8.61,3.53,18.17,4.41,27.34,5.35.34,0,.68,1.09.34,1.05Z" fill="#2d9c9e"/><path id="_路径_188" data-name="&lt;路径&gt;" d="M106.68,12.93C101.94,8.57,96.59,2.25,98.88.27s5,7.32,6.49,10.1S106.68,12.93,106.68,12.93Z" fill="#2d9c9e"/><path id="_路径_189" data-name="&lt;路径&gt;" d="M109.64,16.27c2.23-5.26,1-13.76-1.49-12.06s-.5,9.08.27,10.33A12.17,12.17,0,0,0,109.64,16.27Z" fill="#2d9c9e"/><path id="_路径_190" data-name="&lt;路径&gt;" d="M109.73,16.27c-5.26,2.22-13.77,1-12.06-1.5s9.08-.49,10.33.28A12.18,12.18,0,0,1,109.73,16.27Z" fill="#2d9c9e"/><path id="_路径_191" data-name="&lt;路径&gt;" d="M118.88,24.22c-5.26,2.22-13.77,1-12.06-1.5s9.08-.49,10.33.28A12.18,12.18,0,0,1,118.88,24.22Z" fill="#2d9c9e"/><path id="_路径_192" data-name="&lt;路径&gt;" d="M127,27.91c-4.7,3.24-13.28,3.75-12.11,1s8.79-2.33,10.17-1.82A12.17,12.17,0,0,1,127,27.91Z" fill="#2d9c9e"/><path id="_路径_193" data-name="&lt;路径&gt;" d="M135.32,30.35c-2.92,3.48-9.4,5.69-9.09,3.31s6.26-3.64,7.42-3.55A9.69,9.69,0,0,1,135.32,30.35Z" fill="#2d9c9e"/><path id="_路径_194" data-name="&lt;路径&gt;" d="M142.44,31.45c-2.92,3.48-9.4,5.69-9.09,3.31s6.26-3.64,7.42-3.55A9.69,9.69,0,0,1,142.44,31.45Z" fill="#2d9c9e"/><path id="_路径_195" data-name="&lt;路径&gt;" d="M118.87,24.22c.55-5.68-3.18-13.43-5-11.06s2.25,8.82,3.36,9.78A12.17,12.17,0,0,0,118.87,24.22Z" fill="#2d9c9e"/><path id="_路径_196" data-name="&lt;路径&gt;" d="M127,27.95c-.48-5.07-5.05-11.22-6.28-8.83s3.46,7.34,4.59,8A10.85,10.85,0,0,0,127,27.95Z" fill="#2d9c9e"/><path id="_路径_197" data-name="&lt;路径&gt;" d="M135.26,30.43c-1.36-4.91-6.94-10.16-7.73-7.59s4.69,6.62,5.92,7.06A10.86,10.86,0,0,0,135.26,30.43Z" fill="#2d9c9e"/><path id="_路径_198" data-name="&lt;路径&gt;" d="M142.45,31.45c-1.36-4.91-6.94-10.16-7.73-7.59s4.69,6.62,5.92,7.06A10.86,10.86,0,0,0,142.45,31.45Z" fill="#2d9c9e"/></g><g id="_编组_47" data-name="&lt;编组&gt;"><path id="_路径_199" data-name="&lt;路径&gt;" d="M199.45,40.55c-12-4.21-24.34-8.72-37.13-9.26-11.75-.5-22.84,3.2-33.29,8.29-.44.21-1.12,1.36-.23.93,10.47-5.1,21.53-8.71,33.31-8.08,12.5.66,24.63,5.09,36.32,9.22.43.15,1.46-.93,1-1.08Z" fill="#a49900"/><path id="_路径_200" data-name="&lt;路径&gt;" d="M131.73,38.7c-8.27,2.58-18.4,7.18-16.76,10.91s10.28-6,13.7-8.55S131.73,38.7,131.73,38.7Z" fill="#a49900"/><path id="_路径_201" data-name="&lt;路径&gt;" d="M137.26,36.34c-.32,7.67-6.7,17.31-8.75,13.81s4.61-11.33,6.27-12.41A16.37,16.37,0,0,1,137.26,36.34Z" fill="#a49900"/><path id="_路径_202" data-name="&lt;路径&gt;" d="M137.36,36.39c-5.12-5.73-16.17-9.11-15.53-5.11s10.76,5.82,12.73,5.6A16.38,16.38,0,0,0,137.36,36.39Z" fill="#a49900"/><path id="_路径_203" data-name="&lt;路径&gt;" d="M153.06,32c-5.12-5.73-16.17-9.11-15.53-5.11s10.76,5.82,12.73,5.6A16.37,16.37,0,0,0,153.06,32Z" fill="#a49900"/><path id="_路径_204" data-name="&lt;路径&gt;" d="M165.1,32.19c-3.85-6.65-14-12.2-14.17-8.15s9.36,7.89,11.32,8.07A16.38,16.38,0,0,0,165.1,32.19Z" fill="#a49900"/><path id="_路径_205" data-name="&lt;路径&gt;" d="M176.58,34c-1.55-5.92-8.15-12.32-9.15-9.25s5.51,8,7,8.59A13,13,0,0,0,176.58,34Z" fill="#a49900"/><path id="_路径_206" data-name="&lt;路径&gt;" d="M185.87,36.75c-1.55-5.92-8.15-12.32-9.15-9.25s5.51,8,7,8.59A13,13,0,0,0,185.87,36.75Z" fill="#a49900"/><path id="_路径_207" data-name="&lt;路径&gt;" d="M153.05,32c-2.6,7.23-11.59,14.5-12.49,10.55s7.8-9.43,9.7-10A16.37,16.37,0,0,1,153.05,32Z" fill="#a49900"/><path id="_路径_208" data-name="&lt;路径&gt;" d="M165.08,32.13c-3.5,5.89-12.6,10.74-12.71,7.13s8.42-6.94,10.18-7.08A14.61,14.61,0,0,1,165.08,32.13Z" fill="#a49900"/><path id="_路径_209" data-name="&lt;路径&gt;" d="M176.55,33.86c-4.48,5.18-14.28,8.37-13.77,4.79s9.51-5.35,11.26-5.18A14.61,14.61,0,0,1,176.55,33.86Z" fill="#a49900"/><path id="_路径_210" data-name="&lt;路径&gt;" d="M185.89,36.76c-4.48,5.18-14.28,8.37-13.77,4.79s9.51-5.35,11.26-5.18A14.6,14.6,0,0,1,185.89,36.76Z" fill="#a49900"/></g></g><g id="_编组_48" data-name="&lt;编组&gt;"><path id="_路径_211" data-name="&lt;路径&gt;" d="M118,38.73c1.31.38,3.29,1.66,1.74,3.07s-2.82-.48-2.25.88-.69,3.43-2.44,3-1-2.84-1.83-1.73-3.54,1.27-3.88-1a2.66,2.66,0,0,1,2.42-3c.5.08.57,0-.27-1s-.12-4,1.84-3.11,1.33,2.22,2,.85,1.78-2.55,3-1.52C120.38,37,117,38.45,118,38.73Z" fill="#f47888"/><circle id="_路径_212" data-name="&lt;路径&gt;" cx="114.87" cy="40.78" r="1.99" transform="translate(11.47 105.33) rotate(-51.52)" fill="#a45"/></g><g id="_编组_49" data-name="&lt;编组&gt;"><path id="_路径_213" data-name="&lt;路径&gt;" d="M146.46,18.87c1.31.38,3.29,1.66,1.74,3.07s-2.82-.48-2.25.88-.69,3.43-2.44,3-1-2.84-1.83-1.73-3.54,1.27-3.88-1a2.66,2.66,0,0,1,2.42-3c.5.08.57,0-.27-1s-.12-4,1.84-3.11,1.33,2.22,2,.85,1.78-2.55,3-1.52C148.81,17.09,145.48,18.58,146.46,18.87Z" fill="#f47888"/><circle id="_路径_214" data-name="&lt;路径&gt;" cx="143.3" cy="20.92" r="1.99" transform="translate(37.77 120.09) rotate(-51.52)" fill="#a45"/></g><g id="_编组_50" data-name="&lt;编组&gt;"><path id="_路径_215" data-name="&lt;路径&gt;" d="M189,45.57c.54,1.26.79,3.6-1.28,3.29s-1.41-2.49-2.11-1.19-3.09,1.64-3.88,0,1.57-2.58.19-2.51-3.22-1.94-1.67-3.64a2.66,2.66,0,0,1,3.88,0c.25.44.34.46.62-.86s3-2.6,3.58-.54-.88,2.44.58,2.06,3.1-.23,3,1.34C191.85,46.27,188.59,44.63,189,45.57Z" fill="#f47888"/><circle id="_路径_216" data-name="&lt;路径&gt;" cx="185.41" cy="44.42" r="1.99" transform="translate(-0.52 2.23) rotate(-0.69)" fill="#a45"/></g></g><g id="_编组_51" data-name="&lt;编组&gt;"><g id="_编组_52" data-name="&lt;编组&gt;"><g id="_编组_53" data-name="&lt;编组&gt;"><path id="_路径_217" data-name="&lt;路径&gt;" d="M31.45,108.52c-3.67,2.2-4.59,6.95-4,10.94,0,.12.44.28.43.22-.59-4,.3-8.69,4-10.88.07,0-.29-.34-.39-.28Z" fill="#3b4437"/><path id="_路径_218" data-name="&lt;路径&gt;" d="M26.84,103.08c-3.49,2-7.33,3-10.92.59-.15-.1-.46-.15-.18,0,3.77,2.57,7.69,1.8,11.49-.36.08,0-.29-.34-.39-.28Z" fill="#3b4437"/><path id="_路径_219" data-name="&lt;路径&gt;" d="M29.86,106.85c-3.26,1.26-5.89,4.08-7.74,7-.05.08.37.35.42.26,1.84-2.89,4.47-5.72,7.7-7,.07,0-.27-.33-.39-.28Z" fill="#3b4437"/><path id="_路径_220" data-name="&lt;路径&gt;" d="M16.67,109.72a16.39,16.39,0,0,0,11.59-4.64c.17-.17-.22-.46-.36-.32a16.13,16.13,0,0,1-11.41,4.58c-.3,0,0,.37.18.38Z" fill="#3b4437"/><circle id="_路径_221" data-name="&lt;路径&gt;" cx="27.67" cy="119.57" r="1.13" transform="translate(-74.88 52.15) rotate(-43.65)" fill="#8dcecc"/><circle id="_路径_222" data-name="&lt;路径&gt;" cx="22.52" cy="114.17" r="1.13" transform="translate(-72.58 47.1) rotate(-43.65)" fill="#8dcecc"/><circle id="_路径_223" data-name="&lt;路径&gt;" cx="16.32" cy="109.77" r="1.13" transform="translate(-71.25 41.61) rotate(-43.65)" fill="#8dcecc"/><circle id="_路径_224" data-name="&lt;路径&gt;" cx="15.63" cy="103.49" r="1.13" transform="translate(-67.11 39.39) rotate(-43.65)" fill="#8dcecc"/></g><g id="_编组_54" data-name="&lt;编组&gt;"><g id="_编组_55" data-name="&lt;编组&gt;"><path id="_路径_225" data-name="&lt;路径&gt;" d="M37.32,97.65c-9.06,2.87-16.66,7-20.79.33s9.94-6.88,15.9-5.67S41.86,96.21,37.32,97.65Z" fill="#7dbbbc"/><path id="_路径_226" data-name="&lt;路径&gt;" d="M37.65,98.28c-3.79,8.72-8.72,15.85-2.46,20.65s7.87-9.18,7.28-15.23S39.55,93.91,37.65,98.28Z" fill="#7dbbbc"/><path id="_路径_227" data-name="&lt;路径&gt;" d="M39.82,97c-.38,7.87-2,13.23-7.34,14.43s-9.84-3.43-9.55-7.55,9.81-6.86,12.2-7.35S39.9,95.35,39.82,97Z" fill="#9ae3e8"/><g id="_编组_56" data-name="&lt;编组&gt;"><path id="_路径_228" data-name="&lt;路径&gt;" d="M41.4,112.62c1.23-4.8,1.42-10.7-.85-15.28-.05-.11-.42-.16-.4-.11,2.27,4.58,2.08,10.44.85,15.24,0,.1.38.23.4.15Z" fill="#fff"/><path id="_路径_229" data-name="&lt;路径&gt;" d="M40.5,109.78a19.54,19.54,0,0,0,0-12.43c0-.11-.42-.18-.4-.11a19.46,19.46,0,0,1,0,12.4c0,.1.37.24.4.15Z" fill="#fff"/><path id="_路径_230" data-name="&lt;路径&gt;" d="M38.6,110.6c1.79-4.29,3.18-8.9,1.79-13.5,0-.11-.42-.2-.4-.11,1.38,4.58,0,9.18-1.79,13.45,0,.1.36.25.4.15Z" fill="#fff"/><path id="_路径_231" data-name="&lt;路径&gt;" d="M38,108.54A18.25,18.25,0,0,0,40.29,97c0-.16-.43-.26-.41-.08a18.14,18.14,0,0,1-2.23,11.46c-.08.14.31.31.4.15Z" fill="#fff"/></g><path id="_路径_232" data-name="&lt;路径&gt;" d="M26.65,101.06c3.68-2.11,8.18-4.51,12.56-4.51.28,0,0-.25-.13-.25-4.46,0-9,2.38-12.73,4.53-.17.1.18.3.3.23Z" fill="#fff"/><path id="_路径_233" data-name="&lt;路径&gt;" d="M34.86,106.53a23.24,23.24,0,0,0,3.89-6.6,21.21,21.21,0,0,0,.76-2.37c0-.1.24-1.13,0-.75a5.09,5.09,0,0,0-.17,1.48,31.53,31.53,0,0,1-.6,3.1,16,16,0,0,1-3.13,6.77c-.06.07.12.17.18.11,2.64-3.05,3.65-7.56,3.93-11.51,0-.08-.19-.14-.2-.06a21.67,21.67,0,0,1-4.81,9.72c-.06.08.12.17.18.11Z" fill="#fff"/><path id="_路径_234" data-name="&lt;路径&gt;" d="M28.46,102.39c3-2.24,6.78-4.79,10.62-5.41.26,0,0-.34-.21-.31-3.87.63-7.64,3.19-10.71,5.44-.19.14.14.39.29.27Z" fill="#fff"/><path id="_路径_235" data-name="&lt;路径&gt;" d="M31,105.76a32.28,32.28,0,0,0,8.5-8.91c.06-.1-.32-.27-.4-.15a32.14,32.14,0,0,1-8.47,8.87c-.1.08.26.27.37.19Z" fill="#fff"/><path id="_路径_236" data-name="&lt;路径&gt;" d="M38.29,95.22l.32.25-.09.11C35.62,93.25,30,92.22,22.58,92.7v-.14C29.72,92.1,35.27,93,38.29,95.22Z" fill="#fff"/><path id="_路径_237" data-name="&lt;路径&gt;" d="M25.25,94.21c4.41-.44,9.59-.85,13.49,1.69.24.15,1,.15.52-.16C35,93,29.6,93.26,24.78,93.74c-.46,0,.22.49.47.47Z" fill="#fff"/><path id="_路径_238" data-name="&lt;路径&gt;" d="M28.08,96.65c3.3-1.28,6.84-2,10.23-.66.48.19.66-.28.18-.47-3.64-1.45-7.44-.75-11,.63-.39.15.3.62.6.5Z" fill="#fff"/></g><path id="_路径_239" data-name="&lt;路径&gt;" d="M40,95.45A4.9,4.9,0,0,1,41,100.53c-.5,1-.81.88-.9-.13s.09-1.79-.63-1.27-2.18,1.16-2.09.55,1.92-2.26.92-2-3.51.41-2.54-.2,2.2-1.07.73-1.11-2.16-.1-1.33-.93A3.56,3.56,0,0,1,40,95.45Z" fill="#5a7958"/><path id="_路径_240" data-name="&lt;路径&gt;" d="M40.17,97.28A20.05,20.05,0,0,0,49.28,84c.14-.78-1.46-1.35-1.59-.61A19.26,19.26,0,0,1,39,96.21c-.81.48.54,1.45,1.16,1.07Z" fill="#5a7958"/></g></g><g id="_编组_57" data-name="&lt;编组&gt;"><g id="_编组_58" data-name="&lt;编组&gt;"><path id="_路径_241" data-name="&lt;路径&gt;" d="M69.38,65.46c-7.31,5.94-14.85,12.2-23.67,15.78-8.1,3.29-16.79,3.48-25.37,2.53-.36,0-1.12-.67-.39-.59,8.61.95,17.25.7,25.34-2.68,8.58-3.59,16-9.73,23.12-15.55.26-.21,1.25.29,1,.5Z" fill="#2d9c9e"/><path id="_路径_242" data-name="&lt;路径&gt;" d="M22.44,83.71C16,84,7.76,83.29,8,80.28s8.71,1.64,11.73,2.55S22.44,83.71,22.44,83.71Z" fill="#2d9c9e"/><path id="_路径_243" data-name="&lt;路径&gt;" d="M26.9,84c-2.14-5.29-9-10.44-9.58-7.48s6.07,6.78,7.5,7.12A12.17,12.17,0,0,0,26.9,84Z" fill="#2d9c9e"/><path id="_路径_244" data-name="&lt;路径&gt;" d="M27,83.92c-2.15,5.29-9,10.43-9.59,7.46s6.07-6.77,7.5-7.11A12.17,12.17,0,0,1,27,83.92Z" fill="#2d9c9e"/><path id="_路径_245" data-name="&lt;路径&gt;" d="M39.05,83.07c-2.15,5.29-9,10.43-9.59,7.46s6.07-6.77,7.5-7.11A12.17,12.17,0,0,1,39.05,83.07Z" fill="#2d9c9e"/><path id="_路径_246" data-name="&lt;路径&gt;" d="M47.43,79.91c-1,5.62-6.73,12-7.87,9.26s4.57-7.86,5.91-8.48A12.17,12.17,0,0,1,47.43,79.91Z" fill="#2d9c9e"/><path id="_路径_247" data-name="&lt;路径&gt;" d="M55,75.78c.4,4.53-2.62,10.67-4.09,8.77s1.85-7,2.74-7.76A9.69,9.69,0,0,1,55,75.78Z" fill="#2d9c9e"/><path id="_路径_248" data-name="&lt;路径&gt;" d="M60.82,71.52c.4,4.53-2.62,10.67-4.09,8.77s1.85-7,2.74-7.76A9.69,9.69,0,0,1,60.82,71.52Z" fill="#2d9c9e"/><path id="_路径_249" data-name="&lt;路径&gt;" d="M39.05,83.08c-3.63-4.41-11.74-7.25-11.38-4.26s7.82,4.65,9.29,4.54A12.18,12.18,0,0,0,39.05,83.08Z" fill="#2d9c9e"/><path id="_路径_250" data-name="&lt;路径&gt;" d="M47.43,80c-3.92-3.24-11.51-4.36-10.68-1.8s7.63,2.75,8.9,2.41A10.85,10.85,0,0,0,47.43,80Z" fill="#2d9c9e"/><path id="_路径_251" data-name="&lt;路径&gt;" d="M55,75.88c-4.43-2.51-12.09-2.28-10.83.1s8,1.37,9.18.81A10.86,10.86,0,0,0,55,75.88Z" fill="#2d9c9e"/><path id="_路径_252" data-name="&lt;路径&gt;" d="M60.84,71.51C56.4,69,48.74,69.23,50,71.6s8,1.37,9.18.81A10.85,10.85,0,0,0,60.84,71.51Z" fill="#2d9c9e"/></g><g id="_编组_59" data-name="&lt;编组&gt;"><path id="_路径_253" data-name="&lt;路径&gt;" d="M107.57,37.64c-11.43,5.47-23.38,11-32.81,19.71-8.66,8-13.89,18.41-17.68,29.4-.16.46.17,1.75.49.82,3.8-11,9.07-21.38,17.84-29.27,9.31-8.37,21-13.81,32.2-19.17.41-.2.37-1.69,0-1.49Z" fill="#a49900"/><path id="_路径_254" data-name="&lt;路径&gt;" d="M58.38,84.21c-4,7.67-7.93,18.09-4.14,19.57s3-11.53,3.64-15.73S58.38,84.21,58.38,84.21Z" fill="#a49900"/><path id="_路径_255" data-name="&lt;路径&gt;" d="M60.62,78.64c5.2,5.65,7.5,17,3.58,15.95s-4.75-11.28-4.34-13.21A16.37,16.37,0,0,1,60.62,78.64Z" fill="#a49900"/><path id="_路径_256" data-name="&lt;路径&gt;" d="M60.73,78.6c-7.67-.43-17.88,5-14.59,7.37s11.73-3.49,13-5A16.37,16.37,0,0,0,60.73,78.6Z" fill="#a49900"/><path id="_路径_257" data-name="&lt;路径&gt;" d="M68.72,64.39c-7.67-.43-17.88,5-14.59,7.37s11.73-3.49,13-5A16.38,16.38,0,0,0,68.72,64.39Z" fill="#a49900"/><path id="_路径_258" data-name="&lt;路径&gt;" d="M77.37,56C70,54,58.85,57.28,61.59,60.27s12.19-1,13.71-2.3A16.38,16.38,0,0,0,77.37,56Z" fill="#a49900"/><path id="_路径_259" data-name="&lt;路径&gt;" d="M86.76,49.17c-5.28-3.09-14.48-2.95-13-.08s9.58,1.78,11,1.13A13,13,0,0,0,86.76,49.17Z" fill="#a49900"/><path id="_路径_260" data-name="&lt;路径&gt;" d="M95.28,44.56c-5.28-3.09-14.48-2.95-13-.08s9.58,1.78,11,1.13A13,13,0,0,0,95.28,44.56Z" fill="#a49900"/><path id="_路径_261" data-name="&lt;路径&gt;" d="M68.7,64.39c3.27,7,2.06,18.45-1.37,16.29s-1.15-12.18-.18-13.9A16.37,16.37,0,0,1,68.7,64.39Z" fill="#a49900"/><path id="_路径_262" data-name="&lt;路径&gt;" d="M77.31,56c1.69,6.64-1.31,16.5-4,14s1.05-10.86,2.19-12.2A14.6,14.6,0,0,1,77.31,56Z" fill="#a49900"/><path id="_路径_263" data-name="&lt;路径&gt;" d="M86.65,49.1c.5,6.83-4.18,16-6.35,13.12s2.94-10.51,4.3-11.63A14.6,14.6,0,0,1,86.65,49.1Z" fill="#a49900"/><path id="_路径_264" data-name="&lt;路径&gt;" d="M95.3,44.55c.5,6.83-4.18,16-6.35,13.12S91.89,47.16,93.25,46A14.6,14.6,0,0,1,95.3,44.55Z" fill="#a49900"/></g></g><g id="_编组_60" data-name="&lt;编组&gt;"><path id="_路径_265" data-name="&lt;路径&gt;" d="M48.72,93.93c1.2-.66,3.5-1.15,3.41.94s-2.33,1.65-1,2.22,1.94,2.91.41,3.86-2.73-1.3-2.52.07-1.61,3.4-3.46,2a2.66,2.66,0,0,1-.44-3.86c.41-.3.43-.38-.92-.53s-2.89-2.72-.9-3.5,2.51.63,2-.78-.54-3.06,1-3.17C49.12,91,47.82,94.42,48.72,93.93Z" fill="#f47888"/><circle id="_路径_266" data-name="&lt;路径&gt;" cx="47.93" cy="97.61" r="1.99" transform="translate(-10.78 6.08) rotate(-6.52)" fill="#a45"/></g><g id="_编组_61" data-name="&lt;编组&gt;"><path id="_路径_267" data-name="&lt;路径&gt;" d="M54.77,59.78c1.2-.66,3.5-1.15,3.41.94s-2.33,1.65-1,2.22,1.94,2.91.41,3.86-2.73-1.3-2.52.07-1.61,3.4-3.46,2A2.66,2.66,0,0,1,51.22,65c.41-.3.43-.38-.92-.53s-2.89-2.72-.9-3.5,2.51.63,2-.78-.54-3.06,1-3.17C55.18,56.86,53.88,60.27,54.77,59.78Z" fill="#f47888"/><circle id="_路径_268" data-name="&lt;路径&gt;" cx="53.99" cy="63.46" r="1.99" transform="translate(-6.86 6.54) rotate(-6.52)" fill="#a45"/></g><g id="_编组_62" data-name="&lt;编组&gt;"><path id="_路径_269" data-name="&lt;路径&gt;" d="M103.73,48.59c1.27.51,3.1,2,1.42,3.24s-2.76-.77-2.33.65-1,3.34-2.73,2.76-.72-2.93-1.64-1.91-3.65.9-3.76-1.4a2.66,2.66,0,0,1,2.71-2.78c.49.13.56.09-.17-1.05s.28-4,2.15-2.91,1.1,2.34,1.86,1,2-2.35,3.1-1.21C106.25,47.06,102.78,48.21,103.73,48.59Z" fill="#f47888"/><circle id="_路径_270" data-name="&lt;路径&gt;" cx="100.38" cy="50.31" r="1.99" transform="translate(-5.74 86.99) rotate(-45.69)" fill="#a45"/></g></g><g id="_编组_63" data-name="&lt;编组&gt;"><g id="_编组_64" data-name="&lt;编组&gt;"><g id="_编组_65" data-name="&lt;编组&gt;"><path id="_路径_271" data-name="&lt;路径&gt;" d="M36.84,204.49c-1,4.15,1.67,8.16,4.91,10.56.1.08.51-.11.46-.15-3.22-2.38-5.93-6.36-4.89-10.49,0-.08-.44,0-.47.08Z" fill="#3b4437"/><path id="_路径_272" data-name="&lt;路径&gt;" d="M29.73,203.91c-1.07,3.87-3,7.33-7.3,8.14-.18,0-.43.22-.1.16,4.48-.85,6.71-4.17,7.87-8.38,0-.08-.44,0-.47.08Z" fill="#3b4437"/><path id="_路径_273" data-name="&lt;路径&gt;" d="M34.53,204.44c-1.42,3.2-1.28,7-.53,10.42,0,.1.5,0,.48-.12-.75-3.34-.88-7.2.52-10.37,0-.07-.42,0-.47.08Z" fill="#3b4437"/><path id="_路径_274" data-name="&lt;路径&gt;" d="M27.24,215.8a16.4,16.4,0,0,0,4.92-11.48c0-.24-.48-.17-.48,0a16.13,16.13,0,0,1-4.83,11.31c-.21.2.25.28.39.14Z" fill="#3b4437"/><circle id="_路径_275" data-name="&lt;路径&gt;" cx="41.98" cy="214.98" r="1.13" transform="translate(-173.93 251.87) rotate(-88.65)" fill="#8dcecc"/><circle id="_路径_276" data-name="&lt;路径&gt;" cx="34.52" cy="214.8" r="1.13" transform="translate(-181.03 244.24) rotate(-88.65)" fill="#8dcecc"/><circle id="_路径_277" data-name="&lt;路径&gt;" cx="27.03" cy="216.08" r="1.13" transform="translate(-189.62 238) rotate(-88.65)" fill="#8dcecc"/><circle id="_路径_278" data-name="&lt;路径&gt;" cx="22.1" cy="212.12" r="1.13" transform="matrix(0.02, -1, 1, 0.02, -190.49, 229.21)" fill="#8dcecc"/></g><g id="_编组_66" data-name="&lt;编组&gt;"><g id="_编组_67" data-name="&lt;编组&gt;"><path id="_路径_279" data-name="&lt;路径&gt;" d="M33.31,192.66c-4.37,8.44-6.79,16.76-14.47,14.93s2.16-11.9,7.23-15.25S35.5,188.43,33.31,192.66Z" fill="#7dbbbc"/><path id="_路径_280" data-name="&lt;路径&gt;" d="M34,192.88c3.48,8.84,5,17.37,12.86,16.34s-.93-12.06-5.62-15.91S32.24,188.44,34,192.88Z" fill="#7dbbbc"/><path id="_路径_281" data-name="&lt;路径&gt;" d="M34.63,190.44c5.29,5.83,8,10.75,5,15.39s-9.38,4.53-12.09,1.42,2.08-11.79,3.43-13.83S33.51,189.21,34.63,190.44Z" fill="#9ae3e8"/><g id="_编组_68" data-name="&lt;编组&gt;"><path id="_路径_282" data-name="&lt;路径&gt;" d="M46.78,200.36c-2.52-4.27-6.56-8.57-11.4-10.2-.11,0-.41.18-.36.2,4.84,1.63,8.85,5.91,11.38,10.17.05.09.43-.1.39-.17Z" fill="#fff"/><path id="_路径_283" data-name="&lt;路径&gt;" d="M44.13,199a19.54,19.54,0,0,0-8.76-8.82c-.11,0-.42.17-.36.2a19.46,19.46,0,0,1,8.73,8.8c0,.09.43-.1.39-.17Z" fill="#fff"/><path id="_路径_284" data-name="&lt;路径&gt;" d="M43.37,200.91c-1.77-4.3-4-8.54-8.27-10.81-.11-.06-.44.16-.36.2,4.22,2.26,6.48,6.5,8.24,10.78,0,.1.43-.07.39-.17Z" fill="#fff"/><path id="_路径_285" data-name="&lt;路径&gt;" d="M41.52,199.84A18.26,18.26,0,0,0,35,190.11c-.13-.1-.49.12-.35.23A18.14,18.14,0,0,1,41.13,200c0,.16.44,0,.39-.17Z" fill="#fff"/></g><path id="_路径_286" data-name="&lt;路径&gt;" d="M28.17,202.61c1.11-4.09,2.6-9,5.69-12.07.2-.2-.16-.2-.27-.09-3.15,3.16-4.67,8-5.8,12.21-.05.19.34.08.38,0Z" fill="#fff"/><path id="_路径_287" data-name="&lt;路径&gt;" d="M37.85,200.68a23.24,23.24,0,0,0-1.91-7.42A21.21,21.21,0,0,0,34.79,191c-.05-.09-.63-1-.56-.51s.74.92.93,1.17a31.5,31.5,0,0,1,1.77,2.62,16,16,0,0,1,2.57,7c0,.1.21,0,.2-.05-.29-4-2.77-7.93-5.36-10.92,0-.06-.23,0-.18.1a21.67,21.67,0,0,1,3.47,10.28c0,.1.21,0,.2-.05Z" fill="#fff"/><path id="_路径_288" data-name="&lt;路径&gt;" d="M30.39,202.28c.57-3.74,1.41-8.18,3.69-11.34.15-.21-.25-.23-.36-.07-2.3,3.18-3.15,7.66-3.72,11.42,0,.24.37.18.4,0Z" fill="#fff"/><path id="_路径_289" data-name="&lt;路径&gt;" d="M34.56,202.88a32.28,32.28,0,0,0-.29-12.31c0-.11-.42,0-.39.17A32.14,32.14,0,0,1,34.16,203c0,.13.38,0,.39-.12Z" fill="#fff"/><path id="_路径_290" data-name="&lt;路径&gt;" d="M32.27,190.26l.4-.05,0,.14c-3.7.41-8.43,3.68-13.31,9.24l-.11-.09C24,194.11,28.6,190.85,32.27,190.26Z" fill="#fff"/><path id="_路径_291" data-name="&lt;路径&gt;" d="M22.34,198.76c2.8-3.43,6.18-7.39,10.74-8.35.28-.06.79-.59.26-.48-5,1-8.59,5.07-11.66,8.82-.29.36.5.19.66,0Z" fill="#fff"/><path id="_路径_292" data-name="&lt;路径&gt;" d="M26.07,198.48c1.43-3.24,3.42-6.26,6.77-7.7.48-.2.27-.67-.21-.46-3.61,1.55-5.79,4.73-7.33,8.23-.17.38.65.22.78-.07Z" fill="#fff"/></g><path id="_路径_293" data-name="&lt;路径&gt;" d="M33.64,189.22A4.9,4.9,0,0,1,38,192.07c.34,1,0,1.19-.73.55s-1.2-1.33-1.34-.45-.72,2.36-1.09,1.87-.24-3-.74-2-2.19,2.77-1.94,1.65.8-2.31-.27-1.3-1.6,1.46-1.6.28A3.56,3.56,0,0,1,33.64,189.22Z" fill="#5a7958"/><path id="_路径_294" data-name="&lt;路径&gt;" d="M35.06,190.38a20.05,20.05,0,0,0-2.93-15.82c-.45-.65-2,.08-1.55.7a19.26,19.26,0,0,1,2.9,15.19c-.23.91,1.41.65,1.58-.06Z" fill="#5a7958"/></g></g><g id="_编组_69" data-name="&lt;编组&gt;"><g id="_编组_70" data-name="&lt;编组&gt;"><path id="_路径_295" data-name="&lt;路径&gt;" d="M33.21,147.23c-1,9.37-1.88,19.13-5.58,27.9-3.4,8.06-9.41,14.33-16.15,19.73-.28.23-1.27.32-.7-.14,6.76-5.42,12.69-11.7,16-19.81,3.53-8.61,4.41-18.17,5.35-27.34,0-.34,1.09-.68,1.05-.34Z" fill="#2d9c9e"/><path id="_路径_296" data-name="&lt;路径&gt;" d="M12.93,193.32c-4.36,4.73-10.68,10.08-12.66,7.8s7.32-5,10.1-6.49S12.93,193.32,12.93,193.32Z" fill="#2d9c9e"/><path id="_路径_297" data-name="&lt;路径&gt;" d="M16.27,190.36c-5.26-2.23-13.76-1-12.06,1.49s9.08.5,10.33-.27A12.16,12.16,0,0,0,16.27,190.36Z" fill="#2d9c9e"/><path id="_路径_298" data-name="&lt;路径&gt;" d="M16.27,190.27c2.22,5.26,1,13.77-1.5,12.06s-.49-9.08.28-10.33A12.18,12.18,0,0,1,16.27,190.27Z" fill="#2d9c9e"/><path id="_路径_299" data-name="&lt;路径&gt;" d="M24.22,181.12c2.22,5.26,1,13.77-1.5,12.06s-.49-9.08.28-10.33A12.17,12.17,0,0,1,24.22,181.12Z" fill="#2d9c9e"/><path id="_路径_300" data-name="&lt;路径&gt;" d="M27.91,173c3.24,4.7,3.75,13.28,1,12.11s-2.33-8.79-1.82-10.17A12.17,12.17,0,0,1,27.91,173Z" fill="#2d9c9e"/><path id="_路径_301" data-name="&lt;路径&gt;" d="M30.35,164.68c3.48,2.92,5.69,9.4,3.31,9.09s-3.64-6.26-3.55-7.42A9.69,9.69,0,0,1,30.35,164.68Z" fill="#2d9c9e"/><path id="_路径_302" data-name="&lt;路径&gt;" d="M31.45,157.56c3.48,2.92,5.69,9.4,3.31,9.09s-3.64-6.26-3.55-7.42A9.68,9.68,0,0,1,31.45,157.56Z" fill="#2d9c9e"/><path id="_路径_303" data-name="&lt;路径&gt;" d="M24.22,181.13c-5.68-.55-13.43,3.18-11.06,5s8.82-2.25,9.78-3.36A12.18,12.18,0,0,0,24.22,181.13Z" fill="#2d9c9e"/><path id="_路径_304" data-name="&lt;路径&gt;" d="M27.95,173c-5.07.48-11.22,5.05-8.83,6.28s7.34-3.46,8-4.59A10.86,10.86,0,0,0,27.95,173Z" fill="#2d9c9e"/><path id="_路径_305" data-name="&lt;路径&gt;" d="M30.43,164.74c-4.91,1.36-10.16,6.94-7.59,7.73s6.62-4.69,7.06-5.92A10.85,10.85,0,0,0,30.43,164.74Z" fill="#2d9c9e"/><path id="_路径_306" data-name="&lt;路径&gt;" d="M31.45,157.55c-4.91,1.36-10.16,6.94-7.59,7.73s6.62-4.69,7.06-5.92A10.85,10.85,0,0,0,31.45,157.55Z" fill="#2d9c9e"/></g><g id="_编组_71" data-name="&lt;编组&gt;"><path id="_路径_307" data-name="&lt;路径&gt;" d="M40.55,100.55c-4.21,12-8.72,24.34-9.26,37.13-.5,11.75,3.2,22.84,8.29,33.29.21.44,1.36,1.12.93.23-5.1-10.47-8.71-21.53-8.08-33.31.66-12.5,5.09-24.63,9.22-36.32.15-.43-.93-1.46-1.08-1Z" fill="#a49900"/><path id="_路径_308" data-name="&lt;路径&gt;" d="M38.7,168.27c2.58,8.27,7.18,18.4,10.91,16.76s-6-10.28-8.55-13.7S38.7,168.27,38.7,168.27Z" fill="#a49900"/><path id="_路径_309" data-name="&lt;路径&gt;" d="M36.34,162.74c7.67.32,17.31,6.7,13.81,8.75s-11.33-4.61-12.41-6.27A16.37,16.37,0,0,1,36.34,162.74Z" fill="#a49900"/><path id="_路径_310" data-name="&lt;路径&gt;" d="M36.39,162.64c-5.73,5.12-9.11,16.17-5.11,15.53s5.82-10.76,5.6-12.73A16.38,16.38,0,0,0,36.39,162.64Z" fill="#a49900"/><path id="_路径_311" data-name="&lt;路径&gt;" d="M32,146.94c-5.73,5.12-9.11,16.17-5.11,15.53s5.82-10.76,5.6-12.73A16.38,16.38,0,0,0,32,146.94Z" fill="#a49900"/><path id="_路径_312" data-name="&lt;路径&gt;" d="M32.19,134.9c-6.65,3.85-12.2,14-8.15,14.17s7.89-9.36,8.07-11.32A16.38,16.38,0,0,0,32.19,134.9Z" fill="#a49900"/><path id="_路径_313" data-name="&lt;路径&gt;" d="M34,123.42c-5.92,1.55-12.32,8.15-9.25,9.15s8-5.51,8.59-7A13,13,0,0,0,34,123.42Z" fill="#a49900"/><path id="_路径_314" data-name="&lt;路径&gt;" d="M36.75,114.13c-5.92,1.55-12.32,8.15-9.25,9.15s8-5.51,8.59-7A13,13,0,0,0,36.75,114.13Z" fill="#a49900"/><path id="_路径_315" data-name="&lt;路径&gt;" d="M32,146.95c7.23,2.6,14.5,11.59,10.55,12.49s-9.43-7.8-10-9.7A16.38,16.38,0,0,1,32,146.95Z" fill="#a49900"/><path id="_路径_316" data-name="&lt;路径&gt;" d="M32.13,134.92c5.89,3.5,10.74,12.6,7.13,12.71s-6.94-8.42-7.08-10.18A14.59,14.59,0,0,1,32.13,134.92Z" fill="#a49900"/><path id="_路径_317" data-name="&lt;路径&gt;" d="M33.86,123.45c5.18,4.48,8.37,14.28,4.79,13.77S33.29,127.7,33.46,126A14.59,14.59,0,0,1,33.86,123.45Z" fill="#a49900"/><path id="_路径_318" data-name="&lt;路径&gt;" d="M36.76,114.11c5.18,4.48,8.37,14.28,4.79,13.77s-5.35-9.51-5.18-11.26A14.59,14.59,0,0,1,36.76,114.11Z" fill="#a49900"/></g></g><g id="_编组_72" data-name="&lt;编组&gt;"><path id="_路径_319" data-name="&lt;路径&gt;" d="M38.73,182c.38-1.31,1.66-3.29,3.07-1.74s-.48,2.82.88,2.25,3.43.69,3,2.44-2.85,1-1.73,1.83,1.27,3.54-1,3.88a2.66,2.66,0,0,1-3-2.42c.08-.5,0-.57-1,.27s-4,.12-3.11-1.84,2.22-1.33.85-2-2.55-1.78-1.52-3C37,179.62,38.45,183,38.73,182Z" fill="#f47888"/><circle id="_路径_320" data-name="&lt;路径&gt;" cx="40.78" cy="185.13" r="1.99" transform="translate(-129.53 101.87) rotate(-51.52)" fill="#a45"/></g><g id="_编组_73" data-name="&lt;编组&gt;"><path id="_路径_321" data-name="&lt;路径&gt;" d="M18.87,153.54c.38-1.31,1.66-3.29,3.07-1.74s-.48,2.82.88,2.25,3.43.69,3,2.44-2.84,1-1.73,1.83,1.27,3.54-1,3.88a2.66,2.66,0,0,1-3-2.42c.08-.5,0-.57-1,.27s-4,.12-3.11-1.84,2.22-1.33.85-2-2.55-1.78-1.52-3C17.09,151.19,18.58,154.52,18.87,153.54Z" fill="#f47888"/><circle id="_路径_322" data-name="&lt;路径&gt;" cx="20.92" cy="156.7" r="1.99" transform="translate(-114.77 75.58) rotate(-51.52)" fill="#a45"/></g><g id="_编组_74" data-name="&lt;编组&gt;"><path id="_路径_323" data-name="&lt;路径&gt;" d="M45.57,111c1.26-.54,3.6-.79,3.29,1.28s-2.49,1.41-1.19,2.11,1.64,3.09,0,3.88-2.58-1.57-2.51-.19-1.94,3.22-3.64,1.67a2.66,2.66,0,0,1,0-3.88c.44-.25.46-.34-.86-.62s-2.6-3-.54-3.58,2.44.88,2.06-.58-.23-3.1,1.34-3C46.27,108.15,44.63,111.41,45.57,111Z" fill="#f47888"/><circle id="_路径_324" data-name="&lt;路径&gt;" cx="44.42" cy="114.59" r="1.99" transform="translate(-1.37 0.54) rotate(-0.69)" fill="#a45"/></g></g><g id="_编组_75" data-name="&lt;编组&gt;"><g id="_编组_76" data-name="&lt;编组&gt;"><g id="_编组_77" data-name="&lt;编组&gt;"><path id="_路径_325" data-name="&lt;路径&gt;" d="M108.52,268.55c2.2,3.67,6.95,4.59,10.94,4,.12,0,.28-.44.22-.43-4,.59-8.69-.3-10.88-4,0-.07-.34.29-.28.39Z" fill="#3b4437"/><path id="_路径_326" data-name="&lt;路径&gt;" d="M103.08,273.16c2,3.49,3,7.33.59,10.92-.1.15-.15.46,0,.18,2.57-3.77,1.8-7.69-.36-11.49,0-.08-.34.29-.28.39Z" fill="#3b4437"/><path id="_路径_327" data-name="&lt;路径&gt;" d="M106.85,270.14c1.26,3.26,4.08,5.89,7,7.74.08.05.35-.37.26-.42-2.89-1.84-5.72-4.47-7-7.7,0-.07-.33.27-.28.39Z" fill="#3b4437"/><path id="_路径_328" data-name="&lt;路径&gt;" d="M109.72,283.33a16.4,16.4,0,0,0-4.64-11.59c-.17-.17-.46.22-.32.36a16.13,16.13,0,0,1,4.58,11.41c0,.3.37,0,.38-.18Z" fill="#3b4437"/><circle id="_路径_329" data-name="&lt;路径&gt;" cx="119.57" cy="272.33" r="1.13" transform="translate(-154.92 157.8) rotate(-43.65)" fill="#8dcecc"/><circle id="_路径_330" data-name="&lt;路径&gt;" cx="114.17" cy="277.48" r="1.13" transform="translate(-159.96 155.49) rotate(-43.65)" fill="#8dcecc"/><circle id="_路径_331" data-name="&lt;路径&gt;" cx="109.77" cy="283.68" r="1.13" transform="translate(-165.46 154.17) rotate(-43.65)" fill="#8dcecc"/><circle id="_路径_332" data-name="&lt;路径&gt;" cx="103.49" cy="284.37" r="1.13" transform="translate(-167.67 150.03) rotate(-43.65)" fill="#8dcecc"/></g><g id="_编组_78" data-name="&lt;编组&gt;"><g id="_编组_79" data-name="&lt;编组&gt;"><path id="_路径_333" data-name="&lt;路径&gt;" d="M97.65,262.68c2.87,9.06,7,16.66.33,20.79s-6.88-9.94-5.67-15.9S96.21,258.14,97.65,262.68Z" fill="#7dbbbc"/><path id="_路径_334" data-name="&lt;路径&gt;" d="M98.28,262.35c8.72,3.79,15.85,8.72,20.65,2.46s-9.18-7.87-15.23-7.28S93.91,260.45,98.28,262.35Z" fill="#7dbbbc"/><path id="_路径_335" data-name="&lt;路径&gt;" d="M97,260.18c7.87.38,13.23,2,14.43,7.34s-3.43,9.84-7.55,9.55-6.86-9.81-7.35-12.2S95.35,260.1,97,260.18Z" fill="#9ae3e8"/><g id="_编组_80" data-name="&lt;编组&gt;"><path id="_路径_336" data-name="&lt;路径&gt;" d="M112.62,258.6c-4.8-1.23-10.7-1.42-15.28.85-.11.05-.16.42-.11.4,4.58-2.27,10.44-2.08,15.24-.85.1,0,.23-.38.15-.4Z" fill="#fff"/><path id="_路径_337" data-name="&lt;路径&gt;" d="M109.78,259.5a19.54,19.54,0,0,0-12.43,0c-.11,0-.18.42-.11.4a19.46,19.46,0,0,1,12.4,0c.1,0,.24-.37.15-.4Z" fill="#fff"/><path id="_路径_338" data-name="&lt;路径&gt;" d="M110.6,261.4c-4.29-1.79-8.9-3.18-13.5-1.79-.11,0-.2.42-.11.4,4.58-1.38,9.18,0,13.45,1.79.1,0,.25-.36.15-.4Z" fill="#fff"/><path id="_路径_339" data-name="&lt;路径&gt;" d="M108.54,262A18.26,18.26,0,0,0,97,259.71c-.16,0-.26.43-.08.41a18.14,18.14,0,0,1,11.46,2.23c.14.08.31-.31.15-.4Z" fill="#fff"/></g><path id="_路径_340" data-name="&lt;路径&gt;" d="M101.06,273.35c-2.11-3.68-4.51-8.18-4.51-12.56,0-.28-.25,0-.25.13,0,4.46,2.38,9,4.53,12.73.1.17.3-.18.23-.3Z" fill="#fff"/><path id="_路径_341" data-name="&lt;路径&gt;" d="M106.53,265.14a23.24,23.24,0,0,0-6.6-3.89,21.22,21.22,0,0,0-2.37-.76c-.1,0-1.13-.24-.75,0a5.09,5.09,0,0,0,1.48.17,31.5,31.5,0,0,1,3.1.6,16,16,0,0,1,6.77,3.13c.07.06.17-.12.11-.18-3.05-2.64-7.56-3.65-11.51-3.93-.08,0-.14.19-.06.2a21.67,21.67,0,0,1,9.72,4.81c.08.06.17-.12.11-.18Z" fill="#fff"/><path id="_路径_342" data-name="&lt;路径&gt;" d="M102.39,271.54c-2.24-3-4.79-6.78-5.41-10.62,0-.26-.34,0-.31.21.63,3.87,3.19,7.64,5.44,10.71.14.19.39-.14.27-.29Z" fill="#fff"/><path id="_路径_343" data-name="&lt;路径&gt;" d="M105.76,269a32.28,32.28,0,0,0-8.91-8.5c-.1-.06-.27.32-.15.4a32.14,32.14,0,0,1,8.87,8.47c.08.1.27-.26.19-.37Z" fill="#fff"/><path id="_路径_344" data-name="&lt;路径&gt;" d="M95.22,261.71l.25-.32.11.09c-2.33,2.91-3.36,8.57-2.88,15.94h-.14C92.1,270.28,93,264.73,95.22,261.71Z" fill="#fff"/><path id="_路径_345" data-name="&lt;路径&gt;" d="M94.21,274.75c-.44-4.41-.85-9.59,1.69-13.49.15-.24.15-1-.16-.52-2.77,4.24-2.49,9.66-2,14.48,0,.46.49-.22.47-.47Z" fill="#fff"/><path id="_路径_346" data-name="&lt;路径&gt;" d="M96.65,271.92c-1.28-3.3-2-6.84-.66-10.23.19-.48-.28-.66-.47-.18-1.45,3.64-.75,7.44.63,11,.15.39.62-.3.5-.6Z" fill="#fff"/></g><path id="_路径_347" data-name="&lt;路径&gt;" d="M95.45,260a4.9,4.9,0,0,1,5.08-1.05c1,.5.88.81-.13.9s-1.79-.09-1.27.63,1.16,2.18.55,2.09-2.26-1.92-2-.92.41,3.51-.2,2.54-1.07-2.2-1.11-.73-.1,2.16-.93,1.33A3.56,3.56,0,0,1,95.45,260Z" fill="#5a7958"/><path id="_路径_348" data-name="&lt;路径&gt;" d="M97.28,259.83A20.05,20.05,0,0,0,84,250.72c-.78-.14-1.35,1.46-.61,1.59A19.26,19.26,0,0,1,96.21,261c.48.81,1.45-.54,1.07-1.16Z" fill="#5a7958"/></g></g><g id="_编组_81" data-name="&lt;编组&gt;"><g id="_编组_82" data-name="&lt;编组&gt;"><path id="_路径_349" data-name="&lt;路径&gt;" d="M65.46,230.62c5.94,7.31,12.2,14.85,15.78,23.67,3.29,8.1,3.48,16.79,2.53,25.37,0,.36-.67,1.12-.59.39.95-8.61.7-17.25-2.68-25.34-3.59-8.58-9.73-16-15.55-23.12-.21-.26.29-1.25.5-1Z" fill="#2d9c9e"/><path id="_路径_350" data-name="&lt;路径&gt;" d="M83.71,277.56C84,284,83.29,292.24,80.28,292s1.64-8.71,2.55-11.73S83.71,277.56,83.71,277.56Z" fill="#2d9c9e"/><path id="_路径_351" data-name="&lt;路径&gt;" d="M84,273.1c-5.29,2.14-10.44,9-7.48,9.58s6.78-6.07,7.12-7.5A12.17,12.17,0,0,0,84,273.1Z" fill="#2d9c9e"/><path id="_路径_352" data-name="&lt;路径&gt;" d="M83.92,273c5.29,2.15,10.43,9,7.46,9.59s-6.77-6.08-7.11-7.5A12.17,12.17,0,0,1,83.92,273Z" fill="#2d9c9e"/><path id="_路径_353" data-name="&lt;路径&gt;" d="M83.07,260.95c5.29,2.15,10.43,9,7.46,9.59s-6.77-6.08-7.11-7.5A12.17,12.17,0,0,1,83.07,260.95Z" fill="#2d9c9e"/><path id="_路径_354" data-name="&lt;路径&gt;" d="M79.91,252.57c5.62,1,12,6.73,9.26,7.87s-7.86-4.57-8.48-5.91A12.17,12.17,0,0,1,79.91,252.57Z" fill="#2d9c9e"/><path id="_路径_355" data-name="&lt;路径&gt;" d="M75.78,245c4.53-.4,10.67,2.62,8.77,4.09s-7-1.85-7.76-2.74A9.69,9.69,0,0,1,75.78,245Z" fill="#2d9c9e"/><path id="_路径_356" data-name="&lt;路径&gt;" d="M71.52,239.18c4.53-.4,10.67,2.62,8.77,4.09s-7-1.85-7.76-2.74A9.69,9.69,0,0,1,71.52,239.18Z" fill="#2d9c9e"/><path id="_路径_357" data-name="&lt;路径&gt;" d="M83.08,260.95c-4.41,3.63-7.25,11.74-4.26,11.38s4.65-7.82,4.54-9.29A12.18,12.18,0,0,0,83.08,260.95Z" fill="#2d9c9e"/><path id="_路径_358" data-name="&lt;路径&gt;" d="M80,252.57c-3.24,3.92-4.36,11.51-1.8,10.68s2.75-7.63,2.41-8.9A10.85,10.85,0,0,0,80,252.57Z" fill="#2d9c9e"/><path id="_路径_359" data-name="&lt;路径&gt;" d="M75.88,245c-2.51,4.43-2.28,12.09.1,10.83s1.37-8,.81-9.18A10.85,10.85,0,0,0,75.88,245Z" fill="#2d9c9e"/><path id="_路径_360" data-name="&lt;路径&gt;" d="M71.51,239.16c-2.51,4.43-2.28,12.09.1,10.83s1.37-8,.81-9.18A10.85,10.85,0,0,0,71.51,239.16Z" fill="#2d9c9e"/></g><g id="_编组_83" data-name="&lt;编组&gt;"><path id="_路径_361" data-name="&lt;路径&gt;" d="M37.64,192.43c5.47,11.43,11,23.38,19.71,32.81,8,8.66,18.41,13.89,29.4,17.68.46.16,1.75-.17.82-.49-11-3.8-21.38-9.07-29.27-17.84-8.37-9.31-13.81-21-19.17-32.2-.2-.41-1.69-.37-1.49,0Z" fill="#a49900"/><path id="_路径_362" data-name="&lt;路径&gt;" d="M84.21,241.62c7.67,4,18.09,7.93,19.57,4.14s-11.53-3-15.73-3.64S84.21,241.62,84.21,241.62Z" fill="#a49900"/><path id="_路径_363" data-name="&lt;路径&gt;" d="M78.64,239.38c5.65-5.2,17-7.5,15.95-3.58s-11.28,4.75-13.21,4.34A16.37,16.37,0,0,1,78.64,239.38Z" fill="#a49900"/><path id="_路径_364" data-name="&lt;路径&gt;" d="M78.6,239.27c-.43,7.67,5,17.88,7.37,14.59s-3.49-11.73-5-13A16.38,16.38,0,0,0,78.6,239.27Z" fill="#a49900"/><path id="_路径_365" data-name="&lt;路径&gt;" d="M64.39,231.28c-.43,7.67,5,17.88,7.37,14.59s-3.49-11.73-5-13A16.38,16.38,0,0,0,64.39,231.28Z" fill="#a49900"/><path id="_路径_366" data-name="&lt;路径&gt;" d="M56,222.63c-2,7.42,1.26,18.52,4.25,15.78s-1-12.19-2.3-13.71A16.37,16.37,0,0,0,56,222.63Z" fill="#a49900"/><path id="_路径_367" data-name="&lt;路径&gt;" d="M49.17,213.24c-3.09,5.28-2.95,14.48-.08,13s1.78-9.58,1.13-11A13,13,0,0,0,49.17,213.24Z" fill="#a49900"/><path id="_路径_368" data-name="&lt;路径&gt;" d="M44.56,204.72c-3.09,5.28-2.95,14.48-.07,13s1.78-9.58,1.13-11A13,13,0,0,0,44.56,204.72Z" fill="#a49900"/><path id="_路径_369" data-name="&lt;路径&gt;" d="M64.39,231.3c7-3.27,18.45-2.06,16.29,1.37s-12.18,1.15-13.9.18A16.37,16.37,0,0,1,64.39,231.3Z" fill="#a49900"/><path id="_路径_370" data-name="&lt;路径&gt;" d="M56,222.69c6.64-1.69,16.5,1.31,14,4s-10.86-1.05-12.2-2.19A14.6,14.6,0,0,1,56,222.69Z" fill="#a49900"/><path id="_路径_371" data-name="&lt;路径&gt;" d="M49.1,213.35c6.83-.5,16,4.18,13.12,6.35s-10.51-2.94-11.63-4.3A14.6,14.6,0,0,1,49.1,213.35Z" fill="#a49900"/><path id="_路径_372" data-name="&lt;路径&gt;" d="M44.55,204.7c6.83-.5,16,4.18,13.12,6.35s-10.51-2.94-11.63-4.3A14.59,14.59,0,0,1,44.55,204.7Z" fill="#a49900"/></g></g><g id="_编组_84" data-name="&lt;编组&gt;"><path id="_路径_373" data-name="&lt;路径&gt;" d="M93.93,251.28c-.66-1.2-1.15-3.5.94-3.41s1.65,2.33,2.22,1,2.91-1.94,3.86-.41-1.3,2.73.07,2.52,3.4,1.61,2,3.46a2.66,2.66,0,0,1-3.86.44c-.3-.41-.38-.43-.53.92s-2.72,2.89-3.5.9.63-2.51-.78-2-3.06.54-3.17-1C91,250.88,94.42,252.18,93.93,251.28Z" fill="#f47888"/><circle id="_路径_374" data-name="&lt;路径&gt;" cx="97.61" cy="252.07" r="1.99" transform="translate(-28 12.72) rotate(-6.52)" fill="#a45"/></g><g id="_编组_85" data-name="&lt;编组&gt;"><path id="_路径_375" data-name="&lt;路径&gt;" d="M59.78,245.23c-.66-1.2-1.15-3.5.94-3.41s1.65,2.33,2.22,1,2.91-1.94,3.86-.41-1.3,2.73.07,2.52,3.4,1.61,2,3.46a2.66,2.66,0,0,1-3.86.44c-.3-.41-.38-.43-.53.92s-2.72,2.89-3.5.9.63-2.51-.78-2-3.06.54-3.17-1C56.86,244.82,60.27,246.12,59.78,245.23Z" fill="#f47888"/><circle id="_路径_376" data-name="&lt;路径&gt;" cx="63.46" cy="246.01" r="1.99" transform="translate(-27.54 8.8) rotate(-6.52)" fill="#a45"/></g><g id="_编组_86" data-name="&lt;编组&gt;"><path id="_路径_377" data-name="&lt;路径&gt;" d="M48.59,196.27c.51-1.27,2-3.1,3.24-1.42s-.77,2.76.65,2.33,3.34,1,2.76,2.73-2.93.72-1.91,1.64.9,3.65-1.4,3.76a2.66,2.66,0,0,1-2.78-2.71c.13-.49.09-.56-1.05.17s-4-.28-2.91-2.15,2.34-1.1,1-1.86-2.35-2-1.21-3.1C47.06,193.75,48.21,197.22,48.59,196.27Z" fill="#f47888"/><circle id="_路径_378" data-name="&lt;路径&gt;" cx="50.31" cy="199.62" r="1.99" transform="translate(-127.68 96.17) rotate(-45.69)" fill="#a45"/></g></g><g id="_编组_87" data-name="&lt;编组&gt;"><g id="_编组_88" data-name="&lt;编组&gt;"><g id="_编组_89" data-name="&lt;编组&gt;"><path id="_路径_379" data-name="&lt;路径&gt;" d="M204.49,263.16c4.15,1,8.16-1.67,10.56-4.91.08-.1-.11-.51-.15-.46-2.38,3.22-6.36,5.93-10.49,4.89-.08,0,0,.44.08.47Z" fill="#3b4437"/><path id="_路径_380" data-name="&lt;路径&gt;" d="M203.91,270.27c3.87,1.07,7.33,3,8.14,7.3,0,.18.22.43.16.1-.85-4.48-4.17-6.71-8.38-7.87-.08,0,0,.44.08.47Z" fill="#3b4437"/><path id="_路径_381" data-name="&lt;路径&gt;" d="M204.44,265.47c3.2,1.42,7,1.28,10.42.53.1,0,0-.5-.12-.48-3.34.75-7.2.88-10.37-.52-.07,0,0,.42.08.47Z" fill="#3b4437"/><path id="_路径_382" data-name="&lt;路径&gt;" d="M215.8,272.76a16.39,16.39,0,0,0-11.48-4.92c-.24,0-.17.48,0,.48a16.13,16.13,0,0,1,11.31,4.83c.2.21.28-.25.14-.39Z" fill="#3b4437"/><circle id="_路径_383" data-name="&lt;路径&gt;" cx="214.98" cy="258.02" r="1.13" transform="translate(-48.04 466.84) rotate(-88.65)" fill="#8dcecc"/><circle id="_路径_384" data-name="&lt;路径&gt;" cx="214.8" cy="265.48" r="1.13" transform="translate(-55.67 473.95) rotate(-88.65)" fill="#8dcecc"/><circle id="_路径_385" data-name="&lt;路径&gt;" cx="216.08" cy="272.97" r="1.13" transform="translate(-61.91 482.55) rotate(-88.65)" fill="#8dcecc"/><circle id="_路径_386" data-name="&lt;路径&gt;" cx="212.12" cy="277.9" r="1.13" transform="translate(-70.71 483.4) rotate(-88.65)" fill="#8dcecc"/></g><g id="_编组_90" data-name="&lt;编组&gt;"><g id="_编组_91" data-name="&lt;编组&gt;"><path id="_路径_387" data-name="&lt;路径&gt;" d="M192.66,266.69c8.44,4.37,16.76,6.79,14.93,14.47s-11.9-2.16-15.25-7.23S188.43,264.5,192.66,266.69Z" fill="#7dbbbc"/><path id="_路径_388" data-name="&lt;路径&gt;" d="M192.88,266c8.84-3.48,17.37-5,16.34-12.86s-12.06.93-15.91,5.62S188.44,267.76,192.88,266Z" fill="#7dbbbc"/><path id="_路径_389" data-name="&lt;路径&gt;" d="M190.44,265.37c5.83-5.29,10.75-8,15.39-5s4.53,9.38,1.42,12.09-11.79-2.08-13.83-3.43S189.21,266.49,190.44,265.37Z" fill="#9ae3e8"/><g id="_编组_92" data-name="&lt;编组&gt;"><path id="_路径_390" data-name="&lt;路径&gt;" d="M200.36,253.22c-4.27,2.52-8.57,6.56-10.2,11.4,0,.11.18.41.2.36,1.63-4.84,5.91-8.85,10.17-11.38.09-.05-.1-.43-.17-.39Z" fill="#fff"/><path id="_路径_391" data-name="&lt;路径&gt;" d="M199,255.87a19.54,19.54,0,0,0-8.82,8.76c0,.11.17.42.2.36a19.46,19.46,0,0,1,8.8-8.73c.09,0-.1-.43-.17-.39Z" fill="#fff"/><path id="_路径_392" data-name="&lt;路径&gt;" d="M200.91,256.63c-4.3,1.77-8.54,4-10.81,8.27-.06.11.16.44.2.36,2.26-4.22,6.5-6.48,10.78-8.24.1,0-.07-.43-.17-.39Z" fill="#fff"/><path id="_路径_393" data-name="&lt;路径&gt;" d="M199.84,258.48a18.26,18.26,0,0,0-9.73,6.56c-.1.13.12.49.23.35a18.14,18.14,0,0,1,9.68-6.52c.16,0,0-.44-.17-.39Z" fill="#fff"/></g><path id="_路径_394" data-name="&lt;路径&gt;" d="M202.61,271.83c-4.09-1.11-9-2.6-12.07-5.69-.2-.2-.2.16-.09.27,3.16,3.15,8,4.67,12.21,5.8.19.05.08-.34,0-.38Z" fill="#fff"/><path id="_路径_395" data-name="&lt;路径&gt;" d="M200.68,262.15a23.24,23.24,0,0,0-7.42,1.91,21.23,21.23,0,0,0-2.22,1.14c-.09.05-1,.63-.51.56s.92-.74,1.17-.93a31.51,31.51,0,0,1,2.62-1.77,16,16,0,0,1,7-2.57c.1,0,0-.21-.05-.2-4,.29-7.93,2.77-10.92,5.36-.06,0,0,.23.1.18a21.67,21.67,0,0,1,10.28-3.47c.1,0,0-.21-.05-.2Z" fill="#fff"/><path id="_路径_396" data-name="&lt;路径&gt;" d="M202.28,269.61c-3.74-.57-8.18-1.41-11.34-3.69-.21-.15-.23.25-.07.36,3.18,2.3,7.66,3.15,11.42,3.72.24,0,.18-.37,0-.4Z" fill="#fff"/><path id="_路径_397" data-name="&lt;路径&gt;" d="M202.88,265.44a32.28,32.28,0,0,0-12.31.29c-.11,0,0,.42.17.39a32.14,32.14,0,0,1,12.26-.28c.13,0,0-.38-.12-.39Z" fill="#fff"/><path id="_路径_398" data-name="&lt;路径&gt;" d="M190.26,267.73c0-.14,0-.27-.05-.4l.14,0c.41,3.7,3.68,8.43,9.24,13.31l-.09.11C194.11,276,190.85,271.4,190.26,267.73Z" fill="#fff"/><path id="_路径_399" data-name="&lt;路径&gt;" d="M198.76,277.66c-3.43-2.8-7.39-6.18-8.35-10.74-.06-.28-.59-.79-.48-.26,1,5,5.07,8.59,8.82,11.66.36.29.19-.5,0-.66Z" fill="#fff"/><path id="_路径_400" data-name="&lt;路径&gt;" d="M198.48,273.93c-3.24-1.43-6.26-3.42-7.7-6.77-.2-.48-.67-.27-.46.21,1.55,3.61,4.73,5.79,8.23,7.33.38.17.22-.65-.07-.78Z" fill="#fff"/></g><path id="_路径_401" data-name="&lt;路径&gt;" d="M189.22,266.36a4.9,4.9,0,0,1,2.85-4.34c1-.34,1.19,0,.55.73s-1.33,1.2-.45,1.34,2.36.72,1.87,1.09-3,.24-2,.74,2.77,2.19,1.65,1.94-2.31-.8-1.3.27,1.46,1.6.28,1.6A3.56,3.56,0,0,1,189.22,266.36Z" fill="#5a7958"/><path id="_路径_402" data-name="&lt;路径&gt;" d="M190.38,264.94a20.05,20.05,0,0,0-15.82,2.93c-.65.45.08,2,.7,1.55a19.26,19.26,0,0,1,15.19-2.9c.91.23.65-1.41-.06-1.58Z" fill="#5a7958"/></g></g><g id="_编组_93" data-name="&lt;编组&gt;"><g id="_编组_94" data-name="&lt;编组&gt;"><path id="_路径_403" data-name="&lt;路径&gt;" d="M147.23,266.79c9.37,1,19.13,1.88,27.9,5.58,8.06,3.4,14.33,9.41,19.73,16.15.23.28.32,1.27-.14.7-5.42-6.76-11.7-12.69-19.81-16-8.61-3.53-18.17-4.41-27.34-5.35-.34,0-.68-1.09-.34-1.05Z" fill="#2d9c9e"/><path id="_路径_404" data-name="&lt;路径&gt;" d="M193.32,287.07c4.73,4.36,10.08,10.68,7.8,12.66s-5-7.32-6.49-10.1S193.32,287.07,193.32,287.07Z" fill="#2d9c9e"/><path id="_路径_405" data-name="&lt;路径&gt;" d="M190.36,283.73c-2.23,5.26-1,13.76,1.49,12.06s.5-9.08-.27-10.33A12.18,12.18,0,0,0,190.36,283.73Z" fill="#2d9c9e"/><path id="_路径_406" data-name="&lt;路径&gt;" d="M190.27,283.73c5.26-2.22,13.77-1,12.06,1.5s-9.08.49-10.33-.28A12.17,12.17,0,0,1,190.27,283.73Z" fill="#2d9c9e"/><path id="_路径_407" data-name="&lt;路径&gt;" d="M181.12,275.78c5.26-2.22,13.77-1,12.06,1.5s-9.08.49-10.33-.28A12.18,12.18,0,0,1,181.12,275.78Z" fill="#2d9c9e"/><path id="_路径_408" data-name="&lt;路径&gt;" d="M173,272.09c4.7-3.24,13.28-3.75,12.11-1s-8.79,2.33-10.17,1.82A12.17,12.17,0,0,1,173,272.09Z" fill="#2d9c9e"/><path id="_路径_409" data-name="&lt;路径&gt;" d="M164.68,269.65c2.92-3.48,9.4-5.69,9.09-3.31s-6.26,3.64-7.42,3.55A9.69,9.69,0,0,1,164.68,269.65Z" fill="#2d9c9e"/><path id="_路径_410" data-name="&lt;路径&gt;" d="M157.56,268.55c2.92-3.48,9.4-5.69,9.09-3.31s-6.26,3.64-7.42,3.55A9.69,9.69,0,0,1,157.56,268.55Z" fill="#2d9c9e"/><path id="_路径_411" data-name="&lt;路径&gt;" d="M181.13,275.78c-.55,5.68,3.18,13.43,5,11.06s-2.25-8.82-3.36-9.78A12.17,12.17,0,0,0,181.13,275.78Z" fill="#2d9c9e"/><path id="_路径_412" data-name="&lt;路径&gt;" d="M173,272.05c.48,5.07,5.05,11.22,6.28,8.83s-3.46-7.34-4.59-8A10.85,10.85,0,0,0,173,272.05Z" fill="#2d9c9e"/><path id="_路径_413" data-name="&lt;路径&gt;" d="M164.74,269.57c1.36,4.91,6.94,10.16,7.73,7.59s-4.69-6.62-5.92-7.06A10.85,10.85,0,0,0,164.74,269.57Z" fill="#2d9c9e"/><path id="_路径_414" data-name="&lt;路径&gt;" d="M157.55,268.55c1.36,4.91,6.94,10.16,7.73,7.59s-4.69-6.62-5.92-7.06A10.85,10.85,0,0,0,157.55,268.55Z" fill="#2d9c9e"/></g><g id="_编组_95" data-name="&lt;编组&gt;"><path id="_路径_415" data-name="&lt;路径&gt;" d="M100.55,259.45c12,4.21,24.34,8.72,37.13,9.26,11.75.5,22.84-3.2,33.29-8.29.44-.21,1.12-1.36.23-.93-10.47,5.1-21.53,8.71-33.31,8.08-12.5-.66-24.63-5.09-36.32-9.22-.43-.15-1.46.93-1,1.08Z" fill="#a49900"/><path id="_路径_416" data-name="&lt;路径&gt;" d="M168.27,261.3c8.27-2.58,18.4-7.18,16.76-10.91s-10.28,6-13.7,8.55S168.27,261.3,168.27,261.3Z" fill="#a49900"/><path id="_路径_417" data-name="&lt;路径&gt;" d="M162.74,263.66c.32-7.67,6.7-17.31,8.75-13.81s-4.61,11.33-6.27,12.41A16.37,16.37,0,0,1,162.74,263.66Z" fill="#a49900"/><path id="_路径_418" data-name="&lt;路径&gt;" d="M162.64,263.61c5.12,5.73,16.17,9.11,15.53,5.11s-10.76-5.82-12.73-5.6A16.37,16.37,0,0,0,162.64,263.61Z" fill="#a49900"/><path id="_路径_419" data-name="&lt;路径&gt;" d="M146.94,268c5.12,5.73,16.17,9.11,15.53,5.11s-10.76-5.82-12.73-5.6A16.37,16.37,0,0,0,146.94,268Z" fill="#a49900"/><path id="_路径_420" data-name="&lt;路径&gt;" d="M134.9,267.81c3.85,6.65,14,12.2,14.17,8.15s-9.36-7.89-11.32-8.07A16.37,16.37,0,0,0,134.9,267.81Z" fill="#a49900"/><path id="_路径_421" data-name="&lt;路径&gt;" d="M123.42,266c1.55,5.92,8.15,12.32,9.15,9.25s-5.51-8-7-8.59A13,13,0,0,0,123.42,266Z" fill="#a49900"/><path id="_路径_422" data-name="&lt;路径&gt;" d="M114.13,263.25c1.55,5.92,8.15,12.32,9.15,9.25s-5.51-8-7-8.59A13,13,0,0,0,114.13,263.25Z" fill="#a49900"/><path id="_路径_423" data-name="&lt;路径&gt;" d="M146.95,268c2.6-7.23,11.59-14.5,12.49-10.55s-7.8,9.43-9.7,10A16.38,16.38,0,0,1,146.95,268Z" fill="#a49900"/><path id="_路径_424" data-name="&lt;路径&gt;" d="M134.92,267.87c3.5-5.89,12.6-10.74,12.71-7.13s-8.42,6.94-10.18,7.08A14.59,14.59,0,0,1,134.92,267.87Z" fill="#a49900"/><path id="_路径_425" data-name="&lt;路径&gt;" d="M123.45,266.14c4.48-5.18,14.28-8.37,13.77-4.79s-9.51,5.35-11.26,5.18A14.6,14.6,0,0,1,123.45,266.14Z" fill="#a49900"/><path id="_路径_426" data-name="&lt;路径&gt;" d="M114.11,263.24c4.48-5.18,14.28-8.37,13.77-4.79s-9.51,5.35-11.26,5.18A14.59,14.59,0,0,1,114.11,263.24Z" fill="#a49900"/></g></g><g id="_编组_96" data-name="&lt;编组&gt;"><path id="_路径_427" data-name="&lt;路径&gt;" d="M182,261.27c-1.31-.38-3.29-1.66-1.74-3.07s2.82.48,2.25-.88.69-3.43,2.44-3,1,2.84,1.83,1.73,3.54-1.27,3.88,1a2.66,2.66,0,0,1-2.42,3c-.5-.08-.57,0,.27,1s.12,4-1.84,3.11-1.33-2.22-2-.85-1.78,2.55-3,1.52C179.62,263,183,261.55,182,261.27Z" fill="#f47888"/><circle id="_路径_428" data-name="&lt;路径&gt;" cx="185.13" cy="259.22" r="1.99" transform="translate(-132.99 242.86) rotate(-51.52)" fill="#a45"/></g><g id="_编组_97" data-name="&lt;编组&gt;"><path id="_路径_429" data-name="&lt;路径&gt;" d="M153.54,281.13c-1.31-.38-3.29-1.66-1.74-3.07s2.82.48,2.25-.88.69-3.43,2.44-3,1,2.85,1.83,1.73,3.54-1.27,3.88,1a2.66,2.66,0,0,1-2.42,3c-.5-.08-.57,0,.27,1s.12,4-1.84,3.11-1.33-2.22-2-.85-1.78,2.55-3,1.52C151.19,282.91,154.52,281.42,153.54,281.13Z" fill="#f47888"/><circle id="_路径_430" data-name="&lt;路径&gt;" cx="156.7" cy="279.08" r="1.99" transform="translate(-159.28 228.11) rotate(-51.52)" fill="#a45"/></g><g id="_编组_98" data-name="&lt;编组&gt;"><path id="_路径_431" data-name="&lt;路径&gt;" d="M111,254.43c-.54-1.26-.79-3.6,1.28-3.29s1.41,2.49,2.11,1.19,3.09-1.64,3.88,0-1.57,2.58-.19,2.51,3.22,1.94,1.67,3.64a2.66,2.66,0,0,1-3.88,0c-.25-.44-.34-.46-.62.86s-3,2.6-3.58.54.88-2.44-.58-2.06-3.1.23-3-1.34C108.15,253.73,111.41,255.37,111,254.43Z" fill="#f47888"/><circle id="_路径_432" data-name="&lt;路径&gt;" cx="114.59" cy="255.58" r="1.99" transform="translate(-3.07 1.4) rotate(-0.69)" fill="#a45"/></g></g>'
                },
                pf24:{
                    width:300,
                    height:305,
                    cPath:'<ellipse cx="149.2" cy="154.04" rx="128.05" ry="127.9"/>',
                    gPath:'<g><g id="_编组_2" data-name="&lt;编组&gt;"><path id="_路径_" data-name="&lt;路径&gt;" d="M54.09,237.45c10,14.29,24.91,24.39,40.58,31.62a131,131,0,0,0,25,8.94c.25.06,1-.5.63-.58a130.32,130.32,0,0,1-24.83-8.9c-15.64-7.22-30.51-17.29-40.5-31.55-.17-.24-1,.26-.84.48Z" fill="#9b477b"/><path id="_路径_2" data-name="&lt;路径&gt;" d="M88.21,248.78c1.11,5.15.47,11-2.47,15.54-.29.45.6.21.76,0a21.37,21.37,0,0,0,2.58-15.84c-.08-.37-.94.05-.88.35Z" fill="#9b477b"/><path id="_路径_3" data-name="&lt;路径&gt;" d="M81.25,242.37c1.27,5.89.49,12.62-2.86,17.76-.17.26.68,0,.82-.25,3.39-5.2,4.17-12,2.89-18,0-.19-.91.17-.84.48Z" fill="#9b477b"/><path id="_路径_4" data-name="&lt;路径&gt;" d="M70.81,241.21a16.09,16.09,0,0,1-1.93,11.94c-.17.27.68,0,.82-.24a16.42,16.42,0,0,0,2-12.17c0-.2-.91.17-.84.48Z" fill="#9b477b"/><path id="_路径_5" data-name="&lt;路径&gt;" d="M60,228.61c4.08,5.52,6.62,13.36,3.83,20.06-.13.31.72,0,.82-.25,2.82-6.78.33-14.69-3.81-20.28-.16-.22-1,.29-.84.48Z" fill="#9b477b"/><path id="_路径_6" data-name="&lt;路径&gt;" d="M44.16,241.42a15,15,0,0,0,17.06,4.32c.4-.15.64-.71,0-.48A14.37,14.37,0,0,1,45,240.95c-.2-.25-1,.27-.84.48Z" fill="#9b477b"/><path id="_路径_7" data-name="&lt;路径&gt;" d="M51.07,251.61c4.85,1.77,11.4,2.78,16-.32.49-.33.17-.94-.34-.6-4.36,2.93-10.57,1.87-15.12.21-.4-.15-1.07.53-.56.71Z" fill="#9b477b"/><path id="_路径_8" data-name="&lt;路径&gt;" d="M56.91,263.93a26.09,26.09,0,0,0,19.69-5.07c.5-.41-.11-.66-.49-.35-5.11,4.12-12.21,5.65-18.61,4.76-.34,0-1,.6-.59.66Z" fill="#9b477b"/><circle id="_路径_9" data-name="&lt;路径&gt;" cx="57.2" cy="263.6" r="2.67" transform="translate(-63.74 22.5) rotate(-14.4)" fill="#6b3976"/><circle id="_路径_10" data-name="&lt;路径&gt;" cx="67.48" cy="266.47" r="2.67" transform="translate(-64.13 25.14) rotate(-14.4)" fill="#6b3976"/><circle id="_路径_11" data-name="&lt;路径&gt;" cx="59.64" cy="257.15" r="2.67" transform="translate(-62.06 22.9) rotate(-14.4)" fill="#6b3976"/><circle id="_路径_12" data-name="&lt;路径&gt;" cx="51.49" cy="251.82" r="2.67" transform="translate(-60.99 20.71) rotate(-14.39)" fill="#6b3976"/><circle id="_路径_13" data-name="&lt;路径&gt;" cx="71.15" cy="241" r="2.67" transform="translate(-57.68 25.25) rotate(-14.39)" fill="#6b3976"/><circle id="_路径_14" data-name="&lt;路径&gt;" cx="80.75" cy="242.37" r="2.67" transform="translate(-57.72 27.69) rotate(-14.4)" fill="#6b3976"/><circle id="_路径_15" data-name="&lt;路径&gt;" cx="76.52" cy="251.18" r="3.54" transform="translate(-60.04 26.91) rotate(-14.4)" fill="#6b3976"/><circle id="_路径_16" data-name="&lt;路径&gt;" cx="45.83" cy="248.58" r="3.54" transform="translate(-60.36 19.2) rotate(-14.4)" fill="#6b3976"/><circle id="_路径_17" data-name="&lt;路径&gt;" cx="49.75" cy="234.64" r="3.54" transform="translate(-56.77 19.74) rotate(-14.4)" fill="#6b3976"/><circle id="_路径_18" data-name="&lt;路径&gt;" cx="88.31" cy="249.32" r="2.67" transform="translate(-59.21 29.78) rotate(-14.4)" fill="#6b3976"/><circle id="_路径_19" data-name="&lt;路径&gt;" cx="60.68" cy="229.34" r="2.67" transform="translate(-55.11 22.28) rotate(-14.39)" fill="#6b3976"/><circle id="_路径_20" data-name="&lt;路径&gt;" cx="44.36" cy="240.32" r="2.67" transform="translate(-58.35 18.57) rotate(-14.39)" fill="#6b3976"/><circle id="_路径_21" data-name="&lt;路径&gt;" cx="49.21" cy="227.32" r="2.67" transform="translate(-54.97 19.37) rotate(-14.39)" fill="#6b3976"/><circle id="_路径_22" data-name="&lt;路径&gt;" cx="60.87" cy="244.09" r="2.67" transform="translate(-58.77 22.79) rotate(-14.39)" fill="#6b3976"/><path id="_路径_23" data-name="&lt;路径&gt;" d="M49.26,227.47c5,2.33,7.5,7.65,7.08,13,0,.19.83-.13.85-.39.42-5.44-2.15-10.82-7.16-13.17-.23-.11-.94.45-.77.53Z" fill="#9b477b"/></g><g id="_编组_3" data-name="&lt;编组&gt;"><g id="_编组_4" data-name="&lt;编组&gt;"><path id="_路径_24" data-name="&lt;路径&gt;" d="M140.13,272c-19.68,2.21-28.42.45-39-7.86C90.93,256,76,259.71,75.89,259.74l-.2-.78c.15,0,15.44-3.8,26,4.51s18.71,9.89,38.36,7.69Z" fill="#a38583"/><path id="_路径_25" data-name="&lt;路径&gt;" d="M64.77,261.66c6.44,3.26,12.51,1.68,15-1s-2.87-4.33-8.14-2.85S64.77,261.66,64.77,261.66Z" fill="#a38583"/><path id="_路径_26" data-name="&lt;路径&gt;" d="M76.11,245.86c-.33,6,3.41,9.37,6.73,9.78s2.66-4.08-.69-7S76.11,245.86,76.11,245.86Z" fill="#a38583"/><path id="_路径_27" data-name="&lt;路径&gt;" d="M97.49,261.52a21.34,21.34,0,0,1-13.15,3.42l.07-.8A20.87,20.87,0,0,0,97,260.87Z" fill="#a38583"/><path id="_路径_28" data-name="&lt;路径&gt;" d="M77.58,264.73s11.9,3.89,12.79-.07S81.59,262,77.58,264.73Z" fill="#a38583"/><path id="_路径_29" data-name="&lt;路径&gt;" d="M112.59,269.87l-.25.76c-4.77-1.53-5.83-5.09-7-8.86s-2.35-7.89-7.66-10.44l.35-.72c5.63,2.71,6.93,7.08,8.08,10.94S108.23,268.47,112.59,269.87Z" fill="#a38583"/><path id="_路径_30" data-name="&lt;路径&gt;" d="M104.72,258.73a33.2,33.2,0,0,1-11.88-1.34l.25-.76a33,33,0,0,0,11.56,1.31Z" fill="#a38583"/><path id="_路径_31" data-name="&lt;路径&gt;" d="M106.73,262.61q0,.39,0,.77l-.8,0c.34-6.75-3.24-15.46-3.27-15.54l.74-.31C103.51,247.83,106.81,255.82,106.73,262.61Z" fill="#a38583"/><path id="_路径_32" data-name="&lt;路径&gt;" d="M88.83,256.33c4.64-1.85,7.13-1.84,9.57-.9a8.42,8.42,0,0,1,3.73,3s-2.35,2.38-7,1.88A7.8,7.8,0,0,1,88.83,256.33Z" fill="#a38583"/><path id="_路径_33" data-name="&lt;路径&gt;" d="M103.85,256.82c-.68.09-16.74,2.15-21.08-2.73l.6-.53c4.05,4.56,20.21,2.49,20.37,2.47Z" fill="#a38583"/><path id="_路径_34" data-name="&lt;路径&gt;" d="M99.75,252.74c-4.92,1.26-8.34.59-10.05-3A14.21,14.21,0,0,1,88,244.18a9.7,9.7,0,0,1,9.41,2.55C101.79,251,100.21,252.63,99.75,252.74Z" fill="#a38583"/><path id="_路径_35" data-name="&lt;路径&gt;" d="M104.89,253.28c2.6-3.67,1.05-8-.94-10.24a20.49,20.49,0,0,0-4.31-3.55,11.1,11.1,0,0,0,.41,9.87C102.83,254.92,104.89,253.28,104.89,253.28Z" fill="#a38583"/><path id="_路径_36" data-name="&lt;路径&gt;" d="M116.77,271.09l-.15.79c-5.8-1.12-9-.84-14.29,1.26l-.3-.75C107.48,270.23,110.79,269.93,116.77,271.09Z" fill="#a38583"/><path id="_路径_37" data-name="&lt;路径&gt;" d="M93.77,275.46c5.46.91,6.72,1.56,9.84-1.47s-2.55-3.74-5.56-3S93.77,275.46,93.77,275.46Z" fill="#a38583"/></g><path id="_路径_38" data-name="&lt;路径&gt;" d="M136.65,272.23c-.14.14-13.77,13.44-26,7.84l.33-.73c11.75,5.37,25-7.54,25.12-7.68Z" fill="#a38583"/><path id="_路径_39" data-name="&lt;路径&gt;" d="M101.9,277.32c2.85,5.49,6.55,4.1,8.19,3.44s1.68-1.41-.71-4.09S101.9,277.32,101.9,277.32Z" fill="#a38583"/><path id="_路径_40" data-name="&lt;路径&gt;" d="M101.68,288.38c5.7,2.43,7.67-1,8.51-2.54s.19-3-3.36-2.39A6.22,6.22,0,0,0,101.68,288.38Z" fill="#a38583"/><path id="_路径_41" data-name="&lt;路径&gt;" d="M117.9,281.47c-2.86.08-5.33.91-8.79,4.79l-.6-.53c3.66-4.09,6.3-5,9.37-5.05Z" fill="#a38583"/></g><g id="_编组_5" data-name="&lt;编组&gt;"><path id="_路径_42" data-name="&lt;路径&gt;" d="M248.29,237.45c-10,14.29-24.91,24.39-40.58,31.62a131,131,0,0,1-25,8.94c-.25.06-1-.5-.63-.58a130.32,130.32,0,0,0,24.83-8.9c15.64-7.22,30.51-17.29,40.5-31.55.17-.24,1,.26.84.48Z" fill="#9b477b"/><path id="_路径_43" data-name="&lt;路径&gt;" d="M214.17,248.78c-1.11,5.15-.47,11,2.47,15.54.29.45-.6.21-.76,0a21.37,21.37,0,0,1-2.58-15.84c.08-.37.94.05.88.35Z" fill="#9b477b"/><path id="_路径_44" data-name="&lt;路径&gt;" d="M221.13,242.37c-1.27,5.89-.49,12.62,2.86,17.76.17.26-.68,0-.82-.25-3.39-5.2-4.17-12-2.89-18,0-.19.91.17.84.48Z" fill="#9b477b"/><path id="_路径_45" data-name="&lt;路径&gt;" d="M231.57,241.21a16.09,16.09,0,0,0,1.93,11.94c.17.27-.68,0-.82-.24a16.42,16.42,0,0,1-2-12.17c0-.2.91.17.84.48Z" fill="#9b477b"/><path id="_路径_46" data-name="&lt;路径&gt;" d="M242.37,228.61c-4.08,5.52-6.62,13.36-3.83,20.06.13.31-.72,0-.82-.25-2.82-6.78-.33-14.69,3.81-20.28.16-.22,1,.29.84.48Z" fill="#9b477b"/><path id="_路径_47" data-name="&lt;路径&gt;" d="M258.22,241.42a15,15,0,0,1-17.06,4.32c-.4-.15-.64-.71,0-.48a14.37,14.37,0,0,0,16.25-4.32c.2-.25,1,.27.84.48Z" fill="#9b477b"/><path id="_路径_48" data-name="&lt;路径&gt;" d="M251.31,251.61c-4.85,1.77-11.4,2.78-16-.32-.49-.33-.17-.94.34-.6,4.36,2.93,10.57,1.87,15.12.21.4-.15,1.07.53.56.71Z" fill="#9b477b"/><path id="_路径_49" data-name="&lt;路径&gt;" d="M245.47,263.93a26.09,26.09,0,0,1-19.69-5.07c-.5-.41.11-.66.49-.35,5.11,4.12,12.21,5.65,18.61,4.76.34,0,1,.6.59.66Z" fill="#9b477b"/><circle id="_路径_50" data-name="&lt;路径&gt;" cx="245.18" cy="263.6" r="2.67" transform="translate(-71.1 435.54) rotate(-75.6)" fill="#6b3976"/><circle id="_路径_51" data-name="&lt;路径&gt;" cx="234.9" cy="266.47" r="2.67" transform="translate(-81.61 427.75) rotate(-75.6)" fill="#6b3976"/><circle id="_路径_52" data-name="&lt;路径&gt;" cx="242.74" cy="257.15" r="2.67" transform="translate(-66.69 428.34) rotate(-75.6)" fill="#6b3976"/><circle id="_路径_53" data-name="&lt;路径&gt;" cx="250.89" cy="251.82" r="2.67" transform="translate(-55.4 432.23) rotate(-75.61)" fill="#6b3976"/><circle id="_路径_54" data-name="&lt;路径&gt;" cx="231.23" cy="241" r="2.67" transform="translate(-59.68 405.06) rotate(-75.61)" fill="#6b3976"/><circle id="_路径_55" data-name="&lt;路径&gt;" cx="221.63" cy="242.37" r="2.67" transform="translate(-68.23 396.78) rotate(-75.6)" fill="#6b3976"/><circle id="_路径_56" data-name="&lt;路径&gt;" cx="225.85" cy="251.18" r="3.54" transform="translate(-73.59 407.49) rotate(-75.6)" fill="#6b3976"/><circle id="_路径_57" data-name="&lt;路径&gt;" cx="256.55" cy="248.58" r="3.54" transform="translate(-48 435.27) rotate(-75.6)" fill="#6b3976"/><circle id="_路径_58" data-name="&lt;路径&gt;" cx="252.63" cy="234.64" r="3.54" transform="translate(-37.46 421) rotate(-75.6)" fill="#6b3976"/><circle id="_路径_59" data-name="&lt;路径&gt;" cx="214.07" cy="249.32" r="2.67" transform="translate(-80.65 394.68) rotate(-75.6)" fill="#6b3976"/><circle id="_路径_60" data-name="&lt;路径&gt;" cx="241.7" cy="229.34" r="2.67" transform="translate(-40.52 406.43) rotate(-75.61)" fill="#6b3976"/><circle id="_路径_61" data-name="&lt;路径&gt;" cx="258.02" cy="240.32" r="2.67" transform="translate(-38.9 430.5) rotate(-75.61)" fill="#6b3976"/><circle id="_路径_62" data-name="&lt;路径&gt;" cx="253.17" cy="227.32" r="2.67" transform="translate(-29.95 416.03) rotate(-75.61)" fill="#6b3976"/><circle id="_路径_63" data-name="&lt;路径&gt;" cx="241.51" cy="244.09" r="2.67" transform="translate(-54.96 417.33) rotate(-75.61)" fill="#6b3976"/><path id="_路径_64" data-name="&lt;路径&gt;" d="M253.11,227.47c-5,2.33-7.5,7.65-7.08,13,0,.19-.83-.13-.85-.39-.42-5.44,2.15-10.82,7.16-13.17.23-.11.94.45.77.53Z" fill="#9b477b"/></g><g id="_编组_6" data-name="&lt;编组&gt;"><path id="_路径_65" data-name="&lt;路径&gt;" d="M276.77,176.8c-1.51,17.37-9.36,33.56-19.31,47.65a130.74,130.74,0,0,1-17.14,20.2c-.19.17-1.11.07-.84-.19a130.09,130.09,0,0,0,17-20.11c9.93-14.07,17.77-30.21,19.28-47.55,0-.29,1-.27,1,0Z" fill="#9b477b"/><path id="_路径_66" data-name="&lt;路径&gt;" d="M252.89,203.64c1.62,5,5.12,9.8,9.92,12.22.48.24-.41.48-.68.34A21.4,21.4,0,0,1,252,203.78c-.12-.36.84-.43.93-.14Z" fill="#9b477b"/><path id="_路径_67" data-name="&lt;路径&gt;" d="M255.71,194.62c1.85,5.73,5.9,11.17,11.37,13.95.28.14-.61.31-.84.19-5.54-2.81-9.63-8.34-11.5-14.13-.06-.18.87-.3,1,0Z" fill="#9b477b"/><path id="_路径_68" data-name="&lt;路径&gt;" d="M264.17,188.4a16.12,16.12,0,0,0,7.65,9.38c.29.14-.6.32-.83.2a16.44,16.44,0,0,1-7.78-9.57c-.06-.19.87-.31,1,0Z" fill="#9b477b"/><path id="_路径_69" data-name="&lt;路径&gt;" d="M267.22,172.1c-.77,6.81,1,14.88,6.72,19.29.27.21-.64.34-.84.19-5.84-4.46-7.64-12.55-6.86-19.46,0-.27,1-.24,1,0Z" fill="#9b477b"/><path id="_路径_70" data-name="&lt;路径&gt;" d="M287.36,175.27a15,15,0,0,1-12.61,12.27c-.43.07-.91-.3-.26-.4a14.35,14.35,0,0,0,11.91-11.86c.05-.31,1-.27,1,0Z" fill="#9b477b"/><path id="_路径_71" data-name="&lt;路径&gt;" d="M286.48,187.55c-3.31,4-8.48,8.1-14,7.72-.59,0-.61-.73,0-.69,5.24.36,10.09-3.65,13.2-7.37.27-.33,1.19-.08.84.34Z" fill="#9b477b"/><path id="_路径_72" data-name="&lt;路径&gt;" d="M287.59,201.14A26.09,26.09,0,0,1,268,206.58c-.64-.1-.24-.63.25-.55a24.72,24.72,0,0,0,18.5-5.17c.27-.21,1.2,0,.84.28Z" fill="#9b477b"/><circle id="_路径_73" data-name="&lt;路径&gt;" cx="287.17" cy="201" r="2.67" transform="translate(-43.41 84.45) rotate(-15.57)" fill="#6b3976"/><circle id="_路径_74" data-name="&lt;路径&gt;" cx="279.71" cy="208.62" r="2.67" transform="translate(-45.73 82.73) rotate(-15.57)" fill="#6b3976"/><circle id="_路径_75" data-name="&lt;路径&gt;" cx="281.83" cy="196.63" r="2.67" transform="translate(-42.43 82.86) rotate(-15.57)" fill="#6b3976"/><circle id="_路径_76" data-name="&lt;路径&gt;" cx="286.21" cy="187.94" r="2.67" transform="translate(-39.94 83.72) rotate(-15.57)" fill="#6b3976"/><circle id="_路径_77" data-name="&lt;路径&gt;" cx="263.78" cy="188.38" r="2.67" transform="translate(-40.88 77.71) rotate(-15.57)" fill="#6b3976"/><circle id="_路径_78" data-name="&lt;路径&gt;" cx="256.14" cy="194.37" r="2.67" transform="translate(-42.77 75.88) rotate(-15.57)" fill="#6b3976"/><circle id="_路径_79" data-name="&lt;路径&gt;" cx="264.21" cy="199.88" r="3.54" transform="translate(-43.96 78.25) rotate(-15.57)" fill="#6b3976"/><circle id="_路径_80" data-name="&lt;路径&gt;" cx="289.49" cy="182.3" r="3.54" transform="translate(-38.31 84.39) rotate(-15.57)" fill="#6b3976"/><circle id="_路径_81" data-name="&lt;路径&gt;" cx="279.12" cy="172.2" r="3.54" transform="translate(-35.98 81.24) rotate(-15.57)" fill="#6b3976"/><circle id="_路径_82" data-name="&lt;路径&gt;" cx="253.08" cy="204.16" r="2.67" transform="translate(-45.51 75.42) rotate(-15.57)" fill="#6b3976"/><circle id="_路径_83" data-name="&lt;路径&gt;" cx="267" cy="173.06" r="2.67" transform="translate(-36.65 78.01) rotate(-15.57)" fill="#6b3976"/><circle id="_路径_84" data-name="&lt;路径&gt;" cx="286.64" cy="174.42" r="2.67" transform="translate(-36.3 83.34) rotate(-15.57)" fill="#6b3976"/><circle id="_路径_85" data-name="&lt;路径&gt;" cx="275.93" cy="165.58" r="2.67" transform="translate(-34.32 80.14) rotate(-15.57)" fill="#6b3976"/><circle id="_路径_86" data-name="&lt;路径&gt;" cx="274.22" cy="185.93" r="2.67" transform="translate(-39.84 80.43) rotate(-15.57)" fill="#6b3976"/><path id="_路径_87" data-name="&lt;路径&gt;" d="M276,165.74c-3.14,4.49-2.66,10.37.38,14.82.11.16-.79.3-.93.09-3.08-4.5-3.56-10.44-.39-15,.15-.21,1-.08.94.07Z" fill="#9b477b"/></g><g id="_编组_7" data-name="&lt;编组&gt;"><path id="_路径_88" data-name="&lt;路径&gt;" d="M271.07,110c7.39,15.8,8.69,33.74,7.13,50.91A130.56,130.56,0,0,1,273.48,187c-.07.24-.93.62-.82.26a129.9,129.9,0,0,0,4.69-25.93c1.56-17.14.27-35-7.11-50.8-.12-.26.72-.73.83-.49Z" fill="#9b477b"/><path id="_路径_89" data-name="&lt;路径&gt;" d="M263.83,145.22c3.91,3.53,9.34,5.92,14.71,5.63.54,0-.12.62-.42.64a21.44,21.44,0,0,1-15-5.69c-.28-.25.51-.79.74-.58Z" fill="#9b477b"/><path id="_路径_90" data-name="&lt;路径&gt;" d="M261.76,136c4.47,4,10.7,6.73,16.83,6.4.31,0-.37.57-.63.59-6.21.33-12.52-2.41-17-6.49-.14-.13.6-.7.83-.49Z" fill="#9b477b"/><path id="_路径_91" data-name="&lt;路径&gt;" d="M266,126.38a16.14,16.14,0,0,0,11.32,4.3c.32,0-.36.58-.62.59a16.47,16.47,0,0,1-11.53-4.4c-.15-.14.6-.71.83-.49Z" fill="#9b477b"/><path id="_路径_92" data-name="&lt;路径&gt;" d="M260.45,110.74c2.75,6.29,8.28,12.41,15.48,13.34.34,0-.38.61-.63.58-7.29-.95-12.9-7.06-15.68-13.43-.11-.25.74-.7.83-.49Z" fill="#9b477b"/><path id="_路径_93" data-name="&lt;路径&gt;" d="M279.48,103.43a14.93,14.93,0,0,1-4.78,16.92c-.33.27-.94.2-.43-.21a14.33,14.33,0,0,0,4.38-16.21c-.11-.3.74-.74.83-.49Z" fill="#9b477b"/><path id="_路径_94" data-name="&lt;路径&gt;" d="M284.86,114.5c-.89,5.08-3.29,11.25-8.29,13.69-.53.26-.89-.32-.35-.59,4.72-2.3,6.91-8.2,7.74-13,.07-.42,1-.66.9-.13Z" fill="#9b477b"/><path id="_路径_95" data-name="&lt;路径&gt;" d="M292.62,125.72a26,26,0,0,1-14.24,14.49c-.6.23-.52-.42-.06-.6a24.68,24.68,0,0,0,13.43-13.71c.13-.32,1-.6.87-.18Z" fill="#9b477b"/><circle id="_路径_96" data-name="&lt;路径&gt;" cx="292.19" cy="125.81" r="2.67" transform="translate(-2.23 246.3) rotate(-45.55)" fill="#6b3976"/><circle id="_路径_97" data-name="&lt;路径&gt;" cx="289.54" cy="136.13" r="2.67" transform="translate(-10.39 247.51) rotate(-45.55)" fill="#6b3976"/><circle id="_路径_98" data-name="&lt;路径&gt;" cx="285.38" cy="124.69" r="2.67" transform="translate(-3.47 241.11) rotate(-45.55)" fill="#6b3976"/><circle id="_路径_99" data-name="&lt;路径&gt;" cx="284.83" cy="114.98" r="2.67" transform="translate(3.29 237.8) rotate(-45.55)" fill="#6b3976"/><circle id="_路径_100" data-name="&lt;路径&gt;" cx="265.62" cy="126.57" r="2.67" transform="translate(-10.74 227.56) rotate(-45.55)" fill="#6b3976"/><circle id="_路径_101" data-name="&lt;路径&gt;" cx="262" cy="135.56" r="2.67" transform="translate(-18.24 227.67) rotate(-45.55)" fill="#6b3976"/><circle id="_路径_102" data-name="&lt;路径&gt;" cx="271.76" cy="136.31" r="3.54" transform="translate(-15.85 234.86) rotate(-45.55)" fill="#6b3976"/><circle id="_路径_103" data-name="&lt;路径&gt;" cx="284.85" cy="108.46" r="3.54" transform="translate(7.96 235.86) rotate(-45.55)" fill="#6b3976"/><circle id="_路径_104" data-name="&lt;路径&gt;" cx="270.81" cy="104.88" r="3.54" transform="translate(6.3 224.76) rotate(-45.55)" fill="#6b3976"/><circle id="_路径_105" data-name="&lt;路径&gt;" cx="264.25" cy="145.58" r="2.67" transform="translate(-24.72 232.28) rotate(-45.55)" fill="#6b3976"/><circle id="_路径_106" data-name="&lt;路径&gt;" cx="260.74" cy="111.68" r="2.67" transform="translate(-1.58 219.61) rotate(-45.55)" fill="#6b3976"/><circle id="_路径_107" data-name="&lt;路径&gt;" cx="278.43" cy="103.06" r="2.67" transform="translate(9.89 229.66) rotate(-45.55)" fill="#6b3976"/><circle id="_路径_108" data-name="&lt;路径&gt;" cx="264.73" cy="100.75" r="2.67" transform="translate(7.43 219.19) rotate(-45.55)" fill="#6b3976"/><circle id="_路径_109" data-name="&lt;路径&gt;" cx="273.44" cy="119.22" r="2.67" transform="translate(-3.15 230.94) rotate(-45.55)" fill="#6b3976"/><path id="_路径_110" data-name="&lt;路径&gt;" d="M264.83,100.88c-.47,5.46,2.88,10.31,7.75,12.64.17.08-.53.66-.76.55-4.92-2.36-8.31-7.26-7.83-12.78,0-.25.86-.59.85-.4Z" fill="#9b477b"/></g><g id="_编组_8" data-name="&lt;编组&gt;"><path id="_路径_111" data-name="&lt;路径&gt;" d="M232.72,55.07C247,65.07,257.14,80,264.38,95.6a130.6,130.6,0,0,1,8.95,24.93c.06.25-.5,1-.58.63a129.94,129.94,0,0,0-8.91-24.8c-7.23-15.62-17.31-30.47-31.59-40.45-.24-.17.26-1,.48-.84Z" fill="#9b477b"/><path id="_路径_112" data-name="&lt;路径&gt;" d="M244.06,89.16c5.15,1.1,11.06.46,15.56-2.47.45-.29.21.6,0,.76A21.44,21.44,0,0,1,243.71,90c-.37-.08.05-.94.35-.87Z" fill="#9b477b"/><path id="_路径_113" data-name="&lt;路径&gt;" d="M237.64,82.2c5.89,1.26,12.64.49,17.78-2.86.26-.17,0,.68-.25.82-5.21,3.39-12,4.16-18,2.88-.19,0,.17-.91.48-.84Z" fill="#9b477b"/><path id="_路径_114" data-name="&lt;路径&gt;" d="M236.49,71.78a16.15,16.15,0,0,0,12-1.93c.27-.17,0,.68-.24.82A16.47,16.47,0,0,1,236,72.62c-.2,0,.17-.91.48-.84Z" fill="#9b477b"/><path id="_路径_115" data-name="&lt;路径&gt;" d="M223.87,61c5.52,4.07,13.38,6.61,20.08,3.83.31-.13,0,.72-.25.82-6.79,2.82-14.7.33-20.31-3.8-.22-.16.29-1,.48-.84Z" fill="#9b477b"/><path id="_路径_116" data-name="&lt;路径&gt;" d="M236.69,45.15a14.93,14.93,0,0,1,4.33,17c-.15.4-.71.64-.48,0A14.33,14.33,0,0,0,236.22,46c-.25-.2.27-1,.48-.84Z" fill="#9b477b"/><path id="_路径_117" data-name="&lt;路径&gt;" d="M246.89,52.06c1.78,4.84,2.79,11.38-.32,16-.33.49-.94.17-.6-.34,2.93-4.35,1.88-10.55.21-15.1-.15-.4.53-1.07.71-.56Z" fill="#9b477b"/><path id="_路径_118" data-name="&lt;路径&gt;" d="M259.23,57.89a26,26,0,0,1-5.08,19.66c-.41.5-.66-.11-.35-.49a24.64,24.64,0,0,0,4.77-18.58c0-.34.6-1,.66-.59Z" fill="#9b477b"/><circle id="_路径_119" data-name="&lt;路径&gt;" cx="258.9" cy="58.18" r="2.67" transform="translate(138.04 294.42) rotate(-75.57)" fill="#6b3976"/><circle id="_路径_120" data-name="&lt;路径&gt;" cx="261.78" cy="68.45" r="2.67" transform="translate(130.26 304.91) rotate(-75.57)" fill="#6b3976"/><circle id="_路径_121" data-name="&lt;路径&gt;" cx="252.44" cy="60.62" r="2.67" transform="translate(130.83 289.99) rotate(-75.57)" fill="#6b3976"/><circle id="_路径_122" data-name="&lt;路径&gt;" cx="247.11" cy="52.48" r="2.67" transform="translate(134.71 278.71) rotate(-75.57)" fill="#6b3976"/><circle id="_路径_123" data-name="&lt;路径&gt;" cx="236.27" cy="72.11" r="2.67" transform="translate(107.56 282.96) rotate(-75.57)" fill="#6b3976"/><circle id="_路径_124" data-name="&lt;路径&gt;" cx="237.64" cy="81.7" r="2.67" transform="translate(99.29 291.49) rotate(-75.57)" fill="#6b3976"/><circle id="_路径_125" data-name="&lt;路径&gt;" cx="246.46" cy="77.48" r="3.54" transform="translate(110.01 296.86) rotate(-75.57)" fill="#6b3976"/><circle id="_路径_126" data-name="&lt;路径&gt;" cx="243.86" cy="46.82" r="3.54" transform="translate(137.74 271.32) rotate(-75.57)" fill="#6b3976"/><circle id="_路径_127" data-name="&lt;路径&gt;" cx="229.91" cy="50.74" r="3.54" transform="translate(123.48 260.75) rotate(-75.57)" fill="#6b3976"/><circle id="_路径_128" data-name="&lt;路径&gt;" cx="244.6" cy="89.25" r="2.67" transform="translate(97.21 303.9) rotate(-75.57)" fill="#6b3976"/><circle id="_路径_129" data-name="&lt;路径&gt;" cx="224.59" cy="61.66" r="2.67" transform="translate(108.92 263.8) rotate(-75.57)" fill="#6b3976"/><circle id="_路径_130" data-name="&lt;路径&gt;" cx="235.59" cy="45.35" r="2.67" transform="translate(132.96 262.21) rotate(-75.57)" fill="#6b3976"/><circle id="_路径_131" data-name="&lt;路径&gt;" cx="222.58" cy="50.2" r="2.67" transform="translate(118.5 253.25) rotate(-75.57)" fill="#6b3976"/><circle id="_路径_132" data-name="&lt;路径&gt;" cx="239.36" cy="61.85" r="2.67" transform="translate(119.82 278.25) rotate(-75.57)" fill="#6b3976"/><path id="_路径_133" data-name="&lt;路径&gt;" d="M222.73,50.26c2.33,5,7.66,7.49,13,7.08.19,0-.13.83-.39.85C229.94,58.6,224.55,56,222.2,51c-.11-.23.45-.94.53-.77Z" fill="#9b477b"/></g><g id="_编组_9" data-name="&lt;编组&gt;"><path id="_路径_134" data-name="&lt;路径&gt;" d="M172,26.63c17.4,1.51,33.6,9.35,47.71,19.29A130.82,130.82,0,0,1,239.93,63c.17.19.07,1.11-.19.84a130.16,130.16,0,0,0-20.13-17C205.52,36.93,189.36,29.1,172,27.59c-.29,0-.27-1,0-1Z" fill="#9b477b"/><path id="_路径_135" data-name="&lt;路径&gt;" d="M198.87,50.48c5-1.62,9.81-5.12,12.24-9.9.24-.48.48.41.34.68A21.42,21.42,0,0,1,199,51.41c-.36.12-.43-.84-.14-.93Z" fill="#9b477b"/><path id="_路径_136" data-name="&lt;路径&gt;" d="M189.83,47.66c5.74-1.85,11.19-5.89,14-11.36.14-.28.31.61.19.83-2.81,5.54-8.35,9.62-14.15,11.49-.18.06-.3-.87,0-1Z" fill="#9b477b"/><path id="_路径_137" data-name="&lt;路径&gt;" d="M183.61,39.21A16.13,16.13,0,0,0,193,31.57c.14-.28.32.6.2.83a16.45,16.45,0,0,1-9.58,7.77c-.2.06-.31-.87,0-1Z" fill="#9b477b"/><path id="_路径_138" data-name="&lt;路径&gt;" d="M167.28,36.17c6.82.77,14.9-1,19.31-6.72.21-.27.34.64.19.83-4.47,5.83-12.57,7.63-19.49,6.85-.27,0-.24-1,0-1Z" fill="#9b477b"/><path id="_路径_139" data-name="&lt;路径&gt;" d="M170.46,16.05a15,15,0,0,1,12.28,12.6c.07.42-.3.91-.4.26A14.35,14.35,0,0,0,170.47,17c-.31-.05-.27-1,0-1Z" fill="#9b477b"/><path id="_路径_140" data-name="&lt;路径&gt;" d="M182.75,16.93c4,3.31,8.11,8.47,7.73,14,0,.59-.73.61-.69,0,.36-5.23-3.66-10.08-7.38-13.18-.33-.27-.08-1.19.34-.84Z" fill="#9b477b"/><path id="_路径_141" data-name="&lt;路径&gt;" d="M196.36,15.83a26,26,0,0,1,5.45,19.56c-.1.64-.63.24-.55-.25,1-6.49-1.2-13.38-5.18-18.47-.21-.27,0-1.2.28-.84Z" fill="#9b477b"/><circle id="_路径_142" data-name="&lt;路径&gt;" cx="196.22" cy="16.24" r="2.67" transform="translate(2.86 53.38) rotate(-15.61)" fill="#6b3976"/><circle id="_路径_143" data-name="&lt;路径&gt;" cx="203.85" cy="23.7" r="2.67" transform="translate(1.14 55.71) rotate(-15.61)" fill="#6b3976"/><circle id="_路径_144" data-name="&lt;路径&gt;" cx="191.84" cy="21.58" r="2.67" transform="translate(1.27 52.41) rotate(-15.61)" fill="#6b3976"/><circle id="_路径_145" data-name="&lt;路径&gt;" cx="183.15" cy="17.2" r="2.67" transform="translate(2.13 49.91) rotate(-15.61)" fill="#6b3976"/><circle id="_路径_146" data-name="&lt;路径&gt;" cx="183.59" cy="39.61" r="2.67" transform="matrix(0.96, -0.27, 0.27, 0.96, -3.89, 50.85)" fill="#6b3976"/><circle id="_路径_147" data-name="&lt;路径&gt;" cx="189.58" cy="47.23" r="2.67" transform="translate(-5.72 52.74) rotate(-15.61)" fill="#6b3976"/><circle id="_路径_148" data-name="&lt;路径&gt;" cx="195.1" cy="39.17" r="3.54" transform="translate(-3.34 53.93) rotate(-15.61)" fill="#6b3976"/><circle id="_路径_149" data-name="&lt;路径&gt;" cx="177.5" cy="13.92" r="3.54" transform="translate(2.8 48.26) rotate(-15.61)" fill="#6b3976"/><circle id="_路径_150" data-name="&lt;路径&gt;" cx="167.38" cy="24.28" r="3.54" transform="translate(-0.36 45.92) rotate(-15.61)" fill="#6b3976"/><circle id="_路径_151" data-name="&lt;路径&gt;" cx="199.39" cy="50.29" r="2.67" transform="translate(-6.18 55.5) rotate(-15.61)" fill="#6b3976"/><circle id="_路径_152" data-name="&lt;路径&gt;" cx="168.25" cy="36.39" r="2.67" transform="translate(-3.59 46.6) rotate(-15.61)" fill="#6b3976"/><circle id="_路径_153" data-name="&lt;路径&gt;" cx="169.61" cy="16.77" r="2.67" transform="translate(1.74 46.25) rotate(-15.61)" fill="#6b3976"/><circle id="_路径_154" data-name="&lt;路径&gt;" cx="160.76" cy="27.47" r="2.67" transform="translate(-1.46 44.26) rotate(-15.61)" fill="#6b3976"/><circle id="_路径_155" data-name="&lt;路径&gt;" cx="181.13" cy="29.17" r="2.67" transform="translate(-1.17 49.8) rotate(-15.61)" fill="#6b3976"/><path id="_路径_156" data-name="&lt;路径&gt;" d="M160.92,27.44c4.5,3.13,10.38,2.66,14.83-.38.16-.11.3.79.09.93-4.5,3.08-10.45,3.55-15,.39-.21-.15-.08-1,.07-.93Z" fill="#9b477b"/></g><g id="_编组_10" data-name="&lt;编组&gt;"><path id="_路径_157" data-name="&lt;路径&gt;" d="M22.88,176.8c1.51,17.37,9.36,33.56,19.31,47.65a130.74,130.74,0,0,0,17.14,20.2c.19.17,1.11.07.84-.19a130.09,130.09,0,0,1-17-20.11c-9.93-14.07-17.77-30.21-19.28-47.55,0-.29-1-.27-1,0Z" fill="#9b477b"/><path id="_路径_158" data-name="&lt;路径&gt;" d="M46.76,203.64c-1.62,5-5.12,9.8-9.92,12.22-.48.24.41.48.68.34a21.4,21.4,0,0,0,10.17-12.43c.12-.36-.84-.43-.93-.14Z" fill="#9b477b"/><path id="_路径_159" data-name="&lt;路径&gt;" d="M43.94,194.62c-1.85,5.73-5.9,11.17-11.37,13.95-.28.14.61.31.84.19,5.54-2.81,9.63-8.34,11.5-14.13.06-.18-.87-.3-1,0Z" fill="#9b477b"/><path id="_路径_160" data-name="&lt;路径&gt;" d="M35.48,188.4a16.12,16.12,0,0,1-7.65,9.38c-.29.14.6.32.83.2a16.44,16.44,0,0,0,7.78-9.57c.06-.19-.87-.31-1,0Z" fill="#9b477b"/><path id="_路径_161" data-name="&lt;路径&gt;" d="M32.43,172.1c.77,6.81-1,14.88-6.72,19.29-.27.21.64.34.84.19,5.84-4.46,7.64-12.55,6.86-19.46,0-.27-1-.24-1,0Z" fill="#9b477b"/><path id="_路径_162" data-name="&lt;路径&gt;" d="M12.29,175.27A15,15,0,0,0,24.9,187.54c.43.07.91-.3.26-.4a14.35,14.35,0,0,1-11.91-11.86c-.05-.31-1-.27-1,0Z" fill="#9b477b"/><path id="_路径_163" data-name="&lt;路径&gt;" d="M13.17,187.55c3.31,4,8.48,8.1,14,7.72.59,0,.61-.73,0-.69-5.24.36-10.09-3.65-13.2-7.37-.27-.33-1.19-.08-.84.34Z" fill="#9b477b"/><path id="_路径_164" data-name="&lt;路径&gt;" d="M12.07,201.14a26.09,26.09,0,0,0,19.59,5.44c.64-.1.24-.63-.25-.55a24.72,24.72,0,0,1-18.5-5.17c-.27-.21-1.2,0-.84.28Z" fill="#9b477b"/><circle id="_路径_165" data-name="&lt;路径&gt;" cx="12.48" cy="201" r="2.67" transform="translate(-184.49 159.07) rotate(-74.43)" fill="#6b3976"/><circle id="_路径_166" data-name="&lt;路径&gt;" cx="19.95" cy="208.62" r="2.67" transform="translate(-186.37 171.83) rotate(-74.43)" fill="#6b3976"/><circle id="_路径_167" data-name="&lt;路径&gt;" cx="17.83" cy="196.63" r="2.67" transform="translate(-176.37 161.03) rotate(-74.43)" fill="#6b3976"/><circle id="_路径_168" data-name="&lt;路径&gt;" cx="13.44" cy="187.94" r="2.67" transform="translate(-171.22 150.44) rotate(-74.43)" fill="#6b3976"/><circle id="_路径_169" data-name="&lt;路径&gt;" cx="35.88" cy="188.38" r="2.67" transform="translate(-155.22 172.38) rotate(-74.43)" fill="#6b3976"/><circle id="_路径_170" data-name="&lt;路径&gt;" cx="43.51" cy="194.37" r="2.67" transform="matrix(0.27, -0.96, 0.96, 0.27, -155.4, 184.11)" fill="#6b3976"/><circle id="_路径_171" data-name="&lt;路径&gt;" cx="35.44" cy="199.88" r="3.54" transform="translate(-166.62 180.37) rotate(-74.43)" fill="#6b3976"/><circle id="_路径_172" data-name="&lt;路径&gt;" cx="10.16" cy="182.3" r="3.54" transform="matrix(0.27, -0.96, 0.96, 0.27, -168.18, 143.16)" fill="#6b3976"/><circle id="_路径_173" data-name="&lt;路径&gt;" cx="20.53" cy="172.2" r="3.54" transform="translate(-150.86 145.75) rotate(-74.43)" fill="#6b3976"/><circle id="_路径_174" data-name="&lt;路径&gt;" cx="46.58" cy="204.16" r="2.67" transform="translate(-162.6 194.23) rotate(-74.43)" fill="#6b3976"/><circle id="_路径_175" data-name="&lt;路径&gt;" cx="32.65" cy="173.06" r="2.67" transform="matrix(0.27, -0.96, 0.96, 0.27, -142.82, 158.06)" fill="#6b3976"/><circle id="_路径_176" data-name="&lt;路径&gt;" cx="13.01" cy="174.42" r="2.67" transform="translate(-158.5 140.14) rotate(-74.43)" fill="#6b3976"/><circle id="_路径_177" data-name="&lt;路径&gt;" cx="23.72" cy="165.58" r="2.67" transform="translate(-142.15 143.99) rotate(-74.43)" fill="#6b3976"/><circle id="_路径_178" data-name="&lt;路径&gt;" cx="25.43" cy="185.93" r="2.67" transform="translate(-160.5 160.52) rotate(-74.43)" fill="#6b3976"/><path id="_路径_179" data-name="&lt;路径&gt;" d="M23.7,165.74c3.14,4.49,2.66,10.37-.38,14.82-.11.16.79.3.93.09,3.08-4.5,3.56-10.44.39-15-.15-.21-1-.08-.94.07Z" fill="#9b477b"/></g><g id="_编组_11" data-name="&lt;编组&gt;"><path id="_路径_180" data-name="&lt;路径&gt;" d="M28.58,110c-7.39,15.8-8.69,33.74-7.13,50.91A130.56,130.56,0,0,0,26.18,187c.07.24.93.62.82.26a129.9,129.9,0,0,1-4.69-25.93c-1.56-17.14-.27-35,7.11-50.8.12-.26-.72-.73-.83-.49Z" fill="#9b477b"/><path id="_路径_181" data-name="&lt;路径&gt;" d="M35.82,145.22c-3.91,3.53-9.34,5.92-14.71,5.63-.54,0,.12.62.42.64a21.44,21.44,0,0,0,15-5.69c.28-.25-.51-.79-.74-.58Z" fill="#9b477b"/><path id="_路径_182" data-name="&lt;路径&gt;" d="M37.9,136c-4.47,4-10.7,6.73-16.83,6.4-.31,0,.37.57.63.59,6.21.33,12.52-2.41,17-6.49.14-.13-.6-.7-.83-.49Z" fill="#9b477b"/><path id="_路径_183" data-name="&lt;路径&gt;" d="M33.68,126.38a16.14,16.14,0,0,1-11.32,4.3c-.32,0,.36.58.62.59a16.47,16.47,0,0,0,11.53-4.4c.15-.14-.6-.71-.83-.49Z" fill="#9b477b"/><path id="_路径_184" data-name="&lt;路径&gt;" d="M39.2,110.74c-2.75,6.29-8.28,12.41-15.48,13.34-.34,0,.38.61.63.58,7.29-.95,12.9-7.06,15.68-13.43.11-.25-.74-.7-.83-.49Z" fill="#9b477b"/><path id="_路径_185" data-name="&lt;路径&gt;" d="M20.17,103.43A14.93,14.93,0,0,0,25,120.35c.33.27.94.2.43-.21A14.33,14.33,0,0,1,21,103.92c.11-.3-.74-.74-.83-.49Z" fill="#9b477b"/><path id="_路径_186" data-name="&lt;路径&gt;" d="M14.79,114.5c.89,5.08,3.29,11.25,8.29,13.69.53.26.89-.32.35-.59-4.72-2.3-6.91-8.2-7.74-13-.07-.42-1-.66-.9-.13Z" fill="#9b477b"/><path id="_路径_187" data-name="&lt;路径&gt;" d="M7,125.72a26,26,0,0,0,14.24,14.49c.6.23.52-.42.06-.6A24.68,24.68,0,0,1,7.89,125.9c-.13-.32-1-.6-.87-.18Z" fill="#9b477b"/><circle id="_路径_188" data-name="&lt;路径&gt;" cx="7.46" cy="125.81" r="2.67" transform="translate(-85.96 41.22) rotate(-44.45)" fill="#6b3976"/><circle id="_路径_189" data-name="&lt;路径&gt;" cx="10.11" cy="136.13" r="2.67" transform="translate(-92.44 46.03) rotate(-44.45)" fill="#6b3976"/><circle id="_路径_190" data-name="&lt;路径&gt;" cx="14.27" cy="124.69" r="2.67" transform="translate(-83.23 45.67) rotate(-44.45)" fill="#6b3976"/><circle id="_路径_191" data-name="&lt;路径&gt;" cx="14.82" cy="114.98" r="2.67" transform="translate(-76.27 43.28) rotate(-44.45)" fill="#6b3976"/><circle id="_路径_192" data-name="&lt;路径&gt;" cx="34.03" cy="126.57" r="2.67" transform="translate(-78.89 60.04) rotate(-44.45)" fill="#6b3976"/><circle id="_路径_193" data-name="&lt;路径&gt;" cx="37.65" cy="135.56" r="2.67" transform="translate(-84.16 65.15) rotate(-44.45)" fill="#6b3976"/><circle id="_路径_194" data-name="&lt;路径&gt;" cx="27.9" cy="136.31" r="3.54" transform="translate(-87.47 58.53) rotate(-44.45)" fill="#6b3976"/><circle id="_路径_195" data-name="&lt;路径&gt;" cx="14.8" cy="108.46" r="3.54" transform="translate(-71.71 41.4) rotate(-44.45)" fill="#6b3976"/><circle id="_路径_196" data-name="&lt;路径&gt;" cx="28.85" cy="104.88" r="3.54" transform="translate(-65.19 50.21) rotate(-44.45)" fill="#6b3976"/><circle id="_路径_197" data-name="&lt;路径&gt;" cx="35.4" cy="145.58" r="2.67" transform="translate(-91.81 66.44) rotate(-44.45)" fill="#6b3976"/><circle id="_路径_198" data-name="&lt;路径&gt;" cx="38.91" cy="111.68" r="2.67" transform="translate(-67.07 59.2) rotate(-44.45)" fill="#6b3976"/><circle id="_路径_199" data-name="&lt;路径&gt;" cx="21.22" cy="103.06" r="2.67" transform="translate(-66.09 44.35) rotate(-44.45)" fill="#6b3976"/><circle id="_路径_200" data-name="&lt;路径&gt;" cx="34.92" cy="100.75" r="2.67" transform="translate(-60.56 53.28) rotate(-44.45)" fill="#6b3976"/><circle id="_路径_201" data-name="&lt;路径&gt;" cx="26.21" cy="119.22" r="2.67" transform="translate(-75.99 52.47) rotate(-44.45)" fill="#6b3976"/><path id="_路径_202" data-name="&lt;路径&gt;" d="M34.82,100.88c.47,5.46-2.88,10.31-7.75,12.64-.17.08.53.66.76.55,4.92-2.36,8.31-7.26,7.83-12.78,0-.25-.86-.59-.85-.4Z" fill="#9b477b"/></g><g id="_编组_12" data-name="&lt;编组&gt;"><path id="_路径_203" data-name="&lt;路径&gt;" d="M66.93,55.07C52.62,65.07,42.51,80,35.27,95.6a130.6,130.6,0,0,0-8.95,24.93c-.06.25.5,1,.58.63a129.94,129.94,0,0,1,8.91-24.8C43,80.74,53.12,65.89,67.41,55.92c.24-.17-.26-1-.48-.84Z" fill="#9b477b"/><path id="_路径_204" data-name="&lt;路径&gt;" d="M55.59,89.16c-5.15,1.1-11.06.46-15.56-2.47-.45-.29-.21.6,0,.76A21.44,21.44,0,0,0,55.94,90c.37-.08-.05-.94-.35-.87Z" fill="#9b477b"/><path id="_路径_205" data-name="&lt;路径&gt;" d="M62,82.2c-5.89,1.26-12.64.49-17.78-2.86-.26-.17,0,.68.25.82,5.21,3.39,12,4.16,18,2.88.19,0-.17-.91-.48-.84Z" fill="#9b477b"/><path id="_路径_206" data-name="&lt;路径&gt;" d="M63.17,71.78a16.15,16.15,0,0,1-12-1.93c-.27-.17,0,.68.24.82a16.47,16.47,0,0,0,12.19,1.95c.2,0-.17-.91-.48-.84Z" fill="#9b477b"/><path id="_路径_207" data-name="&lt;路径&gt;" d="M75.78,61C70.26,65.06,62.4,67.6,55.7,64.82c-.31-.13,0,.72.25.82,6.79,2.82,14.7.33,20.31-3.8.22-.16-.29-1-.48-.84Z" fill="#9b477b"/><path id="_路径_208" data-name="&lt;路径&gt;" d="M63,45.15a14.93,14.93,0,0,0-4.33,17c.15.4.71.64.48,0A14.33,14.33,0,0,1,63.44,46c.25-.2-.27-1-.48-.84Z" fill="#9b477b"/><path id="_路径_209" data-name="&lt;路径&gt;" d="M52.76,52.06c-1.78,4.84-2.79,11.38.32,16,.33.49.94.17.6-.34-2.93-4.35-1.88-10.55-.21-15.1.15-.4-.53-1.07-.71-.56Z" fill="#9b477b"/><path id="_路径_210" data-name="&lt;路径&gt;" d="M40.42,57.89A26,26,0,0,0,45.5,77.55c.41.5.66-.11.35-.49a24.64,24.64,0,0,1-4.77-18.58c0-.34-.6-1-.66-.59Z" fill="#9b477b"/><circle id="_路径_211" data-name="&lt;路径&gt;" cx="40.75" cy="58.18" r="2.67" transform="translate(-13.21 11.99) rotate(-14.43)" fill="#6b3976"/><circle id="_路径_212" data-name="&lt;路径&gt;" cx="37.87" cy="68.45" r="2.67" transform="translate(-15.86 11.6) rotate(-14.43)" fill="#6b3976"/><circle id="_路径_213" data-name="&lt;路径&gt;" cx="47.21" cy="60.62" r="2.67" transform="translate(-13.62 13.68) rotate(-14.43)" fill="#6b3976"/><circle id="_路径_214" data-name="&lt;路径&gt;" cx="52.55" cy="52.48" r="2.67" transform="translate(-11.42 14.75) rotate(-14.43)" fill="#6b3976"/><circle id="_路径_215" data-name="&lt;路径&gt;" cx="63.38" cy="72.11" r="2.67" transform="translate(-15.97 18.07) rotate(-14.43)" fill="#6b3976"/><circle id="_路径_216" data-name="&lt;路径&gt;" cx="62.01" cy="81.7" r="2.67" transform="translate(-18.4 18.03) rotate(-14.43)" fill="#6b3976"/><circle id="_路径_217" data-name="&lt;路径&gt;" cx="53.19" cy="77.48" r="3.54" transform="translate(-17.63 15.7) rotate(-14.43)" fill="#6b3976"/><circle id="_路径_218" data-name="&lt;路径&gt;" cx="55.8" cy="46.82" r="3.54" transform="translate(-9.91 15.38) rotate(-14.43)" fill="#6b3976"/><circle id="_路径_219" data-name="&lt;路径&gt;" cx="69.74" cy="50.74" r="3.54" transform="translate(-10.44 18.98) rotate(-14.43)" fill="#6b3976"/><circle id="_路径_220" data-name="&lt;路径&gt;" cx="55.05" cy="89.25" r="2.67" transform="translate(-20.5 16.53) rotate(-14.43)" fill="#6b3976"/><circle id="_路径_221" data-name="&lt;路径&gt;" cx="75.06" cy="61.66" r="2.67" transform="translate(-13 20.65) rotate(-14.43)" fill="#6b3976"/><circle id="_路径_222" data-name="&lt;路径&gt;" cx="64.06" cy="45.35" r="2.67" transform="translate(-9.28 17.39) rotate(-14.43)" fill="#6b3976"/><circle id="_路径_223" data-name="&lt;路径&gt;" cx="77.08" cy="50.2" r="2.67" transform="translate(-10.08 20.79) rotate(-14.43)" fill="#6b3976"/><circle id="_路径_224" data-name="&lt;路径&gt;" cx="60.29" cy="61.85" r="2.67" transform="translate(-13.51 16.97) rotate(-14.43)" fill="#6b3976"/><path id="_路径_225" data-name="&lt;路径&gt;" d="M76.92,50.26c-2.33,5-7.66,7.49-13,7.08-.19,0,.13.83.39.85C69.71,58.6,75.1,56,77.45,51c.11-.23-.45-.94-.53-.77Z" fill="#9b477b"/></g><g id="_编组_13" data-name="&lt;编组&gt;"><path id="_路径_226" data-name="&lt;路径&gt;" d="M127.66,26.63C110.27,28.13,94.06,36,80,45.91A130.82,130.82,0,0,0,59.72,63c-.17.19-.07,1.11.19.84A130.16,130.16,0,0,1,80,46.85c14.08-9.92,30.24-17.75,47.61-19.25.29,0,.27-1,0-1Z" fill="#9b477b"/><path id="_路径_227" data-name="&lt;路径&gt;" d="M100.78,50.48c-5-1.62-9.81-5.12-12.24-9.9-.24-.48-.48.41-.34.68a21.42,21.42,0,0,0,12.45,10.16c.36.12.43-.84.14-.93Z" fill="#9b477b"/><path id="_路径_228" data-name="&lt;路径&gt;" d="M109.82,47.66c-5.74-1.85-11.19-5.89-14-11.36-.14-.28-.31.61-.19.83,2.81,5.54,8.35,9.62,14.15,11.49.18.06.3-.87,0-1Z" fill="#9b477b"/><path id="_路径_229" data-name="&lt;路径&gt;" d="M116,39.21a16.13,16.13,0,0,1-9.39-7.64c-.14-.28-.32.6-.2.83A16.45,16.45,0,0,0,116,40.18c.2.06.31-.87,0-1Z" fill="#9b477b"/><path id="_路径_230" data-name="&lt;路径&gt;" d="M132.37,36.17c-6.82.77-14.9-1-19.31-6.72-.21-.27-.34.64-.19.83,4.47,5.83,12.57,7.63,19.49,6.85.27,0,.24-1,0-1Z" fill="#9b477b"/><path id="_路径_231" data-name="&lt;路径&gt;" d="M129.19,16.05a15,15,0,0,0-12.28,12.6c-.07.42.3.91.4.26A14.35,14.35,0,0,1,129.18,17c.31-.05.27-1,0-1Z" fill="#9b477b"/><path id="_路径_232" data-name="&lt;路径&gt;" d="M116.9,16.93c-4,3.31-8.11,8.47-7.73,14,0,.59.73.61.69,0-.36-5.23,3.66-10.08,7.38-13.18.33-.27.08-1.19-.34-.84Z" fill="#9b477b"/><path id="_路径_233" data-name="&lt;路径&gt;" d="M103.29,15.83a26,26,0,0,0-5.45,19.56c.1.64.63.24.55-.25-1-6.49,1.2-13.38,5.18-18.47.21-.27,0-1.2-.28-.84Z" fill="#9b477b"/><circle id="_路径_234" data-name="&lt;路径&gt;" cx="103.43" cy="16.24" r="2.67" transform="translate(59.96 111.49) rotate(-74.39)" fill="#6b3976"/><circle id="_路径_235" data-name="&lt;路径&gt;" cx="95.8" cy="23.7" r="2.67" transform="translate(47.21 109.59) rotate(-74.39)" fill="#6b3976"/><circle id="_路径_236" data-name="&lt;路径&gt;" cx="107.81" cy="21.58" r="2.67" transform="translate(58.02 119.61) rotate(-74.39)" fill="#6b3976"/><circle id="_路径_237" data-name="&lt;路径&gt;" cx="116.5" cy="17.2" r="2.67" transform="translate(68.6 124.78) rotate(-74.39)" fill="#6b3976"/><circle id="_路径_238" data-name="&lt;路径&gt;" cx="116.06" cy="39.61" r="2.67" transform="translate(46.69 140.73) rotate(-74.39)" fill="#6b3976"/><circle id="_路径_239" data-name="&lt;路径&gt;" cx="110.07" cy="47.23" r="2.67" transform="translate(34.97 140.54) rotate(-74.39)" fill="#6b3976"/><circle id="_路径_240" data-name="&lt;路径&gt;" cx="104.55" cy="39.17" r="3.54" transform="translate(38.7 129.32) rotate(-74.39)" fill="#6b3976"/><circle id="_路径_241" data-name="&lt;路径&gt;" cx="122.15" cy="13.92" r="3.54" transform="translate(75.88 127.82) rotate(-74.39)" fill="#6b3976"/><circle id="_路径_242" data-name="&lt;路径&gt;" cx="132.27" cy="24.28" r="3.54" transform="translate(73.3 145.14) rotate(-74.39)" fill="#6b3976"/><circle id="_路径_243" data-name="&lt;路径&gt;" cx="100.26" cy="50.29" r="2.67" transform="translate(24.85 133.33) rotate(-74.39)" fill="#6b3976"/><circle id="_路径_244" data-name="&lt;路径&gt;" cx="131.41" cy="36.39" r="2.67" transform="translate(61.01 153.16) rotate(-74.39)" fill="#6b3976"/><circle id="_路径_245" data-name="&lt;路径&gt;" cx="130.04" cy="16.77" r="2.67" transform="matrix(0.27, -0.96, 0.96, 0.27, 78.9, 137.51)" fill="#6b3976"/><circle id="_路径_246" data-name="&lt;路径&gt;" cx="138.89" cy="27.47" r="2.67" transform="matrix(0.27, -0.96, 0.96, 0.27, 75.07, 153.85)" fill="#6b3976"/><circle id="_路径_247" data-name="&lt;路径&gt;" cx="118.52" cy="29.17" r="2.67" transform="translate(58.54 135.48) rotate(-74.39)" fill="#6b3976"/><path id="_路径_248" data-name="&lt;路径&gt;" d="M138.73,27.44c-4.5,3.13-10.38,2.66-14.83-.38-.16-.11-.3.79-.09.93,4.5,3.08,10.45,3.55,15,.39.21-.15.08-1-.07-.93Z" fill="#9b477b"/></g><g id="_编组_14" data-name="&lt;编组&gt;"><g id="_编组_15" data-name="&lt;编组&gt;"><path id="_路径_249" data-name="&lt;路径&gt;" d="M162.25,272c19.68,2.21,28.42.45,39-7.86,10.24-8.07,25.14-4.4,25.29-4.36l.2-.78c-.15,0-15.44-3.8-26,4.51s-18.71,9.89-38.36,7.69Z" fill="#a38583"/><path id="_路径_250" data-name="&lt;路径&gt;" d="M237.61,261.66c-6.44,3.26-12.51,1.68-15-1s2.87-4.33,8.14-2.85S237.61,261.66,237.61,261.66Z" fill="#a38583"/><path id="_路径_251" data-name="&lt;路径&gt;" d="M226.26,245.86c.33,6-3.41,9.37-6.73,9.78s-2.66-4.08.69-7S226.26,245.86,226.26,245.86Z" fill="#a38583"/><path id="_路径_252" data-name="&lt;路径&gt;" d="M204.89,261.52A21.34,21.34,0,0,0,218,264.94l-.07-.8a20.87,20.87,0,0,1-12.61-3.27Z" fill="#a38583"/><path id="_路径_253" data-name="&lt;路径&gt;" d="M224.8,264.73s-11.9,3.89-12.79-.07S220.78,262,224.8,264.73Z" fill="#a38583"/><path id="_路径_254" data-name="&lt;路径&gt;" d="M189.78,269.87l.25.76c4.77-1.53,5.83-5.09,7-8.86s2.35-7.89,7.66-10.44l-.35-.72c-5.63,2.71-6.93,7.08-8.08,10.94S194.15,268.47,189.78,269.87Z" fill="#a38583"/><path id="_路径_255" data-name="&lt;路径&gt;" d="M197.66,258.73a33.2,33.2,0,0,0,11.88-1.34l-.25-.76a33,33,0,0,1-11.56,1.31Z" fill="#a38583"/><path id="_路径_256" data-name="&lt;路径&gt;" d="M195.65,262.61q0,.39,0,.77l.8,0c-.34-6.75,3.24-15.46,3.27-15.54l-.74-.31C198.86,247.83,195.57,255.82,195.65,262.61Z" fill="#a38583"/><path id="_路径_257" data-name="&lt;路径&gt;" d="M213.55,256.33c-4.64-1.85-7.13-1.84-9.57-.9a8.42,8.42,0,0,0-3.73,3s2.35,2.38,7,1.88A7.8,7.8,0,0,0,213.55,256.33Z" fill="#a38583"/><path id="_路径_258" data-name="&lt;路径&gt;" d="M198.53,256.82c.68.09,16.74,2.15,21.08-2.73l-.6-.53C215,258.12,198.8,256,198.63,256Z" fill="#a38583"/><path id="_路径_259" data-name="&lt;路径&gt;" d="M202.62,252.74c4.92,1.26,8.34.59,10.05-3a14.21,14.21,0,0,0,1.69-5.59,9.7,9.7,0,0,0-9.41,2.55C200.59,251,202.16,252.63,202.62,252.74Z" fill="#a38583"/><path id="_路径_260" data-name="&lt;路径&gt;" d="M197.49,253.28c-2.6-3.67-1.05-8,.94-10.24a20.49,20.49,0,0,1,4.31-3.55,11.1,11.1,0,0,1-.41,9.87C199.54,254.92,197.49,253.28,197.49,253.28Z" fill="#a38583"/><path id="_路径_261" data-name="&lt;路径&gt;" d="M185.61,271.09l.15.79c5.8-1.12,9-.84,14.29,1.26l.3-.75C194.89,270.23,191.59,269.93,185.61,271.09Z" fill="#a38583"/><path id="_路径_262" data-name="&lt;路径&gt;" d="M208.61,275.46c-5.46.91-6.72,1.56-9.84-1.47s2.55-3.74,5.56-3S208.61,275.46,208.61,275.46Z" fill="#a38583"/></g><path id="_路径_263" data-name="&lt;路径&gt;" d="M165.73,272.23c.14.14,13.77,13.44,26,7.84l-.33-.73c-11.75,5.37-25-7.54-25.12-7.68Z" fill="#a38583"/><path id="_路径_264" data-name="&lt;路径&gt;" d="M200.47,277.32c-2.85,5.49-6.55,4.1-8.19,3.44s-1.68-1.41.71-4.09S200.47,277.32,200.47,277.32Z" fill="#a38583"/><path id="_路径_265" data-name="&lt;路径&gt;" d="M200.7,288.38c-5.7,2.43-7.67-1-8.51-2.54s-.19-3,3.36-2.39A6.22,6.22,0,0,1,200.7,288.38Z" fill="#a38583"/><path id="_路径_266" data-name="&lt;路径&gt;" d="M184.48,281.47c2.86.08,5.33.91,8.79,4.79l.6-.53c-3.66-4.09-6.3-5-9.37-5.05Z" fill="#a38583"/></g><g id="_编组_16" data-name="&lt;编组&gt;"><g id="_编组_17" data-name="&lt;编组&gt;"><path id="_路径_267" data-name="&lt;路径&gt;" d="M162.25,29.44c19.68-2.21,28.42-.45,39,7.86,10.24,8.07,25.14,4.4,25.29,4.36l.2.78c-.15,0-15.44,3.8-26-4.51S182,28,162.34,30.23Z" fill="#a38583"/><path id="_路径_268" data-name="&lt;路径&gt;" d="M237.61,39.74c-6.44-3.26-12.51-1.68-15,1s2.87,4.33,8.14,2.85S237.61,39.74,237.61,39.74Z" fill="#a38583"/><path id="_路径_269" data-name="&lt;路径&gt;" d="M226.26,55.54c.33-6-3.41-9.37-6.73-9.78s-2.66,4.08.69,7S226.26,55.54,226.26,55.54Z" fill="#a38583"/><path id="_路径_270" data-name="&lt;路径&gt;" d="M204.89,39.88A21.34,21.34,0,0,1,218,36.46l-.07.8a20.87,20.87,0,0,0-12.61,3.27Z" fill="#a38583"/><path id="_路径_271" data-name="&lt;路径&gt;" d="M224.8,36.67s-11.9-3.89-12.79.07S220.78,39.38,224.8,36.67Z" fill="#a38583"/><path id="_路径_272" data-name="&lt;路径&gt;" d="M189.78,31.53l.25-.76c4.77,1.53,5.83,5.09,7,8.86s2.35,7.89,7.66,10.44l-.35.72c-5.63-2.71-6.93-7.08-8.08-10.94S194.15,32.93,189.78,31.53Z" fill="#a38583"/><path id="_路径_273" data-name="&lt;路径&gt;" d="M197.66,42.67A33.2,33.2,0,0,1,209.54,44l-.25.76a33,33,0,0,0-11.56-1.31Z" fill="#a38583"/><path id="_路径_274" data-name="&lt;路径&gt;" d="M195.65,38.79q0-.39,0-.77l.8,0c-.34,6.75,3.24,15.46,3.27,15.54l-.74.31C198.86,53.57,195.57,45.58,195.65,38.79Z" fill="#a38583"/><path id="_路径_275" data-name="&lt;路径&gt;" d="M213.55,45.07c-4.64,1.85-7.13,1.84-9.57.9a8.42,8.42,0,0,1-3.73-3s2.35-2.38,7-1.88A7.8,7.8,0,0,1,213.55,45.07Z" fill="#a38583"/><path id="_路径_276" data-name="&lt;路径&gt;" d="M198.53,44.58c.68-.09,16.74-2.15,21.08,2.73l-.6.53c-4.05-4.56-20.21-2.49-20.37-2.47Z" fill="#a38583"/><path id="_路径_277" data-name="&lt;路径&gt;" d="M202.62,48.66c4.92-1.26,8.34-.59,10.05,3a14.21,14.21,0,0,1,1.69,5.59,9.7,9.7,0,0,1-9.41-2.55C200.59,50.43,202.16,48.77,202.62,48.66Z" fill="#a38583"/><path id="_路径_278" data-name="&lt;路径&gt;" d="M197.49,48.12c-2.6,3.67-1.05,8,.94,10.24a20.49,20.49,0,0,0,4.31,3.55,11.1,11.1,0,0,0-.41-9.87C199.54,46.48,197.49,48.12,197.49,48.12Z" fill="#a38583"/><path id="_路径_279" data-name="&lt;路径&gt;" d="M185.61,30.31l.15-.79c5.8,1.12,9,.84,14.29-1.26l.3.75C194.89,31.17,191.59,31.47,185.61,30.31Z" fill="#a38583"/><path id="_路径_280" data-name="&lt;路径&gt;" d="M208.61,25.94c-5.46-.91-6.72-1.56-9.84,1.47s2.55,3.74,5.56,3S208.61,25.94,208.61,25.94Z" fill="#a38583"/></g><path id="_路径_281" data-name="&lt;路径&gt;" d="M165.73,29.17c.14-.14,13.77-13.44,26-7.84l-.33.73c-11.75-5.37-25,7.54-25.12,7.68Z" fill="#a38583"/><path id="_路径_282" data-name="&lt;路径&gt;" d="M200.47,24.08c-2.85-5.49-6.55-4.1-8.19-3.44s-1.68,1.41.71,4.09S200.47,24.08,200.47,24.08Z" fill="#a38583"/><path id="_路径_283" data-name="&lt;路径&gt;" d="M200.7,13c-5.7-2.43-7.67,1-8.51,2.54s-.19,3,3.36,2.39A6.22,6.22,0,0,0,200.7,13Z" fill="#a38583"/><path id="_路径_284" data-name="&lt;路径&gt;" d="M184.48,19.93c2.86-.08,5.33-.91,8.79-4.79l.6.53c-3.66,4.09-6.3,5-9.37,5.05Z" fill="#a38583"/></g><g id="_编组_18" data-name="&lt;编组&gt;"><g id="_编组_19" data-name="&lt;编组&gt;"><path id="_路径_285" data-name="&lt;路径&gt;" d="M140.13,29.44c-19.68-2.21-28.42-.45-39,7.86C90.93,45.37,76,41.69,75.89,41.66l-.2.78c.15,0,15.44,3.8,26-4.51S120.38,28,140,30.23Z" fill="#a38583"/><path id="_路径_286" data-name="&lt;路径&gt;" d="M64.77,39.74c6.44-3.26,12.51-1.68,15,1s-2.87,4.33-8.14,2.85S64.77,39.74,64.77,39.74Z" fill="#a38583"/><path id="_路径_287" data-name="&lt;路径&gt;" d="M76.11,55.54c-.33-6,3.41-9.37,6.73-9.78s2.66,4.08-.69,7S76.11,55.54,76.11,55.54Z" fill="#a38583"/><path id="_路径_288" data-name="&lt;路径&gt;" d="M97.49,39.88a21.34,21.34,0,0,0-13.15-3.42l.07.8A20.87,20.87,0,0,1,97,40.53Z" fill="#a38583"/><path id="_路径_289" data-name="&lt;路径&gt;" d="M77.58,36.67s11.9-3.89,12.79.07S81.59,39.38,77.58,36.67Z" fill="#a38583"/><path id="_路径_290" data-name="&lt;路径&gt;" d="M112.59,31.53l-.25-.76c-4.77,1.53-5.83,5.09-7,8.86s-2.35,7.89-7.66,10.44l.35.72c5.63-2.71,6.93-7.08,8.08-10.94S108.23,32.93,112.59,31.53Z" fill="#a38583"/><path id="_路径_291" data-name="&lt;路径&gt;" d="M104.72,42.67A33.2,33.2,0,0,0,92.84,44l.25.76a33,33,0,0,1,11.56-1.31Z" fill="#a38583"/><path id="_路径_292" data-name="&lt;路径&gt;" d="M106.73,38.79q0-.39,0-.77l-.8,0c.34,6.75-3.24,15.46-3.27,15.54l.74.31C103.51,53.57,106.81,45.58,106.73,38.79Z" fill="#a38583"/><path id="_路径_293" data-name="&lt;路径&gt;" d="M88.83,45.07c4.64,1.85,7.13,1.84,9.57.9a8.42,8.42,0,0,0,3.73-3s-2.35-2.38-7-1.88A7.8,7.8,0,0,0,88.83,45.07Z" fill="#a38583"/><path id="_路径_294" data-name="&lt;路径&gt;" d="M103.85,44.58c-.68-.09-16.74-2.15-21.08,2.73l.6.53c4.05-4.56,20.21-2.49,20.37-2.47Z" fill="#a38583"/><path id="_路径_295" data-name="&lt;路径&gt;" d="M99.75,48.66c-4.92-1.26-8.34-.59-10.05,3A14.21,14.21,0,0,0,88,57.22a9.7,9.7,0,0,0,9.41-2.55C101.79,50.43,100.21,48.77,99.75,48.66Z" fill="#a38583"/><path id="_路径_296" data-name="&lt;路径&gt;" d="M104.89,48.12c2.6,3.67,1.05,8-.94,10.24a20.49,20.49,0,0,1-4.31,3.55,11.1,11.1,0,0,1,.41-9.87C102.83,46.48,104.89,48.12,104.89,48.12Z" fill="#a38583"/><path id="_路径_297" data-name="&lt;路径&gt;" d="M116.77,30.31l-.15-.79c-5.8,1.12-9,.84-14.29-1.26L102,29C107.48,31.17,110.79,31.47,116.77,30.31Z" fill="#a38583"/><path id="_路径_298" data-name="&lt;路径&gt;" d="M93.77,25.94c5.46-.91,6.72-1.56,9.84,1.47s-2.55,3.74-5.56,3S93.77,25.94,93.77,25.94Z" fill="#a38583"/></g><path id="_路径_299" data-name="&lt;路径&gt;" d="M136.65,29.17c-.14-.14-13.77-13.44-26-7.84l.33.73c11.75-5.37,25,7.54,25.12,7.68Z" fill="#a38583"/><path id="_路径_300" data-name="&lt;路径&gt;" d="M101.9,24.08c2.85-5.49,6.55-4.1,8.19-3.44s1.68,1.41-.71,4.09S101.9,24.08,101.9,24.08Z" fill="#a38583"/><path id="_路径_301" data-name="&lt;路径&gt;" d="M101.68,13c5.7-2.43,7.67,1,8.51,2.54s.19,3-3.36,2.39A6.22,6.22,0,0,1,101.68,13Z" fill="#a38583"/><path id="_路径_302" data-name="&lt;路径&gt;" d="M117.9,19.93c-2.86-.08-5.33-.91-8.79-4.79l-.6.53c3.66,4.09,6.3,5,9.37,5.05Z" fill="#a38583"/></g><g id="_编组_20" data-name="&lt;编组&gt;"><path id="_路径_303" data-name="&lt;路径&gt;" d="M153.28,283.68c7.39-3.8,9.08-8,5.61-12.36s-8.07-13.23-2.2-19.93,10.78-5.89,13-9.61-.12,4.14,2.11,10.63.15,12.74-3.05,15.75-1.75,2.94,3.59-2.08,7.27-12.2,14.1-14.81,16.8.15,19.6.76-1.45,1.25-4.49,5.76-4.95,8.3-15.73,9.86-14.88,2.53-18.34,6c-2.38,2.37,2.78-1.52,13-.92,9.66.57,12,5.94,14,12s7.92,6.58.27,6.83-14.7,1.38-24.48-5.76c-8.6-6.28-4.37-9.63-9.83-4.79s-9,6.93-9.72,7.11S149.06,285.85,153.28,283.68Z" fill="#60ad8e"/><path id="_路径_304" data-name="&lt;路径&gt;" d="M138.56,283.72c-7.39-3.8-9.08-8-5.61-12.36s8.07-13.23,2.2-19.93-10.78-5.89-13-9.61.12,4.14-2.11,10.63-.15,12.74,3.05,15.75,1.75,2.94-3.59-2.08-7.27-12.2-14.1-14.81-16.8.15-19.6.76,1.45,1.25,4.49,5.76,4.95,8.3,15.73,9.86,14.88,2.53,18.34,6c2.38,2.37-2.78-1.52-13-.92-9.66.57-12,5.94-14,12s-7.92,6.58-.27,6.83,14.7,1.38,24.48-5.76c8.6-6.28,4.37-9.63,9.83-4.79s9,6.93,9.72,7.11S142.78,285.9,138.56,283.72Z" fill="#60ad8e"/><g id="_编组_21" data-name="&lt;编组&gt;"><path id="_路径_305" data-name="&lt;路径&gt;" d="M147.42,279.06c1.13-14.43,5.72-19.59,10.82-17.59s5.19,10.21.19,14.44-7.19,6.13-3.4,4,10.1-4.7,15.16-.36-.3,11-6.56,9.29-10.53-3.3-9-2.37,8.18,3.34,8.24,9.71-7.27,7-10,2.46-3.75-10.12-4.6-9.11,1.94,5.63-3.46,11.94-12.85.76-9.69-5.93,10.24-10.73,5.32-8.45-10.74,1.9-12.3-3.26,4.21-6.77,10.07-5.44,3.53.2-1.23-2.81-6.61-10.37-1.15-13,10.76,1.61,10.81,7.76S147.26,281,147.42,279.06Z" fill="#f7c2d8"/><path id="_路径_306" data-name="&lt;路径&gt;" d="M148.74,278.79c4.8-12.75,10.31-16.23,14.4-13.07s2,10.59-3.62,13.11-8.11,3.66-4.12,2.72,10.37-1.61,13.81,3.64-3.16,9.89-8.38,6.68-8.66-5.74-7.47-4.49,6.52,5.16,4.91,10.94-8.41,4.41-9.7-.4-.73-10.14-1.77-9.44.28,5.6-6.27,9.89-11.82-2.68-7.21-7.9,12.07-7,7-6.25-10.22-1.09-10.27-6.17,5.59-5,10.54-2.28,3.14,1.11-.37-2.86-3.25-11.11,2.38-12.07,9.31,4.27,7.74,9.85S148.1,280.51,148.74,278.79Z" fill="#dc2f5d"/><path id="_路径_307" data-name="&lt;路径&gt;" d="M146.65,280c-2.46-13.4.47-19.21,5.59-18.62s7.19,8,3.66,13.1-5.06,7.31-2.13,4.45,8.05-6.71,13.71-4,2.4,10.11-3.73,10-10.38-.46-8.72,0,8.25,1.06,9.85,6.85-4.93,8.11-8.52,4.65-5.86-8.31-6.39-7.18,3.13,4.65-.27,11.7-11.52,3.79-10.25-3.06,6.72-12.23,2.8-9-9.32,4.32-12,0,2.2-7.18,7.85-7.38,3.26-.66-1.8-2.26-8.52-7.85-4.19-11.57,10.18-1.13,11.72,4.45S147,281.86,146.65,280Z" fill="#ff9ebb"/><path id="_路径_308" data-name="&lt;路径&gt;" d="M152.31,281.59a2.83,2.83,0,0,0-1.75.25,4.9,4.9,0,0,0-.32-3.19c-.72-1.9-1.77,0-2.52.87a2.82,2.82,0,0,0-.66,1.63,4.93,4.93,0,0,0-2.92-1.31c-2-.33-.91,1.52-.51,2.61a2.82,2.82,0,0,0,1.08,1.39,4.93,4.93,0,0,0-2.6,1.87c-1.29,1.57.86,1.55,2,1.74a2.82,2.82,0,0,0,1.75-.25,4.9,4.9,0,0,0,.32,3.19c.72,1.9,1.77,0,2.52-.87a2.82,2.82,0,0,0,.66-1.63,4.93,4.93,0,0,0,2.92,1.31c2,.33.91-1.52.51-2.61a2.82,2.82,0,0,0-1.08-1.39,4.93,4.93,0,0,0,2.6-1.87C155.61,281.77,153.46,281.79,152.31,281.59Z" fill="#be1b42"/><circle id="_路径_309" data-name="&lt;路径&gt;" cx="148.22" cy="284.53" r="1.33" fill="#ede0e7"/></g></g><path id="_路径_310" data-name="&lt;路径&gt;" d="M256.66,225.2c3.81-2,4.68-4.1,2.89-6.37s-4.16-6.82-1.13-10.27,5.56-3,6.7-5-.06,2.14,1.09,5.48a7.88,7.88,0,0,1-1.57,8.12c-1.65,1.55-.9,1.52,1.85-1.07s3.75-6.29,7.27-7.63,8.66.08,10.1.39-.75.64-2.31,3-2.55,4.28-8.11,5.08-7.67,1.31-9.45,3.08c-1.23,1.22,1.43-.79,6.69-.47,5,.3,6.21,3.06,7.24,6.21s4.08,3.39.14,3.52-7.58.71-12.62-3c-4.43-3.24-2.25-5-5.07-2.47a22,22,0,0,1-5,3.66C255,227.59,254.48,226.32,256.66,225.2Z" fill="#60ad8e"/><path id="_路径_311" data-name="&lt;路径&gt;" d="M277.89,162c2.32-3.6,2-5.89-.69-7s-7-3.83-6.12-8.33,3.29-5.41,3.32-7.64,1,1.88,3.69,4.2a7.88,7.88,0,0,1,2.7,7.82c-.65,2.17,0,1.76,1.06-1.85s.1-7.32,2.47-10.24,7.54-4.26,8.95-4.71-.32.93-.52,3.73-.07,5-4.48,8.45-6,5-6.64,7.39c-.45,1.67.85-1.4,5.56-3.75,4.46-2.23,6.91-.45,9.38,1.76s5.24.9,1.88,3-6.21,4.4-12.41,3.73c-5.46-.59-4.44-3.17-5.63.39a21.92,21.92,0,0,1-2.51,5.67C277.64,164.91,276.56,164.07,277.89,162Z" fill="#60ad8e"/><path id="_路径_312" data-name="&lt;路径&gt;" d="M264.64,96.68c.21-4.27-1.22-6.1-4.08-5.69s-8,.19-9.47-4.16.15-6.33-.95-8.27,1.82,1.12,5.29,1.8a7.89,7.89,0,0,1,6.25,5.42c.52,2.21.86,1.54,0-2.14s-3.58-6.38-3-10.1,4.4-7.45,5.39-8.55.18,1,1.42,3.49,2.44,4.35.36,9.55-2.7,7.29-2.05,9.72c.45,1.67,0-1.63,2.94-6,2.75-4.16,5.76-3.84,9-3.16s5-1.84,3.12,1.64-3.17,6.91-8.88,9.43c-5,2.21-5.43-.53-4.68,3.15A21.91,21.91,0,0,1,266,99C265.88,99.32,264.52,99.12,264.64,96.68Z" fill="#60ad8e"/><path id="_路径_313" data-name="&lt;路径&gt;" d="M43.34,225.2c-3.81-2-4.68-4.1-2.89-6.37s4.16-6.82,1.13-10.27-5.56-3-6.7-5,.06,2.14-1.09,5.48a7.88,7.88,0,0,0,1.57,8.12c1.65,1.55.9,1.52-1.85-1.07s-3.75-6.29-7.27-7.63-8.66.08-10.1.39.75.64,2.31,3,2.55,4.28,8.11,5.08S34.24,218.24,36,220c1.23,1.22-1.43-.79-6.69-.47-5,.3-6.21,3.06-7.24,6.21S18,229.15,22,229.28s7.58.71,12.62-3c4.43-3.24,2.25-5,5.07-2.47a22,22,0,0,0,5,3.66C45,227.59,45.52,226.32,43.34,225.2Z" fill="#60ad8e"/><path id="_路径_314" data-name="&lt;路径&gt;" d="M22.11,162c-2.32-3.6-2-5.89.69-7s7-3.83,6.12-8.33-3.29-5.41-3.32-7.64-1,1.88-3.69,4.2a7.88,7.88,0,0,0-2.7,7.82c.65,2.17,0,1.76-1.06-1.85s-.1-7.32-2.47-10.24-7.54-4.26-8.95-4.71.32.93.52,3.73.07,5,4.48,8.45,6,5,6.64,7.39c.45,1.67-.85-1.4-5.56-3.75-4.46-2.23-6.91-.45-9.38,1.76s-5.24.9-1.88,3,6.21,4.4,12.41,3.73c5.46-.59,4.44-3.17,5.63.39a21.92,21.92,0,0,0,2.51,5.67C22.36,164.91,23.44,164.07,22.11,162Z" fill="#60ad8e"/><path id="_路径_315" data-name="&lt;路径&gt;" d="M35.36,96.68c-.21-4.27,1.22-6.1,4.08-5.69s8,.19,9.47-4.16-.15-6.33.95-8.27-1.82,1.12-5.29,1.8a7.89,7.89,0,0,0-6.25,5.42c-.52,2.21-.86,1.54,0-2.14s3.58-6.38,3-10.1-4.4-7.45-5.39-8.55-.18,1-1.42,3.49-2.44,4.35-.36,9.55,2.7,7.29,2.05,9.72c-.45,1.67,0-1.63-2.94-6-2.75-4.16-5.76-3.84-9-3.16s-5-1.84-3.12,1.64,3.17,6.91,8.88,9.43c5,2.21,5.43-.53,4.68,3.15A21.91,21.91,0,0,0,34,99C34.12,99.32,35.48,99.12,35.36,96.68Z" fill="#60ad8e"/><g id="_编组_22" data-name="&lt;编组&gt;"><path id="_路径_316" data-name="&lt;路径&gt;" d="M138.56,21.32c-7.39,3.8-9.08,8-5.61,12.36s8.07,13.23,2.2,19.93-10.78,5.89-13,9.61.12-4.14-2.11-10.63-.15-12.74,3.05-15.75,1.75-2.94-3.59,2.08-7.27,12.2-14.1,14.81-16.8-.15-19.6-.76,1.45-1.25,4.49-5.76,4.95-8.3,15.73-9.86,14.88-2.53,18.34-6c2.38-2.37-2.78,1.52-13,.92-9.66-.57-12-5.94-14-12s-7.92-6.58-.27-6.83,14.7-1.38,24.48,5.76c8.6,6.28,4.37,9.63,9.83,4.79s9-6.93,9.72-7.11S142.78,19.15,138.56,21.32Z" fill="#60ad8e"/><path id="_路径_317" data-name="&lt;路径&gt;" d="M153.28,21.28c7.39,3.8,9.08,8,5.61,12.36s-8.07,13.23-2.2,19.93,10.78,5.89,13,9.61-.12-4.14,2.11-10.63.15-12.74-3.05-15.75-1.75-2.94,3.59,2.08,7.27,12.2,14.1,14.81,16.8-.15,19.6-.76-1.45-1.25-4.49-5.76-4.95-8.3-15.73-9.86-14.88-2.53-18.34-6c-2.38-2.37,2.78,1.52,13,.92,9.66-.57,12-5.94,14-12s7.92-6.58.27-6.83S180.07,12,170.3,19.13c-8.6,6.28-4.37,9.63-9.83,4.79s-9-6.93-9.72-7.11S149.06,19.1,153.28,21.28Z" fill="#60ad8e"/><g id="_编组_23" data-name="&lt;编组&gt;"><path id="_路径_318" data-name="&lt;路径&gt;" d="M144.42,25.94c-1.13,14.43-5.72,19.59-10.82,17.59s-5.19-10.21-.19-14.44,7.19-6.13,3.4-4-10.1,4.7-15.16.36.3-11,6.56-9.29,10.53,3.3,9,2.37S129,15.2,128.93,8.83s7.27-7,10-2.46,3.75,10.12,4.6,9.11S141.6,9.85,147,3.54s12.85-.76,9.69,5.93-10.24,10.73-5.32,8.45,10.74-1.9,12.3,3.26S159.46,28,153.6,26.62s-3.53-.2,1.23,2.81,6.61,10.37,1.15,13-10.76-1.61-10.81-7.76S144.57,24,144.42,25.94Z" fill="#f7c2d8"/><path id="_路径_319" data-name="&lt;路径&gt;" d="M143.09,26.21c-4.8,12.75-10.31,16.23-14.4,13.07s-2-10.59,3.62-13.11,8.11-3.66,4.12-2.72-10.37,1.61-13.81-3.64,3.16-9.89,8.38-6.68,8.66,5.74,7.47,4.49S132,12.46,133.57,6.68s8.41-4.41,9.7.4S144,17.21,145,16.52s-.28-5.6,6.27-9.89,11.82,2.68,7.21,7.9-12.07,7-7,6.25,10.22,1.09,10.27,6.17-5.59,5-10.54,2.28-3.14-1.11.37,2.86,3.25,11.11-2.38,12.07-9.31-4.27-7.74-9.85S143.74,24.49,143.09,26.21Z" fill="#dc2f5d"/><path id="_路径_320" data-name="&lt;路径&gt;" d="M145.19,25c2.46,13.4-.47,19.21-5.59,18.62s-7.19-8-3.66-13.1S141,23.16,138.07,26s-8.05,6.71-13.71,4S122,19.9,128.09,20s10.38.46,8.72,0-8.25-1.06-9.85-6.85,4.93-8.11,8.52-4.65,5.86,8.31,6.39,7.18-3.13-4.65.27-11.7S153.65.15,152.38,7s-6.72,12.23-2.8,9,9.32-4.32,12,0-2.2,7.18-7.85,7.38-3.26.66,1.8,2.26,8.52,7.85,4.19,11.57S149.52,38.31,148,32.73,144.86,23.14,145.19,25Z" fill="#ff9ebb"/><path id="_路径_321" data-name="&lt;路径&gt;" d="M139.53,23.41a2.83,2.83,0,0,0,1.75-.25,4.9,4.9,0,0,0,.32,3.19c.72,1.9,1.77,0,2.52-.87a2.82,2.82,0,0,0,.66-1.63,4.93,4.93,0,0,0,2.92,1.31c2,.33.91-1.52.51-2.61a2.82,2.82,0,0,0-1.08-1.39,4.93,4.93,0,0,0,2.6-1.87c1.29-1.57-.86-1.55-2-1.74a2.82,2.82,0,0,0-1.75.25,4.9,4.9,0,0,0-.32-3.19c-.72-1.9-1.77,0-2.52.87a2.82,2.82,0,0,0-.66,1.63,4.93,4.93,0,0,0-2.92-1.31c-2-.33-.91,1.52-.51,2.61a2.82,2.82,0,0,0,1.08,1.39,4.93,4.93,0,0,0-2.6,1.87C136.23,23.23,138.37,23.21,139.53,23.41Z" fill="#be1b42"/><circle id="_路径_322" data-name="&lt;路径&gt;" cx="143.62" cy="20.47" r="1.33" fill="#ede0e7"/></g></g></g>'
                },
            },
            loadTimes:0,
            boxSize:"",
            type:this.component.clipStyle&&this.component.clipStyle.clipType?this.component.clipStyle.clipType:'rect',
        }
    },
    ready:function(){
        if(this.component.clipStyle && this.component.filterStyle){
            var com=document.getElementById('presvg'+this.component.unique);
            if(com){
                var clip=this.component.clipStyle,style=this.component.compStyle,type=this.type,
                    width=parseFloat(style.width),height=parseFloat(style.height);
                if(type=='rect'){
                    com.setAttribute("viewBox",'0 0 '+width+' '+height);
                }else{
                    com.setAttribute("viewBox",'0 0 '+this.clipInfo[type].width+' '+this.clipInfo[type].height);
                }
            }
        }
    },
    computed:{
        compStyle:function(){
            return {
                "-webkit-filter":this.component.filterStyle.filter,
                "transform":"scale("+this.component.compStyle.turn+","+(this.component.compStyle.turnY?this.component.compStyle.turnY:1)+")",
            }
        },
        svgSize: function () {
            var style=this.component.compStyle,clip=this.component.clipStyle;
            if(clip.w && clip.h){
                return {
                    width:'100%',
                    height:'100%',
                }
            }else{
                return {
                    position:'absolute',
                    top:0,
                    left:0,
                    width:style.width,
                    height:style.height,
                }
            }
        },
        sizeInfo: function () {
            var clip=this.component.clipStyle,type=clip.clipType;
            if(!type || type =='rect'){
                var oWidth,oHeight;
                if(this.component.clipStyle && this.component.clipStyle.clipType!=''){
                    oWidth=parseFloat(this.component.compStyle.width)/(this.component.clipStyle.w?this.component.clipStyle.w:1);
                    oHeight=parseFloat(this.component.compStyle.height)/(this.component.clipStyle.h?this.component.clipStyle.h:1);
                }else{
                    oWidth=parseFloat(this.component.compStyle.width);
                    oHeight=parseFloat(this.component.compStyle.height);
                }
                return {
                    imgW:oWidth,
                    imgH:oHeight,
                    imgX:-oWidth*clip.x,
                    imgY:-oHeight*clip.y,
                }
            }else{
                var w=clip.w?clip.w: 1,h=clip.h?clip.h:1;
                return {
                    imgW:this.clipInfo[type].width/w,
                    imgH:this.clipInfo[type].height/h,
                    imgX:-clip.x*this.clipInfo[type].width/w,
                    imgY:-clip.y*this.clipInfo[type].height/h,
                }
            }
        },
    },
    methods:{
        loadSuccess: function () {
            vm.loadResource(this.pageData.pageNo,this.component.unique);
        },
        loadError: function () {
            var $this=this;
            setTimeout(function () {
                if($this.loadTimes<3){
                    $this.$el.parentElement.children[1].setAttribute('src',$this.$el.parentElement.children[1].getAttribute('src'));
                    $this.loadTimes++;
                }else{
                    $this.loadSuccess();
                }
            },2000);
        },
    },
});

Vue.component('shapeComp', {
    props: ['component'],
    template: '<div :style="compStyle" class="shapeComponent"><img :src="svgCode"></div>',
    computed:{
        svgCode:function(){
            var svgStr=decodeURIComponent(this.component.shapesvg);
            svgStr = svgStr.replace(/#/g, '%23') // 安卓手机兼容问题
            return 'data:image/svg+xml;charset=utf-8,'+svgStr;
        },
        compStyle:function(){
            return{
                "opacity":this.component.compStyle.opacity,
                "fill":this.component.compStyle.fill,
                "transform":"scale("+this.component.compStyle.turn+","+(this.component.compStyle.turnY?this.component.compStyle.turnY:1)+")",
            }
        }
    }
});

Vue.component('audioComp', {
    props: ['component','isLoadResource','pageData'],
    template: '<audio :num="pageData.pageNo" :preload="isLoadResource && '+clientType.IS_PC+'?auto:none" :id="component.unique" :src="\''+userResource+'\'+component.audioLzkSrc" @error="loadError" @ended="endPlay" muted="true"></audio>',
    data: function () {
        return {
            loadTimes:0,
            isCount:false,
            timer:null,
        }
    },
    ready: function () {
        var chromeV = this.getChromeVersion()
        var $this=this;
        var audio=$this.$el;
        try{
            $this.timer=setInterval(function () {
                if(!clientType.IS_ZN){
                    if ( audio && audio.buffered !== null && audio.buffered.length ) {
                        var duration = audio.duration === Infinity ? null : audio.duration;
                        var load_percent = ((audio.buffered.end(audio.buffered.length - 1) / duration) * 100).toFixed(4);
                        if (isNaN(load_percent)) {
                            load_percent = 0;
                        }
                        if (load_percent >= 100 || chromeV >= 70) { // 当goole浏览器的版本大于70时候，直接进入下一步，处理高版本浏览器卡顿的bug
                            clearInterval($this.timer);
                            $this.timer=null;
                            $this.loadSuccess();
                        }
                    }
                    if($this.isLoadResource && !$this.isCount){//当前页开始加载的话，开启超时计时。
                        $this.timeCount();
                    }
                }else if(clientType.IS_ZN && clientType.ZN_VERSION>=352){
                    if(vm && $this.isLoadResource){
                        var url=userResource?audio.getAttribute('src'):(window.location.href.substring(0,window.location.href.lastIndexOf("/")+1)+audio.getAttribute('src'));
                        App.call('loadResource','{"id":"'+$this.pageData.pageNo+'&lzk&'+$this.component.unique+'","url":"'+url+'"}','loadSuccess');
                        clearInterval($this.timer);
                        $this.timer=null;
                        $this.timeCount();
                    }
                }else{
                    clearInterval($this.timer);
                    $this.timer=null;
                }
            },500);
        }catch(e){
            $this.loadSuccess();
        }
    },
    methods:{
        timeCount: function () {
            var $this=this;
            $this.isCount=true;
            var myTimer=setTimeout(function(){//20s超时处理
                $this.loadSuccess($this.pageData.pageNo,$this.component.unique);
                clearTimeout(myTimer);
                myTimer=null;
            },20*1000);
        },
        loadSuccess: function () {
            vm.loadResource(this.pageData.pageNo,this.component.unique);
        },
        loadError: function () {
            if(this.loadTimes<3 && !clientType.IS_ZN){
                this.$el.currentTime = 1;
                this.loadTimes++;
            }else{
                this.loadSuccess();
            }
        },
        endPlay:function(){
            vm.playBgMusic();
        },
        getChromeVersion: function() {
            var arr = navigator.userAgent.split(' '); 
            var chromeVersion = '';
            for(var i=0;i < arr.length;i++){
                if(/chrome/i.test(arr[i]))
                chromeVersion = arr[i]
            }
            if(chromeVersion){
                return Number(chromeVersion.split('/')[1].split('.')[0]);
            } else {
                return false;
            }
        }
    },
});

Vue.component('videoComp', {
    props: ['component','pageImageStyle','pageData','isLoadResource'],
    template: '\
    <a v-if="'+(clientType.IS_ZN_All && clientType.ZN_VERSION<=343)+'" :href="\''+userResource+'\'+component.videoLzkSrc" target="_parent"  >\
        <div class="videoBgColor znVideoBg pageTheme" :style="pageImageStyle" >\
            <div class="videoBackgroundBtn" :style={"backgroundImage":"url("+\''+userResource+'\'+component.backgroundLzkSrc+")"}></div>\
        </div>\
    </a>\
    <div v-if="'+(clientType.IS_ZN_All && clientType.ZN_VERSION>343)+'" class="videoBgColor znVideoBg pageTheme" :style="pageImageStyle" clicktype="touch" @click="playVideo(component)" >\
        <div class="videoBackgroundBtn" :style={"backgroundImage":"url("+\''+userResource+'\'+component.backgroundLzkSrc+")"}></div>\
    </div>\
    <video v-if="'+!clientType.IS_ZN_All+'" :id="component.unique" class="videoBgColor pageTheme" :style="pageImageStyle" :src="\''+userResource+'\'+component.videoLzkSrc" controls="controls" :num="pageData.pageNo" webkit-playsinline="true" playsinline="true" @ended="endPlay" controlslist="nodownload" @contextmenu.prevent="oncontextmenu"></video>',
    methods:{
        playVideo: function (video) {
            vm.playVideo(video);
        },
        endPlay: function () {
            vm.afterPage();
        },
        oncontextmenu: function(){
            return false;
        }
    }
});

Vue.component('testComp', {
    template: '\
    <div class="pageTheme" :show="isShow" style="overflow:hidden;background-color:#fff" :style="pageImageStyle">\
        <div v-show="!myRank && showTips" class="rankTips centerBox" :style="pageImageStyle">\
            <div class="tipsBox">\
                <div class="rankColor1 tip">提示</div>\
                <div class="rankColor2 tipText">只有第一次答题的成绩才将进入排行榜，正确率越高完成时间越快，排名将越高。是否确认开始答题？</div>\
                <div class="startTest" clicktype="touch" @click="startTest">开始答题</div>\
                <div class="rankColor1 return" clicktype="touch" @click="showTips=false">返回学习</div>\
            </div>\
        </div>\
        <div :id="component.unique" class="test">\
            <div v-show="testStatus==\'before\'" class="width100 height100">\
                <div v-if="isRank" class="rankBox" :audio-contr="audioContr" >\
                    <div v-if="courseWare.showType==1" class="width100 height100">\
                        <div class="rankTitle">{{component.setting.subject}}</div>\
                        <div :class="[\'centerBox\',rankList.length>0?\'\':\'noRank\']" :style={height:testHeight-50+"px",width:"100%"}>\
                            <div v-if="rankList.length>0" class="hLeft">\
                                <div class="rankFirst">\
                                    <div class="userPhoto" :style={backgroundImage:"url("+rankList[0].userPhoto+")"}>\
                                        <div class="rankCrown"></div>\
                                    </div>\
                                    <div class="rankColor1 userName">{{rankList[0].userName}}</div>\
                                    <div class="rankColor1 usedTime">{{formatTime(rankList[0].usedTime)}}</div>\
                                </div>\
                                <div class="startTest" clicktype="touch" @click="startTest">开始答题</div>\
                            </div>\
                            <div class="hRight">\
                                <div class="rankColor1 rankText">排行榜</div>\
                                <div class="rankLine"></div>\
                                <div class="rankList" :style={height:(rankList.length==0?testHeight-150:testHeight-100)+"px",backgroundImage:rankList.length==0?"url('+publicResource+'resource/noRank.png)":"none",overflowY:rankList.length==0?"hidden":"auto"}>\
                                    <div v-for="item in rankList" class="listItem centerBox">\
                                        <div v-if="item.rank<=3" :class="\'rank\'+item.rank" class="rankNum"></div>\
                                        <div v-else class="rankNum rankColor2">{{item.rank}}</div>\
                                        <div class="rankPhoto" :style={backgroundImage:"url("+item.userPhoto+")"}></div>\
                                        <div class="rankName rankColor2">{{item.userName}}</div>\
                                        <div class="rankScore rankColor3">{{item.score+"%"}}</div>\
                                        <div class="rankTime rankColor1">{{formatTime(item.usedTime)}}</div>\
                                    </div>\
                                    <span v-show="rankList.length==0" :style={lineHeight:(rankList.length==0?testHeight-150:testHeight-100)+"px"} class="rankColor1">暂无数据</span>\
                                </div>\
                                <div v-show="rankList.length==0" class="startTest" clicktype="touch" @click="startTest">开始答题</div>\
                            </div>\
                        </div>\
                    </div>\
                    <div v-else class="width100 height100">\
                        <div style="height:90%;width:100%;overflow:auto;">\
                            <div class="rankTitle">{{component.setting.subject}}</div>\
                            <div class="rankFirstBox">\
                                <div v-if="rankList.length>0" class="rankFirst">\
                                    <div class="userPhoto" :style={backgroundImage:"url("+rankList[0].userPhoto+")"}>\
                                        <div class="rankCrown"></div>\
                                    </div>\
                                    <div class="rankColor1 userName">{{rankList[0].userName}}</div>\
                                    <div class="rankColor1 usedTime">{{formatTime(rankList[0].usedTime)}}</div>\
                                </div>\
                            </div>\
                            <div class="rankColor1 rankText">排行榜</div>\
                            <div class="rankLine"></div>\
                            <div class="rankList" :style={backgroundImage:rankList.length==0?"url('+publicResource+'resource/noRank.png)":"none"}>\
                                <div v-for="item in rankList" class="listItem centerBox">\
                                    <div v-if="item.rank<=3" :class="\'rank\'+item.rank" class="rankNum"></div>\
                                    <div v-else class="rankNum rankColor2">{{item.rank}}</div>\
                                    <div class="rankPhoto" :style={backgroundImage:"url("+item.userPhoto+")"}></div>\
                                    <div class="rankName rankColor2">{{item.userName}}</div>\
                                    <div class="rankScore rankColor3">{{item.score+"%"}}</div>\
                                    <div class="rankTime rankColor1">{{formatTime(item.usedTime)}}</div>\
                                </div>\
                                <span v-show="rankList.length==0" :style={lineHeight:testHeight-320+"px"} class="rankColor1">暂无数据</span>\
                            </div>\
                        </div>\
                        <div style="width:100%;height:10%;">\
                            <div class="startTest" clicktype="touch" @click="startTest">开始答题</div>\
                        </div>\
                    </div>\
                </div>\
                <div v-else class="test_ques">\
                    <div v-if="courseWare.showType==2" class="test_top" style="text-align:center;">\
                        <p class="test-title">{{component.setting.subject}}</p>\
                        <div class="test-cover"></div>\
                        <div class="question-count">\
                            <span class="test-dot"></span><span>总数</span><span class="quest-count-digit">{{component.list.length}}</span><span>题</span>\
                        </div>\
                    </div>\
                    <div v-else class="test_top">\
                        <div class="test-cover test-cover-left"></div>\
                        <div class="test-cover-right">\
                            <p class="test-title">{{component.setting.subject}}</p>\
                            <div class="question-count">\
                                <span class="test-dot"></span><span>总数</span><span class="quest-count-digit">{{component.list.length}}</span><span>题</span>\
                            </div>\
                        </div>\
                    </div>\
                    <div class="test_bottom">\
                        <div class="test_btn" clicktype="touch" @click="startTest">开始答题</div>\
                    </div>\
                </div>\
            </div>\
            <div v-show="testStatus==\'start\'"  class="test_ques">\
                <div id="test_{{component.unique}}" class="test_top">\
                    <div v-show="$index==component.activeIndex-1" v-for="question in component.list">\
                        <strong>{{$index+1}}</strong>. {{{question.title}}}\
                        <ul class="ques_ul">\
                            <li v-for="option in question.choice" :class="questionStyle(question,option,component.setting.showAnswer)" clicktype="touch" @click="clickOption(question,option)">\
                                {{option.id}}. {{{option.value}}}\
                                <div v-if="component.setting.showAnswer&&question.commited" class="option-tail">\
                                    <div v-if="option.checked" class="test-icon icon_right"></div>\
                                    <div v-if="!option.checked&&option.userChoose" class="test-icon icon_wrong"></div>\
                                </div>\
                            </li>\
                        </ul>\
                    </div>\
                </div>\
                <div v-show="!currentQuestion.commited" class="test_bottom">\
                    <div v-show="isChooseAnswer" class="test_btn" clicktype="touch" @click="submitCurrentQuestion(currentQuestion)">提交</div>\
                    <div v-else class="test_btn disable_btn">提交</div>\
                </div>\
                <div class="test_bottom" v-show="component.setting.showAnswer&&currentQuestion.commited">\
                    <div class="test_btn" clicktype="touch" @click="nextQuestion">继续</div>\
                </div>\
            </div>\
            <div v-show="testStatus==\'end\'" class="width100 height100">\
                <div v-if="isRank" class="rankBox">\
                    <div v-if="courseWare.showType==1">\
                        <div class="rankTitle">{{component.setting.subject}}</div>\
                        <div class="centerBox" :style={height:testHeight-50+"px"}>\
                            <div class="hLeft">\
                                <div class="passTips" :class=isPass?"test-pass":"test-not-pass"></div>\
                                <div class="btnBox">\
                                    <div :class=isPass&&!isLastPage?"passBtn":""><div class="startTest" clicktype="touch" @click="resubmitTest">重新答题</div></div>\
                                    <div v-show="isPass&&!isLastPage" class="passBtn"><div class="continue" clicktype="touch" @click="completeTest">继续学习</div></div>\
                                </div>\
                            </div>\
                            <div class="hRight" style="border-left: 1px solid #D4D1D1;">\
                                <div class="myRank centerBox">\
                                    <div v-if="myRank<=3" :class="\'rank\'+myRank" class="rankNum"></div>\
                                    <div v-else class="rankNum">{{myRank}}</div>\
                                    <div class="rankPhoto" :style={backgroundImage:"url("+userInfo.userPhoto+")"}></div>\
                                    <div class="rankName">{{userInfo.userName}}</div>\
                                    <div class="rankScore">{{myScore+"%"}}</div>\
                                    <div class="rankTime">{{formatTime(myUsedTime)}}</div>\
                                </div>\
                                <div class="currentRank centerBox">\
                                    <div class="currentText rankColor2">本次答题</div>\
                                    <div class="rankName rankColor2">{{userInfo.userName}}</div>\
                                    <div class="rankScore rankColor3">{{currentScore+"%"}}</div>\
                                    <div class="rankTime rankColor1">{{formatTime(currentUsedTime)}}</div>\
                                </div>\
                                <div class="rankColor1 rankText">排行榜</div>\
                                <div class="rankLine"></div>\
                                <div class="rankList" :style={height:testHeight-175+"px",backgroundImage:rankList.length==0?"url('+publicResource+'resource/noRank.png)":"none",overflowY:rankList.length==0?"hidden":"auto"}>\
                                    <div v-for="item in rankList" class="listItem centerBox">\
                                        <div v-if="item.rank<=3" :class="\'rank\'+item.rank" class="rankNum"></div>\
                                        <div v-else class="rankNum rankColor2">{{item.rank}}</div>\
                                        <div class="rankPhoto" :style={backgroundImage:"url("+item.userPhoto+")"}></div>\
                                        <div class="rankName rankColor2">{{item.userName}}</div>\
                                        <div class="rankScore rankColor3">{{item.score+"%"}}</div>\
                                        <div class="rankTime rankColor1">{{formatTime(item.usedTime)}}</div>\
                                    </div>\
                                </div>\
                            </div>\
                        </div>\
                    </div>\
                    <div v-else class="width100 height100">\
                        <div style="width:100%;height:90%;overflow:auto;">\
                            <div class="rankTitle">{{component.setting.subject}}</div>\
                            <div class="passTips" :class=isPass?"test-pass":"test-not-pass"></div>\
                            <div class="myRank centerBox">\
                                <div v-if="myRank<=3" :class="\'rank\'+myRank" class="rankNum"></div>\
                                <div v-else class="rankNum">{{myRank}}</div>\
                                <div class="rankPhoto" :style={backgroundImage:"url("+userInfo.userPhoto+")"}></div>\
                                <div class="rankName">{{userInfo.userName}}</div>\
                                <div class="rankScore">{{myScore+"%"}}</div>\
                                <div class="rankTime">{{formatTime(myUsedTime)}}</div>\
                            </div>\
                            <div class="currentRank centerBox">\
                                <div class="currentText rankColor2">本次答题</div>\
                                <div class="rankName rankColor2">{{userInfo.userName}}</div>\
                                <div class="rankScore rankColor3">{{currentScore+"%"}}</div>\
                                <div class="rankTime rankColor1">{{formatTime(currentUsedTime)}}</div>\
                            </div>\
                            <div class="rankColor1 rankText">排行榜</div>\
                            <div class="rankLine"></div>\
                            <div class="rankList" :style={backgroundImage:rankList.length==0?"url('+publicResource+'resource/noRank.png)":"none"}>\
                                <div v-for="item in rankList" class="listItem centerBox">\
                                    <div v-if="item.rank<=3" :class="\'rank\'+item.rank" class="rankNum"></div>\
                                    <div v-else class="rankNum rankColor2">{{item.rank}}</div>\
                                    <div class="rankPhoto" :style={backgroundImage:"url("+item.userPhoto+")"}></div>\
                                    <div class="rankName rankColor2">{{item.userName}}</div>\
                                    <div class="rankScore rankColor3">{{item.score+"%"}}</div>\
                                    <div class="rankTime rankColor1">{{formatTime(item.usedTime)}}</div>\
                                </div>\
                            </div>\
                        </div>\
                        <div style="height:10%;width:100%">\
                            <div class="btnBox">\
                                <div :class=isPass&&!isLastPage?"passBtn":""><div class="startTest" clicktype="touch" @click="resubmitTest">重新答题</div></div>\
                                <div v-show="isPass&&!isLastPage" class="passBtn"><div class="continue" clicktype="touch" @click="completeTest">继续学习</div></div>\
                            </div>\
                        </div>\
                    </div>\
                </div>\
                <div v-else class="test_ques">\
                    <div class="test_top">\
                        <div class="test-complete test-complete-left" :class=isPass?"test-pass":"test-not-pass"></div>\
                        <div class="test-complete-right">\
                            <div class="question-count">\
                                <span class="test-dot"></span><span>总数</span><span class="quest-count-digit">{{component.list.length}}</span><span>题</span>\
                            </div>\
                            <div class="question-count">\
                                <span class="test-dot"></span><span>答对</span><span class="quest-count-digit">{{trueNum}}</span><span>题</span>\
                            </div>\
                            <div class="question-count">我的正确率：{{Math.round(correctRate*10000)/100}}%</div>\
                            <div class="test-progress-box">\
                                <svg xmlns="http://www.w3.org/2000/svg">\
                                    <text class="test-progress-text" x="37px" y="44px" text-anchor="middle" transform="rotate(0 37,37)"><!--{{trueNum}}/{{component.list.length}}--></text>\
                                    <circle class="test-progress-back" r="35px" cy="37px" cx="37px"></circle>\
                                    <circle class="test-progress" :id="\'test-progress-\'+component.unique" stroke-dashoffset="201px" r="35px" cy="37px" cx="37px"></circle>\
                                </svg>\
                            </div>\
                            <div v-show="isPass" class="answer_again" clicktype="touch" @click="resubmitTest">再答一次</div>\
                        </div>\
                    </div>\
                    <div class="test_bottom">\
                        <div v-show="isPass&&!isLastPage" class="test_btn" clicktype="touch" @click="completeTest">继续学</div>\
                        <div v-show="!isPass" class="test_btn" clicktype="touch" @click="resubmitTest">再答一次</div>\
                    </div>\
                </div>\
            </div>\
        </div>\
    </div>',
    props: ['component','courseWare','pageImageStyle','pageNo','sendPostAjax','userInfo','clientHeight','isPreview','isCurrentPage'],
    data:function(){
        return {
            submited:false,//是否提交了测试题
            list:[],//原始题库信息
            trueNum:0,//答对的题目数量
            isPass:false,//是否通过测试题,单次有效,用作再答一次
            showTips:false,//显示提示信息
            testStatus:'before',//测试题显示状态(排行榜，封面，答题，答题结束)
            isRank:false,//是否有排行榜
            beginTime:null,//答题开始时间
            rankList:[],
            myRank:null,//我的排名
            myScore:0,
            myUsedTime:0,
            isQuery:false,//是否查过排名了
            currentScore:0,
            currentUsedTime:0,
            standardHeight : 342
        }
    },
    computed:{
        isShow:function(){
            var $this=this;
            //设置排行榜
            if(this.component.setting.isRank){
                this.isRank=true;
                if(this.userInfo.userId!='' && !this.isQuery && !this.isPreview){
                    this.sendPostAjax({
                        url:serverUrl+'/app/queryGameRank.do',
                        data:{
                            courseId:$this.courseWare.courseId,
                            testId:$this.component.unique,
                            userId:$this.userInfo.userId,
                            corporationId:$this.userInfo.companyId,
                        },
                        success: function (msg) {
                            var result=eval('('+msg+')');
                            $this.isQuery=true;
                            if (result.code == 0) { //code为0表示查询数据成功
                                var num=null;
                                for (var i = 0; i < result.rank.length; i++) { //循环排行榜数据
                                    var item = result.rank[i];
                                    if (item.rank.match(/^s_/)) { //已有成绩
                                        num=i;
                                        $this.myRank=item.rank.split('_')[1];
                                        $this.myScore=item.score;
                                        $this.myUsedTime=item.usedTime;
                                        break;
                                    }
                                }
                                if(num){
                                    result.rank.splice(num,1);
                                }
                                $this.rankList=result.rank;
                            }
                        }
                    });
                }
            }
            return this.userInfo.userId;
        },
        isAnswerTrue: function () {
            var options=this.component.list[this.component.activeIndex-1].choice;
            for(var i in options){
                if(options[i].checked!=options[i].userChoose){
                    return false;
                }
            }
            return true;
        },
        correctRate: function(){ //正确率
            var rate = this.trueNum/this.component.list.length;
            return  rate > 1 ? 1 : rate
        },
        testCompleteLeftStyle: function(){
            return {
                'test-pass':isPass,
                'test-not-pass':!isPass,
            };
        },
        isLastPage: function(){//是否为最后一页
            return  this.pageNo+1 == this.courseWare.pageList.length;
        },
        currentQuestion: function(){
            return this.component.list[this.component.activeIndex-1];
        },
        isChooseAnswer: function() {
            var options=this.component.list[this.component.activeIndex-1].choice;
            for(var i in options){
                if(options[i].userChoose){
                    return true;
                }
            }
            return false;
        },
        audioContr:function(){
            var startAudio=document.getElementById('testStart');
            var endAudio=document.getElementById('testEnd');
            var startUrl=startAudio.getAttribute("src");
            var endUrl=endAudio.getAttribute("src");
            startUrl=userResource?startUrl:(window.location.href.substring(0,window.location.href.lastIndexOf("/")+1)+startUrl);
            endUrl=userResource?endUrl:(window.location.href.substring(0,window.location.href.lastIndexOf("/")+1)+endUrl);

            try{
                if(this.isCurrentPage && this.testStatus=='start'){
                    if(clientType.IS_ZN){
                        var url=document.getElementById('testStart').getAttribute("src");
                        url=userResource?url:(window.location.href.substring(0,window.location.href.lastIndexOf("/")+1)+url);
                        App.call('stopAudio', endUrl);
                        if(clientType.ZN_VERSION>=382){
                            App.call('startAudio', '{"url":"'+startUrl+'","loop":"true","type":"start"}','');
                        }else{
                            App.call('playAudio', startUrl, '');
                        }
                    }else{
                        startAudio.currentTime=0;
                        startAudio.play();
                    }
                }else if(this.isCurrentPage && this.testStatus=='end'){
                    if(clientType.IS_ZN){
                        App.call('stopAudio', startUrl);
                        if(clientType.ZN_VERSION>=382){
                            App.call('startAudio', '{"url":"'+endUrl+'","loop":"false","type":"start"}','');
                        }else{
                            App.call('playAudio', endUrl, '');
                        }
                    }else{
                        startAudio.pause();
                        endAudio.currentTime=0;
                        endAudio.play();
                    }
                }else if(!this.isCurrentPage){
                    if(clientType.IS_ZN){
                        App.call('stopAudio', startUrl);
                        App.call('stopAudio', endUrl);
                    }else{
                        document.getElementById('testStart').pause();
                        document.getElementById('testEnd').pause();
                    }
                }
            }catch (e){}
            return this.isCurrentPage+this.testStatus;
        },
        //测试题分数
        testScore:function(){
            var score = parseInt(this.trueNum / this.component.list.length * 100);
            return score > 100 ? 100 : score;
        },
		testHeight: function(){
			if(this.courseWare.showType === '1'){
				return this.clientHeight > this.standardHeight ? this.standardHeight : this.clientHeight
			}
            return this.clientHeight
        }
    },
    methods:{
        formatTime: function (time) {
            var secend=Math.round(time/1000);
            var m=(Array(3).join('0')+Math.floor(secend/60)).slice(-2);
            var s=(Array(3).join('0')+secend%60).slice(-2);
            return m+"分"+s+"秒";
        },
        getFormatDate: function (date) {
            date = new Date(date);
            var y=date.getFullYear();
            var m=date.getMonth()+1;
            var d=date.getDate();
            var h=date.getHours();
            var m1=date.getMinutes();
            var s=date.getSeconds();
            m = m<10?("0"+m):m;
            d = d<10?("0"+d):d;
            return y+"-"+m+"-"+d+" "+h+":"+m1+":"+s;
        },
        questionStyle: function(question, option, showAnswer){
            return {
                "multi-unselected":question.multiple,
                "multi-selected":question.multiple&&option.userChoose,
                "unselected":!question.multiple,
                "selected":!question.multiple&&option.userChoose,
                "answer_right":showAnswer&&question.commited&&option.checked,
                "answer_wrong":showAnswer&&question.commited&&option.userChoose&&!option.checked
            };
        },
        submitCurrentQuestion: function(question){ //提交当前题目
            question.commited = true;
            if(this.component.activeIndex==this.component.list.length){
                this.submitTest();
            }
            if(!this.component.setting.showAnswer){ //如果不显示答案，提交时跳到下一题
                this.nextQuestion();
            }
        },
        resubmitTest: function () {//再答一次
            this.component.list=this.deepCopy(this.list);
            this.sortQuestion();
            this.isPass=false;
            this.trueNum=0;
            this.submited=false;
            this.component.activeIndex=1;
            this.testStatus='start';
            this.beginTime=new Date().getTime();
            if(!this.isRank){
                document.getElementById('test-progress-'+this.component.unique).setAttribute('stroke-dashoffset','220px');
            }
        },
        submitTest: function () {//提交测试题
            if (!this.submited){
                this.submited=true;
                var temp=0;
                //计算答对了几道题
                for(var i=0; i<this.component.list.length; i++){
                    var question=this.component.list[i];
                    temp++;
                    for(var j in question.choice){
                        if(question.choice[j].checked!=question.choice[j].userChoose){
                            temp--;
                            break;
                        }
                    }
                }
                //计算是否通过该测试题
                this.trueNum=temp;
                this.component.trueNum = this.trueNum; // 一点通新增 答对个数
                this.component.beginTime = this.beginTime; // 一点通新增 开始答题时间
                this.component.endTime = new Date().getTime();; // 一点通新增 考试结束时间
                if(this.correctRate*100>=this.component.setting.passPercent){
                    this.isPass=true;
                    this.component.isPass=true;
                }

                if(!this.isPreview){
                    this.saveTestScore();
                }
                //是否通过全部测试题
                var flag=true;
                for(var i=0;i<this.courseWare.pageList.length;i++){
                    if(this.courseWare.pageList[i].pageType=='test'){
                        if(!this.courseWare.pageList[i].componentList[0].isPass){
                            flag=false;
                            break;  
                        }
                    }
                }
                if(flag){
                   
                    vm.commitStatus();
                }
                // 前段开始记录日志
                try{
                    var content = ';设备信息：'+ JSON.stringify(clientType) + ';开始答题时间：' + this.getFormatDate(this.beginTime) + ';考试结束时间：' + this.getFormatDate(this.component.endTime) + ';是否为预览' + this.isPreview + ';是否通过全部测试题并且上报已学状态' + flag + ';答题的正确率' + this.correctRate + ';测试题设置的通过率' + this.component.setting.passPercent;
                    this.saveGameRecordLog(content)
                }catch (e){}
            }
        },
        lastQuestion: function () {//上一题
            if(this.component.activeIndex>1)
                this.component.activeIndex--;
        },
        nextQuestion: function () {//下一题
            if(this.component.activeIndex<this.component.list.length){
                this.component.activeIndex++;
            }else{
                var $this=this;
                this.testStatus = 'end';
	            var questionData = this.deepCopy($this.component);
                questionData.list.forEach(function(question,index){
                    question.index = index + 1;
					if(question.multiple){
					    var userChoice = ''
					    question.choice.forEach(function(choice){
							if(choice.userChoose){
								userChoice += choice.id
							}
						})
						question.userChoice = userChoice
					}else{
						question.choice.forEach(function(choice){
							if(choice.userChoose){
								question.userChoice = choice.id
							}
						})
					}
                });
                App.call('questionData', JSON.stringify(questionData)); // 新增E点通9月份需求
                if(this.isRank){
                    this.currentScore=Math.round(this.correctRate*10000)/100;
                    this.currentUsedTime=new Date().getTime()-this.beginTime;

                    //保存成绩，查询排名
                    if(this.userInfo.userId!='' && (this.myRank==null && this.isQuery) && !this.isPreview){
                        var param = {
                            courseId:$this.courseWare.courseId,
                            testId:$this.component.unique,
                            userId:$this.userInfo.userId,
                            userName:$this.userInfo.userName,
                            userPhoto:$this.userInfo.userPhoto||'0',
                            corporationId:$this.userInfo.companyId || '0',
                            score:$this.currentScore,
                            usedTime:$this.currentUsedTime,

                            appId : uncompileStr(constant.appId),
                            accessKey : uncompileStr(constant.accessKey),
                            version : uncompileStr(constant.version),
                            timestamp : Date.parse(new Date()),
                            nonceStr : randomString(16),
                        };

                        var signObj= objKeySort(param);
                        var signString = "";
                        var signObjKeys = [];
                        for(var j in signObj){
                            if(signObj.hasOwnProperty(j)){
                                signObjKeys.push(j);
                            }
                        }
                        for(i = 0; i < signObjKeys.length; i++){
                            signString+="&"+signObjKeys[i].toString()+"="+signObj[signObjKeys[i]];
                        }
                        signString = signString.substring(1);
                        param.sign = SHA2(signString); 
                        delete param["accessKey"];

                        this.sendPostAjax({
                            url:serverUrl+'/app/saveGameRecord.do',
                            data:param,
                            success: function (msg) {
                                var result=eval('('+msg+')');
                                if(result.code==0){
                                    //保存成功
                                    $this.myRank=result.rank.rank.split('_')[1];
                                    $this.myScore=$this.currentScore;
                                    $this.myUsedTime=$this.currentUsedTime;
                                }
                            }
                        });
                    }
                }else{
                    setTimeout(function () {
                        document.getElementById('test-progress-'+$this.component.unique).setAttribute('stroke-dashoffset',(1-$this.correctRate)*220+'px');//220是圆形进度条的圆周长
                    },100)
                }
            }
        },
        clickOption: function (question,option) {//点击选项
            if(!question.commited){
                if(question.multiple){//多选
                    option.userChoose=option.userChoose?false:true;
                }else{//单选
                    for(var i in question.choice){
                        question.choice[i].userChoose=false;
                    }
                    option.userChoose=true;
                }
            }
        },
        sortQuestion: function () {//对题目乱序(比用数组的sort效率高很多)
            if(!this.component.setting.orderShow)
                for(var j,x,i=this.component.list.length;i;j=parseInt(Math.random()*i),x=this.component.list[--i],this.component.list[i]=this.component.list[j],
                    this.component.list[j]=x);
        },
        deepCopy: function(o) {//拷贝对象(数组)
            if (Object.prototype.toString.call(o)=='[object Array]') {
                var n = [];
                for (var i = 0; i < o.length; ++i) {
                    n[i] = this.deepCopy(o[i]);
                }
                return n;
            } else if (Object.prototype.toString.call(o)=='[object Object]') {
                var n = {}
                for (var i in o) {
                    n[i] = this.deepCopy(o[i]);
                }
                return n;
            } else {
                return o;
            }
        },
        startTest: function(){
            if(this.isRank && !this.myRank && !this.showTips){
                this.showTips=true;
                return;
            }
            this.beginTime=new Date().getTime();
            this.testStatus='start';
            this.showTips=false;
        },
        completeTest: function(){
            vm.afterPage();
        },
        saveTestScore:function(){
            var $this=this;
            zn.saveScore({
                id: $this.component.unique,
                name: $this.component.setting.subject,
                score: $this.testScore,
                isPass: $this.isPass,
                courseId:$this.courseWare.courseId,
                success: function (res) {
                  console.log(res);
                },
                fail: function (e) {
                  console.log(e);
                }
            })
        },
        saveGameRecordLog: function(content){
            var code = zn && zn.zhiniaoInfo && zn.zhiniaoInfo.code || '0'
            var znToken = zn && zn.zhiniaoInfo &&  zn.zhiniaoInfo.token || '0'
            var tokenMsg = zn && zn.zhiniaoInfo &&  zn.zhiniaoInfo.tokenMsg || '0'

            var param = {
                courseId: this.courseWare.courseId,
                score: this.testScore,
                code: code,
                znToken: znToken,
                content: tokenMsg + content,
                userId: this.userInfo.userId || '0',

                appId : uncompileStr(constant.appId),
                accessKey : uncompileStr(constant.accessKey),
                version : uncompileStr(constant.version),
                timestamp : Date.parse(new Date()),
                nonceStr : randomString(16),
            };

            var signObj= objKeySort(param);
            var signString = "";
            var signObjKeys = [];
            for(var j in signObj){
                if(signObj.hasOwnProperty(j)){
                    signObjKeys.push(j);
                }
            }
            for(i = 0; i < signObjKeys.length; i++){
                signString+="&"+signObjKeys[i].toString()+"="+signObj[signObjKeys[i]];
            }
            signString = signString.substring(1);
            param.sign = SHA2(signString); 
            delete param["accessKey"];
            
            this.sendPostAjax({
                url:serverUrl+'/app/saveGameRecordLog.do',
                data:param,
                success: function (e) {
                    console.log(e)
                },
                fail: function (e) {
                    console.log(e)
                }
            });
        }
    },
    created: function () {
        var $this=this;
        this.component.activeIndex=1;
        this.component.list.forEach(function(q){
            q.commited = false; //新增属性：问题是否提交
        });
        this.list=this.deepCopy(this.component.list);
        //实现换行并且防xss攻击
        this.component.list=JSON.parse(JSON.stringify(this.component.list).replace(/</g,'&lt;').replace(/>/g,'&gt;')
            .replace(/\\r\\n/g,'<br>').replace(/\\r/g,'<br>').replace(/\\n/g,'<br>').replace(/ /g,'&nbsp;'));
        this.component.list = this.deepCopy(this.component.list); //新增属性Vue不会监听，重置问题列表
        this.sortQuestion();
    },
});

Vue.component('graphicComp', {
    props: ['component'],
    template: '<div class="graphicComponent"}>\
    <svg x="0" y="0" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0,0,280,354" xml:space="preserve" style="overflow:visible">\
      <text text-anchor="middle" :x="component.graphicInfo.viewBox.width/2" y="12" font-size="12">{{component.graphicInfo.title}}</text>\
      <g v-show="component.graphicInfo.showGird">\
        <path v-for="item in gridPath" :d="item" fill="none" stroke="#ededed" stroke-linecap="square" stroke-dasharray="2 2 2"></path>\
      </g>\
      <path fill="none" stroke="#979797" stroke-linecap="square" :d="\'M\'+initX+\',\'+(initY+yAxisLength)+\'V\'+initY"></path>\
      <path fill="none" stroke="#979797" stroke-linecap="square" :d="\'M\'+initX +\',\'+(initY+yAxisLength)+\'H\'+(initX+xAxisLength)"></path>\
      <text text-anchor="start" :x="initX" y="36" font-size="10">\
        <tspan dx="-20">{{component.graphicInfo.yAxisTitle}}</tspan>\
      </text>\
      <text font-size="10" text-anchor="end" :x="initX+xAxisLength" :y="yAxisLength+initY">\
        <tspan dy="15" dx="20">{{component.graphicInfo.xAxisTitle}}</tspan>\
      </text>\
      <g v-for="(index,item) in legendCfg" v-show="component.graphicInfo.showLegend">\
        <circle v-if="component.graphicInfo.type==\'line\'" :cy="item.rectY+7" :cx="item.rectX+7" r="7" :fill="dataList[index].color"></circle>\
        <rect v-if="component.graphicInfo.type==\'bar\'" :y="item.rectY" :x="item.rectX" width="14" height="14" :fill="dataList[index].color"></rect>\
        <text text-anchor="start" :y="item.rectY" :x="item.rectX" font-size="10" fill="#737477">\
          <tspan dx="17" dy="11">{{dataList[index].name}}</tspan>\
        </text>\
      </g>\
      <g v-for="(index,item) in yAxisNum">\
        <text text-anchor="end" :x="initX" :y="yAxisNumY[index]" font-size="9">\
          <tspan dy="4" dx="-4">{{item}}</tspan>\
        </text>\
      </g>\
      <g v-if="component.graphicInfo.type==\'bar\'">\
        <rect v-for="(index,item) in chartData" :y="item.y" :x="item.x" :width="item.w" :height="item.h" :fill="dataList[index].color"></rect>\
      </g>\
      <g v-if="component.graphicInfo.type==\'line\'">\
        <path v-for="path in linePath" :d="path" stroke="#979797" stroke-linecap="round" stroke-linejoin="round"></path>\
        <circle v-for="(index,item) in chartData" :fill="dataList[index].color" :cx="item.x" :cy="item.y" r="4"></circle>\
      </g>\
      <g v-for="(i,data) in chartData" v-show="component.graphicInfo.showDataInfo" :fill="dataList[i].color" font-size="9">\
        <text text-anchor="middle" :x="data.textX" :y="data.textY">{{dataList[i].num}}</text>\
        <text :y="data.textY" text-anchor="middle">\
          <tspan dy="12" :x="data.textX" dx="1">{{dataList[i].name.slice(0,4)}}</tspan>\
          <tspan dy="12" :x="data.textX">{{dataList[i].name.slice(4)}}</tspan>\
        </text>\
      </g>\
    </svg>\
  </div>',
    data:function(){
        return {
            yAxisLength: 230,
            xAxisLength: 230,
            yAxisNumY: [],
            maxNum: 0,
            linePath: [],
        }
    },
    ready:function(){
        this.$el.querySelector("svg").viewBox.baseVal.width = this.component.graphicInfo.viewBox.width;
        this.$el.querySelector("svg").viewBox.baseVal.height = this.component.graphicInfo.viewBox.height;
        this.loadSuccess();
    },
    computed: {
        dataList:function() {
            var list=[];
            for(var i=0;i<this.component.graphicInfo.dataList.length;i++){
                var item=this.component.graphicInfo.dataList[i];
                if(item.name && item.num!=''){
                    list.push(item);
                }
            }
            return list;
        },
        initX:function() {
            if (this.maxNum > 999) return 25 + (this.maxNum.toString().length - 3) * 6;
            return 25;
        },
        initY:function() {
            if (this.component.graphicInfo.showDataInfo) return 76;
            return 55;
        },
        gridPath:function() {
            var n = 5,
                h = this.yAxisLength / n,
                xs = this.initX,
                xe = xs + this.xAxisLength,
                list = [],
                d, y;
            for (var i = 0; i <= n; i++) {
                y = this.initY + h * (n - i);
                d = 'M' + xs + ',' + y + 'H' + xe;
                list.push(d);
                this.yAxisNumY.push(y);
            }
            return list;
        },
        yAxisNum:function() {
            var maxNum = 0;
            if (this.dataList.length > 0) {
                for(var i=0;i<this.dataList.length;i++){
                    if(this.dataList[i].num>maxNum)maxNum=this.dataList[i].num;
                }
                if (maxNum < 100) {
                    maxNum = maxNum % 10 == 0 ? maxNum : Math.ceil(maxNum / 10) * 10;
                } else {
                    maxNum = maxNum % 100 == 0 ? maxNum : Math.ceil(maxNum / 100) * 100;
                }
            }
            this.maxNum = maxNum;
            return maxNum ? [0, maxNum / 5, maxNum * 2 / 5, maxNum * 3 / 5, maxNum * 4 / 5, maxNum] : [];
        },
        chartData:function() {
            var list = [],
                info = this.component.graphicInfo,
                len = this.dataList.length,
                w, begin, end, d;
            w = info.type == "bar" ? this.xAxisLength / ((len - 1) / 3 + len + 2) : len == 1 ? this.xAxisLength - 20 : (this.xAxisLength - 20) / (len - 1);
            for(var i=0;i<this.dataList.length;i++){
                list[i] = {};
                list[i].h = this.maxNum ? this.yAxisLength * this.dataList[i].num / this.maxNum : 0;
                list[i].w = w;
                list[i].x = info.type == "bar" ? this.initX + w + i * 4 / 3 * w : this.initX + 10 + w * i;
                list[i].y = this.initY + this.yAxisLength - list[i].h;
                list[i].textX = info.type == "bar" ? list[i].x + list[i].w / 2 : list[i].x;
                list[i].textY = this.dataList[i].name.length > 4? list[i].y - 30 : list[i].y - 20;
                if (info.type == "line" && i > 0) {
                    begin = list[i - 1].x + ',' + list[i - 1].y;
                    end = list[i].x + ',' + list[i].y;
                    d = "M" + begin + "L" + end;
                    this.linePath.push(d)
                } else {
                    this.linePath = [];
                }
            }
            return list;
        },
        legendCfg:function() {
            var list = [],
                initX = [],
                turnIndex = [],
                fontSize = 10,
                gap = 13,
                len = 0,
                rect = 14,
                rectY = this.initY + this.yAxisLength + 25,
                begin = 0,
                end = 0;
            for(var i=0;i<this.dataList.length;i++){
                begin += len;
                len =this.dataList[i].name.length * fontSize + gap + rect;
                end += len;
                if (end >= this.component.graphicInfo.viewBox.width) {
                    initX.push((this.component.graphicInfo.viewBox.width - begin + 10) / 2);
                    turnIndex.push(i - 1);
                    begin = 0;
                    end = len;
                    rectY += rect + 10;
                }
                list[i] = {};
                list[i].rectX = begin;
                list[i].rectY = rectY;
                if (i == this.dataList.length - 1) {
                    var d = 0;
                    initX.push((this.component.graphicInfo.viewBox.width - end + 10) / 2);
                    turnIndex.push(i);
                    for(var j=0;j<list.length;j++){
                        if(j>turnIndex[d])d++;
                        list[j].rectX+=initX[d];
                    }
                }
            }
            return list;
        },
    },
    methods:{
        loadSuccess: function () {
            setTimeout(function(){
                vm.play()
            },0)
        }
    }
});

Vue.component('groupComp', {
    props: ['component','isLoadResource','pageData'],
    template: '\
    <div :id="\'group\'+component.unique" class="groupComponent" :style={transform:"scale("+component.compStyle.turn+","+(component.compStyle.turnY?component.compStyle.turnY:1)+")",position:"absolute"}>\
        <div v-for="item in component.subsetCompList" :style={width:item.compStyle.width,height:item.compStyle.height,position:"absolute",top:item.compStyle.top,left:item.compStyle.left,zIndex:item.compStyle.z_index,transform:"rotateZ("+item.compStyle.rotate+"deg)"}>\
            <text-comp v-if=item.compType=="textComp" :component="item" ></text-comp>\
            <word-comp v-if=item.compType=="wordComp" :component="item" ></word-comp>\
            <shape-comp v-if=item.compType=="shapeComp"  :component="item"></shape-comp>\
            <picture-comp v-if=item.compType=="pictureComp" :component="item" :is-load-resource="isLoadResource" :page-data="pageData" ></picture-comp>\
            <graphic-comp v-if=item.compType=="graphicComp" :component="item" ></graphic-comp>\
        </div>\
    </div>',
});

Vue.component('baseComponent', {
    props: ['courseWare', 'component', 'currentTime', 'totalTime', 'isCurrentPage', 'isLoadResource', 'pageData', 'pageImageStyle','sendPostAjax','userInfo','clientHeight','isPreview'],
    template: '\
    <test-comp v-if=component.compType=="multiTestComp" :component="component" :course-ware.sync="courseWare" :page-image-style="pageImageStyle" :page-no="pageData.pageNo" :send-post-ajax="sendPostAjax" :user-info="userInfo" :client-height="clientHeight" :is-preview="isPreview" :is-current-page="isCurrentPage"></test-comp>\
    <div v-else v-show="currentStatus" class="componentDiv" :style="compStyle">\
        <div :class=["baseComponent",animationClass] :style="animationStyle">\
            <text-comp v-if=component.compType=="textComp" :component="component" keep-alive></text-comp>\
            <word-comp v-if=component.compType=="wordComp" :component="component" keep-alive></word-comp>\
            <shape-comp v-if=component.compType=="shapeComp" :component="component" keep-alive></shape-comp>\
            <graphic-comp v-if=component.compType=="graphicComp" :component="component" keep-alive></graphic-comp>\
            <group-comp v-if=component.compType=="groupComp" :component="component" :is-load-resource="isLoadResource" :page-data="pageData" keep-alive></group-comp>\
            <picture-comp v-if=component.compType=="pictureComp" :component="component" :is-load-resource="isLoadResource" :page-data="pageData" keep-alive ></picture-comp>\
        </div>\
    </div>',
    computed: {
        compStyle: function () {
            return {
                width:this.component.compStyle.width,
                height:this.component.compStyle.height,
                top:this.component.compStyle.top,
                left:this.component.compStyle.left,
                zIndex:this.component.compStyle.z_index,
                transform:"rotateZ("+this.component.compStyle.rotate+"deg)",
                opacity:typeof(this.component.compStyle.transparency)=='undefined'?1:this.component.compStyle.transparency,
            };
        },
        animationStyle: function(){
            var style={
                borderStyle: 'solid',
                borderColor: this.component.compStyle.border_color,
                borderRadius: this.component.compStyle.border_radius?this.component.compStyle.border_radius:'0px',
                borderWidth: this.component.compStyle.border_width?this.component.compStyle.border_width:'0px',
                boxShadow: this.component.compStyle.box_shadow,
            };
            if (this.isCurrentPage) {
                if(typeof (this.component.animation.typeInTime) != 'undefined'){
                    if (this.component.begin <= this.currentTime && (this.component.begin + this.component.animation.typeInTime) > this.currentTime) {
                        style.animationDuration=this.component.animation.typeInTime+'s';
                    }else if(this.component.animation.emphasisType && this.currentTime >= (this.component.begin + this.component.animation.typeInTime) && this.currentTime < (this.component.begin + this.component.cost - this.component.animation.typeOutTime)){
                        style.animationDuration=this.component.animation.emphasisTime+'s';
                        style.animationIterationCount=this.component.animation.isLoop?'infinite':1;
                    }else if ((this.component.begin + this.component.cost - this.component.animation.typeOutTime) <= this.currentTime) {
                        style.animationDuration=this.component.animation.typeOutTime+'s';
                    }
                }
            }
            return style;
        },
        animationClass: function () {
            if (this.isCurrentPage) {
                if (this.component.begin <= this.currentTime && (this.component.begin + this.component.animation.typeInTime) > this.currentTime) {
                    return this.component.animation.typeIn;
                }else if(this.component.animation.emphasisType && this.currentTime >= (this.component.begin + this.component.animation.typeInTime) && this.currentTime < (this.component.begin + this.component.cost - this.component.animation.typeOutTime)){//确保兼容之前没有强调动画的课件
                    return this.component.animation.emphasisType;
                }else if ((this.component.begin + this.component.cost - this.component.animation.typeOutTime) <= this.currentTime) {
                    return this.component.animation.typeOut;
                }
            }
        },
        currentStatus: function () {
            if (this.isCurrentPage) {
                if (this.component.begin <= this.currentTime && (this.component.begin + this.component.cost) >= this.currentTime) {
                    return true;
                }else if((this.component.begin + this.component.cost)==this.pageData.totalTime && this.currentTime>(this.component.begin + this.component.cost) && this.component.animation.typeOut==''){
                    return true;
                }else {
                    return false;
                }
            } else {
                return false;
            }
        }
    }
});

Vue.component('assess', {
    props: ['sendPostAjax','userInfo','isPreview','courseId','pageImageStyle'],
    template:'\
    <div class="assessBox" :style="assessBoxStyle">\
        <div>\
            <div  class="assessTitle centerBox">\
                <div class="titleLeft">\
                    <div class="font-18 font-bold color1 font-fzss">求评价,求鞭策</div>\
                    <div class="titleButton"></div>\
                    <div class="font-12 color2">我们需要您!帮个忙,评价一下吧~</div>\
                </div>\
                <div class="titleRight"></div>\
            </div>\
            <div class="radioDiv">\
                <div class="radioBox1">\
                    <div class="assessQuestion">课件内容是否值得学?</div>\
                    <div class="centerBox">\
                        <div :class="[\'radio\',isValuable==true?\'check\':\'\']">\
                            <div class="radioIcon radioA" clicktype="touch" @click="setValuable(true)"><div class="radioCheck"></div></div>\
                            <div class="font-12 color3">值</div>\
                        </div>\
                        <div :class="[\'radio\',isValuable==false?\'check\':\'\']">\
                            <div class="radioIcon radioB" clicktype="touch" @click="setValuable(false)"><div class="radioCheck"></div></div>\
                            <div class="font-12 color3">不值</div>\
                        </div>\
                    </div>\
                </div>\
                <div class="radioBox2">\
                    <div class="assessQuestion">课件阅读体验怎样?</div>\
                    <div class="centerBox">\
                        <div :class="[\'radio\',isPraise==true?\'check\':\'\']">\
                            <div class="radioIcon radioC" clicktype="touch" @click="setPraise(true)"><div class="radioCheck"></div></div>\
                            <div class="font-12 color3">赞</div>\
                        </div>\
                        <div :class="[\'radio\',isPraise==false?\'check\':\'\']">\
                            <div class="radioIcon radioD" clicktype="touch" @click="setPraise(false)"><div class="radioCheck"></div></div>\
                            <div class="font-12 color3">踩</div>\
                        </div>\
                    </div>\
                </div>\
            </div>\
            <div :class="[\'assessBtn\',isValuable!=null||isPraise!=null||isCommit?\'\':\'disableAssessBtn\']" clicktype="touch" @click="submitSuggest">提交</div>\
        </div>\
        <div v-show="isSubmit" class="thanks" :style="assessBoxStyle"></div>\
    </div>',
    //<textarea type="text" class="suggestion" placeholder="请再说说你对课件的建议吧~" maxlength="300" v-model="suggestion"></textarea>\
    data:function(){
        return {
            isValuable:null,
            isPraise:null,
            suggestion:"",
            isCommit:false,
            isSubmit:false,
        }
    },
    computed:{
        assessBoxStyle:function(){
            if(courseWareJson.showType==2){
                return 
            }

            return this.pageImageStyle;
        }
	},
    methods:{
        setValuable:function(value){
            this.isValuable=value;
        },
        setPraise:function(value){
            this.isPraise=value;
        },
        submitSuggest:function(){
            if(this.isValuable==null && this.isPraise==null){return;}
            if(!this.isPreview){
                if(this.userInfo.userId && !this.isCommit){
                    var $this=this;
                    this.isCommit=true;
                    this.sendPostAjax({
                        url:serverUrl+'/app/courseware/score/add',
                        data:{
                            idMlnCwtCourseware:$this.courseId,
                            valuable:$this.isValuable,
                            praise:$this.isPraise,
                            suggestion:$this.suggestion,
                            createdBy:$this.userInfo.userId,
                            createdByName:$this.userInfo.userName,
                            createdByImg:$this.userInfo.userPhoto,
                        },
                        success: function (msg) {
                            var result=eval('('+msg+')');
                            if (result.code == 200) { //code为200表示成功
                                $this.isSubmit=true;
                            }
                        },
                        error: function(){
                            $this.isCommit=false;
                        }
                    })
                }else{
                    this.isSubmit=true;
                }
            }else{
                this.isSubmit=true;
            }
        },
    }
})

Vue.component('page', {
    props: ['pageData','pageImageStyle','currentPageNo','currentTime','courseWare','totalTime','loadPageNo',
        'sendPostAjax','userInfo','clientHeight','isPreview'],
    template: '\
    <div v-show="currentPageNo==pageData.pageNo" :id="pageData.pageId" :class=["pageDiv",{"currentPage":currentPageNo==pageData.pageNo}] keep-alive>\
      <img v-if="pageData.bgImageStyle && pageData.bgImageStyle.bgImageLzkSrc" :src=isLoadResource?"'+userResource+'"+pageData.bgImageStyle.bgImageLzkSrc:null style="display: none;" class="backgroundImg" @load="loadSuccess" @error="loadError">\
      <div v-if="pageData.pageType==\'slide\'" class="pageTheme" :style=[pageImageStyle,{"backgroundImage":"url("+\''+userResource+'\'+pageData.bgImageStyle.bgImageLzkSrc+")","backgroundSize":pageData.bgImageStyle.bgImageSize,"backgroundPosition":pageData.bgImageStyle.bgImagePosition,"background-repeat":"no-repeat","background-color":getBackgroundColor}]></div>\
      <audio-comp v-for="audio in pageData.audio" :component="audio" :page-data="pageData" :is-load-resource="isLoadResource"></audio-comp>\
      <base-component v-for="component in pageData.componentList" :course-ware.sync="courseWare" \
      :component="component" :current-time="currentTime" :total-time="totalTime" \
      :is-current-page="currentPageNo==pageData.pageNo" :is-load-resource="isLoadResource" :page-data="pageData" \
      :page-image-style="pageImageStyle" :send-post-ajax="sendPostAjax" :user-info="userInfo" \
      :client-height="clientHeight" :is-preview="isPreview"></base-component>\
      <video-comp v-for="item in pageData.video" :page-image-style="pageImageStyle" :page-data="pageData" :is-load-resource="isLoadResource" :component="item" keep-alive ></video-comp>\
      <assess v-if="pageData.pageType==\'assess\'" :send-post-ajax="sendPostAjax" :user-info="userInfo" :is-preview="isPreview" :course-id="courseWare.courseId" :page-image-Style="pageImageStyle"></assess>\
    </div>',
    data: function () {
        return {
            loadTimes:0,
        }
    },
    computed:{
        isLoadResource: function () {
            return (this.loadPageNo>=this.pageData.pageNo || this.currentPageNo==this.pageData.pageNo);
        },
        getBackgroundColor: function(){
            var color = this.pageData.themeColor;
            if(this.pageData.themeColor === 'rgba(255,255,255,0)'){  // 当值为透明时，默认转换成白色
                color = "#FFFFFF";
            }
            return color;
        }
    },
    methods:{
        loadSuccess: function () {
            vm.loadResource(this.pageData.pageNo,this.pageData.pageId);
        },
        loadError: function () {
            var $this=this;
            setTimeout(function () {
                if($this.loadTimes<3){
                    var bgObj=$this.$el.querySelector('.backgroundImg');
                    bgObj.setAttribute('src',bgObj.getAttribute('src'));
                    $this.loadTimes++;
                }else{
                    $this.loadSuccess();
                }
            },2000);
        },
    }
});

Vue.component('tips',{
    props:['loadProgress','pageImageStyle','loadTips','slideTips','transitionName','loadPage','courseWare','currentTime','totalTime','sendPostAjax','userInfo','clientHeight','isPreview'],
    template:'\
    <div v-show="loadTips" class="loadBox pageTheme" :style="pageImageStyle">\
        <div v-show="true" :id="loadPage.pageId" :class=["pageDiv","currentPage"] keep-alive>\
            <base-component v-for="component in loadPage.componentList" :course-ware.sync="courseWare" :component="component" \
            :current-time="0" :total-time="totalTime" :is-current-page="loadPage.isCurrentPage" \
            :is-load-resource="false" :page-data="loadPage" :page-image-style="pageImageStyle" \
            :send-post-ajax="sendPostAjax" :user-info="userInfo" :client-height="clientHeight" :is-preview="isPreview"></base-component>\
        </div>\
        <img src="cwtools/material/load_1.png" class="backgroundImg" width="100%" height="100%"/>\
    </div>',
    methods:{
        hideTips: function () {
            vm.slideTips='hasShow';
            vm.play();
        }
    }
});

var vm=new Vue({
    el: 'body',
    data:{
        courseWare:null,//课件数据对象
        currentAudio:null,//当前页正在播放的音频
        currentVideo:null,//当前页正在播放的视频
        bgMusic:null,//背景音乐
        time:null,//全局定时器
        currentTime:-0.5,//当前播放时间
        currentTotalTime:0,//当前页总时长
        currentPageNo:0,//当前页编号
        transitionName:'',//过渡动画
        sensitivity:3,//滑动灵敏度(1-5越大越难滑)
        standardWidth : courseWareJson.showType==1?608:314,//课件页面原始宽度 (showType=1为横屏，2为竖屏)
        standardHeight : courseWareJson.showType==1?342:504,//课件页面原始高度
        pageImageStyle:{
            marginLeft:'0px',
			marginTop:'0px',
            width:'100%',
            height:'100%',
        },
        slideFlag:false,//翻页标识
        turnTips:false,//翻页提示
        slideTips:'false',//首页滑动提示
        loadTips:true,//资源加载进度页面
        pageTips:false,//课件进度提示
        resList:{},//资源列表
        loadProgress:0,//资源加载进度(页面显示用)
        loadNum:0,//资源加载进度(动画用)
        loadPageNo:0,//正在加载资源的页面编号
        testNum:0,//测试题数量
        clickPoint:null,
        isTouch:false,//是否全部松开手指
        dbclickTime:{timeA:0,timeB:0},
        userInfo:{
            userId:'',
            userName:'',
            userPhoto:'',
            companyId:'',
        },
        isPreview:false,//是否是预览
        pageLength:1,
        turnScreenTips:false, //横屏提示
        IS_PORTRAIT:false,
        portraitPage:courseWareJson.showType==1?true:false
    },
    computed:{
        clientWidth:function(){
            if(this.courseWare.showType==1 && clientType.IS_H5){
                return  document.documentElement.clientHeight;
            }
            return document.documentElement.clientWidth;
        },
        clientHeight:function(){
            if(this.courseWare.showType==1 && clientType.IS_H5){
                return  document.documentElement.clientWidth;
            }
            return document.documentElement.clientHeight;
        },
        scale: function(){
            var num=1;
            if (this.clientWidth / this.clientHeight >= this.standardWidth / this.standardHeight) {
                num = this.clientHeight / this.standardHeight;
                this.pageImageStyle.marginLeft= '0px';
                this.pageImageStyle.width= '100%'
            } else {
                num = this.clientWidth / this.standardWidth;
                this.pageImageStyle.marginTop='0px';
                this.pageImageStyle.height= '100%';    
            }
            return num;
        },
        bodyStyle:function(){
            if(this.courseWare.showType==1 && clientType.IS_H5){
                return {
                    transform:'rotate(90deg)',
                }
            }
            return "";
        },
        contentStyle: function () {
            return {
                overflow:'hidden',
                width:this.clientWidth+'px',
                height:this.clientHeight+'px',
                // position: 'relative',
                backgroundColor: '#000'
            }
        },
        scaleStyle: function () {
            return {
                transform:"scale(" + this.scale + ")",
                marginTop:(this.clientHeight - this.standardHeight) / 2+'px',
                marginLeft:(this.clientWidth - this.standardWidth) / 2+'px',
            }
        },
        hSlide: function(){
            if(this.courseWare!=null && this.courseWare.showType==1){
                return 'slide_h';
            }
            return '';
        },
        courseStyle: function () {
            return {
                overflow:'hidden',
                width:this.standardWidth+'px',
                height:this.standardHeight+'px',
            }
        },
        pageProgress: function () {
            if(this.courseWare.pageList.length){
                return ((this.currentPageNo+1)/this.courseWare.pageList.length*100)+'%';
            }
            return 0;
        },
        pageScale:function(){//页面是否可以缩放，只有该页面只有背景图才可以
            var page=this.courseWare.pageList[this.currentPageNo];
            if(page.pageType=='slide'){
                if(!page.componentList.length && page.bgImageStyle.bgImageLzkSrc){
                    if(!clientType.IS_PC){
                        document.getElementById('cwViewport').setAttribute('content','width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=2.0,user-scalable=yes');
                        document.body.style.overflow='auto';
                    }
                    return true;
                }
            }
            if(!clientType.IS_PC){
                this.unableScale();
            }
            return false;
        },
        turnScreenBoxStyle:function(){
            if(this.IS_PORTRAIT){
                if(this.courseWare.showType==2 && clientType.IS_H5){
                    return {
                        transform:'rotate(0deg)',
                    }
                }
            }
        }
    },
    created: function () {
        courseWareJson=this.extend({
           bgMusic: {}, //背景音乐
           pageList: [{pageNo:0,totalTime:"",pageType:'',componentList:[{unique:""}]}], //课件页列表
           animationList: [], //翻页动画列表 
           isAssess:true,
        },courseWareJson);
 
        this.pageLength=courseWareJson.pageList.length;
        if(courseWareJson.isAssess){
            courseWareJson.pageList.push({pageNo:courseWareJson.pageList.length,pageType:'assess'});
        }
        var pages=courseWareJson.pageList;
        for(var i=0;i<pages.length;i++) {
            var resource={};
            var comps=pages[i].componentList;
            if(comps && comps.length){
                for(var j=0;j<comps.length;j++){
                    if(comps[j].compType=='pictureComp' && comps[j].pictureLzkSrc){
                        resource[comps[j].unique]=false;
                    }
                }
            }
            if(pages[i].audio && pages[i].audio.length){
                for(var j=0;j<pages[i].audio.length;j++){
                    resource[pages[i].audio[j].unique]=false;
                }
            }
            if(pages[i].bgImageStyle && pages[i].bgImageStyle.bgImageLzkSrc){
                resource[pages[i].pageId]=false;
            }
            if(this.isEmptyObject(resource)){
                this.resList[pages[i].pageNo]=true;
            }else{
                this.resList[pages[i].pageNo]=resource;
            }
        }
        if(pages.length>1){
            this.pageTips=true;
        }
        this.courseWare=courseWareJson;
    },
    ready: function () {
        this.isPreview=(this.getQueryString('m')=='pre');
        var pageIndex=this.getQueryString('pageIndex');
        if(pageIndex){
            this.currentPageNo=parseInt(pageIndex);
        }else{
            this.currentPageNo=0;
        }
        var $this=this;
        //设置翻页动画值
        this.transitionName=this.courseWare.animationList[this.currentPageNo];
        this.currentTotalTime=this.courseWare.pageList[this.currentPageNo].totalTime;
		
		// 获取pc端用户的信息
        if(clientType.IS_PC){
            var $this = this;
            zn && zn.getPcUserInfo && zn.getPcUserInfo(function(userInfo){
                $this.userInfo.userId=userInfo.userId;
                $this.userInfo.userName=userInfo.name;
                $this.userInfo.userPhoto=userInfo.photo;
            })
        }

        //添加手势事件监听
        
        $this.$el.addEventListener((clientType.IS_PC?'mousedown':'touchstart'), function (event) {
            event.preventDefault()
            try{
                $this.clickPoint={};
                $this.clickPoint.startTime=new Date().getTime();
                if(clientType.IS_PC){
                    $this.clickPoint.startX=event.pageX;
                    $this.clickPoint.startY=event.pageY;
                }else{
                    $this.clickPoint.id=event.changedTouches[0].identifier;
                    $this.clickPoint.startX=event.changedTouches[0].pageX;
                    $this.clickPoint.startY=event.changedTouches[0].pageY;
                }
            }catch (e){}
        });
        $this.$el.addEventListener('touchmove',function (event) {
            event.preventDefault()
            try {
                if($this.pageScale){return;}
                if($this.loadTips){event.preventDefault();return;}

                var x=event.changedTouches[0].pageX-$this.clickPoint.startX;
                var y=event.changedTouches[0].pageY-$this.clickPoint.startY;
                var w = x<0?x*-1:x;     //x轴的滑动值
                var h = y<0?y*-1:y;     //y轴的滑动值

                if($this.courseWare.pageList[$this.currentPageNo].pageType=='test'){
                    if($this.courseWare.showType==2 && h>w){
                        return;
                    }else if($this.courseWare.showType==1){
                        if(h>w && clientType.IS_ZN){
                            return;
                        }else if(clientType.IS_H5){
                            if(clientType.IS_ANDROID && w>h){
                                return;
                            }else if(clientType.IS_IOS){
                                event.preventDefault();
                                var obj=document.getElementById('test_'+$this.courseWare.pageList[$this.currentPageNo].componentList[0].unique);
                                if(w>h)obj.scrollTop+=x;
                            }
                        }
                    }
                }
                event.preventDefault();
            }catch (e){}
        });
        $this.$el.addEventListener((clientType.IS_PC?'mouseup':'touchend'), this.touchEnd);
        $this.$el.addEventListener(('touchcancel'), this.touchEnd);

        /**
        * 判断客户端是横屏还是竖屏 
        */
        window.addEventListener("onorientationchange" in window ? "orientationchange" : "resize", function() {   
            if( (typeof window.orientation != "undefined" &&( window.orientation == 90 || window.orientation==-90))||(typeof window.screen.orientation != "undefined" &&( window.screen.orientation.angle == 90 || window.screen.orientation.angle==-90)) ){//横屏
                if(clientType.IS_H5){
                    $this.IS_PORTRAIT = true;
                    $this.turnScreenTips = true;
                    // 5s后关掉手机自动旋转提示
                    setTimeout(function(){
                        $this.turnScreenTips = false;
                    },5000);
                }
            }
            if( (typeof window.orientation != "undefined" &&( window.orientation == 180 || window.orientation==0))||(typeof window.screen.orientation != "undefined" &&( window.screen.orientation.angle == 180 || window.screen.orientation.angle==0)) ){//竖屏
                if(clientType.IS_H5){
                    $this.turnScreenTips = false;
                    $this.IS_PORTRAIT = false;
                }
            }
        }, false);

        //已学标记、是否有排行榜
        for(var i=0;i<this.pageLength;i++){
            if(this.courseWare.pageList[i].pageType=='test'){
                this.testNum++;
            }
        }

        if(this.testNum==0 && (this.courseWare.learnedSetting=="1" || this.pageLength==1)){
            this.commitStatus();
        }
        
        if(clientType.IS_WECHAT){
            if(typeof(appId)=='undefined')appId='wx784c0c8df021be32';
            document.write('<script type="text/javascript" src="https://res.wx.qq.com/open/js/jweixin-1.2.0.js"></script>');
            var config={},$this=this;
            config.appId=appId;
            config.nonceStr = 'lzk';
            config.timestamp = parseInt(new Date().getTime()/1000);
            config.url = window.location.href.split('#')[0];
            if(serverUrl){
                this.sendPostAjax({
                    url:serverUrl+'/app/getSign.do',
                    data:{
                        noncestr:config.nonceStr,
                        timestamp:config.timestamp,
                        url:encodeURIComponent(config.url)
                    },
                    success: function (msg) {
                        config.signature=msg;
                        $this.configWX(config);
                    }
                });
            }
        }

        this.bgMusic=document.getElementById('bgMusic');
        //获取知鸟用户信息
        try{
            App.call("fetchUserInfo", function (umId,sid,from,companyId,server_host,six,seven,eight,nine,ten,head_url,user_name) {
                $this.userInfo.sid = sid;
                $this.userInfo.userId=umId;
                $this.userInfo.userName=user_name;
                $this.userInfo.userPhoto=head_url;
                $this.userInfo.companyId=companyId;
                if(!($this.userInfo.userPhoto && $this.userInfo.userName) && $this.userInfo.sid && $this.userInfo.userId){ // 一点通中没有用户图像时，再次请求知鸟接口获取用户的图像等信息
                    var znServerUrl=window.location.protocol+'//mlearning.pingan.com.cn';
                    $this.sendPostAjax({
                        url:znServerUrl+"/learn/app/clientapi/user/personDetail.do",
                        data:{sid: $this.userInfo.sid,searchedUserId: $this.userInfo.userId, nonGzip:1},
						dataType : "JSON",
                        success: function (msg) {
                            $this.userInfo.userName=JSON.parse(msg).body.userName;
                            $this.userInfo.userPhoto=JSON.parse(msg).body.userImg;
                            $this.userInfo.companyId=JSON.parse(msg).body.enterpriseId;
                        },
                    })
                }
            })
        }catch (e){}
        try {  // 上传插件有没有测试题
            if(this.testNum){ // 有测试题
                window.parent.postMessage('hasTest', '*')
            }else{  // 没有测试题
                window.parent.postMessage('noTest', '*')
            }
        } catch (e) {}
        // 获取移动端返回的页码  823版本新增加载时获取页码跳转到指定页
        try{
            App.call("fetchPageNum", function (pageNo) {
                if(pageNo){
                    var tempNo = parseInt(pageNo);
                    if(tempNo < courseWareJson.pageList.length -1 && tempNo >0){ // 是最后一页就重新开始播放
                        $this.currentPageNo = tempNo - 1;
                        $this.afterPage(true);
                        return;
                    }
                }
                $this.play();
            })
        }catch (e){}
        if(clientType.IS_PC){
            this.play();
        }
    },
    methods:{
        touchEnd: function(event) {
            try{
                if(!clientType.IS_PC && event.changedTouches[0].identifier!=this.clickPoint.id){return;}
                if(this.loadTips){event.preventDefault();return;}

                var x, y,time=new Date().getTime()-this.clickPoint.startTime;
                if(clientType.IS_PC){
                    x=event.pageX-this.clickPoint.startX;
                    y=event.pageY-this.clickPoint.startY;
                }else{
                    x=event.changedTouches[0].pageX-this.clickPoint.startX;
                    y=event.changedTouches[0].pageY-this.clickPoint.startY;
                }

                if(this.courseWare.showType==1 && clientType.IS_H5){//微信横屏课件需要互换x,y
                    var temp=x;
                    x=y;y=temp;
                }

                var num=parseInt(20*this.sensitivity*(this.clientWidth/this.standardWidth));//触发翻页的临界值
                //单击事件
                if(Math.abs(time)<300 && Math.abs(x)<=5 && Math.abs(y)<=5){
                    this.clickEvent(event);
                }else if(Math.abs(x)>num && Math.abs(x)>Math.abs(y)){//左右滑动
                    if(isScroll().scrollX && isScroll().scrollY){return;}
                    var page=this.courseWare.pageList[this.currentPageNo];
                    if(x<0){
                        this.afterPage()
                    }else{
                        this.forcePage()
                    }
                }
            }catch (e){}
        },
        commitStatus:function(){
            try {
                App.call("doMobileSetValue", "cmi.core.lesson_status", "completed");
                App.call("doMobileCommit");
            } catch (e) {}
            if (clientType.IS_PC || clientType.IS_H5) {
                try {
                    window.doLMSSetValue("cmi.core.lesson_status", "completed");
                    window.doLMSCommit();
                    window.doLMSFinish();
                } catch (e) {}
            }
            try {  // 增加插件上报
				window.parent.postMessage('finish', '*')
			} catch (e) {}
        },
        unableScale:function(){
            var val = document.getElementById('cwViewport')
            if (val) {
                val.setAttribute('content','width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no');
            }
            document.body.style.overflow='hidden';
        },
        clickEvent: function (event) {
            //触发页面元素绑定的单击事件
            var clickType=event.target.getAttribute('clicktype');
            if(clickType=='touch' && !clientType.IS_PC){
                event.preventDefault();
                event.target.click();
                return;
            }
            //单击翻页
            if(clientType.IS_H5){return;}
            var type=this.courseWare.pageList[this.currentPageNo].pageType;
            if(type=='slide'){
                if(isScroll().scrollX && isScroll().scrollY){return;}
                var clickX=clientType.IS_PC?event.pageX:event.changedTouches[0].pageX;
                if(clickX<this.clientWidth/3){
                    this.forcePage();
                }else if(clickX>this.clientWidth/3*2){
                    this.afterPage();
                }
            }
        },
        configWX: function (config) {
            var $this=this;
            var picUrl=userResource?(userResource+$this.courseWare.coverPicLzkSrc):(window.location.href.substring(0,window.location.href.lastIndexOf("/")+1)+$this.courseWare.coverPicLzkSrc);
            wx.config({
                debug : false,
                appId : config.appId, // 必填，公众号的唯一标识
                timestamp : config.timestamp, // 必填，生成签名的时间戳
                nonceStr : config.nonceStr, // 必填，生成签名的随机串
                signature : config.signature,// 必填，签名，见附录1
                jsApiList : [ 'onMenuShareTimeline','onMenuShareAppMessage']
            });
            wx.ready(function() {
                wx.onMenuShareTimeline({
                    title: $this.courseWare.courseName, // 分享标题
                    link: config.url, // 分享链接
                    imgUrl: picUrl+'?'+new Date().getTime(), // 分享图标
                    success: function () {},
                    cancel: function () {}
                });
                wx.onMenuShareAppMessage({
                    title: $this.courseWare.courseName, // 分享标题
                    desc: $this.courseWare.courseIntroduction+' ', // 分享描述
                    link: config.url, // 分享链接
                    imgUrl: picUrl+'?'+new Date().getTime(), // 分享图标
                    success: function () {},
                    cancel: function () {}
                });
                wx.error(function(res){});
            });
        },
        sendPostAjax: function (proper) {
            var xmlHttp;
            if (window.ActiveXObject) {
                xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
            }else if (window.XMLHttpRequest) {
                xmlHttp = new XMLHttpRequest();
            }
            xmlHttp.open("POST",proper.url);

            var data='';
            if(proper.textType && proper.textType=='json'){
                xmlHttp.setRequestHeader("Content-Type","application/json");
                data=JSON.stringify(proper.data);
            }else{
                xmlHttp.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
                for(var key in proper.data){
                    data=data+'&'+key+'='+proper.data[key];
                }
                data=data.substring(1);
            }

            xmlHttp.onreadystatechange=function(){
                if(xmlHttp.readyState == 4) {
                    if(xmlHttp.status == 200) {
                        proper.success(xmlHttp.responseText);
                    }
                }
            };
            xmlHttp.send(data);
        },
        loadResource:function (pageNo,id) {
            if(clientType.IS_ZN && clientType.ZN_VERSION<352){return;}
            if(this.resList[pageNo][id]){return;}
            this.loadNum=this.getProgress(this.currentPageNo);
            this.resList[pageNo][id]=true;
            this.updateProgress(this.currentPageNo);
            //加载完成一页后，继续加载后面页面的图片和音频
            if(this.getProgress(this.loadPageNo)==100){
                while(this.loadPageNo<this.pageLength-1){
                    this.loadPageNo++;
                    var page=this.courseWare.pageList[this.loadPageNo];
                    if(page.audio && page.audio.length){
                        var id=page.audio[0].unique;
                        if(!this.resList[this.loadPageNo][id] && !clientType.IS_ZN){
                            document.getElementById(id).play();
                        }
                    }
                }
            }
        },
        updateProgress: function () {
            var newValue=this.getProgress(this.currentPageNo);
            var offset=newValue-this.loadNum;
            var $this=this;
            for(var i=1;i<=offset;i++){
                setTimeout(function(){
                    $this.loadProgress=$this.loadProgress+1;
                    if($this.loadProgress==100){
                        $this.play();
                    }
                },10*i);
            }
        },
        getProgress: function (pageNo) {
            var res=this.resList[pageNo];
            if(res==true){
                return 100;
            }
            var count=0;
            var ready=0;
            for(var key in res){
                if(res[key]){
                    ready++;
                }
                count++;
            }
            return parseInt(ready/count*100);
        },
        play: function () {
            if(!clientType.IS_ZN || (clientType.IS_ZN && clientType.ZN_VERSION>=352)){
                var progress=this.getProgress(this.currentPageNo);
                if(progress==100){
                    this.loadProgress=progress;
                    this.loadTips=true;
                    return;
                }else if(this.getProgress(this.currentPageNo)==100){
                    this.loadTips=true;
                }
            }

            var $this=this;
            var page=this.courseWare.pageList[this.currentPageNo];
            if($this.currentPageNo==0 && $this.pageLength>1 && $this.slideTips=='false'){//如果是首页，则出现翻页提示
                $this.slideTips='true';
                setTimeout(function () {
                    $this.slideTips='hasShow';
                },2000);
            }

            //判断是否最后一页，上报已学
            if(this.courseWare.learnedSetting=="0" && this.testNum==0 && this.pageLength>1 && this.currentPageNo==this.pageLength-1){
                this.commitStatus();
            }
            
            // 修复老课件learnedSetting缺失的问题
            if(this.courseWare.learnedSetting=== undefined && this.testNum==0 && this.pageLength>1 && this.currentPageNo==this.pageLength-1){
                this.commitStatus();
            }
            //判断页类型
            if(page.pageType=='video'){
                var video=page.video[0];
                this.playVideo(video);
            }else if(page.pageType=='test'){
                this.pauseBgMusic();
            }else if(page.pageType=='slide'){
                this.playPage();
                //播放音频
                if(page.audio&&page.audio.length){
                    this.pauseBgMusic();
                    var audioId = page.audio[0].unique;
                    this.currentAudio = document.getElementById(audioId);
                    currentAudio_num = this.currentAudio
                    try {
                        if (clientType.IS_ZN) {
                            var url=userResource?this.currentAudio.getAttribute('src'):(window.location.href.substring(0,window.location.href.lastIndexOf("/")+1)+this.currentAudio.getAttribute('src'));
                            if(clientType.ZN_VERSION>=382){
                                App.call('startAudio', '{"url":"'+url+'","loop":"false","type":"start"}','afterStartAudio');
                            }else{
                                App.call('playAudio', url, '');
                            }
                        }else{
                            this.currentAudio.muted=false;
                            this.currentAudio.currentTime=0;
                            this.currentAudio.play();
                        }
                    }catch(e){}
                }else{
                    this.playBgMusic();
                }
            }else{
                this.playBgMusic();
            }
        },
        playVideo: function (video) {//播放视频
            var $this=this;
            if($this.slideFlag){
                return;
            }
            this.pauseBgMusic();
            if(video.videoLzkSrc){
                if(clientType.IS_ZN_All){
                    if(clientType.ZN_VERSION>343){
                        try {
                            var url=userResource?(userResource+video.videoLzkSrc):(window.location.href.substring(0,window.location.href.lastIndexOf("/")+1)+video.videoLzkSrc);
                            App.call('startVideo','{"url":"'+url+'","status":"testStatus","videoTitle":"视频"}','stopVideo');
                        } catch (e) {}
                    }
                }else{
                    $this.currentVideo=document.getElementById(video.unique);
                    $this.currentVideo.currentTime=0;
                    $this.currentVideo.play();
                }
            }
        },
        playPage: function () {//播放课件页(不含音频)
            var $this=this;
            if(!this.time){
                this.time=setInterval(function () {
                    if($this.currentTime<$this.currentTotalTime+1){
                        $this.currentTime+=0.5;
                    }
                    if($this.currentTime==$this.currentTotalTime+1){
                        //自动翻页(开启或者播完音频后会自动翻页)
                        if(parseInt($this.courseWare.autoPager)==1 || $this.courseWare.pageList[$this.currentPageNo].audio.length>0){
                            $this.afterPage();
                        }else{
                            $this.pause();
                        }
                    }
                },500);
            }
        },
        playBgMusic: function () {//播放背景音乐
            if(this.bgMusic){
                if(clientType.IS_ZN){
                    try {
                        var url=userResource?this.bgMusic.getAttribute('src'):(window.location.href.substring(0,window.location.href.lastIndexOf("/")+1)+this.bgMusic.getAttribute('src'));
                        if(clientType.ZN_VERSION>=382){
                            App.call('startAudio', '{"url":"'+url+'","loop":"true","type":"start"}','');
                        }else{
                            App.call('playAudio', url, '');
                        }
                    } catch (e) {}
                }else{
                    this.bgMusic.muted=false;
                    this.bgMusic.play();
                }
            }
        },
        pauseBgMusic: function () {
            if(this.bgMusic){
                if(clientType.IS_ZN){//ios只能接口只能播一个音频，所以背景音乐用h5方式播放
                    try {
                        var url=userResource?this.bgMusic.getAttribute('src'):(window.location.href.substring(0,window.location.href.lastIndexOf("/")+1)+this.bgMusic.getAttribute('src'));
                        App.call('pauseAudio',url);
                    } catch (e) {}
                }else{
                    this.bgMusic.pause();
                }
            }
        },
        pause: function () {//暂停播放
            clearInterval(this.time);
            this.time=null;
            if(this.currentAudio){
                if(clientType.IS_ZN){
                    try {
                        var url=userResource?this.currentAudio.getAttribute('src'):(window.location.href.substring(0,window.location.href.lastIndexOf("/")+1)+this.currentAudio.getAttribute('src'));
                        App.call('stopAudio',url);
                    } catch (e) {}
                }else{
                    this.currentAudio.pause();
                }
                this.currentAudio=null;
            }
            var page = this.courseWare.pageList[this.currentPageNo]
            page.video.length > 0 && (this.currentVideo = document.getElementById(page.video[0].unique))
            if(this.currentVideo){
                this.currentVideo.pause();
            }
            this.currentVideo=null;
            currentAudio_num = this.currentAudio
        }, 
        forcePage: function () {  //上一页
            if(!this.slideFlag){
                if(this.currentPageNo>0){
                    this.unableScale();                   
                    this.slideFlag=true;
                    this.pause();
                    this.currentTotalTime=this.courseWare.pageList[this.currentPageNo-1].totalTime;
                    this.transitionName=this.courseWare.animationList[this.currentPageNo-1];
                    if(this.transitionName=='slide'){
                        this.transitionName='slideLeft';
                    }else if(this.transitionName==''){
                        this.transitionName='none';
                    }else if(this.transitionName == 'chamfer'){
                        this.transitionName = 'chamferLeft';
                    }else if(this.transitionName == 'turn'){
                        courseWareJson.showType==1?this.transitionName='turnLandsLeft':this.transitionName='turnPorLeft';
                    }else if(this.transitionName == 'cube'){
                        this.transitionName = 'cubeLeft';
                    }else if(this.transitionName == 'cover'){
                        this.transitionName = 'coverLeft';
                    }else if(this.transitionName == 'sector'){
                        this.transitionName = 'sectorLeft';
                    }else if(this.transitionName == 'scaleStack'){
                        this.transitionName = 'scaleStackLeft';
                    }else if(this.transitionName == 'stack'){
                        this.transitionName = 'stackLeft';
                    }else if(this.transitionName == 'scaleCover'){
                        this.transitionName = 'scaleCoverLeft';
                    }
                    if(this.transitionName!=""){
                        this.currentTime=-0.5;
                    }
                    this.currentPageNo=this.currentPageNo-1;
                    window.parent.postMessage("forcePage","*");

                    var courseId = courseWareJson.courseId; // 新增一点通需求
                    var pageNo = this.currentPageNo;
                    App.call('forcePage', '{"courseId":"'+ courseId +'","pageNo":"'+ pageNo +'"}');
                }
            }
        },
        afterPage: function (flag) {  //下一页
            //如果是测试题，则没通过不让翻页
            var page=this.courseWare.pageList[this.currentPageNo],$this=this;
            if(!flag) {
                if(page.pageType=='test' && !page.componentList[0].isPass && page.pageNo!=this.courseWare.pageList.length-1){
                    this.turnTips=true;
                    setTimeout(function () {
                        $this.turnTips=false;
                    },3000);
                    return;
                }
            }

            if(!this.slideFlag) {
                if (this.currentPageNo < this.courseWare.pageList.length - 1) {
                    this.unableScale();
                    this.slideFlag=true;
                    this.pause();
                    this.currentTotalTime = this.courseWare.pageList[this.currentPageNo+1].totalTime;
                    this.transitionName = this.courseWare.animationList[this.currentPageNo];
                    if (this.transitionName == 'slide') {
                        this.transitionName = 'slideRight';
                    }else if(!this.transitionName){
                        this.transitionName='none';
                    }else if(this.transitionName == 'chamfer'){
                        this.transitionName = 'chamferRight';
                    }else if(this.transitionName == 'turn'){
                        courseWareJson.showType==1?this.transitionName='turnLandsRight':this.transitionName='turnPorRight';
                    }else if(this.transitionName == 'cube'){
                        this.transitionName = 'cubeRight';
                    }else if(this.transitionName == 'cover'){
                        this.transitionName = 'coverRight';
                    }else if(this.transitionName == 'sector'){
                        this.transitionName = 'sectorRight';
                    }else if(this.transitionName == 'scaleStack'){
                        this.transitionName = 'scaleStackRight';
                    }else if(this.transitionName == 'stack'){
                        this.transitionName = 'stackRight';
                    }else if(this.transitionName == 'scaleCover'){
                        this.transitionName = 'scaleCoverRight';
                    }
                    if(this.transitionName!=""){
                        this.currentTime=-0.5;
                    }
                    this.currentPageNo = this.currentPageNo + 1;
                    window.parent.postMessage("afterPage","*");

                    var courseId = courseWareJson.courseId; // 新增一点通需求
                    var pageNo = this.currentPageNo;
                    App.call('afterPage', '{"courseId":"'+ courseId +'","pageNo":"'+ pageNo +'"}');
                }
            }
        },
        getQueryString: function(name){
            var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if(r!=null){
                return unescape(r[2]);
            }
            return null;
        },
        isEmptyObject: function (obj) {
            var key;
            for (key in obj)
                return false;
            return true;
        },
        extend:function(obj, newProperties){//初始化课件字段
          for (var key in newProperties) {
            if (newProperties.hasOwnProperty(key)) {
              if (Object.prototype.toString.call(obj[key]) == '[object Object]' || Object.prototype.toString.call(obj[key]) == '[object Array]') {
                for (var newKey in obj[key]) {
                  if (obj[key].hasOwnProperty(newKey) && !newProperties[key].hasOwnProperty(newKey)) {
                    newProperties[key][newKey] = obj[key][newKey];
                  }
                }
              }
              obj[key] = newProperties[key];
            }
          }
          return obj;
        },
        quitCourse: function(){ // 新增一点通需求
            var test = []
            var courseId =  courseWareJson.courseId; // 获取微课id
            var currentPageNo = this.currentPageNo;  // 退出时页码 
            var pageLength = this.pageLength; // 总页码，

            var pages=courseWareJson.pageList;
            for(var i=0; i < pages.length; i++) {
                if(pages[i].pageType=='test'){
                    var comps = pages[i].componentList;
                    for(var j=0; j < comps.length; j++){
                        var testItem = {};
                        testItem.unique = comps[j].unique;  // 测试题id
                        testItem.subject = comps[j].setting.subject; // 测试题名称
                        testItem.trueNum = comps[j].trueNum; // 答对数，
                        testItem.totalNo = comps[j].list.length; // 答错数，总题数，
                        testItem.isPass = comps[j].isPass;  // 是否通过考试
                        testItem.beginTime = comps[j].beginTime;  // 考试的开始时间
                        testItem.endTime = comps[j].endTime;  // 考试的结束时间
                        test.push(testItem) // 考试数组
                    }
                }
            }
            var data = {
                courseId:courseId,
                currentPageNo:currentPageNo,
                pageLength:pageLength,
                test:test
            }
            data = JSON.stringify(data)
            App.call('quitCourse', data);
        }
    },
    transitions: {
        fade: {
            afterEnter: function () {
                this.slideFlag=false;
                this.play();
            }
        },
        slideLeft: {
            afterEnter: function () {
                this.slideFlag=false;
                this.play();
            }
        },
        slideRight:{
            afterEnter: function () {
                this.slideFlag=false;
                this.play();
            }
        },
        none:{
            afterEnter: function () {
                this.slideFlag=false;
                this.play();
            }
        },
        chamferLeft:{
            afterEnter: function () {
                this.slideFlag=false;
                this.play();
            }
        },
        chamferRight:{
            afterEnter: function () {
                this.slideFlag=false;
                this.play();
            }
        },
        slice:{
            afterEnter: function () {
                this.slideFlag=false;
                this.play();
            }
        },
        updowncross:{
            afterEnter: function () {
                this.slideFlag=false;
                this.play();
            }
        },
        turnLandsRight:{
            afterEnter: function () {
                this.slideFlag=false;
                this.play();
            }
        },
        turnLandsLeft:{
            afterEnter: function () {
                this.slideFlag=false;
                this.play();
            }
        },
        turnPorRight:{
            afterEnter: function () {
                this.slideFlag=false;
                this.play();
            }
        },
        turnPorLeft:{
            afterEnter: function () {
                this.slideFlag=false;
                this.play();
            }
        },
        circle:{
            afterEnter: function () {
                this.slideFlag=false;
                this.play();
            }
        },
        open:{
            afterEnter: function () {
                this.slideFlag=false;
                this.play();
            }
        },
        cubeLeft:{
            afterEnter: function () {
                this.slideFlag=false;
                this.play();
            }
        },
        cubeRight:{
            afterEnter: function () {
                this.slideFlag=false;
                this.play();
            }
        },
        coverLeft:{
            afterEnter: function () {
                this.slideFlag=false;
                this.play();
            }
        },
        coverRight:{
            afterEnter: function () {
                this.slideFlag=false;
                this.play();
            }
        },
        sectorLeft:{
            afterEnter: function () {
                this.slideFlag=false;
                this.play();
            }
        },
        sectorRight:{
            afterEnter: function () {
                this.slideFlag=false;
                this.play();
            }
        },
        scaleStackLeft:{
            afterEnter: function () {
                this.slideFlag=false;
                this.play();
            }
        },
        scaleStackRight:{
            afterEnter: function () {
                this.slideFlag=false;
                this.play();
            }
        },
        stackLeft:{
            afterEnter: function () {
                this.slideFlag=false;
                this.play();
            }
        },
        stackRight:{
            afterEnter: function () {
                this.slideFlag=false;
                this.play();
            }
        },
        scaleCoverLeft:{
            afterEnter: function () {
                this.slideFlag=false;
                this.play();
            }
        },
        scaleCoverRight:{
            afterEnter: function () {
                this.slideFlag=false;
                this.play();
            }
        }
    }
});

var stopVideo = function(args) {
    vm.afterPage();
}

var afterStartAudio = function(args){
    vm.playBgMusic();
}

function loadSuccess (id, msg) {
    vm.loadResource(id.split('&lzk&')[0],id.split('&lzk&')[1]);
}

function quitCourse(){  // 一点通需求  供原生退出时调用
    vm.quitCourse()
}
window.onmessage=function(e){
    if(e.data == 'force'){
        vm.forcePage();
    }else if(e.data == 'after'){
        vm.afterPage();
    }
};

var _hmt = _hmt || [];
(function() {
    var hm = document.createElement("script");
    hm.src = "https://hm.baidu.com/hm.js?737d3db328fc3a01af177facc9a6827c";
    var s = document.getElementsByTagName("script")[0];
    s.parentNode.insertBefore(hm, s);
})();