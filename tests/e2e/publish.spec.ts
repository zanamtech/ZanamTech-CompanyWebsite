import { test, expect } from '@playwright/test';
import { isPublishedAt } from '../../src/lib/publish';

// Scheduled Insights publishing (src/lib/publish.ts) with a fixed build date.
const buildDate = new Date('2026-10-15T09:00:00Z');
const article = (date: string) => ({ data: { date: new Date(date) } });

test.describe('Scheduled article publishing', { tag: '@desktop' }, () => {
  test('an article dated after the build date is left out', () => {
    expect(isPublishedAt(article('2026-10-26'), buildDate)).toBe(false);
  });

  test('an article dated on or before the build date is published', () => {
    expect(isPublishedAt(article('2026-10-12'), buildDate)).toBe(true);
  });
});
