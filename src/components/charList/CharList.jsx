import { Component } from 'react';
import PropTypes from 'prop-types';

import Spinner from '../spinner/Spinner';
import MarvelService from '../../services/MarvelService';
import CharacterImage from '../characterImage/CharacterImage';
import './charList.scss';

class CharList extends Component {
  state = {
    charList: [],
    loading: true,
    error: '',
    newItemLoading: false,
    offset: 0,
    charEnded: false,
    searchTerm: '',
    searchResults: null,
    searchLoading: false,
  };

  marvelService = new MarvelService();
  searchTimeout = null;
  searchRequestId = 0;

  componentDidMount() {
    this.onRequest();
  }

  componentWillUnmount() {
    this.searchController?.abort();
    clearTimeout(this.searchTimeout);
    this.searchRequestId += 1;
  }

  onRequest = (offset) => {
    const requestOffset = offset ?? this.marvelService.getInitialOffset();
    this.onCharListLoading();
    this.marvelService
      .getAllCharacters(requestOffset)
      .then((characters) => this.onCharListLoaded(characters, requestOffset))
      .catch(this.onError);
  };

  onCharListLoading = () => {
    this.setState({ newItemLoading: true, error: '' });
  };

  onCharListLoaded = (newCharList, requestOffset) => {
    this.setState(({ charList }) => ({
      charList: [...charList, ...newCharList],
      loading: false,
      newItemLoading: false,
      offset: requestOffset + 6,
      charEnded: !this.marvelService.hasMoreCharacters(requestOffset),
    }));
  };

  onError = (error) => {
    this.setState({
      error: error.message,
      loading: false,
      newItemLoading: false,
    });
  };

  onSearchChange = (event) => {
    const searchTerm = event.target.value;
    const query = searchTerm.trim();
    this.searchController?.abort();
    clearTimeout(this.searchTimeout);
    this.searchRequestId += 1;
    const requestId = this.searchRequestId;

    this.setState({ searchTerm, error: '' });
    if (!query) {
      this.setState({ searchResults: null, searchLoading: false });
      return;
    }

    this.setState({ searchResults: [], searchLoading: true });
    this.searchTimeout = setTimeout(() => {
      this.searchController = new AbortController();
      this.marvelService
        .searchCharacters(query, this.searchController.signal)
        .then((characters) => {
          if (requestId === this.searchRequestId) {
            this.setState({ searchResults: characters, searchLoading: false });
          }
        })
        .catch((error) => {
          if (requestId === this.searchRequestId) {
            this.setState({ error: error.message, searchLoading: false });
          }
        });
    }, 300);
  };

  renderItems(arr) {
    const items = arr.map((item) => {
      let imgStyle = { objectFit: 'cover' };
      if (!item.thumbnail) {
        imgStyle = { objectFit: 'unset' };
      }

      return (
        <li key={item.id}>
          <button
            type='button'
            className={`char__item ${this.props.selectedCharId === item.id ? 'char__item_selected' : ''}`}
            aria-pressed={this.props.selectedCharId === item.id}
            onClick={() => this.props.onCharSelected(item.id)}
          >
            <CharacterImage loading="lazy" decoding="async" src={item.thumbnail} alt={item.name} style={imgStyle} />
            <span className='char__name'>{item.name}</span>
          </button>
        </li>
      );
    });
    // А эта конструкция вынесена для центровки спиннера/ошибки
    return <ul className='char__grid'>{items}</ul>;
  }

  render() {
    const {
      charList,
      loading,
      error,
      offset,
      newItemLoading,
      charEnded,
      searchTerm,
      searchResults,
      searchLoading,
    } =
      this.state;

    const visibleCharacters = searchResults === null ? charList : searchResults;
    const items = this.renderItems(visibleCharacters);

    const errorMessage = error ? <p className='char__error' role='alert'>{error}</p> : null;
    const spinner = loading || searchLoading ? <Spinner /> : null;
    return (
      <div className='char__list'>
        <label className='char__search-label' htmlFor='character-search'>
          Search Marvel Comics characters
        </label>
        <input
          id='character-search'
          className='char__search'
          type='search'
          value={searchTerm}
          onChange={this.onSearchChange}
        />
        {errorMessage}
        {spinner}
        {!loading && !searchLoading && !error && visibleCharacters.length > 0 ? items : null}
        {!loading && !searchLoading && !error && searchTerm.trim() && visibleCharacters.length === 0 ? (
          <p role='status'>No Marvel Comics characters match your search.</p>
        ) : null}
        {!loading && !searchLoading && !error && !searchTerm.trim() && charList.length === 0 ? (
          <p role='status'>No characters were returned.</p>
        ) : null}
        <button
          className='button button__main button__long'
          disabled={newItemLoading}
          hidden={charEnded || searchResults !== null}
          onClick={() => this.onRequest(offset)}
        >
          <div className='inner'>load more</div>
        </button>
      </div>
    );
  }
}

CharList.propTypes = {
  onCharSelected: PropTypes.func.isRequired,
  selectedCharId: PropTypes.number,
};

CharList.defaultProps = {
  selectedCharId: null,
};

export default CharList;
