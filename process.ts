#!/usr/bin/env node --trace-uncaught
import fs from 'fs';
import path from 'path';
import yaml from 'yaml';
import extractActivities from './src/activities/extract.ts';
import convertActivities from './src/activities/convert.ts';
import extractTrainingReadiness from './src/training-readiness/extract.ts';
import convertTrainingReadiness from './src/training-readiness/convert.ts';
import type { Feature, LineString } from 'geojson';

if (process.argv.length != 5) {
    console.error('USAGE: ./process.ts /path/to/garmin-export-dir START-DATE END-DATE');
    process.exit(1);
}

const garminDir = process.argv[2];
const startDate = new Date(process.argv[3]);
const endDate = new Date(process.argv[4]);
if (isNaN(startDate.valueOf()) || isNaN(endDate.valueOf())) {
    console.error('Dates must be JavaScript parsable, e.g. 2024-07-13');
    process.exit(1);
}
const outputDir = path.join(import.meta.dirname, 'out');

await processActivities(garminDir, startDate, endDate);
processTrainingData(garminDir, startDate, endDate);
console.info('Done.');


async function processActivities(garminDir: string, startDate: Date, endDate: Date) {
    const fitRecords = await extractActivities(garminDir, startDate, endDate);
    const geojsonData: Record<string, Feature<LineString>> = fitRecords.reduce((geojsonData, record) => {
        const date = record.file_ids[0].time_created.toISOString().split('T')[0];
        const sport = record.sports[0].sport;
        geojsonData[`${date}_${sport}.geojson`] = convertActivities(record);
        return geojsonData;
    }, {});
    const activitiesOutputDir = path.join(outputDir, 'geojson');
    fs.mkdirSync(activitiesOutputDir, { recursive: true });

    Object.entries(geojsonData).forEach(([filename, geojson]) => {
        fs.writeFileSync(path.join(activitiesOutputDir, filename), JSON.stringify(geojson));
    });
}

function processTrainingData(garminDir: string, startDate: Date, endDate: Date) {
    const trainingDataOutputDir = path.join(outputDir, 'entries');
    fs.mkdirSync(trainingDataOutputDir, { recursive: true });

    extractTrainingReadiness(garminDir, startDate, endDate)
      .map(convertTrainingReadiness)
      .forEach((data) => {
        fs.writeFileSync(path.join(trainingDataOutputDir, `${data.date}.yaml`), `---\n${yaml.stringify(data)}---\n`);
      });
}
