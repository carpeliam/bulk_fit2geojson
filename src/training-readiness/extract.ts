import fs, { globSync } from 'fs';
import path from 'path';

export type TrainingReadinessDTO = {
  calendarDate: string;
  sleepScore: number;
  feedbackShort: string;
  recoveryTime: number;
  recoveryTimeFactorFeedback: string;
  sleepHistoryFactorFeedback: string;
  score?: number;
};

export default function extract(directoryName: string, startDate: Date, endDate: Date): TrainingReadinessDTO[] {
  const trainingReadinessPath = path.join(directoryName, 'DI_CONNECT', 'DI-Connect-Metrics');

  return globSync(path.join(trainingReadinessPath, 'TrainingReadinessDTO*.json')).flatMap(file => {
    const trainingData = JSON.parse(fs.readFileSync(file, 'utf8')) as TrainingReadinessDTO[];

    return trainingData.filter(data =>
        startDate < new Date(data.calendarDate) && new Date(data.calendarDate) < endDate
    );
  });
}
