// Saves options to chrome.storage.sync.
function save_options() {
  var backupdir = document.getElementById('backupdir').value;
  chrome.storage.local.set({
    backupdir:  backupdir,
    hour:document.getElementById("hour").checked,
    minute:false 
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}

// Restores select box and text fields
function restore_options() {
  
  chrome.storage.local.get({
	backupdir:  "backupdir",
	hour: false
  }, function(items) {
    document.getElementById('backupdir').value = items.backupdir;
    document.getElementById("hour").checked = items.hour;
  });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);
