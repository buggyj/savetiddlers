

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
});
