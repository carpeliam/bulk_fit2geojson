# bulk_fit2geojson

This library, intended to be run on Garmin exported FIT files, does the following:
1. Converts FIT files to GeoJSON format
2. Reduces GeoJSON file size via simplification

## Step 1: Export files Files via Garmin Export
This can be done currently via Garmin's [Data Management](https://www.garmin.com/en-US/account/datamanagement/) page.
## Step 2: Run this tool over the export, giving it a timeframe to process
After you've received and unzipped your export, run this tool with the path to the export along with the start date and end date for activities:
```
npm install
./process.ts /path/to/garmin-export 2025-01-13 2025-03-15
```

Provided nothing went terribly wrong, you'll have some GeoJSON files in the `out` folder.
