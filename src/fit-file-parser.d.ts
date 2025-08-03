declare module 'fit-file-parser' {
    export type FitRecord = {
        file_ids: {
            time_created: Date,
        }[];
        sports: {
            sport: string;
            name?: string;
            sub_sport?: string;
        }[];
        records: {
            timestamp: Date;
            position_lat?: number;
            position_long?: number;
            altitude?: number;
            enhanced_altitude?: number;
        }[];
    };

    type FitParserOpts = Partial<{
        mode: 'cascade' | 'list' | 'both';
        lengthUnit: 'm' | 'km' | 'mi';
        temperatureUnit: 'celsius' | 'kelvin' | 'fahrenheit';
        speedUnit: 'm/s' | 'km/h' | 'mph';
        force: boolean;
        elapsedRecordField: boolean;
    }>

    class FitParser {
        constructor(opts: FitParserOpts | undefined);
        parse(source: Buffer, callback: (err: string | null, data: FitRecord) => void): void;
    }
    export default FitParser;
}
