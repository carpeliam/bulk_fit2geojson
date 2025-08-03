import fs from 'fs';
import StreamZip from 'node-stream-zip';
import path from 'path';
import FitParser from 'fit-file-parser';
import type { FitRecord } from 'fit-file-parser';

let fitParser: FitParser;
if ('default' in FitParser) {
    const DefaultFitParser = FitParser.default as unknown as typeof FitParser;
    fitParser = new DefaultFitParser({ elapsedRecordField: false });
} else {
    fitParser = new FitParser({ elapsedRecordField: false });
}

export default async function extract(directoryName: string, startDate: Date, endDate: Date): Promise<FitRecord[]> {
    const zipFilePath = path.join(directoryName, 'DI_CONNECT', 'DI-Connect-Uploaded-Files');
    const zipFiles = fs.readdirSync(zipFilePath);
    const records: FitRecord[] = [];

    for (const file of zipFiles) {
        const zip = new StreamZip.async({ file: path.join(zipFilePath, file) });
        const entries = await zip.entries();

        for (const entry of Object.values(entries)) {
            const source = await zip.entryData(entry);
            try {
                if (entry.name.endsWith('.fit')) {
                    const data = await parseFit(entry.name, source);
                    const timeCreated = data.file_ids[0].time_created;
                    if (data.records.length && timeCreated && startDate <= timeCreated && timeCreated <= endDate) {
                        records.push(data);
                    }
                }
            } catch (e) {
                console.error(e);
            }
        }
    }
    return records;
}

async function parseFit(name: string, source: Buffer): Promise<FitRecord> {
    return new Promise((resolve, reject) => {
        fitParser.parse(source, (err, data) => {
            if (err) {
                reject(`${name}: ${err}`);
            } else {
                resolve(data);
            }
        })
    });
}
