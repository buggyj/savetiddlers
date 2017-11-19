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
		
	}
		// Inject the message box
		var messageBox = doc.getElementById("tiddlyfox-message-box");
		if(messageBox) {
			var othersw = messageBox.getAttribute("data-message-box-creator")|| null;
			if (othersw) {
				alert ("savetiddlers has detected that another tiddlysaver called "+othersw+" is install. Currently only one saver is supported therefore - savetiddlers will not activate");
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
			try{path = decodeURI(escape(message.getAttribute("data-tiddlyfox-path")))} //unescape was used insted of decodeURI
			catch(e){path = message.getAttribute("data-tiddlyfox-path")}; // in case this get fixed
		// Remove the message element from the message box
		message.parentNode.removeChild(message);
		// Save the file

		if (debouncing[path]) return;
		debouncing[path] = true;
		saveFile(path,content,function(response) {
			// Send a confirmation message
			debouncing[path] = false;
			var event1;
			console.log ("savetiddlers: response is "+response);
			if (response === "failedloc" || response === "failedpath" ) {
				chrome.storage.local.get({nag:true}, function(items) {
					if (items.nag) alert(" TW not in tiddlywikilocations within the download directory.\n using default download directory"); 
					finishSave(path,content, function(response){
						event1 =doc.createEvent("Events");
						event1.initEvent("tiddlyfox-have-saved-file",true,false);
						event1.savedFilePath = path;
						message.dispatchEvent(event1);
					})
				})
			} else {
				event1 =doc.createEvent("Events");
				event1.initEvent("tiddlyfox-have-saved-file",true,false);
				event1.savedFilePath = path;
				message.dispatchEvent(event1);
			}
		});


		return false;
	},false);
	}

	 function saveFile(filePath,content,callback) {

		// Save the file
		try {
			var msg = {};
			msg.filePath = filePath;
			msg.txt = content;
			msg.type = "start"
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
