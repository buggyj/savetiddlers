// Saves options to chrome.storage.sync.
function save_options() {
  if (!check(document.getElementById('homedir'))) return;
  if (!check(document.getElementById('backupdir'))) return;
  chrome.storage.local.set({
    homedir:  document.getElementById('homedir').value,
    backupdir:  document.getElementById('backupdir').value,
    backuptw5: document.getElementById("backuptw5").checked,
    backuptwc: document.getElementById("backuptwc").checked,
    nag: document.getElementById("nag").checked
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}


//from https://github.com/parshap/node-sanitize-filename/
var illegalRe = /[\/\?<>\\:\*\|":]/;
var ctlRe = /[\x00-\x1f\x80-\x9f]/;
var rvRe = /^\.+$/;
var winRsRe = /^(con|prn|aux|nul|com[0-9]|lpt[0-9])(\..*)?$/i;
var winTrRe = /[\. ]+$/;

var unixRe = /[\/]/;
var unixdotsRe =/^\.|\.\.$/;

var test;

chrome.runtime.getPlatformInfo( function(info) {if(info.os === "win") {
	test = function (value){return (value.match(illegalRe) || value.match(ctlRe) 
					|| value.match(rvRe) || value.match(winRsRe) || value.match(winTrRe));}
	} else {
		test = function (value){return (value.match(unixRe) || value.match(unixdotsRe));}
	}
});
function check(element){

    if (!test(element.value)) {
        return true;
    } else {
		var error = document.getElementById('error');
			error.textContent = 'name invalid.';
		element.focus();
		setTimeout(function() {
		  error.textContent = '';
		}, 2750);
        return false;
    }
}
// Restores select box and text fields
function restore_options() {
		try {
		browser.runtime.getBrowserInfo(function(info){
			if (info.vendor != "Mozilla")document.getElementById('showand').hidden = false;
		});
	} catch(e) {document.getElementById('showand').hidden = false;}

	

  chrome.storage.local.get({
	homedir:  "tiddlywikilocations",
	backupdir:  "backupdir",
	backuptw5: true,
	backuptwc: false,
	nag: true
  }, function(items) {
    document.getElementById('homedir').value = items.homedir;
    document.getElementById('backupdir').value = items.backupdir;
    document.getElementById("backuptw5").checked = items.backuptw5;
    document.getElementById("backuptwc").checked = items.backuptwc;
    document.getElementById("nag").checked = items.nag;
  });
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);
