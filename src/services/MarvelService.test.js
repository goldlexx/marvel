import MarvelService from './MarvelService';

const character = {
  id: 7,
  name: 'Example Hero',
  description: 'A character description',
  thumbnail: { path: 'https://example.com/hero', extension: 'jpg' },
  urls: [
    { type: 'detail', url: 'https://example.com/details' },
    { type: 'wiki', url: 'https://example.com/wiki' },
  ],
  comics: { items: [{ name: 'Example comic' }] },
};
const originalFetch = global.fetch;

afterEach(() => {
  jest.restoreAllMocks();
  global.fetch = originalFetch;
  delete process.env.REACT_APP_MARVEL_API_KEY;
  delete process.env.REACT_APP_MARVEL_API_BASE_URL;
  delete process.env.REACT_APP_MARVEL_DEMO_MODE;
});

test('requests characters with the configured key and transforms the result', async () => {
  process.env.REACT_APP_MARVEL_API_KEY = 'test-public-key';
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ data: { results: [character] } }),
  });

  const result = await new MarvelService().getAllCharacters(3);

  expect(global.fetch).toHaveBeenCalledTimes(1);
  expect(global.fetch.mock.calls[0][0].searchParams.get('apikey')).toBe('test-public-key');
  expect(result[0]).toMatchObject({
    id: 7,
    name: 'Example Hero',
    homepage: 'https://example.com/details',
    wiki: 'https://example.com/wiki',
    comics: [{ name: 'Example comic' }],
  });
});

test('uses original local sample characters when no live API is configured', async () => {
  delete process.env.REACT_APP_MARVEL_API_KEY;
  delete process.env.REACT_APP_MARVEL_API_BASE_URL;
  delete process.env.REACT_APP_MARVEL_DEMO_MODE;
  global.fetch = jest.fn();
  const service = new MarvelService();
  const characters = await service.getAllCharacters();
  const selectedCharacter = await service.getCharacter(characters[0].id);
  const randomCharacter = await service.getRandomCharacter();

  expect(characters).toHaveLength(8);
  expect(characters[0]).toMatchObject({
    name: 'Solar Sentinel',
    description: expect.stringContaining('fictional'),
    comics: [],
  });
  expect(characters[0].thumbnail).toContain('demo-portrait.svg');
  expect(selectedCharacter).toEqual(characters[0]);
  expect(characters).toContain(randomCharacter);
  expect(global.fetch).not.toHaveBeenCalled();
});

test('handles optional character fields and HTTP errors', async () => {
  process.env.REACT_APP_MARVEL_API_KEY = 'test-public-key';
  const service = new MarvelService();
  expect(
    service._transformCharacter({
      ...character,
      urls: undefined,
      comics: undefined,
      description: '',
    })
  ).toMatchObject({ homepage: '', wiki: '', comics: [] });

  global.fetch = jest.fn().mockResolvedValue({ ok: false, status: 503 });
  await expect(service.getCharacter(7)).rejects.toThrow('unreadable response (503)');
});

test('normalizes insecure image URLs and reports empty character results', async () => {
  process.env.REACT_APP_MARVEL_API_KEY = 'test-public-key';
  const service = new MarvelService();
  expect(service._transformCharacter({
    ...character,
    thumbnail: { path: 'http://images.example.com/hero', extension: 'png' },
  }).thumbnail).toBe('https://images.example.com/hero.png');

  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ data: { results: [] } }),
  });
  await expect(service.getCharacter(999)).rejects.toThrow('did not find character 999');
});

test('supports a configured proxy base URL without a browser API key', async () => {
  process.env.REACT_APP_MARVEL_API_BASE_URL = 'https://proxy.example.com/v1/public/';
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ data: { results: [character] } }),
  });

  await new MarvelService().getCharacter(7);
  expect(global.fetch.mock.calls[0][0].origin).toBe('https://proxy.example.com');
});

test('surfaces API error payloads and malformed responses', async () => {
  process.env.REACT_APP_MARVEL_API_KEY = 'test-public-key';
  const service = new MarvelService();
  global.fetch = jest.fn().mockResolvedValue({
    ok: false,
    status: 403,
    json: async () => ({ status: 'Invalid Referer' }),
  });
  await expect(service.getCharacter(7)).rejects.toThrow('Invalid Referer');

  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ data: {} }),
  });
  await expect(service.getAllCharacters()).rejects.toThrow('missing character data');
});
