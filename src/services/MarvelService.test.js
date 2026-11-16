import MarvelService from './MarvelService';
import { afterEach, vi } from 'vitest';

const makeCharacter = (overrides = {}) => ({
  response: 'success',
  id: '620',
  name: 'Spider-Man',
  powerstats: {
    intelligence: '90',
    strength: '55',
    speed: '67',
    durability: '75',
    power: '74',
    combat: '85',
  },
  biography: {
    'full-name': 'Peter Parker',
    'first-appearance': 'Amazing Fantasy #15',
    publisher: 'Marvel Comics',
    alignment: 'good',
    'place-of-birth': 'New York City',
    aliases: ['Spidey'],
  },
  appearance: {
    gender: 'Male',
    race: 'Human',
    height: ["5'10", '178 cm'],
    weight: ['167 lb', '75 kg'],
  },
  work: { occupation: 'Photographer', base: 'New York City' },
  image: { url: 'https://example.com/spider-man.jpg' },
  ...overrides,
});

const originalFetch = global.fetch;

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllEnvs();
  global.fetch = originalFetch;
});

test('loads curated Marvel characters and transforms their API data', async () => {
  vi.stubEnv('VITE_MARVEL_DEMO_MODE', 'false');
  global.fetch = vi.fn(async (url) => {
    const id = new URL(url).pathname.split('/').pop();
    return { ok: true, json: async () => makeCharacter({ id }) };
  });

  const result = await new MarvelService().getAllCharacters();

  expect(global.fetch).toHaveBeenCalledTimes(6);
  expect(new URL(global.fetch.mock.calls[0][0]).pathname).toMatch(/\/characters\/620$/);
  expect(result[0]).toMatchObject({
    id: 620,
    name: 'Spider-Man',
    thumbnail: 'https://example.com/spider-man.jpg',
    biography: { fullName: 'Peter Parker', publisher: 'Marvel Comics' },
    powerstats: { intelligence: '90', strength: '55' },
  });
});

test('keeps the original local demo dataset available', async () => {
  vi.stubEnv('VITE_MARVEL_DEMO_MODE', 'true');
  global.fetch = vi.fn();
  const service = new MarvelService();
  const characters = await service.getAllCharacters();
  const selectedCharacter = await service.getCharacter(characters[0].id);
  const randomCharacter = await service.getRandomCharacter();

  expect(characters).toHaveLength(6);
  expect(characters[0]).toMatchObject({
    name: 'Solar Sentinel',
    description: expect.stringContaining('fictional'),
    biography: { publisher: 'Demo' },
  });
  expect(characters[0].thumbnail).toContain('data:image/svg+xml');
  expect(selectedCharacter).toEqual(characters[0]);
  expect(characters).toContain(randomCharacter);
  expect(global.fetch).not.toHaveBeenCalled();
});

test('normalizes optional character fields and image URLs', () => {
  const service = new MarvelService();
  const character = service._transformCharacter(makeCharacter({
    biography: { publisher: 'Marvel Comics' },
    appearance: undefined,
    powerstats: undefined,
    work: undefined,
    image: { url: 'httpss://images.example.com/hero.png' },
  }));

  expect(character).toMatchObject({
    thumbnail: 'https://images.example.com/hero.png',
    biography: { fullName: 'Not available', publisher: 'Marvel Comics' },
    appearance: { gender: 'Not available' },
    powerstats: {},
    work: { occupation: 'Not available' },
  });
});

test('rejects characters from publishers other than Marvel Comics', () => {
  const service = new MarvelService();
  expect(() => service._transformCharacter(makeCharacter({
    biography: { publisher: 'DC Comics' },
  }))).toThrow('is not published by Marvel Comics');
});

test('searches by name and filters results to Marvel Comics', async () => {
  vi.stubEnv('VITE_MARVEL_DEMO_MODE', 'false');
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => ({
      response: 'success',
      results: [
        makeCharacter(),
        makeCharacter({ id: '69', name: 'Batman', biography: { publisher: 'DC Comics' } }),
      ],
    }),
  });

  const results = await new MarvelService().searchCharacters('Spider-Man');

  expect(new URL(global.fetch.mock.calls[0][0]).pathname).toMatch(/\/search\/Spider-Man$/);
  expect(results).toHaveLength(1);
  expect(results[0].name).toBe('Spider-Man');
});

test('reports API errors and unreadable responses', async () => {
  vi.stubEnv('VITE_MARVEL_DEMO_MODE', 'false');
  const service = new MarvelService();
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ response: 'error', error: 'Invalid access token' }),
  });
  await expect(service.getCharacter(999)).rejects.toThrow('Invalid access token');

  global.fetch = vi.fn().mockResolvedValue({
    ok: false,
    status: 503,
    json: async () => { throw new Error('bad JSON'); },
  });
  await expect(service.getCharacter(998)).rejects.toThrow('unreadable response (503)');
});
