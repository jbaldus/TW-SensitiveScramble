/*\
created: 20210514195119587
title: $:/plugins/jbaldus/sensitive-scramble/editor/operations/text/add-to-sensitive-list.js
type: application/javascript
tags: 
modified: 20210514195306504
module-type: texteditoroperation

Text editor operation to add the selection to the sensitive words list
TODO: Do I want to have a dropdown asking if the user wants to remove the word if it already is on the list?

\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

exports["add-to-sensitive-list"] = function(event,operation) {
	var sensitiveWordsText = $tw.wiki.getTiddlerText("$:/plugins/jbaldus/sensitive-scramble/config/words","");
	var sensitiveWords = sensitiveWordsText.split('\n');

	

	if(operation.selStart !== operation.selEnd) {
		console.log(operation);
		operation.newSelStart = operation.selEnd;
		operation.newSelEnd = operation.selEnd;
		sensitiveWords.push(operation.selection);
		console.log(sensitiveWords.join('\n'));
	}
	// 	// No selection; check if we're within the prefix/suffix
	// 	if(operation.text.substring(operation.selStart - event.paramObject.prefix.length,operation.selStart + event.paramObject.suffix.length) === event.paramObject.prefix + event.paramObject.suffix) {
	// 		// Remove the prefix and suffix
	// 		operation.cutStart = operation.selStart - event.paramObject.prefix.length;
	// 		operation.cutEnd = operation.selEnd + event.paramObject.suffix.length;
	// 		operation.replacement = "";
	// 		operation.newSelStart = operation.cutStart;
	// 		operation.newSelEnd = operation.newSelStart;
	// 	} else {
	// 		// Wrap the cursor instead
	// 		operation.cutStart = operation.selStart;
	// 		operation.cutEnd = operation.selEnd;
	// 		operation.replacement = event.paramObject.prefix + event.paramObject.suffix;
	// 		operation.newSelStart = operation.selStart + event.paramObject.prefix.length;
	// 		operation.newSelEnd = operation.newSelStart;
	// 	}
	// } else if(operation.text.substring(operation.selStart,operation.selStart + event.paramObject.prefix.length) === event.paramObject.prefix && operation.text.substring(operation.selEnd - event.paramObject.suffix.length,operation.selEnd) === event.paramObject.suffix) {
	// 	// Prefix and suffix are already present, so remove them
	// 	operation.cutStart = operation.selStart;
	// 	operation.cutEnd = operation.selEnd;
	// 	operation.replacement = operation.selection.substring(event.paramObject.prefix.length,operation.selection.length - event.paramObject.suffix.length);
	// 	operation.newSelStart = operation.selStart;
	// 	operation.newSelEnd = operation.selStart + operation.replacement.length;
	// } else {
	// 	// Add the prefix and suffix
	// 	operation.cutStart = operation.selStart;
	// 	operation.cutEnd = operation.selEnd;
	// 	operation.replacement = event.paramObject.prefix + operation.selection + event.paramObject.suffix;
	// 	operation.newSelStart = operation.selStart;
	// 	operation.newSelEnd = operation.selStart + operation.replacement.length;
	// }
};

})();
