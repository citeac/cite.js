
/**
 * Dependencies
 */

var path = require('path');
var join = path.join;
var extname = path.extname;
var fs = require('fs');
var read = fs.readFileSync;
var dox = require('dox').parseComments;
var Style = require('./style');


/**
 * Expose StyleGuide
 */

module.exports = exports = StyleGuide;


/**
 * Initialize a new StyleGuide
 *
 * @api public
 */

function StyleGuide() {
  if (!(this instanceof StyleGuide)) return new StyleGuide();
  this.styles = {};
}


/**
 * Load config JSON. Properties accepted are
 * `name`, `title`, and `version`
 *
 * @param {object} config
 * @return {Self}
 * @api public
 */

StyleGuide.prototype.config = function(config){
  this._config = config;
  this.id = config.id;
  this.title = config.title;
  this.version = config.version;
  return this;
}


/**
 * path
 *
 * @return {Self}
 * @api public
 */

StyleGuide.prototype.path = function(path){
  this._path = path;
  return this;
}


/**
 * Add a `sourceType` to the guide.
 *
 * @param {SourceType} sourceType
 * @return {Self}
 * @api public
 */

StyleGuide.prototype.add = function(type, filename){
  var ext = extname(filename);
  if (!ext) filename += '.js'
  filename = join(this._path, filename);

  var styles = require(filename);
  var dox = passDox(filename);

  for (var key in styles) {
    var fn = styles[key];
    var obj = dox ? dox.shift() : {};

    if (this.styles[obj.id]){
      throw error('must have a UNIQUE id', filename, obj.id, obj.code)
    }

    if (!obj.id) {
      throw error('must have a (unique) id', filename, obj.title || '', obj.code);
    }

    if (!obj.title) {
      throw error('must have a title', filename, obj.id || '', obj.code);
    }

    obj.sourceType = type;
    obj.fn = fn;

    this.styles[obj.id] = obj;
  }

  return this;
}


/**
 * Find specific style by `type`, and `title`
 *
 * @api public
 */

StyleGuide.prototype.find = function(id){
  var style = this.styles[id];
  if (!style) {
    throw new Error('no style with id "' + id + '" found');
  }
  return style;
}


/**
 * run
 *
 * @api public
 */

StyleGuide.prototype.run = function(obj, data){
  var style = new Style(data);
  obj.fn.call(style);
  style.stringify();
  return style;
}


/**
 * Pass in the current file so that documentation
 * can be indexed and cleaned up.
 *
 * @param {String} filename
 * @api private
 */

function passDox(filename){
  var file = read(filename, 'utf8');
  var comments = dox(file);
  var ret = [];
  var reg = new RegExp('\<p\>(.+?)\<\/p\>');

  comments.forEach(function(c){
    if (c.ignore) return;
    var desc = c.description;

    // id
    var id = (c.tags[0] || {}).string;

    // title
    var t = reg.exec(desc.summary) || [];
    var title = (t[1] || '').replace('<br />', ' ');

    var obj = {
      id: id,
      title:title,
      description: desc.body,
      code: c.code,
      tags: c.tags
    }

    ret.push(obj);
  })

  return ret;
}


/**
 * finds stack for error
 *
 * @return {Self}
 * @api public
 */

function error(msg, filename, id, code){
  var e = new Error(msg);
  e.stack = ' ' + msg.toUpperCase() + '\n\n * ' + filename + '\n * ' + id + '\n\n' + code + '\n\n';
  return e;
}