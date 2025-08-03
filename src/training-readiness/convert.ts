import type { TrainingReadinessDTO } from './extract.ts';

export type TrainingReadiness = {
  date: TrainingReadinessDTO['calendarDate'];
  sleepScore: TrainingReadinessDTO['sleepScore'];
  garminFeedback: TrainingReadinessDTO['feedbackShort'];
  recoveryTime: TrainingReadinessDTO['recoveryTime'];
  recoveryTimeFactorFeedback: TrainingReadinessDTO['recoveryTimeFactorFeedback'];
  sleepHistoryFactorFeedback: TrainingReadinessDTO['sleepHistoryFactorFeedback'];
  trainingReadiness: TrainingReadinessDTO['score'];
};

export default function convert(trainingReadinessData: TrainingReadinessDTO): TrainingReadiness {
  return {
    date: trainingReadinessData.calendarDate,
    sleepScore: trainingReadinessData.sleepScore,
    garminFeedback: trainingReadinessData.feedbackShort,
    recoveryTime: trainingReadinessData.recoveryTime,
    recoveryTimeFactorFeedback: trainingReadinessData.recoveryTimeFactorFeedback,
    sleepHistoryFactorFeedback: trainingReadinessData.sleepHistoryFactorFeedback,
    trainingReadiness: trainingReadinessData.score,
  };
}
