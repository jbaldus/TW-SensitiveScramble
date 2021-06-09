/*\
title: $:/plugins/jbaldus/sensitive-scramble/editor/operations/text/add-to-sensitive-list.js
type: application/javascript
module-type: texteditoroperation

Text editor operation to add the selection to the sensitive words list.5
TODO: Do I want to have a dropdown asking if the user wants to remove the word if it already is on the list?

\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

exports["add-to-sensitive-list"] = function(event,operation) {

	var rot13 = require("$:/plugins/jbaldus/sensitive-scramble/lib/rot13.js");

	if(operation.selStart !== operation.selEnd) {
		rot13.addToSensitiveList(operation.selection);
	}
};

})();
