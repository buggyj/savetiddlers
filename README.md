# savetiddlers

## Aim
1. To enable tiddlywikis to be saved like a file, i.e. the new (modified) version overwrites the old version.
2. To provide automatic backups.

## Scope and limitations
1. This is a browser extension designed to work with chrome and other chromium based browsers, and the new firefox browser (v57 and latter).
2. Due to browser restrictions tiddlywikis must be located below a subdir of the 'Download' directory. This directory is called 'tiddlywikilocations'.
3. A test file needs to be downloaded (and then delete) to find the location of the download directory as there is no api for reading the download directory location, and this is seen by the user.

## Getting started (chrome)
1. Install by downloading (goto the release https://github.com/buggyj/savetiddlers/releases and download by click the 'source code' zip link) and unzipping (e.g. in a directory called savetiddlers). Then in chrome navigate to chrome://extensions/ and click 'load unpacked extension' and go the bsaver/extension/ directory to select the extension (it's the directory containing the 'manifest.json' file).
2. **Create a subdir called tiddlywikilocations** in the Dowload dir. 
3. Download a tiddlywiki from http://tiddlywiki.com/, and **place in that subdir**.

The name of the subdir for backups (relative position to the current TW) can be set from the option page.

## Getting started (firefox from v56)
0. Uninstall tiddlyfox thru the addons page (if it is installed).
1. Click this link to start installing.
https://github.com/buggyj/savetiddlers/releases/download/0.2/save_tiddlers-0.2-an.fx.xpi
**Create a subdir called tiddlywikilocations** in the Dowload dir. 
3. Download a tiddlywiki from http://tiddlywiki.com/, and **place in that subdir**.


## Gotchas
In chome there is the event 'onDeterminingFilename' which extensions can watch for and override the target DownloadItem.filename (some extensions move downloads into different folders by file type) which would break things. 
onDeterminingFilename has not been implemented in firefox.

The Download directory must not be beneath a directory called tiddlywikilocations.

These are tested for within the extension and if found, control is passed to the file chooser.

# 
