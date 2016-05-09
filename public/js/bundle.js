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

    if (/up|down/.test(socketDirection)) {
        d.push("v" + delta.y);
        d.push("h" + delta.x);
    }
    else {
        d.push("h" + delta.x);
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

    console.dir(nodeOffset);
    console.dir(startPosition)

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3Vzci9sb2NhbC9saWIvbm9kZV9tb2R1bGVzL3dhdGNoaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvY29tcG9uZW50LWVtaXR0ZXIvaW5kZXguanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvZXM2LWNvbGxlY3Rpb25zL3NyYy9lczYtY29sbGVjdGlvbnMuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcmVkdWNlLWNvbXBvbmVudC9pbmRleC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9zdXBlcmFnZW50L2xpYi9jbGllbnQuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvdXVpZC9idWZmZXItYnJvd3Nlci5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy91dWlkL3JuZy1icm93c2VyLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3V1aWQvdXVpZC5qcyIsImFtYmFzc2Fkb3IuanMiLCJkb20td2hpc3BlcmVyLmpzIiwia2V5Ym9hcmQtaW5wdXQuanMiLCJrZXlib2FyZC1zaG9ydGN1dHMuanMiLCJtYWluLmpzIiwibW9kZWwuanMiLCJtb3VzZS10cmFwcGVyLmpzIiwibm9kZS1ldmVudHMuanMiLCJwYXRoLWZpbmRlci5qcyIsInN2Zy1tYWtlci5qcyIsInV0aWwuanMiLCJ4eS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDcEtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQzFRQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6aENBO0FBQ0E7OztBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUMvQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNU9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJcbi8qKlxuICogRXhwb3NlIGBFbWl0dGVyYC5cbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IEVtaXR0ZXI7XG5cbi8qKlxuICogSW5pdGlhbGl6ZSBhIG5ldyBgRW1pdHRlcmAuXG4gKlxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5mdW5jdGlvbiBFbWl0dGVyKG9iaikge1xuICBpZiAob2JqKSByZXR1cm4gbWl4aW4ob2JqKTtcbn07XG5cbi8qKlxuICogTWl4aW4gdGhlIGVtaXR0ZXIgcHJvcGVydGllcy5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqXG4gKiBAcmV0dXJuIHtPYmplY3R9XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBtaXhpbihvYmopIHtcbiAgZm9yICh2YXIga2V5IGluIEVtaXR0ZXIucHJvdG90eXBlKSB7XG4gICAgb2JqW2tleV0gPSBFbWl0dGVyLnByb3RvdHlwZVtrZXldO1xuICB9XG4gIHJldHVybiBvYmo7XG59XG5cbi8qKlxuICogTGlzdGVuIG9uIHRoZSBnaXZlbiBgZXZlbnRgIHdpdGggYGZuYC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gKiBAcmV0dXJuIHtFbWl0dGVyfVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5FbWl0dGVyLnByb3RvdHlwZS5vbiA9XG5FbWl0dGVyLnByb3RvdHlwZS5hZGRFdmVudExpc3RlbmVyID0gZnVuY3Rpb24oZXZlbnQsIGZuKXtcbiAgdGhpcy5fY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzIHx8IHt9O1xuICAodGhpcy5fY2FsbGJhY2tzW2V2ZW50XSA9IHRoaXMuX2NhbGxiYWNrc1tldmVudF0gfHwgW10pXG4gICAgLnB1c2goZm4pO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogQWRkcyBhbiBgZXZlbnRgIGxpc3RlbmVyIHRoYXQgd2lsbCBiZSBpbnZva2VkIGEgc2luZ2xlXG4gKiB0aW1lIHRoZW4gYXV0b21hdGljYWxseSByZW1vdmVkLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cbiAqIEByZXR1cm4ge0VtaXR0ZXJ9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbkVtaXR0ZXIucHJvdG90eXBlLm9uY2UgPSBmdW5jdGlvbihldmVudCwgZm4pe1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIHRoaXMuX2NhbGxiYWNrcyA9IHRoaXMuX2NhbGxiYWNrcyB8fCB7fTtcblxuICBmdW5jdGlvbiBvbigpIHtcbiAgICBzZWxmLm9mZihldmVudCwgb24pO1xuICAgIGZuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH1cblxuICBvbi5mbiA9IGZuO1xuICB0aGlzLm9uKGV2ZW50LCBvbik7XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBSZW1vdmUgdGhlIGdpdmVuIGNhbGxiYWNrIGZvciBgZXZlbnRgIG9yIGFsbFxuICogcmVnaXN0ZXJlZCBjYWxsYmFja3MuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50XG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxuICogQHJldHVybiB7RW1pdHRlcn1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuRW1pdHRlci5wcm90b3R5cGUub2ZmID1cbkVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUxpc3RlbmVyID1cbkVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUFsbExpc3RlbmVycyA9XG5FbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVFdmVudExpc3RlbmVyID0gZnVuY3Rpb24oZXZlbnQsIGZuKXtcbiAgdGhpcy5fY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzIHx8IHt9O1xuXG4gIC8vIGFsbFxuICBpZiAoMCA9PSBhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgdGhpcy5fY2FsbGJhY2tzID0ge307XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvLyBzcGVjaWZpYyBldmVudFxuICB2YXIgY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzW2V2ZW50XTtcbiAgaWYgKCFjYWxsYmFja3MpIHJldHVybiB0aGlzO1xuXG4gIC8vIHJlbW92ZSBhbGwgaGFuZGxlcnNcbiAgaWYgKDEgPT0gYXJndW1lbnRzLmxlbmd0aCkge1xuICAgIGRlbGV0ZSB0aGlzLl9jYWxsYmFja3NbZXZlbnRdO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLy8gcmVtb3ZlIHNwZWNpZmljIGhhbmRsZXJcbiAgdmFyIGNiO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGNhbGxiYWNrcy5sZW5ndGg7IGkrKykge1xuICAgIGNiID0gY2FsbGJhY2tzW2ldO1xuICAgIGlmIChjYiA9PT0gZm4gfHwgY2IuZm4gPT09IGZuKSB7XG4gICAgICBjYWxsYmFja3Muc3BsaWNlKGksIDEpO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBFbWl0IGBldmVudGAgd2l0aCB0aGUgZ2l2ZW4gYXJncy5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRcbiAqIEBwYXJhbSB7TWl4ZWR9IC4uLlxuICogQHJldHVybiB7RW1pdHRlcn1cbiAqL1xuXG5FbWl0dGVyLnByb3RvdHlwZS5lbWl0ID0gZnVuY3Rpb24oZXZlbnQpe1xuICB0aGlzLl9jYWxsYmFja3MgPSB0aGlzLl9jYWxsYmFja3MgfHwge307XG4gIHZhciBhcmdzID0gW10uc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpXG4gICAgLCBjYWxsYmFja3MgPSB0aGlzLl9jYWxsYmFja3NbZXZlbnRdO1xuXG4gIGlmIChjYWxsYmFja3MpIHtcbiAgICBjYWxsYmFja3MgPSBjYWxsYmFja3Muc2xpY2UoMCk7XG4gICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGNhbGxiYWNrcy5sZW5ndGg7IGkgPCBsZW47ICsraSkge1xuICAgICAgY2FsbGJhY2tzW2ldLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBSZXR1cm4gYXJyYXkgb2YgY2FsbGJhY2tzIGZvciBgZXZlbnRgLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFxuICogQHJldHVybiB7QXJyYXl9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbkVtaXR0ZXIucHJvdG90eXBlLmxpc3RlbmVycyA9IGZ1bmN0aW9uKGV2ZW50KXtcbiAgdGhpcy5fY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzIHx8IHt9O1xuICByZXR1cm4gdGhpcy5fY2FsbGJhY2tzW2V2ZW50XSB8fCBbXTtcbn07XG5cbi8qKlxuICogQ2hlY2sgaWYgdGhpcyBlbWl0dGVyIGhhcyBgZXZlbnRgIGhhbmRsZXJzLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuRW1pdHRlci5wcm90b3R5cGUuaGFzTGlzdGVuZXJzID0gZnVuY3Rpb24oZXZlbnQpe1xuICByZXR1cm4gISEgdGhpcy5saXN0ZW5lcnMoZXZlbnQpLmxlbmd0aDtcbn07XG4iLCIoZnVuY3Rpb24gKG1vZHVsZSkge1widXNlIHN0cmljdFwiO1xuXG4gIC8vIShDKSBXZWJSZWZsZWN0aW9uIC0gTWl0IFN0eWxlIExpY2Vuc2VcbiAgLy8gc2l6ZSBhbmQgcGVyZm9ybWFuY2VzIG9yaWVudGVkIHBvbHlmaWxsIGZvciBFUzZcbiAgLy8gV2Vha01hcCwgTWFwLCBhbmQgU2V0XG4gIC8vIGNvbXBhdGlibGUgd2l0aCBub2RlLmpzLCBSaGlubywgYW55IGJyb3dzZXJcbiAgLy8gZG9lcyBub3QgaW1wbGVtZW50IGRlZmF1bHQgdmF1bGUgZHVyaW5nIHdtLmdldCgpXG4gIC8vIHNpbmNlIEVTLm5leHQgd29uJ3QgcHJvYmFibHkgZG8gdGhhdFxuICAvLyB1c2Ugd20uaGFzKG8pID8gd20uZ2V0KG8pIDogZDNmYXVsdDsgaW5zdGVhZFxuXG4gIC8vIFdlYWtNYXAodm9pZCk6V2Vha01hcFxuICBmdW5jdGlvbiBXZWFrTWFwKCkge1xuXG4gICAgLy8gcHJpdmF0ZSByZWZlcmVuY2VzIGhvbGRlcnNcbiAgICB2YXJcbiAgICAgIGtleXMgPSBbXSxcbiAgICAgIHZhbHVlcyA9IFtdXG4gICAgO1xuXG4gICAgLy8gcmV0dXJucyBmcmVzaGx5IG5ldyBjcmVhdGVkXG4gICAgLy8gaW5zdGFuY2VvZiBXZWFrTWFwIGluIGFueSBjYXNlXG4gICAgcmV0dXJuIGNyZWF0ZShXZWFrTWFwUHJvdG90eXBlLCB7XG4gICAgICAvLyBXZWFrTWFwI2RlbGV0ZShrZXk6dm9pZCopOmJvb2xlYW5cbiAgICAgIFwiZGVsZXRlXCI6IHt2YWx1ZTogYmluZC5jYWxsKHNoYXJlZERlbCwgTlVMTCwgVFJVRSwga2V5cywgdmFsdWVzKX0sXG4gICAgICAvLzp3YXMgV2Vha01hcCNnZXQoa2V5OnZvaWQqWywgZDNmYXVsdDp2b2lkKl0pOnZvaWQqXG4gICAgICAvLyBXZWFrTWFwI2dldChrZXk6dm9pZCopOnZvaWQqXG4gICAgICBnZXQ6ICAgICAge3ZhbHVlOiBiaW5kLmNhbGwoc2hhcmVkR2V0LCBOVUxMLCBUUlVFLCBrZXlzLCB2YWx1ZXMpfSxcbiAgICAgIC8vIFdlYWtNYXAjaGFzKGtleTp2b2lkKik6Ym9vbGVhblxuICAgICAgaGFzOiAgICAgIHt2YWx1ZTogYmluZC5jYWxsKHNoYXJlZEhhcywgTlVMTCwgVFJVRSwga2V5cywgdmFsdWVzKX0sXG4gICAgICAvLyBXZWFrTWFwI3NldChrZXk6dm9pZCosIHZhbHVlOnZvaWQqKTp2b2lkXG4gICAgICBzZXQ6ICAgICAge3ZhbHVlOiBiaW5kLmNhbGwoc2hhcmVkU2V0LCBOVUxMLCBUUlVFLCBrZXlzLCB2YWx1ZXMpfVxuICAgIH0pO1xuXG4gIH1cblxuICAvLyBNYXAodm9pZCk6TWFwXG4gIGZ1bmN0aW9uIE1hcCgpIHtcblxuICAgIC8vIHByaXZhdGUgcmVmZXJlbmNlcyBob2xkZXJzXG4gICAgdmFyXG4gICAgICBrZXlzID0gW10sXG4gICAgICB2YWx1ZXMgPSBbXVxuICAgIDtcblxuICAgIC8vIHJldHVybnMgZnJlc2hseSBuZXcgY3JlYXRlZFxuICAgIC8vIGluc3RhbmNlb2YgV2Vha01hcCBpbiBhbnkgY2FzZVxuICAgIHJldHVybiBjcmVhdGUoTWFwUHJvdG90eXBlLCB7XG4gICAgICAvLyBNYXAjZGVsZXRlKGtleTp2b2lkKik6Ym9vbGVhblxuICAgICAgXCJkZWxldGVcIjoge3ZhbHVlOiBiaW5kLmNhbGwoc2hhcmVkRGVsLCBOVUxMLCBGQUxTRSwga2V5cywgdmFsdWVzKX0sXG4gICAgICAvLzp3YXMgTWFwI2dldChrZXk6dm9pZCpbLCBkM2ZhdWx0OnZvaWQqXSk6dm9pZCpcbiAgICAgIC8vIE1hcCNnZXQoa2V5OnZvaWQqKTp2b2lkKlxuICAgICAgZ2V0OiAgICAgIHt2YWx1ZTogYmluZC5jYWxsKHNoYXJlZEdldCwgTlVMTCwgRkFMU0UsIGtleXMsIHZhbHVlcyl9LFxuICAgICAgLy8gTWFwI2hhcyhrZXk6dm9pZCopOmJvb2xlYW5cbiAgICAgIGhhczogICAgICB7dmFsdWU6IGJpbmQuY2FsbChzaGFyZWRIYXMsIE5VTEwsIEZBTFNFLCBrZXlzLCB2YWx1ZXMpfSxcbiAgICAgIC8vIE1hcCNzZXQoa2V5OnZvaWQqLCB2YWx1ZTp2b2lkKik6dm9pZFxuICAgICAgc2V0OiAgICAgIHt2YWx1ZTogYmluZC5jYWxsKHNoYXJlZFNldCwgTlVMTCwgRkFMU0UsIGtleXMsIHZhbHVlcyl9XG4gICAgICAvKixcbiAgICAgIC8vIE1hcCNzaXplKHZvaWQpOm51bWJlciA9PT0gTW96aWxsYSBvbmx5IHNvIGZhclxuICAgICAgc2l6ZTogICAgIHt2YWx1ZTogYmluZC5jYWxsKHNoYXJlZFNpemUsIE5VTEwsIGtleXMpfSxcbiAgICAgIC8vIE1hcCNrZXlzKHZvaWQpOkFycmF5ID09PSBub3QgaW4gc3BlY3NcbiAgICAgIGtleXM6ICAgICB7dmFsdWU6IGJvdW5kU2xpY2Uoa2V5cyl9LFxuICAgICAgLy8gTWFwI3ZhbHVlcyh2b2lkKTpBcnJheSA9PT0gbm90IGluIHNwZWNzXG4gICAgICB2YWx1ZXM6ICAge3ZhbHVlOiBib3VuZFNsaWNlKHZhbHVlcyl9LFxuICAgICAgLy8gTWFwI2l0ZXJhdGUoY2FsbGJhY2s6RnVuY3Rpb24sIGNvbnRleHQ6dm9pZCopOnZvaWQgPT0+IGNhbGxiYWNrLmNhbGwoY29udGV4dCwga2V5LCB2YWx1ZSwgaW5kZXgpID09PSBub3QgaW4gc3BlY3NcbiAgICAgIGl0ZXJhdGU6ICB7dmFsdWU6IGJpbmQuY2FsbChzaGFyZWRJdGVyYXRlLCBOVUxMLCBGQUxTRSwga2V5cywgdmFsdWVzKX1cbiAgICAgIC8vKi9cbiAgICB9KTtcblxuICB9XG5cbiAgLy8gU2V0KHZvaWQpOlNldFxuICAvKipcbiAgICogdG8gYmUgcmVhbGx5IGhvbmVzdCwgSSB3b3VsZCByYXRoZXIgcG9sbHV0ZSBBcnJheS5wcm90b3R5cGVcbiAgICogaW4gb3JkZXIgdG8gaGF2ZSBTZXQgbGlrZSBiZWhhdmlvclxuICAgKiBPYmplY3QuZGVmaW5lUHJvcGVydGllcyhBcnJheS5wcm90b3R5cGUsIHtcbiAgICogICBhZGQ6IHt2YWx1ZTogZnVuY3Rpb24gYWRkKHZhbHVlKSB7XG4gICAqICAgICByZXR1cm4gLTEgPCB0aGlzLmluZGV4T2YodmFsdWUpICYmICEhdGhpcy5wdXNoKHZhbHVlKTtcbiAgICogICB9fVxuICAgKiAgIGhhczoge3ZhbHVlOiBmdW5jdGlvbiBoYXModmFsdWUpIHtcbiAgICogICAgIHJldHVybiAtMSA8IHRoaXMuaW5kZXhPZih2YWx1ZSk7XG4gICAqICAgfX1cbiAgICogICBkZWxldGU6IHt2YWx1ZTogZnVuY3Rpb24gZGVsZXRlKHZhbHVlKSB7XG4gICAqICAgICB2YXIgaSA9IHRoaXMuaW5kZXhPZih2YWx1ZSk7XG4gICAqICAgICByZXR1cm4gLTEgPCBpICYmICEhdGhpcy5zcGxpY2UoaSwgMSk7XG4gICAqICAgfX1cbiAgICogfSk7XG4gICAqIC4uLiBhbnl3YXkgLi4uXG4gICAqL1xuICBmdW5jdGlvbiBTZXQoKSB7XG4gICAgdmFyXG4gICAgICBrZXlzID0gW10sICAvLyBwbGFjZWhvbGRlciB1c2VkIHNpbXBseSB0byByZWN5Y2xlIGZ1bmN0aW9uc1xuICAgICAgdmFsdWVzID0gW10sLy8gcmVhbCBzdG9yYWdlXG4gICAgICBoYXMgPSBiaW5kLmNhbGwoc2hhcmVkSGFzLCBOVUxMLCBGQUxTRSwgdmFsdWVzLCBrZXlzKVxuICAgIDtcbiAgICByZXR1cm4gY3JlYXRlKFNldFByb3RvdHlwZSwge1xuICAgICAgLy8gU2V0I2RlbGV0ZSh2YWx1ZTp2b2lkKik6Ym9vbGVhblxuICAgICAgXCJkZWxldGVcIjoge3ZhbHVlOiBiaW5kLmNhbGwoc2hhcmVkRGVsLCBOVUxMLCBGQUxTRSwgdmFsdWVzLCBrZXlzKX0sXG4gICAgICAvLyBTZXQjaGFzKHZhbHVlOnZvaWQqKTpib29sZWFuXG4gICAgICBoYXM6ICAgICAge3ZhbHVlOiBoYXN9LFxuICAgICAgLy8gU2V0I2FkZCh2YWx1ZTp2b2lkKik6Ym9vbGVhblxuICAgICAgYWRkOiAgICAgIHt2YWx1ZTogYmluZC5jYWxsKFNldF9hZGQsIE5VTEwsIEZBTFNFLCBoYXMsIHZhbHVlcyl9XG4gICAgICAvKixcbiAgICAgIC8vIE1hcCNzaXplKHZvaWQpOm51bWJlciA9PT0gTW96aWxsYSBvbmx5XG4gICAgICBzaXplOiAgICAge3ZhbHVlOiBiaW5kLmNhbGwoc2hhcmVkU2l6ZSwgTlVMTCwgdmFsdWVzKX0sXG4gICAgICAvLyBTZXQjdmFsdWVzKHZvaWQpOkFycmF5ID09PSBub3QgaW4gc3BlY3NcbiAgICAgIHZhbHVlczogICB7dmFsdWU6IGJvdW5kU2xpY2UodmFsdWVzKX0sXG4gICAgICAvLyBTZXQjaXRlcmF0ZShjYWxsYmFjazpGdW5jdGlvbiwgY29udGV4dDp2b2lkKik6dm9pZCA9PT4gY2FsbGJhY2suY2FsbChjb250ZXh0LCB2YWx1ZSwgaW5kZXgpID09PSBub3QgaW4gc3BlY3NcbiAgICAgIGl0ZXJhdGU6ICB7dmFsdWU6IGJpbmQuY2FsbChTZXRfaXRlcmF0ZSwgTlVMTCwgRkFMU0UsIE5VTEwsIHZhbHVlcyl9XG4gICAgICAvLyovXG4gICAgfSk7XG4gIH1cblxuICAvLyBjb21tb24gc2hhcmVkIG1ldGhvZCByZWN5Y2xlZCBmb3IgYWxsIHNoaW1zIHRocm91Z2ggYmluZFxuICBmdW5jdGlvbiBzaGFyZWREZWwob2JqZWN0T25seSwga2V5cywgdmFsdWVzLCBrZXkpIHtcbiAgICBpZiAoc2hhcmVkSGFzKG9iamVjdE9ubHksIGtleXMsIHZhbHVlcywga2V5KSkge1xuICAgICAga2V5cy5zcGxpY2UoaSwgMSk7XG4gICAgICB2YWx1ZXMuc3BsaWNlKGksIDEpO1xuICAgIH1cbiAgICAvLyBBdXJvcmEgaGVyZSBkb2VzIGl0IHdoaWxlIENhbmFyeSBkb2Vzbid0XG4gICAgcmV0dXJuIC0xIDwgaTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNoYXJlZEdldChvYmplY3RPbmx5LCBrZXlzLCB2YWx1ZXMsIGtleS8qLCBkM2ZhdWx0Ki8pIHtcbiAgICByZXR1cm4gc2hhcmVkSGFzKG9iamVjdE9ubHksIGtleXMsIHZhbHVlcywga2V5KSA/IHZhbHVlc1tpXSA6IHVuZGVmaW5lZDsgLy9kM2ZhdWx0O1xuICB9XG5cbiAgZnVuY3Rpb24gc2hhcmVkSGFzKG9iamVjdE9ubHksIGtleXMsIHZhbHVlcywga2V5KSB7XG4gICAgaWYgKG9iamVjdE9ubHkgJiYga2V5ICE9PSBPYmplY3Qoa2V5KSlcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJub3QgYSBub24tbnVsbCBvYmplY3RcIilcbiAgICA7XG4gICAgaSA9IGJldHRlckluZGV4T2YuY2FsbChrZXlzLCBrZXkpO1xuICAgIHJldHVybiAtMSA8IGk7XG4gIH1cblxuICBmdW5jdGlvbiBzaGFyZWRTZXQob2JqZWN0T25seSwga2V5cywgdmFsdWVzLCBrZXksIHZhbHVlKSB7XG4gICAgLyogcmV0dXJuICovc2hhcmVkSGFzKG9iamVjdE9ubHksIGtleXMsIHZhbHVlcywga2V5KSA/XG4gICAgICB2YWx1ZXNbaV0gPSB2YWx1ZVxuICAgICAgOlxuICAgICAgdmFsdWVzW2tleXMucHVzaChrZXkpIC0gMV0gPSB2YWx1ZVxuICAgIDtcbiAgfVxuXG4gIC8qIGtleXMsIHZhbHVlcywgYW5kIGl0ZXJhdGUgcmVsYXRlZCBtZXRob2RzXG4gIGZ1bmN0aW9uIGJvdW5kU2xpY2UodmFsdWVzKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiBzbGljZS5jYWxsKHZhbHVlcyk7XG4gICAgfTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNoYXJlZFNpemUoa2V5cykge1xuICAgIHJldHVybiBrZXlzLmxlbmd0aDtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNoYXJlZEl0ZXJhdGUob2JqZWN0T25seSwga2V5cywgdmFsdWVzLCBjYWxsYmFjaywgY29udGV4dCkge1xuICAgIGZvciAodmFyXG4gICAgICBrID0gc2xpY2UuY2FsbChrZXlzKSwgdiA9IHNsaWNlLmNhbGwodmFsdWVzKSxcbiAgICAgIGkgPSAwLCBsZW5ndGggPSBrLmxlbmd0aDtcbiAgICAgIGkgPCBsZW5ndGg7IGNhbGxiYWNrLmNhbGwoY29udGV4dCwga1tpXSwgdltpXSwgaSsrKVxuICAgICk7XG4gIH1cblxuICBmdW5jdGlvbiBTZXRfaXRlcmF0ZShvYmplY3RPbmx5LCBrZXlzLCB2YWx1ZXMsIGNhbGxiYWNrLCBjb250ZXh0KSB7XG4gICAgZm9yICh2YXJcbiAgICAgIHYgPSBzbGljZS5jYWxsKHZhbHVlcyksXG4gICAgICBpID0gMCwgbGVuZ3RoID0gdi5sZW5ndGg7XG4gICAgICBpIDwgbGVuZ3RoOyBjYWxsYmFjay5jYWxsKGNvbnRleHQsIHZbaV0sIGkrKylcbiAgICApO1xuICB9XG4gIC8vKi9cblxuICAvLyBTZXQjYWRkIHJlY3ljbGVkIHRocm91Z2ggYmluZCBwZXIgZWFjaCBpbnN0YW5jZW9mIFNldFxuICBmdW5jdGlvbiBTZXRfYWRkKG9iamVjdE9ubHksIGhhcywgdmFsdWVzLCB2YWx1ZSkge1xuICAgIC8qcmV0dXJuICovKCFoYXModmFsdWUpICYmICEhdmFsdWVzLnB1c2godmFsdWUpKTtcbiAgfVxuXG4gIC8vIGEgbW9yZSByZWxpYWJsZSBpbmRleE9mXG4gIGZ1bmN0aW9uIGJldHRlckluZGV4T2YodmFsdWUpIHtcbiAgICBpZiAodmFsdWUgIT0gdmFsdWUgfHwgdmFsdWUgPT09IDApIHtcbiAgICAgIGZvciAoaSA9IHRoaXMubGVuZ3RoOyBpLS0gJiYgIWlzKHRoaXNbaV0sIHZhbHVlKTspO1xuICAgIH0gZWxzZSB7XG4gICAgICBpID0gaW5kZXhPZi5jYWxsKHRoaXMsIHZhbHVlKTtcbiAgICB9XG4gICAgcmV0dXJuIGk7XG4gIH1cblxuICAvLyBuZWVkIGZvciBhbiBlbXB0eSBjb25zdHJ1Y3RvciAuLi5cbiAgZnVuY3Rpb24gQ29uc3RydWN0b3IoKXt9ICAvLyBHQydlZCBpZiAhIU9iamVjdC5jcmVhdGVcbiAgLy8gLi4uIHNvIHRoYXQgbmV3IFdlYWtNYXBJbnN0YW5jZSBhbmQgbmV3IFdlYWtNYXBcbiAgLy8gcHJvZHVjZXMgYm90aCBhbiBpbnN0YW5jZW9mIFdlYWtNYXBcblxuICB2YXJcbiAgICAvLyBzaG9ydGN1dHMgYW5kIC4uLlxuICAgIE5VTEwgPSBudWxsLCBUUlVFID0gdHJ1ZSwgRkFMU0UgPSBmYWxzZSxcbiAgICBub3RJbk5vZGUgPSBtb2R1bGUgPT0gXCJ1bmRlZmluZWRcIixcbiAgICB3aW5kb3cgPSBub3RJbk5vZGUgPyB0aGlzIDogZ2xvYmFsLFxuICAgIG1vZHVsZSA9IG5vdEluTm9kZSA/IHt9IDogZXhwb3J0cyxcbiAgICBPYmplY3QgPSB3aW5kb3cuT2JqZWN0LFxuICAgIFdlYWtNYXBQcm90b3R5cGUgPSBXZWFrTWFwLnByb3RvdHlwZSxcbiAgICBNYXBQcm90b3R5cGUgPSBNYXAucHJvdG90eXBlLFxuICAgIFNldFByb3RvdHlwZSA9IFNldC5wcm90b3R5cGUsXG4gICAgZGVmaW5lUHJvcGVydHkgPSBPYmplY3QuZGVmaW5lUHJvcGVydHksXG4gICAgc2xpY2UgPSBbXS5zbGljZSxcblxuICAgIC8vIE9iamVjdC5pcyhhLCBiKSBzaGltXG4gICAgaXMgPSBPYmplY3QuaXMgfHwgZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgIHJldHVybiBhID09PSBiID9cbiAgICAgICAgYSAhPT0gMCB8fCAxIC8gYSA9PSAxIC8gYiA6XG4gICAgICAgIGEgIT0gYSAmJiBiICE9IGJcbiAgICAgIDtcbiAgICB9LFxuXG4gICAgLy8gcGFydGlhbCBwb2x5ZmlsbCBmb3IgdGhpcyBhaW0gb25seVxuICAgIGJpbmQgPSBXZWFrTWFwLmJpbmQgfHwgZnVuY3Rpb24gYmluZChjb250ZXh0LCBvYmplY3RPbmx5LCBrZXlzLCB2YWx1ZXMpIHtcbiAgICAgIC8vIHBhcnRpYWwgZmFzdCBhZC1ob2MgRnVuY3Rpb24jYmluZCBwb2x5ZmlsbCBpZiBub3QgYXZhaWxhYmxlXG4gICAgICB2YXIgY2FsbGJhY2sgPSB0aGlzO1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uIGJvdW5kKGtleSwgdmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIGNhbGxiYWNrLmNhbGwoY29udGV4dCwgb2JqZWN0T25seSwga2V5cywgdmFsdWVzLCBrZXksIHZhbHVlKTtcbiAgICAgIH07XG4gICAgfSxcblxuICAgIGNyZWF0ZSA9IE9iamVjdC5jcmVhdGUgfHwgZnVuY3Rpb24gY3JlYXRlKHByb3RvLCBkZXNjcmlwdG9yKSB7XG4gICAgICAvLyBwYXJ0aWFsIGFkLWhvYyBPYmplY3QuY3JlYXRlIHNoaW0gaWYgbm90IGF2YWlsYWJsZVxuICAgICAgQ29uc3RydWN0b3IucHJvdG90eXBlID0gcHJvdG87XG4gICAgICB2YXIgb2JqZWN0ID0gbmV3IENvbnN0cnVjdG9yLCBrZXk7XG4gICAgICBmb3IgKGtleSBpbiBkZXNjcmlwdG9yKSB7XG4gICAgICAgIG9iamVjdFtrZXldID0gZGVzY3JpcHRvcltrZXldLnZhbHVlO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG9iamVjdDtcbiAgICB9LFxuXG4gICAgaW5kZXhPZiA9IFtdLmluZGV4T2YgfHwgZnVuY3Rpb24gaW5kZXhPZih2YWx1ZSkge1xuICAgICAgLy8gcGFydGlhbCBmYXN0IEFycmF5I2luZGV4T2YgcG9seWZpbGwgaWYgbm90IGF2YWlsYWJsZVxuICAgICAgZm9yIChpID0gdGhpcy5sZW5ndGg7IGktLSAmJiB0aGlzW2ldICE9PSB2YWx1ZTspO1xuICAgICAgcmV0dXJuIGk7XG4gICAgfSxcblxuICAgIHVuZGVmaW5lZCxcbiAgICBpIC8vIHJlY3ljbGUgQUxMIHRoZSB2YXJpYWJsZXMgIVxuICA7XG5cbiAgLy8gfmluZGV4T2YuY2FsbChbTmFOXSwgTmFOKSBhcyBmdXR1cmUgcG9zc2libGUgZmVhdHVyZSBkZXRlY3Rpb25cblxuICAvLyB1c2VkIHRvIGZvbGxvdyBGRiBiZWhhdmlvciB3aGVyZSBXZWFrTWFwLnByb3RvdHlwZSBpcyBhIFdlYWtNYXAgaXRzZWxmXG4gIFdlYWtNYXAucHJvdG90eXBlID0gV2Vha01hcFByb3RvdHlwZSA9IFdlYWtNYXAoKTtcbiAgTWFwLnByb3RvdHlwZSA9IE1hcFByb3RvdHlwZSA9IE1hcCgpO1xuICBTZXQucHJvdG90eXBlID0gU2V0UHJvdG90eXBlID0gU2V0KCk7XG5cbiAgLy8gYXNzaWduIGl0IHRvIHRoZSBnbG9iYWwgY29udGV4dFxuICAvLyBpZiBhbHJlYWR5IHRoZXJlLCBlLmcuIGluIG5vZGUsIGV4cG9ydCBuYXRpdmVcbiAgd2luZG93LldlYWtNYXAgPSBtb2R1bGUuV2Vha01hcCA9IHdpbmRvdy5XZWFrTWFwIHx8IFdlYWtNYXA7XG4gIHdpbmRvdy5NYXAgPSBtb2R1bGUuTWFwID0gd2luZG93Lk1hcCB8fCBNYXA7XG4gIHdpbmRvdy5TZXQgPSBtb2R1bGUuU2V0ID0gd2luZG93LlNldCB8fCBTZXQ7XG5cbiAgLyogcHJvYmFibHkgbm90IG5lZWRlZCwgYWRkIGEgc2xhc2ggdG8gZW5zdXJlIG5vbiBjb25maWd1cmFibGUgYW5kIG5vbiB3cml0YWJsZVxuICBpZiAoZGVmaW5lUHJvcGVydHkpIHtcbiAgICBkZWZpbmVQcm9wZXJ0eSh3aW5kb3csIFwiV2Vha01hcFwiLCB7dmFsdWU6IFdlYWtNYXB9KTtcbiAgICBkZWZpbmVQcm9wZXJ0eSh3aW5kb3csIFwiTWFwXCIsIHt2YWx1ZTogTWFwfSk7XG4gICAgZGVmaW5lUHJvcGVydHkod2luZG93LCBcIlNldFwiLCB7dmFsdWU6IFNldH0pO1xuICB9XG4gIC8vKi9cblxuICAvLyB0aGF0J3MgcHJldHR5IG11Y2ggaXRcblxufS5jYWxsKFxuICB0aGlzLFxuICB0eXBlb2YgZXhwb3J0c1xuKSk7IiwiXG4vKipcbiAqIFJlZHVjZSBgYXJyYCB3aXRoIGBmbmAuXG4gKlxuICogQHBhcmFtIHtBcnJheX0gYXJyXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxuICogQHBhcmFtIHtNaXhlZH0gaW5pdGlhbFxuICpcbiAqIFRPRE86IGNvbWJhdGlibGUgZXJyb3IgaGFuZGxpbmc/XG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihhcnIsIGZuLCBpbml0aWFsKXsgIFxuICB2YXIgaWR4ID0gMDtcbiAgdmFyIGxlbiA9IGFyci5sZW5ndGg7XG4gIHZhciBjdXJyID0gYXJndW1lbnRzLmxlbmd0aCA9PSAzXG4gICAgPyBpbml0aWFsXG4gICAgOiBhcnJbaWR4KytdO1xuXG4gIHdoaWxlIChpZHggPCBsZW4pIHtcbiAgICBjdXJyID0gZm4uY2FsbChudWxsLCBjdXJyLCBhcnJbaWR4XSwgKytpZHgsIGFycik7XG4gIH1cbiAgXG4gIHJldHVybiBjdXJyO1xufTsiLCIvKipcbiAqIE1vZHVsZSBkZXBlbmRlbmNpZXMuXG4gKi9cblxudmFyIEVtaXR0ZXIgPSByZXF1aXJlKCdlbWl0dGVyJyk7XG52YXIgcmVkdWNlID0gcmVxdWlyZSgncmVkdWNlJyk7XG5cbi8qKlxuICogUm9vdCByZWZlcmVuY2UgZm9yIGlmcmFtZXMuXG4gKi9cblxudmFyIHJvb3QgPSAndW5kZWZpbmVkJyA9PSB0eXBlb2Ygd2luZG93XG4gID8gdGhpc1xuICA6IHdpbmRvdztcblxuLyoqXG4gKiBOb29wLlxuICovXG5cbmZ1bmN0aW9uIG5vb3AoKXt9O1xuXG4vKipcbiAqIENoZWNrIGlmIGBvYmpgIGlzIGEgaG9zdCBvYmplY3QsXG4gKiB3ZSBkb24ndCB3YW50IHRvIHNlcmlhbGl6ZSB0aGVzZSA6KVxuICpcbiAqIFRPRE86IGZ1dHVyZSBwcm9vZiwgbW92ZSB0byBjb21wb2VudCBsYW5kXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9ialxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIGlzSG9zdChvYmopIHtcbiAgdmFyIHN0ciA9IHt9LnRvU3RyaW5nLmNhbGwob2JqKTtcblxuICBzd2l0Y2ggKHN0cikge1xuICAgIGNhc2UgJ1tvYmplY3QgRmlsZV0nOlxuICAgIGNhc2UgJ1tvYmplY3QgQmxvYl0nOlxuICAgIGNhc2UgJ1tvYmplY3QgRm9ybURhdGFdJzpcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgWEhSLlxuICovXG5cbmZ1bmN0aW9uIGdldFhIUigpIHtcbiAgaWYgKHJvb3QuWE1MSHR0cFJlcXVlc3RcbiAgICAmJiAoJ2ZpbGU6JyAhPSByb290LmxvY2F0aW9uLnByb3RvY29sIHx8ICFyb290LkFjdGl2ZVhPYmplY3QpKSB7XG4gICAgcmV0dXJuIG5ldyBYTUxIdHRwUmVxdWVzdDtcbiAgfSBlbHNlIHtcbiAgICB0cnkgeyByZXR1cm4gbmV3IEFjdGl2ZVhPYmplY3QoJ01pY3Jvc29mdC5YTUxIVFRQJyk7IH0gY2F0Y2goZSkge31cbiAgICB0cnkgeyByZXR1cm4gbmV3IEFjdGl2ZVhPYmplY3QoJ01zeG1sMi5YTUxIVFRQLjYuMCcpOyB9IGNhdGNoKGUpIHt9XG4gICAgdHJ5IHsgcmV0dXJuIG5ldyBBY3RpdmVYT2JqZWN0KCdNc3htbDIuWE1MSFRUUC4zLjAnKTsgfSBjYXRjaChlKSB7fVxuICAgIHRyeSB7IHJldHVybiBuZXcgQWN0aXZlWE9iamVjdCgnTXN4bWwyLlhNTEhUVFAnKTsgfSBjYXRjaChlKSB7fVxuICB9XG4gIHJldHVybiBmYWxzZTtcbn1cblxuLyoqXG4gKiBSZW1vdmVzIGxlYWRpbmcgYW5kIHRyYWlsaW5nIHdoaXRlc3BhY2UsIGFkZGVkIHRvIHN1cHBvcnQgSUUuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHNcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbnZhciB0cmltID0gJycudHJpbVxuICA/IGZ1bmN0aW9uKHMpIHsgcmV0dXJuIHMudHJpbSgpOyB9XG4gIDogZnVuY3Rpb24ocykgeyByZXR1cm4gcy5yZXBsYWNlKC8oXlxccyp8XFxzKiQpL2csICcnKTsgfTtcblxuLyoqXG4gKiBDaGVjayBpZiBgb2JqYCBpcyBhbiBvYmplY3QuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9ialxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIGlzT2JqZWN0KG9iaikge1xuICByZXR1cm4gb2JqID09PSBPYmplY3Qob2JqKTtcbn1cblxuLyoqXG4gKiBTZXJpYWxpemUgdGhlIGdpdmVuIGBvYmpgLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmpcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIHNlcmlhbGl6ZShvYmopIHtcbiAgaWYgKCFpc09iamVjdChvYmopKSByZXR1cm4gb2JqO1xuICB2YXIgcGFpcnMgPSBbXTtcbiAgZm9yICh2YXIga2V5IGluIG9iaikge1xuICAgIGlmIChudWxsICE9IG9ialtrZXldKSB7XG4gICAgICBwYWlycy5wdXNoKGVuY29kZVVSSUNvbXBvbmVudChrZXkpXG4gICAgICAgICsgJz0nICsgZW5jb2RlVVJJQ29tcG9uZW50KG9ialtrZXldKSk7XG4gICAgfVxuICB9XG4gIHJldHVybiBwYWlycy5qb2luKCcmJyk7XG59XG5cbi8qKlxuICogRXhwb3NlIHNlcmlhbGl6YXRpb24gbWV0aG9kLlxuICovXG5cbiByZXF1ZXN0LnNlcmlhbGl6ZU9iamVjdCA9IHNlcmlhbGl6ZTtcblxuIC8qKlxuICAqIFBhcnNlIHRoZSBnaXZlbiB4LXd3dy1mb3JtLXVybGVuY29kZWQgYHN0cmAuXG4gICpcbiAgKiBAcGFyYW0ge1N0cmluZ30gc3RyXG4gICogQHJldHVybiB7T2JqZWN0fVxuICAqIEBhcGkgcHJpdmF0ZVxuICAqL1xuXG5mdW5jdGlvbiBwYXJzZVN0cmluZyhzdHIpIHtcbiAgdmFyIG9iaiA9IHt9O1xuICB2YXIgcGFpcnMgPSBzdHIuc3BsaXQoJyYnKTtcbiAgdmFyIHBhcnRzO1xuICB2YXIgcGFpcjtcblxuICBmb3IgKHZhciBpID0gMCwgbGVuID0gcGFpcnMubGVuZ3RoOyBpIDwgbGVuOyArK2kpIHtcbiAgICBwYWlyID0gcGFpcnNbaV07XG4gICAgcGFydHMgPSBwYWlyLnNwbGl0KCc9Jyk7XG4gICAgb2JqW2RlY29kZVVSSUNvbXBvbmVudChwYXJ0c1swXSldID0gZGVjb2RlVVJJQ29tcG9uZW50KHBhcnRzWzFdKTtcbiAgfVxuXG4gIHJldHVybiBvYmo7XG59XG5cbi8qKlxuICogRXhwb3NlIHBhcnNlci5cbiAqL1xuXG5yZXF1ZXN0LnBhcnNlU3RyaW5nID0gcGFyc2VTdHJpbmc7XG5cbi8qKlxuICogRGVmYXVsdCBNSU1FIHR5cGUgbWFwLlxuICpcbiAqICAgICBzdXBlcmFnZW50LnR5cGVzLnhtbCA9ICdhcHBsaWNhdGlvbi94bWwnO1xuICpcbiAqL1xuXG5yZXF1ZXN0LnR5cGVzID0ge1xuICBodG1sOiAndGV4dC9odG1sJyxcbiAganNvbjogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICB4bWw6ICdhcHBsaWNhdGlvbi94bWwnLFxuICB1cmxlbmNvZGVkOiAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJyxcbiAgJ2Zvcm0nOiAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJyxcbiAgJ2Zvcm0tZGF0YSc6ICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnXG59O1xuXG4vKipcbiAqIERlZmF1bHQgc2VyaWFsaXphdGlvbiBtYXAuXG4gKlxuICogICAgIHN1cGVyYWdlbnQuc2VyaWFsaXplWydhcHBsaWNhdGlvbi94bWwnXSA9IGZ1bmN0aW9uKG9iail7XG4gKiAgICAgICByZXR1cm4gJ2dlbmVyYXRlZCB4bWwgaGVyZSc7XG4gKiAgICAgfTtcbiAqXG4gKi9cblxuIHJlcXVlc3Quc2VyaWFsaXplID0ge1xuICAgJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCc6IHNlcmlhbGl6ZSxcbiAgICdhcHBsaWNhdGlvbi9qc29uJzogSlNPTi5zdHJpbmdpZnlcbiB9O1xuXG4gLyoqXG4gICogRGVmYXVsdCBwYXJzZXJzLlxuICAqXG4gICogICAgIHN1cGVyYWdlbnQucGFyc2VbJ2FwcGxpY2F0aW9uL3htbCddID0gZnVuY3Rpb24oc3RyKXtcbiAgKiAgICAgICByZXR1cm4geyBvYmplY3QgcGFyc2VkIGZyb20gc3RyIH07XG4gICogICAgIH07XG4gICpcbiAgKi9cblxucmVxdWVzdC5wYXJzZSA9IHtcbiAgJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCc6IHBhcnNlU3RyaW5nLFxuICAnYXBwbGljYXRpb24vanNvbic6IEpTT04ucGFyc2Vcbn07XG5cbi8qKlxuICogUGFyc2UgdGhlIGdpdmVuIGhlYWRlciBgc3RyYCBpbnRvXG4gKiBhbiBvYmplY3QgY29udGFpbmluZyB0aGUgbWFwcGVkIGZpZWxkcy5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyXG4gKiBAcmV0dXJuIHtPYmplY3R9XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBwYXJzZUhlYWRlcihzdHIpIHtcbiAgdmFyIGxpbmVzID0gc3RyLnNwbGl0KC9cXHI/XFxuLyk7XG4gIHZhciBmaWVsZHMgPSB7fTtcbiAgdmFyIGluZGV4O1xuICB2YXIgbGluZTtcbiAgdmFyIGZpZWxkO1xuICB2YXIgdmFsO1xuXG4gIGxpbmVzLnBvcCgpOyAvLyB0cmFpbGluZyBDUkxGXG5cbiAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGxpbmVzLmxlbmd0aDsgaSA8IGxlbjsgKytpKSB7XG4gICAgbGluZSA9IGxpbmVzW2ldO1xuICAgIGluZGV4ID0gbGluZS5pbmRleE9mKCc6Jyk7XG4gICAgZmllbGQgPSBsaW5lLnNsaWNlKDAsIGluZGV4KS50b0xvd2VyQ2FzZSgpO1xuICAgIHZhbCA9IHRyaW0obGluZS5zbGljZShpbmRleCArIDEpKTtcbiAgICBmaWVsZHNbZmllbGRdID0gdmFsO1xuICB9XG5cbiAgcmV0dXJuIGZpZWxkcztcbn1cblxuLyoqXG4gKiBSZXR1cm4gdGhlIG1pbWUgdHlwZSBmb3IgdGhlIGdpdmVuIGBzdHJgLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHJcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIHR5cGUoc3RyKXtcbiAgcmV0dXJuIHN0ci5zcGxpdCgvICo7ICovKS5zaGlmdCgpO1xufTtcblxuLyoqXG4gKiBSZXR1cm4gaGVhZGVyIGZpZWxkIHBhcmFtZXRlcnMuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHN0clxuICogQHJldHVybiB7T2JqZWN0fVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gcGFyYW1zKHN0cil7XG4gIHJldHVybiByZWR1Y2Uoc3RyLnNwbGl0KC8gKjsgKi8pLCBmdW5jdGlvbihvYmosIHN0cil7XG4gICAgdmFyIHBhcnRzID0gc3RyLnNwbGl0KC8gKj0gKi8pXG4gICAgICAsIGtleSA9IHBhcnRzLnNoaWZ0KClcbiAgICAgICwgdmFsID0gcGFydHMuc2hpZnQoKTtcblxuICAgIGlmIChrZXkgJiYgdmFsKSBvYmpba2V5XSA9IHZhbDtcbiAgICByZXR1cm4gb2JqO1xuICB9LCB7fSk7XG59O1xuXG4vKipcbiAqIEluaXRpYWxpemUgYSBuZXcgYFJlc3BvbnNlYCB3aXRoIHRoZSBnaXZlbiBgeGhyYC5cbiAqXG4gKiAgLSBzZXQgZmxhZ3MgKC5vaywgLmVycm9yLCBldGMpXG4gKiAgLSBwYXJzZSBoZWFkZXJcbiAqXG4gKiBFeGFtcGxlczpcbiAqXG4gKiAgQWxpYXNpbmcgYHN1cGVyYWdlbnRgIGFzIGByZXF1ZXN0YCBpcyBuaWNlOlxuICpcbiAqICAgICAgcmVxdWVzdCA9IHN1cGVyYWdlbnQ7XG4gKlxuICogIFdlIGNhbiB1c2UgdGhlIHByb21pc2UtbGlrZSBBUEksIG9yIHBhc3MgY2FsbGJhY2tzOlxuICpcbiAqICAgICAgcmVxdWVzdC5nZXQoJy8nKS5lbmQoZnVuY3Rpb24ocmVzKXt9KTtcbiAqICAgICAgcmVxdWVzdC5nZXQoJy8nLCBmdW5jdGlvbihyZXMpe30pO1xuICpcbiAqICBTZW5kaW5nIGRhdGEgY2FuIGJlIGNoYWluZWQ6XG4gKlxuICogICAgICByZXF1ZXN0XG4gKiAgICAgICAgLnBvc3QoJy91c2VyJylcbiAqICAgICAgICAuc2VuZCh7IG5hbWU6ICd0aicgfSlcbiAqICAgICAgICAuZW5kKGZ1bmN0aW9uKHJlcyl7fSk7XG4gKlxuICogIE9yIHBhc3NlZCB0byBgLnNlbmQoKWA6XG4gKlxuICogICAgICByZXF1ZXN0XG4gKiAgICAgICAgLnBvc3QoJy91c2VyJylcbiAqICAgICAgICAuc2VuZCh7IG5hbWU6ICd0aicgfSwgZnVuY3Rpb24ocmVzKXt9KTtcbiAqXG4gKiAgT3IgcGFzc2VkIHRvIGAucG9zdCgpYDpcbiAqXG4gKiAgICAgIHJlcXVlc3RcbiAqICAgICAgICAucG9zdCgnL3VzZXInLCB7IG5hbWU6ICd0aicgfSlcbiAqICAgICAgICAuZW5kKGZ1bmN0aW9uKHJlcyl7fSk7XG4gKlxuICogT3IgZnVydGhlciByZWR1Y2VkIHRvIGEgc2luZ2xlIGNhbGwgZm9yIHNpbXBsZSBjYXNlczpcbiAqXG4gKiAgICAgIHJlcXVlc3RcbiAqICAgICAgICAucG9zdCgnL3VzZXInLCB7IG5hbWU6ICd0aicgfSwgZnVuY3Rpb24ocmVzKXt9KTtcbiAqXG4gKiBAcGFyYW0ge1hNTEhUVFBSZXF1ZXN0fSB4aHJcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBSZXNwb25zZShyZXEsIG9wdGlvbnMpIHtcbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gIHRoaXMucmVxID0gcmVxO1xuICB0aGlzLnhociA9IHRoaXMucmVxLnhocjtcbiAgdGhpcy50ZXh0ID0gdGhpcy54aHIucmVzcG9uc2VUZXh0O1xuICB0aGlzLnNldFN0YXR1c1Byb3BlcnRpZXModGhpcy54aHIuc3RhdHVzKTtcbiAgdGhpcy5oZWFkZXIgPSB0aGlzLmhlYWRlcnMgPSBwYXJzZUhlYWRlcih0aGlzLnhoci5nZXRBbGxSZXNwb25zZUhlYWRlcnMoKSk7XG4gIC8vIGdldEFsbFJlc3BvbnNlSGVhZGVycyBzb21ldGltZXMgZmFsc2VseSByZXR1cm5zIFwiXCIgZm9yIENPUlMgcmVxdWVzdHMsIGJ1dFxuICAvLyBnZXRSZXNwb25zZUhlYWRlciBzdGlsbCB3b3Jrcy4gc28gd2UgZ2V0IGNvbnRlbnQtdHlwZSBldmVuIGlmIGdldHRpbmdcbiAgLy8gb3RoZXIgaGVhZGVycyBmYWlscy5cbiAgdGhpcy5oZWFkZXJbJ2NvbnRlbnQtdHlwZSddID0gdGhpcy54aHIuZ2V0UmVzcG9uc2VIZWFkZXIoJ2NvbnRlbnQtdHlwZScpO1xuICB0aGlzLnNldEhlYWRlclByb3BlcnRpZXModGhpcy5oZWFkZXIpO1xuICB0aGlzLmJvZHkgPSB0aGlzLnJlcS5tZXRob2QgIT0gJ0hFQUQnXG4gICAgPyB0aGlzLnBhcnNlQm9keSh0aGlzLnRleHQpXG4gICAgOiBudWxsO1xufVxuXG4vKipcbiAqIEdldCBjYXNlLWluc2Vuc2l0aXZlIGBmaWVsZGAgdmFsdWUuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGZpZWxkXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cblJlc3BvbnNlLnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbihmaWVsZCl7XG4gIHJldHVybiB0aGlzLmhlYWRlcltmaWVsZC50b0xvd2VyQ2FzZSgpXTtcbn07XG5cbi8qKlxuICogU2V0IGhlYWRlciByZWxhdGVkIHByb3BlcnRpZXM6XG4gKlxuICogICAtIGAudHlwZWAgdGhlIGNvbnRlbnQgdHlwZSB3aXRob3V0IHBhcmFtc1xuICpcbiAqIEEgcmVzcG9uc2Ugb2YgXCJDb250ZW50LVR5cGU6IHRleHQvcGxhaW47IGNoYXJzZXQ9dXRmLThcIlxuICogd2lsbCBwcm92aWRlIHlvdSB3aXRoIGEgYC50eXBlYCBvZiBcInRleHQvcGxhaW5cIi5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gaGVhZGVyXG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5SZXNwb25zZS5wcm90b3R5cGUuc2V0SGVhZGVyUHJvcGVydGllcyA9IGZ1bmN0aW9uKGhlYWRlcil7XG4gIC8vIGNvbnRlbnQtdHlwZVxuICB2YXIgY3QgPSB0aGlzLmhlYWRlclsnY29udGVudC10eXBlJ10gfHwgJyc7XG4gIHRoaXMudHlwZSA9IHR5cGUoY3QpO1xuXG4gIC8vIHBhcmFtc1xuICB2YXIgb2JqID0gcGFyYW1zKGN0KTtcbiAgZm9yICh2YXIga2V5IGluIG9iaikgdGhpc1trZXldID0gb2JqW2tleV07XG59O1xuXG4vKipcbiAqIFBhcnNlIHRoZSBnaXZlbiBib2R5IGBzdHJgLlxuICpcbiAqIFVzZWQgZm9yIGF1dG8tcGFyc2luZyBvZiBib2RpZXMuIFBhcnNlcnNcbiAqIGFyZSBkZWZpbmVkIG9uIHRoZSBgc3VwZXJhZ2VudC5wYXJzZWAgb2JqZWN0LlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHJcbiAqIEByZXR1cm4ge01peGVkfVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuUmVzcG9uc2UucHJvdG90eXBlLnBhcnNlQm9keSA9IGZ1bmN0aW9uKHN0cil7XG4gIHZhciBwYXJzZSA9IHJlcXVlc3QucGFyc2VbdGhpcy50eXBlXTtcbiAgcmV0dXJuIHBhcnNlXG4gICAgPyBwYXJzZShzdHIpXG4gICAgOiBudWxsO1xufTtcblxuLyoqXG4gKiBTZXQgZmxhZ3Mgc3VjaCBhcyBgLm9rYCBiYXNlZCBvbiBgc3RhdHVzYC5cbiAqXG4gKiBGb3IgZXhhbXBsZSBhIDJ4eCByZXNwb25zZSB3aWxsIGdpdmUgeW91IGEgYC5va2Agb2YgX190cnVlX19cbiAqIHdoZXJlYXMgNXh4IHdpbGwgYmUgX19mYWxzZV9fIGFuZCBgLmVycm9yYCB3aWxsIGJlIF9fdHJ1ZV9fLiBUaGVcbiAqIGAuY2xpZW50RXJyb3JgIGFuZCBgLnNlcnZlckVycm9yYCBhcmUgYWxzbyBhdmFpbGFibGUgdG8gYmUgbW9yZVxuICogc3BlY2lmaWMsIGFuZCBgLnN0YXR1c1R5cGVgIGlzIHRoZSBjbGFzcyBvZiBlcnJvciByYW5naW5nIGZyb20gMS4uNVxuICogc29tZXRpbWVzIHVzZWZ1bCBmb3IgbWFwcGluZyByZXNwb25kIGNvbG9ycyBldGMuXG4gKlxuICogXCJzdWdhclwiIHByb3BlcnRpZXMgYXJlIGFsc28gZGVmaW5lZCBmb3IgY29tbW9uIGNhc2VzLiBDdXJyZW50bHkgcHJvdmlkaW5nOlxuICpcbiAqICAgLSAubm9Db250ZW50XG4gKiAgIC0gLmJhZFJlcXVlc3RcbiAqICAgLSAudW5hdXRob3JpemVkXG4gKiAgIC0gLm5vdEFjY2VwdGFibGVcbiAqICAgLSAubm90Rm91bmRcbiAqXG4gKiBAcGFyYW0ge051bWJlcn0gc3RhdHVzXG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5SZXNwb25zZS5wcm90b3R5cGUuc2V0U3RhdHVzUHJvcGVydGllcyA9IGZ1bmN0aW9uKHN0YXR1cyl7XG4gIHZhciB0eXBlID0gc3RhdHVzIC8gMTAwIHwgMDtcblxuICAvLyBzdGF0dXMgLyBjbGFzc1xuICB0aGlzLnN0YXR1cyA9IHN0YXR1cztcbiAgdGhpcy5zdGF0dXNUeXBlID0gdHlwZTtcblxuICAvLyBiYXNpY3NcbiAgdGhpcy5pbmZvID0gMSA9PSB0eXBlO1xuICB0aGlzLm9rID0gMiA9PSB0eXBlO1xuICB0aGlzLmNsaWVudEVycm9yID0gNCA9PSB0eXBlO1xuICB0aGlzLnNlcnZlckVycm9yID0gNSA9PSB0eXBlO1xuICB0aGlzLmVycm9yID0gKDQgPT0gdHlwZSB8fCA1ID09IHR5cGUpXG4gICAgPyB0aGlzLnRvRXJyb3IoKVxuICAgIDogZmFsc2U7XG5cbiAgLy8gc3VnYXJcbiAgdGhpcy5hY2NlcHRlZCA9IDIwMiA9PSBzdGF0dXM7XG4gIHRoaXMubm9Db250ZW50ID0gMjA0ID09IHN0YXR1cyB8fCAxMjIzID09IHN0YXR1cztcbiAgdGhpcy5iYWRSZXF1ZXN0ID0gNDAwID09IHN0YXR1cztcbiAgdGhpcy51bmF1dGhvcml6ZWQgPSA0MDEgPT0gc3RhdHVzO1xuICB0aGlzLm5vdEFjY2VwdGFibGUgPSA0MDYgPT0gc3RhdHVzO1xuICB0aGlzLm5vdEZvdW5kID0gNDA0ID09IHN0YXR1cztcbiAgdGhpcy5mb3JiaWRkZW4gPSA0MDMgPT0gc3RhdHVzO1xufTtcblxuLyoqXG4gKiBSZXR1cm4gYW4gYEVycm9yYCByZXByZXNlbnRhdGl2ZSBvZiB0aGlzIHJlc3BvbnNlLlxuICpcbiAqIEByZXR1cm4ge0Vycm9yfVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5SZXNwb25zZS5wcm90b3R5cGUudG9FcnJvciA9IGZ1bmN0aW9uKCl7XG4gIHZhciByZXEgPSB0aGlzLnJlcTtcbiAgdmFyIG1ldGhvZCA9IHJlcS5tZXRob2Q7XG4gIHZhciB1cmwgPSByZXEudXJsO1xuXG4gIHZhciBtc2cgPSAnY2Fubm90ICcgKyBtZXRob2QgKyAnICcgKyB1cmwgKyAnICgnICsgdGhpcy5zdGF0dXMgKyAnKSc7XG4gIHZhciBlcnIgPSBuZXcgRXJyb3IobXNnKTtcbiAgZXJyLnN0YXR1cyA9IHRoaXMuc3RhdHVzO1xuICBlcnIubWV0aG9kID0gbWV0aG9kO1xuICBlcnIudXJsID0gdXJsO1xuXG4gIHJldHVybiBlcnI7XG59O1xuXG4vKipcbiAqIEV4cG9zZSBgUmVzcG9uc2VgLlxuICovXG5cbnJlcXVlc3QuUmVzcG9uc2UgPSBSZXNwb25zZTtcblxuLyoqXG4gKiBJbml0aWFsaXplIGEgbmV3IGBSZXF1ZXN0YCB3aXRoIHRoZSBnaXZlbiBgbWV0aG9kYCBhbmQgYHVybGAuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IG1ldGhvZFxuICogQHBhcmFtIHtTdHJpbmd9IHVybFxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5mdW5jdGlvbiBSZXF1ZXN0KG1ldGhvZCwgdXJsKSB7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgRW1pdHRlci5jYWxsKHRoaXMpO1xuICB0aGlzLl9xdWVyeSA9IHRoaXMuX3F1ZXJ5IHx8IFtdO1xuICB0aGlzLm1ldGhvZCA9IG1ldGhvZDtcbiAgdGhpcy51cmwgPSB1cmw7XG4gIHRoaXMuaGVhZGVyID0ge307XG4gIHRoaXMuX2hlYWRlciA9IHt9O1xuICB0aGlzLm9uKCdlbmQnLCBmdW5jdGlvbigpe1xuICAgIHZhciByZXMgPSBuZXcgUmVzcG9uc2Uoc2VsZik7XG4gICAgaWYgKCdIRUFEJyA9PSBtZXRob2QpIHJlcy50ZXh0ID0gbnVsbDtcbiAgICBzZWxmLmNhbGxiYWNrKG51bGwsIHJlcyk7XG4gIH0pO1xufVxuXG4vKipcbiAqIE1peGluIGBFbWl0dGVyYC5cbiAqL1xuXG5FbWl0dGVyKFJlcXVlc3QucHJvdG90eXBlKTtcblxuLyoqXG4gKiBBbGxvdyBmb3IgZXh0ZW5zaW9uXG4gKi9cblxuUmVxdWVzdC5wcm90b3R5cGUudXNlID0gZnVuY3Rpb24oZm4pIHtcbiAgZm4odGhpcyk7XG4gIHJldHVybiB0aGlzO1xufVxuXG4vKipcbiAqIFNldCB0aW1lb3V0IHRvIGBtc2AuXG4gKlxuICogQHBhcmFtIHtOdW1iZXJ9IG1zXG4gKiBAcmV0dXJuIHtSZXF1ZXN0fSBmb3IgY2hhaW5pbmdcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuUmVxdWVzdC5wcm90b3R5cGUudGltZW91dCA9IGZ1bmN0aW9uKG1zKXtcbiAgdGhpcy5fdGltZW91dCA9IG1zO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogQ2xlYXIgcHJldmlvdXMgdGltZW91dC5cbiAqXG4gKiBAcmV0dXJuIHtSZXF1ZXN0fSBmb3IgY2hhaW5pbmdcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuUmVxdWVzdC5wcm90b3R5cGUuY2xlYXJUaW1lb3V0ID0gZnVuY3Rpb24oKXtcbiAgdGhpcy5fdGltZW91dCA9IDA7XG4gIGNsZWFyVGltZW91dCh0aGlzLl90aW1lcik7XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBBYm9ydCB0aGUgcmVxdWVzdCwgYW5kIGNsZWFyIHBvdGVudGlhbCB0aW1lb3V0LlxuICpcbiAqIEByZXR1cm4ge1JlcXVlc3R9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cblJlcXVlc3QucHJvdG90eXBlLmFib3J0ID0gZnVuY3Rpb24oKXtcbiAgaWYgKHRoaXMuYWJvcnRlZCkgcmV0dXJuO1xuICB0aGlzLmFib3J0ZWQgPSB0cnVlO1xuICB0aGlzLnhoci5hYm9ydCgpO1xuICB0aGlzLmNsZWFyVGltZW91dCgpO1xuICB0aGlzLmVtaXQoJ2Fib3J0Jyk7XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBTZXQgaGVhZGVyIGBmaWVsZGAgdG8gYHZhbGAsIG9yIG11bHRpcGxlIGZpZWxkcyB3aXRoIG9uZSBvYmplY3QuXG4gKlxuICogRXhhbXBsZXM6XG4gKlxuICogICAgICByZXEuZ2V0KCcvJylcbiAqICAgICAgICAuc2V0KCdBY2NlcHQnLCAnYXBwbGljYXRpb24vanNvbicpXG4gKiAgICAgICAgLnNldCgnWC1BUEktS2V5JywgJ2Zvb2JhcicpXG4gKiAgICAgICAgLmVuZChjYWxsYmFjayk7XG4gKlxuICogICAgICByZXEuZ2V0KCcvJylcbiAqICAgICAgICAuc2V0KHsgQWNjZXB0OiAnYXBwbGljYXRpb24vanNvbicsICdYLUFQSS1LZXknOiAnZm9vYmFyJyB9KVxuICogICAgICAgIC5lbmQoY2FsbGJhY2spO1xuICpcbiAqIEBwYXJhbSB7U3RyaW5nfE9iamVjdH0gZmllbGRcbiAqIEBwYXJhbSB7U3RyaW5nfSB2YWxcbiAqIEByZXR1cm4ge1JlcXVlc3R9IGZvciBjaGFpbmluZ1xuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5SZXF1ZXN0LnByb3RvdHlwZS5zZXQgPSBmdW5jdGlvbihmaWVsZCwgdmFsKXtcbiAgaWYgKGlzT2JqZWN0KGZpZWxkKSkge1xuICAgIGZvciAodmFyIGtleSBpbiBmaWVsZCkge1xuICAgICAgdGhpcy5zZXQoa2V5LCBmaWVsZFtrZXldKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbiAgdGhpcy5faGVhZGVyW2ZpZWxkLnRvTG93ZXJDYXNlKCldID0gdmFsO1xuICB0aGlzLmhlYWRlcltmaWVsZF0gPSB2YWw7XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBHZXQgY2FzZS1pbnNlbnNpdGl2ZSBoZWFkZXIgYGZpZWxkYCB2YWx1ZS5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZmllbGRcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cblJlcXVlc3QucHJvdG90eXBlLmdldEhlYWRlciA9IGZ1bmN0aW9uKGZpZWxkKXtcbiAgcmV0dXJuIHRoaXMuX2hlYWRlcltmaWVsZC50b0xvd2VyQ2FzZSgpXTtcbn07XG5cbi8qKlxuICogU2V0IENvbnRlbnQtVHlwZSB0byBgdHlwZWAsIG1hcHBpbmcgdmFsdWVzIGZyb20gYHJlcXVlc3QudHlwZXNgLlxuICpcbiAqIEV4YW1wbGVzOlxuICpcbiAqICAgICAgc3VwZXJhZ2VudC50eXBlcy54bWwgPSAnYXBwbGljYXRpb24veG1sJztcbiAqXG4gKiAgICAgIHJlcXVlc3QucG9zdCgnLycpXG4gKiAgICAgICAgLnR5cGUoJ3htbCcpXG4gKiAgICAgICAgLnNlbmQoeG1sc3RyaW5nKVxuICogICAgICAgIC5lbmQoY2FsbGJhY2spO1xuICpcbiAqICAgICAgcmVxdWVzdC5wb3N0KCcvJylcbiAqICAgICAgICAudHlwZSgnYXBwbGljYXRpb24veG1sJylcbiAqICAgICAgICAuc2VuZCh4bWxzdHJpbmcpXG4gKiAgICAgICAgLmVuZChjYWxsYmFjayk7XG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHR5cGVcbiAqIEByZXR1cm4ge1JlcXVlc3R9IGZvciBjaGFpbmluZ1xuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5SZXF1ZXN0LnByb3RvdHlwZS50eXBlID0gZnVuY3Rpb24odHlwZSl7XG4gIHRoaXMuc2V0KCdDb250ZW50LVR5cGUnLCByZXF1ZXN0LnR5cGVzW3R5cGVdIHx8IHR5cGUpO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogU2V0IEFjY2VwdCB0byBgdHlwZWAsIG1hcHBpbmcgdmFsdWVzIGZyb20gYHJlcXVlc3QudHlwZXNgLlxuICpcbiAqIEV4YW1wbGVzOlxuICpcbiAqICAgICAgc3VwZXJhZ2VudC50eXBlcy5qc29uID0gJ2FwcGxpY2F0aW9uL2pzb24nO1xuICpcbiAqICAgICAgcmVxdWVzdC5nZXQoJy9hZ2VudCcpXG4gKiAgICAgICAgLmFjY2VwdCgnanNvbicpXG4gKiAgICAgICAgLmVuZChjYWxsYmFjayk7XG4gKlxuICogICAgICByZXF1ZXN0LmdldCgnL2FnZW50JylcbiAqICAgICAgICAuYWNjZXB0KCdhcHBsaWNhdGlvbi9qc29uJylcbiAqICAgICAgICAuZW5kKGNhbGxiYWNrKTtcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gYWNjZXB0XG4gKiBAcmV0dXJuIHtSZXF1ZXN0fSBmb3IgY2hhaW5pbmdcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuUmVxdWVzdC5wcm90b3R5cGUuYWNjZXB0ID0gZnVuY3Rpb24odHlwZSl7XG4gIHRoaXMuc2V0KCdBY2NlcHQnLCByZXF1ZXN0LnR5cGVzW3R5cGVdIHx8IHR5cGUpO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogU2V0IEF1dGhvcml6YXRpb24gZmllbGQgdmFsdWUgd2l0aCBgdXNlcmAgYW5kIGBwYXNzYC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gdXNlclxuICogQHBhcmFtIHtTdHJpbmd9IHBhc3NcbiAqIEByZXR1cm4ge1JlcXVlc3R9IGZvciBjaGFpbmluZ1xuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5SZXF1ZXN0LnByb3RvdHlwZS5hdXRoID0gZnVuY3Rpb24odXNlciwgcGFzcyl7XG4gIHZhciBzdHIgPSBidG9hKHVzZXIgKyAnOicgKyBwYXNzKTtcbiAgdGhpcy5zZXQoJ0F1dGhvcml6YXRpb24nLCAnQmFzaWMgJyArIHN0cik7XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4qIEFkZCBxdWVyeS1zdHJpbmcgYHZhbGAuXG4qXG4qIEV4YW1wbGVzOlxuKlxuKiAgIHJlcXVlc3QuZ2V0KCcvc2hvZXMnKVxuKiAgICAgLnF1ZXJ5KCdzaXplPTEwJylcbiogICAgIC5xdWVyeSh7IGNvbG9yOiAnYmx1ZScgfSlcbipcbiogQHBhcmFtIHtPYmplY3R8U3RyaW5nfSB2YWxcbiogQHJldHVybiB7UmVxdWVzdH0gZm9yIGNoYWluaW5nXG4qIEBhcGkgcHVibGljXG4qL1xuXG5SZXF1ZXN0LnByb3RvdHlwZS5xdWVyeSA9IGZ1bmN0aW9uKHZhbCl7XG4gIGlmICgnc3RyaW5nJyAhPSB0eXBlb2YgdmFsKSB2YWwgPSBzZXJpYWxpemUodmFsKTtcbiAgaWYgKHZhbCkgdGhpcy5fcXVlcnkucHVzaCh2YWwpO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogV3JpdGUgdGhlIGZpZWxkIGBuYW1lYCBhbmQgYHZhbGAgZm9yIFwibXVsdGlwYXJ0L2Zvcm0tZGF0YVwiXG4gKiByZXF1ZXN0IGJvZGllcy5cbiAqXG4gKiBgYGAganNcbiAqIHJlcXVlc3QucG9zdCgnL3VwbG9hZCcpXG4gKiAgIC5maWVsZCgnZm9vJywgJ2JhcicpXG4gKiAgIC5lbmQoY2FsbGJhY2spO1xuICogYGBgXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IG5hbWVcbiAqIEBwYXJhbSB7U3RyaW5nfEJsb2J8RmlsZX0gdmFsXG4gKiBAcmV0dXJuIHtSZXF1ZXN0fSBmb3IgY2hhaW5pbmdcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuUmVxdWVzdC5wcm90b3R5cGUuZmllbGQgPSBmdW5jdGlvbihuYW1lLCB2YWwpe1xuICBpZiAoIXRoaXMuX2Zvcm1EYXRhKSB0aGlzLl9mb3JtRGF0YSA9IG5ldyBGb3JtRGF0YSgpO1xuICB0aGlzLl9mb3JtRGF0YS5hcHBlbmQobmFtZSwgdmFsKTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIFF1ZXVlIHRoZSBnaXZlbiBgZmlsZWAgYXMgYW4gYXR0YWNobWVudCB0byB0aGUgc3BlY2lmaWVkIGBmaWVsZGAsXG4gKiB3aXRoIG9wdGlvbmFsIGBmaWxlbmFtZWAuXG4gKlxuICogYGBgIGpzXG4gKiByZXF1ZXN0LnBvc3QoJy91cGxvYWQnKVxuICogICAuYXR0YWNoKG5ldyBCbG9iKFsnPGEgaWQ9XCJhXCI+PGIgaWQ9XCJiXCI+aGV5ITwvYj48L2E+J10sIHsgdHlwZTogXCJ0ZXh0L2h0bWxcIn0pKVxuICogICAuZW5kKGNhbGxiYWNrKTtcbiAqIGBgYFxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBmaWVsZFxuICogQHBhcmFtIHtCbG9ifEZpbGV9IGZpbGVcbiAqIEBwYXJhbSB7U3RyaW5nfSBmaWxlbmFtZVxuICogQHJldHVybiB7UmVxdWVzdH0gZm9yIGNoYWluaW5nXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cblJlcXVlc3QucHJvdG90eXBlLmF0dGFjaCA9IGZ1bmN0aW9uKGZpZWxkLCBmaWxlLCBmaWxlbmFtZSl7XG4gIGlmICghdGhpcy5fZm9ybURhdGEpIHRoaXMuX2Zvcm1EYXRhID0gbmV3IEZvcm1EYXRhKCk7XG4gIHRoaXMuX2Zvcm1EYXRhLmFwcGVuZChmaWVsZCwgZmlsZSwgZmlsZW5hbWUpO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogU2VuZCBgZGF0YWAsIGRlZmF1bHRpbmcgdGhlIGAudHlwZSgpYCB0byBcImpzb25cIiB3aGVuXG4gKiBhbiBvYmplY3QgaXMgZ2l2ZW4uXG4gKlxuICogRXhhbXBsZXM6XG4gKlxuICogICAgICAgLy8gcXVlcnlzdHJpbmdcbiAqICAgICAgIHJlcXVlc3QuZ2V0KCcvc2VhcmNoJylcbiAqICAgICAgICAgLmVuZChjYWxsYmFjaylcbiAqXG4gKiAgICAgICAvLyBtdWx0aXBsZSBkYXRhIFwid3JpdGVzXCJcbiAqICAgICAgIHJlcXVlc3QuZ2V0KCcvc2VhcmNoJylcbiAqICAgICAgICAgLnNlbmQoeyBzZWFyY2g6ICdxdWVyeScgfSlcbiAqICAgICAgICAgLnNlbmQoeyByYW5nZTogJzEuLjUnIH0pXG4gKiAgICAgICAgIC5zZW5kKHsgb3JkZXI6ICdkZXNjJyB9KVxuICogICAgICAgICAuZW5kKGNhbGxiYWNrKVxuICpcbiAqICAgICAgIC8vIG1hbnVhbCBqc29uXG4gKiAgICAgICByZXF1ZXN0LnBvc3QoJy91c2VyJylcbiAqICAgICAgICAgLnR5cGUoJ2pzb24nKVxuICogICAgICAgICAuc2VuZCgne1wibmFtZVwiOlwidGpcIn0pXG4gKiAgICAgICAgIC5lbmQoY2FsbGJhY2spXG4gKlxuICogICAgICAgLy8gYXV0byBqc29uXG4gKiAgICAgICByZXF1ZXN0LnBvc3QoJy91c2VyJylcbiAqICAgICAgICAgLnNlbmQoeyBuYW1lOiAndGonIH0pXG4gKiAgICAgICAgIC5lbmQoY2FsbGJhY2spXG4gKlxuICogICAgICAgLy8gbWFudWFsIHgtd3d3LWZvcm0tdXJsZW5jb2RlZFxuICogICAgICAgcmVxdWVzdC5wb3N0KCcvdXNlcicpXG4gKiAgICAgICAgIC50eXBlKCdmb3JtJylcbiAqICAgICAgICAgLnNlbmQoJ25hbWU9dGonKVxuICogICAgICAgICAuZW5kKGNhbGxiYWNrKVxuICpcbiAqICAgICAgIC8vIGF1dG8geC13d3ctZm9ybS11cmxlbmNvZGVkXG4gKiAgICAgICByZXF1ZXN0LnBvc3QoJy91c2VyJylcbiAqICAgICAgICAgLnR5cGUoJ2Zvcm0nKVxuICogICAgICAgICAuc2VuZCh7IG5hbWU6ICd0aicgfSlcbiAqICAgICAgICAgLmVuZChjYWxsYmFjaylcbiAqXG4gKiAgICAgICAvLyBkZWZhdWx0cyB0byB4LXd3dy1mb3JtLXVybGVuY29kZWRcbiAgKiAgICAgIHJlcXVlc3QucG9zdCgnL3VzZXInKVxuICAqICAgICAgICAuc2VuZCgnbmFtZT10b2JpJylcbiAgKiAgICAgICAgLnNlbmQoJ3NwZWNpZXM9ZmVycmV0JylcbiAgKiAgICAgICAgLmVuZChjYWxsYmFjaylcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ3xPYmplY3R9IGRhdGFcbiAqIEByZXR1cm4ge1JlcXVlc3R9IGZvciBjaGFpbmluZ1xuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5SZXF1ZXN0LnByb3RvdHlwZS5zZW5kID0gZnVuY3Rpb24oZGF0YSl7XG4gIHZhciBvYmogPSBpc09iamVjdChkYXRhKTtcbiAgdmFyIHR5cGUgPSB0aGlzLmdldEhlYWRlcignQ29udGVudC1UeXBlJyk7XG5cbiAgLy8gbWVyZ2VcbiAgaWYgKG9iaiAmJiBpc09iamVjdCh0aGlzLl9kYXRhKSkge1xuICAgIGZvciAodmFyIGtleSBpbiBkYXRhKSB7XG4gICAgICB0aGlzLl9kYXRhW2tleV0gPSBkYXRhW2tleV07XG4gICAgfVxuICB9IGVsc2UgaWYgKCdzdHJpbmcnID09IHR5cGVvZiBkYXRhKSB7XG4gICAgaWYgKCF0eXBlKSB0aGlzLnR5cGUoJ2Zvcm0nKTtcbiAgICB0eXBlID0gdGhpcy5nZXRIZWFkZXIoJ0NvbnRlbnQtVHlwZScpO1xuICAgIGlmICgnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJyA9PSB0eXBlKSB7XG4gICAgICB0aGlzLl9kYXRhID0gdGhpcy5fZGF0YVxuICAgICAgICA/IHRoaXMuX2RhdGEgKyAnJicgKyBkYXRhXG4gICAgICAgIDogZGF0YTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fZGF0YSA9ICh0aGlzLl9kYXRhIHx8ICcnKSArIGRhdGE7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHRoaXMuX2RhdGEgPSBkYXRhO1xuICB9XG5cbiAgaWYgKCFvYmopIHJldHVybiB0aGlzO1xuICBpZiAoIXR5cGUpIHRoaXMudHlwZSgnanNvbicpO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogSW52b2tlIHRoZSBjYWxsYmFjayB3aXRoIGBlcnJgIGFuZCBgcmVzYFxuICogYW5kIGhhbmRsZSBhcml0eSBjaGVjay5cbiAqXG4gKiBAcGFyYW0ge0Vycm9yfSBlcnJcbiAqIEBwYXJhbSB7UmVzcG9uc2V9IHJlc1xuICogQGFwaSBwcml2YXRlXG4gKi9cblxuUmVxdWVzdC5wcm90b3R5cGUuY2FsbGJhY2sgPSBmdW5jdGlvbihlcnIsIHJlcyl7XG4gIHZhciBmbiA9IHRoaXMuX2NhbGxiYWNrO1xuICBpZiAoMiA9PSBmbi5sZW5ndGgpIHJldHVybiBmbihlcnIsIHJlcyk7XG4gIGlmIChlcnIpIHJldHVybiB0aGlzLmVtaXQoJ2Vycm9yJywgZXJyKTtcbiAgZm4ocmVzKTtcbn07XG5cbi8qKlxuICogSW52b2tlIGNhbGxiYWNrIHdpdGggeC1kb21haW4gZXJyb3IuXG4gKlxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuUmVxdWVzdC5wcm90b3R5cGUuY3Jvc3NEb21haW5FcnJvciA9IGZ1bmN0aW9uKCl7XG4gIHZhciBlcnIgPSBuZXcgRXJyb3IoJ09yaWdpbiBpcyBub3QgYWxsb3dlZCBieSBBY2Nlc3MtQ29udHJvbC1BbGxvdy1PcmlnaW4nKTtcbiAgZXJyLmNyb3NzRG9tYWluID0gdHJ1ZTtcbiAgdGhpcy5jYWxsYmFjayhlcnIpO1xufTtcblxuLyoqXG4gKiBJbnZva2UgY2FsbGJhY2sgd2l0aCB0aW1lb3V0IGVycm9yLlxuICpcbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cblJlcXVlc3QucHJvdG90eXBlLnRpbWVvdXRFcnJvciA9IGZ1bmN0aW9uKCl7XG4gIHZhciB0aW1lb3V0ID0gdGhpcy5fdGltZW91dDtcbiAgdmFyIGVyciA9IG5ldyBFcnJvcigndGltZW91dCBvZiAnICsgdGltZW91dCArICdtcyBleGNlZWRlZCcpO1xuICBlcnIudGltZW91dCA9IHRpbWVvdXQ7XG4gIHRoaXMuY2FsbGJhY2soZXJyKTtcbn07XG5cbi8qKlxuICogRW5hYmxlIHRyYW5zbWlzc2lvbiBvZiBjb29raWVzIHdpdGggeC1kb21haW4gcmVxdWVzdHMuXG4gKlxuICogTm90ZSB0aGF0IGZvciB0aGlzIHRvIHdvcmsgdGhlIG9yaWdpbiBtdXN0IG5vdCBiZVxuICogdXNpbmcgXCJBY2Nlc3MtQ29udHJvbC1BbGxvdy1PcmlnaW5cIiB3aXRoIGEgd2lsZGNhcmQsXG4gKiBhbmQgYWxzbyBtdXN0IHNldCBcIkFjY2Vzcy1Db250cm9sLUFsbG93LUNyZWRlbnRpYWxzXCJcbiAqIHRvIFwidHJ1ZVwiLlxuICpcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuUmVxdWVzdC5wcm90b3R5cGUud2l0aENyZWRlbnRpYWxzID0gZnVuY3Rpb24oKXtcbiAgdGhpcy5fd2l0aENyZWRlbnRpYWxzID0gdHJ1ZTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIEluaXRpYXRlIHJlcXVlc3QsIGludm9raW5nIGNhbGxiYWNrIGBmbihyZXMpYFxuICogd2l0aCBhbiBpbnN0YW5jZW9mIGBSZXNwb25zZWAuXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cbiAqIEByZXR1cm4ge1JlcXVlc3R9IGZvciBjaGFpbmluZ1xuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5SZXF1ZXN0LnByb3RvdHlwZS5lbmQgPSBmdW5jdGlvbihmbil7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgdmFyIHhociA9IHRoaXMueGhyID0gZ2V0WEhSKCk7XG4gIHZhciBxdWVyeSA9IHRoaXMuX3F1ZXJ5LmpvaW4oJyYnKTtcbiAgdmFyIHRpbWVvdXQgPSB0aGlzLl90aW1lb3V0O1xuICB2YXIgZGF0YSA9IHRoaXMuX2Zvcm1EYXRhIHx8IHRoaXMuX2RhdGE7XG5cbiAgLy8gc3RvcmUgY2FsbGJhY2tcbiAgdGhpcy5fY2FsbGJhY2sgPSBmbiB8fCBub29wO1xuXG4gIC8vIHN0YXRlIGNoYW5nZVxuICB4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24oKXtcbiAgICBpZiAoNCAhPSB4aHIucmVhZHlTdGF0ZSkgcmV0dXJuO1xuICAgIGlmICgwID09IHhoci5zdGF0dXMpIHtcbiAgICAgIGlmIChzZWxmLmFib3J0ZWQpIHJldHVybiBzZWxmLnRpbWVvdXRFcnJvcigpO1xuICAgICAgcmV0dXJuIHNlbGYuY3Jvc3NEb21haW5FcnJvcigpO1xuICAgIH1cbiAgICBzZWxmLmVtaXQoJ2VuZCcpO1xuICB9O1xuXG4gIC8vIHByb2dyZXNzXG4gIGlmICh4aHIudXBsb2FkKSB7XG4gICAgeGhyLnVwbG9hZC5vbnByb2dyZXNzID0gZnVuY3Rpb24oZSl7XG4gICAgICBlLnBlcmNlbnQgPSBlLmxvYWRlZCAvIGUudG90YWwgKiAxMDA7XG4gICAgICBzZWxmLmVtaXQoJ3Byb2dyZXNzJywgZSk7XG4gICAgfTtcbiAgfVxuXG4gIC8vIHRpbWVvdXRcbiAgaWYgKHRpbWVvdXQgJiYgIXRoaXMuX3RpbWVyKSB7XG4gICAgdGhpcy5fdGltZXIgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgICBzZWxmLmFib3J0KCk7XG4gICAgfSwgdGltZW91dCk7XG4gIH1cblxuICAvLyBxdWVyeXN0cmluZ1xuICBpZiAocXVlcnkpIHtcbiAgICBxdWVyeSA9IHJlcXVlc3Quc2VyaWFsaXplT2JqZWN0KHF1ZXJ5KTtcbiAgICB0aGlzLnVybCArPSB+dGhpcy51cmwuaW5kZXhPZignPycpXG4gICAgICA/ICcmJyArIHF1ZXJ5XG4gICAgICA6ICc/JyArIHF1ZXJ5O1xuICB9XG5cbiAgLy8gaW5pdGlhdGUgcmVxdWVzdFxuICB4aHIub3Blbih0aGlzLm1ldGhvZCwgdGhpcy51cmwsIHRydWUpO1xuXG4gIC8vIENPUlNcbiAgaWYgKHRoaXMuX3dpdGhDcmVkZW50aWFscykgeGhyLndpdGhDcmVkZW50aWFscyA9IHRydWU7XG5cbiAgLy8gYm9keVxuICBpZiAoJ0dFVCcgIT0gdGhpcy5tZXRob2QgJiYgJ0hFQUQnICE9IHRoaXMubWV0aG9kICYmICdzdHJpbmcnICE9IHR5cGVvZiBkYXRhICYmICFpc0hvc3QoZGF0YSkpIHtcbiAgICAvLyBzZXJpYWxpemUgc3R1ZmZcbiAgICB2YXIgc2VyaWFsaXplID0gcmVxdWVzdC5zZXJpYWxpemVbdGhpcy5nZXRIZWFkZXIoJ0NvbnRlbnQtVHlwZScpXTtcbiAgICBpZiAoc2VyaWFsaXplKSBkYXRhID0gc2VyaWFsaXplKGRhdGEpO1xuICB9XG5cbiAgLy8gc2V0IGhlYWRlciBmaWVsZHNcbiAgZm9yICh2YXIgZmllbGQgaW4gdGhpcy5oZWFkZXIpIHtcbiAgICBpZiAobnVsbCA9PSB0aGlzLmhlYWRlcltmaWVsZF0pIGNvbnRpbnVlO1xuICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKGZpZWxkLCB0aGlzLmhlYWRlcltmaWVsZF0pO1xuICB9XG5cbiAgLy8gc2VuZCBzdHVmZlxuICB0aGlzLmVtaXQoJ3JlcXVlc3QnLCB0aGlzKTtcbiAgeGhyLnNlbmQoZGF0YSk7XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBFeHBvc2UgYFJlcXVlc3RgLlxuICovXG5cbnJlcXVlc3QuUmVxdWVzdCA9IFJlcXVlc3Q7XG5cbi8qKlxuICogSXNzdWUgYSByZXF1ZXN0OlxuICpcbiAqIEV4YW1wbGVzOlxuICpcbiAqICAgIHJlcXVlc3QoJ0dFVCcsICcvdXNlcnMnKS5lbmQoY2FsbGJhY2spXG4gKiAgICByZXF1ZXN0KCcvdXNlcnMnKS5lbmQoY2FsbGJhY2spXG4gKiAgICByZXF1ZXN0KCcvdXNlcnMnLCBjYWxsYmFjaylcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gbWV0aG9kXG4gKiBAcGFyYW0ge1N0cmluZ3xGdW5jdGlvbn0gdXJsIG9yIGNhbGxiYWNrXG4gKiBAcmV0dXJuIHtSZXF1ZXN0fVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5mdW5jdGlvbiByZXF1ZXN0KG1ldGhvZCwgdXJsKSB7XG4gIC8vIGNhbGxiYWNrXG4gIGlmICgnZnVuY3Rpb24nID09IHR5cGVvZiB1cmwpIHtcbiAgICByZXR1cm4gbmV3IFJlcXVlc3QoJ0dFVCcsIG1ldGhvZCkuZW5kKHVybCk7XG4gIH1cblxuICAvLyB1cmwgZmlyc3RcbiAgaWYgKDEgPT0gYXJndW1lbnRzLmxlbmd0aCkge1xuICAgIHJldHVybiBuZXcgUmVxdWVzdCgnR0VUJywgbWV0aG9kKTtcbiAgfVxuXG4gIHJldHVybiBuZXcgUmVxdWVzdChtZXRob2QsIHVybCk7XG59XG5cbi8qKlxuICogR0VUIGB1cmxgIHdpdGggb3B0aW9uYWwgY2FsbGJhY2sgYGZuKHJlcylgLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSB1cmxcbiAqIEBwYXJhbSB7TWl4ZWR8RnVuY3Rpb259IGRhdGEgb3IgZm5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gKiBAcmV0dXJuIHtSZXF1ZXN0fVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5yZXF1ZXN0LmdldCA9IGZ1bmN0aW9uKHVybCwgZGF0YSwgZm4pe1xuICB2YXIgcmVxID0gcmVxdWVzdCgnR0VUJywgdXJsKTtcbiAgaWYgKCdmdW5jdGlvbicgPT0gdHlwZW9mIGRhdGEpIGZuID0gZGF0YSwgZGF0YSA9IG51bGw7XG4gIGlmIChkYXRhKSByZXEucXVlcnkoZGF0YSk7XG4gIGlmIChmbikgcmVxLmVuZChmbik7XG4gIHJldHVybiByZXE7XG59O1xuXG4vKipcbiAqIEhFQUQgYHVybGAgd2l0aCBvcHRpb25hbCBjYWxsYmFjayBgZm4ocmVzKWAuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHVybFxuICogQHBhcmFtIHtNaXhlZHxGdW5jdGlvbn0gZGF0YSBvciBmblxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cbiAqIEByZXR1cm4ge1JlcXVlc3R9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbnJlcXVlc3QuaGVhZCA9IGZ1bmN0aW9uKHVybCwgZGF0YSwgZm4pe1xuICB2YXIgcmVxID0gcmVxdWVzdCgnSEVBRCcsIHVybCk7XG4gIGlmICgnZnVuY3Rpb24nID09IHR5cGVvZiBkYXRhKSBmbiA9IGRhdGEsIGRhdGEgPSBudWxsO1xuICBpZiAoZGF0YSkgcmVxLnNlbmQoZGF0YSk7XG4gIGlmIChmbikgcmVxLmVuZChmbik7XG4gIHJldHVybiByZXE7XG59O1xuXG4vKipcbiAqIERFTEVURSBgdXJsYCB3aXRoIG9wdGlvbmFsIGNhbGxiYWNrIGBmbihyZXMpYC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gdXJsXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxuICogQHJldHVybiB7UmVxdWVzdH1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxucmVxdWVzdC5kZWwgPSBmdW5jdGlvbih1cmwsIGZuKXtcbiAgdmFyIHJlcSA9IHJlcXVlc3QoJ0RFTEVURScsIHVybCk7XG4gIGlmIChmbikgcmVxLmVuZChmbik7XG4gIHJldHVybiByZXE7XG59O1xuXG4vKipcbiAqIFBBVENIIGB1cmxgIHdpdGggb3B0aW9uYWwgYGRhdGFgIGFuZCBjYWxsYmFjayBgZm4ocmVzKWAuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHVybFxuICogQHBhcmFtIHtNaXhlZH0gZGF0YVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cbiAqIEByZXR1cm4ge1JlcXVlc3R9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbnJlcXVlc3QucGF0Y2ggPSBmdW5jdGlvbih1cmwsIGRhdGEsIGZuKXtcbiAgdmFyIHJlcSA9IHJlcXVlc3QoJ1BBVENIJywgdXJsKTtcbiAgaWYgKCdmdW5jdGlvbicgPT0gdHlwZW9mIGRhdGEpIGZuID0gZGF0YSwgZGF0YSA9IG51bGw7XG4gIGlmIChkYXRhKSByZXEuc2VuZChkYXRhKTtcbiAgaWYgKGZuKSByZXEuZW5kKGZuKTtcbiAgcmV0dXJuIHJlcTtcbn07XG5cbi8qKlxuICogUE9TVCBgdXJsYCB3aXRoIG9wdGlvbmFsIGBkYXRhYCBhbmQgY2FsbGJhY2sgYGZuKHJlcylgLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSB1cmxcbiAqIEBwYXJhbSB7TWl4ZWR9IGRhdGFcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gKiBAcmV0dXJuIHtSZXF1ZXN0fVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5yZXF1ZXN0LnBvc3QgPSBmdW5jdGlvbih1cmwsIGRhdGEsIGZuKXtcbiAgdmFyIHJlcSA9IHJlcXVlc3QoJ1BPU1QnLCB1cmwpO1xuICBpZiAoJ2Z1bmN0aW9uJyA9PSB0eXBlb2YgZGF0YSkgZm4gPSBkYXRhLCBkYXRhID0gbnVsbDtcbiAgaWYgKGRhdGEpIHJlcS5zZW5kKGRhdGEpO1xuICBpZiAoZm4pIHJlcS5lbmQoZm4pO1xuICByZXR1cm4gcmVxO1xufTtcblxuLyoqXG4gKiBQVVQgYHVybGAgd2l0aCBvcHRpb25hbCBgZGF0YWAgYW5kIGNhbGxiYWNrIGBmbihyZXMpYC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gdXJsXG4gKiBAcGFyYW0ge01peGVkfEZ1bmN0aW9ufSBkYXRhIG9yIGZuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxuICogQHJldHVybiB7UmVxdWVzdH1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxucmVxdWVzdC5wdXQgPSBmdW5jdGlvbih1cmwsIGRhdGEsIGZuKXtcbiAgdmFyIHJlcSA9IHJlcXVlc3QoJ1BVVCcsIHVybCk7XG4gIGlmICgnZnVuY3Rpb24nID09IHR5cGVvZiBkYXRhKSBmbiA9IGRhdGEsIGRhdGEgPSBudWxsO1xuICBpZiAoZGF0YSkgcmVxLnNlbmQoZGF0YSk7XG4gIGlmIChmbikgcmVxLmVuZChmbik7XG4gIHJldHVybiByZXE7XG59O1xuXG4vKipcbiAqIEV4cG9zZSBgcmVxdWVzdGAuXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSByZXF1ZXN0O1xuIiwibW9kdWxlLmV4cG9ydHMgPSBBcnJheTtcbiIsIlxudmFyIHJuZztcblxuaWYgKGdsb2JhbC5jcnlwdG8gJiYgY3J5cHRvLmdldFJhbmRvbVZhbHVlcykge1xuICAvLyBXSEFUV0cgY3J5cHRvLWJhc2VkIFJORyAtIGh0dHA6Ly93aWtpLndoYXR3Zy5vcmcvd2lraS9DcnlwdG9cbiAgLy8gTW9kZXJhdGVseSBmYXN0LCBoaWdoIHF1YWxpdHlcbiAgdmFyIF9ybmRzOCA9IG5ldyBVaW50OEFycmF5KDE2KTtcbiAgcm5nID0gZnVuY3Rpb24gd2hhdHdnUk5HKCkge1xuICAgIGNyeXB0by5nZXRSYW5kb21WYWx1ZXMoX3JuZHM4KTtcbiAgICByZXR1cm4gX3JuZHM4O1xuICB9O1xufVxuXG5pZiAoIXJuZykge1xuICAvLyBNYXRoLnJhbmRvbSgpLWJhc2VkIChSTkcpXG4gIC8vXG4gIC8vIElmIGFsbCBlbHNlIGZhaWxzLCB1c2UgTWF0aC5yYW5kb20oKS4gIEl0J3MgZmFzdCwgYnV0IGlzIG9mIHVuc3BlY2lmaWVkXG4gIC8vIHF1YWxpdHkuXG4gIHZhciAgX3JuZHMgPSBuZXcgQXJyYXkoMTYpO1xuICBybmcgPSBmdW5jdGlvbigpIHtcbiAgICBmb3IgKHZhciBpID0gMCwgcjsgaSA8IDE2OyBpKyspIHtcbiAgICAgIGlmICgoaSAmIDB4MDMpID09PSAwKSByID0gTWF0aC5yYW5kb20oKSAqIDB4MTAwMDAwMDAwO1xuICAgICAgX3JuZHNbaV0gPSByID4+PiAoKGkgJiAweDAzKSA8PCAzKSAmIDB4ZmY7XG4gICAgfVxuXG4gICAgcmV0dXJuIF9ybmRzO1xuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHJuZztcblxuIiwiLy8gICAgIHV1aWQuanNcbi8vXG4vLyAgICAgQ29weXJpZ2h0IChjKSAyMDEwLTIwMTIgUm9iZXJ0IEtpZWZmZXJcbi8vICAgICBNSVQgTGljZW5zZSAtIGh0dHA6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHBcblxuLy8gVW5pcXVlIElEIGNyZWF0aW9uIHJlcXVpcmVzIGEgaGlnaCBxdWFsaXR5IHJhbmRvbSAjIGdlbmVyYXRvci4gIFdlIGZlYXR1cmVcbi8vIGRldGVjdCB0byBkZXRlcm1pbmUgdGhlIGJlc3QgUk5HIHNvdXJjZSwgbm9ybWFsaXppbmcgdG8gYSBmdW5jdGlvbiB0aGF0XG4vLyByZXR1cm5zIDEyOC1iaXRzIG9mIHJhbmRvbW5lc3MsIHNpbmNlIHRoYXQncyB3aGF0J3MgdXN1YWxseSByZXF1aXJlZFxudmFyIF9ybmcgPSByZXF1aXJlKCcuL3JuZycpO1xuXG4vLyBCdWZmZXIgY2xhc3MgdG8gdXNlLFxuLy8gd2UgY2FuJ3QgdXNlIGBCdWZmZXIgfHwgQXJyYXlgIG90aGVyd2lzZSBCdWZmZXIgd291bGQgYmVcbi8vIHNoaW1tZWQgYnkgYnJvd3NlcmlmeSBhbmQgYWRkZWQgdG8gdGhlIGJyb3dzZXIgYnVpbGRcbnZhciBCdWZmZXJDbGFzcyA9IHJlcXVpcmUoJy4vYnVmZmVyJyk7XG5cbi8vIE1hcHMgZm9yIG51bWJlciA8LT4gaGV4IHN0cmluZyBjb252ZXJzaW9uXG52YXIgX2J5dGVUb0hleCA9IFtdO1xudmFyIF9oZXhUb0J5dGUgPSB7fTtcbmZvciAodmFyIGkgPSAwOyBpIDwgMjU2OyBpKyspIHtcbiAgX2J5dGVUb0hleFtpXSA9IChpICsgMHgxMDApLnRvU3RyaW5nKDE2KS5zdWJzdHIoMSk7XG4gIF9oZXhUb0J5dGVbX2J5dGVUb0hleFtpXV0gPSBpO1xufVxuXG4vLyAqKmBwYXJzZSgpYCAtIFBhcnNlIGEgVVVJRCBpbnRvIGl0J3MgY29tcG9uZW50IGJ5dGVzKipcbmZ1bmN0aW9uIHBhcnNlKHMsIGJ1Ziwgb2Zmc2V0KSB7XG4gIHZhciBpID0gKGJ1ZiAmJiBvZmZzZXQpIHx8IDAsIGlpID0gMDtcblxuICBidWYgPSBidWYgfHwgW107XG4gIHMudG9Mb3dlckNhc2UoKS5yZXBsYWNlKC9bMC05YS1mXXsyfS9nLCBmdW5jdGlvbihvY3QpIHtcbiAgICBpZiAoaWkgPCAxNikgeyAvLyBEb24ndCBvdmVyZmxvdyFcbiAgICAgIGJ1ZltpICsgaWkrK10gPSBfaGV4VG9CeXRlW29jdF07XG4gICAgfVxuICB9KTtcblxuICAvLyBaZXJvIG91dCByZW1haW5pbmcgYnl0ZXMgaWYgc3RyaW5nIHdhcyBzaG9ydFxuICB3aGlsZSAoaWkgPCAxNikge1xuICAgIGJ1ZltpICsgaWkrK10gPSAwO1xuICB9XG5cbiAgcmV0dXJuIGJ1Zjtcbn1cblxuLy8gKipgdW5wYXJzZSgpYCAtIENvbnZlcnQgVVVJRCBieXRlIGFycmF5IChhbGEgcGFyc2UoKSkgaW50byBhIHN0cmluZyoqXG5mdW5jdGlvbiB1bnBhcnNlKGJ1Ziwgb2Zmc2V0KSB7XG4gIHZhciBpID0gb2Zmc2V0IHx8IDAsIGJ0aCA9IF9ieXRlVG9IZXg7XG4gIHJldHVybiAgYnRoW2J1ZltpKytdXSArIGJ0aFtidWZbaSsrXV0gK1xuICAgICAgICAgIGJ0aFtidWZbaSsrXV0gKyBidGhbYnVmW2krK11dICsgJy0nICtcbiAgICAgICAgICBidGhbYnVmW2krK11dICsgYnRoW2J1ZltpKytdXSArICctJyArXG4gICAgICAgICAgYnRoW2J1ZltpKytdXSArIGJ0aFtidWZbaSsrXV0gKyAnLScgK1xuICAgICAgICAgIGJ0aFtidWZbaSsrXV0gKyBidGhbYnVmW2krK11dICsgJy0nICtcbiAgICAgICAgICBidGhbYnVmW2krK11dICsgYnRoW2J1ZltpKytdXSArXG4gICAgICAgICAgYnRoW2J1ZltpKytdXSArIGJ0aFtidWZbaSsrXV0gK1xuICAgICAgICAgIGJ0aFtidWZbaSsrXV0gKyBidGhbYnVmW2krK11dO1xufVxuXG4vLyAqKmB2MSgpYCAtIEdlbmVyYXRlIHRpbWUtYmFzZWQgVVVJRCoqXG4vL1xuLy8gSW5zcGlyZWQgYnkgaHR0cHM6Ly9naXRodWIuY29tL0xpb3NLL1VVSUQuanNcbi8vIGFuZCBodHRwOi8vZG9jcy5weXRob24ub3JnL2xpYnJhcnkvdXVpZC5odG1sXG5cbi8vIHJhbmRvbSAjJ3Mgd2UgbmVlZCB0byBpbml0IG5vZGUgYW5kIGNsb2Nrc2VxXG52YXIgX3NlZWRCeXRlcyA9IF9ybmcoKTtcblxuLy8gUGVyIDQuNSwgY3JlYXRlIGFuZCA0OC1iaXQgbm9kZSBpZCwgKDQ3IHJhbmRvbSBiaXRzICsgbXVsdGljYXN0IGJpdCA9IDEpXG52YXIgX25vZGVJZCA9IFtcbiAgX3NlZWRCeXRlc1swXSB8IDB4MDEsXG4gIF9zZWVkQnl0ZXNbMV0sIF9zZWVkQnl0ZXNbMl0sIF9zZWVkQnl0ZXNbM10sIF9zZWVkQnl0ZXNbNF0sIF9zZWVkQnl0ZXNbNV1cbl07XG5cbi8vIFBlciA0LjIuMiwgcmFuZG9taXplICgxNCBiaXQpIGNsb2Nrc2VxXG52YXIgX2Nsb2Nrc2VxID0gKF9zZWVkQnl0ZXNbNl0gPDwgOCB8IF9zZWVkQnl0ZXNbN10pICYgMHgzZmZmO1xuXG4vLyBQcmV2aW91cyB1dWlkIGNyZWF0aW9uIHRpbWVcbnZhciBfbGFzdE1TZWNzID0gMCwgX2xhc3ROU2VjcyA9IDA7XG5cbi8vIFNlZSBodHRwczovL2dpdGh1Yi5jb20vYnJvb2ZhL25vZGUtdXVpZCBmb3IgQVBJIGRldGFpbHNcbmZ1bmN0aW9uIHYxKG9wdGlvbnMsIGJ1Ziwgb2Zmc2V0KSB7XG4gIHZhciBpID0gYnVmICYmIG9mZnNldCB8fCAwO1xuICB2YXIgYiA9IGJ1ZiB8fCBbXTtcblxuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuICB2YXIgY2xvY2tzZXEgPSBvcHRpb25zLmNsb2Nrc2VxICE9PSB1bmRlZmluZWQgPyBvcHRpb25zLmNsb2Nrc2VxIDogX2Nsb2Nrc2VxO1xuXG4gIC8vIFVVSUQgdGltZXN0YW1wcyBhcmUgMTAwIG5hbm8tc2Vjb25kIHVuaXRzIHNpbmNlIHRoZSBHcmVnb3JpYW4gZXBvY2gsXG4gIC8vICgxNTgyLTEwLTE1IDAwOjAwKS4gIEpTTnVtYmVycyBhcmVuJ3QgcHJlY2lzZSBlbm91Z2ggZm9yIHRoaXMsIHNvXG4gIC8vIHRpbWUgaXMgaGFuZGxlZCBpbnRlcm5hbGx5IGFzICdtc2VjcycgKGludGVnZXIgbWlsbGlzZWNvbmRzKSBhbmQgJ25zZWNzJ1xuICAvLyAoMTAwLW5hbm9zZWNvbmRzIG9mZnNldCBmcm9tIG1zZWNzKSBzaW5jZSB1bml4IGVwb2NoLCAxOTcwLTAxLTAxIDAwOjAwLlxuICB2YXIgbXNlY3MgPSBvcHRpb25zLm1zZWNzICE9PSB1bmRlZmluZWQgPyBvcHRpb25zLm1zZWNzIDogbmV3IERhdGUoKS5nZXRUaW1lKCk7XG5cbiAgLy8gUGVyIDQuMi4xLjIsIHVzZSBjb3VudCBvZiB1dWlkJ3MgZ2VuZXJhdGVkIGR1cmluZyB0aGUgY3VycmVudCBjbG9ja1xuICAvLyBjeWNsZSB0byBzaW11bGF0ZSBoaWdoZXIgcmVzb2x1dGlvbiBjbG9ja1xuICB2YXIgbnNlY3MgPSBvcHRpb25zLm5zZWNzICE9PSB1bmRlZmluZWQgPyBvcHRpb25zLm5zZWNzIDogX2xhc3ROU2VjcyArIDE7XG5cbiAgLy8gVGltZSBzaW5jZSBsYXN0IHV1aWQgY3JlYXRpb24gKGluIG1zZWNzKVxuICB2YXIgZHQgPSAobXNlY3MgLSBfbGFzdE1TZWNzKSArIChuc2VjcyAtIF9sYXN0TlNlY3MpLzEwMDAwO1xuXG4gIC8vIFBlciA0LjIuMS4yLCBCdW1wIGNsb2Nrc2VxIG9uIGNsb2NrIHJlZ3Jlc3Npb25cbiAgaWYgKGR0IDwgMCAmJiBvcHRpb25zLmNsb2Nrc2VxID09PSB1bmRlZmluZWQpIHtcbiAgICBjbG9ja3NlcSA9IGNsb2Nrc2VxICsgMSAmIDB4M2ZmZjtcbiAgfVxuXG4gIC8vIFJlc2V0IG5zZWNzIGlmIGNsb2NrIHJlZ3Jlc3NlcyAobmV3IGNsb2Nrc2VxKSBvciB3ZSd2ZSBtb3ZlZCBvbnRvIGEgbmV3XG4gIC8vIHRpbWUgaW50ZXJ2YWxcbiAgaWYgKChkdCA8IDAgfHwgbXNlY3MgPiBfbGFzdE1TZWNzKSAmJiBvcHRpb25zLm5zZWNzID09PSB1bmRlZmluZWQpIHtcbiAgICBuc2VjcyA9IDA7XG4gIH1cblxuICAvLyBQZXIgNC4yLjEuMiBUaHJvdyBlcnJvciBpZiB0b28gbWFueSB1dWlkcyBhcmUgcmVxdWVzdGVkXG4gIGlmIChuc2VjcyA+PSAxMDAwMCkge1xuICAgIHRocm93IG5ldyBFcnJvcigndXVpZC52MSgpOiBDYW5cXCd0IGNyZWF0ZSBtb3JlIHRoYW4gMTBNIHV1aWRzL3NlYycpO1xuICB9XG5cbiAgX2xhc3RNU2VjcyA9IG1zZWNzO1xuICBfbGFzdE5TZWNzID0gbnNlY3M7XG4gIF9jbG9ja3NlcSA9IGNsb2Nrc2VxO1xuXG4gIC8vIFBlciA0LjEuNCAtIENvbnZlcnQgZnJvbSB1bml4IGVwb2NoIHRvIEdyZWdvcmlhbiBlcG9jaFxuICBtc2VjcyArPSAxMjIxOTI5MjgwMDAwMDtcblxuICAvLyBgdGltZV9sb3dgXG4gIHZhciB0bCA9ICgobXNlY3MgJiAweGZmZmZmZmYpICogMTAwMDAgKyBuc2VjcykgJSAweDEwMDAwMDAwMDtcbiAgYltpKytdID0gdGwgPj4+IDI0ICYgMHhmZjtcbiAgYltpKytdID0gdGwgPj4+IDE2ICYgMHhmZjtcbiAgYltpKytdID0gdGwgPj4+IDggJiAweGZmO1xuICBiW2krK10gPSB0bCAmIDB4ZmY7XG5cbiAgLy8gYHRpbWVfbWlkYFxuICB2YXIgdG1oID0gKG1zZWNzIC8gMHgxMDAwMDAwMDAgKiAxMDAwMCkgJiAweGZmZmZmZmY7XG4gIGJbaSsrXSA9IHRtaCA+Pj4gOCAmIDB4ZmY7XG4gIGJbaSsrXSA9IHRtaCAmIDB4ZmY7XG5cbiAgLy8gYHRpbWVfaGlnaF9hbmRfdmVyc2lvbmBcbiAgYltpKytdID0gdG1oID4+PiAyNCAmIDB4ZiB8IDB4MTA7IC8vIGluY2x1ZGUgdmVyc2lvblxuICBiW2krK10gPSB0bWggPj4+IDE2ICYgMHhmZjtcblxuICAvLyBgY2xvY2tfc2VxX2hpX2FuZF9yZXNlcnZlZGAgKFBlciA0LjIuMiAtIGluY2x1ZGUgdmFyaWFudClcbiAgYltpKytdID0gY2xvY2tzZXEgPj4+IDggfCAweDgwO1xuXG4gIC8vIGBjbG9ja19zZXFfbG93YFxuICBiW2krK10gPSBjbG9ja3NlcSAmIDB4ZmY7XG5cbiAgLy8gYG5vZGVgXG4gIHZhciBub2RlID0gb3B0aW9ucy5ub2RlIHx8IF9ub2RlSWQ7XG4gIGZvciAodmFyIG4gPSAwOyBuIDwgNjsgbisrKSB7XG4gICAgYltpICsgbl0gPSBub2RlW25dO1xuICB9XG5cbiAgcmV0dXJuIGJ1ZiA/IGJ1ZiA6IHVucGFyc2UoYik7XG59XG5cbi8vICoqYHY0KClgIC0gR2VuZXJhdGUgcmFuZG9tIFVVSUQqKlxuXG4vLyBTZWUgaHR0cHM6Ly9naXRodWIuY29tL2Jyb29mYS9ub2RlLXV1aWQgZm9yIEFQSSBkZXRhaWxzXG5mdW5jdGlvbiB2NChvcHRpb25zLCBidWYsIG9mZnNldCkge1xuICAvLyBEZXByZWNhdGVkIC0gJ2Zvcm1hdCcgYXJndW1lbnQsIGFzIHN1cHBvcnRlZCBpbiB2MS4yXG4gIHZhciBpID0gYnVmICYmIG9mZnNldCB8fCAwO1xuXG4gIGlmICh0eXBlb2Yob3B0aW9ucykgPT0gJ3N0cmluZycpIHtcbiAgICBidWYgPSBvcHRpb25zID09ICdiaW5hcnknID8gbmV3IEJ1ZmZlckNsYXNzKDE2KSA6IG51bGw7XG4gICAgb3B0aW9ucyA9IG51bGw7XG4gIH1cbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cbiAgdmFyIHJuZHMgPSBvcHRpb25zLnJhbmRvbSB8fCAob3B0aW9ucy5ybmcgfHwgX3JuZykoKTtcblxuICAvLyBQZXIgNC40LCBzZXQgYml0cyBmb3IgdmVyc2lvbiBhbmQgYGNsb2NrX3NlcV9oaV9hbmRfcmVzZXJ2ZWRgXG4gIHJuZHNbNl0gPSAocm5kc1s2XSAmIDB4MGYpIHwgMHg0MDtcbiAgcm5kc1s4XSA9IChybmRzWzhdICYgMHgzZikgfCAweDgwO1xuXG4gIC8vIENvcHkgYnl0ZXMgdG8gYnVmZmVyLCBpZiBwcm92aWRlZFxuICBpZiAoYnVmKSB7XG4gICAgZm9yICh2YXIgaWkgPSAwOyBpaSA8IDE2OyBpaSsrKSB7XG4gICAgICBidWZbaSArIGlpXSA9IHJuZHNbaWldO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBidWYgfHwgdW5wYXJzZShybmRzKTtcbn1cblxuLy8gRXhwb3J0IHB1YmxpYyBBUElcbnZhciB1dWlkID0gdjQ7XG51dWlkLnYxID0gdjE7XG51dWlkLnY0ID0gdjQ7XG51dWlkLnBhcnNlID0gcGFyc2U7XG51dWlkLnVucGFyc2UgPSB1bnBhcnNlO1xudXVpZC5CdWZmZXJDbGFzcyA9IEJ1ZmZlckNsYXNzO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHV1aWQ7XG4iLCIvKipcbiogVGhlIEFtYmFzc2Fkb3IgbGlzdGVucyB0byB3aGF0IGhhcHBlbnMgaW4gQ2xpZW50bGFuZCBhbmRcbiogcmVwb3J0cyBiYWNrIHRvIFNlcnZlcmxhbmQuXG4qXG4qIFRoZSBBbWJhc3NhZG9yIGFsc28gYnJpbmdzIG5ld3MgZnJvbSBTZXJ2ZXJsYW5kIHRvIENsaWVudGxhbmQuXG4qKi9cbnZhciAkID0gcmVxdWlyZSgnLi91dGlsLmpzJyksXG5cdHJlcXVlc3QgPSByZXF1aXJlKCdzdXBlcmFnZW50JyksXG5cdHZpZXcgPSBudWxsO1xuXG52YXIgcmVwb3J0TmV3Tm9kZSA9IGZ1bmN0aW9uKGUpIHtcblx0cmVxdWVzdFxuXHRcdC5wb3N0KFwibm9kZXMvXCIpXG5cdFx0LnNlbmQoZS5kZXRhaWwubm9kZSlcblx0XHQuZW5kKGZ1bmN0aW9uKGVyciwgcmVzKXtcblxuXHRcdH0pO1xufTtcblxudmFyIHJlcG9ydERlbGV0ZWROb2RlID0gZnVuY3Rpb24oZSkge1xuXHR2YXIgbm9kZUlkID0gZS5kZXRhaWwubm9kZUlkO1xuXG5cdHJlcXVlc3Rcblx0XHQuZGVsKFwibm9kZXMvXCIgKyBub2RlSWQpXG5cdFx0LmVuZChmdW5jdGlvbihlcnIsIHJlcykge1xuXHRcdFx0aWYgKGVycikgXG5cdFx0XHRcdHRocm93IFwiRXJyb3Igd2hlbiBkZWxldGluZyBub2RlIHdpdGggaWQgXCIgKyBub2RlSWQ7XG5cdFx0fSk7XG59O1xuXG52YXIgcmVwb3J0Tm9kZVVwZGF0ZSA9IGZ1bmN0aW9uKGUpIHtcblx0cmVxdWVzdFxuXHRcdC5wYXRjaChcIm5vZGVzL1wiICsgZS5kZXRhaWwubm9kZUlkKVxuXHRcdC5zZW5kKGUuZGV0YWlsLnBhdGNoKVxuXHRcdC5lbmQoZnVuY3Rpb24oZXJyLCByZXMpIHtcblx0XHRcdC8vY29uc29sZS5kaXIocmVzKTtcblx0XHR9KTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oZWwpIHtcblx0dmlldyA9IGVsO1xuXG5cdCQodmlldykub24oXCJ4LW5vZGUtY3JlYXRlZFwiLCByZXBvcnROZXdOb2RlKTtcblx0JCh2aWV3KS5vbihcIngtbm9kZS1kZWxldGVkXCIsIHJlcG9ydERlbGV0ZWROb2RlKTtcblx0JCh2aWV3KS5vbihcIngtbm9kZS11cGRhdGVkXCIsIHJlcG9ydE5vZGVVcGRhdGUpO1xufTsiLCIvKipcbiogVGhlIERPTSBXaGlzcGVyZXIgaXMgcmVzcG9uc2libGUgZm9yIHRhbGtpbmcgdG8gdGhlIERPTSB3aGVuIHRoaW5nc1xuKiBjaGFuZ2VzLiBJdCBsaXN0ZW5zIGZvciBldmVudHMgZW1pdHRlZCBieSBvdGhlciBtb2R1bGVzIHN1Y2ggYXMgdGhlIE1vdXNlIFxuKiBUcmFwcGVyIGFuZCB0aGUgTW9kZWwuXG4qKi9cblxucmVxdWlyZSgnZXM2LWNvbGxlY3Rpb25zJyk7XG52YXIgcGF0aEZpbmRlciA9IHJlcXVpcmUoXCIuL3BhdGgtZmluZGVyXCIpO1xuXG52YXIgc3ZnTWFrZXIgPSByZXF1aXJlKFwiLi9zdmctbWFrZXJcIiksXG5cdCQgPSByZXF1aXJlKCcuL3V0aWwnKSxcblx0eHkgPSByZXF1aXJlKCcuL3h5JyksXG5cdHV1aWQgPSByZXF1aXJlKCd1dWlkJyksXG5cdHZpZXcgPSBudWxsLFxuXHRub2RlcyA9IG5ldyBNYXAoKTtcblx0c2VsZWN0ZWROb2RlcyA9IFtdLFxuXHRzZWxlY3RlZFNvY2tldCA9IG51bGwsXG5cdGV2b2x2aW5nUmVsYXRpb25zaGlwID0gbnVsbDtcblxudmFyIGFkZE5vZGUgPSBmdW5jdGlvbihlKSB7XG5cdHZhciBub2RlID0gZS5kZXRhaWwubm9kZTtcblxuXHR2aWV3LmFwcGVuZENoaWxkKHN2Z01ha2VyLmNyZWF0ZVN2Z05vZGUobm9kZSkpO1xuXHRub2Rlcy5zZXQobm9kZS5pZCwgdmlldy5sYXN0Q2hpbGQpO1xuXG5cdGlmIChlLnR5cGUgPT0gXCJ4LW5vZGUtY3JlYXRlZFwiKSB7XG5cdFx0Ly8gR28gc3RyYWlnaHQgaW50byBlZGl0IG1vZGUgd2hlbiBjcmVhdGluZyBhIG5ldyBub2RlXG5cdFx0c2V0QWN0aXZlTm9kZSh2aWV3Lmxhc3RDaGlsZCk7XG5cdFx0JCh2aWV3KS5lbWl0KFwidWktZWRpdC1tb2RlXCIsIHtcblx0XHRcdG5vZGVJZDogbm9kZS5pZCxcblx0XHRcdHBvc2l0aW9uOiBub2RlLnBvc2l0aW9uLFxuXHRcdFx0Y3VycmVudFZhbHVlOiBcIlwiXG5cdFx0fSk7XG5cdH1cbn07XG5cbnZhciBjcmVhdGVOb2RlID0gZnVuY3Rpb24oZSkge1xuXHRpZiAodGhpcyA9PSBlLnRhcmdldCkge1xuXHRcdHZhciBub2RlID0ge1xuXHRcdFx0aWQ6IHV1aWQudjQoKSxcblx0XHRcdHRleHQ6IFwiXCIsXG5cdFx0XHRwb3NpdGlvbjogZS5kZXRhaWwucG9zaXRpb25cblx0XHR9O1xuXG5cdFx0Ly8gTWFrZSB0aGUgcG9pbnQgd2hlcmUgdGhlIHVzZXIgY2xpY2tlZCB0aGUgY2VudGVyIG9mIHRoZSBub2RlLlxuXHRcdHZhciBkZWZhdWx0U2l6ZSA9IHN2Z01ha2VyLmdldERlZmF1bHROb2RlU2l6ZSgpO1xuXHRcdG5vZGUucG9zaXRpb24ueCA9IG5vZGUucG9zaXRpb24ueCAtIChkZWZhdWx0U2l6ZS53aWR0aCAvIDIpO1xuXHRcdG5vZGUucG9zaXRpb24ueSA9IG5vZGUucG9zaXRpb24ueSAtIChkZWZhdWx0U2l6ZS5oZWlnaHQgLyAyKTtcblxuXHRcdCQodmlldykuZW1pdChcInVpLWNyZWF0ZS1ub2RlXCIsIHtcblx0XHRcdG5vZGU6IG5vZGVcblx0XHR9KTtcblx0fVxufTtcblxuLyoqXG4qIFNlbmRzIGEgJ2NvbW1hbmQnIHRvIHRoZSBNb2RlbC4gVGhlIHJlbW92aW5nIG9mIERPTSBub2RlcyBpcyB0cmlnZ2VyZWQgYnlcbiogdGhlICd4LW5vZGUtZGVsZXRlZCcgZXZlbnQuXG4qKi9cbnZhciBkZWxldGVQcmVzc2VkID0gZnVuY3Rpb24oKSB7XG5cdHNlbGVjdGVkTm9kZXMuZm9yRWFjaChmdW5jdGlvbihub2RlKSB7XG5cdFx0JCh2aWV3KS5lbWl0KFwidWktZGVsZXRlLW5vZGVcIiwge1xuXHRcdFx0bm9kZUlkOiBub2RlLmF0dHJpYnV0ZXNbXCJkYXRhLW5vZGUtaWRcIl0udmFsdWVcblx0XHR9KTtcblx0fSk7XG5cdHNlbGVjdGVkTm9kZXMubGVuZ3RoID0gMDtcbn07XG5cbnZhciBkZWxldGVOb2RlID0gZnVuY3Rpb24oZSkge1xuXHQvLyBUT0RPOiBjbGVhciBhbGwgcmVmcyB0byBub2RlLlxuXHR2YXIgbm9kZSA9IG5vZGVzLmdldChlLmRldGFpbC5ub2RlSWQpO1xuXHRub2RlLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQobm9kZSk7XG5cdG5vZGVzLmRlbGV0ZShub2RlLmlkKTtcbn07XG5cbnZhciBhcnJvd1ByZXNzZWQgPSBmdW5jdGlvbihlKSB7XG5cdG1vdmVTZWxlY3RlZE5vZGVzKGUsIHRydWUpO1xufTtcblxudmFyIGNhbmNlbFNlbGVjdGlvbnMgPSBmdW5jdGlvbigpIHtcblx0Ly8gVE9ETzogY2xlYXIgZXZlbnQgbGlzdGVuZXJzIGZyb20gY3VycmVudCBhY3RpdmUgbm9kZS5cblx0c2VsZWN0ZWROb2Rlcy5mb3JFYWNoKGZ1bmN0aW9uKG4pIHtcblx0XHRuLmNsYXNzTGlzdC5yZW1vdmUoXCJhY3RpdmVcIik7XHRcdFxuXHR9KTtcblxuXHRzZWxlY3RlZE5vZGVzLmxlbmd0aCA9IDA7XG59O1xuXG52YXIgZWRpdE5vZGVUaXRsZSA9IGZ1bmN0aW9uKGUpIHtcblx0dmFyIG5vZGUgPSBub2Rlcy5nZXQoZS5kZXRhaWwubm9kZUlkKSxcblx0XHR0ZXh0Qm94ID0gbm9kZS5xdWVyeVNlbGVjdG9yKFwiLm5vZGUtdGl0bGVcIik7XG5cblx0JCh2aWV3KS5lbWl0KFwidWktZWRpdC1tb2RlXCIsIHtcblx0XHRub2RlSWQ6IGUuZGV0YWlsLm5vZGVJZCxcblx0XHRwb3NpdGlvbjogeHkobm9kZSksXG5cdFx0Y3VycmVudFZhbHVlOiB0ZXh0Qm94LmlubmVyVGV4dFxuXHR9KTtcblxuXHR0ZXh0Qm94LmlubmVyVGV4dCA9IFwiXCI7XG59O1xuXG52YXIgdXBkYXRlTm9kZVRpdGxlID0gZnVuY3Rpb24oZSkge1xuXHRub2Rlcy5nZXQoZS5kZXRhaWwubm9kZUlkKVxuXHRcdC5xdWVyeVNlbGVjdG9yKFwiLm5vZGUtdGl0bGVcIilcblx0XHQuaW5uZXJUZXh0ID0gZS5kZXRhaWwubmV3VmFsdWU7XG59O1xuXG52YXIgZWRpdE5vZGVDYW5jZWxsZWQgPSBmdW5jdGlvbihlKSB7XG5cdG5vZGVzLmdldChlLmRldGFpbC5ub2RlSWQpXG5cdFx0LnF1ZXJ5U2VsZWN0b3IoXCIubm9kZS10aXRsZVwiKVxuXHRcdC5pbm5lclRleHQgPSBlLmRldGFpbC52YWx1ZUJlZm9yZUVkaXQ7XG59O1xuXG52YXIgc2V0QWN0aXZlTm9kZSA9IGZ1bmN0aW9uKG5vZGUpIHtcblx0Y2FuY2VsU2VsZWN0aW9ucygpO1xuXHRzZWxlY3RlZE5vZGVzLnB1c2gobm9kZSk7XG5cdG5vZGUuY2xhc3NMaXN0LmFkZChcImFjdGl2ZVwiKTtcbn07XG5cbnZhciBzZWxlY3ROb2RlID0gZnVuY3Rpb24oZSkge1xuXHR2YXIgbm9kZSA9IG5vZGVzLmdldChlLmRldGFpbC5ub2RlSWQpO1xuXG5cdGlmIChlLmRldGFpbC5zaGlmdEtleSlcblx0XHRleHBhbmRTZWxlY3Rpb24obm9kZSk7XG5cdGVsc2Vcblx0XHRzZXRBY3RpdmVOb2RlKG5vZGUpO1xufTtcblxudmFyIHNlbGVjdFNvY2tldCA9IGZ1bmN0aW9uKGUpIHtcblx0c2VsZWN0ZWRTb2NrZXQgPSBlLmRldGFpbC5zb2NrZXQ7XG5cdHNlbGVjdGVkU29ja2V0LmNsYXNzTGlzdC5hZGQoXCJhY3RpdmVcIik7XG59O1xuXG52YXIgZGVzZWxlY3RTb2NrZXQgPSBmdW5jdGlvbihlKSB7XG5cdHNlbGVjdGVkU29ja2V0ID0gbnVsbDtcblx0ZS5kZXRhaWwuc29ja2V0LmNsYXNzTGlzdC5yZW1vdmUoXCJhY3RpdmVcIik7XG59O1xuXG52YXIgZXhwYW5kU2VsZWN0aW9uID0gZnVuY3Rpb24obm9kZSkge1xuXHRzZWxlY3RlZE5vZGVzLnB1c2gobm9kZSk7XG5cdG5vZGUuY2xhc3NMaXN0LmFkZChcImFjdGl2ZVwiKTtcbn07XG5cbnZhciBtb3VzZURyYWcgPSBmdW5jdGlvbihlKSB7XG5cdGlmIChub3RoaW5nSXNTZWxlY3RlZCgpKXtcblx0XHQvLyBiZWdpbi9leHBhbmQgc2VsZWN0aW9uXG5cdFx0cmV0dXJuO1xuXHR9XG5cdFxuXHRpZiAoc2VsZWN0ZWRTb2NrZXQpIHtcblx0XHR2YXIgdG8gPSB7XG5cdFx0XHR4OiBlLmRldGFpbC5tb3VzZVBvc2l0aW9uLngsXG5cdFx0XHR5OiBlLmRldGFpbC5tb3VzZVBvc2l0aW9uLnksXG5cdFx0fTtcblxuXHRcdGlmICghZXZvbHZpbmdSZWxhdGlvbnNoaXApIHtcblx0XHRcdC8vIFVzZXIgaW5pdGlhdGVkIGNyZWF0aW9uIG9mIG5ldyByZWxhdGlvbnNoaXBcblx0XHRcdHZhciBmcm9tID0gcGF0aEZpbmRlci5nZXRQb2ludE9mQ29ubmVjdGlvbihzZWxlY3RlZFNvY2tldCk7XG5cdFx0XHR2aWV3LmFwcGVuZENoaWxkKHN2Z01ha2VyLmNyZWF0ZVN2Z1JlbGF0aW9uc2hpcChmcm9tLCB0bykpO1xuXHRcdFx0ZXZvbHZpbmdSZWxhdGlvbnNoaXAgPSB2aWV3Lmxhc3RDaGlsZC5xdWVyeVNlbGVjdG9yKFwiLmV2b2x2aW5nLmxpbmVcIik7XG5cdFx0fVxuXHRcdGVsc2Uge1xuXHRcdFx0dXBkYXRlRXZvbHZpbmdpbmdSZWxhdGlvbnNoaXAoZXZvbHZpbmdSZWxhdGlvbnNoaXAsIHNlbGVjdGVkU29ja2V0LCB0byk7XG5cdFx0fVxuXHR9XG5cdGVsc2Uge1xuXHRcdG1vdmVTZWxlY3RlZE5vZGVzKGUsIGZhbHNlKTtcdFx0XG5cdH1cbn07XG5cbnZhciBtb3VzZU92ZXJOb2RlID0gZnVuY3Rpb24oZSkge1xuXHR2YXIgbm9kZSA9IG5vZGVzLmdldChlLmRldGFpbC5ub2RlSWQpO1xufTtcblxudmFyIG1vdmVTZWxlY3RlZE5vZGVzID0gZnVuY3Rpb24oZSwgZW1pdEV2ZW50KSB7XG5cdHZhciBkZWx0YSA9IGUuZGV0YWlsLmRlbHRhO1xuXG5cdHNlbGVjdGVkTm9kZXMuZm9yRWFjaChmdW5jdGlvbihub2RlKSB7XG5cdFx0dmFyIG5vZGVQb3NpdGlvbiA9IHh5KG5vZGUpO1xuXG5cdFx0bm9kZS5zZXRBdHRyaWJ1dGUoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoXCIgK1xuXHRcdFx0KG5vZGVQb3NpdGlvbi54ICs9IGRlbHRhLngpICsgXCIsIFwiICtcblx0XHRcdChub2RlUG9zaXRpb24ueSArPSBkZWx0YS55KSArIFwiKVwiKTtcblxuXHRcdGlmIChlbWl0RXZlbnQpIHtcblx0XHRcdCQodmlldykuZW1pdChcInZpZXcvbm9kZS1tb3ZlZFwiLCB7XG5cdFx0XHRcdG5vZGVJZDogbm9kZS5hdHRyaWJ1dGVzW1wiZGF0YS1ub2RlLWlkXCJdLnZhbHVlLFxuXHRcdFx0XHRwb3NpdGlvbjogeHkobm9kZSlcblx0XHRcdH0pO1xuXHRcdH1cblx0fSk7XG59O1xuXG52YXIgdXBkYXRlRXZvbHZpbmdpbmdSZWxhdGlvbnNoaXAgPSBmdW5jdGlvbihwYXRoLCBmcm9tU29ja2V0LCB0bykge1xuXHRwYXRoLnNldEF0dHJpYnV0ZShcImRcIiwgcGF0aEZpbmRlci5wYXRoRGVzY3JpcHRpb25HZW5lcmF0b3IoZnJvbVNvY2tldCwgdG8pKTtcbn07XG5cbnZhciBkcmFnRW5kZWQgPSBmdW5jdGlvbigpIHtcblx0c2VsZWN0ZWROb2Rlcy5mb3JFYWNoKGZ1bmN0aW9uKG5vZGUpIHtcblx0XHQkKHZpZXcpLmVtaXQoXCJ2aWV3L25vZGUtbW92ZWRcIiwge1xuXHRcdFx0bm9kZUlkOiBub2RlLmF0dHJpYnV0ZXNbXCJkYXRhLW5vZGUtaWRcIl0udmFsdWUsXG5cdFx0XHRwb3NpdGlvbjogeHkobm9kZSlcblx0XHR9KTtcblx0fSk7XG5cblx0aWYgKHNlbGVjdGVkU29ja2V0KSB7XG5cdFx0c2VsZWN0ZWRTb2NrZXQuY2xhc3NMaXN0LnJlbW92ZShcImFjdGl2ZVwiKTtcblx0XHRzZWxlY3RlZFNvY2tldCA9IG51bGw7XG5cdH1cbn07XG5cbmZ1bmN0aW9uIG5vdGhpbmdJc1NlbGVjdGVkKCkge1xuXHRyZXR1cm4gc2VsZWN0ZWROb2Rlcy5sZW5ndGggPT09IDAgJiYgc2VsZWN0ZWRTb2NrZXQgPT09IG51bGw7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oZWwpIHtcblx0dmlldyA9IGVsO1xuXHQkKGVsKS5vbihcIngtbm9kZS1hZGRlZFwiLCBhZGROb2RlKTtcblx0JChlbCkub24oXCJ4LW5vZGUtY3JlYXRlZFwiLCBhZGROb2RlKTtcblx0JChlbCkub24oXCJ4LW5vZGUtZGVsZXRlZFwiLCBkZWxldGVOb2RlKTtcblx0JChlbCkub24oXCJtb3VzZS1jcmVhdGUtbm9kZVwiLCBjcmVhdGVOb2RlKTtcblx0JChlbCkub24oXCJtb3VzZS1jYW5jZWwtc2VsZWN0aW9uc1wiLCBjYW5jZWxTZWxlY3Rpb25zKTtcblx0JChlbCkub24oXCJtb3VzZS9kcmFnXCIsIG1vdXNlRHJhZyk7XG5cdCQoZWwpLm9uKFwibW91c2UvZHJhZy1lbmRcIiwgZHJhZ0VuZGVkKTtcblx0JChlbCkub24oXCJrZXlib2FyZC1pbnB1dC9zdWJtaXRcIiwgdXBkYXRlTm9kZVRpdGxlKTtcblx0JChlbCkub24oXCJrZXlib2FyZC1pbnB1dC9jYW5jZWxsZWRcIiwgZWRpdE5vZGVDYW5jZWxsZWQpO1xuXHQkKGVsKS5vbihcImtleWJvYXJkLWNvbW1hbmQvZGVsZXRlXCIsIGRlbGV0ZVByZXNzZWQpO1xuXHQkKGVsKS5vbihcImtleWJvYXJkLWNvbW1hbmQvdXBcIiwgYXJyb3dQcmVzc2VkKTtcblx0JChlbCkub24oXCJrZXlib2FyZC1jb21tYW5kL3JpZ2h0XCIsIGFycm93UHJlc3NlZCk7XG5cdCQoZWwpLm9uKFwia2V5Ym9hcmQtY29tbWFuZC9kb3duXCIsIGFycm93UHJlc3NlZCk7XG5cdCQoZWwpLm9uKFwia2V5Ym9hcmQtY29tbWFuZC9sZWZ0XCIsIGFycm93UHJlc3NlZCk7XG5cdCQoZWwpLm9uKFwibm9kZS9zZWxlY3RlZFwiLCBzZWxlY3ROb2RlKTtcblx0JChlbCkub24oXCJub2RlL21vdXNlLW92ZXJcIiwgbW91c2VPdmVyTm9kZSk7XG5cdCQoZWwpLm9uKFwibm9kZS9zb2NrZXQtc2VsZWN0ZWRcIiwgc2VsZWN0U29ja2V0KTtcblx0JChlbCkub24oXCJub2RlL3NvY2tldC1kZXNlbGVjdGVkXCIsIGRlc2VsZWN0U29ja2V0KTtcblx0JChlbCkub24oXCJub2RlL2JlZ2luLWVkaXRcIiwgZWRpdE5vZGVUaXRsZSk7XG59OyIsInZhciAkID0gcmVxdWlyZSgnLi91dGlsJyksXG5cdHh5ID0gcmVxdWlyZSgnLi94eScpO1xuXG5mdW5jdGlvbiBLZXlib2FyZElucHV0KGVsLCBpbnB1dFNlbGVjdG9yKSB7XG5cblx0dmFyIHVpID0gZWwsXG5cdFx0aW5wdXRFbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoaW5wdXRTZWxlY3RvciksXG5cdFx0dmFsdWVCZWZvcmVFZGl0ID0gbnVsbCxcblx0XHRub2RlSWQgPSBudWxsO1xuXG5cdHRoaXMuX2Fzc3VtZVRoZVBvc2l0aW9uID0gZnVuY3Rpb24oZSkge1xuXHRcdG5vZGVJZCA9IGUuZGV0YWlsLm5vZGVJZDtcblx0XHR2YWx1ZUJlZm9yZUVkaXQgPSBlLmRldGFpbC5jdXJyZW50VmFsdWU7XG5cdFx0aW5wdXRFbC52YWx1ZSA9IGUuZGV0YWlsLmN1cnJlbnRWYWx1ZTtcblxuXHRcdHZhciBwb3NpdGlvbiA9IGUuZGV0YWlsLnBvc2l0aW9uO1xuXHRcdGlucHV0RWwuc3R5bGUubGVmdCA9IChwb3NpdGlvbi54ICsgMikgKyBcInB4XCI7XG5cdFx0aW5wdXRFbC5zdHlsZS50b3AgPSAocG9zaXRpb24ueSArIDE4KSArIFwicHhcIjtcblxuXHRcdGlucHV0RWwuY2xhc3NMaXN0LnJlbW92ZShcImhpZGVcIik7XG5cdFx0aW5wdXRFbC5mb2N1cygpO1x0XHRcblx0fTtcblxuXHR0aGlzLl9rZXlkb3duID0gZnVuY3Rpb24oZSkge1xuXHRcdGlmICghbm9kZUlkKVxuXHRcdFx0cmV0dXJuO1xuXG5cdFx0aWYoZS5rZXlDb2RlID09IDEzKSB7IC8vIHJldHVyblxuXHRcdFx0JCh1aSkuZW1pdChcImtleWJvYXJkLWlucHV0L3N1Ym1pdFwiLCB7IFxuXHRcdFx0XHRub2RlSWQ6IG5vZGVJZCxcblx0XHRcdFx0bmV3VmFsdWU6IGlucHV0RWwudmFsdWUgXG5cdFx0XHR9KTtcblx0XHRcdFxuXHRcdFx0aW5wdXRFbC5jbGFzc0xpc3QuYWRkKFwiaGlkZVwiKTtcblx0XHRcdG5vZGVJZCA9IG51bGw7XG5cdFx0fVxuXHRcdGVsc2UgaWYoZS5rZXlDb2RlID09IDI3KSB7IC8vIGVzY1xuXHRcdFx0JCh1aSkuZW1pdChcImtleWJvYXJkLWlucHV0L2NhbmNlbGxlZFwiLCB7XG5cdFx0XHRcdG5vZGVJZDogbm9kZUlkLFxuXHRcdFx0XHR2YWx1ZUJlZm9yZUVkaXQ6IHZhbHVlQmVmb3JlRWRpdFxuXHRcdFx0fSk7XG5cblx0XHRcdG5vZGVJZCA9IG51bGw7XG5cdFx0XHRpbnB1dEVsLmNsYXNzTGlzdC5hZGQoXCJoaWRlXCIpO1xuXHRcdH1cblxuXHRcdGUuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdH07XG5cblx0dGhpcy5fYmx1ciA9IGZ1bmN0aW9uKGUpIHtcblx0XHRpbnB1dEVsLmNsYXNzTGlzdC5hZGQoXCJoaWRlXCIpO1xuXHR9O1xuXG5cdCQodWkpLm9uKFwidWktZWRpdC1tb2RlXCIsIHRoaXMuX2Fzc3VtZVRoZVBvc2l0aW9uKSxcblx0JChpbnB1dEVsKS5vbihcImtleWRvd25cIiwgdGhpcy5fa2V5ZG93biksXG5cdCQoaW5wdXRFbCkub24oXCJibHVyXCIsIHRoaXMuX2JsdXIpXG59XG5cblxubW9kdWxlLmV4cG9ydHMgPSBLZXlib2FyZElucHV0OyIsIi8qKlxuKiBUaGUgS2V5Ym9hcmQgU2hvcnRjdXRzLiBOb3Qgc3VyZSB3aGF0IGlzIGdvb2QgZm9yLiBJIGp1c3QgbGlrZWQgdGhlIGlkZWEgb2ZcbiogaGF2aW5nIHNlcGVyYXRlIG1vZHVsZXMgbGlzdGVuaW5nIGZvciBrZXlzdHJva2VzIGFuZCBlbWl0IG1vcmUgZG9tYWluIHNwZWNpZmljXG4qIGV2ZW50cy5cbioqL1xuXG52YXIgJCA9IHJlcXVpcmUoJy4vdXRpbCcpLFxuXHR2aWV3ID0gbnVsbDtcblxudmFyIGluaXQgPSBmdW5jdGlvbihlbCkge1xuXHR2aWV3ID0gZWw7XG5cblx0JChkb2N1bWVudCkub24oXCJrZXlkb3duXCIsIGZ1bmN0aW9uKGUpIHtcblx0XHRzd2l0Y2goZS5rZXlDb2RlKSB7XG5cdFx0XHRjYXNlIDQ2OlxuXHRcdFx0XHQkKHZpZXcpLmVtaXQoXCJrZXlib2FyZC1jb21tYW5kL2RlbGV0ZVwiKTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIDM3OlxuXHRcdFx0XHQkKHZpZXcpLmVtaXQoXCJrZXlib2FyZC1jb21tYW5kL2xlZnRcIiwge1xuXHRcdFx0XHRcdGRlbHRhOiAge1xuXHRcdFx0XHRcdFx0eDogLTQsXG5cdFx0XHRcdFx0XHR5OiAwXG5cdFx0XHRcdFx0fX1cblx0XHRcdFx0KTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIDM4OlxuXHRcdFx0XHQkKHZpZXcpLmVtaXQoXCJrZXlib2FyZC1jb21tYW5kL3VwXCIsIHtcblx0XHRcdFx0XHRkZWx0YTogIHtcblx0XHRcdFx0XHRcdHg6IDAsXG5cdFx0XHRcdFx0XHR5OiAtNFxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSAzOTpcblx0XHRcdFx0JCh2aWV3KS5lbWl0KFwia2V5Ym9hcmQtY29tbWFuZC9yaWdodFwiLCB7XG5cdFx0XHRcdFx0ZGVsdGE6ICB7XG5cdFx0XHRcdFx0XHR4OiA0LFxuXHRcdFx0XHRcdFx0eTogMFxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSA0MDpcblx0XHRcdFx0JCh2aWV3KS5lbWl0KFwia2V5Ym9hcmQtY29tbWFuZC9kb3duXCIsIHtcblx0XHRcdFx0XHRkZWx0YTogIHtcblx0XHRcdFx0XHRcdHg6IDAsXG5cdFx0XHRcdFx0XHR5OiA0XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0fVxuXHR9KTtcblxuXHQkKGRvY3VtZW50KS5vbihcImtleXVwXCIsIGZ1bmN0aW9uKGUpIHtcblx0XHRzd2l0Y2goZS5rZXlDb2RlKSB7XG5cdFx0XHRjYXNlIDE4OlxuXHRcdFx0XHQkKHZpZXcpLmVtaXQoXCJrZXlib2FyZC1jb21tYW5kL2FsdC1yZWxlYXNlZFwiKTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0fVxuXHR9KTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXHRpbml0OiBpbml0XG59OyIsIlxudmFyIHJlcXVlc3QgPSByZXF1aXJlKCdzdXBlcmFnZW50JyksXG5cdG1vZGVsID0gcmVxdWlyZSgnLi9tb2RlbCcpLFxuXHRkb21XaGlzcGVyZXIgPSByZXF1aXJlKCcuL2RvbS13aGlzcGVyZXInKSxcblx0bW91c2VUcmFwcGVyID0gcmVxdWlyZSgnLi9tb3VzZS10cmFwcGVyJyksXG5cdGFtYmFzc2Fkb3IgPSByZXF1aXJlKCcuL2FtYmFzc2Fkb3InKSxcblx0S2V5Ym9hcmRJbnB1dCA9IHJlcXVpcmUoJy4va2V5Ym9hcmQtaW5wdXQnKTtcblx0XG52YXIgdWkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdbZGF0YS1jYXJ0YV0nKTtcblxuZG9tV2hpc3BlcmVyKHVpKTtcbm1vdXNlVHJhcHBlcih1aSk7XG5hbWJhc3NhZG9yKHVpKTtcbktleWJvYXJkSW5wdXQodWksICdbZGF0YS1pbnB1dC1ib3hdJylcbnJlcXVpcmUoJy4va2V5Ym9hcmQtc2hvcnRjdXRzJykuaW5pdCh1aSk7XG5cbnJlcXVlc3QuZ2V0KCdmYWtlL2RiJywgZnVuY3Rpb24ocmVzKSB7XG5cdHZhciBkYiA9IEpTT04ucGFyc2UocmVzLnRleHQpO1xuXHRtb2RlbC5pbml0KGRiLCB1aSk7XG59KTsiLCIvKipcbiogVGhlIE1vZGVsIGhvbGRzIHRoZSBtYXN0ZXIgZGF0YSBmb3IgdGhlIGNsaWVudCBzaWRlLiBJdCBsaXN0ZW5zIHRvIFVJIGV2ZW50c1xuKiBhbmQgZW1pdHMgZXZlbnRzIGFmdGVyIHVwZGF0aW5nIHRoZSBtb2RlbC4gVGhlIGV2ZW50cyBlbWl0dGVkIHRyaWdnZXJzIHRoZSBcbiogQW1iYXNzYWRvciB0byByZXBvcnQgYmFjayB0byB0aGUgc2VydmVyLlxuKiBcbiogSXQgc2hvdWxkIGFsc28gbGlzdGVuIGZvciBjaGFuZ2VzIGZyb20gdGhlIHNlcnZlciAodmlhIHRoZSBBbWJhc3NhZG9yKSBpbiBhIFxuKiBtdWx0aSB1c2VyIHNjZW5hcmlvLlxuKiovXG5cbnJlcXVpcmUoJ2VzNi1jb2xsZWN0aW9ucycpO1xudmFyICQgPSByZXF1aXJlKCcuL3V0aWwuanMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpIHtcblx0dmFyIG5vZGVzID0gbmV3IE1hcCgpLFxuXHRcdHZpZXcgPSBudWxsO1xuXG5cdHZhciBjcmVhdGVOb2RlID0gZnVuY3Rpb24oZSkge1xuXHRcdHZhciBub2RlID0gZS5kZXRhaWwubm9kZTtcblxuXHRcdG5vZGVzLnNldChub2RlLmlkLCBub2RlKTtcblx0XHQkKHZpZXcpLmVtaXQoXCJ4LW5vZGUtY3JlYXRlZFwiLCB7XG5cdFx0XHRub2RlOiBub2RlXHRcblx0XHR9KTtcblx0fTtcblxuXHR2YXIgcmVtb3ZlTm9kZSA9IGZ1bmN0aW9uKGUpIHtcblx0XHRub2Rlcy5kZWxldGUoZS5kZXRhaWwubm9kZUlkKTtcblx0XHQkKHZpZXcpLmVtaXQoXCJ4LW5vZGUtZGVsZXRlZFwiLCB7XG5cdFx0XHRub2RlSWQ6IGUuZGV0YWlsLm5vZGVJZFxuXHRcdH0pO1xuXHR9O1xuXG5cdHZhciB1cGRhdGVOb2RlUG9zaXRpb24gPSBmdW5jdGlvbihlKSB7XG5cdFx0dmFyIG5vZGUgPSBub2Rlcy5nZXQoZS5kZXRhaWwubm9kZUlkKTtcblx0XHRub2RlLnBvc2l0aW9uID0gZS5kZXRhaWwucG9zaXRpb247XG5cblx0XHQkKHZpZXcpLmVtaXQoXCJ4LW5vZGUtdXBkYXRlZFwiLCB7XG5cdFx0XHRub2RlSWQ6IG5vZGUuaWQsXG5cdFx0XHRwYXRjaDogW1xuXHRcdFx0XHR7XG5cdFx0XHRcdFx0b3A6IFwicmVwbGFjZVwiLFxuXHRcdFx0XHRcdHBhdGg6IFwiL3Bvc2l0aW9uXCIsXG5cdFx0XHRcdFx0dmFsdWU6IG5vZGUucG9zaXRpb25cblx0XHRcdFx0fVxuXHRcdFx0XVxuXHRcdH0pO1xuXHR9O1xuXG5cdHZhciB1cGRhdGVOb2RlVGV4dCA9IGZ1bmN0aW9uKGUpIHtcblx0XHR2YXIgbm9kZSA9IG5vZGVzLmdldChlLmRldGFpbC5ub2RlSWQpO1xuXHRcdG5vZGUudGV4dCA9IGUuZGV0YWlsLm5ld1ZhbHVlO1xuXG5cdFx0JCh2aWV3KS5lbWl0KFwieC1ub2RlLXVwZGF0ZWRcIiwge1xuXHRcdFx0bm9kZUlkOiBub2RlLmlkLFxuXHRcdFx0cGF0Y2g6IFtcblx0XHRcdFx0e1xuXHRcdFx0XHRcdG9wOiBcInJlcGxhY2VcIixcblx0XHRcdFx0XHRwYXRoOiBcIi90ZXh0XCIsXG5cdFx0XHRcdFx0dmFsdWU6IG5vZGUudGV4dFxuXHRcdFx0XHR9XG5cdFx0XHRdXG5cdFx0fSk7XG5cdH07XG5cblx0cmV0dXJuIHtcblx0XHRpbml0OiBmdW5jdGlvbihkYiwgZWwpIHtcblx0XHRcdHZpZXcgPSBlbDtcblxuXHRcdFx0ZGIubm9kZXMuZm9yRWFjaChmdW5jdGlvbihub2RlKSB7XG5cdFx0XHRcdG5vZGVzLnNldChub2RlLmlkLCBub2RlKTtcblx0XHRcdFx0JChlbCkuZW1pdChcIngtbm9kZS1hZGRlZFwiLCB7XG5cdFx0XHRcdFx0bm9kZTogbm9kZVxuXHRcdFx0XHR9KTtcblx0XHRcdH0pO1xuXG5cdFx0XHQkKHZpZXcpLm9uKFwidWktY3JlYXRlLW5vZGVcIiwgY3JlYXRlTm9kZSk7XG5cdFx0XHQkKHZpZXcpLm9uKFwidWktZGVsZXRlLW5vZGVcIiwgcmVtb3ZlTm9kZSk7XG5cdFx0XHQkKHZpZXcpLm9uKFwidmlldy9ub2RlLW1vdmVkXCIsIHVwZGF0ZU5vZGVQb3NpdGlvbik7XG5cdFx0XHQkKHZpZXcpLm9uKFwia2V5Ym9hcmQtaW5wdXQvc3VibWl0XCIsIHVwZGF0ZU5vZGVUZXh0KTtcblx0XHR9XG5cdH07XG59KCk7IiwiLyoqXG4qIFRoZSBNb3VzZSBUcmFwcGVyIGxpc3RlbnMgdG8gbW91c2UgZXZlbnRzIGZyb20gdGhlIGNhbnZhcyBhbmQgdHJpZXMgdG8gZmlndXJlIG91dCB0aGUgdXNlcnNcbiogaW50ZW50IGFuZCBlbWl0cyBtb3JlIHNwZWNpZmljIGV2ZW50cyB0aGF0IG90aGVyIG1vZHVsZXMgYWN0cyBvbi5cbiovXG5cbnZhciAkID0gcmVxdWlyZSgnLi91dGlsJyksXG5cdHh5ID0gcmVxdWlyZSgnLi94eScpLFxuXHR2aWV3ID0gbnVsbCxcblx0bW91c2VJc0Rvd24gPSBmYWxzZSxcblx0ZHJhZ2dpbmcgPSBmYWxzZSxcblx0bGFzdE1vdXNlUG9zaXRpb24gPSBudWxsO1xuXG52YXIgbW91c2VEb3duID0gZnVuY3Rpb24oZSkge1xuXHRtb3VzZUlzRG93biA9IHRydWU7XG5cdGxhc3RNb3VzZVBvc2l0aW9uID0geHkoZSk7XG5cblx0aWYgKHRhcmdldElzQ2FudmFzKGUpKSB7XG5cdFx0JCh2aWV3KS5lbWl0KFwibW91c2UtY2FuY2VsLXNlbGVjdGlvbnNcIik7XHRcdFxuXHR9XG59O1xuXG52YXIgbW91c2VNb3ZlID0gZnVuY3Rpb24oZSkge1xuXHRpZiAobW91c2VJc0Rvd24gfHwgZS5hbHRLZXkpIHtcblx0XHRkcmFnZ2luZyA9IHRydWU7XG5cblx0XHQvLyBJZiB0aGUgdXNlciBhbHQtZHJhZ3MgKGEuay5hLiBmbG9hdHMpIHdlIG5lZWQgdG8gc2V0IGxhc3RNb3VzZVBvc2l0aW9uXG5cdFx0Ly8gYXQgdGhlIGJlZ2lubmluZyBvZiB0aGF0IGFjdGlvbi5cblx0XHRpZiAoIWxhc3RNb3VzZVBvc2l0aW9uKVxuXHRcdFx0bGFzdE1vdXNlUG9zaXRpb24gPSB4eShlKTtcblxuXHRcdHZhciBkZWx0YSA9IHtcblx0XHRcdHg6IGUuY2xpZW50WCAtIGxhc3RNb3VzZVBvc2l0aW9uLngsIFxuXHRcdFx0eTogZS5jbGllbnRZIC0gbGFzdE1vdXNlUG9zaXRpb24ueVxuXHRcdH07XG5cblx0XHQkKHZpZXcpLmVtaXQoXCJtb3VzZS9kcmFnXCIsIHtcblx0XHRcdGRlbHRhOiBkZWx0YSxcblx0XHRcdG1vdXNlUG9zaXRpb246IHh5KGUpXG5cdFx0fSk7XG5cblx0XHRsYXN0TW91c2VQb3NpdGlvbiA9IHh5KGUpO1xuXHR9XG59O1xuXG52YXIgbW91c2VVcCA9IGZ1bmN0aW9uKGUpIHtcblx0bW91c2VJc0Rvd24gPSBmYWxzZTtcblx0bGFzdE1vdXNlUG9zaXRpb24gPSBudWxsO1xuXG5cdGlmIChkcmFnZ2luZykge1xuXHRcdCQodmlldykuZW1pdChcIm1vdXNlL2RyYWctZW5kXCIsIHt9KTtcblx0XHRkcmFnZ2luZyA9IGZhbHNlO1xuXHR9XG59O1xuXG52YXIgZG91YmxlQ2xpY2sgPSBmdW5jdGlvbihlKSB7XG5cdGlmICh0YXJnZXRJc0NhbnZhcyhlKSkge1xuXHRcdCQodmlldykuZW1pdChcIm1vdXNlLWNyZWF0ZS1ub2RlXCIsIHtcblx0XHRcdHBvc2l0aW9uOiB4eShlKVxuXHRcdH0pO1xuXHR9XG59O1xuXG5mdW5jdGlvbiB0YXJnZXRJc0NhbnZhcyhlKSB7XG5cdHJldHVybiBlLnRhcmdldC5pZCA9PT0gXCJjYW52YXNcIjtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihlbCkge1xuXHR2aWV3ID0gZWw7XG5cblx0JChlbCkub24oXCJtb3VzZWRvd25cIiwgbW91c2VEb3duKTtcblx0JChlbCkub24oXCJtb3VzZXVwXCIsIG1vdXNlVXApO1xuXHQkKGVsKS5vbihcImRibGNsaWNrXCIsIGRvdWJsZUNsaWNrKTtcblx0JChlbCkub24oXCJtb3VzZW1vdmVcIiwgbW91c2VNb3ZlKTtcblx0JChlbCkub24oXCJrZXlib2FyZC1jb21tYW5kL2FsdC1yZWxlYXNlZFwiLCBmdW5jdGlvbigpIHsgaWYgKGRyYWdnaW5nKSBtb3VzZVVwKCk7IH0gKTtcbn07IiwidmFyICQgPSByZXF1aXJlKFwiLi91dGlsXCIpO1xuXG52YXIgaW5pdCA9IGZ1bmN0aW9uKG5vZGVFbGVtZW50LCBub2RlSWQpIHtcblxuXHQkKG5vZGVFbGVtZW50KS5vbihcIm1vdXNlZG93blwiLCBmdW5jdGlvbihlKSB7XG5cdFx0JChub2RlRWxlbWVudCkuZW1pdChcIm5vZGUvc2VsZWN0ZWRcIiwge1xuXHRcdFx0bm9kZUlkOiBub2RlSWQsXG5cdFx0XHRzaGlmdEtleTogZS5zaGlmdEtleVxuXHRcdH0pO1xuXHR9KTtcblxuXHQkKG5vZGVFbGVtZW50KS5vbihcImRibGNsaWNrXCIsIGZ1bmN0aW9uKGUpIHtcblx0XHQkKG5vZGVFbGVtZW50KS5lbWl0KFwibm9kZS9iZWdpbi1lZGl0XCIsIHtcblx0XHRcdG5vZGVJZDogbm9kZUlkXG5cdFx0fSk7XG5cdH0pO1xuXG5cdCQobm9kZUVsZW1lbnQucXVlcnlTZWxlY3RvcihcIi5ub2RlXCIpKS5vbihcIm1vdXNlb3ZlclwiLCBmdW5jdGlvbihlKSB7XG5cdFx0JChub2RlRWxlbWVudCkuZW1pdChcIm5vZGUvbW91c2Utb3ZlclwiLCB7XG5cdFx0XHRub2RlSWQ6IG5vZGVJZFxuXHRcdH0pO1xuXHR9KTtcblxuXHR2YXIgc29ja2V0cyA9IG5vZGVFbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuc29ja2V0XCIpO1xuXG5cdGZvcih2YXIgaSA9IDA7IGkgPCBzb2NrZXRzLmxlbmd0aDsgaSsrKSB7XG5cdFx0JChzb2NrZXRzW2ldKS5vbihcIm1vdXNlZG93blwiLCBmdW5jdGlvbihlKSB7XG5cdFx0XHQkKG5vZGVFbGVtZW50KS5lbWl0KFwibm9kZS9zb2NrZXQtc2VsZWN0ZWRcIiwge1xuXHRcdFx0XHRzb2NrZXQ6IGUudGFyZ2V0XG5cdFx0XHR9KTtcblx0XHR9KTtcblxuXHRcdCQoc29ja2V0c1tpXSkub24oXCJtb3VzZXVwXCIsIGZ1bmN0aW9uKGUpIHtcblx0XHRcdCQobm9kZUVsZW1lbnQpLmVtaXQoXCJub2RlL3NvY2tldC1kZXNlbGVjdGVkXCIsIHtcblx0XHRcdFx0c29ja2V0OiBlLnRhcmdldFxuXHRcdFx0fSk7XG5cdFx0fSk7XG5cdH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXHRpbml0OiBpbml0XG59OyIsImZ1bmN0aW9uIGRJc0ZvckRlc2NyaXB0aW9uKGZyb21Tb2NrZXQsIHRvKSB7XG5cbiAgICB2YXIgZCA9IFtcbiAgICAgICAgLy8gbSA9IE1vdmVUbyByZWxhdGl2ZSB0byBncm91cFxuICAgICAgICBcIm1cIiwgMCwgMCxcbiAgICBdO1xuXG4gICAgdmFyIGFzc3VtZWRTdGFydGluZ1BvaW50T2ZQYXRoID0gX2dldENvbm5lY3Rpb25Qb2ludChmcm9tU29ja2V0KSxcbiAgICAgICAgZGVsdGEgPSB7XG4gICAgICAgICAgICB4OiB0by54IC0gYXNzdW1lZFN0YXJ0aW5nUG9pbnRPZlBhdGgueCxcbiAgICAgICAgICAgIHk6IHRvLnkgLSBhc3N1bWVkU3RhcnRpbmdQb2ludE9mUGF0aC55XG4gICAgICAgIH07XG5cbiAgICB2YXIgc29ja2V0RGlyZWN0aW9uID0gX2dldFNvY2tldERpcmVjdGlvbihmcm9tU29ja2V0KTtcblxuICAgIGlmICgvdXB8ZG93bi8udGVzdChzb2NrZXREaXJlY3Rpb24pKSB7XG4gICAgICAgIGQucHVzaChcInZcIiArIGRlbHRhLnkpO1xuICAgICAgICBkLnB1c2goXCJoXCIgKyBkZWx0YS54KTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGQucHVzaChcImhcIiArIGRlbHRhLngpO1xuICAgICAgICBkLnB1c2goXCJ2XCIgKyBkZWx0YS55KTtcbiAgICB9XG5cblxuICAgIHJldHVybiBkLmpvaW4oXCIgXCIpO1xufVxuXG5mdW5jdGlvbiBfZ2V0Q29ubmVjdGlvblBvaW50KHNvY2tldCkge1xuXG4gICAgdmFyIG5vZGVUcmFuc2Zvcm0gPSBzb2NrZXQucGFyZW50Tm9kZS5nZXRBdHRyaWJ1dGUoXCJ0cmFuc2Zvcm1cIiksXG4gICAgICAgIG5vZGVUcmFuc2Zvcm1WYWx1ZXMgPSBub2RlVHJhbnNmb3JtLm1hdGNoKC9cXGQrLCBcXGQrLylbMF0uc3BsaXQoXCIsIFwiKSxcbiAgICAgICAgbm9kZU9mZnNldCA9IHtcbiAgICAgICAgICAgIHg6ICtub2RlVHJhbnNmb3JtVmFsdWVzWzBdLFxuICAgICAgICAgICAgeTogK25vZGVUcmFuc2Zvcm1WYWx1ZXNbMV1cbiAgICAgICAgfTtcblxuICAgIHZhciBzb2NrZXRPZmZzZXQgPSB7XG4gICAgICAgIHg6IHBhcnNlSW50KHNvY2tldC5nZXRBdHRyaWJ1dGUoXCJ4XCIpLCAxMCksXG4gICAgICAgIHk6IHBhcnNlSW50KHNvY2tldC5nZXRBdHRyaWJ1dGUoXCJ5XCIpLCAxMClcbiAgICB9O1xuXG4gICAgdmFyIHNvY2tldERpcmVjdGlvbiA9IF9nZXRTb2NrZXREaXJlY3Rpb24oc29ja2V0KSxcbiAgICAgICAgcGl4ZWxQdXNoWCA9IHNvY2tldERpcmVjdGlvbi5tYXRjaCgvbGVmdC8pID8gMSA6IDM7XG4gICAgICAgIHBpeGVsUHVzaFkgPSBzb2NrZXREaXJlY3Rpb24ubWF0Y2goL3VwLykgPyAxIDogMztcblxuICAgIHZhciBzdGFydFBvc2l0aW9uID0ge1xuICAgICAgICB4OiBub2RlT2Zmc2V0LnggKyBzb2NrZXRPZmZzZXQueCArIHBpeGVsUHVzaFgsXG4gICAgICAgIHk6IG5vZGVPZmZzZXQueSArIHNvY2tldE9mZnNldC55ICsgcGl4ZWxQdXNoWVxuICAgIH07XG5cbiAgICBjb25zb2xlLmRpcihub2RlT2Zmc2V0KTtcbiAgICBjb25zb2xlLmRpcihzdGFydFBvc2l0aW9uKVxuXG4gICAgcmV0dXJuIHN0YXJ0UG9zaXRpb247XG59XG5cbmZ1bmN0aW9uIF9nZXRTb2NrZXREaXJlY3Rpb24oc29ja2V0KSB7XG4gICAgcmV0dXJuIHNvY2tldC5nZXRBdHRyaWJ1dGUoXCJkYXRhLXNvY2tldC1kaXJlY3Rpb25cIik7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIHBhdGhEZXNjcmlwdGlvbkdlbmVyYXRvcjogZElzRm9yRGVzY3JpcHRpb24sXG4gICAgZ2V0UG9pbnRPZkNvbm5lY3Rpb246IF9nZXRDb25uZWN0aW9uUG9pbnQsXG59OyIsIi8qKlxuKiBUaGUgU1ZHIE1ha2VyIGlzIHJlc3BvbnNpYmxlIGZvciBjcmVhdGluZyBzdmcgcmVwcmVzZW50YXRpb25zIG9mXG4qIGVudGl0aWVzIGluIHRoZSBtb2RlbC5cbioqL1xuXG52YXIgc3ZnTmFtZVNwYWNlID0gXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiLFxuXHRub2RlRXZlbnRzID0gcmVxdWlyZShcIi4vbm9kZS1ldmVudHNcIiksXG5cdHBhdGhGaW5kZXIgPSByZXF1aXJlKFwiLi9wYXRoLWZpbmRlclwiKTtcblxudmFyIGRlZmF1bHRzID0geyBcblx0bm9kZTogeyBcblx0XHR3aWR0aDogMTIwLFxuXHRcdGhlaWdodDogNjBcblx0fSxcblx0c29ja2V0OiB7XG5cdFx0d2lkdGg6IDYsXG5cdFx0aGVpZ2h0OiA2XG5cdH0sXG59O1xuXG52YXIgY3JlYXRlU3ZnUmVwcmVzZW50YXRpb25PZk5vZGUgPSBmdW5jdGlvbihub2RlKSB7XG5cdHZhciBmcmFnIFx0XHQ9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKSxcblx0XHRncm91cCBcdFx0PSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoc3ZnTmFtZVNwYWNlLCBcImdcIiksXG5cdFx0cmVjdCBcdFx0PSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoc3ZnTmFtZVNwYWNlLCBcInJlY3RcIiksXG5cdFx0aHRtbEhvc3RcdD0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKHN2Z05hbWVTcGFjZSwgXCJmb3JlaWduT2JqZWN0XCIpLFxuXHRcdHRleHRCb3ggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpLFxuXHRcdHNvY2tldFRvcFx0PSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoc3ZnTmFtZVNwYWNlLCBcInJlY3RcIiksXG5cdFx0c29ja2V0UmlnaHRcdD0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKHN2Z05hbWVTcGFjZSwgXCJyZWN0XCIpLFxuXHRcdHNvY2tldEJvdHRvbVx0PSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoc3ZnTmFtZVNwYWNlLCBcInJlY3RcIiksXG5cdFx0c29ja2V0TGVmdFx0PSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoc3ZnTmFtZVNwYWNlLCBcInJlY3RcIik7XG5cblx0dmFyIHNvY2tldHMgPSBbc29ja2V0VG9wLCBzb2NrZXRSaWdodCwgc29ja2V0Qm90dG9tLCBzb2NrZXRMZWZ0XTtcblxuXHRyZWN0LmNsYXNzTGlzdC5hZGQoXCJub2RlXCIpO1xuXHRyZWN0LnNldEF0dHJpYnV0ZShcIndpZHRoXCIsIGRlZmF1bHRzLm5vZGUud2lkdGgudG9TdHJpbmcoKSk7XG5cdHJlY3Quc2V0QXR0cmlidXRlKFwiaGVpZ2h0XCIsIGRlZmF1bHRzLm5vZGUuaGVpZ2h0LnRvU3RyaW5nKCkpO1xuXHRyZWN0LnNldEF0dHJpYnV0ZShcInJ4XCIsIFwiM1wiKTtcblx0cmVjdC5zZXRBdHRyaWJ1dGUoXCJyeVwiLCBcIjNcIik7XG5cblx0Ly8gSW5zZXJ0IGF0IFxuXHRodG1sSG9zdC5zZXRBdHRyaWJ1dGUoXCJ4XCIsIDApO1xuXHRodG1sSG9zdC5zZXRBdHRyaWJ1dGUoXCJ5XCIsIDApO1xuXHRodG1sSG9zdC5zZXRBdHRyaWJ1dGUoXCJ3aWR0aFwiLCBkZWZhdWx0cy5ub2RlLndpZHRoKTtcblx0aHRtbEhvc3Quc2V0QXR0cmlidXRlKFwiaGVpZ2h0XCIsIGRlZmF1bHRzLm5vZGUuaGVpZ2h0KTtcblx0dGV4dEJveC5jbGFzc0xpc3QuYWRkKFwibm9kZS10aXRsZVwiKTtcblx0dGV4dEJveC5pbm5lclRleHQgPSBub2RlLnRleHQ7XG5cdGh0bWxIb3N0LmFwcGVuZENoaWxkKHRleHRCb3gpO1xuXG5cdHNvY2tldHMuZm9yRWFjaChmdW5jdGlvbihzb2NrZXQpIHtcblx0XHRzb2NrZXQuY2xhc3NMaXN0LmFkZChcInNvY2tldFwiKTtcblx0XHRzb2NrZXQuc2V0QXR0cmlidXRlKFwid2lkdGhcIiwgZGVmYXVsdHMuc29ja2V0LndpZHRoKTtcblx0XHRzb2NrZXQuc2V0QXR0cmlidXRlKFwiaGVpZ2h0XCIsIGRlZmF1bHRzLnNvY2tldC53aWR0aCk7XHRcblx0fSk7XG5cdFxuXHRzb2NrZXRUb3Auc2V0QXR0cmlidXRlKFwieFwiLCAoZGVmYXVsdHMubm9kZS53aWR0aCAvIDIpIC0gKGRlZmF1bHRzLnNvY2tldC53aWR0aCAvIDIpKTtcblx0c29ja2V0VG9wLnNldEF0dHJpYnV0ZShcInlcIiwgLShkZWZhdWx0cy5zb2NrZXQuaGVpZ2h0IC8gMikpO1xuXHQvLyBDaHJvbWl1bSBkb2VzIG5vdCBzdXBwb3J0IGRhdGFzZXQgb24gRWxlbWVudCwgb25seSBvbiBIdG1sRWxlbWVudFxuXHRzb2NrZXRUb3Auc2V0QXR0cmlidXRlKFwiZGF0YS1zb2NrZXQtZGlyZWN0aW9uXCIsIFwidXBcIik7XG5cblx0c29ja2V0UmlnaHQuc2V0QXR0cmlidXRlKFwieFwiLCBkZWZhdWx0cy5ub2RlLndpZHRoIC0gKGRlZmF1bHRzLnNvY2tldC53aWR0aCAvIDIpKTtcblx0c29ja2V0UmlnaHQuc2V0QXR0cmlidXRlKFwieVwiLCAoZGVmYXVsdHMubm9kZS5oZWlnaHQgLyAyKSAtIChkZWZhdWx0cy5zb2NrZXQuaGVpZ2h0IC8gMikpO1xuXHRzb2NrZXRSaWdodC5zZXRBdHRyaWJ1dGUoXCJkYXRhLXNvY2tldC1kaXJlY3Rpb25cIiwgXCJyaWdodFwiKTtcblxuXHRzb2NrZXRCb3R0b20uc2V0QXR0cmlidXRlKFwieFwiLCAoZGVmYXVsdHMubm9kZS53aWR0aCAvIDIpIC0gKGRlZmF1bHRzLnNvY2tldC53aWR0aCAvIDIpKTtcblx0c29ja2V0Qm90dG9tLnNldEF0dHJpYnV0ZShcInlcIiwgZGVmYXVsdHMubm9kZS5oZWlnaHQgLSAoZGVmYXVsdHMuc29ja2V0LmhlaWdodCAvIDIpKTtcblx0c29ja2V0Qm90dG9tLnNldEF0dHJpYnV0ZShcImRhdGEtc29ja2V0LWRpcmVjdGlvblwiLCBcImRvd25cIik7XG5cblx0c29ja2V0TGVmdC5zZXRBdHRyaWJ1dGUoXCJ4XCIsIC0oZGVmYXVsdHMuc29ja2V0LndpZHRoIC8gMikpO1xuXHRzb2NrZXRMZWZ0LnNldEF0dHJpYnV0ZShcInlcIiwgKGRlZmF1bHRzLm5vZGUuaGVpZ2h0IC8gMikgLSAoZGVmYXVsdHMuc29ja2V0LmhlaWdodCAvIDIpKTtcblx0c29ja2V0TGVmdC5zZXRBdHRyaWJ1dGUoXCJkYXRhLXNvY2tldC1kaXJlY3Rpb25cIiwgXCJsZWZ0XCIpO1xuXG5cdGdyb3VwLmFwcGVuZENoaWxkKHJlY3QpO1xuXHRncm91cC5hcHBlbmRDaGlsZChodG1sSG9zdCk7XG5cdGdyb3VwLmFwcGVuZENoaWxkKHNvY2tldFRvcCk7XG5cdGdyb3VwLmFwcGVuZENoaWxkKHNvY2tldFJpZ2h0KTtcblx0Z3JvdXAuYXBwZW5kQ2hpbGQoc29ja2V0Qm90dG9tKTtcblx0Z3JvdXAuYXBwZW5kQ2hpbGQoc29ja2V0TGVmdCk7XG5cblx0Z3JvdXAuc2V0QXR0cmlidXRlKFwiZGF0YS1ub2RlLWlkXCIsIG5vZGUuaWQpO1xuXHRncm91cC5zZXRBdHRyaWJ1dGUoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoXCIgKyBub2RlLnBvc2l0aW9uLnggKyBcIiwgXCIgKyBub2RlLnBvc2l0aW9uLnkgKyBcIilcIik7XG5cblx0Ly8gU2V0dXAgZXZlbnRzIGZvciB0aGUgbm9kZVxuXHRub2RlRXZlbnRzLmluaXQoZ3JvdXAsIG5vZGUuaWQpO1xuXG5cdGZyYWcuYXBwZW5kQ2hpbGQoZ3JvdXApO1xuXG5cdHJldHVybiBmcmFnO1xufTtcblxudmFyIGNyZWF0ZVN2Z1JlcHJlc2VudGF0aW9uT2ZSZWxhdGlvbnNoaXAgPSBmdW5jdGlvbihmcm9tKSB7XG5cdHZhciBmcmFnXHQ9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKSxcblx0XHRncm91cCBcdD0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKHN2Z05hbWVTcGFjZSwgXCJnXCIpLFxuXHRcdHBhdGhcdD0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKHN2Z05hbWVTcGFjZSwgXCJwYXRoXCIpO1xuXHRcdFxuXHRncm91cC5zZXRBdHRyaWJ1dGUoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoXCIgKyBmcm9tLnggKyBcIiwgXCIgKyBmcm9tLnkgKyBcIilcIik7XG5cblx0cGF0aC5jbGFzc0xpc3QuYWRkKFwibGluZVwiLCBcImV2b2x2aW5nXCIpO1xuXG5cdHZhciBkID0gW1xuXHRcdC8vIG0gPSBNb3ZlVG8gcmVsYXRpdmUgdG8gZ3JvdXBcblx0XHRcIm1cIiwgMCwgMCxcblx0XTtcblxuXHRwYXRoLnNldEF0dHJpYnV0ZShcImRcIiwgZC5qb2luKFwiIFwiKSk7XG5cblx0Z3JvdXAuYXBwZW5kQ2hpbGQocGF0aCk7XG5cdGZyYWcuYXBwZW5kQ2hpbGQoZ3JvdXApO1xuXHRyZXR1cm4gZnJhZztcdFxufTtcblxudmFyIGdldERlZmF1bHROb2RlU2l6ZSA9IGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gZGVmYXVsdHMubm9kZTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXHRjcmVhdGVTdmdOb2RlOiBjcmVhdGVTdmdSZXByZXNlbnRhdGlvbk9mTm9kZSxcblx0Y3JlYXRlU3ZnUmVsYXRpb25zaGlwOiBjcmVhdGVTdmdSZXByZXNlbnRhdGlvbk9mUmVsYXRpb25zaGlwLFxuXHRnZXREZWZhdWx0Tm9kZVNpemU6IGdldERlZmF1bHROb2RlU2l6ZVxufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGVsKSB7XG5cdGZ1bmN0aW9uIHN1YihuYW1lLCBjYikge1xuXHRcdHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihuYW1lLCBjYik7XG5cdH1cblxuXHRmdW5jdGlvbiBwdWIobmFtZSwgZGV0YWlscykge1xuXHRcdHRoaXMuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQobmFtZSwge1xuXHRcdFx0YnViYmxlczogdHJ1ZSxcblx0XHRcdGRldGFpbDogZGV0YWlsc1xuXHRcdH0pKTtcblx0fVxuXG5cdHJldHVybiB7IFxuXHRcdG9uOiBzdWIuYmluZChlbCksXG5cdFx0ZW1pdDogcHViLmJpbmQoZWwpXG5cdH07XG59OyIsIi8qKiBcbiogUmV0dXJucyB0aGUgeCBhbmQgeSB2YWx1ZXMgZnJvbSBhIE1vdXNlRXZlbnQgb3IgYSBzdmcgZ3JvdXAgZWxlbWVudCAodGhhdCBnZXRzIFxuKiBpdHMgcG9zaXRpb24gdmlhIGEgY3NzIHRyYW5zbGF0ZSBmdW5jdGlvbikuXG4qL1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG9iaikge1xuXHQvLyBUT0RPOiBjb25zdHJ1Y3Rvci5uYW1lIGlzIGEgRVM2IGZlYXR1cmUgY3VycmVudGx5IG5vdCBzdXBwb3J0ZWQgYnkgSUVcblx0dmFyIGN0b3IgPSBvYmouY29uc3RydWN0b3IubmFtZTtcblxuXHRpZiAoY3RvciA9PSBcIk1vdXNlRXZlbnRcIikge1xuXHRcdHJldHVybiB7XG5cdFx0XHR4OiBvYmouY2xpZW50WCxcblx0XHRcdHk6IG9iai5jbGllbnRZXG5cdFx0fTtcblx0fVxuXG5cdGlmIChjdG9yID09IFwiU1ZHR0VsZW1lbnRcIilcblx0XHRyZXR1cm4gZ2V0VHJhbnNsYXRlVmFsdWVzKG9iaik7XG5cdGVsc2UgaWYgKGN0b3IgPT0gXCJTVkdSZWN0RWxlbWVudFwiKVxuXHRcdHJldHVybiBnZXRYeVZhbHVlcyhvYmopO1xufTtcblxuZnVuY3Rpb24gZ2V0VHJhbnNsYXRlVmFsdWVzKGVsKSB7XG5cdHZhciBzdHIgPSBlbC5nZXRBdHRyaWJ1dGUoXCJ0cmFuc2Zvcm1cIik7XG5cblx0Ly8gUmV0dXJuIHplcm9zIGlmIG5vIHRyYW5zYWxhdGUgZnVuY3Rpb24gY2FuIGJlIGZvdW5kLlxuXHRpZiAoc3RyLmxlbmd0aCA8IDE0IHx8IHN0ci5zbGljZSgwLCAxMCkgIT0gXCJ0cmFuc2xhdGUoXCIpXG5cdFx0cmV0dXJuIHsgeDogMCwgeTogMCB9O1xuXG5cdHZhciB2YWx1ZXMgPSBzdHIuc2xpY2UoMTAsIC0xKS5zcGxpdChcIiBcIik7XG5cblx0cmV0dXJuIHtcblx0XHR4OiBwYXJzZUludCh2YWx1ZXNbMF0pLFxuXHRcdHk6IHBhcnNlSW50KHZhbHVlc1sxXSlcblx0fTtcbn1cblxuZnVuY3Rpb24gZ2V0WHlWYWx1ZXMoZWwpIHtcblx0cmV0dXJuIHtcblx0XHR4OiBlbC5nZXRBdHRyaWJ1dGUoXCJ4XCIpLFxuXHRcdHk6IGVsLmdldEF0dHJpYnV0ZShcInlcIilcblx0fTtcbn0iXX0=
