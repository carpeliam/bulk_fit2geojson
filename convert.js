#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import easyFitPkg from 'easy-fit';
import simplify from 'simplify-geometry';
const EasyFit = easyFitPkg.default;

/// Start Config
const startDate = new Date('2024-04-03');
const endDate = new Date('2024-08-13T14:30:00.000Z');
const feetPerMeter = 100 / 2.54 / 12; // 100cm / (2.54cm/in) / (12in/ft)
function altitude(n) {
    return (n - 1000) * feetPerMeter;
}
// See https://www.npmjs.com/package/easy-fit#api-documentation
const easyFit = new EasyFit({ elapsedRecordField: false });
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
        type: 'Feature',
        properties: { activityType },
        geometry: {
            type: 'LineString',
        }
    };

    if (activities.length > 1) {
        console.log('multiple activities', activities.map(a => a.file_id.time_created));
    }

    const coordinates = [];
    let maxLong, minLong, maxLat, minLat, maxAlt, minAlt;
    activities.forEach(activity => {
        activity.records.forEach(record => {
            if (record.position_long != null && record.position_lat != null) {
                if (!maxLong || maxLong < record.position_long) {
                    maxLong = record.position_long;
                }
                if (!minLong || minLong > record.position_long) {
                    minLong = record.position_long;
                }
                if (!maxLat || maxLat < record.position_lat) {
                    maxLat = record.position_lat;
                }
                if (!minLat || minLat > record.position_lat) {
                    minLat = record.position_lat;
                }
                if (!maxAlt || maxAlt < record.enhanced_altitude) {
                    maxAlt = record.enhanced_altitude;
                }
                if (!minAlt || minAlt > record.enhanced_altitude) {
                    minAlt = record.enhanced_altitude;
                }
                coordinates.push([record.position_long, record.position_lat, altitude(record.enhanced_altitude)]);
            } else {
                missingCoordinates.push(record);
            }
        });
    });

    template.geometry.coordinates = simplify(coordinates, 0.00005).map(coord => coord.map(n => Math.round((n + Number.EPSILON) * 10000) / 10000));
    template.bbox = [minLong, minLat, altitude(minAlt), maxLong, maxLat, altitude(maxAlt)].map(n => Math.round((n + Number.EPSILON) * 10000) / 10000);

    const pathToOutputFile = path.join(geojsonFileDir, `${filename}.geojson`);
    fs.writeFileSync(pathToOutputFile, JSON.stringify(template));
}
