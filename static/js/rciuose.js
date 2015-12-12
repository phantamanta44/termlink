$(document).ready(function() {
    
    var bg = $('.bg');
    
    var square = function() {
        bg.find('.square').remove();
        bg.append($('<div>', {class: 'square'}));
    };
    
    var textQueue = [];
    var currentString = [];
    
    var updateText = function() {
        if (textQueue.length <= 0 && currentString.length <= 0) {
            textQueueLocked = false;
            return;
        }
        textQueueLocked = true;
        if (currentString.length <= 0) {
            currentString = textQueue.shift().split('');
            for (var i = 0; i < currentString.length; i++) {
                if (currentString[i] === '\ue001')
                    currentString[i] = '<br>';
            }
        }
        else {
            bg.html(bg.html() + currentString.shift());
            square();
        }
        setTimeout(updateText, 48);
    };
    
    var clear = function() {
        textQueue = [];
        bg.html('');
        square();
    };
    
    var text = function(s) {
        textQueue.push(s.replace(/\n/g, '\ue001'));
        updateText();
    };
    
    var prevStatus = 0;
    
    var parseCommand = function(cmd, args, fileName, lineNum) {
        var ln = lineNum || '?';
        var file = fileName || 'Unknown';
        switch (cmd.toLowerCase()) {
            case 'echo':
                $.each(args, function(i, obj) {
                    text(obj);
                    if (i + 1 < args.length)
                        text(' ');
                });
                text('\n');
                return 0;
            default:
                text('Unknown directive \'' + cmd + '\'\nAt directive ' + ln + ' of ' + file);
                return 127;
        }
    };
    
    var parseScript = function(s, fileName) {
        var cmds = [];
        var qStr = '', quotes = false;
        for (var i = 0; i < s.length; i++) {
            if (s[i] === ';' && s[i - 1] !== '\\' && !quotes) {
                var sep = $.trim(qStr).replace(/\\("|')/g, '$0').split(/\s/g);
                cmds.push({name: sep.shift(), args: sep});
                qStr = '';
            }
            else if ((s[i] === '\'' || s[i] === '\"') && s[i - 1] !== '\\')
                quotes = !quotes;
            else
                qStr += s[i];
        }
        for (var j = 0; j < cmds.length; j++) {
            prevStatus = parseCommand(cmds[j].name, cmds[j].args, fileName, j + 1);
            if (prevStatus === 127)
                return;
        }
    };
    
    var loadInitJs = function(diskData) {
        json = diskData;
        if (textQueue.length > 0 || currentString.length > 0) {
            setTimeout(function() {loadInitJs(diskData)}, currentString.length * 50);
            return;
        }
        text('\n\nLoading mounted holotape:\n');
        text(diskData.name);
        var initScr = diskData.data.cm;
        if (!initScr) {
            text('\nCRITICAL READ ERROR: Invalid data.init block!');
            return;
        }
        setTimeout(function() {
            clear();
            parseScript(initScr, '<init>')
        }, 3000);
    };
    
    clear();
    text('ROBCO INDUSTRIES (TM) MF BOOT AGENT V2.3.0\nCopyright 2077-2081');
    $.getJSON('init.json').promise()
        .done(loadInitJs)
        .fail(function() {
            text('\n\nCould not find a suitable init script!\n\
                Please insert an appropriate holotape and restart your machine.');
        });
    
});