$(document).ready(function() {
    
    var bg = $('.bg');
    
    var square = function() {
        bg.find('.square').remove();
        bg.append($('<div>', {class: 'square'}));
    };
    
    var textQueue = [];
    var currentString = [];
    
    var updateText = function() {
        if (textQueue.length <= 0 && currentString.length <= 0)
            return;
        if (currentString.length <= 0) {
            currentString = textQueue.shift(-1).split('');
            for (var i = 0; i < currentString.length; i++) {
                if (currentString[i] === '¶')
                    currentString[i] = '<br>';
            }
        }
        else {
            bg.html(bg.html() + currentString.shift(-1));
            square();
        }
        setTimeout(updateText, 24);
    };
    
    var clear = function() {
        textQueue = [];
        bg.html('');
        square();
    };
    
    var text = function(s) {
        textQueue.push(s.replace(/\n/g, '¶'));
        updateText();
    };
    
    clear();
    text('ROBCO INDUSTRIES (TM) UNIFIED OPERATING SYSTEM\n\n');
    var i = $.getScript('init.js');
    console.log(i);
    
});