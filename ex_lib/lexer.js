var block = require('./block');
var defaults = require('./default-config');
/**
 * Block Lexer
 */

function Lexer(options) {
    this.tokens = [];
    this.tokens.links = {};
    this.options = options || defaults;
    this.rules = block.normal;

    if(this.options.ex) {
        this.rules = block.ex;
    } else {
        if(this.options.gfm) {
            if(this.options.tables) {
                this.rules = block.tables;
            } else {
                this.rules = block.gfm;
            }
        }
    }
}
module.exports = Lexer;

/**
 * Expose Block Rules
 */

Lexer.rules = block;

/**
 * Static Lex Method
 */

Lexer.lex = function(src, options) {
    var lexer = new Lexer(options);
    return lexer.lex(src);
};

/**
 * Preprocessing
 */

Lexer.prototype.lex = function(src) {
    // 将换行格式化: \r\n 或者 \r 统一替换为\n
    // \t 替换为 4个空格
    // \u00a0 替换为空格
    // \u2424 替换为\n
    src = src.replace(/\r\n|\r/g, '\n').replace(/\t/g, '    ').replace(/\u00a0/g, ' ').replace(/\u2424/g, '\n');

    return this.token(src, true);
};

/**
 * Lexing
 */

Lexer.prototype.token = function(src, top, bq) {
    var src = src.replace(/^ +$/gm, '') // 将开头的空白去掉
        , next
        , loose
        , cap
        , bull
        , b
        , item
        , space
        , i
        , l;

    // 下面处理的原理是,每次只处理最开头的部分,所以所有正则都是^开头
    // exec 非 g 模式下,匹配结果为 cap 的话,则 cap[0] 是匹配到的完整结果, src 替换为匹配后的位置开始计算(substring 的作用)
    // 然后将处理后的结果传入 this.tokens 以便后续处理(传入必须包括一个 type 标识匹配的正则类型,一般还会包含一个 text 字段)
    //
    while(src) {
        // newline
        if(cap = this.rules.newline.exec(src)) { //
            src = src.substring(cap[0].length);
            if(cap[0].length > 1) {
                this.tokens.push({
                    type: 'space'
                });
            }
        }

        // code
        if(cap = this.rules.code.exec(src)) {
            src = src.substring(cap[0].length);
            cap = cap[0].replace(/^ {4}/gm, '');
            this.tokens.push({
                type: 'code',
                text: !this.options.pedantic ? cap.replace(/\n+$/, '') : cap // 非规范化情况下将所有换行清理掉
            });
            continue;
        }

        // section (ex)
        if(cap = this.rules.section.exec(src)) {
            src = src.substring(cap[0].length);
            this.tokens.push({
                type: 'section',
                tag: cap[2], // 紧跟在:::后面的字符串
                text: cap[3] // 匹配的文本
            });
            continue;
        }

        // fences (gfm)
        if(cap = this.rules.fences.exec(src)) {
            src = src.substring(cap[0].length);
            this.tokens.push({
                type: 'code',
                lang: cap[2], // 紧跟在```后面的字符串,一般是用来标识语言的
                text: cap[3] // 匹配的文本
            });
            continue;
        }

        // heading
        if(cap = this.rules.heading.exec(src)) {
            src = src.substring(cap[0].length);
            this.tokens.push({
                type: 'heading',
                depth: cap[1].length,
                text: cap[2]
            });
            continue;
        }

        // table no leading pipe (gfm)
        if(top && (cap = this.rules.nptable.exec(src))) {
            src = src.substring(cap[0].length);

            item = {
                type: 'table',
                header: cap[1].replace(/^ *| *\| *$/g, '').split(/ *\| */),
                align: cap[2].replace(/^ *|\| *$/g, '').split(/ *\| */),
                cells: cap[3].replace(/\n$/, '').split('\n')
            };

            for(i = 0; i < item.align.length; i++) {
                if(/^ *-+: *$/.test(item.align[i])) {
                    item.align[i] = 'right';
                } else if(/^ *:-+: *$/.test(item.align[i])) {
                    item.align[i] = 'center';
                } else if(/^ *:-+ *$/.test(item.align[i])) {
                    item.align[i] = 'left';
                } else {
                    item.align[i] = null;
                }
            }

            for(i = 0; i < item.cells.length; i++) {
                item.cells[i] = item.cells[i].split(/ *\| */);
            }

            this.tokens.push(item);

            continue;
        }

        // lheading
        if(cap = this.rules.lheading.exec(src)) {
            src = src.substring(cap[0].length);
            this.tokens.push({
                type: 'heading',
                depth: cap[2] === '=' ? 1 : 2,
                text: cap[1]
            });
            continue;
        }

        // hr
        if(cap = this.rules.hr.exec(src)) {
            src = src.substring(cap[0].length);
            this.tokens.push({
                type: 'hr'
            });
            continue;
        }

        // blockquote
        if(cap = this.rules.blockquote.exec(src)) {
            src = src.substring(cap[0].length);

            this.tokens.push({
                type: 'blockquote_start'
            });

            cap = cap[0].replace(/^ *> ?/gm, '');

            // Pass `top` to keep the current
            // "toplevel" state. This is exactly
            // how markdown.pl works.
            this.token(cap, top, true);

            this.tokens.push({
                type: 'blockquote_end'
            });

            continue;
        }

        // list
        if(cap = this.rules.list.exec(src)) {
            src = src.substring(cap[0].length);
            bull = cap[2];

            this.tokens.push({
                type: 'list_start',
                ordered: bull.length > 1
            });

            // Get each top-level item.
            cap = cap[0].match(this.rules.item);

            next = false;
            l = cap.length;
            i = 0;

            for(; i < l; i++) {
                item = cap[i];

                // Remove the list item's bullet
                // so it is seen as the next token.
                space = item.length;
                item = item.replace(/^ *([*+-]|\d+\.) +/, '');

                // Outdent whatever the
                // list item contains. Hacky.
                if(~item.indexOf('\n ')) {
                    space -= item.length;
                    item = !this.options.pedantic ? item.replace(new RegExp('^ {1,' + space + '}', 'gm'), '') : item.replace(/^ {1,4}/gm, '');
                }

                // Determine whether the next list item belongs here.
                // Backpedal if it does not belong in this list.
                if(this.options.smartLists && i !== l - 1) {
                    b = block.bullet.exec(cap[i + 1])[0];
                    if(bull !== b && !(bull.length > 1 && b.length > 1)) {
                        src = cap.slice(i + 1).join('\n') + src;
                        i = l - 1;
                    }
                }

                // Determine whether item is loose or not.
                // Use: /(^|\n)(?! )[^\n]+\n\n(?!\s*$)/
                // for discount behavior.
                loose = next || /\n\n(?!\s*$)/.test(item);
                if(i !== l - 1) {
                    next = item.charAt(item.length - 1) === '\n';
                    if(!loose) loose = next;
                }

                this.tokens.push({
                    type: loose ? 'loose_item_start' : 'list_item_start'
                });

                // Recurse.
                this.token(item, false, bq);

                this.tokens.push({
                    type: 'list_item_end'
                });
            }

            this.tokens.push({
                type: 'list_end'
            });

            continue;
        }

        // html
        if(cap = this.rules.html.exec(src)) {
            src = src.substring(cap[0].length);
            this.tokens.push({
                type: this.options.sanitize ? 'paragraph' : 'html',
                pre: cap[1] === 'pre' || cap[1] === 'script' || cap[1] === 'style',
                text: cap[0]
            });
            continue;
        }

        // def
        if((!bq && top) && (cap = this.rules.def.exec(src))) {
            src = src.substring(cap[0].length);
            this.tokens.links[cap[1].toLowerCase()] = {
                href: cap[2],
                title: cap[3]
            };
            continue;
        }

        // table (gfm)
        if(top && (cap = this.rules.table.exec(src))) {
            src = src.substring(cap[0].length);

            item = {
                type: 'table',
                header: cap[1].replace(/^ *| *\| *$/g, '').split(/ *\| */),
                align: cap[2].replace(/^ *|\| *$/g, '').split(/ *\| */),
                cells: cap[3].replace(/(?: *\| *)?\n$/, '').split('\n')
            };

            for(i = 0; i < item.align.length; i++) {
                if(/^ *-+: *$/.test(item.align[i])) {
                    item.align[i] = 'right';
                } else if(/^ *:-+: *$/.test(item.align[i])) {
                    item.align[i] = 'center';
                } else if(/^ *:-+ *$/.test(item.align[i])) {
                    item.align[i] = 'left';
                } else {
                    item.align[i] = null;
                }
            }

            for(i = 0; i < item.cells.length; i++) {
                item.cells[i] = item.cells[i].replace(/^ *\| *| *\| *$/g, '').split(/ *\| */);
            }

            this.tokens.push(item);

            continue;
        }

        // top-level paragraph
        if(top && (cap = this.rules.paragraph.exec(src))) {
            src = src.substring(cap[0].length);
            this.tokens.push({
                type: 'paragraph',
                text: cap[1].charAt(cap[1].length - 1) === '\n' ? cap[1].slice(0, -1) : cap[1]
            });
            continue;
        }

        // text
        if(cap = this.rules.text.exec(src)) {
            // Top-level should never reach here.
            src = src.substring(cap[0].length);
            this.tokens.push({
                type: 'text',
                text: cap[0]
            });
            continue;
        }

        if(src) {
            throw new Error('Infinite loop on byte: ' + src.charCodeAt(0));
        }
    }

    return this.tokens;
};