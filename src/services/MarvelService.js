import { DEMO_CHARACTERS } from './demoCharacters';

const API_BASE_URL = `${(
  import.meta.env.VITE_SUPERHERO_API_PROXY_URL ||
  'https://marvel-api-proxy.rustik-yuldashev.workers.dev/api'
).replace(/\/+$/, '')}/`;
const PAGE_SIZE = 6;
const MARVEL_CHARACTER_IDS = [620, 149, 332, 346, 106, 107, 213, 226, 303, 313, 717, 274];
const characterCache = new Map();

export const isMarvelDemoMode = () =>
  import.meta.env.VITE_MARVEL_DEMO_MODE === 'true' ||
  new URLSearchParams(window.location.search).get('demo') === 'true';

const displayValue = (value) => {
  if (Array.isArray(value)) {
    return value.filter((item) => item && item !== '-').join(', ') || 'Not available';
  }

  return value && value !== '-' ? value : 'Not available';
};

class MarvelService {
  getInitialOffset = () => 0;

  hasMoreCharacters = (offset) => {
    const catalogSize = isMarvelDemoMode() ? DEMO_CHARACTERS.length : MARVEL_CHARACTER_IDS.length;
    return offset + PAGE_SIZE < catalogSize;
  };

  getResource = async (path) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);
    let response;

    try {
      response = await fetch(
        `${API_BASE_URL}${path}`,
        { signal: controller.signal }
      );
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error('The character service request timed out. Please try again.');
      }
      throw new Error('The character service is unreachable. Check your connection and try again.');
    } finally {
      clearTimeout(timeoutId);
    }

    let payload;
    try {
      payload = await response.json();
    } catch {
      throw new Error(`SuperHero API returned an unreadable response (${response.status}).`);
    }

    if (!response.ok || payload?.response !== 'success') {
      throw new Error(payload?.error || `SuperHero API request failed (${response.status}).`);
    }

    return payload;
  };

  getAllCharacters = async (offset = this.getInitialOffset()) => {
    if (isMarvelDemoMode()) {
      return DEMO_CHARACTERS.slice(offset, offset + PAGE_SIZE);
    }

    const ids = MARVEL_CHARACTER_IDS.slice(offset, offset + PAGE_SIZE);
    const results = await Promise.allSettled(ids.map((id) => this.getCharacter(id)));
    const characters = results
      .filter((result) => result.status === 'fulfilled')
      .map((result) => result.value);

    if (characters.length === 0 && results.length > 0) {
      const failedRequest = results.find((result) => result.status === 'rejected');
      throw failedRequest.reason;
    }

    return characters;
  };

  getCharacter = async (id) => {
    if (isMarvelDemoMode()) {
      const character = DEMO_CHARACTERS.find((item) => item.id === Number(id));
      if (!character) {
        throw new Error(`Demo data does not contain character ${id}.`);
      }
      return character;
    }

    const cachedCharacter = characterCache.get(Number(id));
    if (cachedCharacter) {
      return cachedCharacter;
    }

    const payload = await this.getResource(`characters/${id}`);
    const character = this._transformCharacter(payload);
    characterCache.set(character.id, character);
    return character;
  };

  searchCharacters = async (name) => {
    const query = name.trim();
    if (!query) {
      return [];
    }

    if (isMarvelDemoMode()) {
      return DEMO_CHARACTERS.filter((character) =>
        `${character.name} ${character.description}`.toLowerCase().includes(query.toLowerCase())
      );
    }

    let payload;
    try {
      payload = await this.getResource(`search/${encodeURIComponent(query)}`);
    } catch (error) {
      if (/not found|no results?|no character/i.test(error.message)) {
        return [];
      }
      throw error;
    }
    const results = Array.isArray(payload.results) ? payload.results : [];

    return results
      .filter((character) => character.biography?.publisher === 'Marvel Comics')
      .map((character) => {
        const result = this._transformCharacter(character);
        characterCache.set(result.id, result);
        return result;
      });
  };

  getRandomCharacter = async () => {
    if (isMarvelDemoMode()) {
      return DEMO_CHARACTERS[Math.floor(Math.random() * DEMO_CHARACTERS.length)];
    }

    const cachedCharacters = Array.from(characterCache.values());
    if (cachedCharacters.length > 0) {
      return cachedCharacters[Math.floor(Math.random() * cachedCharacters.length)];
    }

    const randomId = MARVEL_CHARACTER_IDS[
      Math.floor(Math.random() * MARVEL_CHARACTER_IDS.length)
    ];
    return this.getCharacter(randomId);
  };

  _transformCharacter = (character) => {
    if (character.biography?.publisher !== 'Marvel Comics') {
      throw new Error(`${character.name || 'This character'} is not published by Marvel Comics.`);
    }

    const biography = character.biography || {};
    const appearance = character.appearance || {};
    const imageUrl = character.image?.url || '';

    return {
      id: Number(character.id),
      name: character.name || 'Unknown character',
      description: [
        biography['full-name'] && biography['full-name'] !== '-'
          ? `Real name: ${biography['full-name']}`
          : '',
        biography['first-appearance'] && biography['first-appearance'] !== '-'
          ? `First appearance: ${biography['first-appearance']}`
          : '',
        biography.alignment && biography.alignment !== '-'
          ? `Alignment: ${biography.alignment}`
          : '',
      ].filter(Boolean).join(' · ') || 'No biography details are available.',
      thumbnail: imageUrl.replace(/^httpss?:/i, 'https:'),
      homepage: '',
      wiki: '',
      comics: [],
      biography: {
        fullName: displayValue(biography['full-name']),
        publisher: displayValue(biography.publisher),
        firstAppearance: displayValue(biography['first-appearance']),
        alignment: displayValue(biography.alignment),
        placeOfBirth: displayValue(biography['place-of-birth']),
        aliases: displayValue(biography.aliases),
      },
      appearance: {
        gender: displayValue(appearance.gender),
        race: displayValue(appearance.race),
        height: displayValue(appearance.height),
        weight: displayValue(appearance.weight),
      },
      powerstats: Object.fromEntries(
        Object.entries(character.powerstats || {}).map(([stat, value]) => [stat, displayValue(value)])
      ),
      work: {
        occupation: displayValue(character.work?.occupation),
        base: displayValue(character.work?.base),
      },
    };
  };
}

export default MarvelService;
