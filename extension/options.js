// Saves options to chrome.storage.sync.
function save_options() {
  if (!check(document.getElementById('homedir'))) return;
  if (!check(document.getElementById('backupdir'))) return;
  chrome.storage.local.set({
    homedir:  document.getElementById('homedir').value,
    backupdir:  document.getElementById('backupdir').value,
    backup: document.getElementById("backup").checked,
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
function check(element){
    var alphabet = /[\/\\]/; //disallow directory separators
    if (!element.value.match(alphabet)) {
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
	backup: false,
	nag: true
  }, function(items) {
    document.getElementById('homedir').value = items.homedir;
    document.getElementById('backupdir').value = items.backupdir;
    document.getElementById("backup").checked = items.backup;
    document.getElementById("nag").checked = items.nag;
  });
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);
