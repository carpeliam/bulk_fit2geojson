import { describe, it, expect } from 'vitest';
import extract from '../../src/training-readiness/extract';
import path from 'path';

describe('extract()', () => {
  it('returns data for FIT files within the given time frame', () => {
    const sampleDirectory = path.join(import.meta.dirname, '..', 'sample');
    const startDate = new Date('2020-01-01');
    const endDate = new Date('2021-01-01');
    
    const trainingReadinessData = extract(sampleDirectory, startDate, endDate);

    expect(trainingReadinessData).toHaveLength(4);
    trainingReadinessData.forEach(data => {
        expect(new Date(data.calendarDate).getTime()).toBeGreaterThanOrEqual(startDate.getTime());
        expect(new Date(data.calendarDate).getTime()).toBeLessThanOrEqual(endDate.getTime());
    });
  });
});
