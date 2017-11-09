/*
 * parts of this file is from https://github.com/Jermolene/TiddlyWiki5
 * which is licensed under the BSD format copyright Jermolene Ruston
 */
document.addEventListener('DOMContentLoaded', injectMessageBox, false);

/*
 * we may want to download a dummy file and use the download api to see 
 * if it lands in the correct dir,
 * the backgound would set a value we read here and if set save a test file.
 */

function isTiddlyWikiClassic(doc) {
		// Test whether the document is a TiddlyWiki (we don't have access to JS objects in it)
		var versionArea = doc.getElementById("versionArea");
		return (doc.location.protocol === "file:") &&
			doc.getElementById("storeArea") &&
			(versionArea && /TiddlyWiki/.test(versionArea.text));
}

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
		
	}
		// Inject the message box
		var messageBox = doc.getElementById("tiddlyfox-message-box");
		if(!messageBox) {
			messageBox = doc.createElement("div");
			messageBox.id = "tiddlyfox-message-box";
			messageBox.style.display = "none";
			doc.body.appendChild(messageBox);
		}
		// Attach the event handler to the message box
		messageBox.addEventListener("tiddlyfox-save-file",function(event) {
		// Get the details from the message
		var message = event.target,msg = {};
		msg.path = message.getAttribute("data-tiddlyfox-path");
		msg.content = message.getAttribute("data-tiddlyfox-content");
		msg.base = message.getAttribute("data-tiddlyfox-base");
		msg.backupdir = message.getAttribute("data-tiddlyfox-backupdir");
		msg.backuppath = message.getAttribute("data-tiddlyfox-backuppath");
		// Remove the message element from the message box
		message.parentNode.removeChild(message);
		// Save the file
		saveFile(msg,function(response) {
			// Send a confirmation message
			var event1;
			console.log ("savetiddlers: response is "+response);
			if (response === "failedloc" || response === "failedpath" ) {
				alert(" TW not in "+ (base?base:"tiddlywikilocations") +" within the download directory.\n using default download directory"); 
				finishSave(msg.path,msg.content, function(response){
					event1 =doc.createEvent("Events");
					event1.initEvent("tiddlyfox-have-saved-file",true,false);
					event1.savedFilePath = msg.path;
					message.dispatchEvent(event1);
				})
			} else {
				event1 =doc.createEvent("Events");
				event1.initEvent("tiddlyfox-have-saved-file",true,false);
				event1.savedFilePath = msg.path;
				message.dispatchEvent(event1);
			}
		});


		return false;
	},false);
	}

	 function saveFile(messg,callback) {

		// Save the file
		try {
			var msg = {};
			msg.filePath = messg.path;
			msg.txt = messg.content;
			msg.type = "start";
			msg.locations = messg.base;
			msg.backupdir = messg.backupdir;
			msg.backuppath = messg.backuppath;
			console.log("from cs: we are inside downloads at "+msg.filePath);
            chrome.runtime.sendMessage(msg,callback);
			return true;
		} catch(ex) {
			alert(ex);
			return false;
		}
	}
function finishSave(filePath,content,callback) {

		// Save the file
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
