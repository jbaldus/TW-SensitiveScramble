/*\
created: 20210515214348302
title: $:/plugins/jbaldus/sensitive-scramble/lib/rot13.js
type: application/javascript
modified: 20210515215356627
tags: 
module-type: library
\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

const WORDLIST="$:/plugins/jbaldus/sensitive-scramble/config/words";

exports.rot13 = function (mystring, rotation_value=13) {
    return mystring.replace(/[a-zA-Z]/g, function(chr) {
        var start = chr <= 'Z' ? 'A'.charCodeAt(0) : 'a'.charCodeAt(0);
        return String.fromCharCode(start + (chr.charCodeAt(0) - start + rotation_value) % 26);
    });
}

exports.addWordBounds = function (word) {
    var boundedWord = word,
            frontBoundaryMark = /^(\\b)?/,
            backBoundaryMark = /(\\b)?$/,
            frontTildeTest = /^~/,
            backTildeTest = /(?<!\\)~$/;
    if (word === undefined) {
            return undefined;
    }
    if (frontTildeTest.test(word)) {
            boundedWord = boundedWord.replace(frontTildeTest, '');
    } else {
            boundedWord = boundedWord.replace(frontBoundaryMark, '\\b');
    }
    if (backTildeTest.test(word)) {
        boundedWord = boundedWord.replace(backTildeTest, '');
    } else {
            boundedWord = boundedWord.replace(backBoundaryMark, '\\b');
    }
    return boundedWord;
}

exports.unTildeWord = function (word) {
    return word.replace(/^~/, '').replace(/(?<!\\)~$/, '')
                .replace(/^\\~/, '~').replace(/\\~$/, '~')
}

exports.tildeWord = function(word) {
    return word.replace(/^~/, '\\~').replace(/~$/, '\\~')
}

exports.getSensitiveRegExp = function() {    
    var sensitiveWords = $tw.wiki.getTiddlerText(WORDLIST,"");
    sensitiveWords = sensitiveWords.trim().split('\n');
    sensitiveWords = sensitiveWords.map(line => line.trim());
    sensitiveWords = sensitiveWords.filter(line => line[0] != "#");
    sensitiveWords = sensitiveWords.filter(line => line != "");
    if ($tw.wiki.getTiddlerText(WORDLIST, "yes") != "no") {
        sensitiveWords = sensitiveWords.map(this.addWordBounds);
    } else {
        sensitiveWords = sensitiveWords.map(this.unTildeWord);
    }
    return sensitiveWords.join('|');
}

exports.addToSensitiveList = function(word) {
    var sensitiveWordsText = $tw.wiki.getTiddlerText(WORDLIST,"");
    var sensitiveWords = sensitiveWordsText.split('\n');

    for (var line of sensitiveWords) {
        if (line.trim().toLowerCase() == this.tildeWord(word).toLowerCase()) {
            // Remove it if it's already in the list
            sensitiveWords = sensitiveWords.filter(item=> item!=line);
            $tw.wiki.setText(WORDLIST, "text", undefined, sensitiveWords.join('\n'));
            return;
        }
    }
    sensitiveWords.push(this.tildeWord(word));
    $tw.wiki.setText(WORDLIST, "text", undefined, sensitiveWords.join('\n'));
}

})();
