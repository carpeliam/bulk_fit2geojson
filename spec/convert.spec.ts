import { vi, describe, it, expect, beforeEach, afterEach, Mock } from 'vitest';
// import simplify from 'simplify-geometry';
import { FitRecord } from 'fit-file-parser';
import convert from '../src/convert';

describe('convert()', () => {
    vi.mock('simplify-geometry', () => {
        return { default: (points: number[], tolerance: number) => points };
    });

  it('converts FIT records to GeoJSON', () => {
    const sampleFitRecord: FitRecord = {
        file_ids: [],
        sports: [
            { sport: 'cycling' },
        ],
        records: [
            {
                timestamp: new Date('2020-07-15T12:31:43.000Z'),
                position_lat: 42.874507,
                position_long: -0.001652,
                altitude: 730.6,
                enhanced_altitude: 730.6,
            },
            {
                timestamp: new Date('2020-07-15T12:31:44.000Z'),
                position_lat: 42.874404,
                position_long: -0.001640,
                altitude: 730.6,
                enhanced_altitude: 730.5,
            },
        ],
    };
    
    const geoJson = convert(sampleFitRecord);

    expect(geoJson).toEqual({
        type: 'Feature',
        properties: { activityType: 'cycling' },
        geometry: {
            type: 'LineString',
            coordinates: [
                [-0.0017, 42.8745, 730.6],
                [-0.0016, 42.8744, 730.5],
            ],
        },
        bbox: [-0.0017, 42.8744, 730.5, -0.0016, 42.8745, 730.6],
    });
  });
});
