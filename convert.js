#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import easyFitPkg from 'easy-fit';
import mapshaper from 'mapshaper';
const EasyFit = easyFitPkg.default;

/// Start Config
const startDate = new Date('2024-04-03');
const endDate = new Date('2024-08-13T14:30:00.000Z');
// See https://www.npmjs.com/package/easy-fit#api-documentation
const easyFit = new EasyFit({
    lengthUnit: 'mi',
    temperatureUnit: 'farhenheit',
    speedUnit: 'mph',
    elapsedRecordField: false,
});
const simplifyOptions = {
    percentRetained: 20,
    precision: 0.0001
};
/// End Config

const fitFileDir = path.join(import.meta.dirname, 'fit_files');
const geojsonFileDir = path.join(import.meta.dirname, 'geojson_files');

const filenames = fs.readdirSync(fitFileDir);
const data = {};
for (let i = 0; i < filenames.length; i++) {
    const filename = filenames[i];
    const fileData = await processFile(filename);
    if (fileData) {
        const key = `${fileData.file_id.time_created.toISOString().split('T')[0]}_${fileData.sport.sport}`;
        if (!data[key]) {
            data[key] = [];
        }
        data[key].push(fileData);
    }
}

Object.entries(data).forEach(([dateAndSport, activities]) => {
    createGeojson(dateAndSport, activities);
});
console.log('Done');


async function processFile(file) {
    if (!file.endsWith('.fit')) {
        return;
    }
    const source = fs.readFileSync(path.join(fitFileDir, file));
    return new Promise((resolve, reject) => {
        easyFit.parse(source, (err, data) => {
            if (err) {
                console.error("***************", err);
                reject(err);
            }
            if (!data.records.length) {
                resolve();
            }
            // console.log(data);
            const timeCreated = data.file_id.time_created;
            if (!timeCreated || startDate > timeCreated || timeCreated > endDate) {
                // list.push(timeCreated);
                resolve();
            }
            resolve(data);
        });
    });
}

function createGeojson(filename, activities) {
    const missingCoordinates = [];
    const activityType = filename.split('_')[1];
    const template = {
        type: 'FeatureCollection',
        features: [{
            type: 'Feature',
            properties: { activityType },
            geometry: {
                type: 'LineString',
            }
        }]
    };

    if (activities.length > 1) {
        console.log('multiple activities', activities.map(a => a.file_id.time_created));
    }

    const coordinates = [];
    activities.forEach(activity => {
        activity.records.forEach(record => {
            if (record.position_long != null && record.position_lat != null) {
                coordinates.push([record.position_long, record.position_lat]);
            } else {
                missingCoordinates.push(record);
            }
        });
    });

    template.features[0].geometry.coordinates = coordinates;

    const pathToOutputFile = path.join(geojsonFileDir, `${filename}.geojson`);
    mapshaper.runCommands(
        `-i ${filename} -simplify ${simplifyOptions.percentRetained}% -o ${pathToOutputFile} bbox format=geojson precision=${simplifyOptions.precision}`,
        { [filename]: template }
    );
}
