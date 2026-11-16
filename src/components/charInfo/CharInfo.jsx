import { Component } from 'react';
import PropTypes from 'prop-types';

import MarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import Skeleton from '../skeleton/Skeleton';
import CharacterImage from '../characterImage/CharacterImage';

import './charInfo.scss';

class CharInfo extends Component {
  state = {
    char: null,
    loading: false,
    error: '',
  };

  marvelService = new MarvelService();

  componentDidMount() {
    this.updateChar();
  }

  componentDidUpdate(prevProps) {
    if (this.props.charId !== prevProps.charId) {
      this.updateChar();
    }
  }

  updateChar = () => {
    const { charId } = this.props;
    if (!charId) {
      return;
    }

    this.onCharLoading();

    this.marvelService
      .getCharacter(charId)
      .then(this.onCharLoaded)
      .catch(this.onError);
  };

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

  render() {
    const { char, loading, error } = this.state;

    const skeleton = char || loading || error ? null : <Skeleton />;
    const errorMessage = error ? <p className='char__error' role='alert'>{error}</p> : null;
    const spinner = loading ? <Spinner /> : null;
    const content = !(loading || error || !char) ? <View char={char} /> : null;

    return (
      <div className='char__info'>
        {skeleton}
        {errorMessage}
        {spinner}
        {content}
      </div>
    );
  }
}

const View = ({ char }) => {
  const {
    name,
    description,
    thumbnail,
    homepage,
    wiki,
    biography,
    appearance,
    powerstats,
    work,
  } = char;

  let imgStyle = { objectFit: 'cover' };
  if (!thumbnail) {
    imgStyle = { objectFit: 'contain' };
  }

  return (
    <>
      <div className='char__basics'>
        <CharacterImage src={thumbnail} alt={name} style={imgStyle} />
        <div>
          <div className='char__info-name'>{name}</div>
          <div className='char__btns'>
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
      <div className='char__descr'>{description}</div>
      <CharacterDetails
        biography={biography}
        appearance={appearance}
        powerstats={powerstats}
        work={work}
      />
    </>
  );
};

const CharacterDetails = ({ biography, appearance, powerstats, work }) => {
  const sections = [
    {
      title: 'Biography',
      entries: [
        ['Real name', biography.fullName],
        ['Publisher', biography.publisher],
        ['First appearance', biography.firstAppearance],
        ['Alignment', biography.alignment],
        ['Place of birth', biography.placeOfBirth],
        ['Aliases', biography.aliases],
      ],
    },
    {
      title: 'Appearance',
      entries: [
        ['Gender', appearance.gender],
        ['Race', appearance.race],
        ['Height', appearance.height],
        ['Weight', appearance.weight],
      ],
    },
    {
      title: 'Power stats',
      entries: Object.entries(powerstats).map(([stat, value]) => [
        stat.charAt(0).toUpperCase() + stat.slice(1),
        value,
      ]),
    },
    {
      title: 'Work',
      entries: [
        ['Occupation', work.occupation],
        ['Base', work.base],
      ],
    },
  ];

  return sections.map(({ title, entries }) => (
    <section key={title}>
      <h3 className='char__comics'>{title}</h3>
      <ul className='char__comics-list'>
        {entries.map(([label, value]) => (
          <li key={label} className='char__comics-item'>
            <strong>{label}:</strong> {value}
          </li>
        ))}
      </ul>
    </section>
  ));
};

CharacterDetails.propTypes = {
  biography: PropTypes.objectOf(PropTypes.string).isRequired,
  appearance: PropTypes.objectOf(PropTypes.string).isRequired,
  powerstats: PropTypes.objectOf(PropTypes.string).isRequired,
  work: PropTypes.objectOf(PropTypes.string).isRequired,
};

CharInfo.propTypes = {
  charId: PropTypes.number,
};

export default CharInfo;
