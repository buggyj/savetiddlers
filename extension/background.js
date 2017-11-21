var testmode = false; //set to true to avoid path test
var minutebacks = false; //set to true to allow backs every minute for testing

var tiddlywikilocations = "tiddlywikilocations";
var  $ = {"/":"/"};

var testfilecontent = "This is a test file for savetiddlers extension";

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

var os = "notwin";
chrome.runtime.getPlatformInfo( function(info) {if(info.os == "win") { $["/"] = "\\"; os = "win";}});

var testbase ;//	tiddlywikilocations+$["/"]+'readTiddlySaverInstruction';
var round = '59723833'; //by rotating this string of digits we can have 8 unique named test files for simutaneous use
						//ie testpath = testbase+round+'.html';rotate(round) for next test file
var rlen = round.length - 1;



chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
    console.log("savetiddlersbg: got request");
    

    function dodownload (msg,tiddlywikilocations){					
	chrome.downloads.download({
		url: URL.createObjectURL(new Blob([msg.txt], {type: 'text/plain'})),
		filename: tiddlywikilocations+$["/"]+ msg.path,
		conflictAction: 'overwrite'
	},
	function(id) {
		console.log("savetiddlers: saved "+msg.path);
		chrome.storage.local.get({backuptw5:true,backuptwc:false,periodchoice:"day",period:[],backupdir:"backupdir",backedup:{}}, function(items) {
			var newvals={}, newdate = new Date(), 
				date = datesArray(newdate,items.periodchoice == "hour",minutebacks), 
				bkdate = newdate.toISOString().slice(0,10);
			if ((msg.tw5 && items.backuptw5 === false) || (!msg.tw5 && items.backuptwc === false)) {
				sendResponse ({status:"saved"});
				return;
			}
			if (equalDateArrays(date, items.period)) {
				if (items.backedup[msg.path]) { 
					sendResponse ({status:"saved"});
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
			newvals.backedup[msg.path] = true;
			chrome.downloads.download({
					url: URL.createObjectURL(new Blob([msg.txt], {type: 'text/plain'})),
					filename: tiddlywikilocations+$["/"]+items.backupdir+$["/"]+msg.path.replace(new RegExp('.{' + msg.path.lastIndexOf(".")  + '}'), '$&' + bkdate),
					conflictAction: 'overwrite'
				},function(id){sendResponse({status:"backupsaved"});});
			console.log("savetiddlersbg: backedup "+msg.path);
			chrome.storage.local.set(newvals);
		});
	});
}

	////////////////////////// start ///////////////////////////////
	if (msg.type === "start") {
		console.log("savetiddlersbg: start");
		chrome.storage.local.get({homedir:  "tiddlywikilocations"}, function(parms) {
		tiddlywikilocations = parms.homedir;
		testbase = tiddlywikilocations+$["/"]+'readTiddlySaverInstruction';
		var path, firstloc = msg.filePath.indexOf($["/"]+tiddlywikilocations+$["/"]);
		
		msg.fPath = msg.filePath.substring(0, firstloc);
		if (firstloc === -1) {
			console.log("file not in a sudir to "+tiddlywikilocations+", it must be saved to the download dir");
			path = msg.filePath.split($["/"]);
			msg.path = path[path.length-1];
			msg.twdl = false;
		}
		else {
			msg.path = msg.filePath.slice(firstloc+tiddlywikilocations.length + "//".length);
			msg.twdl = true;
		}
		console.log("savetiddlersbg: background 3nd step");
		// show the choose file dialogue when tw not under 'tiddlywikilocations'
		if (!msg.twdl) {
			console.log("savetiddlersbg: not in "+tiddlywikilocations+" "+msg.path);
			sendResponse({status:"failedloc",location:tiddlywikilocations});
		} else if (testmode) {
			console.log("savetiddlersbg: avoid path testing");
			dodownload(msg,tiddlywikilocations);//avoid path testing
		} else{ 
			// first download check our destination is valid by download a dummy file first and then reading back the filepath	
			round = round[rlen] + round.substring(0, rlen);
			chrome.downloads.download({
				url: URL.createObjectURL(new Blob([testfilecontent], {type: 'text/plain'})),
				filename: testbase+round+'.html',
				conflictAction: 'overwrite'
				},function(id){chrome.downloads.onChanged.addListener(function hearchange(deltas){
					// wait for completion
					if (deltas.id == id && deltas.state && deltas.state.current === "complete") {
						chrome.downloads.onChanged.removeListener(hearchange);
						chrome.downloads.search({id:id}, function(x){
							var bodyy = msg.fPath, bodyx = x[0].filename.split($["/"]+testbase)[0];
							if (os === "win") {//make drive letters the same case
								bodyy = bodyy.replace(/^./g, bodyy[0].toLowerCase());
								bodyx = bodyx.replace(/^./g, bodyx[0].toLowerCase());
							}  
							if (bodyy === bodyx) {
								// All tests passed!
								dodownload(msg,tiddlywikilocations);
							} else {				
								console.log("savetiddlersbg: failed path "+msg.fPath +"!="+x[0].filename.split($["/"]+testbase)[0]);
								sendResponse({status:"failedpath",path:x[0].filename.split($["/"]+testbase)[0]});
							}
							
							chrome.downloads.removeFile(id,function(){chrome.downloads.erase({id:id})});//move this further up
						});
								
					}
					//
				})}
			)
		}
		});
		return true;
	} else {
			console.log("savetiddlersbg: start finish");
			var path = msg.filePath.split($["/"]);
			path = path[path.length-1];
			chrome.downloads.download({
				url: URL.createObjectURL(new Blob([msg.txt], {type: 'text/plain'})),
				filename: tiddlywikilocations+$["/"]+path,
				saveAs : true
			},function(id){
				if (id === undefined) {
					sendResponse({status:"cancelled"});
					console.log("savetiddlersbg: sent cancelled");
				} else {
					chrome.downloads.onChanged.addListener(function hearchange2(deltas){
						if (deltas.id == id && deltas.state && deltas.state.current === "interrupted") { 
							sendResponse({status:"cancelled"});
							console.log("savetiddlersbg: sent cancelled");
							chrome.downloads.onChanged.removeListener(hearchange2);return true;
						}
						// wait for completion
						if (deltas.id == id && deltas.state && deltas.state.current === "complete") {
							chrome.downloads.onChanged.removeListener(hearchange2);
							console.log("savetiddlersbg: finishing manual save");
							chrome.downloads.search({id:id}, function(x){
								var bodyy = msg.filePath, bodyx = x[0].filename.split($["/"]+testbase)[0];
								if (os === "win") {//make drive letters the same case
									bodyy = bodyy.replace(/^./g, bodyy[0].toLowerCase());
									bodyx = bodyx.replace(/^./g, bodyx[0].toLowerCase());
								}
								console.log("savetiddlersbg: last paths "+msg.filePath +"!="+x[0].filename.split($["/"]+testbase)[0]);
								if (bodyy === bodyx) {
									sendResponse({status:"saved", newlocal:null});return true;
								} else {
									sendResponse({status:"saved",newlocal:x[0].filename});return true;
								}										
							});
							return true;
						}
					return true;})
				}
			});
	}return true;
});


