/*
---
name: uniqueID
description: Generates an unique ID
...
*/

define('Utility/uniqueID', function(){

var UID = 0;
return function(){
	return (+(new Date) + (UID++)).toString(36);
};

});
