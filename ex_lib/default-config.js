var Renderer = require('./renderer');
var defaults = {
    gfm: true,
    ex: true,
    tables: true,
    breaks: false,
    pedantic: false,
    sanitize: false,
    smartLists: false,
    silent: false,
    highlight: null,
    langPrefix: 'lang-',
    smartypants: false,
    headerPrefix: '',
    renderer: new Renderer,
    xhtml: false
};

module.exports = defaults;