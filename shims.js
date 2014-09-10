/**
 * In this file I try to collect all JavaScript shims from developer.mozilla.org.
 * I use tabs for indentation. Deal with it.
 *
 * See:
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects
 */
(function (undefined) {
	"use strict";

	// shiming helper function:
	function shim(obj, shims) {
		for (var name in shims) {
			if (!(name in obj)) {
				obj[name] = shims[name];
			}
		}
	}

	function pad(number) {
		var r = String(number);
		if (r.length === 1) {
			r = '0' + r;
		}
		return r;
	}

	shim(window, {
		// just a fallback to the non-paralell array (not from developer.mozilla.org):
		ParallelArray: Array
	});

	// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array#Methods
	shim(Array, {
		isArray: function (vArg) {
			return Object.prototype.toString.call(vArg) === "[object Array]";
		}
	});

	// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/prototype#Methods
	shim(Array.prototype, {
		indexOf: function (searchElement /*, fromIndex */ ) {
			if (this == null) {
				throw new TypeError();
			}
			var n, k, t = Object(this),
				len = t.length >>> 0;

			if (len === 0) {
				return -1;
			}
			n = 0;
			if (arguments.length > 1) {
				n = Number(arguments[1]);
				if (n != n) { // shortcut for verifying if it's NaN
					n = 0;
				} else if (n != 0 && n != Infinity && n != -Infinity) {
					n = (n > 0 || -1) * Math.floor(Math.abs(n));
				}
			}
			if (n >= len) {
				return -1;
			}
			for (k = n >= 0 ? n : Math.max(len - Math.abs(n), 0); k < len; k++) {
				if (k in t && t[k] === searchElement) {
					return k;
				}
			}
			return -1;
		},

		lastIndexOf: function (searchElement /*, fromIndex*/ ) {
			if (this == null) {
				throw new TypeError();
			}

			var n, k,
				t = Object(this),
				len = t.length >>> 0;
			if (len === 0) {
				return -1;
			}

			n = len;
			if (arguments.length > 1) {
				n = Number(arguments[1]);
				if (n != n) {
					n = 0;
				} else if (n != 0 && n != (1 / 0) && n != -(1 / 0)) {
					n = (n > 0 || -1) * Math.floor(Math.abs(n));
				}
			}

			for (k = n >= 0 ? Math.min(n, len - 1) : len - Math.abs(n); k >= 0; k--) {
				if (k in t && t[k] === searchElement) {
					return k;
				}
			}
			return -1;
		},

		forEach: function forEach(callback, thisArg) {
			var T, k;

			if (this == null) {
				throw new TypeError("this is null or not defined");
			}

			var kValue,
				// 1. Let O be the result of calling ToObject passing the |this| value as the argument.
				O = Object(this),

				// 2. Let lenValue be the result of calling the Get internal method of O with the argument "length".
				// 3. Let len be ToUint32(lenValue).
				len = O.length >>> 0; // Hack to convert O.length to a UInt32

			// 4. If IsCallable(callback) is false, throw a TypeError exception.
			// See: http://es5.github.com/#x9.11
			if ({}.toString.call(callback) !== "[object Function]") {
				throw new TypeError(callback + " is not a function");
			}

			// 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
			if (arguments.length >= 2) {
				T = thisArg;
			}

			// 6. Let k be 0
			k = 0;

			// 7. Repeat, while k < len
			while (k < len) {

				// a. Let Pk be ToString(k).
				//   This is implicit for LHS operands of the in operator
				// b. Let kPresent be the result of calling the HasProperty internal method of O with argument Pk.
				//   This step can be combined with c
				// c. If kPresent is true, then
				if (k in O) {

					// i. Let kValue be the result of calling the Get internal method of O with argument Pk.
					kValue = O[k];

					// ii. Call the Call internal method of callback with T as the this value and
					// argument list containing kValue, k, and O.
					callback.call(T, kValue, k, O);
				}
				// d. Increase k by 1.
				k++;
			}
			// 8. return undefined
		},

		every: function (fun /*, thisp */ ) {
			var t, len, i, thisp;

			if (this == null) {
				throw new TypeError();
			}

			t = Object(this);
			len = t.length >>> 0;
			if (typeof fun !== 'function') {
				throw new TypeError();
			}

			thisp = arguments[1];
			for (i = 0; i < len; i++) {
				if (i in t && !fun.call(thisp, t[i], i, t)) {
					return false;
				}
			}

			return true;
		},

		some: function (fun /*, thisp */ ) {
			if (this == null) {
				throw new TypeError();
			}

			var thisp, i,
				t = Object(this),
				len = t.length >>> 0;
			if (typeof fun !== 'function') {
				throw new TypeError();
			}

			thisp = arguments[1];
			for (i = 0; i < len; i++) {
				if (i in t && fun.call(thisp, t[i], i, t)) {
					return true;
				}
			}

			return false;
		},

		filter: function (fun /*, thisp*/ ) {
			if (!this) {
				throw new TypeError();
			}

			var objects = Object(this);
			var len = objects.length >>> 0;
			if (typeof fun !== 'function') {
				throw new TypeError();
			}

			var res = [];
			var thisp = arguments[1];
			for (var i in objects) {
				if (objects.hasOwnProperty(i)) {
					if (fun.call(thisp, objects[i], i, objects)) {
						res.push(objects[i]);
					}
				}
			}

			return res;
		},

		map: function (callback, thisArg) {

			var T, A, k;

			if (this == null) {
				throw new TypeError(" this is null or not defined");
			}

			// 1. Let O be the result of calling ToObject passing the |this| value as the argument.
			var O = Object(this);

			// 2. Let lenValue be the result of calling the Get internal method of O with the argument "length".
			// 3. Let len be ToUint32(lenValue).
			var len = O.length >>> 0;

			// 4. If IsCallable(callback) is false, throw a TypeError exception.
			// See: http://es5.github.com/#x9.11
			if (typeof callback !== "function") {
				throw new TypeError(callback + " is not a function");
			}

			// 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
			if (thisArg) {
				T = thisArg;
			}

			// 6. Let A be a new array created as if by the expression new Array(len) where Array is
			// the standard built-in constructor with that name and len is the value of len.
			A = new Array(len);

			// 7. Let k be 0
			k = 0;

			// 8. Repeat, while k < len
			while (k < len) {

				var kValue, mappedValue;

				// a. Let Pk be ToString(k).
				//   This is implicit for LHS operands of the in operator
				// b. Let kPresent be the result of calling the HasProperty internal method of O with argument Pk.
				//   This step can be combined with c
				// c. If kPresent is true, then
				if (k in O) {

					// i. Let kValue be the result of calling the Get internal method of O with argument Pk.
					kValue = O[k];

					// ii. Let mappedValue be the result of calling the Call internal method of callback
					// with T as the this value and argument list containing kValue, k, and O.
					mappedValue = callback.call(T, kValue, k, O);

					// iii. Call the DefineOwnProperty internal method of A with arguments
					// Pk, Property Descriptor {Value: mappedValue, : true, Enumerable: true, Configurable: true},
					// and false.

					// In browsers that support Object.defineProperty, use the following:
					// Object.defineProperty(A, Pk, { value: mappedValue, writable: true, enumerable: true, configurable: true });

					// For best browser support, use the following:
					A[k] = mappedValue;
				}
				// d. Increase k by 1.
				k++;
			}

			// 9. return A
			return A;
		},

		reduce: function (callback, opt_initialValue) {
			if (null === this || 'undefined' === typeof this) {
				// At the moment all modern browsers, that support strict mode, have
				// native implementation of Array.prototype.reduce. For instance, IE8
				// does not support strict mode, so this check is actually useless.
				throw new TypeError(
					'Array.prototype.reduce called on null or undefined');
			}
			if ('function' !== typeof callback) {
				throw new TypeError(callback + ' is not a function');
			}
			var index, value,
				length = this.length >>> 0,
				isValueSet = false;
			if (1 < arguments.length) {
				value = opt_initialValue;
				isValueSet = true;
			}
			for (index = 0; length > index; ++index) {
				if (this.hasOwnProperty(index)) {
					if (isValueSet) {
						value = callback(value, this[index], index, this);
					} else {
						value = this[index];
						isValueSet = true;
					}
				}
			}
			if (!isValueSet) {
				throw new TypeError('Reduce of empty array with no initial value');
			}
			return value;
		},

		reduceRight: function (callback, opt_initialValue) {
			if (null === this || 'undefined' === typeof this) {
				// At the moment all modern browsers, that support strict mode, have
				// native implementation of Array.prototype.reduceRight. For instance,
				// IE8 does not support strict mode, so this check is actually useless.
				throw new TypeError(
					'Array.prototype.reduceRight called on null or undefined');
			}
			if ('function' !== typeof callback) {
				throw new TypeError(callback + ' is not a function');
			}
			var index, value,
				length = this.length >>> 0,
				isValueSet = false;
			if (1 < arguments.length) {
				value = opt_initialValue;
				isValueSet = true;
			}
			for (index = length - 1; - 1 < index; --index) {
				if (!this.hasOwnProperty(index)) {
					if (isValueSet) {
						value = callback(value, this[index], index, this);
					} else {
						value = this[index];
						isValueSet = true;
					}
				}
			}
			if (!isValueSet) {
				throw new TypeError('Reduce of empty array with no initial value');
			}
			return value;
		},

		// Production steps of ECMA-262, Edition 6, 22.1.2.1
		// Reference: https://people.mozilla.org/~jorendorff/es6-draft.html#sec-array.from
		from: (function () {
			var toStr = Object.prototype.toString;
			var isCallable = function (fn) {
				return typeof fn === 'function' || toStr.call(fn) === '[object Function]';
			};
			var toInteger = function (value) {
				var number = Number(value);
				if (isNaN(number)) { return 0; }
				if (number === 0 || !isFinite(number)) { return number; }
				return (number > 0 ? 1 : -1) * Math.floor(Math.abs(number));
			};
			var maxSafeInteger = Math.pow(2, 53) - 1;
			var toLength = function (value) {
				var len = toInteger(value);
				return Math.min(Math.max(len, 0), maxSafeInteger);
			};

			// The length property of the from method is 1.
			return function from(arrayLike/*, mapFn, thisArg */) {
				// 1. Let C be the this value.
				var C = this;

				// 2. Let items be ToObject(arrayLike).
				var items = Object(arrayLike);

				// 3. ReturnIfAbrupt(items).
				if (arrayLike == null) {
					throw new TypeError("Array.from requires an array-like object - not null or undefined");
				}

				// 4. If mapfn is undefined, then let mapping be false.
				var mapFn, T;
				if (arguments.length > 1) {
					mapFn = arguments[1];
					// 5. else
					// 5. a If IsCallable(mapfn) is false, throw a TypeError exception.
					if (!isCallable(mapFn)) {
						throw new TypeError('Array.from: when provided, the second argument must be a function');
					}

					// 5. b. If thisArg was supplied, let T be thisArg; else let T be undefined.
					if (arguments.length > 2) {
						T = arguments[2];
					}
				}

				// 10. Let lenValue be Get(items, "length").
				// 11. Let len be ToLength(lenValue).
				var len = toLength(items.length);

				// 13. If IsConstructor(C) is true, then
				// 13. a. Let A be the result of calling the [[Construct]] internal method of C with an argument list containing the single item len.
				// 14. a. Else, Let A be ArrayCreate(len).
				var A = isCallable(C) ? Object(new C(len)) : new Array(len);

				// 16. Let k be 0.
				var k = 0;
				// 17. Repeat, while k < len… (also steps a - h)
				var kValue;
				while (k < len) {
					kValue = items[k];
					if (mapFn) {
						A[k] = typeof T === 'undefined' ? mapFn(kValue, k) : mapFn.call(T, kValue, k);
					} else {
						A[k] = kValue;
					}
					k += 1;
				}
				// 18. Let putStatus be Put(A, "length", len, true).
				A.length = len;
				// 20. Return A.
				return A;
			};
		}()),

		copyWithin: function(target, start/*, end*/) {
			// Steps 1-2.
			if (this == null) {
				throw new TypeError('this is null or not defined');
			}

			var O = Object(this);

			// Steps 3-5.
			var len = O.length >>> 0;

			// Steps 6-8.
			var relativeTarget = target >> 0;

			var to = relativeTarget < 0 ?
				Math.max(len + relativeTarget, 0) :
				Math.min(relativeTarget, len);

			// Steps 9-11.
			var relativeStart = start >> 0;

			var from = relativeStart < 0 ?
				Math.max(len + relativeStart, 0) :
				Math.min(relativeStart, len);

			// Steps 12-14.
			var end = arguments[2];
			var relativeEnd = end === undefined ? len : end >> 0;

			var final = relativeEnd < 0 ?
				Math.max(len + relativeEnd, 0) :
				Math.min(relativeEnd, len);

			// Step 15.
			var count = Math.min(final - from, len - to);

			// Steps 16-17.
			var direction = 1;

			if (from < to && to < (from + count)) {
				direction = -1;
				from += count - 1;
				to += count - 1;
			}

			// Step 18.
			while (count > 0) {
				if (from in O) {
					O[to] = O[from];
				} else {
					delete O[to];
				}

				from += direction;
				to += direction;
				count--;
			}

			// Step 19.
			return O;
		},

		of: function() {
			return Array.prototype.slice.call(arguments);
		},

		fill: function(value) {

			// Steps 1-2.
			if (this == null) {
				throw new TypeError("this is null or not defined");
			}

			var O = Object(this);

			// Steps 3-5.
			var len = O.length >>> 0;

			// Steps 6-7.
			var start = arguments[1];
			var relativeStart = start >> 0;

			// Step 8.
			var k = relativeStart < 0 ?
				Math.max(len + relativeStart, 0) :
				Math.min(relativeStart, len);

			// Steps 9-10.
			var end = arguments[2];
			var relativeEnd = end === undefined ?
				len : end >> 0;

			// Step 11.
			var final = relativeEnd < 0 ?
				Math.max(len + relativeEnd, 0) :
				Math.min(relativeEnd, len);

			// Step 12.
			while (k < final) {
				O[k] = value;
				k++;
			}

			// Step 13.
			return O;
		},

		find: function(predicate) {
			if (this == null) {
				throw new TypeError('Array.prototype.find called on null or undefined');
			}
			if (typeof predicate !== 'function') {
				throw new TypeError('predicate must be a function');
			}
			var list = Object(this);
			var length = list.length >>> 0;
			var thisArg = arguments[1];
			var value;

			for (var i = 0; i < length; i++) {
				value = list[i];
				if (predicate.call(thisArg, value, i, list)) {
					return value;
				}
			}
			return undefined;
		},

		findIndex: function(predicate) {
			if (this == null) {
				throw new TypeError('Array.prototype.find called on null or undefined');
			}
			if (typeof predicate !== 'function') {
				throw new TypeError('predicate must be a function');
			}
			var list = Object(this);
			var length = list.length >>> 0;
			var thisArg = arguments[1];
			var value;

			for (var i = 0; i < length; i++) {
				value = list[i];
				if (predicate.call(thisArg, value, i, list)) {
					return i;
				}
			}
			return -1;
		}
	});

	// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date#Methods
	shim(Date, {
		now: function now() {
			return new Date().getTime();
		}

		// parse: missing
		// UTC:   missing
	});

	// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/prototype#Methods
	shim(Date.prototype, {
		toISOString: function () {
			return this.getUTCFullYear() + '-' +
				pad(this.getUTCMonth() + 1) + '-' +
				pad(this.getUTCDate()) + 'T' +
				pad(this.getUTCHours()) + ':' +
				pad(this.getUTCMinutes()) + ':' +
				pad(this.getUTCSeconds()) + '.' +
				String((this.getUTCMilliseconds() / 1000).toFixed(3)).slice(2, 5) + 'Z';
		}
	});

	// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/prototype#Methods
	shim(Function.prototype, {
		bind: function (oThis) {
			if (typeof this !== "function") {
				// closest thing possible to the ECMAScript 5 internal IsCallable function
				throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
			}

			var aArgs = Array.prototype.slice.call(arguments, 1),
				fToBind = this,
				fNOP = function () {},
				fBound = function () {
					return fToBind.apply(this instanceof fNOP && oThis ? this : oThis,
						aArgs.concat(Array.prototype.slice.call(arguments)));
				};

			fNOP.prototype = this.prototype;
			fBound.prototype = new fNOP();

			return fBound;
		}
	});

	// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number#Methods
	shim(Number, {
		isInteger: function isInteger(nVal) {
			return typeof nVal === "number" && isFinite(nVal) &&
				nVal > -9007199254740992 && nVal < 9007199254740992 && Math.floor(nVal) === nVal;
		}
	});

	// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object#Methids
	shim(Object, {
		keys: (function () {
			var hasOwnProperty = Object.prototype.hasOwnProperty,
				hasDontEnumBug = !({
					toString: null
				}).propertyIsEnumerable('toString'),
				dontEnums = [
					'toString',
					'toLocaleString',
					'valueOf',
					'hasOwnProperty',
					'isPrototypeOf',
					'propertyIsEnumerable',
					'constructor'
				],
				dontEnumsLength = dontEnums.length;

			return function (obj) {
				if (typeof obj !== 'object' && (typeof obj !== 'function' || obj === null)) {
					throw new TypeError('Object.keys called on non-object');
				}

				var result = [],
					prop, i;

				for (prop in obj) {
					if (hasOwnProperty.call(obj, prop)) {
						result.push(prop);
					}
				}

				if (hasDontEnumBug) {
					for (i = 0; i < dontEnumsLength; i++) {
						if (hasOwnProperty.call(obj, dontEnums[i])) {
							result.push(dontEnums[i]);
						}
					}
				}
				return result;
			};
		}())
	});

	// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String#Methods
	shim(String, {
		fromCodePoint: function fromCodePoint() {
			var chars = [],
				point, offset, units, i;
			for (i = 0; i < arguments.length; ++i) {
				point = arguments[i];
				offset = point - 0x10000;
				units = point > 0xFFFF ? [0xD800 + (offset >> 10), 0xDC00 + (offset & 0x3FF)] : [point];
				chars.push(String.fromCharCode.apply(null, units));
			}
			return chars.join("");
		}
	});

	// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/prototype#Methods
	shim(String.prototype, {
		endsWith: function (searchString, position) {
			position = position || this.length;
			position = position - searchString.length;
			var lastIndex = this.lastIndexOf(searchString);
			return lastIndex !== -1 && lastIndex === position;
		},

		startsWith: function (searchString, position) {
			position = position || 0;
			return this.indexOf(searchString, position) === position;
		},

		contains: function (str, startIndex) {
			return -1 !== String.prototype.indexOf.call(this, str, startIndex);
		},

		trim: function (searchString, position) {
			return this.replace(/^\s+|\s+$/g, '');
		},

		// trimLeft and trimRight are actually not from developer.mozilla.org,
		// but I added them for completeness:
		trimLeft: function (searchString, position) {
			return this.replace(/^\s+/, '');
		},

		trimRight: function (searchString, position) {
			return this.replace(/\s+$/, '');
		}
	});

	// only run when the substr function is broken
	if ('ab'.substr(-1) != 'b') {
		/**
		 *  Get the substring of a string
		 *  @param  {integer}  start   where to start the substring
		 *  @param  {integer}  length  how many characters to return
		 *  @return {string}
		 */
		String.prototype.substr = function (substr) {
			return function (start, length) {
				// did we get a negative start, calculate how much it is from the beginning of the string
				if (start < 0) start = this.length + start;

				// call the original function
				return substr.call(this, start, length);
			}
		}(String.prototype.substr);
	}
})();
