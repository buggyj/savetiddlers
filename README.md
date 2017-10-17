# bsaver - proof of concept only -

## Aim
1. To enable tiddlywikis to be saved like a file, i.e. the new (modified) version overwrites the old version.
2. To provide automatic backups.

## Scope and limitations
1. This is a browser extension designed to work with chrome and other chromium based browsers, and the new firefox browser (v57 and latter).
2. Due to browser restrictions tiddlywikis must be located below a subdir of the 'Download' directory.

## Getting started (chrome)
1. Install by downloading and unzipping. Then in chrome navigate to chrome://extensions/ and click 'load unpacked extension' and go the tiddlysaver/extension/dir to select the extension.
2. Create a subdir called tiddlywikilocations in the Dowload dir. 
3. Download a tiddlywiki from http://tiddlywiki.com/, and place in that subdir.

The name of the subdir (relative position to the current TW) can be set from the option page.

## Gotchas
In chome there is the event 'onDeterminingFilename' which extensions can watch for and override the target DownloadItem.filename (some extensions move downloads into different folders by file type) which would break things. 
onDeterminingFilename has not been implemented in firefox.

The Download directory must not be beneith a directory called tiddlywikilocations.
