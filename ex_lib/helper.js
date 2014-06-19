/**
 * 将特殊字符转义为实体
 * @param html 输入源
 * @param encode
 * @returns String
 */
function escape(html, encode) {
    return html.replace(!encode ? /&(?!#?\w+;)/g : /&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
exports.escape = escape;

/**
 * &colon 替换为:
 * &#... 转义为正常字符
 * @param html
 * @returns String
 */
function unescape(html) {
    return html.replace(/&([#\w]+);/g, function(_, n) {
        n = n.toLowerCase();
        if(n === 'colon') return ':';
        if(n.charAt(0) === '#') {
            return n.charAt(1) === 'x' ? String.fromCharCode(parseInt(n.substring(2), 16)) : String.fromCharCode(+n.substring(1));
        }
        return '';
    });
}
exports.unescape = unescape;

/**
 * 替换
 * @param regex
 * @param opt
 * @returns {self}
 */
function replace(regex, opt) {
    regex = regex.source; // 正则对象对应的正则字符串
    opt = opt || '';
    return function self(name, val) { // name: String   val: RegExp
        if(!name) {
            return new RegExp(regex, opt);
        }
        val = val.source || val;
        val = val.replace(/(^|[^\[])\^/g, '$1'); // 将多个^转为一个^，但是[^形式保留
        regex = regex.replace(name, val);
        return self;
    };
}
exports.replace = replace;

/**
 * 空函数
 */
function noop() {
}
noop.exec = noop;
exports.noop = noop;


/**
 * 浅层复制，将第一个参数之后的对象的本身属性都复制给第一个对象obj
 * @param obj
 * @returns {*}
 */
function merge(obj) {
    var i = 1
        , target
        , key;

    for(; i < arguments.length; i++) {
        target = arguments[i];
        for(key in target) {
            if(Object.prototype.hasOwnProperty.call(target, key)) {
                obj[key] = target[key];
            }
        }
    }

    return obj;
}
exports.merge = merge;
