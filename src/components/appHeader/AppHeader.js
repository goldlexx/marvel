import './appHeader.scss';

const AppHeader = () => {
  return (
    <header className='app__header'>
      <h1 className='app__title'>
        <span>Marvel</span> information portal
      </h1>
      <nav className='app__menu'>
        <ul>
          <li>
            <span>Characters</span>
          </li>
          /
          <li>
            <span>Comics</span>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default AppHeader;
