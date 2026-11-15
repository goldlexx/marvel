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

test('fails with a clear message when the API key is missing', async () => {
  await expect(new MarvelService().getCharacter(7)).rejects.toThrow(
    'Set REACT_APP_MARVEL_API_KEY'
  );
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
  await expect(service.getCharacter(7)).rejects.toThrow('status: 503');
});
