import { Component } from 'react';
import Spinner from '../spinner/Spinner';
import MarvelService from '../../services/MarvelService';
import CharacterImage from '../characterImage/CharacterImage';

import './randomChar.scss';

class RandomChar extends Component {
  state = {
    char: {},
    loading: true,
    error: '',
  };

  marvelService = new MarvelService();

  componentDidMount() {
    this.updateChar();
    // this.timerId = setInterval(this.updateChar, 15000);
  }

  componentWillUnmount() {
    clearInterval(this.timerId);
  }

  onCharLoaded = (char) => {
    this.setState({
      char,
      loading: false,
    });
  };

  onCharLoading = () => {
    this.setState({
      loading: true,
      error: '',
    });
  };

  onError = (error) => {
    this.setState({
      loading: false,
      error: error.message,
    });
  };

  updateChar = () => {
    this.onCharLoading();
    this.marvelService
      .getRandomCharacter()
      .then(this.onCharLoaded)
      .catch(this.onError);
  };

  render() {
    const { char, loading, error } = this.state;
    const errorMessage = error ? <p role='alert'>{error}</p> : null;
    const spinner = loading ? <Spinner /> : null;
    const content = !(loading || error) ? <View char={char} /> : null;

    return (
      <div className='randomchar'>
        {errorMessage}
        {spinner}
        {content}
        <div className='randomchar__static'>
          <p className='randomchar__title'>
            Random character for today!
            <br />
            Do you want to get to know him better?
          </p>
          <p className='randomchar__title'>Or choose another one</p>
          <button type='button' onClick={this.updateChar} className='button button__main'>
            <div className='inner'>try it</div>
          </button>
        </div>
      </div>
    );
  }
}

const View = ({ char }) => {
  const { name, description, thumbnail, homepage, wiki } = char;
  let imgStyle = { objectFit: 'cover' };
  if (!thumbnail) {
    imgStyle = { objectFit: 'contain' };
  }

  return (
    <div className='randomchar__block'>
      <CharacterImage
        src={thumbnail}
        alt={name}
        className='randomchar__img'
        style={imgStyle}
      />
      <div className='randomchar__info'>
        <p className='randomchar__name'>{name}</p>
        <p className='randomchar__descr'>{description}</p>
        <div className='randomchar__btns'>
          {homepage ? (
            <a href={homepage} className='button button__main' target='_blank' rel='noopener noreferrer'>
              <span className='inner'>homepage</span>
            </a>
          ) : null}
          {wiki ? (
            <a href={wiki} className='button button__secondary' target='_blank' rel='noopener noreferrer'>
              <span className='inner'>Wiki</span>
            </a>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default RandomChar;
