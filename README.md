# savetiddlers - Browser plugin to save tiddlywikis

## Getting started (firefox from v57)
1. Click this link to start installing.
https://github.com/buggyj/savetiddlers/releases/download/0.8/save_tiddlers-0.8-an.fx.xpi
2. **Create a subdir called tiddlywikilocations** in the folder firefox uses for downloads (you can see and change this location in firefoxes prefrences). 
3. Download a tiddlywiki from http://tiddlywiki.com/, and **place in that subdir**, or copy your tiddlywikis there.
4.  The user prefs need to look like similar to this ( If you type 'about:preferences' in the browsers address bar it will take you to the prefs page):

![image](https://user-images.githubusercontent.com/2855795/35642235-cfaf2e86-06c2-11e8-8e56-35f08d4d20b0.png)

The location maybe different but the option to 'alway ask where to save files' must be unselected.
## Options
There are options to create once a day backs, with the date appended to the tiddlywiki's file name. And the option to replace 'tiddlywikilocations' with another directory name of your choice, and to change the name of the back directory.

## Getting started (chrome TW5 only)
1. Install by downloading (goto the release https://github.com/buggyj/savetiddlers/releases and download by click the 'source code' zip link) and unzipping (e.g. in a directory called savetiddlers). Then in chrome navigate to chrome://extensions/ and click 'load unpacked extension' and go the bsaver/extension/ directory to select the extension (it's the directory containing the 'manifest.json' file).
2. **Create a subdir called tiddlywikilocations** in the Download dir. 
3. Download a tiddlywiki from http://tiddlywiki.com/, and **place in that subdir**, or copy your tiddlywikis there.

Note that chome with ask you to disable the 'developer mode' extensions each time you start the browser (but not with linux), as the extension was not loaded from the Chrome Web Store.

## Aim
1. to replace (as far as possible) the now defunct tiddlyfox extension, and provide backups.

## Scope and limitations
1. This is a browser extension designed to work with chrome and other chromium based browsers, and the new firefox browser (v57 and latter).
2. Due to browser restrictions tiddlywikis must be located below a subdir of the browser's download directory . The default  directory is called 'tiddlywikilocations'.
3. A test file needs to be downloaded (and then delete) to find the location of the download directory as there is no api for reading the download directory location.

## Gotchas
In chome there is the event 'onDeterminingFilename' which extensions can watch for and override the target DownloadItem.filename (some extensions move downloads into different folders by file type) which would break things. 
onDeterminingFilename has not been implemented in firefox.

## Help
If you are prompted to save with a filename of readTiddlySaverInstruction83359723 or similar then you need to look as item 4. in the 'getting started above'.
