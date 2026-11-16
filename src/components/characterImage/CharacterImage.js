import PropTypes from 'prop-types';
import fallbackImage from '../../resources/img/demo-portrait.svg';

const CharacterImage = ({ alt, ...imageProps }) => {
  const handleImageError = ({ currentTarget }) => {
    currentTarget.onerror = null;
    currentTarget.src = fallbackImage;
  };

  return <img {...imageProps} src={imageProps.src || fallbackImage} alt={alt} onError={handleImageError} />;
};

CharacterImage.propTypes = {
  alt: PropTypes.string.isRequired,
  src: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
};

CharacterImage.defaultProps = {
  src: '',
  className: undefined,
  style: undefined,
};

export default CharacterImage;
