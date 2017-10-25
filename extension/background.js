function datesArray(now,andHours,andMinutes)
{
	var date = [now.getUTCFullYear(),now.getUTCMonth(),now.getUTCDate()];
	if (andHours) {
		date.push(now.getUTCHours());
	}
	if (andMinutes) {
		date.push(now.getUTCMinutes());
	}
	return date;
}

function equalDateArrays(Ar1,Ar2) {
	if (Ar1.length !== Ar2.length) {
		return false;
	}
	for (var i = 0; i < Ar1.length; i++){
		if (Ar1[i] !== Ar2[i]) return false;
	}
	return true;
}
	
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    console.log("at the back got message.twdl");
    // show the choose file dialogue when tw not under 'tiddlywikilocations'
	if (!message.twdl) {
		chrome.downloads.download({
			url: URL.createObjectURL(new Blob([message.txt], {type: 'text/plain'})),
			filename: message.path,
			saveAs : true
		});
		return; // don't try to backup 
	} else { 
		chrome.downloads.download({
			url: URL.createObjectURL(new Blob([message.txt], {type: 'text/plain'})),
			filename: 'tiddlywikilocations/'+message.path,
			conflictAction: 'overwrite'
		});
		console.log("saved "+message.path);
	}
	// backup 
	chrome.storage.local.get({backup:false,minute:true,periodchoice:"day",period:[],backupdir:"backupdir", backedup:{}}, function(items) {
		var newvals={}, newdate = new Date(), date = datesArray(newdate,items.periodchoice == "hour",items.minute), bkdate = newdate.toISOString().slice(0,10);
		if (items.backup === false) return;
		if (equalDateArrays(date, items.period)) {
			if (items.backedup[message.path]) { 
				return;// already save in this period
			}
			// continue with this peroid
			newvals.backedup = items.backedup;
			newvals.period = items.period;
		} else {
			// new time period
			newvals.backedup = {};
			newvals.period = date;
		} 
		// remember we backedup on this filepath
		newvals.backedup[message.path] = true;
		chrome.downloads.download({
				url: URL.createObjectURL(new Blob([message.txt], {type: 'text/plain'})),
				filename: 'tiddlywikilocations/'+items.backupdir+'/'+message.path.replace(new RegExp('.{' + message.path.lastIndexOf(".")  + '}'), '$&' + bkdate),
				conflictAction: 'overwrite'
			});
		console.log("backedup "+message.path);
		chrome.storage.local.set(newvals)

	});
   
});
