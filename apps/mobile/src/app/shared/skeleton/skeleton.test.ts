import { Accessibility, type AccessibilitySource } from '@ng-native/device';
import { render, screen } from '@ng-native/testing';
import { expect, test } from 'vitest';
import { colors, motion, size } from '../../core/theme/tokens.ts';
import { SkeletonComponent } from './skeleton.ts';

const accessibilityWith = (reduceMotion: boolean): AccessibilitySource => ({
  current: async () => ({ screenReader: false, reduceMotion, boldText: false, fontScale: 1 }),
  subscribe: () => () => undefined,
  announce: () => undefined,
});

const renderSkeleton = (reduceMotion = false) =>
  render(SkeletonComponent, {
    inputs: { shapes: ['field', 'field', 'button'] },
    providers: [{ provide: Accessibility.SOURCE, useValue: accessibilityWith(reduceMotion) }],
  });

test('renders one block for each shape', async () => {
  await renderSkeleton();

  expect(screen.getAllByTestId('skeleton-field')).toHaveLength(2);
  expect(screen.getAllByTestId('skeleton-button')).toHaveLength(1);
});

test('gives each shape the height of the control it replaces', async () => {
  await renderSkeleton();

  expect(screen.getAllByTestId('skeleton-field')[0]?.props['height']).toBe(size.inputHeight);
  expect(screen.getByTestId('skeleton-button').props['height']).toBe(size.buttonHeight);
});

test('is coloured with the border token', async () => {
  await renderSkeleton();

  expect(screen.getAllByTestId('skeleton-field')[0]?.props['backgroundColor']).toBe(colors.light.border);
});

test('pulses for the base motion duration', async () => {
  await renderSkeleton();

  const block = screen.getAllByTestId('skeleton-field')[0];
  expect(block?.props['animationName']).toBe('skeleton-pulse');
  expect(block?.props['animationDuration']).toBe(`${motion.base}ms`);
});

test('does not pulse when the system asks to reduce motion', async () => {
  await renderSkeleton(true);

  expect(screen.getAllByTestId('skeleton-field')[0]?.props['animationName']).toBe('none');
});
