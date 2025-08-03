import { describe, it, expect } from 'vitest';
import extract from '../../src/activities/extract';
import path from 'path';

describe('extract()', () => {
  it('returns data for FIT files within the given time frame', async () => {
    const sampleDirectory = path.join(import.meta.dirname, '..', 'sample');
    const startDate = new Date('2020-01-01');
    const endDate = new Date('2021-01-01');
    
    const fitData = await extract(sampleDirectory, startDate, endDate);

    expect(fitData).toHaveLength(1);
    expect(fitData[0]).toMatchObject({
        file_ids: [{ time_created: new Date('2020-07-15T12:31:40.000Z') }],
        sports: [{ sport: 'cycling' }],
    });
  });
});
