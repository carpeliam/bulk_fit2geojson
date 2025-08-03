import { describe, it, expect } from 'vitest';
import convert from '../../src/training-readiness/convert';
import { TrainingReadinessDTO } from '../../src/training-readiness/extract';

describe('convert()', () => {
  it('converts/consolidates Garmin Training Readiness JSON to necessary fields', () => {
    const sampleTrainingReadinessDTO: TrainingReadinessDTO = {
        calendarDate: '2025-08-01',
        sleepScore: 84,
        feedbackShort: 'GOOD_SLEEP_LAST_NIGHT',
        recoveryTime: 1,
        recoveryTimeFactorFeedback: 'GOOD',
        sleepHistoryFactorFeedback: 'POOR',
        score: 64,
      };
      
      const trainingReadiness = convert(sampleTrainingReadinessDTO);
      
      expect(trainingReadiness).toEqual({
        date: '2025-08-01',
        sleepScore: 84,
        garminFeedback: 'GOOD_SLEEP_LAST_NIGHT',
        recoveryTime: 1,
        recoveryTimeFactorFeedback: 'GOOD',
        sleepHistoryFactorFeedback: 'POOR',
        trainingReadiness: 64,
    });
  });
});
