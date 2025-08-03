import simplify from 'simplify-geometry';
import type { FitRecord } from 'fit-file-parser';
import type { BBox, Feature, GeoJsonProperties, LineString, Position } from 'geojson';

 export default function convert(record: FitRecord): Feature<LineString> {
    const properties: GeoJsonProperties = {};
    if (record.sports.length) {
        properties.activityType = record.sports[0].sport;
    }
    const allPoints = record.records.reduce((points: Position[], r) => {
        if (!r.position_lat || !r.position_long) {
            return points;
        }
        if (r.enhanced_altitude) {
            points.push([r.position_long, r.position_lat, r.enhanced_altitude]);
        } else {
            points.push([r.position_long, r.position_lat]);
        }
        return points;
    }, []);
    const simplifiedPoints = simplify(allPoints, 0.00004);
    const coordinates = simplifiedPoints.map(coord => coord.map(n => Math.round((n + Number.EPSILON) * 10000) / 10000));
    return {
        type: 'Feature',
        properties,
        geometry: {
            type: 'LineString',
            coordinates,
        },
        bbox: boundingBox(coordinates),
    };
}

function boundingBox(coordinates: Position[]): BBox {
    const maxLong = Math.max(...coordinates.map(c => c[0]));
    const minLong = Math.min(...coordinates.map(c => c[0]));
    const maxLat = Math.max(...coordinates.map(c => c[1]));
    const minLat = Math.min(...coordinates.map(c => c[1]));
    const maxAlt = Math.max(...coordinates.map(c => c[2]));
    const minAlt = Math.min(...coordinates.map(c => c[2]));
    return [minLong, minLat, minAlt, maxLong, maxLat, maxAlt];
}
