

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    console.log("at the back got message.twdl");
    //show the choose file dialogue when tw not under 'tiddlywikilocations'
	if (!message.twdl) {
		chrome.downloads.download({
			url: URL.createObjectURL(new Blob([message.txt], {type: 'text/plain'})),
			filename: message.path,
			saveAs : true
		});    
	} else { 
		chrome.downloads.download({
			url: URL.createObjectURL(new Blob([message.txt], {type: 'text/plain'})),
			filename: 'tiddlywikilocations/'+message.path,
			conflictAction: 'overwrite'
		});
	}
	//once a day backup 
	chrome.storage.local.get({backupdir:"backupfiles",[message.path]:null}, function(items) {
		if ((new Date()).toISOString().slice(0,10) !== items[message.path]) {
			var bkdate = (new Date()).toISOString().slice(0,10);
			chrome.downloads.download({
					url: URL.createObjectURL(new Blob([message.txt], {type: 'text/plain'})),
					filename: 'tiddlywikilocations/'+items.backupdir+'/'+message.path.replace(new RegExp('.{' + message.path.lastIndexOf(".")  + '}'), '$&' + bkdate),
					conflictAction: 'overwrite'
				});
			chrome.storage.local.set({
			[message.path] : bkdate
		    })
	    }
	});
   
});
