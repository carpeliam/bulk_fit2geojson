# ingest-garmin

This library, intended to be run on a Garmin data export for a given timeframe, does the following:
1. Converts FIT files to GeoJSON format
2. Reduces GeoJSON file size via simplification
3. Extracts select Training Readiness Data

## Step 1: Export all data via Garmin Export
This can be done currently via Garmin's [Data Management](https://www.garmin.com/en-US/account/datamanagement/) page.
## Step 2: Run this tool over the export, giving it a timeframe to process
After you've received and unzipped your export, run this tool with the path to the export along with the start date and end date for activities:
```
npm install
./process.ts /path/to/garmin-export 2025-01-13 2025-03-15
```

Provided nothing went terribly wrong, you'll have some GeoJSON files and YAML files in the `out` folder.
