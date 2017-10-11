

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    console.log("at the back message received-msg");
    
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
	chrome.storage.local.get(message.path, function(items) {
		if ((new Date()).toISOString().slice(0,10) !== items[message.path]) {
			var bkdate = (new Date()).toISOString().slice(0,10);
			chrome.downloads.download({
					url: URL.createObjectURL(new Blob([message.txt], {type: 'text/plain'})),
					filename: 'tiddlywikilocations/backupfiles/'+message.path.replace(new RegExp('.{' + message.path.lastIndexOf(".")  + '}'), '$&' + bkdate),
					conflictAction: 'overwrite'
				});
			chrome.storage.local.set({
			[message.path] : bkdate
		    })
	    }
	});
   
});
