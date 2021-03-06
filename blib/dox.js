var fs = require('fs');
var path = require('path');
var ejs = require('ejs');
var StringDecoder = require('string_decoder').StringDecoder;
var decoder = new StringDecoder('utf8');
var markdown = require('../ex_lib/markdown');
var dox = require('dox');
var ncp = require('ncp').ncp;

var templates;
var getTemplates = function (skin, input) {
    if (templates) {
        return templates;
    }
    var section;
    var api;
    var doc;
    var configure;
    if (input) {
        section = fs.readFileSync(path.join(input + '/section.html'), 'utf8');
        api = fs.readFileSync(path.join(input + '/api.html'), 'utf8');
        doc = fs.readFileSync(path.join(input + '/doc.html'), 'utf8');
        configure = require(path.join(input + '/doxmate.json'));
    } else {
        section = fs.readFileSync(path.join(__dirname, '../templates/' + skin + '/section.html'), 'utf8');
        api = fs.readFileSync(path.join(__dirname, '../templates/' + skin + '/api.html'), 'utf8');
        doc = fs.readFileSync(path.join(__dirname, '../templates/' + skin + '/doc.html'), 'utf8');
        configure = require(path.join(__dirname, '../templates/' + skin + '/doxmate.json'));
    }

    templates = {
        'section': section,
        'api': api,
        'doc': doc,
        'configuration': configure
    };
    return templates;
};


var readFolder = (function () {
    function iterator(item, tree) {
        var type = typeof item;
        var filePath;
        var p = null;
        if (type === 'string') { // 初始化
            filePath = item;
        } else if (type === 'object') {
            filePath = item.path;
            p = item;
        }
        var stats = fs.statSync(filePath);
        if (stats.isDirectory()) {
            var files = fs.readdirSync(filePath);
            // 排序
            files.sort(function (a, b) {
                var n1 = a.match(/^(\d+)_/);
                var n2 = b.match(/^(\d+)_/);
                n1 = n1 === null ? Number.MAX_VALUE : n1;
                n2 = n2 === null ? Number.MAX_VALUE : n2;
                return n1 > n2;
            });

            files.forEach(function (f, i) {
                var fp = path.join(filePath, f);
                var stats = fs.statSync(fp);
                var isDirectory = stats.isDirectory();
                var item = {// 转为格式化对象
                    name: f,
                    xname: f.replace(/^\d+_/, '').replace(/\.(\w+)$/, ''),
                    path: fp,
                    isDirectory: isDirectory,
                    parent: p || null,
                    children: []
                };
                if (f !== '.DS_Store') {
                    if (p) {
                        p.children.push(item);
                    } else {
                        tree.push(item);
                    }
                }
                if (isDirectory) {
                    readFolder(item);
                }
            });
        } else {
            return;
        }
    }

    return function (item) {
        var tree = [];
        try {
            iterator(item, tree);
        } catch (e) {
        } finally {
            return tree;
        }
    };
})();

/**
 * 处理目录，生成文档
 * @param {String} input 输入目录路径
 * @param {String} output 输出目录路径
 */
exports.process = function (input, output, skin, dir, enviro) {
    var obj = require(path.resolve(input, 'package.json'));
    var config = require(path.resolve());
    var host = '';
    if (enviro === 'product') {
        host = obj.link.host + '/' + output.split('/').pop()
    } else {
        obj.link.host = obj.link.dev_host;
        host = obj.link.dev_host + '/' + output.split('/').pop()
    }


    var themeDir;

    if (fs.existsSync(path.resolve(input, 'doxmate-templates/' + skin))) {
        themeDir = path.resolve(input, 'doxmate-templates/' + skin);
        obj.options = getTemplates(skin, themeDir).configuration;
    } else {
        obj.options = getTemplates(skin).configuration;
    }

    if (themeDir) {
        obj.filename = path.join(themeDir + '/index.html');
    } else {
        obj.filename = path.join(__dirname, '../templates/' + skin + '/index.html');
    }
    var libDir = path.join(input, dir || 'doc');
    var folders = readFolder(libDir);
    //渲染首页
    var doc = getTemplates(skin).doc;
    obj.indexs = folders;
    //补全folders的url
    var fillUrls = (function (list) {
        list.forEach(function (item) {
            if (item.children.length > 0) {
                item.children.forEach(function (sitem) {
                    if (sitem.children.length === 0) {
                        sitem['url'] = (sitem.path.replace(/\.(\w+)$/, '') + '.html').replace(libDir, host);
                    } else {
                        fillUrls(sitem.children);
                    }
                });
            } else {
                item['url'] = (item.path.replace(/\.(\w+)$/, '') + '.html').replace(libDir, host);
            }
        });
    })(obj.indexs);
    //输出页面
    var iterator = (function (list) {
        list.forEach(function (item) {
            if (item.children.length > 0) {
                var folderUrl = (item.path.replace(/\.(\w+)$/, '')).replace(libDir, output);
                if (folderUrl.substr(0, 1) == '_') {
                    //以下划线开始的不解析
                } else {
                    folderUrl = folderUrl.replace(/[0-9]{2}_/g, '');
                    if (!fs.existsSync(folderUrl)) {
                        fs.mkdirSync(folderUrl);
                    }
                    item.children.forEach(function (sitem) {
                        if (sitem.children.length === 0) {
                            var htmlUrl = (sitem.path.replace(/\.(\w+)$/, '') + '.html').replace(libDir, output);
                            item['active'] = true;
                            sitem['active'] = true;
                            sitem['url'] = (sitem.path.replace(/\.(\w+)$/, '') + '.html').replace(libDir, host);
                            sitem['url'] = sitem['url'].replace(/[0-9]{2}_/g, '');//去掉00_
//                            console.log(sitem);
                            var text = decoder.write(fs.readFileSync(sitem.path));
                            obj.content = markdown(text);
                            htmlUrl = htmlUrl.replace(/[0-9]{2}_/g, '');//去掉00_
//                            obj.config = config;
                            obj.config = obj.options.i18n;
                            fs.writeFileSync(htmlUrl, ejs.render(doc, obj), 'utf8');
                            item['active'] = false;
                            sitem['active'] = false;
                        } else {
                            iterator(sitem.children);
                        }
                    });
                }
            } else {
                var htmlUrl = (item.path.replace(/\.(\w+)$/, '') + '.html').replace(libDir, output);
                item['active'] = true;
                item['url'] = (item.path.replace(/\.(\w+)$/, '') + '.html').replace(libDir, host);
                item['url'] = item['url'].replace(/[0-9]{2}_/g, '');//去掉00_
//                console.log(item['url']);
                var text = decoder.write(fs.readFileSync(item.path));
                obj.content = markdown(text);
                obj.config = obj.options.i18n;
                htmlUrl = htmlUrl.replace(/[0-9]{2}_/g, '');//去掉00_
                fs.writeFileSync(htmlUrl, ejs.render(doc, obj), 'utf8');
                item['active'] = false;
            }
        });
    })(obj.indexs);
};