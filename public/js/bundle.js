(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

/**
 * Expose `Emitter`.
 */

module.exports = Emitter;

/**
 * Initialize a new `Emitter`.
 *
 * @api public
 */

function Emitter(obj) {
  if (obj) return mixin(obj);
};

/**
 * Mixin the emitter properties.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

function mixin(obj) {
  for (var key in Emitter.prototype) {
    obj[key] = Emitter.prototype[key];
  }
  return obj;
}

/**
 * Listen on the given `event` with `fn`.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.on =
Emitter.prototype.addEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};
  (this._callbacks[event] = this._callbacks[event] || [])
    .push(fn);
  return this;
};

/**
 * Adds an `event` listener that will be invoked a single
 * time then automatically removed.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.once = function(event, fn){
  var self = this;
  this._callbacks = this._callbacks || {};

  function on() {
    self.off(event, on);
    fn.apply(this, arguments);
  }

  on.fn = fn;
  this.on(event, on);
  return this;
};

/**
 * Remove the given callback for `event` or all
 * registered callbacks.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.off =
Emitter.prototype.removeListener =
Emitter.prototype.removeAllListeners =
Emitter.prototype.removeEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};

  // all
  if (0 == arguments.length) {
    this._callbacks = {};
    return this;
  }

  // specific event
  var callbacks = this._callbacks[event];
  if (!callbacks) return this;

  // remove all handlers
  if (1 == arguments.length) {
    delete this._callbacks[event];
    return this;
  }

  // remove specific handler
  var cb;
  for (var i = 0; i < callbacks.length; i++) {
    cb = callbacks[i];
    if (cb === fn || cb.fn === fn) {
      callbacks.splice(i, 1);
      break;
    }
  }
  return this;
};

/**
 * Emit `event` with the given args.
 *
 * @param {String} event
 * @param {Mixed} ...
 * @return {Emitter}
 */

Emitter.prototype.emit = function(event){
  this._callbacks = this._callbacks || {};
  var args = [].slice.call(arguments, 1)
    , callbacks = this._callbacks[event];

  if (callbacks) {
    callbacks = callbacks.slice(0);
    for (var i = 0, len = callbacks.length; i < len; ++i) {
      callbacks[i].apply(this, args);
    }
  }

  return this;
};

/**
 * Return array of callbacks for `event`.
 *
 * @param {String} event
 * @return {Array}
 * @api public
 */

Emitter.prototype.listeners = function(event){
  this._callbacks = this._callbacks || {};
  return this._callbacks[event] || [];
};

/**
 * Check if this emitter has `event` handlers.
 *
 * @param {String} event
 * @return {Boolean}
 * @api public
 */

Emitter.prototype.hasListeners = function(event){
  return !! this.listeners(event).length;
};

},{}],2:[function(require,module,exports){
(function (global){
(function (module) {"use strict";

  //!(C) WebReflection - Mit Style License
  // size and performances oriented polyfill for ES6
  // WeakMap, Map, and Set
  // compatible with node.js, Rhino, any browser
  // does not implement default vaule during wm.get()
  // since ES.next won't probably do that
  // use wm.has(o) ? wm.get(o) : d3fault; instead

  // WeakMap(void):WeakMap
  function WeakMap() {

    // private references holders
    var
      keys = [],
      values = []
    ;

    // returns freshly new created
    // instanceof WeakMap in any case
    return create(WeakMapPrototype, {
      // WeakMap#delete(key:void*):boolean
      "delete": {value: bind.call(sharedDel, NULL, TRUE, keys, values)},
      //:was WeakMap#get(key:void*[, d3fault:void*]):void*
      // WeakMap#get(key:void*):void*
      get:      {value: bind.call(sharedGet, NULL, TRUE, keys, values)},
      // WeakMap#has(key:void*):boolean
      has:      {value: bind.call(sharedHas, NULL, TRUE, keys, values)},
      // WeakMap#set(key:void*, value:void*):void
      set:      {value: bind.call(sharedSet, NULL, TRUE, keys, values)}
    });

  }

  // Map(void):Map
  function Map() {

    // private references holders
    var
      keys = [],
      values = []
    ;

    // returns freshly new created
    // instanceof WeakMap in any case
    return create(MapPrototype, {
      // Map#delete(key:void*):boolean
      "delete": {value: bind.call(sharedDel, NULL, FALSE, keys, values)},
      //:was Map#get(key:void*[, d3fault:void*]):void*
      // Map#get(key:void*):void*
      get:      {value: bind.call(sharedGet, NULL, FALSE, keys, values)},
      // Map#has(key:void*):boolean
      has:      {value: bind.call(sharedHas, NULL, FALSE, keys, values)},
      // Map#set(key:void*, value:void*):void
      set:      {value: bind.call(sharedSet, NULL, FALSE, keys, values)}
      /*,
      // Map#size(void):number === Mozilla only so far
      size:     {value: bind.call(sharedSize, NULL, keys)},
      // Map#keys(void):Array === not in specs
      keys:     {value: boundSlice(keys)},
      // Map#values(void):Array === not in specs
      values:   {value: boundSlice(values)},
      // Map#iterate(callback:Function, context:void*):void ==> callback.call(context, key, value, index) === not in specs
      iterate:  {value: bind.call(sharedIterate, NULL, FALSE, keys, values)}
      //*/
    });

  }

  // Set(void):Set
  /**
   * to be really honest, I would rather pollute Array.prototype
   * in order to have Set like behavior
   * Object.defineProperties(Array.prototype, {
   *   add: {value: function add(value) {
   *     return -1 < this.indexOf(value) && !!this.push(value);
   *   }}
   *   has: {value: function has(value) {
   *     return -1 < this.indexOf(value);
   *   }}
   *   delete: {value: function delete(value) {
   *     var i = this.indexOf(value);
   *     return -1 < i && !!this.splice(i, 1);
   *   }}
   * });
   * ... anyway ...
   */
  function Set() {
    var
      keys = [],  // placeholder used simply to recycle functions
      values = [],// real storage
      has = bind.call(sharedHas, NULL, FALSE, values, keys)
    ;
    return create(SetPrototype, {
      // Set#delete(value:void*):boolean
      "delete": {value: bind.call(sharedDel, NULL, FALSE, values, keys)},
      // Set#has(value:void*):boolean
      has:      {value: has},
      // Set#add(value:void*):boolean
      add:      {value: bind.call(Set_add, NULL, FALSE, has, values)}
      /*,
      // Map#size(void):number === Mozilla only
      size:     {value: bind.call(sharedSize, NULL, values)},
      // Set#values(void):Array === not in specs
      values:   {value: boundSlice(values)},
      // Set#iterate(callback:Function, context:void*):void ==> callback.call(context, value, index) === not in specs
      iterate:  {value: bind.call(Set_iterate, NULL, FALSE, NULL, values)}
      //*/
    });
  }

  // common shared method recycled for all shims through bind
  function sharedDel(objectOnly, keys, values, key) {
    if (sharedHas(objectOnly, keys, values, key)) {
      keys.splice(i, 1);
      values.splice(i, 1);
    }
    // Aurora here does it while Canary doesn't
    return -1 < i;
  }

  function sharedGet(objectOnly, keys, values, key/*, d3fault*/) {
    return sharedHas(objectOnly, keys, values, key) ? values[i] : undefined; //d3fault;
  }

  function sharedHas(objectOnly, keys, values, key) {
    if (objectOnly && key !== Object(key))
      throw new TypeError("not a non-null object")
    ;
    i = betterIndexOf.call(keys, key);
    return -1 < i;
  }

  function sharedSet(objectOnly, keys, values, key, value) {
    /* return */sharedHas(objectOnly, keys, values, key) ?
      values[i] = value
      :
      values[keys.push(key) - 1] = value
    ;
  }

  /* keys, values, and iterate related methods
  function boundSlice(values) {
    return function () {
      return slice.call(values);
    };
  }

  function sharedSize(keys) {
    return keys.length;
  }

  function sharedIterate(objectOnly, keys, values, callback, context) {
    for (var
      k = slice.call(keys), v = slice.call(values),
      i = 0, length = k.length;
      i < length; callback.call(context, k[i], v[i], i++)
    );
  }

  function Set_iterate(objectOnly, keys, values, callback, context) {
    for (var
      v = slice.call(values),
      i = 0, length = v.length;
      i < length; callback.call(context, v[i], i++)
    );
  }
  //*/

  // Set#add recycled through bind per each instanceof Set
  function Set_add(objectOnly, has, values, value) {
    /*return */(!has(value) && !!values.push(value));
  }

  // a more reliable indexOf
  function betterIndexOf(value) {
    if (value != value || value === 0) {
      for (i = this.length; i-- && !is(this[i], value););
    } else {
      i = indexOf.call(this, value);
    }
    return i;
  }

  // need for an empty constructor ...
  function Constructor(){}  // GC'ed if !!Object.create
  // ... so that new WeakMapInstance and new WeakMap
  // produces both an instanceof WeakMap

  var
    // shortcuts and ...
    NULL = null, TRUE = true, FALSE = false,
    notInNode = module == "undefined",
    window = notInNode ? this : global,
    module = notInNode ? {} : exports,
    Object = window.Object,
    WeakMapPrototype = WeakMap.prototype,
    MapPrototype = Map.prototype,
    SetPrototype = Set.prototype,
    defineProperty = Object.defineProperty,
    slice = [].slice,

    // Object.is(a, b) shim
    is = Object.is || function (a, b) {
      return a === b ?
        a !== 0 || 1 / a == 1 / b :
        a != a && b != b
      ;
    },

    // partial polyfill for this aim only
    bind = WeakMap.bind || function bind(context, objectOnly, keys, values) {
      // partial fast ad-hoc Function#bind polyfill if not available
      var callback = this;
      return function bound(key, value) {
        return callback.call(context, objectOnly, keys, values, key, value);
      };
    },

    create = Object.create || function create(proto, descriptor) {
      // partial ad-hoc Object.create shim if not available
      Constructor.prototype = proto;
      var object = new Constructor, key;
      for (key in descriptor) {
        object[key] = descriptor[key].value;
      }
      return object;
    },

    indexOf = [].indexOf || function indexOf(value) {
      // partial fast Array#indexOf polyfill if not available
      for (i = this.length; i-- && this[i] !== value;);
      return i;
    },

    undefined,
    i // recycle ALL the variables !
  ;

  // ~indexOf.call([NaN], NaN) as future possible feature detection

  // used to follow FF behavior where WeakMap.prototype is a WeakMap itself
  WeakMap.prototype = WeakMapPrototype = WeakMap();
  Map.prototype = MapPrototype = Map();
  Set.prototype = SetPrototype = Set();

  // assign it to the global context
  // if already there, e.g. in node, export native
  window.WeakMap = module.WeakMap = window.WeakMap || WeakMap;
  window.Map = module.Map = window.Map || Map;
  window.Set = module.Set = window.Set || Set;

  /* probably not needed, add a slash to ensure non configurable and non writable
  if (defineProperty) {
    defineProperty(window, "WeakMap", {value: WeakMap});
    defineProperty(window, "Map", {value: Map});
    defineProperty(window, "Set", {value: Set});
  }
  //*/

  // that's pretty much it

}.call(
  this,
  typeof exports
));
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],3:[function(require,module,exports){

/**
 * Reduce `arr` with `fn`.
 *
 * @param {Array} arr
 * @param {Function} fn
 * @param {Mixed} initial
 *
 * TODO: combatible error handling?
 */

module.exports = function(arr, fn, initial){  
  var idx = 0;
  var len = arr.length;
  var curr = arguments.length == 3
    ? initial
    : arr[idx++];

  while (idx < len) {
    curr = fn.call(null, curr, arr[idx], ++idx, arr);
  }
  
  return curr;
};
},{}],4:[function(require,module,exports){
/**
 * Module dependencies.
 */

var Emitter = require('emitter');
var reduce = require('reduce');

/**
 * Root reference for iframes.
 */

var root = 'undefined' == typeof window
  ? this
  : window;

/**
 * Noop.
 */

function noop(){};

/**
 * Check if `obj` is a host object,
 * we don't want to serialize these :)
 *
 * TODO: future proof, move to compoent land
 *
 * @param {Object} obj
 * @return {Boolean}
 * @api private
 */

function isHost(obj) {
  var str = {}.toString.call(obj);

  switch (str) {
    case '[object File]':
    case '[object Blob]':
    case '[object FormData]':
      return true;
    default:
      return false;
  }
}

/**
 * Determine XHR.
 */

function getXHR() {
  if (root.XMLHttpRequest
    && ('file:' != root.location.protocol || !root.ActiveXObject)) {
    return new XMLHttpRequest;
  } else {
    try { return new ActiveXObject('Microsoft.XMLHTTP'); } catch(e) {}
    try { return new ActiveXObject('Msxml2.XMLHTTP.6.0'); } catch(e) {}
    try { return new ActiveXObject('Msxml2.XMLHTTP.3.0'); } catch(e) {}
    try { return new ActiveXObject('Msxml2.XMLHTTP'); } catch(e) {}
  }
  return false;
}

/**
 * Removes leading and trailing whitespace, added to support IE.
 *
 * @param {String} s
 * @return {String}
 * @api private
 */

var trim = ''.trim
  ? function(s) { return s.trim(); }
  : function(s) { return s.replace(/(^\s*|\s*$)/g, ''); };

/**
 * Check if `obj` is an object.
 *
 * @param {Object} obj
 * @return {Boolean}
 * @api private
 */

function isObject(obj) {
  return obj === Object(obj);
}

/**
 * Serialize the given `obj`.
 *
 * @param {Object} obj
 * @return {String}
 * @api private
 */

function serialize(obj) {
  if (!isObject(obj)) return obj;
  var pairs = [];
  for (var key in obj) {
    if (null != obj[key]) {
      pairs.push(encodeURIComponent(key)
        + '=' + encodeURIComponent(obj[key]));
    }
  }
  return pairs.join('&');
}

/**
 * Expose serialization method.
 */

 request.serializeObject = serialize;

 /**
  * Parse the given x-www-form-urlencoded `str`.
  *
  * @param {String} str
  * @return {Object}
  * @api private
  */

function parseString(str) {
  var obj = {};
  var pairs = str.split('&');
  var parts;
  var pair;

  for (var i = 0, len = pairs.length; i < len; ++i) {
    pair = pairs[i];
    parts = pair.split('=');
    obj[decodeURIComponent(parts[0])] = decodeURIComponent(parts[1]);
  }

  return obj;
}

/**
 * Expose parser.
 */

request.parseString = parseString;

/**
 * Default MIME type map.
 *
 *     superagent.types.xml = 'application/xml';
 *
 */

request.types = {
  html: 'text/html',
  json: 'application/json',
  xml: 'application/xml',
  urlencoded: 'application/x-www-form-urlencoded',
  'form': 'application/x-www-form-urlencoded',
  'form-data': 'application/x-www-form-urlencoded'
};

/**
 * Default serialization map.
 *
 *     superagent.serialize['application/xml'] = function(obj){
 *       return 'generated xml here';
 *     };
 *
 */

 request.serialize = {
   'application/x-www-form-urlencoded': serialize,
   'application/json': JSON.stringify
 };

 /**
  * Default parsers.
  *
  *     superagent.parse['application/xml'] = function(str){
  *       return { object parsed from str };
  *     };
  *
  */

request.parse = {
  'application/x-www-form-urlencoded': parseString,
  'application/json': JSON.parse
};

/**
 * Parse the given header `str` into
 * an object containing the mapped fields.
 *
 * @param {String} str
 * @return {Object}
 * @api private
 */

function parseHeader(str) {
  var lines = str.split(/\r?\n/);
  var fields = {};
  var index;
  var line;
  var field;
  var val;

  lines.pop(); // trailing CRLF

  for (var i = 0, len = lines.length; i < len; ++i) {
    line = lines[i];
    index = line.indexOf(':');
    field = line.slice(0, index).toLowerCase();
    val = trim(line.slice(index + 1));
    fields[field] = val;
  }

  return fields;
}

/**
 * Return the mime type for the given `str`.
 *
 * @param {String} str
 * @return {String}
 * @api private
 */

function type(str){
  return str.split(/ *; */).shift();
};

/**
 * Return header field parameters.
 *
 * @param {String} str
 * @return {Object}
 * @api private
 */

function params(str){
  return reduce(str.split(/ *; */), function(obj, str){
    var parts = str.split(/ *= */)
      , key = parts.shift()
      , val = parts.shift();

    if (key && val) obj[key] = val;
    return obj;
  }, {});
};

/**
 * Initialize a new `Response` with the given `xhr`.
 *
 *  - set flags (.ok, .error, etc)
 *  - parse header
 *
 * Examples:
 *
 *  Aliasing `superagent` as `request` is nice:
 *
 *      request = superagent;
 *
 *  We can use the promise-like API, or pass callbacks:
 *
 *      request.get('/').end(function(res){});
 *      request.get('/', function(res){});
 *
 *  Sending data can be chained:
 *
 *      request
 *        .post('/user')
 *        .send({ name: 'tj' })
 *        .end(function(res){});
 *
 *  Or passed to `.send()`:
 *
 *      request
 *        .post('/user')
 *        .send({ name: 'tj' }, function(res){});
 *
 *  Or passed to `.post()`:
 *
 *      request
 *        .post('/user', { name: 'tj' })
 *        .end(function(res){});
 *
 * Or further reduced to a single call for simple cases:
 *
 *      request
 *        .post('/user', { name: 'tj' }, function(res){});
 *
 * @param {XMLHTTPRequest} xhr
 * @param {Object} options
 * @api private
 */

function Response(req, options) {
  options = options || {};
  this.req = req;
  this.xhr = this.req.xhr;
  this.text = this.xhr.responseText;
  this.setStatusProperties(this.xhr.status);
  this.header = this.headers = parseHeader(this.xhr.getAllResponseHeaders());
  // getAllResponseHeaders sometimes falsely returns "" for CORS requests, but
  // getResponseHeader still works. so we get content-type even if getting
  // other headers fails.
  this.header['content-type'] = this.xhr.getResponseHeader('content-type');
  this.setHeaderProperties(this.header);
  this.body = this.req.method != 'HEAD'
    ? this.parseBody(this.text)
    : null;
}

/**
 * Get case-insensitive `field` value.
 *
 * @param {String} field
 * @return {String}
 * @api public
 */

Response.prototype.get = function(field){
  return this.header[field.toLowerCase()];
};

/**
 * Set header related properties:
 *
 *   - `.type` the content type without params
 *
 * A response of "Content-Type: text/plain; charset=utf-8"
 * will provide you with a `.type` of "text/plain".
 *
 * @param {Object} header
 * @api private
 */

Response.prototype.setHeaderProperties = function(header){
  // content-type
  var ct = this.header['content-type'] || '';
  this.type = type(ct);

  // params
  var obj = params(ct);
  for (var key in obj) this[key] = obj[key];
};

/**
 * Parse the given body `str`.
 *
 * Used for auto-parsing of bodies. Parsers
 * are defined on the `superagent.parse` object.
 *
 * @param {String} str
 * @return {Mixed}
 * @api private
 */

Response.prototype.parseBody = function(str){
  var parse = request.parse[this.type];
  return parse
    ? parse(str)
    : null;
};

/**
 * Set flags such as `.ok` based on `status`.
 *
 * For example a 2xx response will give you a `.ok` of __true__
 * whereas 5xx will be __false__ and `.error` will be __true__. The
 * `.clientError` and `.serverError` are also available to be more
 * specific, and `.statusType` is the class of error ranging from 1..5
 * sometimes useful for mapping respond colors etc.
 *
 * "sugar" properties are also defined for common cases. Currently providing:
 *
 *   - .noContent
 *   - .badRequest
 *   - .unauthorized
 *   - .notAcceptable
 *   - .notFound
 *
 * @param {Number} status
 * @api private
 */

Response.prototype.setStatusProperties = function(status){
  var type = status / 100 | 0;

  // status / class
  this.status = status;
  this.statusType = type;

  // basics
  this.info = 1 == type;
  this.ok = 2 == type;
  this.clientError = 4 == type;
  this.serverError = 5 == type;
  this.error = (4 == type || 5 == type)
    ? this.toError()
    : false;

  // sugar
  this.accepted = 202 == status;
  this.noContent = 204 == status || 1223 == status;
  this.badRequest = 400 == status;
  this.unauthorized = 401 == status;
  this.notAcceptable = 406 == status;
  this.notFound = 404 == status;
  this.forbidden = 403 == status;
};

/**
 * Return an `Error` representative of this response.
 *
 * @return {Error}
 * @api public
 */

Response.prototype.toError = function(){
  var req = this.req;
  var method = req.method;
  var url = req.url;

  var msg = 'cannot ' + method + ' ' + url + ' (' + this.status + ')';
  var err = new Error(msg);
  err.status = this.status;
  err.method = method;
  err.url = url;

  return err;
};

/**
 * Expose `Response`.
 */

request.Response = Response;

/**
 * Initialize a new `Request` with the given `method` and `url`.
 *
 * @param {String} method
 * @param {String} url
 * @api public
 */

function Request(method, url) {
  var self = this;
  Emitter.call(this);
  this._query = this._query || [];
  this.method = method;
  this.url = url;
  this.header = {};
  this._header = {};
  this.on('end', function(){
    var res = new Response(self);
    if ('HEAD' == method) res.text = null;
    self.callback(null, res);
  });
}

/**
 * Mixin `Emitter`.
 */

Emitter(Request.prototype);

/**
 * Allow for extension
 */

Request.prototype.use = function(fn) {
  fn(this);
  return this;
}

/**
 * Set timeout to `ms`.
 *
 * @param {Number} ms
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.timeout = function(ms){
  this._timeout = ms;
  return this;
};

/**
 * Clear previous timeout.
 *
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.clearTimeout = function(){
  this._timeout = 0;
  clearTimeout(this._timer);
  return this;
};

/**
 * Abort the request, and clear potential timeout.
 *
 * @return {Request}
 * @api public
 */

Request.prototype.abort = function(){
  if (this.aborted) return;
  this.aborted = true;
  this.xhr.abort();
  this.clearTimeout();
  this.emit('abort');
  return this;
};

/**
 * Set header `field` to `val`, or multiple fields with one object.
 *
 * Examples:
 *
 *      req.get('/')
 *        .set('Accept', 'application/json')
 *        .set('X-API-Key', 'foobar')
 *        .end(callback);
 *
 *      req.get('/')
 *        .set({ Accept: 'application/json', 'X-API-Key': 'foobar' })
 *        .end(callback);
 *
 * @param {String|Object} field
 * @param {String} val
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.set = function(field, val){
  if (isObject(field)) {
    for (var key in field) {
      this.set(key, field[key]);
    }
    return this;
  }
  this._header[field.toLowerCase()] = val;
  this.header[field] = val;
  return this;
};

/**
 * Get case-insensitive header `field` value.
 *
 * @param {String} field
 * @return {String}
 * @api private
 */

Request.prototype.getHeader = function(field){
  return this._header[field.toLowerCase()];
};

/**
 * Set Content-Type to `type`, mapping values from `request.types`.
 *
 * Examples:
 *
 *      superagent.types.xml = 'application/xml';
 *
 *      request.post('/')
 *        .type('xml')
 *        .send(xmlstring)
 *        .end(callback);
 *
 *      request.post('/')
 *        .type('application/xml')
 *        .send(xmlstring)
 *        .end(callback);
 *
 * @param {String} type
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.type = function(type){
  this.set('Content-Type', request.types[type] || type);
  return this;
};

/**
 * Set Accept to `type`, mapping values from `request.types`.
 *
 * Examples:
 *
 *      superagent.types.json = 'application/json';
 *
 *      request.get('/agent')
 *        .accept('json')
 *        .end(callback);
 *
 *      request.get('/agent')
 *        .accept('application/json')
 *        .end(callback);
 *
 * @param {String} accept
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.accept = function(type){
  this.set('Accept', request.types[type] || type);
  return this;
};

/**
 * Set Authorization field value with `user` and `pass`.
 *
 * @param {String} user
 * @param {String} pass
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.auth = function(user, pass){
  var str = btoa(user + ':' + pass);
  this.set('Authorization', 'Basic ' + str);
  return this;
};

/**
* Add query-string `val`.
*
* Examples:
*
*   request.get('/shoes')
*     .query('size=10')
*     .query({ color: 'blue' })
*
* @param {Object|String} val
* @return {Request} for chaining
* @api public
*/

Request.prototype.query = function(val){
  if ('string' != typeof val) val = serialize(val);
  if (val) this._query.push(val);
  return this;
};

/**
 * Write the field `name` and `val` for "multipart/form-data"
 * request bodies.
 *
 * ``` js
 * request.post('/upload')
 *   .field('foo', 'bar')
 *   .end(callback);
 * ```
 *
 * @param {String} name
 * @param {String|Blob|File} val
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.field = function(name, val){
  if (!this._formData) this._formData = new FormData();
  this._formData.append(name, val);
  return this;
};

/**
 * Queue the given `file` as an attachment to the specified `field`,
 * with optional `filename`.
 *
 * ``` js
 * request.post('/upload')
 *   .attach(new Blob(['<a id="a"><b id="b">hey!</b></a>'], { type: "text/html"}))
 *   .end(callback);
 * ```
 *
 * @param {String} field
 * @param {Blob|File} file
 * @param {String} filename
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.attach = function(field, file, filename){
  if (!this._formData) this._formData = new FormData();
  this._formData.append(field, file, filename);
  return this;
};

/**
 * Send `data`, defaulting the `.type()` to "json" when
 * an object is given.
 *
 * Examples:
 *
 *       // querystring
 *       request.get('/search')
 *         .end(callback)
 *
 *       // multiple data "writes"
 *       request.get('/search')
 *         .send({ search: 'query' })
 *         .send({ range: '1..5' })
 *         .send({ order: 'desc' })
 *         .end(callback)
 *
 *       // manual json
 *       request.post('/user')
 *         .type('json')
 *         .send('{"name":"tj"})
 *         .end(callback)
 *
 *       // auto json
 *       request.post('/user')
 *         .send({ name: 'tj' })
 *         .end(callback)
 *
 *       // manual x-www-form-urlencoded
 *       request.post('/user')
 *         .type('form')
 *         .send('name=tj')
 *         .end(callback)
 *
 *       // auto x-www-form-urlencoded
 *       request.post('/user')
 *         .type('form')
 *         .send({ name: 'tj' })
 *         .end(callback)
 *
 *       // defaults to x-www-form-urlencoded
  *      request.post('/user')
  *        .send('name=tobi')
  *        .send('species=ferret')
  *        .end(callback)
 *
 * @param {String|Object} data
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.send = function(data){
  var obj = isObject(data);
  var type = this.getHeader('Content-Type');

  // merge
  if (obj && isObject(this._data)) {
    for (var key in data) {
      this._data[key] = data[key];
    }
  } else if ('string' == typeof data) {
    if (!type) this.type('form');
    type = this.getHeader('Content-Type');
    if ('application/x-www-form-urlencoded' == type) {
      this._data = this._data
        ? this._data + '&' + data
        : data;
    } else {
      this._data = (this._data || '') + data;
    }
  } else {
    this._data = data;
  }

  if (!obj) return this;
  if (!type) this.type('json');
  return this;
};

/**
 * Invoke the callback with `err` and `res`
 * and handle arity check.
 *
 * @param {Error} err
 * @param {Response} res
 * @api private
 */

Request.prototype.callback = function(err, res){
  var fn = this._callback;
  if (2 == fn.length) return fn(err, res);
  if (err) return this.emit('error', err);
  fn(res);
};

/**
 * Invoke callback with x-domain error.
 *
 * @api private
 */

Request.prototype.crossDomainError = function(){
  var err = new Error('Origin is not allowed by Access-Control-Allow-Origin');
  err.crossDomain = true;
  this.callback(err);
};

/**
 * Invoke callback with timeout error.
 *
 * @api private
 */

Request.prototype.timeoutError = function(){
  var timeout = this._timeout;
  var err = new Error('timeout of ' + timeout + 'ms exceeded');
  err.timeout = timeout;
  this.callback(err);
};

/**
 * Enable transmission of cookies with x-domain requests.
 *
 * Note that for this to work the origin must not be
 * using "Access-Control-Allow-Origin" with a wildcard,
 * and also must set "Access-Control-Allow-Credentials"
 * to "true".
 *
 * @api public
 */

Request.prototype.withCredentials = function(){
  this._withCredentials = true;
  return this;
};

/**
 * Initiate request, invoking callback `fn(res)`
 * with an instanceof `Response`.
 *
 * @param {Function} fn
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.end = function(fn){
  var self = this;
  var xhr = this.xhr = getXHR();
  var query = this._query.join('&');
  var timeout = this._timeout;
  var data = this._formData || this._data;

  // store callback
  this._callback = fn || noop;

  // state change
  xhr.onreadystatechange = function(){
    if (4 != xhr.readyState) return;
    if (0 == xhr.status) {
      if (self.aborted) return self.timeoutError();
      return self.crossDomainError();
    }
    self.emit('end');
  };

  // progress
  if (xhr.upload) {
    xhr.upload.onprogress = function(e){
      e.percent = e.loaded / e.total * 100;
      self.emit('progress', e);
    };
  }

  // timeout
  if (timeout && !this._timer) {
    this._timer = setTimeout(function(){
      self.abort();
    }, timeout);
  }

  // querystring
  if (query) {
    query = request.serializeObject(query);
    this.url += ~this.url.indexOf('?')
      ? '&' + query
      : '?' + query;
  }

  // initiate request
  xhr.open(this.method, this.url, true);

  // CORS
  if (this._withCredentials) xhr.withCredentials = true;

  // body
  if ('GET' != this.method && 'HEAD' != this.method && 'string' != typeof data && !isHost(data)) {
    // serialize stuff
    var serialize = request.serialize[this.getHeader('Content-Type')];
    if (serialize) data = serialize(data);
  }

  // set header fields
  for (var field in this.header) {
    if (null == this.header[field]) continue;
    xhr.setRequestHeader(field, this.header[field]);
  }

  // send stuff
  this.emit('request', this);
  xhr.send(data);
  return this;
};

/**
 * Expose `Request`.
 */

request.Request = Request;

/**
 * Issue a request:
 *
 * Examples:
 *
 *    request('GET', '/users').end(callback)
 *    request('/users').end(callback)
 *    request('/users', callback)
 *
 * @param {String} method
 * @param {String|Function} url or callback
 * @return {Request}
 * @api public
 */

function request(method, url) {
  // callback
  if ('function' == typeof url) {
    return new Request('GET', method).end(url);
  }

  // url first
  if (1 == arguments.length) {
    return new Request('GET', method);
  }

  return new Request(method, url);
}

/**
 * GET `url` with optional callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed|Function} data or fn
 * @param {Function} fn
 * @return {Request}
 * @api public
 */

request.get = function(url, data, fn){
  var req = request('GET', url);
  if ('function' == typeof data) fn = data, data = null;
  if (data) req.query(data);
  if (fn) req.end(fn);
  return req;
};

/**
 * HEAD `url` with optional callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed|Function} data or fn
 * @param {Function} fn
 * @return {Request}
 * @api public
 */

request.head = function(url, data, fn){
  var req = request('HEAD', url);
  if ('function' == typeof data) fn = data, data = null;
  if (data) req.send(data);
  if (fn) req.end(fn);
  return req;
};

/**
 * DELETE `url` with optional callback `fn(res)`.
 *
 * @param {String} url
 * @param {Function} fn
 * @return {Request}
 * @api public
 */

request.del = function(url, fn){
  var req = request('DELETE', url);
  if (fn) req.end(fn);
  return req;
};

/**
 * PATCH `url` with optional `data` and callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed} data
 * @param {Function} fn
 * @return {Request}
 * @api public
 */

request.patch = function(url, data, fn){
  var req = request('PATCH', url);
  if ('function' == typeof data) fn = data, data = null;
  if (data) req.send(data);
  if (fn) req.end(fn);
  return req;
};

/**
 * POST `url` with optional `data` and callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed} data
 * @param {Function} fn
 * @return {Request}
 * @api public
 */

request.post = function(url, data, fn){
  var req = request('POST', url);
  if ('function' == typeof data) fn = data, data = null;
  if (data) req.send(data);
  if (fn) req.end(fn);
  return req;
};

/**
 * PUT `url` with optional `data` and callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed|Function} data or fn
 * @param {Function} fn
 * @return {Request}
 * @api public
 */

request.put = function(url, data, fn){
  var req = request('PUT', url);
  if ('function' == typeof data) fn = data, data = null;
  if (data) req.send(data);
  if (fn) req.end(fn);
  return req;
};

/**
 * Expose `request`.
 */

module.exports = request;

},{"emitter":1,"reduce":3}],5:[function(require,module,exports){
module.exports = Array;

},{}],6:[function(require,module,exports){
(function (global){

var rng;

if (global.crypto && crypto.getRandomValues) {
  // WHATWG crypto-based RNG - http://wiki.whatwg.org/wiki/Crypto
  // Moderately fast, high quality
  var _rnds8 = new Uint8Array(16);
  rng = function whatwgRNG() {
    crypto.getRandomValues(_rnds8);
    return _rnds8;
  };
}

if (!rng) {
  // Math.random()-based (RNG)
  //
  // If all else fails, use Math.random().  It's fast, but is of unspecified
  // quality.
  var  _rnds = new Array(16);
  rng = function() {
    for (var i = 0, r; i < 16; i++) {
      if ((i & 0x03) === 0) r = Math.random() * 0x100000000;
      _rnds[i] = r >>> ((i & 0x03) << 3) & 0xff;
    }

    return _rnds;
  };
}

module.exports = rng;


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],7:[function(require,module,exports){
//     uuid.js
//
//     Copyright (c) 2010-2012 Robert Kieffer
//     MIT License - http://opensource.org/licenses/mit-license.php

// Unique ID creation requires a high quality random # generator.  We feature
// detect to determine the best RNG source, normalizing to a function that
// returns 128-bits of randomness, since that's what's usually required
var _rng = require('./rng');

// Buffer class to use,
// we can't use `Buffer || Array` otherwise Buffer would be
// shimmed by browserify and added to the browser build
var BufferClass = require('./buffer');

// Maps for number <-> hex string conversion
var _byteToHex = [];
var _hexToByte = {};
for (var i = 0; i < 256; i++) {
  _byteToHex[i] = (i + 0x100).toString(16).substr(1);
  _hexToByte[_byteToHex[i]] = i;
}

// **`parse()` - Parse a UUID into it's component bytes**
function parse(s, buf, offset) {
  var i = (buf && offset) || 0, ii = 0;

  buf = buf || [];
  s.toLowerCase().replace(/[0-9a-f]{2}/g, function(oct) {
    if (ii < 16) { // Don't overflow!
      buf[i + ii++] = _hexToByte[oct];
    }
  });

  // Zero out remaining bytes if string was short
  while (ii < 16) {
    buf[i + ii++] = 0;
  }

  return buf;
}

// **`unparse()` - Convert UUID byte array (ala parse()) into a string**
function unparse(buf, offset) {
  var i = offset || 0, bth = _byteToHex;
  return  bth[buf[i++]] + bth[buf[i++]] +
          bth[buf[i++]] + bth[buf[i++]] + '-' +
          bth[buf[i++]] + bth[buf[i++]] + '-' +
          bth[buf[i++]] + bth[buf[i++]] + '-' +
          bth[buf[i++]] + bth[buf[i++]] + '-' +
          bth[buf[i++]] + bth[buf[i++]] +
          bth[buf[i++]] + bth[buf[i++]] +
          bth[buf[i++]] + bth[buf[i++]];
}

// **`v1()` - Generate time-based UUID**
//
// Inspired by https://github.com/LiosK/UUID.js
// and http://docs.python.org/library/uuid.html

// random #'s we need to init node and clockseq
var _seedBytes = _rng();

// Per 4.5, create and 48-bit node id, (47 random bits + multicast bit = 1)
var _nodeId = [
  _seedBytes[0] | 0x01,
  _seedBytes[1], _seedBytes[2], _seedBytes[3], _seedBytes[4], _seedBytes[5]
];

// Per 4.2.2, randomize (14 bit) clockseq
var _clockseq = (_seedBytes[6] << 8 | _seedBytes[7]) & 0x3fff;

// Previous uuid creation time
var _lastMSecs = 0, _lastNSecs = 0;

// See https://github.com/broofa/node-uuid for API details
function v1(options, buf, offset) {
  var i = buf && offset || 0;
  var b = buf || [];

  options = options || {};

  var clockseq = options.clockseq !== undefined ? options.clockseq : _clockseq;

  // UUID timestamps are 100 nano-second units since the Gregorian epoch,
  // (1582-10-15 00:00).  JSNumbers aren't precise enough for this, so
  // time is handled internally as 'msecs' (integer milliseconds) and 'nsecs'
  // (100-nanoseconds offset from msecs) since unix epoch, 1970-01-01 00:00.
  var msecs = options.msecs !== undefined ? options.msecs : new Date().getTime();

  // Per 4.2.1.2, use count of uuid's generated during the current clock
  // cycle to simulate higher resolution clock
  var nsecs = options.nsecs !== undefined ? options.nsecs : _lastNSecs + 1;

  // Time since last uuid creation (in msecs)
  var dt = (msecs - _lastMSecs) + (nsecs - _lastNSecs)/10000;

  // Per 4.2.1.2, Bump clockseq on clock regression
  if (dt < 0 && options.clockseq === undefined) {
    clockseq = clockseq + 1 & 0x3fff;
  }

  // Reset nsecs if clock regresses (new clockseq) or we've moved onto a new
  // time interval
  if ((dt < 0 || msecs > _lastMSecs) && options.nsecs === undefined) {
    nsecs = 0;
  }

  // Per 4.2.1.2 Throw error if too many uuids are requested
  if (nsecs >= 10000) {
    throw new Error('uuid.v1(): Can\'t create more than 10M uuids/sec');
  }

  _lastMSecs = msecs;
  _lastNSecs = nsecs;
  _clockseq = clockseq;

  // Per 4.1.4 - Convert from unix epoch to Gregorian epoch
  msecs += 12219292800000;

  // `time_low`
  var tl = ((msecs & 0xfffffff) * 10000 + nsecs) % 0x100000000;
  b[i++] = tl >>> 24 & 0xff;
  b[i++] = tl >>> 16 & 0xff;
  b[i++] = tl >>> 8 & 0xff;
  b[i++] = tl & 0xff;

  // `time_mid`
  var tmh = (msecs / 0x100000000 * 10000) & 0xfffffff;
  b[i++] = tmh >>> 8 & 0xff;
  b[i++] = tmh & 0xff;

  // `time_high_and_version`
  b[i++] = tmh >>> 24 & 0xf | 0x10; // include version
  b[i++] = tmh >>> 16 & 0xff;

  // `clock_seq_hi_and_reserved` (Per 4.2.2 - include variant)
  b[i++] = clockseq >>> 8 | 0x80;

  // `clock_seq_low`
  b[i++] = clockseq & 0xff;

  // `node`
  var node = options.node || _nodeId;
  for (var n = 0; n < 6; n++) {
    b[i + n] = node[n];
  }

  return buf ? buf : unparse(b);
}

// **`v4()` - Generate random UUID**

// See https://github.com/broofa/node-uuid for API details
function v4(options, buf, offset) {
  // Deprecated - 'format' argument, as supported in v1.2
  var i = buf && offset || 0;

  if (typeof(options) == 'string') {
    buf = options == 'binary' ? new BufferClass(16) : null;
    options = null;
  }
  options = options || {};

  var rnds = options.random || (options.rng || _rng)();

  // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
  rnds[6] = (rnds[6] & 0x0f) | 0x40;
  rnds[8] = (rnds[8] & 0x3f) | 0x80;

  // Copy bytes to buffer, if provided
  if (buf) {
    for (var ii = 0; ii < 16; ii++) {
      buf[i + ii] = rnds[ii];
    }
  }

  return buf || unparse(rnds);
}

// Export public API
var uuid = v4;
uuid.v1 = v1;
uuid.v4 = v4;
uuid.parse = parse;
uuid.unparse = unparse;
uuid.BufferClass = BufferClass;

module.exports = uuid;

},{"./buffer":5,"./rng":6}],8:[function(require,module,exports){
/**
* The Ambassador listens to what happens in Clientland and
* reports back to Serverland.
*
* The Ambassador also brings news from Serverland to Clientland.
**/
var $ = require('./util.js'),
	request = require('superagent'),
	view = null;

var reportNewNode = function(e) {
	request
		.post("nodes/")
		.send(e.detail.node)
		.end(function(err, res){

		});
};

var reportDeletedNode = function(e) {
	var nodeId = e.detail.nodeId;

	request
		.del("nodes/" + nodeId)
		.end(function(err, res) {
			if (err) 
				throw "Error when deleting node with id " + nodeId;
		});
};

var reportNodeUpdate = function(e) {
	request
		.patch("nodes/" + e.detail.nodeId)
		.send(e.detail.patch)
		.end(function(err, res) {
			//console.dir(res);
		});
};

module.exports = function(el) {
	view = el;

	$(view).on("x-node-created", reportNewNode);
	$(view).on("x-node-deleted", reportDeletedNode);
	$(view).on("x-node-updated", reportNodeUpdate);
};
},{"./util.js":18,"superagent":4}],9:[function(require,module,exports){
/**
* The DOM Whisperer is responsible for talking to the DOM when things
* changes. It listens for events emitted by other modules such as the Mouse 
* Trapper and the Model.
**/

require('es6-collections');
var pathFinder = require("./path-finder");

var svgMaker = require("./svg-maker"),
	$ = require('./util'),
	xy = require('./xy'),
	uuid = require('uuid'),
	view = null,
	nodes = new Map();
	selectedNodes = [],
	selectedSocket = null,
	evolvingRelationship = null;
	_targetSocket = null;

var addNode = function(e) {
	var node = e.detail.node;

	view.appendChild(svgMaker.createSvgNode(node));
	nodes.set(node.id, view.lastChild);

	if (e.type == "x-node-created") {
		// Go straight into edit mode when creating a new node
		setActiveNode(view.lastChild);
		$(view).emit("ui-edit-mode", {
			nodeId: node.id,
			position: node.position,
			currentValue: ""
		});
	}
};

var createNode = function(e) {
	if (this == e.target) {
		var node = {
			id: uuid.v4(),
			text: "",
			position: e.detail.position
		};

		// Make the point where the user clicked the center of the node.
		var defaultSize = svgMaker.getDefaultNodeSize();
		node.position.x = node.position.x - (defaultSize.width / 2);
		node.position.y = node.position.y - (defaultSize.height / 2);

		$(view).emit("ui-create-node", {
			node: node
		});
	}
};

/**
* Sends a 'command' to the Model. The removing of DOM nodes is triggered by
* the 'x-node-deleted' event.
**/
var deletePressed = function() {
	selectedNodes.forEach(function(node) {
		$(view).emit("ui-delete-node", {
			nodeId: node.attributes["data-node-id"].value
		});
	});
	selectedNodes.length = 0;
};

var deleteNode = function(e) {
	// TODO: clear all refs to node.
	var node = nodes.get(e.detail.nodeId);
	node.parentNode.removeChild(node);
	nodes.delete(node.id);
};

var arrowPressed = function(e) {
	moveSelectedNodes(e, true);
};

var cancelSelections = function() {
	// TODO: clear event listeners from current active node.
	selectedNodes.forEach(function(n) {
		n.classList.remove("active");		
	});

	selectedNodes.length = 0;
};

var editNodeTitle = function(e) {
	var node = nodes.get(e.detail.nodeId),
		textBox = node.querySelector(".node-title");

	$(view).emit("ui-edit-mode", {
		nodeId: e.detail.nodeId,
		position: xy(node),
		currentValue: textBox.innerText
	});

	textBox.innerText = "";
};

var updateNodeTitle = function(e) {
	nodes.get(e.detail.nodeId)
		.querySelector(".node-title")
		.innerText = e.detail.newValue;
};

var editNodeCancelled = function(e) {
	nodes.get(e.detail.nodeId)
		.querySelector(".node-title")
		.innerText = e.detail.valueBeforeEdit;
};

var setActiveNode = function(node) {
	cancelSelections();
	selectedNodes.push(node);
	node.classList.add("active");
};

var selectNode = function(e) {
	var node = nodes.get(e.detail.nodeId);

	if (e.detail.shiftKey)
		expandSelection(node);
	else
		setActiveNode(node);
};

var selectSocket = function(e) {
	selectedSocket = e.detail.socket;
	selectedSocket.classList.add("active");
};

var deselectSocket = function() {
	selectedSocket.classList.remove("active");
	selectedSocket = null;
	e.detail.socket.classList.remove("active");
};

var expandSelection = function(node) {
	selectedNodes.push(node);
	node.classList.add("active");
};

var mouseDrag = function(e) {
	if (nothingIsSelected()){
		// begin/expand selection
		return;
	}
	
	if (selectedSocket) {
		var to = {
			x: e.detail.mousePosition.x,
			y: e.detail.mousePosition.y,
		};

		if (!evolvingRelationship) {
			// User initiated creation of new relationship
			var from = pathFinder.getPointOfConnection(selectedSocket);
			view.appendChild(svgMaker.createSvgRelationship(from, to));
			evolvingRelationship = view.lastChild.querySelector(".evolving.line");
		}
		else {
			updateEvolvingingRelationship(evolvingRelationship, selectedSocket, to);
		}
	}
	else {
		moveSelectedNodes(e, false);		
	}
};

var mouseOverNode = function(e) {
	var node = nodes.get(e.detail.nodeId);
};

var mouseOutNode = function(e) {
	if (evolvingRelationship) {
		var node = nodes.get(e.detail.nodeId);
		node.classList.remove("active");
	}
};

var moveSelectedNodes = function(e, emitEvent) {
	var delta = e.detail.delta;

	selectedNodes.forEach(function(node) {
		var nodePosition = xy(node);

		node.setAttribute("transform", "translate(" +
			(nodePosition.x += delta.x) + ", " +
			(nodePosition.y += delta.y) + ")");

		if (emitEvent) {
			$(view).emit("view/node-moved", {
				nodeId: node.attributes["data-node-id"].value,
				position: xy(node)
			});
		}
	});
};

var updateEvolvingingRelationship = function(path, fromSocket, to) {
	path.setAttribute("d", pathFinder.pathDescriptionGenerator(fromSocket, to));
};

var dragEnded = function(e) {
	selectedNodes.forEach(function(node) {
		$(view).emit("view/node-moved", {
			nodeId: node.attributes["data-node-id"].value,
			position: xy(node)
		});
	});

	if (evolvingRelationship) {
		console.dir(e.detail.position);
		console.dir(e.detail.targetEl);
	}

	if (selectedSocket) {
		selectedSocket.classList.remove("active");
		selectedSocket = null;

		if (_targetSocket)
			console.log("create rel!");
		else {
			var elLine = view.lastChild.querySelector(".line");
			elLine.parentNode.removeChild(elLine);
			evolvingRelationship = null;
		}
	}
};

function nothingIsSelected() {
	return selectedNodes.length === 0 && selectedSocket === null;
}

module.exports = function(el) {
	view = el;
	$(el).on("x-node-added", addNode);
	$(el).on("x-node-created", addNode);
	$(el).on("x-node-deleted", deleteNode);
	$(el).on("mouse-create-node", createNode);
	$(el).on("mouse-cancel-selections", cancelSelections);
	$(el).on("mouse/drag", mouseDrag);
	$(el).on("mouse/drag-end", dragEnded);
	$(el).on("keyboard-input/submit", updateNodeTitle);
	$(el).on("keyboard-input/cancelled", editNodeCancelled);
	$(el).on("keyboard-command/delete", deletePressed);
	$(el).on("keyboard-command/up", arrowPressed);
	$(el).on("keyboard-command/right", arrowPressed);
	$(el).on("keyboard-command/down", arrowPressed);
	$(el).on("keyboard-command/left", arrowPressed);
	$(el).on("node/selected", selectNode);
	$(el).on("node/mouse-over", mouseOverNode);
	$(el).on("node/mouse-out", mouseOutNode);
	$(el).on("node/socket-selected", selectSocket);
	$(el).on("node/socket-mouseup", socketMouseUp);
	$(el).on("node/socket-mouseover", socketMouseOver);
	$(el).on("node/socket-mouseout", socketMouseOut);
	$(el).on("node/begin-edit", editNodeTitle);
};
},{"./path-finder":16,"./svg-maker":17,"./util":18,"./xy":19,"es6-collections":2,"uuid":7}],10:[function(require,module,exports){
var $ = require('./util'),
	xy = require('./xy');

function KeyboardInput(el, inputSelector) {

	var ui = el,
		inputEl = document.querySelector(inputSelector),
		valueBeforeEdit = null,
		nodeId = null;

	this._assumeThePosition = function(e) {
		nodeId = e.detail.nodeId;
		valueBeforeEdit = e.detail.currentValue;
		inputEl.value = e.detail.currentValue;

		var position = e.detail.position;
		inputEl.style.left = (position.x + 2) + "px";
		inputEl.style.top = (position.y + 18) + "px";

		inputEl.classList.remove("hide");
		inputEl.focus();		
	};

	this._keydown = function(e) {
		if (!nodeId)
			return;

		if(e.keyCode == 13) { // return
			$(ui).emit("keyboard-input/submit", { 
				nodeId: nodeId,
				newValue: inputEl.value 
			});
			
			inputEl.classList.add("hide");
			nodeId = null;
		}
		else if(e.keyCode == 27) { // esc
			$(ui).emit("keyboard-input/cancelled", {
				nodeId: nodeId,
				valueBeforeEdit: valueBeforeEdit
			});

			nodeId = null;
			inputEl.classList.add("hide");
		}

		e.stopPropagation();
	};

	this._blur = function(e) {
		inputEl.classList.add("hide");
	};

	$(ui).on("ui-edit-mode", this._assumeThePosition),
	$(inputEl).on("keydown", this._keydown),
	$(inputEl).on("blur", this._blur)
}


module.exports = KeyboardInput;
},{"./util":18,"./xy":19}],11:[function(require,module,exports){
/**
* The Keyboard Shortcuts. Not sure what is good for. I just liked the idea of
* having seperate modules listening for keystrokes and emit more domain specific
* events.
**/

var $ = require('./util'),
	view = null;

var init = function(el) {
	view = el;

	$(document).on("keydown", function(e) {
		switch(e.keyCode) {
			case 46:
				$(view).emit("keyboard-command/delete");
				break;
			case 37:
				$(view).emit("keyboard-command/left", {
					delta:  {
						x: -4,
						y: 0
					}}
				);
				break;
			case 38:
				$(view).emit("keyboard-command/up", {
					delta:  {
						x: 0,
						y: -4
					}
				});
				break;
			case 39:
				$(view).emit("keyboard-command/right", {
					delta:  {
						x: 4,
						y: 0
					}
				});
				break;
			case 40:
				$(view).emit("keyboard-command/down", {
					delta:  {
						x: 0,
						y: 4
					}
				});
				break;
		}
	});

	$(document).on("keyup", function(e) {
		switch(e.keyCode) {
			case 18:
				$(view).emit("keyboard-command/alt-released");
				break;
		}
	});
};

module.exports = {
	init: init
};
},{"./util":18}],12:[function(require,module,exports){

var request = require('superagent'),
	model = require('./model'),
	domWhisperer = require('./dom-whisperer'),
	mouseTrapper = require('./mouse-trapper'),
	ambassador = require('./ambassador'),
	KeyboardInput = require('./keyboard-input');
	
var ui = document.querySelector('[data-carta]');

domWhisperer(ui);
mouseTrapper(ui);
ambassador(ui);
KeyboardInput(ui, '[data-input-box]')
require('./keyboard-shortcuts').init(ui);

request.get('fake/db', function(res) {
	var db = JSON.parse(res.text);
	model.init(db, ui);
});
},{"./ambassador":8,"./dom-whisperer":9,"./keyboard-input":10,"./keyboard-shortcuts":11,"./model":13,"./mouse-trapper":14,"superagent":4}],13:[function(require,module,exports){
/**
* The Model holds the master data for the client side. It listens to UI events
* and emits events after updating the model. The events emitted triggers the 
* Ambassador to report back to the server.
* 
* It should also listen for changes from the server (via the Ambassador) in a 
* multi user scenario.
**/

require('es6-collections');
var $ = require('./util.js');

module.exports = function() {
	var nodes = new Map(),
		view = null;

	var createNode = function(e) {
		var node = e.detail.node;

		nodes.set(node.id, node);
		$(view).emit("x-node-created", {
			node: node	
		});
	};

	var removeNode = function(e) {
		nodes.delete(e.detail.nodeId);
		$(view).emit("x-node-deleted", {
			nodeId: e.detail.nodeId
		});
	};

	var updateNodePosition = function(e) {
		var node = nodes.get(e.detail.nodeId);
		node.position = e.detail.position;

		$(view).emit("x-node-updated", {
			nodeId: node.id,
			patch: [
				{
					op: "replace",
					path: "/position",
					value: node.position
				}
			]
		});
	};

	var updateNodeText = function(e) {
		var node = nodes.get(e.detail.nodeId);
		node.text = e.detail.newValue;

		$(view).emit("x-node-updated", {
			nodeId: node.id,
			patch: [
				{
					op: "replace",
					path: "/text",
					value: node.text
				}
			]
		});
	};

	return {
		init: function(db, el) {
			view = el;

			db.nodes.forEach(function(node) {
				nodes.set(node.id, node);
				$(el).emit("x-node-added", {
					node: node
				});
			});

			$(view).on("ui-create-node", createNode);
			$(view).on("ui-delete-node", removeNode);
			$(view).on("view/node-moved", updateNodePosition);
			$(view).on("keyboard-input/submit", updateNodeText);
		}
	};
}();
},{"./util.js":18,"es6-collections":2}],14:[function(require,module,exports){
/**
* The Mouse Trapper listens to mouse events from the canvas and tries to figure out the users
* intent and emits more specific events that other modules acts on.
*/

var $ = require('./util'),
	xy = require('./xy'),
	view = null,
	mouseIsDown = false,
	dragging = false,
	lastMousePosition = null;

var mouseDown = function(e) {
	mouseIsDown = true;
	lastMousePosition = xy(e);

	if (targetIsCanvas(e)) {
		$(view).emit("mouse-cancel-selections");		
	}
};

var mouseMove = function(e) {
	if (mouseIsDown || e.altKey) {
		dragging = true;

		// If the user alt-drags (a.k.a. floats) we need to set lastMousePosition
		// at the beginning of that action.
		if (!lastMousePosition)
			lastMousePosition = xy(e);

		var delta = {
			x: e.clientX - lastMousePosition.x, 
			y: e.clientY - lastMousePosition.y
		};

		$(view).emit("mouse/drag", {
			delta: delta,
			mousePosition: xy(e)
		});

		lastMousePosition = xy(e);
	}
};

var mouseUp = function(e) {
	mouseIsDown = false;
	lastMousePosition = null;

	var pos = xy(e);

	if (dragging) {
		var targetEl = document.elementFromPoint(pos.x, pos.y);

		$(view).emit("mouse/drag-end", {
			position: pos,
			targetEl: targetEl 
		});
		dragging = false;
	}
};

var doubleClick = function(e) {
	if (targetIsCanvas(e)) {
		$(view).emit("mouse-create-node", {
			position: xy(e)
		});
	}
};

function targetIsCanvas(e) {
	return e.target.id === "canvas";
}

module.exports = function(el) {
	view = el;

	$(el).on("mousedown", mouseDown);
	$(el).on("mouseup", mouseUp);
	$(el).on("dblclick", doubleClick);
	$(el).on("mousemove", mouseMove);
	$(el).on("keyboard-command/alt-released", function() { if (dragging) mouseUp(); } );
};
},{"./util":18,"./xy":19}],15:[function(require,module,exports){
var $ = require("./util");

var init = function(nodeElement, nodeId) {

	$(nodeElement).on("mousedown", function(e) {
		$(nodeElement).emit("node/selected", {
			nodeId: nodeId,
			shiftKey: e.shiftKey
		});
	});

	$(nodeElement).on("dblclick", function(e) {
		$(nodeElement).emit("node/begin-edit", {
			nodeId: nodeId
		});
	});

	$(nodeElement.querySelectorAll(".node, .node-html-host, .node-title")).on("mouseover", function(e) {
		$(nodeElement).emit("node/mouse-over", {
			nodeId: nodeId
		});
	});

	$(nodeElement.querySelector(".node")).on("mouseout", function(e) {
		$(nodeElement).emit("node/mouse-out", {
			nodeId: nodeId
		})
	});

	var sockets = nodeElement.querySelectorAll(".socket");

	for(var i = 0; i < sockets.length; i++) {
		$(sockets[i]).on("mousedown", function(e) {
			$(nodeElement).emit("node/socket-selected", {
				socket: e.target
			});
		});

		$(sockets[i]).on("mouseup", function(e) {
			$(nodeElement).emit("node/socket-mouseup", {
				socket: e.target
			});
		});

		$(sockets[i]).on("mouseenter", function(e) {
			$(nodeElement).emit("node/socket-mouseover", {
				socket: e.target
			});
		});

		$(sockets[i]).on("mouseleave", function(e) {
			$(nodeElement).emit("node/socket-mouseout", {
				socket: e.target
			});
		});
	}
};

module.exports = {
	init: init
};
},{"./util":18}],16:[function(require,module,exports){
function dIsForDescription(fromSocket, to) {

    var d = [
        // m = MoveTo relative to group
        "m", 0, 0,
    ];

    var assumedStartingPointOfPath = _getConnectionPoint(fromSocket),
        delta = {
            x: to.x - assumedStartingPointOfPath.x,
            y: to.y - assumedStartingPointOfPath.y
        };

    var socketDirection = _getSocketDirection(fromSocket);

    if (socketDirection === "up") {
        d.push("v" + delta.y);

        if (delta.x < 0)
            d.push("a 5,5 0 0, 0 -5,-5");
        else
            d.push("a 5,5 0 0, 1 5,-5");

        d.push("h" + delta.x);
    }

    if (socketDirection === "right") {
        d.push("h" + delta.x);
        
        if (delta.y < 0)
            d.push("a 5,5 0 0, 0 5,-5");
        else
            d.push("a 5,5 0 0, 1 5,5");

        d.push("v" + delta.y);
    }

    if (socketDirection === "down") {
        d.push("v" + delta.y);
        
        if (delta.x < 0)
            d.push("a 5,5 0 0, 1 -5,5");
        else
            d.push("a 5,5 0 0, 0 5,5");

        d.push("h" + delta.x);
    }

    if (socketDirection === "left") {
        d.push("h" + delta.x);
        
        if (delta.y < 0)
            d.push("a 5,5 0 0, 1 -5,-5");
        else
            d.push("a 5,5 0 0, 0 -5,5");

        d.push("v" + delta.y);
    }

    return d.join(" ");
}

function _getConnectionPoint(socket) {

    var nodeTransform = socket.parentNode.getAttribute("transform"),
        nodeTransformValues = nodeTransform.match(/\d+, \d+/)[0].split(", "),
        nodeOffset = {
            x: +nodeTransformValues[0],
            y: +nodeTransformValues[1]
        };

    var socketOffset = {
        x: parseInt(socket.getAttribute("x"), 10),
        y: parseInt(socket.getAttribute("y"), 10)
    };

    var socketDirection = _getSocketDirection(socket),
        pixelPushX = socketDirection.match(/left/) ? 1 : 3;
        pixelPushY = socketDirection.match(/up/) ? 1 : 3;

    var startPosition = {
        x: nodeOffset.x + socketOffset.x + pixelPushX,
        y: nodeOffset.y + socketOffset.y + pixelPushY
    };

    return startPosition;
}

function _getSocketDirection(socket) {
    return socket.getAttribute("data-socket-direction");
}

module.exports = {
    pathDescriptionGenerator: dIsForDescription,
    getPointOfConnection: _getConnectionPoint,
};
},{}],17:[function(require,module,exports){
/**
* The SVG Maker is responsible for creating svg representations of
* entities in the model.
**/

var svgNameSpace = "http://www.w3.org/2000/svg",
	nodeEvents = require("./node-events"),
	pathFinder = require("./path-finder");

var defaults = { 
	node: { 
		width: 120,
		height: 60
	},
	socket: {
		width: 6,
		height: 6
	},
};

var createSvgRepresentationOfNode = function(node) {
	var frag 		= document.createDocumentFragment(),
		group 		= document.createElementNS(svgNameSpace, "g"),
		rect 		= document.createElementNS(svgNameSpace, "rect"),
		htmlHost	= document.createElementNS(svgNameSpace, "foreignObject"),
		textBox = document.createElement("div"),
		socketTop	= document.createElementNS(svgNameSpace, "rect"),
		socketRight	= document.createElementNS(svgNameSpace, "rect"),
		socketBottom	= document.createElementNS(svgNameSpace, "rect"),
		socketLeft	= document.createElementNS(svgNameSpace, "rect");

	var sockets = [socketTop, socketRight, socketBottom, socketLeft];

	rect.classList.add("node");
	rect.setAttribute("width", defaults.node.width.toString());
	rect.setAttribute("height", defaults.node.height.toString());
	rect.setAttribute("rx", "3");
	rect.setAttribute("ry", "3");

	// Insert at
	htmlHost.classList.add("node-html-host");
	htmlHost.setAttribute("x", 0);
	htmlHost.setAttribute("y", 0);
	htmlHost.setAttribute("width", defaults.node.width);
	htmlHost.setAttribute("height", defaults.node.height);
	textBox.classList.add("node-title");
	textBox.innerText = node.text;
	htmlHost.appendChild(textBox);

	sockets.forEach(function(socket) {
		socket.classList.add("socket");
		socket.setAttribute("width", defaults.socket.width);
		socket.setAttribute("height", defaults.socket.width);	
	});
	
	socketTop.setAttribute("x", (defaults.node.width / 2) - (defaults.socket.width / 2));
	socketTop.setAttribute("y", -(defaults.socket.height / 2));
	// Chromium does not support dataset on Element, only on HtmlElement
	socketTop.setAttribute("data-socket-direction", "up");

	socketRight.setAttribute("x", defaults.node.width - (defaults.socket.width / 2));
	socketRight.setAttribute("y", (defaults.node.height / 2) - (defaults.socket.height / 2));
	socketRight.setAttribute("data-socket-direction", "right");

	socketBottom.setAttribute("x", (defaults.node.width / 2) - (defaults.socket.width / 2));
	socketBottom.setAttribute("y", defaults.node.height - (defaults.socket.height / 2));
	socketBottom.setAttribute("data-socket-direction", "down");

	socketLeft.setAttribute("x", -(defaults.socket.width / 2));
	socketLeft.setAttribute("y", (defaults.node.height / 2) - (defaults.socket.height / 2));
	socketLeft.setAttribute("data-socket-direction", "left");

	group.appendChild(rect);
	group.appendChild(htmlHost);
	group.appendChild(socketTop);
	group.appendChild(socketRight);
	group.appendChild(socketBottom);
	group.appendChild(socketLeft);

	group.setAttribute("data-node-id", node.id);
	group.setAttribute("transform", "translate(" + node.position.x + ", " + node.position.y + ")");

	// Setup events for the node
	nodeEvents.init(group, node.id);

	frag.appendChild(group);

	return frag;
};

var createSvgRepresentationOfRelationship = function(from) {
	var frag	= document.createDocumentFragment(),
		group 	= document.createElementNS(svgNameSpace, "g"),
		path	= document.createElementNS(svgNameSpace, "path");
		
	group.setAttribute("transform", "translate(" + from.x + ", " + from.y + ")");

	path.classList.add("line", "evolving");

	var d = [
		// m = MoveTo relative to group
		"m", 0, 0,
	];

	path.setAttribute("d", d.join(" "));

	group.appendChild(path);
	frag.appendChild(group);
	return frag;	
};

var getDefaultNodeSize = function() {
	return defaults.node;
};

module.exports = {
	createSvgNode: createSvgRepresentationOfNode,
	createSvgRelationship: createSvgRepresentationOfRelationship,
	getDefaultNodeSize: getDefaultNodeSize
};
},{"./node-events":15,"./path-finder":16}],18:[function(require,module,exports){
module.exports = function(el) {
	function sub(name, cb) {
		this.addEventListener(name, cb);
	}

    function sub(eventName, cb) {
        
        if (this instanceof Node) {
            this.addEventListener(eventName, cb);
        }
        else if (this instanceof NodeList) {
            for (var i = 0; i < this.length; i++) {
                this[i].addEventListener(eventName, cb);
            };
        }
    }

    function pub(eventName, details) {

        if (this instanceof Node) {
            this.dispatchEvent(new CustomEvent(eventName, {
                bubbles: true,
                detail: details
            }));
        }
        else if (this instanceof NodeList) {
            for (var i = 0; i < this.length; i++) {
                this.dispatchEvent(new CustomEvent(eventName, {
                    bubbles: true,
                    detail: details
                }));
            };
        }
    }

    return { 
        on: sub.bind(nodeOrNodeList),
        emit: pub.bind(nodeOrNodeList)
    };
};
},{}],19:[function(require,module,exports){
/** 
* Returns the x and y values from a MouseEvent or a svg group element (that gets 
* its position via a css translate function).
*/

module.exports = function(obj) {
	// TODO: constructor.name is a ES6 feature currently not supported by IE
	var ctor = obj.constructor.name;

	if (ctor == "MouseEvent") {
		return {
			x: obj.clientX,
			y: obj.clientY
		};
	}

	if (ctor == "SVGGElement")
		return getTranslateValues(obj);
	else if (ctor == "SVGRectElement")
		return getXyValues(obj);
};

function getTranslateValues(el) {
	var str = el.getAttribute("transform");

	// Return zeros if no transalate function can be found.
	if (str.length < 14 || str.slice(0, 10) != "translate(")
		return { x: 0, y: 0 };

	var values = str.slice(10, -1).split(" ");

	return {
		x: parseInt(values[0]),
		y: parseInt(values[1])
	};
}

function getXyValues(el) {
	return {
		x: el.getAttribute("x"),
		y: el.getAttribute("y")
	};
}
},{}]},{},[12])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3Vzci9sb2NhbC9saWIvbm9kZV9tb2R1bGVzL3dhdGNoaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvY29tcG9uZW50LWVtaXR0ZXIvaW5kZXguanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvZXM2LWNvbGxlY3Rpb25zL3NyYy9lczYtY29sbGVjdGlvbnMuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcmVkdWNlLWNvbXBvbmVudC9pbmRleC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9zdXBlcmFnZW50L2xpYi9jbGllbnQuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvdXVpZC9idWZmZXItYnJvd3Nlci5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy91dWlkL3JuZy1icm93c2VyLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3V1aWQvdXVpZC5qcyIsImFtYmFzc2Fkb3IuanMiLCJkb20td2hpc3BlcmVyLmpzIiwia2V5Ym9hcmQtaW5wdXQuanMiLCJrZXlib2FyZC1zaG9ydGN1dHMuanMiLCJtYWluLmpzIiwibW9kZWwuanMiLCJtb3VzZS10cmFwcGVyLmpzIiwibm9kZS1ldmVudHMuanMiLCJwYXRoLWZpbmRlci5qcyIsInN2Zy1tYWtlci5qcyIsInV0aWwuanMiLCJ4eS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDcEtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQzFRQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6aENBO0FBQ0E7OztBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUMvQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNU9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIlxuLyoqXG4gKiBFeHBvc2UgYEVtaXR0ZXJgLlxuICovXG5cbm1vZHVsZS5leHBvcnRzID0gRW1pdHRlcjtcblxuLyoqXG4gKiBJbml0aWFsaXplIGEgbmV3IGBFbWl0dGVyYC5cbiAqXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmZ1bmN0aW9uIEVtaXR0ZXIob2JqKSB7XG4gIGlmIChvYmopIHJldHVybiBtaXhpbihvYmopO1xufTtcblxuLyoqXG4gKiBNaXhpbiB0aGUgZW1pdHRlciBwcm9wZXJ0aWVzLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmpcbiAqIEByZXR1cm4ge09iamVjdH1cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIG1peGluKG9iaikge1xuICBmb3IgKHZhciBrZXkgaW4gRW1pdHRlci5wcm90b3R5cGUpIHtcbiAgICBvYmpba2V5XSA9IEVtaXR0ZXIucHJvdG90eXBlW2tleV07XG4gIH1cbiAgcmV0dXJuIG9iajtcbn1cblxuLyoqXG4gKiBMaXN0ZW4gb24gdGhlIGdpdmVuIGBldmVudGAgd2l0aCBgZm5gLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cbiAqIEByZXR1cm4ge0VtaXR0ZXJ9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbkVtaXR0ZXIucHJvdG90eXBlLm9uID1cbkVtaXR0ZXIucHJvdG90eXBlLmFkZEV2ZW50TGlzdGVuZXIgPSBmdW5jdGlvbihldmVudCwgZm4pe1xuICB0aGlzLl9jYWxsYmFja3MgPSB0aGlzLl9jYWxsYmFja3MgfHwge307XG4gICh0aGlzLl9jYWxsYmFja3NbZXZlbnRdID0gdGhpcy5fY2FsbGJhY2tzW2V2ZW50XSB8fCBbXSlcbiAgICAucHVzaChmbik7XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBBZGRzIGFuIGBldmVudGAgbGlzdGVuZXIgdGhhdCB3aWxsIGJlIGludm9rZWQgYSBzaW5nbGVcbiAqIHRpbWUgdGhlbiBhdXRvbWF0aWNhbGx5IHJlbW92ZWQuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50XG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxuICogQHJldHVybiB7RW1pdHRlcn1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuRW1pdHRlci5wcm90b3R5cGUub25jZSA9IGZ1bmN0aW9uKGV2ZW50LCBmbil7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgdGhpcy5fY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzIHx8IHt9O1xuXG4gIGZ1bmN0aW9uIG9uKCkge1xuICAgIHNlbGYub2ZmKGV2ZW50LCBvbik7XG4gICAgZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfVxuXG4gIG9uLmZuID0gZm47XG4gIHRoaXMub24oZXZlbnQsIG9uKTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIFJlbW92ZSB0aGUgZ2l2ZW4gY2FsbGJhY2sgZm9yIGBldmVudGAgb3IgYWxsXG4gKiByZWdpc3RlcmVkIGNhbGxiYWNrcy5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gKiBAcmV0dXJuIHtFbWl0dGVyfVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5FbWl0dGVyLnByb3RvdHlwZS5vZmYgPVxuRW1pdHRlci5wcm90b3R5cGUucmVtb3ZlTGlzdGVuZXIgPVxuRW1pdHRlci5wcm90b3R5cGUucmVtb3ZlQWxsTGlzdGVuZXJzID1cbkVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUV2ZW50TGlzdGVuZXIgPSBmdW5jdGlvbihldmVudCwgZm4pe1xuICB0aGlzLl9jYWxsYmFja3MgPSB0aGlzLl9jYWxsYmFja3MgfHwge307XG5cbiAgLy8gYWxsXG4gIGlmICgwID09IGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICB0aGlzLl9jYWxsYmFja3MgPSB7fTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8vIHNwZWNpZmljIGV2ZW50XG4gIHZhciBjYWxsYmFja3MgPSB0aGlzLl9jYWxsYmFja3NbZXZlbnRdO1xuICBpZiAoIWNhbGxiYWNrcykgcmV0dXJuIHRoaXM7XG5cbiAgLy8gcmVtb3ZlIGFsbCBoYW5kbGVyc1xuICBpZiAoMSA9PSBhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgZGVsZXRlIHRoaXMuX2NhbGxiYWNrc1tldmVudF07XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvLyByZW1vdmUgc3BlY2lmaWMgaGFuZGxlclxuICB2YXIgY2I7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgY2FsbGJhY2tzLmxlbmd0aDsgaSsrKSB7XG4gICAgY2IgPSBjYWxsYmFja3NbaV07XG4gICAgaWYgKGNiID09PSBmbiB8fCBjYi5mbiA9PT0gZm4pIHtcbiAgICAgIGNhbGxiYWNrcy5zcGxpY2UoaSwgMSk7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIEVtaXQgYGV2ZW50YCB3aXRoIHRoZSBnaXZlbiBhcmdzLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFxuICogQHBhcmFtIHtNaXhlZH0gLi4uXG4gKiBAcmV0dXJuIHtFbWl0dGVyfVxuICovXG5cbkVtaXR0ZXIucHJvdG90eXBlLmVtaXQgPSBmdW5jdGlvbihldmVudCl7XG4gIHRoaXMuX2NhbGxiYWNrcyA9IHRoaXMuX2NhbGxiYWNrcyB8fCB7fTtcbiAgdmFyIGFyZ3MgPSBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSlcbiAgICAsIGNhbGxiYWNrcyA9IHRoaXMuX2NhbGxiYWNrc1tldmVudF07XG5cbiAgaWYgKGNhbGxiYWNrcykge1xuICAgIGNhbGxiYWNrcyA9IGNhbGxiYWNrcy5zbGljZSgwKTtcbiAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gY2FsbGJhY2tzLmxlbmd0aDsgaSA8IGxlbjsgKytpKSB7XG4gICAgICBjYWxsYmFja3NbaV0uYXBwbHkodGhpcywgYXJncyk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIFJldHVybiBhcnJheSBvZiBjYWxsYmFja3MgZm9yIGBldmVudGAuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50XG4gKiBAcmV0dXJuIHtBcnJheX1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuRW1pdHRlci5wcm90b3R5cGUubGlzdGVuZXJzID0gZnVuY3Rpb24oZXZlbnQpe1xuICB0aGlzLl9jYWxsYmFja3MgPSB0aGlzLl9jYWxsYmFja3MgfHwge307XG4gIHJldHVybiB0aGlzLl9jYWxsYmFja3NbZXZlbnRdIHx8IFtdO1xufTtcblxuLyoqXG4gKiBDaGVjayBpZiB0aGlzIGVtaXR0ZXIgaGFzIGBldmVudGAgaGFuZGxlcnMuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50XG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5FbWl0dGVyLnByb3RvdHlwZS5oYXNMaXN0ZW5lcnMgPSBmdW5jdGlvbihldmVudCl7XG4gIHJldHVybiAhISB0aGlzLmxpc3RlbmVycyhldmVudCkubGVuZ3RoO1xufTtcbiIsIihmdW5jdGlvbiAobW9kdWxlKSB7XCJ1c2Ugc3RyaWN0XCI7XG5cbiAgLy8hKEMpIFdlYlJlZmxlY3Rpb24gLSBNaXQgU3R5bGUgTGljZW5zZVxuICAvLyBzaXplIGFuZCBwZXJmb3JtYW5jZXMgb3JpZW50ZWQgcG9seWZpbGwgZm9yIEVTNlxuICAvLyBXZWFrTWFwLCBNYXAsIGFuZCBTZXRcbiAgLy8gY29tcGF0aWJsZSB3aXRoIG5vZGUuanMsIFJoaW5vLCBhbnkgYnJvd3NlclxuICAvLyBkb2VzIG5vdCBpbXBsZW1lbnQgZGVmYXVsdCB2YXVsZSBkdXJpbmcgd20uZ2V0KClcbiAgLy8gc2luY2UgRVMubmV4dCB3b24ndCBwcm9iYWJseSBkbyB0aGF0XG4gIC8vIHVzZSB3bS5oYXMobykgPyB3bS5nZXQobykgOiBkM2ZhdWx0OyBpbnN0ZWFkXG5cbiAgLy8gV2Vha01hcCh2b2lkKTpXZWFrTWFwXG4gIGZ1bmN0aW9uIFdlYWtNYXAoKSB7XG5cbiAgICAvLyBwcml2YXRlIHJlZmVyZW5jZXMgaG9sZGVyc1xuICAgIHZhclxuICAgICAga2V5cyA9IFtdLFxuICAgICAgdmFsdWVzID0gW11cbiAgICA7XG5cbiAgICAvLyByZXR1cm5zIGZyZXNobHkgbmV3IGNyZWF0ZWRcbiAgICAvLyBpbnN0YW5jZW9mIFdlYWtNYXAgaW4gYW55IGNhc2VcbiAgICByZXR1cm4gY3JlYXRlKFdlYWtNYXBQcm90b3R5cGUsIHtcbiAgICAgIC8vIFdlYWtNYXAjZGVsZXRlKGtleTp2b2lkKik6Ym9vbGVhblxuICAgICAgXCJkZWxldGVcIjoge3ZhbHVlOiBiaW5kLmNhbGwoc2hhcmVkRGVsLCBOVUxMLCBUUlVFLCBrZXlzLCB2YWx1ZXMpfSxcbiAgICAgIC8vOndhcyBXZWFrTWFwI2dldChrZXk6dm9pZCpbLCBkM2ZhdWx0OnZvaWQqXSk6dm9pZCpcbiAgICAgIC8vIFdlYWtNYXAjZ2V0KGtleTp2b2lkKik6dm9pZCpcbiAgICAgIGdldDogICAgICB7dmFsdWU6IGJpbmQuY2FsbChzaGFyZWRHZXQsIE5VTEwsIFRSVUUsIGtleXMsIHZhbHVlcyl9LFxuICAgICAgLy8gV2Vha01hcCNoYXMoa2V5OnZvaWQqKTpib29sZWFuXG4gICAgICBoYXM6ICAgICAge3ZhbHVlOiBiaW5kLmNhbGwoc2hhcmVkSGFzLCBOVUxMLCBUUlVFLCBrZXlzLCB2YWx1ZXMpfSxcbiAgICAgIC8vIFdlYWtNYXAjc2V0KGtleTp2b2lkKiwgdmFsdWU6dm9pZCopOnZvaWRcbiAgICAgIHNldDogICAgICB7dmFsdWU6IGJpbmQuY2FsbChzaGFyZWRTZXQsIE5VTEwsIFRSVUUsIGtleXMsIHZhbHVlcyl9XG4gICAgfSk7XG5cbiAgfVxuXG4gIC8vIE1hcCh2b2lkKTpNYXBcbiAgZnVuY3Rpb24gTWFwKCkge1xuXG4gICAgLy8gcHJpdmF0ZSByZWZlcmVuY2VzIGhvbGRlcnNcbiAgICB2YXJcbiAgICAgIGtleXMgPSBbXSxcbiAgICAgIHZhbHVlcyA9IFtdXG4gICAgO1xuXG4gICAgLy8gcmV0dXJucyBmcmVzaGx5IG5ldyBjcmVhdGVkXG4gICAgLy8gaW5zdGFuY2VvZiBXZWFrTWFwIGluIGFueSBjYXNlXG4gICAgcmV0dXJuIGNyZWF0ZShNYXBQcm90b3R5cGUsIHtcbiAgICAgIC8vIE1hcCNkZWxldGUoa2V5OnZvaWQqKTpib29sZWFuXG4gICAgICBcImRlbGV0ZVwiOiB7dmFsdWU6IGJpbmQuY2FsbChzaGFyZWREZWwsIE5VTEwsIEZBTFNFLCBrZXlzLCB2YWx1ZXMpfSxcbiAgICAgIC8vOndhcyBNYXAjZ2V0KGtleTp2b2lkKlssIGQzZmF1bHQ6dm9pZCpdKTp2b2lkKlxuICAgICAgLy8gTWFwI2dldChrZXk6dm9pZCopOnZvaWQqXG4gICAgICBnZXQ6ICAgICAge3ZhbHVlOiBiaW5kLmNhbGwoc2hhcmVkR2V0LCBOVUxMLCBGQUxTRSwga2V5cywgdmFsdWVzKX0sXG4gICAgICAvLyBNYXAjaGFzKGtleTp2b2lkKik6Ym9vbGVhblxuICAgICAgaGFzOiAgICAgIHt2YWx1ZTogYmluZC5jYWxsKHNoYXJlZEhhcywgTlVMTCwgRkFMU0UsIGtleXMsIHZhbHVlcyl9LFxuICAgICAgLy8gTWFwI3NldChrZXk6dm9pZCosIHZhbHVlOnZvaWQqKTp2b2lkXG4gICAgICBzZXQ6ICAgICAge3ZhbHVlOiBiaW5kLmNhbGwoc2hhcmVkU2V0LCBOVUxMLCBGQUxTRSwga2V5cywgdmFsdWVzKX1cbiAgICAgIC8qLFxuICAgICAgLy8gTWFwI3NpemUodm9pZCk6bnVtYmVyID09PSBNb3ppbGxhIG9ubHkgc28gZmFyXG4gICAgICBzaXplOiAgICAge3ZhbHVlOiBiaW5kLmNhbGwoc2hhcmVkU2l6ZSwgTlVMTCwga2V5cyl9LFxuICAgICAgLy8gTWFwI2tleXModm9pZCk6QXJyYXkgPT09IG5vdCBpbiBzcGVjc1xuICAgICAga2V5czogICAgIHt2YWx1ZTogYm91bmRTbGljZShrZXlzKX0sXG4gICAgICAvLyBNYXAjdmFsdWVzKHZvaWQpOkFycmF5ID09PSBub3QgaW4gc3BlY3NcbiAgICAgIHZhbHVlczogICB7dmFsdWU6IGJvdW5kU2xpY2UodmFsdWVzKX0sXG4gICAgICAvLyBNYXAjaXRlcmF0ZShjYWxsYmFjazpGdW5jdGlvbiwgY29udGV4dDp2b2lkKik6dm9pZCA9PT4gY2FsbGJhY2suY2FsbChjb250ZXh0LCBrZXksIHZhbHVlLCBpbmRleCkgPT09IG5vdCBpbiBzcGVjc1xuICAgICAgaXRlcmF0ZTogIHt2YWx1ZTogYmluZC5jYWxsKHNoYXJlZEl0ZXJhdGUsIE5VTEwsIEZBTFNFLCBrZXlzLCB2YWx1ZXMpfVxuICAgICAgLy8qL1xuICAgIH0pO1xuXG4gIH1cblxuICAvLyBTZXQodm9pZCk6U2V0XG4gIC8qKlxuICAgKiB0byBiZSByZWFsbHkgaG9uZXN0LCBJIHdvdWxkIHJhdGhlciBwb2xsdXRlIEFycmF5LnByb3RvdHlwZVxuICAgKiBpbiBvcmRlciB0byBoYXZlIFNldCBsaWtlIGJlaGF2aW9yXG4gICAqIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKEFycmF5LnByb3RvdHlwZSwge1xuICAgKiAgIGFkZDoge3ZhbHVlOiBmdW5jdGlvbiBhZGQodmFsdWUpIHtcbiAgICogICAgIHJldHVybiAtMSA8IHRoaXMuaW5kZXhPZih2YWx1ZSkgJiYgISF0aGlzLnB1c2godmFsdWUpO1xuICAgKiAgIH19XG4gICAqICAgaGFzOiB7dmFsdWU6IGZ1bmN0aW9uIGhhcyh2YWx1ZSkge1xuICAgKiAgICAgcmV0dXJuIC0xIDwgdGhpcy5pbmRleE9mKHZhbHVlKTtcbiAgICogICB9fVxuICAgKiAgIGRlbGV0ZToge3ZhbHVlOiBmdW5jdGlvbiBkZWxldGUodmFsdWUpIHtcbiAgICogICAgIHZhciBpID0gdGhpcy5pbmRleE9mKHZhbHVlKTtcbiAgICogICAgIHJldHVybiAtMSA8IGkgJiYgISF0aGlzLnNwbGljZShpLCAxKTtcbiAgICogICB9fVxuICAgKiB9KTtcbiAgICogLi4uIGFueXdheSAuLi5cbiAgICovXG4gIGZ1bmN0aW9uIFNldCgpIHtcbiAgICB2YXJcbiAgICAgIGtleXMgPSBbXSwgIC8vIHBsYWNlaG9sZGVyIHVzZWQgc2ltcGx5IHRvIHJlY3ljbGUgZnVuY3Rpb25zXG4gICAgICB2YWx1ZXMgPSBbXSwvLyByZWFsIHN0b3JhZ2VcbiAgICAgIGhhcyA9IGJpbmQuY2FsbChzaGFyZWRIYXMsIE5VTEwsIEZBTFNFLCB2YWx1ZXMsIGtleXMpXG4gICAgO1xuICAgIHJldHVybiBjcmVhdGUoU2V0UHJvdG90eXBlLCB7XG4gICAgICAvLyBTZXQjZGVsZXRlKHZhbHVlOnZvaWQqKTpib29sZWFuXG4gICAgICBcImRlbGV0ZVwiOiB7dmFsdWU6IGJpbmQuY2FsbChzaGFyZWREZWwsIE5VTEwsIEZBTFNFLCB2YWx1ZXMsIGtleXMpfSxcbiAgICAgIC8vIFNldCNoYXModmFsdWU6dm9pZCopOmJvb2xlYW5cbiAgICAgIGhhczogICAgICB7dmFsdWU6IGhhc30sXG4gICAgICAvLyBTZXQjYWRkKHZhbHVlOnZvaWQqKTpib29sZWFuXG4gICAgICBhZGQ6ICAgICAge3ZhbHVlOiBiaW5kLmNhbGwoU2V0X2FkZCwgTlVMTCwgRkFMU0UsIGhhcywgdmFsdWVzKX1cbiAgICAgIC8qLFxuICAgICAgLy8gTWFwI3NpemUodm9pZCk6bnVtYmVyID09PSBNb3ppbGxhIG9ubHlcbiAgICAgIHNpemU6ICAgICB7dmFsdWU6IGJpbmQuY2FsbChzaGFyZWRTaXplLCBOVUxMLCB2YWx1ZXMpfSxcbiAgICAgIC8vIFNldCN2YWx1ZXModm9pZCk6QXJyYXkgPT09IG5vdCBpbiBzcGVjc1xuICAgICAgdmFsdWVzOiAgIHt2YWx1ZTogYm91bmRTbGljZSh2YWx1ZXMpfSxcbiAgICAgIC8vIFNldCNpdGVyYXRlKGNhbGxiYWNrOkZ1bmN0aW9uLCBjb250ZXh0OnZvaWQqKTp2b2lkID09PiBjYWxsYmFjay5jYWxsKGNvbnRleHQsIHZhbHVlLCBpbmRleCkgPT09IG5vdCBpbiBzcGVjc1xuICAgICAgaXRlcmF0ZTogIHt2YWx1ZTogYmluZC5jYWxsKFNldF9pdGVyYXRlLCBOVUxMLCBGQUxTRSwgTlVMTCwgdmFsdWVzKX1cbiAgICAgIC8vKi9cbiAgICB9KTtcbiAgfVxuXG4gIC8vIGNvbW1vbiBzaGFyZWQgbWV0aG9kIHJlY3ljbGVkIGZvciBhbGwgc2hpbXMgdGhyb3VnaCBiaW5kXG4gIGZ1bmN0aW9uIHNoYXJlZERlbChvYmplY3RPbmx5LCBrZXlzLCB2YWx1ZXMsIGtleSkge1xuICAgIGlmIChzaGFyZWRIYXMob2JqZWN0T25seSwga2V5cywgdmFsdWVzLCBrZXkpKSB7XG4gICAgICBrZXlzLnNwbGljZShpLCAxKTtcbiAgICAgIHZhbHVlcy5zcGxpY2UoaSwgMSk7XG4gICAgfVxuICAgIC8vIEF1cm9yYSBoZXJlIGRvZXMgaXQgd2hpbGUgQ2FuYXJ5IGRvZXNuJ3RcbiAgICByZXR1cm4gLTEgPCBpO1xuICB9XG5cbiAgZnVuY3Rpb24gc2hhcmVkR2V0KG9iamVjdE9ubHksIGtleXMsIHZhbHVlcywga2V5LyosIGQzZmF1bHQqLykge1xuICAgIHJldHVybiBzaGFyZWRIYXMob2JqZWN0T25seSwga2V5cywgdmFsdWVzLCBrZXkpID8gdmFsdWVzW2ldIDogdW5kZWZpbmVkOyAvL2QzZmF1bHQ7XG4gIH1cblxuICBmdW5jdGlvbiBzaGFyZWRIYXMob2JqZWN0T25seSwga2V5cywgdmFsdWVzLCBrZXkpIHtcbiAgICBpZiAob2JqZWN0T25seSAmJiBrZXkgIT09IE9iamVjdChrZXkpKVxuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIm5vdCBhIG5vbi1udWxsIG9iamVjdFwiKVxuICAgIDtcbiAgICBpID0gYmV0dGVySW5kZXhPZi5jYWxsKGtleXMsIGtleSk7XG4gICAgcmV0dXJuIC0xIDwgaTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNoYXJlZFNldChvYmplY3RPbmx5LCBrZXlzLCB2YWx1ZXMsIGtleSwgdmFsdWUpIHtcbiAgICAvKiByZXR1cm4gKi9zaGFyZWRIYXMob2JqZWN0T25seSwga2V5cywgdmFsdWVzLCBrZXkpID9cbiAgICAgIHZhbHVlc1tpXSA9IHZhbHVlXG4gICAgICA6XG4gICAgICB2YWx1ZXNba2V5cy5wdXNoKGtleSkgLSAxXSA9IHZhbHVlXG4gICAgO1xuICB9XG5cbiAgLyoga2V5cywgdmFsdWVzLCBhbmQgaXRlcmF0ZSByZWxhdGVkIG1ldGhvZHNcbiAgZnVuY3Rpb24gYm91bmRTbGljZSh2YWx1ZXMpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIHNsaWNlLmNhbGwodmFsdWVzKTtcbiAgICB9O1xuICB9XG5cbiAgZnVuY3Rpb24gc2hhcmVkU2l6ZShrZXlzKSB7XG4gICAgcmV0dXJuIGtleXMubGVuZ3RoO1xuICB9XG5cbiAgZnVuY3Rpb24gc2hhcmVkSXRlcmF0ZShvYmplY3RPbmx5LCBrZXlzLCB2YWx1ZXMsIGNhbGxiYWNrLCBjb250ZXh0KSB7XG4gICAgZm9yICh2YXJcbiAgICAgIGsgPSBzbGljZS5jYWxsKGtleXMpLCB2ID0gc2xpY2UuY2FsbCh2YWx1ZXMpLFxuICAgICAgaSA9IDAsIGxlbmd0aCA9IGsubGVuZ3RoO1xuICAgICAgaSA8IGxlbmd0aDsgY2FsbGJhY2suY2FsbChjb250ZXh0LCBrW2ldLCB2W2ldLCBpKyspXG4gICAgKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIFNldF9pdGVyYXRlKG9iamVjdE9ubHksIGtleXMsIHZhbHVlcywgY2FsbGJhY2ssIGNvbnRleHQpIHtcbiAgICBmb3IgKHZhclxuICAgICAgdiA9IHNsaWNlLmNhbGwodmFsdWVzKSxcbiAgICAgIGkgPSAwLCBsZW5ndGggPSB2Lmxlbmd0aDtcbiAgICAgIGkgPCBsZW5ndGg7IGNhbGxiYWNrLmNhbGwoY29udGV4dCwgdltpXSwgaSsrKVxuICAgICk7XG4gIH1cbiAgLy8qL1xuXG4gIC8vIFNldCNhZGQgcmVjeWNsZWQgdGhyb3VnaCBiaW5kIHBlciBlYWNoIGluc3RhbmNlb2YgU2V0XG4gIGZ1bmN0aW9uIFNldF9hZGQob2JqZWN0T25seSwgaGFzLCB2YWx1ZXMsIHZhbHVlKSB7XG4gICAgLypyZXR1cm4gKi8oIWhhcyh2YWx1ZSkgJiYgISF2YWx1ZXMucHVzaCh2YWx1ZSkpO1xuICB9XG5cbiAgLy8gYSBtb3JlIHJlbGlhYmxlIGluZGV4T2ZcbiAgZnVuY3Rpb24gYmV0dGVySW5kZXhPZih2YWx1ZSkge1xuICAgIGlmICh2YWx1ZSAhPSB2YWx1ZSB8fCB2YWx1ZSA9PT0gMCkge1xuICAgICAgZm9yIChpID0gdGhpcy5sZW5ndGg7IGktLSAmJiAhaXModGhpc1tpXSwgdmFsdWUpOyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGkgPSBpbmRleE9mLmNhbGwodGhpcywgdmFsdWUpO1xuICAgIH1cbiAgICByZXR1cm4gaTtcbiAgfVxuXG4gIC8vIG5lZWQgZm9yIGFuIGVtcHR5IGNvbnN0cnVjdG9yIC4uLlxuICBmdW5jdGlvbiBDb25zdHJ1Y3Rvcigpe30gIC8vIEdDJ2VkIGlmICEhT2JqZWN0LmNyZWF0ZVxuICAvLyAuLi4gc28gdGhhdCBuZXcgV2Vha01hcEluc3RhbmNlIGFuZCBuZXcgV2Vha01hcFxuICAvLyBwcm9kdWNlcyBib3RoIGFuIGluc3RhbmNlb2YgV2Vha01hcFxuXG4gIHZhclxuICAgIC8vIHNob3J0Y3V0cyBhbmQgLi4uXG4gICAgTlVMTCA9IG51bGwsIFRSVUUgPSB0cnVlLCBGQUxTRSA9IGZhbHNlLFxuICAgIG5vdEluTm9kZSA9IG1vZHVsZSA9PSBcInVuZGVmaW5lZFwiLFxuICAgIHdpbmRvdyA9IG5vdEluTm9kZSA/IHRoaXMgOiBnbG9iYWwsXG4gICAgbW9kdWxlID0gbm90SW5Ob2RlID8ge30gOiBleHBvcnRzLFxuICAgIE9iamVjdCA9IHdpbmRvdy5PYmplY3QsXG4gICAgV2Vha01hcFByb3RvdHlwZSA9IFdlYWtNYXAucHJvdG90eXBlLFxuICAgIE1hcFByb3RvdHlwZSA9IE1hcC5wcm90b3R5cGUsXG4gICAgU2V0UHJvdG90eXBlID0gU2V0LnByb3RvdHlwZSxcbiAgICBkZWZpbmVQcm9wZXJ0eSA9IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSxcbiAgICBzbGljZSA9IFtdLnNsaWNlLFxuXG4gICAgLy8gT2JqZWN0LmlzKGEsIGIpIHNoaW1cbiAgICBpcyA9IE9iamVjdC5pcyB8fCBmdW5jdGlvbiAoYSwgYikge1xuICAgICAgcmV0dXJuIGEgPT09IGIgP1xuICAgICAgICBhICE9PSAwIHx8IDEgLyBhID09IDEgLyBiIDpcbiAgICAgICAgYSAhPSBhICYmIGIgIT0gYlxuICAgICAgO1xuICAgIH0sXG5cbiAgICAvLyBwYXJ0aWFsIHBvbHlmaWxsIGZvciB0aGlzIGFpbSBvbmx5XG4gICAgYmluZCA9IFdlYWtNYXAuYmluZCB8fCBmdW5jdGlvbiBiaW5kKGNvbnRleHQsIG9iamVjdE9ubHksIGtleXMsIHZhbHVlcykge1xuICAgICAgLy8gcGFydGlhbCBmYXN0IGFkLWhvYyBGdW5jdGlvbiNiaW5kIHBvbHlmaWxsIGlmIG5vdCBhdmFpbGFibGVcbiAgICAgIHZhciBjYWxsYmFjayA9IHRoaXM7XG4gICAgICByZXR1cm4gZnVuY3Rpb24gYm91bmQoa2V5LCB2YWx1ZSkge1xuICAgICAgICByZXR1cm4gY2FsbGJhY2suY2FsbChjb250ZXh0LCBvYmplY3RPbmx5LCBrZXlzLCB2YWx1ZXMsIGtleSwgdmFsdWUpO1xuICAgICAgfTtcbiAgICB9LFxuXG4gICAgY3JlYXRlID0gT2JqZWN0LmNyZWF0ZSB8fCBmdW5jdGlvbiBjcmVhdGUocHJvdG8sIGRlc2NyaXB0b3IpIHtcbiAgICAgIC8vIHBhcnRpYWwgYWQtaG9jIE9iamVjdC5jcmVhdGUgc2hpbSBpZiBub3QgYXZhaWxhYmxlXG4gICAgICBDb25zdHJ1Y3Rvci5wcm90b3R5cGUgPSBwcm90bztcbiAgICAgIHZhciBvYmplY3QgPSBuZXcgQ29uc3RydWN0b3IsIGtleTtcbiAgICAgIGZvciAoa2V5IGluIGRlc2NyaXB0b3IpIHtcbiAgICAgICAgb2JqZWN0W2tleV0gPSBkZXNjcmlwdG9yW2tleV0udmFsdWU7XG4gICAgICB9XG4gICAgICByZXR1cm4gb2JqZWN0O1xuICAgIH0sXG5cbiAgICBpbmRleE9mID0gW10uaW5kZXhPZiB8fCBmdW5jdGlvbiBpbmRleE9mKHZhbHVlKSB7XG4gICAgICAvLyBwYXJ0aWFsIGZhc3QgQXJyYXkjaW5kZXhPZiBwb2x5ZmlsbCBpZiBub3QgYXZhaWxhYmxlXG4gICAgICBmb3IgKGkgPSB0aGlzLmxlbmd0aDsgaS0tICYmIHRoaXNbaV0gIT09IHZhbHVlOyk7XG4gICAgICByZXR1cm4gaTtcbiAgICB9LFxuXG4gICAgdW5kZWZpbmVkLFxuICAgIGkgLy8gcmVjeWNsZSBBTEwgdGhlIHZhcmlhYmxlcyAhXG4gIDtcblxuICAvLyB+aW5kZXhPZi5jYWxsKFtOYU5dLCBOYU4pIGFzIGZ1dHVyZSBwb3NzaWJsZSBmZWF0dXJlIGRldGVjdGlvblxuXG4gIC8vIHVzZWQgdG8gZm9sbG93IEZGIGJlaGF2aW9yIHdoZXJlIFdlYWtNYXAucHJvdG90eXBlIGlzIGEgV2Vha01hcCBpdHNlbGZcbiAgV2Vha01hcC5wcm90b3R5cGUgPSBXZWFrTWFwUHJvdG90eXBlID0gV2Vha01hcCgpO1xuICBNYXAucHJvdG90eXBlID0gTWFwUHJvdG90eXBlID0gTWFwKCk7XG4gIFNldC5wcm90b3R5cGUgPSBTZXRQcm90b3R5cGUgPSBTZXQoKTtcblxuICAvLyBhc3NpZ24gaXQgdG8gdGhlIGdsb2JhbCBjb250ZXh0XG4gIC8vIGlmIGFscmVhZHkgdGhlcmUsIGUuZy4gaW4gbm9kZSwgZXhwb3J0IG5hdGl2ZVxuICB3aW5kb3cuV2Vha01hcCA9IG1vZHVsZS5XZWFrTWFwID0gd2luZG93LldlYWtNYXAgfHwgV2Vha01hcDtcbiAgd2luZG93Lk1hcCA9IG1vZHVsZS5NYXAgPSB3aW5kb3cuTWFwIHx8IE1hcDtcbiAgd2luZG93LlNldCA9IG1vZHVsZS5TZXQgPSB3aW5kb3cuU2V0IHx8IFNldDtcblxuICAvKiBwcm9iYWJseSBub3QgbmVlZGVkLCBhZGQgYSBzbGFzaCB0byBlbnN1cmUgbm9uIGNvbmZpZ3VyYWJsZSBhbmQgbm9uIHdyaXRhYmxlXG4gIGlmIChkZWZpbmVQcm9wZXJ0eSkge1xuICAgIGRlZmluZVByb3BlcnR5KHdpbmRvdywgXCJXZWFrTWFwXCIsIHt2YWx1ZTogV2Vha01hcH0pO1xuICAgIGRlZmluZVByb3BlcnR5KHdpbmRvdywgXCJNYXBcIiwge3ZhbHVlOiBNYXB9KTtcbiAgICBkZWZpbmVQcm9wZXJ0eSh3aW5kb3csIFwiU2V0XCIsIHt2YWx1ZTogU2V0fSk7XG4gIH1cbiAgLy8qL1xuXG4gIC8vIHRoYXQncyBwcmV0dHkgbXVjaCBpdFxuXG59LmNhbGwoXG4gIHRoaXMsXG4gIHR5cGVvZiBleHBvcnRzXG4pKTsiLCJcbi8qKlxuICogUmVkdWNlIGBhcnJgIHdpdGggYGZuYC5cbiAqXG4gKiBAcGFyYW0ge0FycmF5fSBhcnJcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gKiBAcGFyYW0ge01peGVkfSBpbml0aWFsXG4gKlxuICogVE9ETzogY29tYmF0aWJsZSBlcnJvciBoYW5kbGluZz9cbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGFyciwgZm4sIGluaXRpYWwpeyAgXG4gIHZhciBpZHggPSAwO1xuICB2YXIgbGVuID0gYXJyLmxlbmd0aDtcbiAgdmFyIGN1cnIgPSBhcmd1bWVudHMubGVuZ3RoID09IDNcbiAgICA/IGluaXRpYWxcbiAgICA6IGFycltpZHgrK107XG5cbiAgd2hpbGUgKGlkeCA8IGxlbikge1xuICAgIGN1cnIgPSBmbi5jYWxsKG51bGwsIGN1cnIsIGFycltpZHhdLCArK2lkeCwgYXJyKTtcbiAgfVxuICBcbiAgcmV0dXJuIGN1cnI7XG59OyIsIi8qKlxuICogTW9kdWxlIGRlcGVuZGVuY2llcy5cbiAqL1xuXG52YXIgRW1pdHRlciA9IHJlcXVpcmUoJ2VtaXR0ZXInKTtcbnZhciByZWR1Y2UgPSByZXF1aXJlKCdyZWR1Y2UnKTtcblxuLyoqXG4gKiBSb290IHJlZmVyZW5jZSBmb3IgaWZyYW1lcy5cbiAqL1xuXG52YXIgcm9vdCA9ICd1bmRlZmluZWQnID09IHR5cGVvZiB3aW5kb3dcbiAgPyB0aGlzXG4gIDogd2luZG93O1xuXG4vKipcbiAqIE5vb3AuXG4gKi9cblxuZnVuY3Rpb24gbm9vcCgpe307XG5cbi8qKlxuICogQ2hlY2sgaWYgYG9iamAgaXMgYSBob3N0IG9iamVjdCxcbiAqIHdlIGRvbid0IHdhbnQgdG8gc2VyaWFsaXplIHRoZXNlIDopXG4gKlxuICogVE9ETzogZnV0dXJlIHByb29mLCBtb3ZlIHRvIGNvbXBvZW50IGxhbmRcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gaXNIb3N0KG9iaikge1xuICB2YXIgc3RyID0ge30udG9TdHJpbmcuY2FsbChvYmopO1xuXG4gIHN3aXRjaCAoc3RyKSB7XG4gICAgY2FzZSAnW29iamVjdCBGaWxlXSc6XG4gICAgY2FzZSAnW29iamVjdCBCbG9iXSc6XG4gICAgY2FzZSAnW29iamVjdCBGb3JtRGF0YV0nOlxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgfVxufVxuXG4vKipcbiAqIERldGVybWluZSBYSFIuXG4gKi9cblxuZnVuY3Rpb24gZ2V0WEhSKCkge1xuICBpZiAocm9vdC5YTUxIdHRwUmVxdWVzdFxuICAgICYmICgnZmlsZTonICE9IHJvb3QubG9jYXRpb24ucHJvdG9jb2wgfHwgIXJvb3QuQWN0aXZlWE9iamVjdCkpIHtcbiAgICByZXR1cm4gbmV3IFhNTEh0dHBSZXF1ZXN0O1xuICB9IGVsc2Uge1xuICAgIHRyeSB7IHJldHVybiBuZXcgQWN0aXZlWE9iamVjdCgnTWljcm9zb2Z0LlhNTEhUVFAnKTsgfSBjYXRjaChlKSB7fVxuICAgIHRyeSB7IHJldHVybiBuZXcgQWN0aXZlWE9iamVjdCgnTXN4bWwyLlhNTEhUVFAuNi4wJyk7IH0gY2F0Y2goZSkge31cbiAgICB0cnkgeyByZXR1cm4gbmV3IEFjdGl2ZVhPYmplY3QoJ01zeG1sMi5YTUxIVFRQLjMuMCcpOyB9IGNhdGNoKGUpIHt9XG4gICAgdHJ5IHsgcmV0dXJuIG5ldyBBY3RpdmVYT2JqZWN0KCdNc3htbDIuWE1MSFRUUCcpOyB9IGNhdGNoKGUpIHt9XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG4vKipcbiAqIFJlbW92ZXMgbGVhZGluZyBhbmQgdHJhaWxpbmcgd2hpdGVzcGFjZSwgYWRkZWQgdG8gc3VwcG9ydCBJRS5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gc1xuICogQHJldHVybiB7U3RyaW5nfVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxudmFyIHRyaW0gPSAnJy50cmltXG4gID8gZnVuY3Rpb24ocykgeyByZXR1cm4gcy50cmltKCk7IH1cbiAgOiBmdW5jdGlvbihzKSB7IHJldHVybiBzLnJlcGxhY2UoLyheXFxzKnxcXHMqJCkvZywgJycpOyB9O1xuXG4vKipcbiAqIENoZWNrIGlmIGBvYmpgIGlzIGFuIG9iamVjdC5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gaXNPYmplY3Qob2JqKSB7XG4gIHJldHVybiBvYmogPT09IE9iamVjdChvYmopO1xufVxuXG4vKipcbiAqIFNlcmlhbGl6ZSB0aGUgZ2l2ZW4gYG9iamAuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9ialxuICogQHJldHVybiB7U3RyaW5nfVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gc2VyaWFsaXplKG9iaikge1xuICBpZiAoIWlzT2JqZWN0KG9iaikpIHJldHVybiBvYmo7XG4gIHZhciBwYWlycyA9IFtdO1xuICBmb3IgKHZhciBrZXkgaW4gb2JqKSB7XG4gICAgaWYgKG51bGwgIT0gb2JqW2tleV0pIHtcbiAgICAgIHBhaXJzLnB1c2goZW5jb2RlVVJJQ29tcG9uZW50KGtleSlcbiAgICAgICAgKyAnPScgKyBlbmNvZGVVUklDb21wb25lbnQob2JqW2tleV0pKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHBhaXJzLmpvaW4oJyYnKTtcbn1cblxuLyoqXG4gKiBFeHBvc2Ugc2VyaWFsaXphdGlvbiBtZXRob2QuXG4gKi9cblxuIHJlcXVlc3Quc2VyaWFsaXplT2JqZWN0ID0gc2VyaWFsaXplO1xuXG4gLyoqXG4gICogUGFyc2UgdGhlIGdpdmVuIHgtd3d3LWZvcm0tdXJsZW5jb2RlZCBgc3RyYC5cbiAgKlxuICAqIEBwYXJhbSB7U3RyaW5nfSBzdHJcbiAgKiBAcmV0dXJuIHtPYmplY3R9XG4gICogQGFwaSBwcml2YXRlXG4gICovXG5cbmZ1bmN0aW9uIHBhcnNlU3RyaW5nKHN0cikge1xuICB2YXIgb2JqID0ge307XG4gIHZhciBwYWlycyA9IHN0ci5zcGxpdCgnJicpO1xuICB2YXIgcGFydHM7XG4gIHZhciBwYWlyO1xuXG4gIGZvciAodmFyIGkgPSAwLCBsZW4gPSBwYWlycy5sZW5ndGg7IGkgPCBsZW47ICsraSkge1xuICAgIHBhaXIgPSBwYWlyc1tpXTtcbiAgICBwYXJ0cyA9IHBhaXIuc3BsaXQoJz0nKTtcbiAgICBvYmpbZGVjb2RlVVJJQ29tcG9uZW50KHBhcnRzWzBdKV0gPSBkZWNvZGVVUklDb21wb25lbnQocGFydHNbMV0pO1xuICB9XG5cbiAgcmV0dXJuIG9iajtcbn1cblxuLyoqXG4gKiBFeHBvc2UgcGFyc2VyLlxuICovXG5cbnJlcXVlc3QucGFyc2VTdHJpbmcgPSBwYXJzZVN0cmluZztcblxuLyoqXG4gKiBEZWZhdWx0IE1JTUUgdHlwZSBtYXAuXG4gKlxuICogICAgIHN1cGVyYWdlbnQudHlwZXMueG1sID0gJ2FwcGxpY2F0aW9uL3htbCc7XG4gKlxuICovXG5cbnJlcXVlc3QudHlwZXMgPSB7XG4gIGh0bWw6ICd0ZXh0L2h0bWwnLFxuICBqc29uOiAnYXBwbGljYXRpb24vanNvbicsXG4gIHhtbDogJ2FwcGxpY2F0aW9uL3htbCcsXG4gIHVybGVuY29kZWQ6ICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnLFxuICAnZm9ybSc6ICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnLFxuICAnZm9ybS1kYXRhJzogJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCdcbn07XG5cbi8qKlxuICogRGVmYXVsdCBzZXJpYWxpemF0aW9uIG1hcC5cbiAqXG4gKiAgICAgc3VwZXJhZ2VudC5zZXJpYWxpemVbJ2FwcGxpY2F0aW9uL3htbCddID0gZnVuY3Rpb24ob2JqKXtcbiAqICAgICAgIHJldHVybiAnZ2VuZXJhdGVkIHhtbCBoZXJlJztcbiAqICAgICB9O1xuICpcbiAqL1xuXG4gcmVxdWVzdC5zZXJpYWxpemUgPSB7XG4gICAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJzogc2VyaWFsaXplLFxuICAgJ2FwcGxpY2F0aW9uL2pzb24nOiBKU09OLnN0cmluZ2lmeVxuIH07XG5cbiAvKipcbiAgKiBEZWZhdWx0IHBhcnNlcnMuXG4gICpcbiAgKiAgICAgc3VwZXJhZ2VudC5wYXJzZVsnYXBwbGljYXRpb24veG1sJ10gPSBmdW5jdGlvbihzdHIpe1xuICAqICAgICAgIHJldHVybiB7IG9iamVjdCBwYXJzZWQgZnJvbSBzdHIgfTtcbiAgKiAgICAgfTtcbiAgKlxuICAqL1xuXG5yZXF1ZXN0LnBhcnNlID0ge1xuICAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJzogcGFyc2VTdHJpbmcsXG4gICdhcHBsaWNhdGlvbi9qc29uJzogSlNPTi5wYXJzZVxufTtcblxuLyoqXG4gKiBQYXJzZSB0aGUgZ2l2ZW4gaGVhZGVyIGBzdHJgIGludG9cbiAqIGFuIG9iamVjdCBjb250YWluaW5nIHRoZSBtYXBwZWQgZmllbGRzLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHJcbiAqIEByZXR1cm4ge09iamVjdH1cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIHBhcnNlSGVhZGVyKHN0cikge1xuICB2YXIgbGluZXMgPSBzdHIuc3BsaXQoL1xccj9cXG4vKTtcbiAgdmFyIGZpZWxkcyA9IHt9O1xuICB2YXIgaW5kZXg7XG4gIHZhciBsaW5lO1xuICB2YXIgZmllbGQ7XG4gIHZhciB2YWw7XG5cbiAgbGluZXMucG9wKCk7IC8vIHRyYWlsaW5nIENSTEZcblxuICBmb3IgKHZhciBpID0gMCwgbGVuID0gbGluZXMubGVuZ3RoOyBpIDwgbGVuOyArK2kpIHtcbiAgICBsaW5lID0gbGluZXNbaV07XG4gICAgaW5kZXggPSBsaW5lLmluZGV4T2YoJzonKTtcbiAgICBmaWVsZCA9IGxpbmUuc2xpY2UoMCwgaW5kZXgpLnRvTG93ZXJDYXNlKCk7XG4gICAgdmFsID0gdHJpbShsaW5lLnNsaWNlKGluZGV4ICsgMSkpO1xuICAgIGZpZWxkc1tmaWVsZF0gPSB2YWw7XG4gIH1cblxuICByZXR1cm4gZmllbGRzO1xufVxuXG4vKipcbiAqIFJldHVybiB0aGUgbWltZSB0eXBlIGZvciB0aGUgZ2l2ZW4gYHN0cmAuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHN0clxuICogQHJldHVybiB7U3RyaW5nfVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gdHlwZShzdHIpe1xuICByZXR1cm4gc3RyLnNwbGl0KC8gKjsgKi8pLnNoaWZ0KCk7XG59O1xuXG4vKipcbiAqIFJldHVybiBoZWFkZXIgZmllbGQgcGFyYW1ldGVycy5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyXG4gKiBAcmV0dXJuIHtPYmplY3R9XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBwYXJhbXMoc3RyKXtcbiAgcmV0dXJuIHJlZHVjZShzdHIuc3BsaXQoLyAqOyAqLyksIGZ1bmN0aW9uKG9iaiwgc3RyKXtcbiAgICB2YXIgcGFydHMgPSBzdHIuc3BsaXQoLyAqPSAqLylcbiAgICAgICwga2V5ID0gcGFydHMuc2hpZnQoKVxuICAgICAgLCB2YWwgPSBwYXJ0cy5zaGlmdCgpO1xuXG4gICAgaWYgKGtleSAmJiB2YWwpIG9ialtrZXldID0gdmFsO1xuICAgIHJldHVybiBvYmo7XG4gIH0sIHt9KTtcbn07XG5cbi8qKlxuICogSW5pdGlhbGl6ZSBhIG5ldyBgUmVzcG9uc2VgIHdpdGggdGhlIGdpdmVuIGB4aHJgLlxuICpcbiAqICAtIHNldCBmbGFncyAoLm9rLCAuZXJyb3IsIGV0YylcbiAqICAtIHBhcnNlIGhlYWRlclxuICpcbiAqIEV4YW1wbGVzOlxuICpcbiAqICBBbGlhc2luZyBgc3VwZXJhZ2VudGAgYXMgYHJlcXVlc3RgIGlzIG5pY2U6XG4gKlxuICogICAgICByZXF1ZXN0ID0gc3VwZXJhZ2VudDtcbiAqXG4gKiAgV2UgY2FuIHVzZSB0aGUgcHJvbWlzZS1saWtlIEFQSSwgb3IgcGFzcyBjYWxsYmFja3M6XG4gKlxuICogICAgICByZXF1ZXN0LmdldCgnLycpLmVuZChmdW5jdGlvbihyZXMpe30pO1xuICogICAgICByZXF1ZXN0LmdldCgnLycsIGZ1bmN0aW9uKHJlcyl7fSk7XG4gKlxuICogIFNlbmRpbmcgZGF0YSBjYW4gYmUgY2hhaW5lZDpcbiAqXG4gKiAgICAgIHJlcXVlc3RcbiAqICAgICAgICAucG9zdCgnL3VzZXInKVxuICogICAgICAgIC5zZW5kKHsgbmFtZTogJ3RqJyB9KVxuICogICAgICAgIC5lbmQoZnVuY3Rpb24ocmVzKXt9KTtcbiAqXG4gKiAgT3IgcGFzc2VkIHRvIGAuc2VuZCgpYDpcbiAqXG4gKiAgICAgIHJlcXVlc3RcbiAqICAgICAgICAucG9zdCgnL3VzZXInKVxuICogICAgICAgIC5zZW5kKHsgbmFtZTogJ3RqJyB9LCBmdW5jdGlvbihyZXMpe30pO1xuICpcbiAqICBPciBwYXNzZWQgdG8gYC5wb3N0KClgOlxuICpcbiAqICAgICAgcmVxdWVzdFxuICogICAgICAgIC5wb3N0KCcvdXNlcicsIHsgbmFtZTogJ3RqJyB9KVxuICogICAgICAgIC5lbmQoZnVuY3Rpb24ocmVzKXt9KTtcbiAqXG4gKiBPciBmdXJ0aGVyIHJlZHVjZWQgdG8gYSBzaW5nbGUgY2FsbCBmb3Igc2ltcGxlIGNhc2VzOlxuICpcbiAqICAgICAgcmVxdWVzdFxuICogICAgICAgIC5wb3N0KCcvdXNlcicsIHsgbmFtZTogJ3RqJyB9LCBmdW5jdGlvbihyZXMpe30pO1xuICpcbiAqIEBwYXJhbSB7WE1MSFRUUFJlcXVlc3R9IHhoclxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIFJlc3BvbnNlKHJlcSwgb3B0aW9ucykge1xuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgdGhpcy5yZXEgPSByZXE7XG4gIHRoaXMueGhyID0gdGhpcy5yZXEueGhyO1xuICB0aGlzLnRleHQgPSB0aGlzLnhoci5yZXNwb25zZVRleHQ7XG4gIHRoaXMuc2V0U3RhdHVzUHJvcGVydGllcyh0aGlzLnhoci5zdGF0dXMpO1xuICB0aGlzLmhlYWRlciA9IHRoaXMuaGVhZGVycyA9IHBhcnNlSGVhZGVyKHRoaXMueGhyLmdldEFsbFJlc3BvbnNlSGVhZGVycygpKTtcbiAgLy8gZ2V0QWxsUmVzcG9uc2VIZWFkZXJzIHNvbWV0aW1lcyBmYWxzZWx5IHJldHVybnMgXCJcIiBmb3IgQ09SUyByZXF1ZXN0cywgYnV0XG4gIC8vIGdldFJlc3BvbnNlSGVhZGVyIHN0aWxsIHdvcmtzLiBzbyB3ZSBnZXQgY29udGVudC10eXBlIGV2ZW4gaWYgZ2V0dGluZ1xuICAvLyBvdGhlciBoZWFkZXJzIGZhaWxzLlxuICB0aGlzLmhlYWRlclsnY29udGVudC10eXBlJ10gPSB0aGlzLnhoci5nZXRSZXNwb25zZUhlYWRlcignY29udGVudC10eXBlJyk7XG4gIHRoaXMuc2V0SGVhZGVyUHJvcGVydGllcyh0aGlzLmhlYWRlcik7XG4gIHRoaXMuYm9keSA9IHRoaXMucmVxLm1ldGhvZCAhPSAnSEVBRCdcbiAgICA/IHRoaXMucGFyc2VCb2R5KHRoaXMudGV4dClcbiAgICA6IG51bGw7XG59XG5cbi8qKlxuICogR2V0IGNhc2UtaW5zZW5zaXRpdmUgYGZpZWxkYCB2YWx1ZS5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZmllbGRcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuUmVzcG9uc2UucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uKGZpZWxkKXtcbiAgcmV0dXJuIHRoaXMuaGVhZGVyW2ZpZWxkLnRvTG93ZXJDYXNlKCldO1xufTtcblxuLyoqXG4gKiBTZXQgaGVhZGVyIHJlbGF0ZWQgcHJvcGVydGllczpcbiAqXG4gKiAgIC0gYC50eXBlYCB0aGUgY29udGVudCB0eXBlIHdpdGhvdXQgcGFyYW1zXG4gKlxuICogQSByZXNwb25zZSBvZiBcIkNvbnRlbnQtVHlwZTogdGV4dC9wbGFpbjsgY2hhcnNldD11dGYtOFwiXG4gKiB3aWxsIHByb3ZpZGUgeW91IHdpdGggYSBgLnR5cGVgIG9mIFwidGV4dC9wbGFpblwiLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBoZWFkZXJcbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cblJlc3BvbnNlLnByb3RvdHlwZS5zZXRIZWFkZXJQcm9wZXJ0aWVzID0gZnVuY3Rpb24oaGVhZGVyKXtcbiAgLy8gY29udGVudC10eXBlXG4gIHZhciBjdCA9IHRoaXMuaGVhZGVyWydjb250ZW50LXR5cGUnXSB8fCAnJztcbiAgdGhpcy50eXBlID0gdHlwZShjdCk7XG5cbiAgLy8gcGFyYW1zXG4gIHZhciBvYmogPSBwYXJhbXMoY3QpO1xuICBmb3IgKHZhciBrZXkgaW4gb2JqKSB0aGlzW2tleV0gPSBvYmpba2V5XTtcbn07XG5cbi8qKlxuICogUGFyc2UgdGhlIGdpdmVuIGJvZHkgYHN0cmAuXG4gKlxuICogVXNlZCBmb3IgYXV0by1wYXJzaW5nIG9mIGJvZGllcy4gUGFyc2Vyc1xuICogYXJlIGRlZmluZWQgb24gdGhlIGBzdXBlcmFnZW50LnBhcnNlYCBvYmplY3QuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHN0clxuICogQHJldHVybiB7TWl4ZWR9XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5SZXNwb25zZS5wcm90b3R5cGUucGFyc2VCb2R5ID0gZnVuY3Rpb24oc3RyKXtcbiAgdmFyIHBhcnNlID0gcmVxdWVzdC5wYXJzZVt0aGlzLnR5cGVdO1xuICByZXR1cm4gcGFyc2VcbiAgICA/IHBhcnNlKHN0cilcbiAgICA6IG51bGw7XG59O1xuXG4vKipcbiAqIFNldCBmbGFncyBzdWNoIGFzIGAub2tgIGJhc2VkIG9uIGBzdGF0dXNgLlxuICpcbiAqIEZvciBleGFtcGxlIGEgMnh4IHJlc3BvbnNlIHdpbGwgZ2l2ZSB5b3UgYSBgLm9rYCBvZiBfX3RydWVfX1xuICogd2hlcmVhcyA1eHggd2lsbCBiZSBfX2ZhbHNlX18gYW5kIGAuZXJyb3JgIHdpbGwgYmUgX190cnVlX18uIFRoZVxuICogYC5jbGllbnRFcnJvcmAgYW5kIGAuc2VydmVyRXJyb3JgIGFyZSBhbHNvIGF2YWlsYWJsZSB0byBiZSBtb3JlXG4gKiBzcGVjaWZpYywgYW5kIGAuc3RhdHVzVHlwZWAgaXMgdGhlIGNsYXNzIG9mIGVycm9yIHJhbmdpbmcgZnJvbSAxLi41XG4gKiBzb21ldGltZXMgdXNlZnVsIGZvciBtYXBwaW5nIHJlc3BvbmQgY29sb3JzIGV0Yy5cbiAqXG4gKiBcInN1Z2FyXCIgcHJvcGVydGllcyBhcmUgYWxzbyBkZWZpbmVkIGZvciBjb21tb24gY2FzZXMuIEN1cnJlbnRseSBwcm92aWRpbmc6XG4gKlxuICogICAtIC5ub0NvbnRlbnRcbiAqICAgLSAuYmFkUmVxdWVzdFxuICogICAtIC51bmF1dGhvcml6ZWRcbiAqICAgLSAubm90QWNjZXB0YWJsZVxuICogICAtIC5ub3RGb3VuZFxuICpcbiAqIEBwYXJhbSB7TnVtYmVyfSBzdGF0dXNcbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cblJlc3BvbnNlLnByb3RvdHlwZS5zZXRTdGF0dXNQcm9wZXJ0aWVzID0gZnVuY3Rpb24oc3RhdHVzKXtcbiAgdmFyIHR5cGUgPSBzdGF0dXMgLyAxMDAgfCAwO1xuXG4gIC8vIHN0YXR1cyAvIGNsYXNzXG4gIHRoaXMuc3RhdHVzID0gc3RhdHVzO1xuICB0aGlzLnN0YXR1c1R5cGUgPSB0eXBlO1xuXG4gIC8vIGJhc2ljc1xuICB0aGlzLmluZm8gPSAxID09IHR5cGU7XG4gIHRoaXMub2sgPSAyID09IHR5cGU7XG4gIHRoaXMuY2xpZW50RXJyb3IgPSA0ID09IHR5cGU7XG4gIHRoaXMuc2VydmVyRXJyb3IgPSA1ID09IHR5cGU7XG4gIHRoaXMuZXJyb3IgPSAoNCA9PSB0eXBlIHx8IDUgPT0gdHlwZSlcbiAgICA/IHRoaXMudG9FcnJvcigpXG4gICAgOiBmYWxzZTtcblxuICAvLyBzdWdhclxuICB0aGlzLmFjY2VwdGVkID0gMjAyID09IHN0YXR1cztcbiAgdGhpcy5ub0NvbnRlbnQgPSAyMDQgPT0gc3RhdHVzIHx8IDEyMjMgPT0gc3RhdHVzO1xuICB0aGlzLmJhZFJlcXVlc3QgPSA0MDAgPT0gc3RhdHVzO1xuICB0aGlzLnVuYXV0aG9yaXplZCA9IDQwMSA9PSBzdGF0dXM7XG4gIHRoaXMubm90QWNjZXB0YWJsZSA9IDQwNiA9PSBzdGF0dXM7XG4gIHRoaXMubm90Rm91bmQgPSA0MDQgPT0gc3RhdHVzO1xuICB0aGlzLmZvcmJpZGRlbiA9IDQwMyA9PSBzdGF0dXM7XG59O1xuXG4vKipcbiAqIFJldHVybiBhbiBgRXJyb3JgIHJlcHJlc2VudGF0aXZlIG9mIHRoaXMgcmVzcG9uc2UuXG4gKlxuICogQHJldHVybiB7RXJyb3J9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cblJlc3BvbnNlLnByb3RvdHlwZS50b0Vycm9yID0gZnVuY3Rpb24oKXtcbiAgdmFyIHJlcSA9IHRoaXMucmVxO1xuICB2YXIgbWV0aG9kID0gcmVxLm1ldGhvZDtcbiAgdmFyIHVybCA9IHJlcS51cmw7XG5cbiAgdmFyIG1zZyA9ICdjYW5ub3QgJyArIG1ldGhvZCArICcgJyArIHVybCArICcgKCcgKyB0aGlzLnN0YXR1cyArICcpJztcbiAgdmFyIGVyciA9IG5ldyBFcnJvcihtc2cpO1xuICBlcnIuc3RhdHVzID0gdGhpcy5zdGF0dXM7XG4gIGVyci5tZXRob2QgPSBtZXRob2Q7XG4gIGVyci51cmwgPSB1cmw7XG5cbiAgcmV0dXJuIGVycjtcbn07XG5cbi8qKlxuICogRXhwb3NlIGBSZXNwb25zZWAuXG4gKi9cblxucmVxdWVzdC5SZXNwb25zZSA9IFJlc3BvbnNlO1xuXG4vKipcbiAqIEluaXRpYWxpemUgYSBuZXcgYFJlcXVlc3RgIHdpdGggdGhlIGdpdmVuIGBtZXRob2RgIGFuZCBgdXJsYC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gbWV0aG9kXG4gKiBAcGFyYW0ge1N0cmluZ30gdXJsXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmZ1bmN0aW9uIFJlcXVlc3QobWV0aG9kLCB1cmwpIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICBFbWl0dGVyLmNhbGwodGhpcyk7XG4gIHRoaXMuX3F1ZXJ5ID0gdGhpcy5fcXVlcnkgfHwgW107XG4gIHRoaXMubWV0aG9kID0gbWV0aG9kO1xuICB0aGlzLnVybCA9IHVybDtcbiAgdGhpcy5oZWFkZXIgPSB7fTtcbiAgdGhpcy5faGVhZGVyID0ge307XG4gIHRoaXMub24oJ2VuZCcsIGZ1bmN0aW9uKCl7XG4gICAgdmFyIHJlcyA9IG5ldyBSZXNwb25zZShzZWxmKTtcbiAgICBpZiAoJ0hFQUQnID09IG1ldGhvZCkgcmVzLnRleHQgPSBudWxsO1xuICAgIHNlbGYuY2FsbGJhY2sobnVsbCwgcmVzKTtcbiAgfSk7XG59XG5cbi8qKlxuICogTWl4aW4gYEVtaXR0ZXJgLlxuICovXG5cbkVtaXR0ZXIoUmVxdWVzdC5wcm90b3R5cGUpO1xuXG4vKipcbiAqIEFsbG93IGZvciBleHRlbnNpb25cbiAqL1xuXG5SZXF1ZXN0LnByb3RvdHlwZS51c2UgPSBmdW5jdGlvbihmbikge1xuICBmbih0aGlzKTtcbiAgcmV0dXJuIHRoaXM7XG59XG5cbi8qKlxuICogU2V0IHRpbWVvdXQgdG8gYG1zYC5cbiAqXG4gKiBAcGFyYW0ge051bWJlcn0gbXNcbiAqIEByZXR1cm4ge1JlcXVlc3R9IGZvciBjaGFpbmluZ1xuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5SZXF1ZXN0LnByb3RvdHlwZS50aW1lb3V0ID0gZnVuY3Rpb24obXMpe1xuICB0aGlzLl90aW1lb3V0ID0gbXM7XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBDbGVhciBwcmV2aW91cyB0aW1lb3V0LlxuICpcbiAqIEByZXR1cm4ge1JlcXVlc3R9IGZvciBjaGFpbmluZ1xuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5SZXF1ZXN0LnByb3RvdHlwZS5jbGVhclRpbWVvdXQgPSBmdW5jdGlvbigpe1xuICB0aGlzLl90aW1lb3V0ID0gMDtcbiAgY2xlYXJUaW1lb3V0KHRoaXMuX3RpbWVyKTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIEFib3J0IHRoZSByZXF1ZXN0LCBhbmQgY2xlYXIgcG90ZW50aWFsIHRpbWVvdXQuXG4gKlxuICogQHJldHVybiB7UmVxdWVzdH1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuUmVxdWVzdC5wcm90b3R5cGUuYWJvcnQgPSBmdW5jdGlvbigpe1xuICBpZiAodGhpcy5hYm9ydGVkKSByZXR1cm47XG4gIHRoaXMuYWJvcnRlZCA9IHRydWU7XG4gIHRoaXMueGhyLmFib3J0KCk7XG4gIHRoaXMuY2xlYXJUaW1lb3V0KCk7XG4gIHRoaXMuZW1pdCgnYWJvcnQnKTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIFNldCBoZWFkZXIgYGZpZWxkYCB0byBgdmFsYCwgb3IgbXVsdGlwbGUgZmllbGRzIHdpdGggb25lIG9iamVjdC5cbiAqXG4gKiBFeGFtcGxlczpcbiAqXG4gKiAgICAgIHJlcS5nZXQoJy8nKVxuICogICAgICAgIC5zZXQoJ0FjY2VwdCcsICdhcHBsaWNhdGlvbi9qc29uJylcbiAqICAgICAgICAuc2V0KCdYLUFQSS1LZXknLCAnZm9vYmFyJylcbiAqICAgICAgICAuZW5kKGNhbGxiYWNrKTtcbiAqXG4gKiAgICAgIHJlcS5nZXQoJy8nKVxuICogICAgICAgIC5zZXQoeyBBY2NlcHQ6ICdhcHBsaWNhdGlvbi9qc29uJywgJ1gtQVBJLUtleSc6ICdmb29iYXInIH0pXG4gKiAgICAgICAgLmVuZChjYWxsYmFjayk7XG4gKlxuICogQHBhcmFtIHtTdHJpbmd8T2JqZWN0fSBmaWVsZFxuICogQHBhcmFtIHtTdHJpbmd9IHZhbFxuICogQHJldHVybiB7UmVxdWVzdH0gZm9yIGNoYWluaW5nXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cblJlcXVlc3QucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uKGZpZWxkLCB2YWwpe1xuICBpZiAoaXNPYmplY3QoZmllbGQpKSB7XG4gICAgZm9yICh2YXIga2V5IGluIGZpZWxkKSB7XG4gICAgICB0aGlzLnNldChrZXksIGZpZWxkW2tleV0pO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuICB0aGlzLl9oZWFkZXJbZmllbGQudG9Mb3dlckNhc2UoKV0gPSB2YWw7XG4gIHRoaXMuaGVhZGVyW2ZpZWxkXSA9IHZhbDtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIEdldCBjYXNlLWluc2Vuc2l0aXZlIGhlYWRlciBgZmllbGRgIHZhbHVlLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBmaWVsZFxuICogQHJldHVybiB7U3RyaW5nfVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuUmVxdWVzdC5wcm90b3R5cGUuZ2V0SGVhZGVyID0gZnVuY3Rpb24oZmllbGQpe1xuICByZXR1cm4gdGhpcy5faGVhZGVyW2ZpZWxkLnRvTG93ZXJDYXNlKCldO1xufTtcblxuLyoqXG4gKiBTZXQgQ29udGVudC1UeXBlIHRvIGB0eXBlYCwgbWFwcGluZyB2YWx1ZXMgZnJvbSBgcmVxdWVzdC50eXBlc2AuXG4gKlxuICogRXhhbXBsZXM6XG4gKlxuICogICAgICBzdXBlcmFnZW50LnR5cGVzLnhtbCA9ICdhcHBsaWNhdGlvbi94bWwnO1xuICpcbiAqICAgICAgcmVxdWVzdC5wb3N0KCcvJylcbiAqICAgICAgICAudHlwZSgneG1sJylcbiAqICAgICAgICAuc2VuZCh4bWxzdHJpbmcpXG4gKiAgICAgICAgLmVuZChjYWxsYmFjayk7XG4gKlxuICogICAgICByZXF1ZXN0LnBvc3QoJy8nKVxuICogICAgICAgIC50eXBlKCdhcHBsaWNhdGlvbi94bWwnKVxuICogICAgICAgIC5zZW5kKHhtbHN0cmluZylcbiAqICAgICAgICAuZW5kKGNhbGxiYWNrKTtcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gdHlwZVxuICogQHJldHVybiB7UmVxdWVzdH0gZm9yIGNoYWluaW5nXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cblJlcXVlc3QucHJvdG90eXBlLnR5cGUgPSBmdW5jdGlvbih0eXBlKXtcbiAgdGhpcy5zZXQoJ0NvbnRlbnQtVHlwZScsIHJlcXVlc3QudHlwZXNbdHlwZV0gfHwgdHlwZSk7XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBTZXQgQWNjZXB0IHRvIGB0eXBlYCwgbWFwcGluZyB2YWx1ZXMgZnJvbSBgcmVxdWVzdC50eXBlc2AuXG4gKlxuICogRXhhbXBsZXM6XG4gKlxuICogICAgICBzdXBlcmFnZW50LnR5cGVzLmpzb24gPSAnYXBwbGljYXRpb24vanNvbic7XG4gKlxuICogICAgICByZXF1ZXN0LmdldCgnL2FnZW50JylcbiAqICAgICAgICAuYWNjZXB0KCdqc29uJylcbiAqICAgICAgICAuZW5kKGNhbGxiYWNrKTtcbiAqXG4gKiAgICAgIHJlcXVlc3QuZ2V0KCcvYWdlbnQnKVxuICogICAgICAgIC5hY2NlcHQoJ2FwcGxpY2F0aW9uL2pzb24nKVxuICogICAgICAgIC5lbmQoY2FsbGJhY2spO1xuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBhY2NlcHRcbiAqIEByZXR1cm4ge1JlcXVlc3R9IGZvciBjaGFpbmluZ1xuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5SZXF1ZXN0LnByb3RvdHlwZS5hY2NlcHQgPSBmdW5jdGlvbih0eXBlKXtcbiAgdGhpcy5zZXQoJ0FjY2VwdCcsIHJlcXVlc3QudHlwZXNbdHlwZV0gfHwgdHlwZSk7XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBTZXQgQXV0aG9yaXphdGlvbiBmaWVsZCB2YWx1ZSB3aXRoIGB1c2VyYCBhbmQgYHBhc3NgLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSB1c2VyXG4gKiBAcGFyYW0ge1N0cmluZ30gcGFzc1xuICogQHJldHVybiB7UmVxdWVzdH0gZm9yIGNoYWluaW5nXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cblJlcXVlc3QucHJvdG90eXBlLmF1dGggPSBmdW5jdGlvbih1c2VyLCBwYXNzKXtcbiAgdmFyIHN0ciA9IGJ0b2EodXNlciArICc6JyArIHBhc3MpO1xuICB0aGlzLnNldCgnQXV0aG9yaXphdGlvbicsICdCYXNpYyAnICsgc3RyKTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiogQWRkIHF1ZXJ5LXN0cmluZyBgdmFsYC5cbipcbiogRXhhbXBsZXM6XG4qXG4qICAgcmVxdWVzdC5nZXQoJy9zaG9lcycpXG4qICAgICAucXVlcnkoJ3NpemU9MTAnKVxuKiAgICAgLnF1ZXJ5KHsgY29sb3I6ICdibHVlJyB9KVxuKlxuKiBAcGFyYW0ge09iamVjdHxTdHJpbmd9IHZhbFxuKiBAcmV0dXJuIHtSZXF1ZXN0fSBmb3IgY2hhaW5pbmdcbiogQGFwaSBwdWJsaWNcbiovXG5cblJlcXVlc3QucHJvdG90eXBlLnF1ZXJ5ID0gZnVuY3Rpb24odmFsKXtcbiAgaWYgKCdzdHJpbmcnICE9IHR5cGVvZiB2YWwpIHZhbCA9IHNlcmlhbGl6ZSh2YWwpO1xuICBpZiAodmFsKSB0aGlzLl9xdWVyeS5wdXNoKHZhbCk7XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBXcml0ZSB0aGUgZmllbGQgYG5hbWVgIGFuZCBgdmFsYCBmb3IgXCJtdWx0aXBhcnQvZm9ybS1kYXRhXCJcbiAqIHJlcXVlc3QgYm9kaWVzLlxuICpcbiAqIGBgYCBqc1xuICogcmVxdWVzdC5wb3N0KCcvdXBsb2FkJylcbiAqICAgLmZpZWxkKCdmb28nLCAnYmFyJylcbiAqICAgLmVuZChjYWxsYmFjayk7XG4gKiBgYGBcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gbmFtZVxuICogQHBhcmFtIHtTdHJpbmd8QmxvYnxGaWxlfSB2YWxcbiAqIEByZXR1cm4ge1JlcXVlc3R9IGZvciBjaGFpbmluZ1xuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5SZXF1ZXN0LnByb3RvdHlwZS5maWVsZCA9IGZ1bmN0aW9uKG5hbWUsIHZhbCl7XG4gIGlmICghdGhpcy5fZm9ybURhdGEpIHRoaXMuX2Zvcm1EYXRhID0gbmV3IEZvcm1EYXRhKCk7XG4gIHRoaXMuX2Zvcm1EYXRhLmFwcGVuZChuYW1lLCB2YWwpO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogUXVldWUgdGhlIGdpdmVuIGBmaWxlYCBhcyBhbiBhdHRhY2htZW50IHRvIHRoZSBzcGVjaWZpZWQgYGZpZWxkYCxcbiAqIHdpdGggb3B0aW9uYWwgYGZpbGVuYW1lYC5cbiAqXG4gKiBgYGAganNcbiAqIHJlcXVlc3QucG9zdCgnL3VwbG9hZCcpXG4gKiAgIC5hdHRhY2gobmV3IEJsb2IoWyc8YSBpZD1cImFcIj48YiBpZD1cImJcIj5oZXkhPC9iPjwvYT4nXSwgeyB0eXBlOiBcInRleHQvaHRtbFwifSkpXG4gKiAgIC5lbmQoY2FsbGJhY2spO1xuICogYGBgXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGZpZWxkXG4gKiBAcGFyYW0ge0Jsb2J8RmlsZX0gZmlsZVxuICogQHBhcmFtIHtTdHJpbmd9IGZpbGVuYW1lXG4gKiBAcmV0dXJuIHtSZXF1ZXN0fSBmb3IgY2hhaW5pbmdcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuUmVxdWVzdC5wcm90b3R5cGUuYXR0YWNoID0gZnVuY3Rpb24oZmllbGQsIGZpbGUsIGZpbGVuYW1lKXtcbiAgaWYgKCF0aGlzLl9mb3JtRGF0YSkgdGhpcy5fZm9ybURhdGEgPSBuZXcgRm9ybURhdGEoKTtcbiAgdGhpcy5fZm9ybURhdGEuYXBwZW5kKGZpZWxkLCBmaWxlLCBmaWxlbmFtZSk7XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBTZW5kIGBkYXRhYCwgZGVmYXVsdGluZyB0aGUgYC50eXBlKClgIHRvIFwianNvblwiIHdoZW5cbiAqIGFuIG9iamVjdCBpcyBnaXZlbi5cbiAqXG4gKiBFeGFtcGxlczpcbiAqXG4gKiAgICAgICAvLyBxdWVyeXN0cmluZ1xuICogICAgICAgcmVxdWVzdC5nZXQoJy9zZWFyY2gnKVxuICogICAgICAgICAuZW5kKGNhbGxiYWNrKVxuICpcbiAqICAgICAgIC8vIG11bHRpcGxlIGRhdGEgXCJ3cml0ZXNcIlxuICogICAgICAgcmVxdWVzdC5nZXQoJy9zZWFyY2gnKVxuICogICAgICAgICAuc2VuZCh7IHNlYXJjaDogJ3F1ZXJ5JyB9KVxuICogICAgICAgICAuc2VuZCh7IHJhbmdlOiAnMS4uNScgfSlcbiAqICAgICAgICAgLnNlbmQoeyBvcmRlcjogJ2Rlc2MnIH0pXG4gKiAgICAgICAgIC5lbmQoY2FsbGJhY2spXG4gKlxuICogICAgICAgLy8gbWFudWFsIGpzb25cbiAqICAgICAgIHJlcXVlc3QucG9zdCgnL3VzZXInKVxuICogICAgICAgICAudHlwZSgnanNvbicpXG4gKiAgICAgICAgIC5zZW5kKCd7XCJuYW1lXCI6XCJ0alwifSlcbiAqICAgICAgICAgLmVuZChjYWxsYmFjaylcbiAqXG4gKiAgICAgICAvLyBhdXRvIGpzb25cbiAqICAgICAgIHJlcXVlc3QucG9zdCgnL3VzZXInKVxuICogICAgICAgICAuc2VuZCh7IG5hbWU6ICd0aicgfSlcbiAqICAgICAgICAgLmVuZChjYWxsYmFjaylcbiAqXG4gKiAgICAgICAvLyBtYW51YWwgeC13d3ctZm9ybS11cmxlbmNvZGVkXG4gKiAgICAgICByZXF1ZXN0LnBvc3QoJy91c2VyJylcbiAqICAgICAgICAgLnR5cGUoJ2Zvcm0nKVxuICogICAgICAgICAuc2VuZCgnbmFtZT10aicpXG4gKiAgICAgICAgIC5lbmQoY2FsbGJhY2spXG4gKlxuICogICAgICAgLy8gYXV0byB4LXd3dy1mb3JtLXVybGVuY29kZWRcbiAqICAgICAgIHJlcXVlc3QucG9zdCgnL3VzZXInKVxuICogICAgICAgICAudHlwZSgnZm9ybScpXG4gKiAgICAgICAgIC5zZW5kKHsgbmFtZTogJ3RqJyB9KVxuICogICAgICAgICAuZW5kKGNhbGxiYWNrKVxuICpcbiAqICAgICAgIC8vIGRlZmF1bHRzIHRvIHgtd3d3LWZvcm0tdXJsZW5jb2RlZFxuICAqICAgICAgcmVxdWVzdC5wb3N0KCcvdXNlcicpXG4gICogICAgICAgIC5zZW5kKCduYW1lPXRvYmknKVxuICAqICAgICAgICAuc2VuZCgnc3BlY2llcz1mZXJyZXQnKVxuICAqICAgICAgICAuZW5kKGNhbGxiYWNrKVxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfE9iamVjdH0gZGF0YVxuICogQHJldHVybiB7UmVxdWVzdH0gZm9yIGNoYWluaW5nXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cblJlcXVlc3QucHJvdG90eXBlLnNlbmQgPSBmdW5jdGlvbihkYXRhKXtcbiAgdmFyIG9iaiA9IGlzT2JqZWN0KGRhdGEpO1xuICB2YXIgdHlwZSA9IHRoaXMuZ2V0SGVhZGVyKCdDb250ZW50LVR5cGUnKTtcblxuICAvLyBtZXJnZVxuICBpZiAob2JqICYmIGlzT2JqZWN0KHRoaXMuX2RhdGEpKSB7XG4gICAgZm9yICh2YXIga2V5IGluIGRhdGEpIHtcbiAgICAgIHRoaXMuX2RhdGFba2V5XSA9IGRhdGFba2V5XTtcbiAgICB9XG4gIH0gZWxzZSBpZiAoJ3N0cmluZycgPT0gdHlwZW9mIGRhdGEpIHtcbiAgICBpZiAoIXR5cGUpIHRoaXMudHlwZSgnZm9ybScpO1xuICAgIHR5cGUgPSB0aGlzLmdldEhlYWRlcignQ29udGVudC1UeXBlJyk7XG4gICAgaWYgKCdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnID09IHR5cGUpIHtcbiAgICAgIHRoaXMuX2RhdGEgPSB0aGlzLl9kYXRhXG4gICAgICAgID8gdGhpcy5fZGF0YSArICcmJyArIGRhdGFcbiAgICAgICAgOiBkYXRhO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9kYXRhID0gKHRoaXMuX2RhdGEgfHwgJycpICsgZGF0YTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgdGhpcy5fZGF0YSA9IGRhdGE7XG4gIH1cblxuICBpZiAoIW9iaikgcmV0dXJuIHRoaXM7XG4gIGlmICghdHlwZSkgdGhpcy50eXBlKCdqc29uJyk7XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBJbnZva2UgdGhlIGNhbGxiYWNrIHdpdGggYGVycmAgYW5kIGByZXNgXG4gKiBhbmQgaGFuZGxlIGFyaXR5IGNoZWNrLlxuICpcbiAqIEBwYXJhbSB7RXJyb3J9IGVyclxuICogQHBhcmFtIHtSZXNwb25zZX0gcmVzXG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5SZXF1ZXN0LnByb3RvdHlwZS5jYWxsYmFjayA9IGZ1bmN0aW9uKGVyciwgcmVzKXtcbiAgdmFyIGZuID0gdGhpcy5fY2FsbGJhY2s7XG4gIGlmICgyID09IGZuLmxlbmd0aCkgcmV0dXJuIGZuKGVyciwgcmVzKTtcbiAgaWYgKGVycikgcmV0dXJuIHRoaXMuZW1pdCgnZXJyb3InLCBlcnIpO1xuICBmbihyZXMpO1xufTtcblxuLyoqXG4gKiBJbnZva2UgY2FsbGJhY2sgd2l0aCB4LWRvbWFpbiBlcnJvci5cbiAqXG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5SZXF1ZXN0LnByb3RvdHlwZS5jcm9zc0RvbWFpbkVycm9yID0gZnVuY3Rpb24oKXtcbiAgdmFyIGVyciA9IG5ldyBFcnJvcignT3JpZ2luIGlzIG5vdCBhbGxvd2VkIGJ5IEFjY2Vzcy1Db250cm9sLUFsbG93LU9yaWdpbicpO1xuICBlcnIuY3Jvc3NEb21haW4gPSB0cnVlO1xuICB0aGlzLmNhbGxiYWNrKGVycik7XG59O1xuXG4vKipcbiAqIEludm9rZSBjYWxsYmFjayB3aXRoIHRpbWVvdXQgZXJyb3IuXG4gKlxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuUmVxdWVzdC5wcm90b3R5cGUudGltZW91dEVycm9yID0gZnVuY3Rpb24oKXtcbiAgdmFyIHRpbWVvdXQgPSB0aGlzLl90aW1lb3V0O1xuICB2YXIgZXJyID0gbmV3IEVycm9yKCd0aW1lb3V0IG9mICcgKyB0aW1lb3V0ICsgJ21zIGV4Y2VlZGVkJyk7XG4gIGVyci50aW1lb3V0ID0gdGltZW91dDtcbiAgdGhpcy5jYWxsYmFjayhlcnIpO1xufTtcblxuLyoqXG4gKiBFbmFibGUgdHJhbnNtaXNzaW9uIG9mIGNvb2tpZXMgd2l0aCB4LWRvbWFpbiByZXF1ZXN0cy5cbiAqXG4gKiBOb3RlIHRoYXQgZm9yIHRoaXMgdG8gd29yayB0aGUgb3JpZ2luIG11c3Qgbm90IGJlXG4gKiB1c2luZyBcIkFjY2Vzcy1Db250cm9sLUFsbG93LU9yaWdpblwiIHdpdGggYSB3aWxkY2FyZCxcbiAqIGFuZCBhbHNvIG11c3Qgc2V0IFwiQWNjZXNzLUNvbnRyb2wtQWxsb3ctQ3JlZGVudGlhbHNcIlxuICogdG8gXCJ0cnVlXCIuXG4gKlxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5SZXF1ZXN0LnByb3RvdHlwZS53aXRoQ3JlZGVudGlhbHMgPSBmdW5jdGlvbigpe1xuICB0aGlzLl93aXRoQ3JlZGVudGlhbHMgPSB0cnVlO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogSW5pdGlhdGUgcmVxdWVzdCwgaW52b2tpbmcgY2FsbGJhY2sgYGZuKHJlcylgXG4gKiB3aXRoIGFuIGluc3RhbmNlb2YgYFJlc3BvbnNlYC5cbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxuICogQHJldHVybiB7UmVxdWVzdH0gZm9yIGNoYWluaW5nXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cblJlcXVlc3QucHJvdG90eXBlLmVuZCA9IGZ1bmN0aW9uKGZuKXtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICB2YXIgeGhyID0gdGhpcy54aHIgPSBnZXRYSFIoKTtcbiAgdmFyIHF1ZXJ5ID0gdGhpcy5fcXVlcnkuam9pbignJicpO1xuICB2YXIgdGltZW91dCA9IHRoaXMuX3RpbWVvdXQ7XG4gIHZhciBkYXRhID0gdGhpcy5fZm9ybURhdGEgfHwgdGhpcy5fZGF0YTtcblxuICAvLyBzdG9yZSBjYWxsYmFja1xuICB0aGlzLl9jYWxsYmFjayA9IGZuIHx8IG5vb3A7XG5cbiAgLy8gc3RhdGUgY2hhbmdlXG4gIHhoci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbigpe1xuICAgIGlmICg0ICE9IHhoci5yZWFkeVN0YXRlKSByZXR1cm47XG4gICAgaWYgKDAgPT0geGhyLnN0YXR1cykge1xuICAgICAgaWYgKHNlbGYuYWJvcnRlZCkgcmV0dXJuIHNlbGYudGltZW91dEVycm9yKCk7XG4gICAgICByZXR1cm4gc2VsZi5jcm9zc0RvbWFpbkVycm9yKCk7XG4gICAgfVxuICAgIHNlbGYuZW1pdCgnZW5kJyk7XG4gIH07XG5cbiAgLy8gcHJvZ3Jlc3NcbiAgaWYgKHhoci51cGxvYWQpIHtcbiAgICB4aHIudXBsb2FkLm9ucHJvZ3Jlc3MgPSBmdW5jdGlvbihlKXtcbiAgICAgIGUucGVyY2VudCA9IGUubG9hZGVkIC8gZS50b3RhbCAqIDEwMDtcbiAgICAgIHNlbGYuZW1pdCgncHJvZ3Jlc3MnLCBlKTtcbiAgICB9O1xuICB9XG5cbiAgLy8gdGltZW91dFxuICBpZiAodGltZW91dCAmJiAhdGhpcy5fdGltZXIpIHtcbiAgICB0aGlzLl90aW1lciA9IHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgIHNlbGYuYWJvcnQoKTtcbiAgICB9LCB0aW1lb3V0KTtcbiAgfVxuXG4gIC8vIHF1ZXJ5c3RyaW5nXG4gIGlmIChxdWVyeSkge1xuICAgIHF1ZXJ5ID0gcmVxdWVzdC5zZXJpYWxpemVPYmplY3QocXVlcnkpO1xuICAgIHRoaXMudXJsICs9IH50aGlzLnVybC5pbmRleE9mKCc/JylcbiAgICAgID8gJyYnICsgcXVlcnlcbiAgICAgIDogJz8nICsgcXVlcnk7XG4gIH1cblxuICAvLyBpbml0aWF0ZSByZXF1ZXN0XG4gIHhoci5vcGVuKHRoaXMubWV0aG9kLCB0aGlzLnVybCwgdHJ1ZSk7XG5cbiAgLy8gQ09SU1xuICBpZiAodGhpcy5fd2l0aENyZWRlbnRpYWxzKSB4aHIud2l0aENyZWRlbnRpYWxzID0gdHJ1ZTtcblxuICAvLyBib2R5XG4gIGlmICgnR0VUJyAhPSB0aGlzLm1ldGhvZCAmJiAnSEVBRCcgIT0gdGhpcy5tZXRob2QgJiYgJ3N0cmluZycgIT0gdHlwZW9mIGRhdGEgJiYgIWlzSG9zdChkYXRhKSkge1xuICAgIC8vIHNlcmlhbGl6ZSBzdHVmZlxuICAgIHZhciBzZXJpYWxpemUgPSByZXF1ZXN0LnNlcmlhbGl6ZVt0aGlzLmdldEhlYWRlcignQ29udGVudC1UeXBlJyldO1xuICAgIGlmIChzZXJpYWxpemUpIGRhdGEgPSBzZXJpYWxpemUoZGF0YSk7XG4gIH1cblxuICAvLyBzZXQgaGVhZGVyIGZpZWxkc1xuICBmb3IgKHZhciBmaWVsZCBpbiB0aGlzLmhlYWRlcikge1xuICAgIGlmIChudWxsID09IHRoaXMuaGVhZGVyW2ZpZWxkXSkgY29udGludWU7XG4gICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoZmllbGQsIHRoaXMuaGVhZGVyW2ZpZWxkXSk7XG4gIH1cblxuICAvLyBzZW5kIHN0dWZmXG4gIHRoaXMuZW1pdCgncmVxdWVzdCcsIHRoaXMpO1xuICB4aHIuc2VuZChkYXRhKTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIEV4cG9zZSBgUmVxdWVzdGAuXG4gKi9cblxucmVxdWVzdC5SZXF1ZXN0ID0gUmVxdWVzdDtcblxuLyoqXG4gKiBJc3N1ZSBhIHJlcXVlc3Q6XG4gKlxuICogRXhhbXBsZXM6XG4gKlxuICogICAgcmVxdWVzdCgnR0VUJywgJy91c2VycycpLmVuZChjYWxsYmFjaylcbiAqICAgIHJlcXVlc3QoJy91c2VycycpLmVuZChjYWxsYmFjaylcbiAqICAgIHJlcXVlc3QoJy91c2VycycsIGNhbGxiYWNrKVxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBtZXRob2RcbiAqIEBwYXJhbSB7U3RyaW5nfEZ1bmN0aW9ufSB1cmwgb3IgY2FsbGJhY2tcbiAqIEByZXR1cm4ge1JlcXVlc3R9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmZ1bmN0aW9uIHJlcXVlc3QobWV0aG9kLCB1cmwpIHtcbiAgLy8gY2FsbGJhY2tcbiAgaWYgKCdmdW5jdGlvbicgPT0gdHlwZW9mIHVybCkge1xuICAgIHJldHVybiBuZXcgUmVxdWVzdCgnR0VUJywgbWV0aG9kKS5lbmQodXJsKTtcbiAgfVxuXG4gIC8vIHVybCBmaXJzdFxuICBpZiAoMSA9PSBhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgcmV0dXJuIG5ldyBSZXF1ZXN0KCdHRVQnLCBtZXRob2QpO1xuICB9XG5cbiAgcmV0dXJuIG5ldyBSZXF1ZXN0KG1ldGhvZCwgdXJsKTtcbn1cblxuLyoqXG4gKiBHRVQgYHVybGAgd2l0aCBvcHRpb25hbCBjYWxsYmFjayBgZm4ocmVzKWAuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHVybFxuICogQHBhcmFtIHtNaXhlZHxGdW5jdGlvbn0gZGF0YSBvciBmblxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cbiAqIEByZXR1cm4ge1JlcXVlc3R9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbnJlcXVlc3QuZ2V0ID0gZnVuY3Rpb24odXJsLCBkYXRhLCBmbil7XG4gIHZhciByZXEgPSByZXF1ZXN0KCdHRVQnLCB1cmwpO1xuICBpZiAoJ2Z1bmN0aW9uJyA9PSB0eXBlb2YgZGF0YSkgZm4gPSBkYXRhLCBkYXRhID0gbnVsbDtcbiAgaWYgKGRhdGEpIHJlcS5xdWVyeShkYXRhKTtcbiAgaWYgKGZuKSByZXEuZW5kKGZuKTtcbiAgcmV0dXJuIHJlcTtcbn07XG5cbi8qKlxuICogSEVBRCBgdXJsYCB3aXRoIG9wdGlvbmFsIGNhbGxiYWNrIGBmbihyZXMpYC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gdXJsXG4gKiBAcGFyYW0ge01peGVkfEZ1bmN0aW9ufSBkYXRhIG9yIGZuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxuICogQHJldHVybiB7UmVxdWVzdH1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxucmVxdWVzdC5oZWFkID0gZnVuY3Rpb24odXJsLCBkYXRhLCBmbil7XG4gIHZhciByZXEgPSByZXF1ZXN0KCdIRUFEJywgdXJsKTtcbiAgaWYgKCdmdW5jdGlvbicgPT0gdHlwZW9mIGRhdGEpIGZuID0gZGF0YSwgZGF0YSA9IG51bGw7XG4gIGlmIChkYXRhKSByZXEuc2VuZChkYXRhKTtcbiAgaWYgKGZuKSByZXEuZW5kKGZuKTtcbiAgcmV0dXJuIHJlcTtcbn07XG5cbi8qKlxuICogREVMRVRFIGB1cmxgIHdpdGggb3B0aW9uYWwgY2FsbGJhY2sgYGZuKHJlcylgLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSB1cmxcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gKiBAcmV0dXJuIHtSZXF1ZXN0fVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5yZXF1ZXN0LmRlbCA9IGZ1bmN0aW9uKHVybCwgZm4pe1xuICB2YXIgcmVxID0gcmVxdWVzdCgnREVMRVRFJywgdXJsKTtcbiAgaWYgKGZuKSByZXEuZW5kKGZuKTtcbiAgcmV0dXJuIHJlcTtcbn07XG5cbi8qKlxuICogUEFUQ0ggYHVybGAgd2l0aCBvcHRpb25hbCBgZGF0YWAgYW5kIGNhbGxiYWNrIGBmbihyZXMpYC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gdXJsXG4gKiBAcGFyYW0ge01peGVkfSBkYXRhXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxuICogQHJldHVybiB7UmVxdWVzdH1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxucmVxdWVzdC5wYXRjaCA9IGZ1bmN0aW9uKHVybCwgZGF0YSwgZm4pe1xuICB2YXIgcmVxID0gcmVxdWVzdCgnUEFUQ0gnLCB1cmwpO1xuICBpZiAoJ2Z1bmN0aW9uJyA9PSB0eXBlb2YgZGF0YSkgZm4gPSBkYXRhLCBkYXRhID0gbnVsbDtcbiAgaWYgKGRhdGEpIHJlcS5zZW5kKGRhdGEpO1xuICBpZiAoZm4pIHJlcS5lbmQoZm4pO1xuICByZXR1cm4gcmVxO1xufTtcblxuLyoqXG4gKiBQT1NUIGB1cmxgIHdpdGggb3B0aW9uYWwgYGRhdGFgIGFuZCBjYWxsYmFjayBgZm4ocmVzKWAuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHVybFxuICogQHBhcmFtIHtNaXhlZH0gZGF0YVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cbiAqIEByZXR1cm4ge1JlcXVlc3R9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbnJlcXVlc3QucG9zdCA9IGZ1bmN0aW9uKHVybCwgZGF0YSwgZm4pe1xuICB2YXIgcmVxID0gcmVxdWVzdCgnUE9TVCcsIHVybCk7XG4gIGlmICgnZnVuY3Rpb24nID09IHR5cGVvZiBkYXRhKSBmbiA9IGRhdGEsIGRhdGEgPSBudWxsO1xuICBpZiAoZGF0YSkgcmVxLnNlbmQoZGF0YSk7XG4gIGlmIChmbikgcmVxLmVuZChmbik7XG4gIHJldHVybiByZXE7XG59O1xuXG4vKipcbiAqIFBVVCBgdXJsYCB3aXRoIG9wdGlvbmFsIGBkYXRhYCBhbmQgY2FsbGJhY2sgYGZuKHJlcylgLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSB1cmxcbiAqIEBwYXJhbSB7TWl4ZWR8RnVuY3Rpb259IGRhdGEgb3IgZm5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gKiBAcmV0dXJuIHtSZXF1ZXN0fVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5yZXF1ZXN0LnB1dCA9IGZ1bmN0aW9uKHVybCwgZGF0YSwgZm4pe1xuICB2YXIgcmVxID0gcmVxdWVzdCgnUFVUJywgdXJsKTtcbiAgaWYgKCdmdW5jdGlvbicgPT0gdHlwZW9mIGRhdGEpIGZuID0gZGF0YSwgZGF0YSA9IG51bGw7XG4gIGlmIChkYXRhKSByZXEuc2VuZChkYXRhKTtcbiAgaWYgKGZuKSByZXEuZW5kKGZuKTtcbiAgcmV0dXJuIHJlcTtcbn07XG5cbi8qKlxuICogRXhwb3NlIGByZXF1ZXN0YC5cbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVlc3Q7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IEFycmF5O1xuIiwiXG52YXIgcm5nO1xuXG5pZiAoZ2xvYmFsLmNyeXB0byAmJiBjcnlwdG8uZ2V0UmFuZG9tVmFsdWVzKSB7XG4gIC8vIFdIQVRXRyBjcnlwdG8tYmFzZWQgUk5HIC0gaHR0cDovL3dpa2kud2hhdHdnLm9yZy93aWtpL0NyeXB0b1xuICAvLyBNb2RlcmF0ZWx5IGZhc3QsIGhpZ2ggcXVhbGl0eVxuICB2YXIgX3JuZHM4ID0gbmV3IFVpbnQ4QXJyYXkoMTYpO1xuICBybmcgPSBmdW5jdGlvbiB3aGF0d2dSTkcoKSB7XG4gICAgY3J5cHRvLmdldFJhbmRvbVZhbHVlcyhfcm5kczgpO1xuICAgIHJldHVybiBfcm5kczg7XG4gIH07XG59XG5cbmlmICghcm5nKSB7XG4gIC8vIE1hdGgucmFuZG9tKCktYmFzZWQgKFJORylcbiAgLy9cbiAgLy8gSWYgYWxsIGVsc2UgZmFpbHMsIHVzZSBNYXRoLnJhbmRvbSgpLiAgSXQncyBmYXN0LCBidXQgaXMgb2YgdW5zcGVjaWZpZWRcbiAgLy8gcXVhbGl0eS5cbiAgdmFyICBfcm5kcyA9IG5ldyBBcnJheSgxNik7XG4gIHJuZyA9IGZ1bmN0aW9uKCkge1xuICAgIGZvciAodmFyIGkgPSAwLCByOyBpIDwgMTY7IGkrKykge1xuICAgICAgaWYgKChpICYgMHgwMykgPT09IDApIHIgPSBNYXRoLnJhbmRvbSgpICogMHgxMDAwMDAwMDA7XG4gICAgICBfcm5kc1tpXSA9IHIgPj4+ICgoaSAmIDB4MDMpIDw8IDMpICYgMHhmZjtcbiAgICB9XG5cbiAgICByZXR1cm4gX3JuZHM7XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gcm5nO1xuXG4iLCIvLyAgICAgdXVpZC5qc1xuLy9cbi8vICAgICBDb3B5cmlnaHQgKGMpIDIwMTAtMjAxMiBSb2JlcnQgS2llZmZlclxuLy8gICAgIE1JVCBMaWNlbnNlIC0gaHR0cDovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocFxuXG4vLyBVbmlxdWUgSUQgY3JlYXRpb24gcmVxdWlyZXMgYSBoaWdoIHF1YWxpdHkgcmFuZG9tICMgZ2VuZXJhdG9yLiAgV2UgZmVhdHVyZVxuLy8gZGV0ZWN0IHRvIGRldGVybWluZSB0aGUgYmVzdCBSTkcgc291cmNlLCBub3JtYWxpemluZyB0byBhIGZ1bmN0aW9uIHRoYXRcbi8vIHJldHVybnMgMTI4LWJpdHMgb2YgcmFuZG9tbmVzcywgc2luY2UgdGhhdCdzIHdoYXQncyB1c3VhbGx5IHJlcXVpcmVkXG52YXIgX3JuZyA9IHJlcXVpcmUoJy4vcm5nJyk7XG5cbi8vIEJ1ZmZlciBjbGFzcyB0byB1c2UsXG4vLyB3ZSBjYW4ndCB1c2UgYEJ1ZmZlciB8fCBBcnJheWAgb3RoZXJ3aXNlIEJ1ZmZlciB3b3VsZCBiZVxuLy8gc2hpbW1lZCBieSBicm93c2VyaWZ5IGFuZCBhZGRlZCB0byB0aGUgYnJvd3NlciBidWlsZFxudmFyIEJ1ZmZlckNsYXNzID0gcmVxdWlyZSgnLi9idWZmZXInKTtcblxuLy8gTWFwcyBmb3IgbnVtYmVyIDwtPiBoZXggc3RyaW5nIGNvbnZlcnNpb25cbnZhciBfYnl0ZVRvSGV4ID0gW107XG52YXIgX2hleFRvQnl0ZSA9IHt9O1xuZm9yICh2YXIgaSA9IDA7IGkgPCAyNTY7IGkrKykge1xuICBfYnl0ZVRvSGV4W2ldID0gKGkgKyAweDEwMCkudG9TdHJpbmcoMTYpLnN1YnN0cigxKTtcbiAgX2hleFRvQnl0ZVtfYnl0ZVRvSGV4W2ldXSA9IGk7XG59XG5cbi8vICoqYHBhcnNlKClgIC0gUGFyc2UgYSBVVUlEIGludG8gaXQncyBjb21wb25lbnQgYnl0ZXMqKlxuZnVuY3Rpb24gcGFyc2UocywgYnVmLCBvZmZzZXQpIHtcbiAgdmFyIGkgPSAoYnVmICYmIG9mZnNldCkgfHwgMCwgaWkgPSAwO1xuXG4gIGJ1ZiA9IGJ1ZiB8fCBbXTtcbiAgcy50b0xvd2VyQ2FzZSgpLnJlcGxhY2UoL1swLTlhLWZdezJ9L2csIGZ1bmN0aW9uKG9jdCkge1xuICAgIGlmIChpaSA8IDE2KSB7IC8vIERvbid0IG92ZXJmbG93IVxuICAgICAgYnVmW2kgKyBpaSsrXSA9IF9oZXhUb0J5dGVbb2N0XTtcbiAgICB9XG4gIH0pO1xuXG4gIC8vIFplcm8gb3V0IHJlbWFpbmluZyBieXRlcyBpZiBzdHJpbmcgd2FzIHNob3J0XG4gIHdoaWxlIChpaSA8IDE2KSB7XG4gICAgYnVmW2kgKyBpaSsrXSA9IDA7XG4gIH1cblxuICByZXR1cm4gYnVmO1xufVxuXG4vLyAqKmB1bnBhcnNlKClgIC0gQ29udmVydCBVVUlEIGJ5dGUgYXJyYXkgKGFsYSBwYXJzZSgpKSBpbnRvIGEgc3RyaW5nKipcbmZ1bmN0aW9uIHVucGFyc2UoYnVmLCBvZmZzZXQpIHtcbiAgdmFyIGkgPSBvZmZzZXQgfHwgMCwgYnRoID0gX2J5dGVUb0hleDtcbiAgcmV0dXJuICBidGhbYnVmW2krK11dICsgYnRoW2J1ZltpKytdXSArXG4gICAgICAgICAgYnRoW2J1ZltpKytdXSArIGJ0aFtidWZbaSsrXV0gKyAnLScgK1xuICAgICAgICAgIGJ0aFtidWZbaSsrXV0gKyBidGhbYnVmW2krK11dICsgJy0nICtcbiAgICAgICAgICBidGhbYnVmW2krK11dICsgYnRoW2J1ZltpKytdXSArICctJyArXG4gICAgICAgICAgYnRoW2J1ZltpKytdXSArIGJ0aFtidWZbaSsrXV0gKyAnLScgK1xuICAgICAgICAgIGJ0aFtidWZbaSsrXV0gKyBidGhbYnVmW2krK11dICtcbiAgICAgICAgICBidGhbYnVmW2krK11dICsgYnRoW2J1ZltpKytdXSArXG4gICAgICAgICAgYnRoW2J1ZltpKytdXSArIGJ0aFtidWZbaSsrXV07XG59XG5cbi8vICoqYHYxKClgIC0gR2VuZXJhdGUgdGltZS1iYXNlZCBVVUlEKipcbi8vXG4vLyBJbnNwaXJlZCBieSBodHRwczovL2dpdGh1Yi5jb20vTGlvc0svVVVJRC5qc1xuLy8gYW5kIGh0dHA6Ly9kb2NzLnB5dGhvbi5vcmcvbGlicmFyeS91dWlkLmh0bWxcblxuLy8gcmFuZG9tICMncyB3ZSBuZWVkIHRvIGluaXQgbm9kZSBhbmQgY2xvY2tzZXFcbnZhciBfc2VlZEJ5dGVzID0gX3JuZygpO1xuXG4vLyBQZXIgNC41LCBjcmVhdGUgYW5kIDQ4LWJpdCBub2RlIGlkLCAoNDcgcmFuZG9tIGJpdHMgKyBtdWx0aWNhc3QgYml0ID0gMSlcbnZhciBfbm9kZUlkID0gW1xuICBfc2VlZEJ5dGVzWzBdIHwgMHgwMSxcbiAgX3NlZWRCeXRlc1sxXSwgX3NlZWRCeXRlc1syXSwgX3NlZWRCeXRlc1szXSwgX3NlZWRCeXRlc1s0XSwgX3NlZWRCeXRlc1s1XVxuXTtcblxuLy8gUGVyIDQuMi4yLCByYW5kb21pemUgKDE0IGJpdCkgY2xvY2tzZXFcbnZhciBfY2xvY2tzZXEgPSAoX3NlZWRCeXRlc1s2XSA8PCA4IHwgX3NlZWRCeXRlc1s3XSkgJiAweDNmZmY7XG5cbi8vIFByZXZpb3VzIHV1aWQgY3JlYXRpb24gdGltZVxudmFyIF9sYXN0TVNlY3MgPSAwLCBfbGFzdE5TZWNzID0gMDtcblxuLy8gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9icm9vZmEvbm9kZS11dWlkIGZvciBBUEkgZGV0YWlsc1xuZnVuY3Rpb24gdjEob3B0aW9ucywgYnVmLCBvZmZzZXQpIHtcbiAgdmFyIGkgPSBidWYgJiYgb2Zmc2V0IHx8IDA7XG4gIHZhciBiID0gYnVmIHx8IFtdO1xuXG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG4gIHZhciBjbG9ja3NlcSA9IG9wdGlvbnMuY2xvY2tzZXEgIT09IHVuZGVmaW5lZCA/IG9wdGlvbnMuY2xvY2tzZXEgOiBfY2xvY2tzZXE7XG5cbiAgLy8gVVVJRCB0aW1lc3RhbXBzIGFyZSAxMDAgbmFuby1zZWNvbmQgdW5pdHMgc2luY2UgdGhlIEdyZWdvcmlhbiBlcG9jaCxcbiAgLy8gKDE1ODItMTAtMTUgMDA6MDApLiAgSlNOdW1iZXJzIGFyZW4ndCBwcmVjaXNlIGVub3VnaCBmb3IgdGhpcywgc29cbiAgLy8gdGltZSBpcyBoYW5kbGVkIGludGVybmFsbHkgYXMgJ21zZWNzJyAoaW50ZWdlciBtaWxsaXNlY29uZHMpIGFuZCAnbnNlY3MnXG4gIC8vICgxMDAtbmFub3NlY29uZHMgb2Zmc2V0IGZyb20gbXNlY3MpIHNpbmNlIHVuaXggZXBvY2gsIDE5NzAtMDEtMDEgMDA6MDAuXG4gIHZhciBtc2VjcyA9IG9wdGlvbnMubXNlY3MgIT09IHVuZGVmaW5lZCA/IG9wdGlvbnMubXNlY3MgOiBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcblxuICAvLyBQZXIgNC4yLjEuMiwgdXNlIGNvdW50IG9mIHV1aWQncyBnZW5lcmF0ZWQgZHVyaW5nIHRoZSBjdXJyZW50IGNsb2NrXG4gIC8vIGN5Y2xlIHRvIHNpbXVsYXRlIGhpZ2hlciByZXNvbHV0aW9uIGNsb2NrXG4gIHZhciBuc2VjcyA9IG9wdGlvbnMubnNlY3MgIT09IHVuZGVmaW5lZCA/IG9wdGlvbnMubnNlY3MgOiBfbGFzdE5TZWNzICsgMTtcblxuICAvLyBUaW1lIHNpbmNlIGxhc3QgdXVpZCBjcmVhdGlvbiAoaW4gbXNlY3MpXG4gIHZhciBkdCA9IChtc2VjcyAtIF9sYXN0TVNlY3MpICsgKG5zZWNzIC0gX2xhc3ROU2VjcykvMTAwMDA7XG5cbiAgLy8gUGVyIDQuMi4xLjIsIEJ1bXAgY2xvY2tzZXEgb24gY2xvY2sgcmVncmVzc2lvblxuICBpZiAoZHQgPCAwICYmIG9wdGlvbnMuY2xvY2tzZXEgPT09IHVuZGVmaW5lZCkge1xuICAgIGNsb2Nrc2VxID0gY2xvY2tzZXEgKyAxICYgMHgzZmZmO1xuICB9XG5cbiAgLy8gUmVzZXQgbnNlY3MgaWYgY2xvY2sgcmVncmVzc2VzIChuZXcgY2xvY2tzZXEpIG9yIHdlJ3ZlIG1vdmVkIG9udG8gYSBuZXdcbiAgLy8gdGltZSBpbnRlcnZhbFxuICBpZiAoKGR0IDwgMCB8fCBtc2VjcyA+IF9sYXN0TVNlY3MpICYmIG9wdGlvbnMubnNlY3MgPT09IHVuZGVmaW5lZCkge1xuICAgIG5zZWNzID0gMDtcbiAgfVxuXG4gIC8vIFBlciA0LjIuMS4yIFRocm93IGVycm9yIGlmIHRvbyBtYW55IHV1aWRzIGFyZSByZXF1ZXN0ZWRcbiAgaWYgKG5zZWNzID49IDEwMDAwKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCd1dWlkLnYxKCk6IENhblxcJ3QgY3JlYXRlIG1vcmUgdGhhbiAxME0gdXVpZHMvc2VjJyk7XG4gIH1cblxuICBfbGFzdE1TZWNzID0gbXNlY3M7XG4gIF9sYXN0TlNlY3MgPSBuc2VjcztcbiAgX2Nsb2Nrc2VxID0gY2xvY2tzZXE7XG5cbiAgLy8gUGVyIDQuMS40IC0gQ29udmVydCBmcm9tIHVuaXggZXBvY2ggdG8gR3JlZ29yaWFuIGVwb2NoXG4gIG1zZWNzICs9IDEyMjE5MjkyODAwMDAwO1xuXG4gIC8vIGB0aW1lX2xvd2BcbiAgdmFyIHRsID0gKChtc2VjcyAmIDB4ZmZmZmZmZikgKiAxMDAwMCArIG5zZWNzKSAlIDB4MTAwMDAwMDAwO1xuICBiW2krK10gPSB0bCA+Pj4gMjQgJiAweGZmO1xuICBiW2krK10gPSB0bCA+Pj4gMTYgJiAweGZmO1xuICBiW2krK10gPSB0bCA+Pj4gOCAmIDB4ZmY7XG4gIGJbaSsrXSA9IHRsICYgMHhmZjtcblxuICAvLyBgdGltZV9taWRgXG4gIHZhciB0bWggPSAobXNlY3MgLyAweDEwMDAwMDAwMCAqIDEwMDAwKSAmIDB4ZmZmZmZmZjtcbiAgYltpKytdID0gdG1oID4+PiA4ICYgMHhmZjtcbiAgYltpKytdID0gdG1oICYgMHhmZjtcblxuICAvLyBgdGltZV9oaWdoX2FuZF92ZXJzaW9uYFxuICBiW2krK10gPSB0bWggPj4+IDI0ICYgMHhmIHwgMHgxMDsgLy8gaW5jbHVkZSB2ZXJzaW9uXG4gIGJbaSsrXSA9IHRtaCA+Pj4gMTYgJiAweGZmO1xuXG4gIC8vIGBjbG9ja19zZXFfaGlfYW5kX3Jlc2VydmVkYCAoUGVyIDQuMi4yIC0gaW5jbHVkZSB2YXJpYW50KVxuICBiW2krK10gPSBjbG9ja3NlcSA+Pj4gOCB8IDB4ODA7XG5cbiAgLy8gYGNsb2NrX3NlcV9sb3dgXG4gIGJbaSsrXSA9IGNsb2Nrc2VxICYgMHhmZjtcblxuICAvLyBgbm9kZWBcbiAgdmFyIG5vZGUgPSBvcHRpb25zLm5vZGUgfHwgX25vZGVJZDtcbiAgZm9yICh2YXIgbiA9IDA7IG4gPCA2OyBuKyspIHtcbiAgICBiW2kgKyBuXSA9IG5vZGVbbl07XG4gIH1cblxuICByZXR1cm4gYnVmID8gYnVmIDogdW5wYXJzZShiKTtcbn1cblxuLy8gKipgdjQoKWAgLSBHZW5lcmF0ZSByYW5kb20gVVVJRCoqXG5cbi8vIFNlZSBodHRwczovL2dpdGh1Yi5jb20vYnJvb2ZhL25vZGUtdXVpZCBmb3IgQVBJIGRldGFpbHNcbmZ1bmN0aW9uIHY0KG9wdGlvbnMsIGJ1Ziwgb2Zmc2V0KSB7XG4gIC8vIERlcHJlY2F0ZWQgLSAnZm9ybWF0JyBhcmd1bWVudCwgYXMgc3VwcG9ydGVkIGluIHYxLjJcbiAgdmFyIGkgPSBidWYgJiYgb2Zmc2V0IHx8IDA7XG5cbiAgaWYgKHR5cGVvZihvcHRpb25zKSA9PSAnc3RyaW5nJykge1xuICAgIGJ1ZiA9IG9wdGlvbnMgPT0gJ2JpbmFyeScgPyBuZXcgQnVmZmVyQ2xhc3MoMTYpIDogbnVsbDtcbiAgICBvcHRpb25zID0gbnVsbDtcbiAgfVxuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuICB2YXIgcm5kcyA9IG9wdGlvbnMucmFuZG9tIHx8IChvcHRpb25zLnJuZyB8fCBfcm5nKSgpO1xuXG4gIC8vIFBlciA0LjQsIHNldCBiaXRzIGZvciB2ZXJzaW9uIGFuZCBgY2xvY2tfc2VxX2hpX2FuZF9yZXNlcnZlZGBcbiAgcm5kc1s2XSA9IChybmRzWzZdICYgMHgwZikgfCAweDQwO1xuICBybmRzWzhdID0gKHJuZHNbOF0gJiAweDNmKSB8IDB4ODA7XG5cbiAgLy8gQ29weSBieXRlcyB0byBidWZmZXIsIGlmIHByb3ZpZGVkXG4gIGlmIChidWYpIHtcbiAgICBmb3IgKHZhciBpaSA9IDA7IGlpIDwgMTY7IGlpKyspIHtcbiAgICAgIGJ1ZltpICsgaWldID0gcm5kc1tpaV07XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGJ1ZiB8fCB1bnBhcnNlKHJuZHMpO1xufVxuXG4vLyBFeHBvcnQgcHVibGljIEFQSVxudmFyIHV1aWQgPSB2NDtcbnV1aWQudjEgPSB2MTtcbnV1aWQudjQgPSB2NDtcbnV1aWQucGFyc2UgPSBwYXJzZTtcbnV1aWQudW5wYXJzZSA9IHVucGFyc2U7XG51dWlkLkJ1ZmZlckNsYXNzID0gQnVmZmVyQ2xhc3M7XG5cbm1vZHVsZS5leHBvcnRzID0gdXVpZDtcbiIsIi8qKlxuKiBUaGUgQW1iYXNzYWRvciBsaXN0ZW5zIHRvIHdoYXQgaGFwcGVucyBpbiBDbGllbnRsYW5kIGFuZFxuKiByZXBvcnRzIGJhY2sgdG8gU2VydmVybGFuZC5cbipcbiogVGhlIEFtYmFzc2Fkb3IgYWxzbyBicmluZ3MgbmV3cyBmcm9tIFNlcnZlcmxhbmQgdG8gQ2xpZW50bGFuZC5cbioqL1xudmFyICQgPSByZXF1aXJlKCcuL3V0aWwuanMnKSxcblx0cmVxdWVzdCA9IHJlcXVpcmUoJ3N1cGVyYWdlbnQnKSxcblx0dmlldyA9IG51bGw7XG5cbnZhciByZXBvcnROZXdOb2RlID0gZnVuY3Rpb24oZSkge1xuXHRyZXF1ZXN0XG5cdFx0LnBvc3QoXCJub2Rlcy9cIilcblx0XHQuc2VuZChlLmRldGFpbC5ub2RlKVxuXHRcdC5lbmQoZnVuY3Rpb24oZXJyLCByZXMpe1xuXG5cdFx0fSk7XG59O1xuXG52YXIgcmVwb3J0RGVsZXRlZE5vZGUgPSBmdW5jdGlvbihlKSB7XG5cdHZhciBub2RlSWQgPSBlLmRldGFpbC5ub2RlSWQ7XG5cblx0cmVxdWVzdFxuXHRcdC5kZWwoXCJub2Rlcy9cIiArIG5vZGVJZClcblx0XHQuZW5kKGZ1bmN0aW9uKGVyciwgcmVzKSB7XG5cdFx0XHRpZiAoZXJyKSBcblx0XHRcdFx0dGhyb3cgXCJFcnJvciB3aGVuIGRlbGV0aW5nIG5vZGUgd2l0aCBpZCBcIiArIG5vZGVJZDtcblx0XHR9KTtcbn07XG5cbnZhciByZXBvcnROb2RlVXBkYXRlID0gZnVuY3Rpb24oZSkge1xuXHRyZXF1ZXN0XG5cdFx0LnBhdGNoKFwibm9kZXMvXCIgKyBlLmRldGFpbC5ub2RlSWQpXG5cdFx0LnNlbmQoZS5kZXRhaWwucGF0Y2gpXG5cdFx0LmVuZChmdW5jdGlvbihlcnIsIHJlcykge1xuXHRcdFx0Ly9jb25zb2xlLmRpcihyZXMpO1xuXHRcdH0pO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihlbCkge1xuXHR2aWV3ID0gZWw7XG5cblx0JCh2aWV3KS5vbihcIngtbm9kZS1jcmVhdGVkXCIsIHJlcG9ydE5ld05vZGUpO1xuXHQkKHZpZXcpLm9uKFwieC1ub2RlLWRlbGV0ZWRcIiwgcmVwb3J0RGVsZXRlZE5vZGUpO1xuXHQkKHZpZXcpLm9uKFwieC1ub2RlLXVwZGF0ZWRcIiwgcmVwb3J0Tm9kZVVwZGF0ZSk7XG59OyIsIi8qKlxuKiBUaGUgRE9NIFdoaXNwZXJlciBpcyByZXNwb25zaWJsZSBmb3IgdGFsa2luZyB0byB0aGUgRE9NIHdoZW4gdGhpbmdzXG4qIGNoYW5nZXMuIEl0IGxpc3RlbnMgZm9yIGV2ZW50cyBlbWl0dGVkIGJ5IG90aGVyIG1vZHVsZXMgc3VjaCBhcyB0aGUgTW91c2UgXG4qIFRyYXBwZXIgYW5kIHRoZSBNb2RlbC5cbioqL1xuXG5yZXF1aXJlKCdlczYtY29sbGVjdGlvbnMnKTtcbnZhciBwYXRoRmluZGVyID0gcmVxdWlyZShcIi4vcGF0aC1maW5kZXJcIik7XG5cbnZhciBzdmdNYWtlciA9IHJlcXVpcmUoXCIuL3N2Zy1tYWtlclwiKSxcblx0JCA9IHJlcXVpcmUoJy4vdXRpbCcpLFxuXHR4eSA9IHJlcXVpcmUoJy4veHknKSxcblx0dXVpZCA9IHJlcXVpcmUoJ3V1aWQnKSxcblx0dmlldyA9IG51bGwsXG5cdG5vZGVzID0gbmV3IE1hcCgpO1xuXHRzZWxlY3RlZE5vZGVzID0gW10sXG5cdHNlbGVjdGVkU29ja2V0ID0gbnVsbCxcblx0ZXZvbHZpbmdSZWxhdGlvbnNoaXAgPSBudWxsO1xuXG52YXIgYWRkTm9kZSA9IGZ1bmN0aW9uKGUpIHtcblx0dmFyIG5vZGUgPSBlLmRldGFpbC5ub2RlO1xuXG5cdHZpZXcuYXBwZW5kQ2hpbGQoc3ZnTWFrZXIuY3JlYXRlU3ZnTm9kZShub2RlKSk7XG5cdG5vZGVzLnNldChub2RlLmlkLCB2aWV3Lmxhc3RDaGlsZCk7XG5cblx0aWYgKGUudHlwZSA9PSBcIngtbm9kZS1jcmVhdGVkXCIpIHtcblx0XHQvLyBHbyBzdHJhaWdodCBpbnRvIGVkaXQgbW9kZSB3aGVuIGNyZWF0aW5nIGEgbmV3IG5vZGVcblx0XHRzZXRBY3RpdmVOb2RlKHZpZXcubGFzdENoaWxkKTtcblx0XHQkKHZpZXcpLmVtaXQoXCJ1aS1lZGl0LW1vZGVcIiwge1xuXHRcdFx0bm9kZUlkOiBub2RlLmlkLFxuXHRcdFx0cG9zaXRpb246IG5vZGUucG9zaXRpb24sXG5cdFx0XHRjdXJyZW50VmFsdWU6IFwiXCJcblx0XHR9KTtcblx0fVxufTtcblxudmFyIGNyZWF0ZU5vZGUgPSBmdW5jdGlvbihlKSB7XG5cdGlmICh0aGlzID09IGUudGFyZ2V0KSB7XG5cdFx0dmFyIG5vZGUgPSB7XG5cdFx0XHRpZDogdXVpZC52NCgpLFxuXHRcdFx0dGV4dDogXCJcIixcblx0XHRcdHBvc2l0aW9uOiBlLmRldGFpbC5wb3NpdGlvblxuXHRcdH07XG5cblx0XHQvLyBNYWtlIHRoZSBwb2ludCB3aGVyZSB0aGUgdXNlciBjbGlja2VkIHRoZSBjZW50ZXIgb2YgdGhlIG5vZGUuXG5cdFx0dmFyIGRlZmF1bHRTaXplID0gc3ZnTWFrZXIuZ2V0RGVmYXVsdE5vZGVTaXplKCk7XG5cdFx0bm9kZS5wb3NpdGlvbi54ID0gbm9kZS5wb3NpdGlvbi54IC0gKGRlZmF1bHRTaXplLndpZHRoIC8gMik7XG5cdFx0bm9kZS5wb3NpdGlvbi55ID0gbm9kZS5wb3NpdGlvbi55IC0gKGRlZmF1bHRTaXplLmhlaWdodCAvIDIpO1xuXG5cdFx0JCh2aWV3KS5lbWl0KFwidWktY3JlYXRlLW5vZGVcIiwge1xuXHRcdFx0bm9kZTogbm9kZVxuXHRcdH0pO1xuXHR9XG59O1xuXG4vKipcbiogU2VuZHMgYSAnY29tbWFuZCcgdG8gdGhlIE1vZGVsLiBUaGUgcmVtb3Zpbmcgb2YgRE9NIG5vZGVzIGlzIHRyaWdnZXJlZCBieVxuKiB0aGUgJ3gtbm9kZS1kZWxldGVkJyBldmVudC5cbioqL1xudmFyIGRlbGV0ZVByZXNzZWQgPSBmdW5jdGlvbigpIHtcblx0c2VsZWN0ZWROb2Rlcy5mb3JFYWNoKGZ1bmN0aW9uKG5vZGUpIHtcblx0XHQkKHZpZXcpLmVtaXQoXCJ1aS1kZWxldGUtbm9kZVwiLCB7XG5cdFx0XHRub2RlSWQ6IG5vZGUuYXR0cmlidXRlc1tcImRhdGEtbm9kZS1pZFwiXS52YWx1ZVxuXHRcdH0pO1xuXHR9KTtcblx0c2VsZWN0ZWROb2Rlcy5sZW5ndGggPSAwO1xufTtcblxudmFyIGRlbGV0ZU5vZGUgPSBmdW5jdGlvbihlKSB7XG5cdC8vIFRPRE86IGNsZWFyIGFsbCByZWZzIHRvIG5vZGUuXG5cdHZhciBub2RlID0gbm9kZXMuZ2V0KGUuZGV0YWlsLm5vZGVJZCk7XG5cdG5vZGUucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChub2RlKTtcblx0bm9kZXMuZGVsZXRlKG5vZGUuaWQpO1xufTtcblxudmFyIGFycm93UHJlc3NlZCA9IGZ1bmN0aW9uKGUpIHtcblx0bW92ZVNlbGVjdGVkTm9kZXMoZSwgdHJ1ZSk7XG59O1xuXG52YXIgY2FuY2VsU2VsZWN0aW9ucyA9IGZ1bmN0aW9uKCkge1xuXHQvLyBUT0RPOiBjbGVhciBldmVudCBsaXN0ZW5lcnMgZnJvbSBjdXJyZW50IGFjdGl2ZSBub2RlLlxuXHRzZWxlY3RlZE5vZGVzLmZvckVhY2goZnVuY3Rpb24obikge1xuXHRcdG4uY2xhc3NMaXN0LnJlbW92ZShcImFjdGl2ZVwiKTtcdFx0XG5cdH0pO1xuXG5cdHNlbGVjdGVkTm9kZXMubGVuZ3RoID0gMDtcbn07XG5cbnZhciBlZGl0Tm9kZVRpdGxlID0gZnVuY3Rpb24oZSkge1xuXHR2YXIgbm9kZSA9IG5vZGVzLmdldChlLmRldGFpbC5ub2RlSWQpLFxuXHRcdHRleHRCb3ggPSBub2RlLnF1ZXJ5U2VsZWN0b3IoXCIubm9kZS10aXRsZVwiKTtcblxuXHQkKHZpZXcpLmVtaXQoXCJ1aS1lZGl0LW1vZGVcIiwge1xuXHRcdG5vZGVJZDogZS5kZXRhaWwubm9kZUlkLFxuXHRcdHBvc2l0aW9uOiB4eShub2RlKSxcblx0XHRjdXJyZW50VmFsdWU6IHRleHRCb3guaW5uZXJUZXh0XG5cdH0pO1xuXG5cdHRleHRCb3guaW5uZXJUZXh0ID0gXCJcIjtcbn07XG5cbnZhciB1cGRhdGVOb2RlVGl0bGUgPSBmdW5jdGlvbihlKSB7XG5cdG5vZGVzLmdldChlLmRldGFpbC5ub2RlSWQpXG5cdFx0LnF1ZXJ5U2VsZWN0b3IoXCIubm9kZS10aXRsZVwiKVxuXHRcdC5pbm5lclRleHQgPSBlLmRldGFpbC5uZXdWYWx1ZTtcbn07XG5cbnZhciBlZGl0Tm9kZUNhbmNlbGxlZCA9IGZ1bmN0aW9uKGUpIHtcblx0bm9kZXMuZ2V0KGUuZGV0YWlsLm5vZGVJZClcblx0XHQucXVlcnlTZWxlY3RvcihcIi5ub2RlLXRpdGxlXCIpXG5cdFx0LmlubmVyVGV4dCA9IGUuZGV0YWlsLnZhbHVlQmVmb3JlRWRpdDtcbn07XG5cbnZhciBzZXRBY3RpdmVOb2RlID0gZnVuY3Rpb24obm9kZSkge1xuXHRjYW5jZWxTZWxlY3Rpb25zKCk7XG5cdHNlbGVjdGVkTm9kZXMucHVzaChub2RlKTtcblx0bm9kZS5jbGFzc0xpc3QuYWRkKFwiYWN0aXZlXCIpO1xufTtcblxudmFyIHNlbGVjdE5vZGUgPSBmdW5jdGlvbihlKSB7XG5cdHZhciBub2RlID0gbm9kZXMuZ2V0KGUuZGV0YWlsLm5vZGVJZCk7XG5cblx0aWYgKGUuZGV0YWlsLnNoaWZ0S2V5KVxuXHRcdGV4cGFuZFNlbGVjdGlvbihub2RlKTtcblx0ZWxzZVxuXHRcdHNldEFjdGl2ZU5vZGUobm9kZSk7XG59O1xuXG52YXIgc2VsZWN0U29ja2V0ID0gZnVuY3Rpb24oZSkge1xuXHRzZWxlY3RlZFNvY2tldCA9IGUuZGV0YWlsLnNvY2tldDtcblx0c2VsZWN0ZWRTb2NrZXQuY2xhc3NMaXN0LmFkZChcImFjdGl2ZVwiKTtcbn07XG5cbnZhciBkZXNlbGVjdFNvY2tldCA9IGZ1bmN0aW9uKGUpIHtcblx0c2VsZWN0ZWRTb2NrZXQgPSBudWxsO1xuXHRlLmRldGFpbC5zb2NrZXQuY2xhc3NMaXN0LnJlbW92ZShcImFjdGl2ZVwiKTtcbn07XG5cbnZhciBleHBhbmRTZWxlY3Rpb24gPSBmdW5jdGlvbihub2RlKSB7XG5cdHNlbGVjdGVkTm9kZXMucHVzaChub2RlKTtcblx0bm9kZS5jbGFzc0xpc3QuYWRkKFwiYWN0aXZlXCIpO1xufTtcblxudmFyIG1vdXNlRHJhZyA9IGZ1bmN0aW9uKGUpIHtcblx0aWYgKG5vdGhpbmdJc1NlbGVjdGVkKCkpe1xuXHRcdC8vIGJlZ2luL2V4cGFuZCBzZWxlY3Rpb25cblx0XHRyZXR1cm47XG5cdH1cblx0XG5cdGlmIChzZWxlY3RlZFNvY2tldCkge1xuXHRcdHZhciB0byA9IHtcblx0XHRcdHg6IGUuZGV0YWlsLm1vdXNlUG9zaXRpb24ueCxcblx0XHRcdHk6IGUuZGV0YWlsLm1vdXNlUG9zaXRpb24ueSxcblx0XHR9O1xuXG5cdFx0aWYgKCFldm9sdmluZ1JlbGF0aW9uc2hpcCkge1xuXHRcdFx0Ly8gVXNlciBpbml0aWF0ZWQgY3JlYXRpb24gb2YgbmV3IHJlbGF0aW9uc2hpcFxuXHRcdFx0dmFyIGZyb20gPSBwYXRoRmluZGVyLmdldFBvaW50T2ZDb25uZWN0aW9uKHNlbGVjdGVkU29ja2V0KTtcblx0XHRcdHZpZXcuYXBwZW5kQ2hpbGQoc3ZnTWFrZXIuY3JlYXRlU3ZnUmVsYXRpb25zaGlwKGZyb20sIHRvKSk7XG5cdFx0XHRldm9sdmluZ1JlbGF0aW9uc2hpcCA9IHZpZXcubGFzdENoaWxkLnF1ZXJ5U2VsZWN0b3IoXCIuZXZvbHZpbmcubGluZVwiKTtcblx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0XHR1cGRhdGVFdm9sdmluZ2luZ1JlbGF0aW9uc2hpcChldm9sdmluZ1JlbGF0aW9uc2hpcCwgc2VsZWN0ZWRTb2NrZXQsIHRvKTtcblx0XHR9XG5cdH1cblx0ZWxzZSB7XG5cdFx0bW92ZVNlbGVjdGVkTm9kZXMoZSwgZmFsc2UpO1x0XHRcblx0fVxufTtcblxudmFyIG1vdXNlT3Zlck5vZGUgPSBmdW5jdGlvbihlKSB7XG5cdHZhciBub2RlID0gbm9kZXMuZ2V0KGUuZGV0YWlsLm5vZGVJZCk7XG59O1xuXG52YXIgbW92ZVNlbGVjdGVkTm9kZXMgPSBmdW5jdGlvbihlLCBlbWl0RXZlbnQpIHtcblx0dmFyIGRlbHRhID0gZS5kZXRhaWwuZGVsdGE7XG5cblx0c2VsZWN0ZWROb2Rlcy5mb3JFYWNoKGZ1bmN0aW9uKG5vZGUpIHtcblx0XHR2YXIgbm9kZVBvc2l0aW9uID0geHkobm9kZSk7XG5cblx0XHRub2RlLnNldEF0dHJpYnV0ZShcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZShcIiArXG5cdFx0XHQobm9kZVBvc2l0aW9uLnggKz0gZGVsdGEueCkgKyBcIiwgXCIgK1xuXHRcdFx0KG5vZGVQb3NpdGlvbi55ICs9IGRlbHRhLnkpICsgXCIpXCIpO1xuXG5cdFx0aWYgKGVtaXRFdmVudCkge1xuXHRcdFx0JCh2aWV3KS5lbWl0KFwidmlldy9ub2RlLW1vdmVkXCIsIHtcblx0XHRcdFx0bm9kZUlkOiBub2RlLmF0dHJpYnV0ZXNbXCJkYXRhLW5vZGUtaWRcIl0udmFsdWUsXG5cdFx0XHRcdHBvc2l0aW9uOiB4eShub2RlKVxuXHRcdFx0fSk7XG5cdFx0fVxuXHR9KTtcbn07XG5cbnZhciB1cGRhdGVFdm9sdmluZ2luZ1JlbGF0aW9uc2hpcCA9IGZ1bmN0aW9uKHBhdGgsIGZyb21Tb2NrZXQsIHRvKSB7XG5cdHBhdGguc2V0QXR0cmlidXRlKFwiZFwiLCBwYXRoRmluZGVyLnBhdGhEZXNjcmlwdGlvbkdlbmVyYXRvcihmcm9tU29ja2V0LCB0bykpO1xufTtcblxudmFyIGRyYWdFbmRlZCA9IGZ1bmN0aW9uKCkge1xuXHRzZWxlY3RlZE5vZGVzLmZvckVhY2goZnVuY3Rpb24obm9kZSkge1xuXHRcdCQodmlldykuZW1pdChcInZpZXcvbm9kZS1tb3ZlZFwiLCB7XG5cdFx0XHRub2RlSWQ6IG5vZGUuYXR0cmlidXRlc1tcImRhdGEtbm9kZS1pZFwiXS52YWx1ZSxcblx0XHRcdHBvc2l0aW9uOiB4eShub2RlKVxuXHRcdH0pO1xuXHR9KTtcblxuXHRpZiAoc2VsZWN0ZWRTb2NrZXQpIHtcblx0XHRzZWxlY3RlZFNvY2tldC5jbGFzc0xpc3QucmVtb3ZlKFwiYWN0aXZlXCIpO1xuXHRcdHNlbGVjdGVkU29ja2V0ID0gbnVsbDtcblx0fVxufTtcblxuZnVuY3Rpb24gbm90aGluZ0lzU2VsZWN0ZWQoKSB7XG5cdHJldHVybiBzZWxlY3RlZE5vZGVzLmxlbmd0aCA9PT0gMCAmJiBzZWxlY3RlZFNvY2tldCA9PT0gbnVsbDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihlbCkge1xuXHR2aWV3ID0gZWw7XG5cdCQoZWwpLm9uKFwieC1ub2RlLWFkZGVkXCIsIGFkZE5vZGUpO1xuXHQkKGVsKS5vbihcIngtbm9kZS1jcmVhdGVkXCIsIGFkZE5vZGUpO1xuXHQkKGVsKS5vbihcIngtbm9kZS1kZWxldGVkXCIsIGRlbGV0ZU5vZGUpO1xuXHQkKGVsKS5vbihcIm1vdXNlLWNyZWF0ZS1ub2RlXCIsIGNyZWF0ZU5vZGUpO1xuXHQkKGVsKS5vbihcIm1vdXNlLWNhbmNlbC1zZWxlY3Rpb25zXCIsIGNhbmNlbFNlbGVjdGlvbnMpO1xuXHQkKGVsKS5vbihcIm1vdXNlL2RyYWdcIiwgbW91c2VEcmFnKTtcblx0JChlbCkub24oXCJtb3VzZS9kcmFnLWVuZFwiLCBkcmFnRW5kZWQpO1xuXHQkKGVsKS5vbihcImtleWJvYXJkLWlucHV0L3N1Ym1pdFwiLCB1cGRhdGVOb2RlVGl0bGUpO1xuXHQkKGVsKS5vbihcImtleWJvYXJkLWlucHV0L2NhbmNlbGxlZFwiLCBlZGl0Tm9kZUNhbmNlbGxlZCk7XG5cdCQoZWwpLm9uKFwia2V5Ym9hcmQtY29tbWFuZC9kZWxldGVcIiwgZGVsZXRlUHJlc3NlZCk7XG5cdCQoZWwpLm9uKFwia2V5Ym9hcmQtY29tbWFuZC91cFwiLCBhcnJvd1ByZXNzZWQpO1xuXHQkKGVsKS5vbihcImtleWJvYXJkLWNvbW1hbmQvcmlnaHRcIiwgYXJyb3dQcmVzc2VkKTtcblx0JChlbCkub24oXCJrZXlib2FyZC1jb21tYW5kL2Rvd25cIiwgYXJyb3dQcmVzc2VkKTtcblx0JChlbCkub24oXCJrZXlib2FyZC1jb21tYW5kL2xlZnRcIiwgYXJyb3dQcmVzc2VkKTtcblx0JChlbCkub24oXCJub2RlL3NlbGVjdGVkXCIsIHNlbGVjdE5vZGUpO1xuXHQkKGVsKS5vbihcIm5vZGUvbW91c2Utb3ZlclwiLCBtb3VzZU92ZXJOb2RlKTtcblx0JChlbCkub24oXCJub2RlL3NvY2tldC1zZWxlY3RlZFwiLCBzZWxlY3RTb2NrZXQpO1xuXHQkKGVsKS5vbihcIm5vZGUvc29ja2V0LWRlc2VsZWN0ZWRcIiwgZGVzZWxlY3RTb2NrZXQpO1xuXHQkKGVsKS5vbihcIm5vZGUvYmVnaW4tZWRpdFwiLCBlZGl0Tm9kZVRpdGxlKTtcbn07IiwidmFyICQgPSByZXF1aXJlKCcuL3V0aWwnKSxcblx0eHkgPSByZXF1aXJlKCcuL3h5Jyk7XG5cbmZ1bmN0aW9uIEtleWJvYXJkSW5wdXQoZWwsIGlucHV0U2VsZWN0b3IpIHtcblxuXHR2YXIgdWkgPSBlbCxcblx0XHRpbnB1dEVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihpbnB1dFNlbGVjdG9yKSxcblx0XHR2YWx1ZUJlZm9yZUVkaXQgPSBudWxsLFxuXHRcdG5vZGVJZCA9IG51bGw7XG5cblx0dGhpcy5fYXNzdW1lVGhlUG9zaXRpb24gPSBmdW5jdGlvbihlKSB7XG5cdFx0bm9kZUlkID0gZS5kZXRhaWwubm9kZUlkO1xuXHRcdHZhbHVlQmVmb3JlRWRpdCA9IGUuZGV0YWlsLmN1cnJlbnRWYWx1ZTtcblx0XHRpbnB1dEVsLnZhbHVlID0gZS5kZXRhaWwuY3VycmVudFZhbHVlO1xuXG5cdFx0dmFyIHBvc2l0aW9uID0gZS5kZXRhaWwucG9zaXRpb247XG5cdFx0aW5wdXRFbC5zdHlsZS5sZWZ0ID0gKHBvc2l0aW9uLnggKyAyKSArIFwicHhcIjtcblx0XHRpbnB1dEVsLnN0eWxlLnRvcCA9IChwb3NpdGlvbi55ICsgMTgpICsgXCJweFwiO1xuXG5cdFx0aW5wdXRFbC5jbGFzc0xpc3QucmVtb3ZlKFwiaGlkZVwiKTtcblx0XHRpbnB1dEVsLmZvY3VzKCk7XHRcdFxuXHR9O1xuXG5cdHRoaXMuX2tleWRvd24gPSBmdW5jdGlvbihlKSB7XG5cdFx0aWYgKCFub2RlSWQpXG5cdFx0XHRyZXR1cm47XG5cblx0XHRpZihlLmtleUNvZGUgPT0gMTMpIHsgLy8gcmV0dXJuXG5cdFx0XHQkKHVpKS5lbWl0KFwia2V5Ym9hcmQtaW5wdXQvc3VibWl0XCIsIHsgXG5cdFx0XHRcdG5vZGVJZDogbm9kZUlkLFxuXHRcdFx0XHRuZXdWYWx1ZTogaW5wdXRFbC52YWx1ZSBcblx0XHRcdH0pO1xuXHRcdFx0XG5cdFx0XHRpbnB1dEVsLmNsYXNzTGlzdC5hZGQoXCJoaWRlXCIpO1xuXHRcdFx0bm9kZUlkID0gbnVsbDtcblx0XHR9XG5cdFx0ZWxzZSBpZihlLmtleUNvZGUgPT0gMjcpIHsgLy8gZXNjXG5cdFx0XHQkKHVpKS5lbWl0KFwia2V5Ym9hcmQtaW5wdXQvY2FuY2VsbGVkXCIsIHtcblx0XHRcdFx0bm9kZUlkOiBub2RlSWQsXG5cdFx0XHRcdHZhbHVlQmVmb3JlRWRpdDogdmFsdWVCZWZvcmVFZGl0XG5cdFx0XHR9KTtcblxuXHRcdFx0bm9kZUlkID0gbnVsbDtcblx0XHRcdGlucHV0RWwuY2xhc3NMaXN0LmFkZChcImhpZGVcIik7XG5cdFx0fVxuXG5cdFx0ZS5zdG9wUHJvcGFnYXRpb24oKTtcblx0fTtcblxuXHR0aGlzLl9ibHVyID0gZnVuY3Rpb24oZSkge1xuXHRcdGlucHV0RWwuY2xhc3NMaXN0LmFkZChcImhpZGVcIik7XG5cdH07XG5cblx0JCh1aSkub24oXCJ1aS1lZGl0LW1vZGVcIiwgdGhpcy5fYXNzdW1lVGhlUG9zaXRpb24pLFxuXHQkKGlucHV0RWwpLm9uKFwia2V5ZG93blwiLCB0aGlzLl9rZXlkb3duKSxcblx0JChpbnB1dEVsKS5vbihcImJsdXJcIiwgdGhpcy5fYmx1cilcbn1cblxuXG5tb2R1bGUuZXhwb3J0cyA9IEtleWJvYXJkSW5wdXQ7IiwiLyoqXG4qIFRoZSBLZXlib2FyZCBTaG9ydGN1dHMuIE5vdCBzdXJlIHdoYXQgaXMgZ29vZCBmb3IuIEkganVzdCBsaWtlZCB0aGUgaWRlYSBvZlxuKiBoYXZpbmcgc2VwZXJhdGUgbW9kdWxlcyBsaXN0ZW5pbmcgZm9yIGtleXN0cm9rZXMgYW5kIGVtaXQgbW9yZSBkb21haW4gc3BlY2lmaWNcbiogZXZlbnRzLlxuKiovXG5cbnZhciAkID0gcmVxdWlyZSgnLi91dGlsJyksXG5cdHZpZXcgPSBudWxsO1xuXG52YXIgaW5pdCA9IGZ1bmN0aW9uKGVsKSB7XG5cdHZpZXcgPSBlbDtcblxuXHQkKGRvY3VtZW50KS5vbihcImtleWRvd25cIiwgZnVuY3Rpb24oZSkge1xuXHRcdHN3aXRjaChlLmtleUNvZGUpIHtcblx0XHRcdGNhc2UgNDY6XG5cdFx0XHRcdCQodmlldykuZW1pdChcImtleWJvYXJkLWNvbW1hbmQvZGVsZXRlXCIpO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgMzc6XG5cdFx0XHRcdCQodmlldykuZW1pdChcImtleWJvYXJkLWNvbW1hbmQvbGVmdFwiLCB7XG5cdFx0XHRcdFx0ZGVsdGE6ICB7XG5cdFx0XHRcdFx0XHR4OiAtNCxcblx0XHRcdFx0XHRcdHk6IDBcblx0XHRcdFx0XHR9fVxuXHRcdFx0XHQpO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgMzg6XG5cdFx0XHRcdCQodmlldykuZW1pdChcImtleWJvYXJkLWNvbW1hbmQvdXBcIiwge1xuXHRcdFx0XHRcdGRlbHRhOiAge1xuXHRcdFx0XHRcdFx0eDogMCxcblx0XHRcdFx0XHRcdHk6IC00XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIDM5OlxuXHRcdFx0XHQkKHZpZXcpLmVtaXQoXCJrZXlib2FyZC1jb21tYW5kL3JpZ2h0XCIsIHtcblx0XHRcdFx0XHRkZWx0YTogIHtcblx0XHRcdFx0XHRcdHg6IDQsXG5cdFx0XHRcdFx0XHR5OiAwXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIDQwOlxuXHRcdFx0XHQkKHZpZXcpLmVtaXQoXCJrZXlib2FyZC1jb21tYW5kL2Rvd25cIiwge1xuXHRcdFx0XHRcdGRlbHRhOiAge1xuXHRcdFx0XHRcdFx0eDogMCxcblx0XHRcdFx0XHRcdHk6IDRcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHRicmVhaztcblx0XHR9XG5cdH0pO1xuXG5cdCQoZG9jdW1lbnQpLm9uKFwia2V5dXBcIiwgZnVuY3Rpb24oZSkge1xuXHRcdHN3aXRjaChlLmtleUNvZGUpIHtcblx0XHRcdGNhc2UgMTg6XG5cdFx0XHRcdCQodmlldykuZW1pdChcImtleWJvYXJkLWNvbW1hbmQvYWx0LXJlbGVhc2VkXCIpO1xuXHRcdFx0XHRicmVhaztcblx0XHR9XG5cdH0pO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cdGluaXQ6IGluaXRcbn07IiwiXG52YXIgcmVxdWVzdCA9IHJlcXVpcmUoJ3N1cGVyYWdlbnQnKSxcblx0bW9kZWwgPSByZXF1aXJlKCcuL21vZGVsJyksXG5cdGRvbVdoaXNwZXJlciA9IHJlcXVpcmUoJy4vZG9tLXdoaXNwZXJlcicpLFxuXHRtb3VzZVRyYXBwZXIgPSByZXF1aXJlKCcuL21vdXNlLXRyYXBwZXInKSxcblx0YW1iYXNzYWRvciA9IHJlcXVpcmUoJy4vYW1iYXNzYWRvcicpLFxuXHRLZXlib2FyZElucHV0ID0gcmVxdWlyZSgnLi9rZXlib2FyZC1pbnB1dCcpO1xuXHRcbnZhciB1aSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLWNhcnRhXScpO1xuXG5kb21XaGlzcGVyZXIodWkpO1xubW91c2VUcmFwcGVyKHVpKTtcbmFtYmFzc2Fkb3IodWkpO1xuS2V5Ym9hcmRJbnB1dCh1aSwgJ1tkYXRhLWlucHV0LWJveF0nKVxucmVxdWlyZSgnLi9rZXlib2FyZC1zaG9ydGN1dHMnKS5pbml0KHVpKTtcblxucmVxdWVzdC5nZXQoJ2Zha2UvZGInLCBmdW5jdGlvbihyZXMpIHtcblx0dmFyIGRiID0gSlNPTi5wYXJzZShyZXMudGV4dCk7XG5cdG1vZGVsLmluaXQoZGIsIHVpKTtcbn0pOyIsIi8qKlxuKiBUaGUgTW9kZWwgaG9sZHMgdGhlIG1hc3RlciBkYXRhIGZvciB0aGUgY2xpZW50IHNpZGUuIEl0IGxpc3RlbnMgdG8gVUkgZXZlbnRzXG4qIGFuZCBlbWl0cyBldmVudHMgYWZ0ZXIgdXBkYXRpbmcgdGhlIG1vZGVsLiBUaGUgZXZlbnRzIGVtaXR0ZWQgdHJpZ2dlcnMgdGhlIFxuKiBBbWJhc3NhZG9yIHRvIHJlcG9ydCBiYWNrIHRvIHRoZSBzZXJ2ZXIuXG4qIFxuKiBJdCBzaG91bGQgYWxzbyBsaXN0ZW4gZm9yIGNoYW5nZXMgZnJvbSB0aGUgc2VydmVyICh2aWEgdGhlIEFtYmFzc2Fkb3IpIGluIGEgXG4qIG11bHRpIHVzZXIgc2NlbmFyaW8uXG4qKi9cblxucmVxdWlyZSgnZXM2LWNvbGxlY3Rpb25zJyk7XG52YXIgJCA9IHJlcXVpcmUoJy4vdXRpbC5qcycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCkge1xuXHR2YXIgbm9kZXMgPSBuZXcgTWFwKCksXG5cdFx0dmlldyA9IG51bGw7XG5cblx0dmFyIGNyZWF0ZU5vZGUgPSBmdW5jdGlvbihlKSB7XG5cdFx0dmFyIG5vZGUgPSBlLmRldGFpbC5ub2RlO1xuXG5cdFx0bm9kZXMuc2V0KG5vZGUuaWQsIG5vZGUpO1xuXHRcdCQodmlldykuZW1pdChcIngtbm9kZS1jcmVhdGVkXCIsIHtcblx0XHRcdG5vZGU6IG5vZGVcdFxuXHRcdH0pO1xuXHR9O1xuXG5cdHZhciByZW1vdmVOb2RlID0gZnVuY3Rpb24oZSkge1xuXHRcdG5vZGVzLmRlbGV0ZShlLmRldGFpbC5ub2RlSWQpO1xuXHRcdCQodmlldykuZW1pdChcIngtbm9kZS1kZWxldGVkXCIsIHtcblx0XHRcdG5vZGVJZDogZS5kZXRhaWwubm9kZUlkXG5cdFx0fSk7XG5cdH07XG5cblx0dmFyIHVwZGF0ZU5vZGVQb3NpdGlvbiA9IGZ1bmN0aW9uKGUpIHtcblx0XHR2YXIgbm9kZSA9IG5vZGVzLmdldChlLmRldGFpbC5ub2RlSWQpO1xuXHRcdG5vZGUucG9zaXRpb24gPSBlLmRldGFpbC5wb3NpdGlvbjtcblxuXHRcdCQodmlldykuZW1pdChcIngtbm9kZS11cGRhdGVkXCIsIHtcblx0XHRcdG5vZGVJZDogbm9kZS5pZCxcblx0XHRcdHBhdGNoOiBbXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRvcDogXCJyZXBsYWNlXCIsXG5cdFx0XHRcdFx0cGF0aDogXCIvcG9zaXRpb25cIixcblx0XHRcdFx0XHR2YWx1ZTogbm9kZS5wb3NpdGlvblxuXHRcdFx0XHR9XG5cdFx0XHRdXG5cdFx0fSk7XG5cdH07XG5cblx0dmFyIHVwZGF0ZU5vZGVUZXh0ID0gZnVuY3Rpb24oZSkge1xuXHRcdHZhciBub2RlID0gbm9kZXMuZ2V0KGUuZGV0YWlsLm5vZGVJZCk7XG5cdFx0bm9kZS50ZXh0ID0gZS5kZXRhaWwubmV3VmFsdWU7XG5cblx0XHQkKHZpZXcpLmVtaXQoXCJ4LW5vZGUtdXBkYXRlZFwiLCB7XG5cdFx0XHRub2RlSWQ6IG5vZGUuaWQsXG5cdFx0XHRwYXRjaDogW1xuXHRcdFx0XHR7XG5cdFx0XHRcdFx0b3A6IFwicmVwbGFjZVwiLFxuXHRcdFx0XHRcdHBhdGg6IFwiL3RleHRcIixcblx0XHRcdFx0XHR2YWx1ZTogbm9kZS50ZXh0XG5cdFx0XHRcdH1cblx0XHRcdF1cblx0XHR9KTtcblx0fTtcblxuXHRyZXR1cm4ge1xuXHRcdGluaXQ6IGZ1bmN0aW9uKGRiLCBlbCkge1xuXHRcdFx0dmlldyA9IGVsO1xuXG5cdFx0XHRkYi5ub2Rlcy5mb3JFYWNoKGZ1bmN0aW9uKG5vZGUpIHtcblx0XHRcdFx0bm9kZXMuc2V0KG5vZGUuaWQsIG5vZGUpO1xuXHRcdFx0XHQkKGVsKS5lbWl0KFwieC1ub2RlLWFkZGVkXCIsIHtcblx0XHRcdFx0XHRub2RlOiBub2RlXG5cdFx0XHRcdH0pO1xuXHRcdFx0fSk7XG5cblx0XHRcdCQodmlldykub24oXCJ1aS1jcmVhdGUtbm9kZVwiLCBjcmVhdGVOb2RlKTtcblx0XHRcdCQodmlldykub24oXCJ1aS1kZWxldGUtbm9kZVwiLCByZW1vdmVOb2RlKTtcblx0XHRcdCQodmlldykub24oXCJ2aWV3L25vZGUtbW92ZWRcIiwgdXBkYXRlTm9kZVBvc2l0aW9uKTtcblx0XHRcdCQodmlldykub24oXCJrZXlib2FyZC1pbnB1dC9zdWJtaXRcIiwgdXBkYXRlTm9kZVRleHQpO1xuXHRcdH1cblx0fTtcbn0oKTsiLCIvKipcbiogVGhlIE1vdXNlIFRyYXBwZXIgbGlzdGVucyB0byBtb3VzZSBldmVudHMgZnJvbSB0aGUgY2FudmFzIGFuZCB0cmllcyB0byBmaWd1cmUgb3V0IHRoZSB1c2Vyc1xuKiBpbnRlbnQgYW5kIGVtaXRzIG1vcmUgc3BlY2lmaWMgZXZlbnRzIHRoYXQgb3RoZXIgbW9kdWxlcyBhY3RzIG9uLlxuKi9cblxudmFyICQgPSByZXF1aXJlKCcuL3V0aWwnKSxcblx0eHkgPSByZXF1aXJlKCcuL3h5JyksXG5cdHZpZXcgPSBudWxsLFxuXHRtb3VzZUlzRG93biA9IGZhbHNlLFxuXHRkcmFnZ2luZyA9IGZhbHNlLFxuXHRsYXN0TW91c2VQb3NpdGlvbiA9IG51bGw7XG5cbnZhciBtb3VzZURvd24gPSBmdW5jdGlvbihlKSB7XG5cdG1vdXNlSXNEb3duID0gdHJ1ZTtcblx0bGFzdE1vdXNlUG9zaXRpb24gPSB4eShlKTtcblxuXHRpZiAodGFyZ2V0SXNDYW52YXMoZSkpIHtcblx0XHQkKHZpZXcpLmVtaXQoXCJtb3VzZS1jYW5jZWwtc2VsZWN0aW9uc1wiKTtcdFx0XG5cdH1cbn07XG5cbnZhciBtb3VzZU1vdmUgPSBmdW5jdGlvbihlKSB7XG5cdGlmIChtb3VzZUlzRG93biB8fCBlLmFsdEtleSkge1xuXHRcdGRyYWdnaW5nID0gdHJ1ZTtcblxuXHRcdC8vIElmIHRoZSB1c2VyIGFsdC1kcmFncyAoYS5rLmEuIGZsb2F0cykgd2UgbmVlZCB0byBzZXQgbGFzdE1vdXNlUG9zaXRpb25cblx0XHQvLyBhdCB0aGUgYmVnaW5uaW5nIG9mIHRoYXQgYWN0aW9uLlxuXHRcdGlmICghbGFzdE1vdXNlUG9zaXRpb24pXG5cdFx0XHRsYXN0TW91c2VQb3NpdGlvbiA9IHh5KGUpO1xuXG5cdFx0dmFyIGRlbHRhID0ge1xuXHRcdFx0eDogZS5jbGllbnRYIC0gbGFzdE1vdXNlUG9zaXRpb24ueCwgXG5cdFx0XHR5OiBlLmNsaWVudFkgLSBsYXN0TW91c2VQb3NpdGlvbi55XG5cdFx0fTtcblxuXHRcdCQodmlldykuZW1pdChcIm1vdXNlL2RyYWdcIiwge1xuXHRcdFx0ZGVsdGE6IGRlbHRhLFxuXHRcdFx0bW91c2VQb3NpdGlvbjogeHkoZSlcblx0XHR9KTtcblxuXHRcdGxhc3RNb3VzZVBvc2l0aW9uID0geHkoZSk7XG5cdH1cbn07XG5cbnZhciBtb3VzZVVwID0gZnVuY3Rpb24oZSkge1xuXHRtb3VzZUlzRG93biA9IGZhbHNlO1xuXHRsYXN0TW91c2VQb3NpdGlvbiA9IG51bGw7XG5cblx0aWYgKGRyYWdnaW5nKSB7XG5cdFx0JCh2aWV3KS5lbWl0KFwibW91c2UvZHJhZy1lbmRcIiwge30pO1xuXHRcdGRyYWdnaW5nID0gZmFsc2U7XG5cdH1cbn07XG5cbnZhciBkb3VibGVDbGljayA9IGZ1bmN0aW9uKGUpIHtcblx0aWYgKHRhcmdldElzQ2FudmFzKGUpKSB7XG5cdFx0JCh2aWV3KS5lbWl0KFwibW91c2UtY3JlYXRlLW5vZGVcIiwge1xuXHRcdFx0cG9zaXRpb246IHh5KGUpXG5cdFx0fSk7XG5cdH1cbn07XG5cbmZ1bmN0aW9uIHRhcmdldElzQ2FudmFzKGUpIHtcblx0cmV0dXJuIGUudGFyZ2V0LmlkID09PSBcImNhbnZhc1wiO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGVsKSB7XG5cdHZpZXcgPSBlbDtcblxuXHQkKGVsKS5vbihcIm1vdXNlZG93blwiLCBtb3VzZURvd24pO1xuXHQkKGVsKS5vbihcIm1vdXNldXBcIiwgbW91c2VVcCk7XG5cdCQoZWwpLm9uKFwiZGJsY2xpY2tcIiwgZG91YmxlQ2xpY2spO1xuXHQkKGVsKS5vbihcIm1vdXNlbW92ZVwiLCBtb3VzZU1vdmUpO1xuXHQkKGVsKS5vbihcImtleWJvYXJkLWNvbW1hbmQvYWx0LXJlbGVhc2VkXCIsIGZ1bmN0aW9uKCkgeyBpZiAoZHJhZ2dpbmcpIG1vdXNlVXAoKTsgfSApO1xufTsiLCJ2YXIgJCA9IHJlcXVpcmUoXCIuL3V0aWxcIik7XG5cbnZhciBpbml0ID0gZnVuY3Rpb24obm9kZUVsZW1lbnQsIG5vZGVJZCkge1xuXG5cdCQobm9kZUVsZW1lbnQpLm9uKFwibW91c2Vkb3duXCIsIGZ1bmN0aW9uKGUpIHtcblx0XHQkKG5vZGVFbGVtZW50KS5lbWl0KFwibm9kZS9zZWxlY3RlZFwiLCB7XG5cdFx0XHRub2RlSWQ6IG5vZGVJZCxcblx0XHRcdHNoaWZ0S2V5OiBlLnNoaWZ0S2V5XG5cdFx0fSk7XG5cdH0pO1xuXG5cdCQobm9kZUVsZW1lbnQpLm9uKFwiZGJsY2xpY2tcIiwgZnVuY3Rpb24oZSkge1xuXHRcdCQobm9kZUVsZW1lbnQpLmVtaXQoXCJub2RlL2JlZ2luLWVkaXRcIiwge1xuXHRcdFx0bm9kZUlkOiBub2RlSWRcblx0XHR9KTtcblx0fSk7XG5cblx0JChub2RlRWxlbWVudC5xdWVyeVNlbGVjdG9yKFwiLm5vZGVcIikpLm9uKFwibW91c2VvdmVyXCIsIGZ1bmN0aW9uKGUpIHtcblx0XHQkKG5vZGVFbGVtZW50KS5lbWl0KFwibm9kZS9tb3VzZS1vdmVyXCIsIHtcblx0XHRcdG5vZGVJZDogbm9kZUlkXG5cdFx0fSk7XG5cdH0pO1xuXG5cdHZhciBzb2NrZXRzID0gbm9kZUVsZW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5zb2NrZXRcIik7XG5cblx0Zm9yKHZhciBpID0gMDsgaSA8IHNvY2tldHMubGVuZ3RoOyBpKyspIHtcblx0XHQkKHNvY2tldHNbaV0pLm9uKFwibW91c2Vkb3duXCIsIGZ1bmN0aW9uKGUpIHtcblx0XHRcdCQobm9kZUVsZW1lbnQpLmVtaXQoXCJub2RlL3NvY2tldC1zZWxlY3RlZFwiLCB7XG5cdFx0XHRcdHNvY2tldDogZS50YXJnZXRcblx0XHRcdH0pO1xuXHRcdH0pO1xuXG5cdFx0JChzb2NrZXRzW2ldKS5vbihcIm1vdXNldXBcIiwgZnVuY3Rpb24oZSkge1xuXHRcdFx0JChub2RlRWxlbWVudCkuZW1pdChcIm5vZGUvc29ja2V0LWRlc2VsZWN0ZWRcIiwge1xuXHRcdFx0XHRzb2NrZXQ6IGUudGFyZ2V0XG5cdFx0XHR9KTtcblx0XHR9KTtcblx0fVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cdGluaXQ6IGluaXRcbn07IiwiZnVuY3Rpb24gZElzRm9yRGVzY3JpcHRpb24oZnJvbVNvY2tldCwgdG8pIHtcblxuICAgIHZhciBkID0gW1xuICAgICAgICAvLyBtID0gTW92ZVRvIHJlbGF0aXZlIHRvIGdyb3VwXG4gICAgICAgIFwibVwiLCAwLCAwLFxuICAgIF07XG5cbiAgICB2YXIgYXNzdW1lZFN0YXJ0aW5nUG9pbnRPZlBhdGggPSBfZ2V0Q29ubmVjdGlvblBvaW50KGZyb21Tb2NrZXQpLFxuICAgICAgICBkZWx0YSA9IHtcbiAgICAgICAgICAgIHg6IHRvLnggLSBhc3N1bWVkU3RhcnRpbmdQb2ludE9mUGF0aC54LFxuICAgICAgICAgICAgeTogdG8ueSAtIGFzc3VtZWRTdGFydGluZ1BvaW50T2ZQYXRoLnlcbiAgICAgICAgfTtcblxuICAgIHZhciBzb2NrZXREaXJlY3Rpb24gPSBfZ2V0U29ja2V0RGlyZWN0aW9uKGZyb21Tb2NrZXQpO1xuXG4gICAgaWYgKHNvY2tldERpcmVjdGlvbiA9PT0gXCJ1cFwiKSB7XG4gICAgICAgIGQucHVzaChcInZcIiArIGRlbHRhLnkpO1xuXG4gICAgICAgIGlmIChkZWx0YS54IDwgMClcbiAgICAgICAgICAgIGQucHVzaChcImEgNSw1IDAgMCwgMCAtNSwtNVwiKTtcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgZC5wdXNoKFwiYSA1LDUgMCAwLCAxIDUsLTVcIik7XG5cbiAgICAgICAgZC5wdXNoKFwiaFwiICsgZGVsdGEueCk7XG4gICAgfVxuXG4gICAgaWYgKHNvY2tldERpcmVjdGlvbiA9PT0gXCJyaWdodFwiKSB7XG4gICAgICAgIGQucHVzaChcImhcIiArIGRlbHRhLngpO1xuICAgICAgICBcbiAgICAgICAgaWYgKGRlbHRhLnkgPCAwKVxuICAgICAgICAgICAgZC5wdXNoKFwiYSA1LDUgMCAwLCAwIDUsLTVcIik7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIGQucHVzaChcImEgNSw1IDAgMCwgMSA1LDVcIik7XG5cbiAgICAgICAgZC5wdXNoKFwidlwiICsgZGVsdGEueSk7XG4gICAgfVxuXG4gICAgaWYgKHNvY2tldERpcmVjdGlvbiA9PT0gXCJkb3duXCIpIHtcbiAgICAgICAgZC5wdXNoKFwidlwiICsgZGVsdGEueSk7XG4gICAgICAgIFxuICAgICAgICBpZiAoZGVsdGEueCA8IDApXG4gICAgICAgICAgICBkLnB1c2goXCJhIDUsNSAwIDAsIDEgLTUsNVwiKTtcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgZC5wdXNoKFwiYSA1LDUgMCAwLCAwIDUsNVwiKTtcblxuICAgICAgICBkLnB1c2goXCJoXCIgKyBkZWx0YS54KTtcbiAgICB9XG5cbiAgICBpZiAoc29ja2V0RGlyZWN0aW9uID09PSBcImxlZnRcIikge1xuICAgICAgICBkLnB1c2goXCJoXCIgKyBkZWx0YS54KTtcbiAgICAgICAgXG4gICAgICAgIGlmIChkZWx0YS55IDwgMClcbiAgICAgICAgICAgIGQucHVzaChcImEgNSw1IDAgMCwgMSAtNSwtNVwiKTtcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgZC5wdXNoKFwiYSA1LDUgMCAwLCAwIC01LDVcIik7XG5cbiAgICAgICAgZC5wdXNoKFwidlwiICsgZGVsdGEueSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGQuam9pbihcIiBcIik7XG59XG5cbmZ1bmN0aW9uIF9nZXRDb25uZWN0aW9uUG9pbnQoc29ja2V0KSB7XG5cbiAgICB2YXIgbm9kZVRyYW5zZm9ybSA9IHNvY2tldC5wYXJlbnROb2RlLmdldEF0dHJpYnV0ZShcInRyYW5zZm9ybVwiKSxcbiAgICAgICAgbm9kZVRyYW5zZm9ybVZhbHVlcyA9IG5vZGVUcmFuc2Zvcm0ubWF0Y2goL1xcZCssIFxcZCsvKVswXS5zcGxpdChcIiwgXCIpLFxuICAgICAgICBub2RlT2Zmc2V0ID0ge1xuICAgICAgICAgICAgeDogK25vZGVUcmFuc2Zvcm1WYWx1ZXNbMF0sXG4gICAgICAgICAgICB5OiArbm9kZVRyYW5zZm9ybVZhbHVlc1sxXVxuICAgICAgICB9O1xuXG4gICAgdmFyIHNvY2tldE9mZnNldCA9IHtcbiAgICAgICAgeDogcGFyc2VJbnQoc29ja2V0LmdldEF0dHJpYnV0ZShcInhcIiksIDEwKSxcbiAgICAgICAgeTogcGFyc2VJbnQoc29ja2V0LmdldEF0dHJpYnV0ZShcInlcIiksIDEwKVxuICAgIH07XG5cbiAgICB2YXIgc29ja2V0RGlyZWN0aW9uID0gX2dldFNvY2tldERpcmVjdGlvbihzb2NrZXQpLFxuICAgICAgICBwaXhlbFB1c2hYID0gc29ja2V0RGlyZWN0aW9uLm1hdGNoKC9sZWZ0LykgPyAxIDogMztcbiAgICAgICAgcGl4ZWxQdXNoWSA9IHNvY2tldERpcmVjdGlvbi5tYXRjaCgvdXAvKSA/IDEgOiAzO1xuXG4gICAgdmFyIHN0YXJ0UG9zaXRpb24gPSB7XG4gICAgICAgIHg6IG5vZGVPZmZzZXQueCArIHNvY2tldE9mZnNldC54ICsgcGl4ZWxQdXNoWCxcbiAgICAgICAgeTogbm9kZU9mZnNldC55ICsgc29ja2V0T2Zmc2V0LnkgKyBwaXhlbFB1c2hZXG4gICAgfTtcblxuICAgIHJldHVybiBzdGFydFBvc2l0aW9uO1xufVxuXG5mdW5jdGlvbiBfZ2V0U29ja2V0RGlyZWN0aW9uKHNvY2tldCkge1xuICAgIHJldHVybiBzb2NrZXQuZ2V0QXR0cmlidXRlKFwiZGF0YS1zb2NrZXQtZGlyZWN0aW9uXCIpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBwYXRoRGVzY3JpcHRpb25HZW5lcmF0b3I6IGRJc0ZvckRlc2NyaXB0aW9uLFxuICAgIGdldFBvaW50T2ZDb25uZWN0aW9uOiBfZ2V0Q29ubmVjdGlvblBvaW50LFxufTsiLCIvKipcbiogVGhlIFNWRyBNYWtlciBpcyByZXNwb25zaWJsZSBmb3IgY3JlYXRpbmcgc3ZnIHJlcHJlc2VudGF0aW9ucyBvZlxuKiBlbnRpdGllcyBpbiB0aGUgbW9kZWwuXG4qKi9cblxudmFyIHN2Z05hbWVTcGFjZSA9IFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIixcblx0bm9kZUV2ZW50cyA9IHJlcXVpcmUoXCIuL25vZGUtZXZlbnRzXCIpLFxuXHRwYXRoRmluZGVyID0gcmVxdWlyZShcIi4vcGF0aC1maW5kZXJcIik7XG5cbnZhciBkZWZhdWx0cyA9IHsgXG5cdG5vZGU6IHsgXG5cdFx0d2lkdGg6IDEyMCxcblx0XHRoZWlnaHQ6IDYwXG5cdH0sXG5cdHNvY2tldDoge1xuXHRcdHdpZHRoOiA2LFxuXHRcdGhlaWdodDogNlxuXHR9LFxufTtcblxudmFyIGNyZWF0ZVN2Z1JlcHJlc2VudGF0aW9uT2ZOb2RlID0gZnVuY3Rpb24obm9kZSkge1xuXHR2YXIgZnJhZyBcdFx0PSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCksXG5cdFx0Z3JvdXAgXHRcdD0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKHN2Z05hbWVTcGFjZSwgXCJnXCIpLFxuXHRcdHJlY3QgXHRcdD0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKHN2Z05hbWVTcGFjZSwgXCJyZWN0XCIpLFxuXHRcdGh0bWxIb3N0XHQ9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhzdmdOYW1lU3BhY2UsIFwiZm9yZWlnbk9iamVjdFwiKSxcblx0XHR0ZXh0Qm94ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKSxcblx0XHRzb2NrZXRUb3BcdD0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKHN2Z05hbWVTcGFjZSwgXCJyZWN0XCIpLFxuXHRcdHNvY2tldFJpZ2h0XHQ9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhzdmdOYW1lU3BhY2UsIFwicmVjdFwiKSxcblx0XHRzb2NrZXRCb3R0b21cdD0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKHN2Z05hbWVTcGFjZSwgXCJyZWN0XCIpLFxuXHRcdHNvY2tldExlZnRcdD0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKHN2Z05hbWVTcGFjZSwgXCJyZWN0XCIpO1xuXG5cdHZhciBzb2NrZXRzID0gW3NvY2tldFRvcCwgc29ja2V0UmlnaHQsIHNvY2tldEJvdHRvbSwgc29ja2V0TGVmdF07XG5cblx0cmVjdC5jbGFzc0xpc3QuYWRkKFwibm9kZVwiKTtcblx0cmVjdC5zZXRBdHRyaWJ1dGUoXCJ3aWR0aFwiLCBkZWZhdWx0cy5ub2RlLndpZHRoLnRvU3RyaW5nKCkpO1xuXHRyZWN0LnNldEF0dHJpYnV0ZShcImhlaWdodFwiLCBkZWZhdWx0cy5ub2RlLmhlaWdodC50b1N0cmluZygpKTtcblx0cmVjdC5zZXRBdHRyaWJ1dGUoXCJyeFwiLCBcIjNcIik7XG5cdHJlY3Quc2V0QXR0cmlidXRlKFwicnlcIiwgXCIzXCIpO1xuXG5cdC8vIEluc2VydCBhdCBcblx0aHRtbEhvc3Quc2V0QXR0cmlidXRlKFwieFwiLCAwKTtcblx0aHRtbEhvc3Quc2V0QXR0cmlidXRlKFwieVwiLCAwKTtcblx0aHRtbEhvc3Quc2V0QXR0cmlidXRlKFwid2lkdGhcIiwgZGVmYXVsdHMubm9kZS53aWR0aCk7XG5cdGh0bWxIb3N0LnNldEF0dHJpYnV0ZShcImhlaWdodFwiLCBkZWZhdWx0cy5ub2RlLmhlaWdodCk7XG5cdHRleHRCb3guY2xhc3NMaXN0LmFkZChcIm5vZGUtdGl0bGVcIik7XG5cdHRleHRCb3guaW5uZXJUZXh0ID0gbm9kZS50ZXh0O1xuXHRodG1sSG9zdC5hcHBlbmRDaGlsZCh0ZXh0Qm94KTtcblxuXHRzb2NrZXRzLmZvckVhY2goZnVuY3Rpb24oc29ja2V0KSB7XG5cdFx0c29ja2V0LmNsYXNzTGlzdC5hZGQoXCJzb2NrZXRcIik7XG5cdFx0c29ja2V0LnNldEF0dHJpYnV0ZShcIndpZHRoXCIsIGRlZmF1bHRzLnNvY2tldC53aWR0aCk7XG5cdFx0c29ja2V0LnNldEF0dHJpYnV0ZShcImhlaWdodFwiLCBkZWZhdWx0cy5zb2NrZXQud2lkdGgpO1x0XG5cdH0pO1xuXHRcblx0c29ja2V0VG9wLnNldEF0dHJpYnV0ZShcInhcIiwgKGRlZmF1bHRzLm5vZGUud2lkdGggLyAyKSAtIChkZWZhdWx0cy5zb2NrZXQud2lkdGggLyAyKSk7XG5cdHNvY2tldFRvcC5zZXRBdHRyaWJ1dGUoXCJ5XCIsIC0oZGVmYXVsdHMuc29ja2V0LmhlaWdodCAvIDIpKTtcblx0Ly8gQ2hyb21pdW0gZG9lcyBub3Qgc3VwcG9ydCBkYXRhc2V0IG9uIEVsZW1lbnQsIG9ubHkgb24gSHRtbEVsZW1lbnRcblx0c29ja2V0VG9wLnNldEF0dHJpYnV0ZShcImRhdGEtc29ja2V0LWRpcmVjdGlvblwiLCBcInVwXCIpO1xuXG5cdHNvY2tldFJpZ2h0LnNldEF0dHJpYnV0ZShcInhcIiwgZGVmYXVsdHMubm9kZS53aWR0aCAtIChkZWZhdWx0cy5zb2NrZXQud2lkdGggLyAyKSk7XG5cdHNvY2tldFJpZ2h0LnNldEF0dHJpYnV0ZShcInlcIiwgKGRlZmF1bHRzLm5vZGUuaGVpZ2h0IC8gMikgLSAoZGVmYXVsdHMuc29ja2V0LmhlaWdodCAvIDIpKTtcblx0c29ja2V0UmlnaHQuc2V0QXR0cmlidXRlKFwiZGF0YS1zb2NrZXQtZGlyZWN0aW9uXCIsIFwicmlnaHRcIik7XG5cblx0c29ja2V0Qm90dG9tLnNldEF0dHJpYnV0ZShcInhcIiwgKGRlZmF1bHRzLm5vZGUud2lkdGggLyAyKSAtIChkZWZhdWx0cy5zb2NrZXQud2lkdGggLyAyKSk7XG5cdHNvY2tldEJvdHRvbS5zZXRBdHRyaWJ1dGUoXCJ5XCIsIGRlZmF1bHRzLm5vZGUuaGVpZ2h0IC0gKGRlZmF1bHRzLnNvY2tldC5oZWlnaHQgLyAyKSk7XG5cdHNvY2tldEJvdHRvbS5zZXRBdHRyaWJ1dGUoXCJkYXRhLXNvY2tldC1kaXJlY3Rpb25cIiwgXCJkb3duXCIpO1xuXG5cdHNvY2tldExlZnQuc2V0QXR0cmlidXRlKFwieFwiLCAtKGRlZmF1bHRzLnNvY2tldC53aWR0aCAvIDIpKTtcblx0c29ja2V0TGVmdC5zZXRBdHRyaWJ1dGUoXCJ5XCIsIChkZWZhdWx0cy5ub2RlLmhlaWdodCAvIDIpIC0gKGRlZmF1bHRzLnNvY2tldC5oZWlnaHQgLyAyKSk7XG5cdHNvY2tldExlZnQuc2V0QXR0cmlidXRlKFwiZGF0YS1zb2NrZXQtZGlyZWN0aW9uXCIsIFwibGVmdFwiKTtcblxuXHRncm91cC5hcHBlbmRDaGlsZChyZWN0KTtcblx0Z3JvdXAuYXBwZW5kQ2hpbGQoaHRtbEhvc3QpO1xuXHRncm91cC5hcHBlbmRDaGlsZChzb2NrZXRUb3ApO1xuXHRncm91cC5hcHBlbmRDaGlsZChzb2NrZXRSaWdodCk7XG5cdGdyb3VwLmFwcGVuZENoaWxkKHNvY2tldEJvdHRvbSk7XG5cdGdyb3VwLmFwcGVuZENoaWxkKHNvY2tldExlZnQpO1xuXG5cdGdyb3VwLnNldEF0dHJpYnV0ZShcImRhdGEtbm9kZS1pZFwiLCBub2RlLmlkKTtcblx0Z3JvdXAuc2V0QXR0cmlidXRlKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKFwiICsgbm9kZS5wb3NpdGlvbi54ICsgXCIsIFwiICsgbm9kZS5wb3NpdGlvbi55ICsgXCIpXCIpO1xuXG5cdC8vIFNldHVwIGV2ZW50cyBmb3IgdGhlIG5vZGVcblx0bm9kZUV2ZW50cy5pbml0KGdyb3VwLCBub2RlLmlkKTtcblxuXHRmcmFnLmFwcGVuZENoaWxkKGdyb3VwKTtcblxuXHRyZXR1cm4gZnJhZztcbn07XG5cbnZhciBjcmVhdGVTdmdSZXByZXNlbnRhdGlvbk9mUmVsYXRpb25zaGlwID0gZnVuY3Rpb24oZnJvbSkge1xuXHR2YXIgZnJhZ1x0PSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCksXG5cdFx0Z3JvdXAgXHQ9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhzdmdOYW1lU3BhY2UsIFwiZ1wiKSxcblx0XHRwYXRoXHQ9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhzdmdOYW1lU3BhY2UsIFwicGF0aFwiKTtcblx0XHRcblx0Z3JvdXAuc2V0QXR0cmlidXRlKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKFwiICsgZnJvbS54ICsgXCIsIFwiICsgZnJvbS55ICsgXCIpXCIpO1xuXG5cdHBhdGguY2xhc3NMaXN0LmFkZChcImxpbmVcIiwgXCJldm9sdmluZ1wiKTtcblxuXHR2YXIgZCA9IFtcblx0XHQvLyBtID0gTW92ZVRvIHJlbGF0aXZlIHRvIGdyb3VwXG5cdFx0XCJtXCIsIDAsIDAsXG5cdF07XG5cblx0cGF0aC5zZXRBdHRyaWJ1dGUoXCJkXCIsIGQuam9pbihcIiBcIikpO1xuXG5cdGdyb3VwLmFwcGVuZENoaWxkKHBhdGgpO1xuXHRmcmFnLmFwcGVuZENoaWxkKGdyb3VwKTtcblx0cmV0dXJuIGZyYWc7XHRcbn07XG5cbnZhciBnZXREZWZhdWx0Tm9kZVNpemUgPSBmdW5jdGlvbigpIHtcblx0cmV0dXJuIGRlZmF1bHRzLm5vZGU7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblx0Y3JlYXRlU3ZnTm9kZTogY3JlYXRlU3ZnUmVwcmVzZW50YXRpb25PZk5vZGUsXG5cdGNyZWF0ZVN2Z1JlbGF0aW9uc2hpcDogY3JlYXRlU3ZnUmVwcmVzZW50YXRpb25PZlJlbGF0aW9uc2hpcCxcblx0Z2V0RGVmYXVsdE5vZGVTaXplOiBnZXREZWZhdWx0Tm9kZVNpemVcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihlbCkge1xuXHRmdW5jdGlvbiBzdWIobmFtZSwgY2IpIHtcblx0XHR0aGlzLmFkZEV2ZW50TGlzdGVuZXIobmFtZSwgY2IpO1xuXHR9XG5cblx0ZnVuY3Rpb24gcHViKG5hbWUsIGRldGFpbHMpIHtcblx0XHR0aGlzLmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KG5hbWUsIHtcblx0XHRcdGJ1YmJsZXM6IHRydWUsXG5cdFx0XHRkZXRhaWw6IGRldGFpbHNcblx0XHR9KSk7XG5cdH1cblxuXHRyZXR1cm4geyBcblx0XHRvbjogc3ViLmJpbmQoZWwpLFxuXHRcdGVtaXQ6IHB1Yi5iaW5kKGVsKVxuXHR9O1xufTsiLCIvKiogXG4qIFJldHVybnMgdGhlIHggYW5kIHkgdmFsdWVzIGZyb20gYSBNb3VzZUV2ZW50IG9yIGEgc3ZnIGdyb3VwIGVsZW1lbnQgKHRoYXQgZ2V0cyBcbiogaXRzIHBvc2l0aW9uIHZpYSBhIGNzcyB0cmFuc2xhdGUgZnVuY3Rpb24pLlxuKi9cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihvYmopIHtcblx0Ly8gVE9ETzogY29uc3RydWN0b3IubmFtZSBpcyBhIEVTNiBmZWF0dXJlIGN1cnJlbnRseSBub3Qgc3VwcG9ydGVkIGJ5IElFXG5cdHZhciBjdG9yID0gb2JqLmNvbnN0cnVjdG9yLm5hbWU7XG5cblx0aWYgKGN0b3IgPT0gXCJNb3VzZUV2ZW50XCIpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0eDogb2JqLmNsaWVudFgsXG5cdFx0XHR5OiBvYmouY2xpZW50WVxuXHRcdH07XG5cdH1cblxuXHRpZiAoY3RvciA9PSBcIlNWR0dFbGVtZW50XCIpXG5cdFx0cmV0dXJuIGdldFRyYW5zbGF0ZVZhbHVlcyhvYmopO1xuXHRlbHNlIGlmIChjdG9yID09IFwiU1ZHUmVjdEVsZW1lbnRcIilcblx0XHRyZXR1cm4gZ2V0WHlWYWx1ZXMob2JqKTtcbn07XG5cbmZ1bmN0aW9uIGdldFRyYW5zbGF0ZVZhbHVlcyhlbCkge1xuXHR2YXIgc3RyID0gZWwuZ2V0QXR0cmlidXRlKFwidHJhbnNmb3JtXCIpO1xuXG5cdC8vIFJldHVybiB6ZXJvcyBpZiBubyB0cmFuc2FsYXRlIGZ1bmN0aW9uIGNhbiBiZSBmb3VuZC5cblx0aWYgKHN0ci5sZW5ndGggPCAxNCB8fCBzdHIuc2xpY2UoMCwgMTApICE9IFwidHJhbnNsYXRlKFwiKVxuXHRcdHJldHVybiB7IHg6IDAsIHk6IDAgfTtcblxuXHR2YXIgdmFsdWVzID0gc3RyLnNsaWNlKDEwLCAtMSkuc3BsaXQoXCIgXCIpO1xuXG5cdHJldHVybiB7XG5cdFx0eDogcGFyc2VJbnQodmFsdWVzWzBdKSxcblx0XHR5OiBwYXJzZUludCh2YWx1ZXNbMV0pXG5cdH07XG59XG5cbmZ1bmN0aW9uIGdldFh5VmFsdWVzKGVsKSB7XG5cdHJldHVybiB7XG5cdFx0eDogZWwuZ2V0QXR0cmlidXRlKFwieFwiKSxcblx0XHR5OiBlbC5nZXRBdHRyaWJ1dGUoXCJ5XCIpXG5cdH07XG59Il19
