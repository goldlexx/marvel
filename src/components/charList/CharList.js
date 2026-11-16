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
  };

  marvelService = new MarvelService();

  componentDidMount() {
    this.onRequest();
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
      offset: requestOffset + newCharList.length,
      charEnded: newCharList.length < 9,
    }));
  };

  onError = (error) => {
    this.setState({
      error: error.message,
      loading: false,
      newItemLoading: false,
    });
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
            <CharacterImage src={item.thumbnail} alt={item.name} style={imgStyle} />
            <span className='char__name'>{item.name}</span>
          </button>
        </li>
      );
    });
    // А эта конструкция вынесена для центровки спиннера/ошибки
    return <ul className='char__grid'>{items}</ul>;
  }

  render() {
    const { charList, loading, error, offset, newItemLoading, charEnded, searchTerm } =
      this.state;

    const filteredCharacters = charList.filter((character) =>
      `${character.name} ${character.description}`
        .toLowerCase()
        .includes(searchTerm.trim().toLowerCase())
    );
    const items = this.renderItems(filteredCharacters);

    const errorMessage = error ? <p className='char__error' role='alert'>{error}</p> : null;
    const spinner = loading ? <Spinner /> : null;
    return (
      <div className='char__list'>
        <label className='char__search-label' htmlFor='character-search'>
          Search loaded characters
        </label>
        <input
          id='character-search'
          className='char__search'
          type='search'
          value={searchTerm}
          onChange={(event) => this.setState({ searchTerm: event.target.value })}
        />
        {errorMessage}
        {spinner}
        {!loading && !error && filteredCharacters.length > 0 ? items : null}
        {!loading && !error && filteredCharacters.length === 0 && charList.length > 0 ? (
          <p role='status'>No characters match your search.</p>
        ) : null}
        {!loading && !error && charList.length === 0 ? (
          <p role='status'>No characters were returned.</p>
        ) : null}
        <button
          className='button button__main button__long'
          disabled={newItemLoading}
          hidden={charEnded}
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
