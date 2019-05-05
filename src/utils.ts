import * as fs from 'fs';
import * as uuid from 'uuid/v4';
import * as got from 'got';

function getDateDiffInDays(from: Date, to: Date): number {
  return Math.round((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24));
}

export function getDateDiffInDaysFromNow(date: Date): number {
  return getDateDiffInDays(new Date(), date);
}

export function getTheEndOfTheDayDate(date: number, month: number, year: number): Date {
  return new Date(year, month - 1, date, 23, 59, 59, 9999);
}

export function downloadMedia(mediaUrl: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const mediaFileName = uuid() + '.jpg';
    const stream = got.stream(mediaUrl).pipe(fs.createWriteStream(mediaFileName));

    stream.once('finish', () => {
      resolve(mediaFileName);
    });

    stream.once('error', reject);
  });
}

export function deleteFile(filePath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    fs.unlink(filePath, (err) => {
      if (err) {
        return reject(err);
      }

      resolve();
    });
  });
}
