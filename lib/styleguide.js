
/**
 * Dependencies
 */

var path = require('path');
var join = path.join;
var extname = path.extname;
var fs = require('fs');
var read = fs.readFileSync;
var dox = require('dox').parseComments;
var Type = require('./type');


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
  this.types = {};
  this.defaults = {};
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
 * Add a bunch of types to the guide
 *
 * @param {String} filename
 * @return {Self}
 * @api public
 */

StyleGuide.prototype.load = function(filename){
  var ext = extname(filename);
  if (!ext) filename += '.js'
  filename = join(this._path, filename);

  var doc = require(filename);
  var dox = passDox(filename);

  for (var key in doc) {
    var fn = doc[key];
    var obj = dox ? dox.shift() : {};
    obj.filename = filename;
    this.add(obj, fn);
  }

  return this;
}


/**
 * Add type
 *
 * @param {String} str
 * @return {Self}
 * @api public
 */

StyleGuide.prototype.add = function(opts, fn){
  if (this.types[opts.id]){
    throw error('must have a UNIQUE id', opts.filename, opts.id, opts.code)
  }

  if (!opts.id) {
    throw error('must have a (unique) id', opts.filename, opts.title, opts.code);
  }

  if (!opts.title) {
    throw error('must have a title', opts.filename, opts.id, opts.code);
  }

  if (!opts.types || !opts.types.length) {
    throw error('must have a type or default', opts.filename, opts.id, opts.code);
  }

  var self = this;
  opts.types.forEach(function(type){
    if (!type.default) return;

    if (self.defaults[type.id]) {
      throw error('must have only 1 default for type ' + type.id, opts.filename, opts.id, opts.code);
    }

    self.defaults[type.id] = true;
  })

  opts.fn = fn;
  this.types[opts.id] = opts;
}



/**
 * Find specific style by `type`, and `title`
 *
 * @api public
 */

StyleGuide.prototype.find = function(id){
  var type = this.types[id];
  if (!type) {
    throw new Error('no style with id "' + id + '" found');
  }
  return type;
}


/**
 * run
 *
 * @api public
 */

StyleGuide.prototype.run = function(obj, data){
  var type = new Type(data);
  obj.fn.call(type);
  type.stringify();
  return type;
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

    var types = [];
    var tags = {};

    c.tags.forEach(function(tag){
      if (tag.type == 'type') {
        tag.types = tag.types.map(function(type){
          return {id: type};
        })
        types = types.concat(tag.types)
        return;
      }

      if (tag.type == 'default') {
        types.push({id: tag.string, 'default': true})
        return;
      }

      tags[tag.type] = tag.string;
    })

    // console.log(tags)

    // title
    var t = reg.exec(desc.summary) || [];
    var title = (t[1] || '').replace('<br />', ' ');

    var obj = {
      id: tags.id,
      title: title,
      types: types,
      description: desc.body,
      code: c.code,
      tags: tags
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
  e.stack = ' ' + msg.toUpperCase() + '\n\n * ' + filename || '' + '\n * ' + id || '' + '\n\n' + code || '' + '\n\n';
  return e;
}