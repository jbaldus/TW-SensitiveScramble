/*\
created: 20210515214348302
type: application/javascript
title: $:/plugins/jbaldus/sensitive-scramble/lib/rot13.js
tags: 
modified: 20211202014646943
module-type: library
\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

const WORDLIST="$:/plugins/jbaldus/sensitive-scramble/config/words";
const HIDDENWORDLIST="$:/plugins/jbaldus/sensitive-scramble/config/hidden-words";
const MATCH_WHOLE_WORDS="$:/plugins/jbaldus/sensitive-scramble/config/match-whole-words"
const SCRAMBLE_CONTAINING_WORD="$:/plugins/jbaldus/sensitive-scramble/config/scramble-containing-word"

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

exports.expandMatch = function(word) {
    var expandedWord = word,
        expandableFront = /^(?=[^\\b])/,
        expandableBack = /(?<!\\b)$/;
    if (word === undefined) {
        return undefined;
    }
    expandedWord = expandedWord.replace(expandableFront, '\\b\\w*');
    expandedWord = expandedWord.replace(expandableBack, "\\w*\\b");
    return expandedWord;
}

exports.getSensitiveRegExp = function() {    
    var sensitiveWords = $tw.wiki.getTiddlerText(WORDLIST,"");
    sensitiveWords += "\n"+$tw.wiki.getTiddlerText(HIDDENWORDLIST,"");
    sensitiveWords = sensitiveWords.trim().split('\n');
    sensitiveWords = sensitiveWords.map(line => line.trim());
    sensitiveWords = sensitiveWords.filter(line => line[0] != "#");
    sensitiveWords = sensitiveWords.filter(line => line != "");
    if ($tw.wiki.getTiddlerText(MATCH_WHOLE_WORDS, "yes") != "no") {
        sensitiveWords = sensitiveWords.map(this.addWordBounds);
    } else {
        sensitiveWords = sensitiveWords.map(this.unTildeWord);
    }
    if ($tw.wiki.getTiddlerText(SCRAMBLE_CONTAINING_WORD, "yes") != "no") {
        sensitiveWords = sensitiveWords.map(this.expandMatch);
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
