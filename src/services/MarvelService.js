import { DEMO_CHARACTERS } from './demoCharacters';

export const isMarvelDemoMode = () =>
  import.meta.env.VITE_MARVEL_DEMO_MODE === 'true' ||
  (!import.meta.env.VITE_MARVEL_API_KEY &&
    !import.meta.env.VITE_MARVEL_API_BASE_URL);

class MarvelService {
  _apiBase = `${(import.meta.env.VITE_MARVEL_API_BASE_URL || 'https://gateway.marvel.com/v1/public/').replace(/\/+$/, '')}/`;
  _apiKey = import.meta.env.VITE_MARVEL_API_KEY;
  _baseOffset = 210;

  getInitialOffset = () => (isMarvelDemoMode() ? 0 : this._baseOffset);

  getResource = async (url) => {
    if (!this._apiKey && !import.meta.env.VITE_MARVEL_API_BASE_URL) {
      throw new Error('Set VITE_MARVEL_API_KEY to load character data.');
    }
    const requestUrl = new URL(url);
    if (this._apiKey) {
      requestUrl.searchParams.set('apikey', this._apiKey);
    }

    let response;
    try {
      response = await fetch(requestUrl);
    } catch {
      throw new Error('Marvel API is unreachable. Check your connection and try again.');
    }

    let payload;
    try {
      payload = await response.json();
    } catch {
      throw new Error(`Marvel API returned an unreadable response (${response.status}).`);
    }

    if (!response.ok) {
      throw new Error(payload.status || `Marvel API request failed (${response.status}).`);
    }

    if (!Array.isArray(payload?.data?.results)) {
      throw new Error('Marvel API response is missing character data.');
    }

    return payload;
  };

  getAllCharacters = async (offset = this.getInitialOffset()) => {
    if (isMarvelDemoMode()) {
      return DEMO_CHARACTERS.slice(offset, offset + 9);
    }

    const res = await this.getResource(
      `${this._apiBase}characters?limit=9&offset=${offset}`
    );
    return res.data.results.map(this._transformCharacter);
  };

  getCharacter = async (id) => {
    if (isMarvelDemoMode()) {
      const character = DEMO_CHARACTERS.find((item) => item.id === Number(id));
      if (!character) {
        throw new Error(`Demo data does not contain character ${id}.`);
      }
      return character;
    }

    const res = await this.getResource(
      `${this._apiBase}characters/${id}`
    );
    const character = res.data.results[0];
    if (!character) {
      throw new Error(`Marvel API did not find character ${id}.`);
    }
    return this._transformCharacter(character);
  };

  getRandomCharacter = async () => {
    if (isMarvelDemoMode()) {
      return DEMO_CHARACTERS[Math.floor(Math.random() * DEMO_CHARACTERS.length)];
    }

    const offset = Math.floor(Math.random() * 1500);
    const characters = await this.getAllCharacters(offset);
    if (characters.length === 0) {
      throw new Error('Marvel API returned no characters for this request.');
    }
    return characters[Math.floor(Math.random() * characters.length)];
  };

  _transformCharacter = (char) => {
    return {
      id: char.id,
      name: char.name,
      description: char.description
        ? `${char.description.slice(0, 210)}${char.description.length > 210 ? '…' : ''}`
        : 'There is no description for this character',
      thumbnail: char.thumbnail?.path
        ? `${char.thumbnail.path.replace(/^http:/, 'https:')}.${char.thumbnail.extension || 'jpg'}`
        : '',
      homepage: char.urls?.find((item) => item.type === 'detail')?.url || '',
      wiki: char.urls?.find((item) => item.type === 'wiki')?.url || '',
      comics: char.comics?.items || [],
    };
  };
}

export default MarvelService;
