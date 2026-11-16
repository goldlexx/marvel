import { fireEvent, render, screen } from '@testing-library/react';
import CharList from './CharList';
import { afterEach, vi } from 'vitest';

afterEach(() => {
  vi.unstubAllEnvs();
});

test('filters demo cards and selects a character with the keyboard-accessible button', async () => {
  vi.stubEnv('VITE_MARVEL_DEMO_MODE', 'true');
  const onCharSelected = vi.fn();

  render(<CharList onCharSelected={onCharSelected} />);

  await screen.findByRole('button', {
    name: /Solar Sentinel/i,
  });
  fireEvent.change(screen.getByLabelText('Search Marvel Comics characters'), {
    target: { value: 'tide' },
  });

  expect(await screen.findByRole('button', { name: /Tideglass/i })).not.toBeNull();
  expect(screen.queryByRole('button', { name: /Solar Sentinel/i })).toBeNull();

  fireEvent.click(screen.getByRole('button', { name: /Tideglass/i }));
  expect(onCharSelected).toHaveBeenCalledWith(9002);
});
