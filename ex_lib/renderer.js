var helper = require('./helper');
var escape = helper.escape;
var unescape = helper.unescape;
/**
 * Renderer
 */

function Renderer(options) {
    this.options = options || {};
}
module.exports = Renderer;

Renderer.prototype.code = function(code, lang, escaped) {
    if(this.options.highlight) {
        var out = this.options.highlight(code, lang);
        if(out != null && out !== code) {
            escaped = true;
            code = out;
        }
    }

    if(!lang) {
        return '<pre><code>' + (escaped ? code : escape(code, true)) + '\n</code></pre>';
    }

    return '<pre><code class="' + this.options.langPrefix + escape(lang, true) + '">' + (escaped ? code : escape(code, true)) + '\n</code></pre>\n';
};

Renderer.prototype.blockquote = function(quote) {
    return '<blockquote>\n' + quote + '</blockquote>\n';
};

Renderer.prototype.html = function(html) {
    return html;
};

Renderer.prototype.heading = function(text, level, raw) {
    return '<h' + level + ' id="' + this.options.headerPrefix + raw.toLowerCase().replace(/[^\w]+/g, '-') + '">' + text + '</h' + level + '>\n';
};

Renderer.prototype.section = (function() {
    var id = 1;
    return function(text) {
        return '<section class="api-section" id="' + ('api-section-' + (id++)) + '">' + text + '</section>';
    };
})();

Renderer.prototype.hr = function() {
    return this.options.xhtml ? '<hr/>\n' : '<hr>\n';
};

Renderer.prototype.list = function(body, ordered) {
    var type = ordered ? 'ol' : 'ul';
    return '<' + type + '>\n' + body + '</' + type + '>\n';
};

Renderer.prototype.listitem = function(text) {
    return '<li>' + text + '</li>\n';
};

Renderer.prototype.paragraph = function(text) {
    return '<p>' + text + '</p>\n';
};

Renderer.prototype.table = function(header, body) {
    return '<table>\n' + '<thead>\n' + header + '</thead>\n' + '<tbody>\n' + body + '</tbody>\n' + '</table>\n';
};

Renderer.prototype.tablerow = function(content) {
    return '<tr>\n' + content + '</tr>\n';
};

Renderer.prototype.tablecell = function(content, flags) {
    var type = flags.header ? 'th' : 'td';
    var tag = flags.align ? '<' + type + ' style="text-align:' + flags.align + '">' : '<' + type + '>';
    return tag + content + '</' + type + '>\n';
};

// span level renderer
Renderer.prototype.strong = function(text) {
    return '<strong>' + text + '</strong>';
};

Renderer.prototype.em = function(text) {
    return '<em>' + text + '</em>';
};

Renderer.prototype.codespan = function(text) {
    return '<code>' + text + '</code>';
};

Renderer.prototype.br = function() {
    return this.options.xhtml ? '<br/>' : '<br>';
};

Renderer.prototype.del = function(text) {
    return '<del>' + text + '</del>';
};

Renderer.prototype.link = function(href, title, text) {
    if(this.options.sanitize) {
        try {
            var prot = decodeURIComponent(unescape(href)).replace(/[^\w:]/g, '').toLowerCase();
        } catch(e) {
            return '';
        }
        if(prot.indexOf('javascript:') === 0) {
            return '';
        }
    }
    var out = '<a href="' + href + '"';
    if(title) {
        out += ' title="' + title + '"';
    }
    out += '>' + text + '</a>';
    return out;
};

Renderer.prototype.image = function(href, title, text) {
    var out = '<img src="' + href + '" alt="' + text + '"';
    if(title) {
        out += ' title="' + title + '"';
    }
    out += this.options.xhtml ? '/>' : '>';
    return out;
};
