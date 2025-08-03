#!/usr/bin/env node --trace-uncaught
import fs from 'fs';
import path from 'path';
import extract from './src/extract.ts';
import convert from './src/convert.ts';
import type { Feature, LineString } from 'geojson';

if (process.argv.length != 5) {
    console.error('USAGE: ./extract.js /path/to/garmin-export-dir START-DATE END-DATE');
    process.exit(1);
}

const garminDir = process.argv[2];
const startDate = new Date(process.argv[3]);
const endDate = new Date(process.argv[4]);
if (isNaN(startDate.valueOf()) || isNaN(endDate.valueOf())) {
    console.error('Dates must be JavaScript parsable, e.g. 2024-07-13');
    process.exit(1);
}

const fitRecords = await extract(garminDir, startDate, endDate);
const geojsonData: Record<string, Feature<LineString>> = fitRecords.reduce((geojsonData, record) => {
    const date = record.file_ids[0].time_created.toISOString().split('T')[0];
    const sport = record.sports[0].sport;
    geojsonData[`${date}_${sport}.geojson`] = convert(record);
    return geojsonData;
}, {});
Object.entries(geojsonData).forEach(([filename, geojson]) => {
    fs.writeFileSync(path.join(import.meta.dirname, 'out', filename), JSON.stringify(geojson));
});
console.info('Done.');
