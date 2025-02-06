# bulk_fit2geojson

This library, intended to be run on Garmin exported FIT files, does the following:
1. Converts FIT files to GeoJSON format
2. Combines multiple activities of the same type happening on the same day
3. Reduces GeoJSON file size via simplification

## Step 1: Find Fit Files from Garmin Export
Garmin Activity files are stored as zip files in `DI_CONNECT/DI-Connect-Uploaded-Files`.
## Step 2: Unzip Fit Files
Unzip all Garmin activity files via the following command:
```sh
unzip 'path/to/DI_CONNECT/DI-Connect-Uploaded-Files/UploadedFiles*.zip' -d fit_files
```
## Specify parameters in `convert.js`
The top of `convert.js` contains a Config section where you can configure start and end date, units of measure, and simplification parameters.
## Run `convert.js`
```sh
npm install
./convert.js
```

Provided nothing went terribly wrong, you'll have some GeoJSON files in the `geojson_files` folder.
