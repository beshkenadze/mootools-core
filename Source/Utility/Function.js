/*
---
name: Function
description: Function prototypes and generics.
...
*/

define(['./typeOf', '../Host/Function', '../Host/Array'], function(typeOf, Function, Array){

var enumerables = true;
for (var i in {toString: 1}) enumerables = null;
if (enumerables) enumerables = ['hasOwnProperty', 'valueOf', 'isPrototypeOf', 'propertyIsEnumerable', 'toLocaleString', 'toString', 'constructor'];

Function.implement('overloadSetter', function(forceObjectArgument){
	var self = this;
	return function(a, b){
		if (a == null) return this;
		if (forceObjectArgument || typeof a != 'string'){
			for (var k in a) self.call(this, k, a[k]);
			if (enumerables) for (var i = enumerables.length; i--;){
				k = enumerables[i];
				if (a.hasOwnProperty(k)) self.call(this, k, a[k]);
			}
		} else {
			self.call(this, a, b);
		}
		return this;
	};
});

Function.implement('overloadGetter', function(forceObjectResult){
	// the forceObjectResult argument is used in those situations where a getter must always return a list of results.
	// Usually, when autogenerating a multiGetter with a plural name (such as getStuff autogenerated from getThing) we want the plural version of the getter to always behave the same way, regardless of the arguments passed.
	var self = this;
	return function(argument){
		var args;
		if (typeof argument != 'string') args = argument; // the list of stuff to get is passed as an array
		else if (arguments.length > 1) args = arguments; // the list of stuff to get is passed as arguments
		else if (forceObjectResult) args = [argument]; //only one argument was passed, as we excluded the other 2 options before, but we wrap it in an array so that the object return is used.
		if (args){
			var result = {};
			for (var i = 0; i < args.length; i++) result[args[i]] = self.call(this, args[i]);
			return result;
		} else {
			return self.call(this, argument);
		}
	};
});

Function.extend('attempt', function(){
	for (var i = 0, l = arguments.length; i < l; i++){
		try {
			return arguments[i]();
		} catch (e){}
	}
	return null;
});

Function.implement('attempt', function(bind){
	var args = Array.slice(arguments);
	try {
		return this.apply(args.shift(0), args);
	} catch (e){}

	return null;
});

Function.extend('from', function(item){
	return (typeOf(item) == 'function') ? item : function(){
		return item;
	};
});

return Function;
	
});
