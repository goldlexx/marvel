class MarvelService {
  _apiBase = 'https://gateway.marvel.com:443/v1/public/';
  _apiKey = process.env.REACT_APP_MARVEL_API_KEY;
  _baseOffset = 210;

  getResource = async (url) => {
    if (!this._apiKey) {
      throw new Error('Set REACT_APP_MARVEL_API_KEY to load character data.');
    }
    const requestUrl = new URL(url);
    requestUrl.searchParams.set('apikey', this._apiKey);
    const res = await fetch(requestUrl);

    if (!res.ok) {
      throw new Error(`Could not fetch ${url}, status: ${res.status}`);
    }

    return await res.json();
  };

  getAllCharacters = async (offset = this._baseOffset) => {
    const res = await this.getResource(
      `${this._apiBase}characters?limit=9&offset=${offset}`
    );
    return res.data.results.map(this._transformCharacter);
  };

  getCharacter = async (id) => {
    const res = await this.getResource(
      `${this._apiBase}characters/${id}`
    );
    return this._transformCharacter(res.data.results[0]);
  };

  _transformCharacter = (char) => {
    return {
      id: char.id,
      name: char.name,
      description: char.description
        ? `${char.description.slice(0, 210)}...`
        : 'There is no description for this character',
      thumbnail: char.thumbnail.path + '.' + char.thumbnail.extension,
      homepage: char.urls?.find((item) => item.type === 'detail')?.url || '',
      wiki: char.urls?.find((item) => item.type === 'wiki')?.url || '',
      comics: char.comics?.items || [],
    };
  };
}

export default MarvelService;
