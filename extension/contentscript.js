/*
 * parts of this file is from https://github.com/Jermolene/TiddlyWiki5
 * which is licensed under the BSD format copyright Jermolene Ruston
 */
document.addEventListener('DOMContentLoaded', injectMessageBox, false);

var patherrormsg = "Automatic saving not possible.\nAs your TW is not within the contolled directory a manual save is required";
var othersaver1 = "savetiddlers has detected that another tiddlysaver called ";
var othersaver2 = " is install. Currently only one saver is supported therefore - savetiddlers will not activate";

var backup = true;
var tw5 = true;
/*
 * we may want to download a dummy file and use the download api to see 
 * if it lands in the correct dir,
 * the backgound would set a value we read here and if set save a test file.
 */
 	
function currentlocation() {
		// Get the pathname of this document
		var pathname = window.location.toString().split("#")[0];
		// Replace file://localhost/ with file:///
		if(pathname.indexOf("file://localhost/") === 0) {
			pathname = "file://" +pathname.substr(16);
		}
		// Windows path file:///x:/blah/blah --> x:\blah\blah
		if(/^file\:\/\/\/[A-Z]\:\//i.test(pathname)) {
			// Remove the leading slash and convert slashes to backslashes
			pathname = decodeURI(pathname.substr(8)).replace(/\//g,"\\");
		// Firefox Windows network path file://///server/share/blah/blah --> //server/share/blah/blah
		} else if(pathname.indexOf("file://///") === 0) {
			pathname = "\\\\" + decodeURI(pathname.substr(10)).replace(/\//g,"\\");
		// Mac/Unix local path file:///path/path --> /path/path
		} else if(pathname.indexOf("file:///") === 0) {
			pathname = decodeURI(pathname.substr(7));
		// Mac/Unix local path file:/path/path --> /path/path
		} else if(pathname.indexOf("file:/") === 0) {
			pathname = decodeURI(pathname.substr(5));
		// Otherwise Windows networth path file://server/share/path/path --> \\server\share\path\path
		} else {
			pathname = "\\\\" + decodeURI(pathname.substr(7)).replace(new RegExp("/","g"),"\\");
		}
		
		return pathname;
	}
 
function isTiddlyWikiClassic(doc) {
		// Test whether the document is a TiddlyWiki (we don't have access to JS objects in it)
		var versionArea = doc.getElementById("versionArea");
		return (doc.location.protocol === "file:") &&
			doc.getElementById("storeArea") &&
			(versionArea && /TiddlyWiki/.test(versionArea.text));
}

var debouncing =[];

function injectMessageBox(doc) {
	var s;
	doc = document;
	if (isTiddlyWikiClassic(doc)) {
		s = document.createElement('script');
		s.src = chrome.extension.getURL('script.js');
		(document.head||document.documentElement).appendChild(s);
		s.onload = function() {
			s.parentNode.removeChild(s);
		};
	tw5 = false;
	}
		// Inject the message box
		var messageBox = doc.getElementById("tiddlyfox-message-box");
		if(messageBox) {
			var othersw = messageBox.getAttribute("data-message-box-creator")|| null;
			if (othersw) {
				alert (othersaver1+othersw+othersaver2);
				return;
			} else {
				messageBox.setAttribute("data-message-box-creator","savetiddlers");
			} 
		} else {
			messageBox = doc.createElement("div");
			messageBox.id = "tiddlyfox-message-box";
			messageBox.style.display = "none";
			messageBox.setAttribute("data-message-box-creator","savetiddlers");
			doc.body.appendChild(messageBox);
		}
		// Attach the event handler to the message box
		messageBox.addEventListener("tiddlyfox-save-file",function(event) {
		// Get the details from the message
		var message = event.target,
			path, 
			content = message.getAttribute("data-tiddlyfox-content");		
			path = currentlocation();
		// Remove the message element from the message box
		message.parentNode.removeChild(message);
		// Save the file

		if (debouncing[path]) return;
		debouncing[path] = true;
		saveFile(path,content,backup,tw5,function(response) {
			// Send a confirmation message
			debouncing[path] = false;
			var event1;
			console.log ("savetiddlers: response is "+response.status);
			if (response.status === "failedloc" || response.status === "failedpath" ) {
				chrome.storage.local.get({nag:true}, function(items) {
					if (items.nag) alert(patherrormsg); 
					finishSave(path,content, function(response){
						// from saveAs
						console.log ("savetiddlers: finishSave "+response.status);
						if (response.status === "saved") {
							if (response.newlocal) {
								alert("you tiddlywiki has been saved to a new location \n" +response.newlocal);
							}
							event1 =doc.createEvent("Events");
							event1.initEvent("tiddlyfox-have-saved-file",true,false);
							event1.savedFilePath = path;
							message.dispatchEvent(event1);
						} 
						else {
							console.log ("savetiddlers: SAVEFAILURE");
							//send failed
						}

					})
				})
			} else {
				console.log ("savetiddlers: savefile");
				event1 =doc.createEvent("Events");
				event1.initEvent("tiddlyfox-have-saved-file",true,false);
				event1.savedFilePath = path;
				message.dispatchEvent(event1);
			}
		});
		return false;
	},false);
	}

	 function saveFile(filePath,content,backup,tw5,callback) {

		// Save the file
		try {
			var msg = {};
			msg.filePath = filePath;
			msg.txt = content;
			msg.backup = backup;
			msg.type = "start";
			msg.tw5 = tw5;
			console.log("from cs: we are inside downloads at "+msg.filePath);
            chrome.runtime.sendMessage(msg,callback);
			return true;
		} catch(ex) {
			alert(ex);
			return false;
		}
	}
function finishSave(filePath,content,callback) {

		// Save the file without control
		try {
			var msg = {};
			msg.filePath = filePath;
			msg.txt = content;
			msg.type = "finish"
			console.log("from cs2: we are inside downloads at "+msg.filePath);
            chrome.runtime.sendMessage(msg,callback);
			return true;
		} catch(ex) {
			alert(ex);
			return false;
		}
	}
