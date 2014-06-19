var InlineLexer = require('./inline-lexer');
var Renderer = require('./renderer');
var defaults = require('./default-config');
/**
 * Parsing & Compiling
 */

function Parser(options) {
    this.tokens = [];
    this.token = null;
    this.options = options || defaults;
    this.options.renderer = this.options.renderer || new Renderer;
    this.renderer = this.options.renderer;
    this.renderer.options = this.options;
}
module.exports = Parser;

/**
 * Static Parse Method
 */

Parser.parse = function(src, options, renderer) {
    var parser = new Parser(options, renderer);
    return parser.parse(src);
};

/**
 * Parse Loop
 */

Parser.prototype.parse = function(src) {
    this.inline = new InlineLexer(src.links, this.options, this.renderer);
    this.tokens = src.reverse();

    var out = '';
    while(this.next()) {
        out += this.tok();
    }

    return out;
};

/**
 * Next Token
 */

Parser.prototype.next = function() {
    return this.token = this.tokens.pop();
};

/**
 * Preview Next Token
 */

Parser.prototype.peek = function() {
    return this.tokens[this.tokens.length - 1] || 0;
};

/**
 * Parse Text Tokens
 */

Parser.prototype.parseText = function() {
    var body = this.token.text;

    while(this.peek().type === 'text') {
        body += '\n' + this.next().text;
    }

    return this.inline.output(body);
};

/**
 * Parse Current Token
 */

Parser.prototype.tok = function() {
    switch(this.token.type) {
        case 'space':
        {
            return '';
        }
        case 'hr':
        {
            return this.renderer.hr();
        }
        case 'heading':
        {
            return this.renderer.heading(this.inline.output(this.token.text), this.token.depth, this.token.text);
        }
        case 'code':
        {
            return this.renderer.code(this.token.text, this.token.lang, this.token.escaped);
        }
        case 'section':
        {
            var text = this.token.text;
            var rule = ['method', 'api', 'url', 'request', 'response', 'desc', 'params'];
            var reg = /(?: *\- *(method|api|url|response|request|desc|params) *: *)/g;
            var arr = text.split(reg);
            var item;
            var data = {};
            (function() {
                for(var i = 0, len = rule.length; i < len; i++) {
                    data[rule[i]] = '';
                }
            })();
            while(arr.length) {
                item = arr.shift();
                if(item) {
                    if(item === 'method') {
                        data[item] = '<span class="api-method">' + arr.shift().trim() + '</span>';
                    } else if(item === 'api') {
                        data[item] = '<span class="api-rule">' + this.inline.output(arr.shift().trim()) + '</span>';
                    } else if(item === 'url') {
                        data[item] = '<div class="api-url">';
                        data[item] += '<ul class="actions"><li><a class="button response-btn"><b>Response</b></a></li></ul>';
                        data[item] += '<code>' + arr.shift() + '</code></div>';
                    } else if(item === 'response' || item === 'request') {
                        var html = '<div class="api-' + item;
                        if (item === 'response') {
                            html += ' hide';
                        }
                        html += '">';
                        html += '<div class="api-seperate"><strong>' + item.toUpperCase() + '</strong><i></i></div>';
                        html += this.renderer.code(arr.shift(), 'json', this.token.escaped) + '</div>';
                        data[item] = html;
                    } else if(item === 'desc') {
                        data[item] = '<div class="api-description">' + this.renderer.paragraph(this.inline.output(arr.shift().trim())) + '</div>';
                    } else if(item === 'params') {
                        data[item] = (function() {
                            var lines = arr.shift().trim().split(/\n+/g);
                            var maps = ['<div class="api-parameter"><ul>'];
                            for(var i = 0, len = lines.length; i < len; i++) {
                                var d = lines[i].trim().split(/\s+/);
                                var key = d.shift().trim();
                                var val = d.join('').trim();
                                maps.push('<li><em>' + key + '</em><span>' + val + '</span></li>');
                            }
                            maps.push('</ul></div>');
                            return maps.join('');
                        }).call(this);
                    }
                }
            }

            var html = '<header><h2>' + data.method + data.api + '</h2></header>' + data.url + data.response + data.request + data.desc + data.params

            return this.renderer.section(html);
        }
        case 'table':
        {
            var header = ''
                , body = ''
                , i
                , row
                , cell
                , flags
                , j;

            // header
            cell = '';
            for(i = 0; i < this.token.header.length; i++) {
                flags = { header: true, align: this.token.align[i] };
                cell += this.renderer.tablecell(this.inline.output(this.token.header[i]), { header: true, align: this.token.align[i] });
            }
            header += this.renderer.tablerow(cell);

            for(i = 0; i < this.token.cells.length; i++) {
                row = this.token.cells[i];

                cell = '';
                for(j = 0; j < row.length; j++) {
                    cell += this.renderer.tablecell(this.inline.output(row[j]), { header: false, align: this.token.align[j] });
                }

                body += this.renderer.tablerow(cell);
            }
            return this.renderer.table(header, body);
        }
        case 'blockquote_start':
        {
            var body = '';

            while(this.next().type !== 'blockquote_end') {
                body += this.tok();
            }

            return this.renderer.blockquote(body);
        }
        case 'list_start':
        {
            var body = ''
                , ordered = this.token.ordered;

            while(this.next().type !== 'list_end') {
                body += this.tok();
            }

            return this.renderer.list(body, ordered);
        }
        case 'list_item_start':
        {
            var body = '';

            while(this.next().type !== 'list_item_end') {
                body += this.token.type === 'text' ? this.parseText() : this.tok();
            }

            return this.renderer.listitem(body);
        }
        case 'loose_item_start':
        {
            var body = '';

            while(this.next().type !== 'list_item_end') {
                body += this.tok();
            }

            return this.renderer.listitem(body);
        }
        case 'html':
        {
            var html = !this.token.pre && !this.options.pedantic ? this.inline.output(this.token.text) : this.token.text;
            return this.renderer.html(html);
        }
        case 'paragraph':
        {
            return this.renderer.paragraph(this.inline.output(this.token.text));
        }
        case 'text':
        {
            return this.renderer.paragraph(this.parseText());
        }
    }
};
