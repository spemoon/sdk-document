var helper = require('./helper');
var noop = helper.noop;
var replace = helper.replace;
var merge = helper.merge;
/**
 * Block-Level Grammar
 */

var block = {
    newline: /^\n+/, // 空行: 一个或者以上的空行
    code: /^( {4}[^\n]+\n*)+/, // 代码: 四个空格开头，且后续不是空行
    fences: noop,
    section: noop,
    hr: /^( *[-*_]){3,} *(?:\n+|$)/, // hr: -或_三个以上并且后续跟着一个空行
    heading: /^ *(#{1,6}) *([^\n]+?) *#* *(?:\n+|$)/, // h1-h6: 1到6个#
    nptable: noop,
    lheading: /^([^\n]+)\n *(=|-){2,} *(?:\n+|$)/,
    blockquote: /^( *>[^\n]+(\n(?!def)[^\n]+)*\n*)+/,
    list: /^( *)(bull) [\s\S]+?(?:hr|def|\n{2,}(?! )(?!\1bull )\n*|\s*$)/,
    html: /^ *(?:comment|closed|closing) *(?:\n{2,}|\s*$)/,
    def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +["(]([^\n]+)[")])? *(?:\n+|$)/,
    table: noop,
    paragraph: /^((?:[^\n]+\n?(?!hr|heading|lheading|blockquote|tag|def))+)\n*/,
    text: /^[^\n]+/
};

block.bullet = /(?:[*+-]|\d+\.)/;
block.item = /^( *)(bull) [^\n]*(?:\n(?!\1bull )[^\n]*)*/;
block.item = replace(block.item, 'gm')(/bull/g, block.bullet)();

block.list = replace(block.list)(/bull/g, block.bullet)('hr', '\\n+(?=\\1?(?:[-*_] *){3,}(?:\\n+|$))')('def', '\\n+(?=' + block.def.source + ')')();

block.blockquote = replace(block.blockquote)('def', block.def)();

block._tag = '(?!(?:' + 'a|em|strong|small|s|cite|q|dfn|abbr|data|time|code' + '|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo' + '|span|br|wbr|ins|del|img)\\b)\\w+(?!:/|[^\\w\\s@]*@)\\b';

block.html = replace(block.html)('comment', /<!--[\s\S]*?-->/)('closed', /<(tag)[\s\S]+?<\/\1>/)('closing', /<tag(?:"[^"]*"|'[^']*'|[^'">])*?>/)(/tag/g, block._tag)();

block.paragraph = replace(block.paragraph)('hr', block.hr)('heading', block.heading)('lheading', block.lheading)('blockquote', block.blockquote)('tag', '<' + block._tag)('def', block.def)();

/**
 * Normal Block Grammar
 */

block.normal = merge({}, block); // 复制了一份block，常规的block（不包含gfm和tables）

/**
 * GFM Block Grammar
 */

block.gfm = merge({}, block.normal, {
    // 匹配以下格式:
    //  *(`{3,}|~{3,}) *: 3个或者以上的`或者~开头
    // (\S+)? *: 可能后续跟着一些非空白字符
    // \n: 1个换行
    // ([\s\S]+?): 一大段内容
    // \s*\1: 反向引用```这个匹配
    //  *(?:\n+|$): 可能存在的换行或者结束
    // 例如: ```css\nhello world \n hehe``` 将被匹配到, 同时匹配的数组各元素为:
    // [0]: 整个匹配 [1]: ``` [2]: css  [3]: hello world \n hehe
    fences: /^ *(`{3,}|~{3,}) *(\S+)? *\n([\s\S]+?)\s*\1 *(?:\n+|$)/,
    paragraph: /^/
});

block.gfm.paragraph = replace(block.paragraph)('(?!', '(?!' + block.gfm.fences.source.replace('\\1', '\\2') + '|' + block.list.source.replace('\\1', '\\3') + '|')();

/**
 * GFM + Tables Block Grammar
 */

block.tables = merge({}, block.gfm, {
    nptable: /^ *(\S.*\|.*)\n *([-:]+ *\|[-| :]*)\n((?:.*\|.*(?:\n|$))*)\n*/,
    table: /^ *\|(.+)\n *\|( *[-:]+[-| :]*)\n((?: *\|.*(?:\n|$))*)\n*/
});

block.ex = merge({}, block.tables, {
    // 匹配以下格式:
    //  *(:{3,}) *   3个或者以上的:开头
    // (\S+)? *      可能后续跟着一些非空白字符,这个是用来匹配标签的,一般默认是 section
    // \n: 1个换行
    // ([\s\S]+?): 一大段内容
    // \s*\1: 反向引用:::这个匹配
    //  *(?:\n+|$): 可能存在的换行或者结束
    // 例如: :::section\nhello world \n hehe::: 将被匹配到, 同时匹配的数组各元素为:
    // [0]: 整个匹配 [1]: ::: [2]: section [3]: hello world \n hehe
    section: /^ *(:{3,}) *(\S+)? *\n([\s\S]+?)\s*\1 *(?:\n+|$)/
});

module.exports = block;