/*\
created: 20210508202122053
type: application/javascript
title: $:/plugins/jbaldus/sensitive-scramble/wikirules/rot13-sensitive.js
tags: 
modified: 20211202015156376
module-type: wikirule

Wiki text inline rule for scrambling words that are in a list of sensitive words. Nothing special needs to be done when writing the tiddler to mark the sensitive words. Instead, they are defined in the tiddler $:/config/sensitive-scramble/sensitive-words, one per line. Actually, each line can be a regular expression, but it's probably easier to just stick to words. The words will be joined with a pipe when put into the regular expression. If the $:/config/sensitive-scramble/sensitive-words tiddler doesn't exist, or contains no words, then this rule will do nothing. 

If the word list changes, then a reload will be required.

\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

var rot13 = require("$:/plugins/jbaldus/sensitive-scramble/lib/rot13.js");

exports.name = "sensitive-scramble";
exports.types = {inline: true};

exports.init = function(parser) {
    this.parser = parser;
    // Regexp to match
    this.sensitiveWords = rot13.getSensitiveRegExp();
    this.matchRegExp = new RegExp(this.sensitiveWords, "ig");
    // If there are no sensitive words, don't match anything
    if (this.sensitiveWords.trim() === "") {
        // make the matchRegExp so crazy it will never match anything
        // without this, the this.matchRegExp will match everything and crash the page
        this.matchRegExp = /gwndowmrogiocvlsvowwhgavlkhowyyabgalkkj/;
    }
};

exports.parse = function() {
    // Move past the match
    this.parser.pos = this.matchRegExp.lastIndex;

    return [{
        type: "element",
        tag: "span",
        attributes: {
            "class": {type: "string", value: "ss-scrambled"},
            "data-plaintext": {type: "string", value: this.match[0]}
        },
        children: [{
            type: "text",
            text: rot13.rot13(this.match[0],3)
        }]
    }];
};

})();
