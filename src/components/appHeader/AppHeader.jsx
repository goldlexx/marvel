import './appHeader.scss';

const AppHeader = () => {
  return (
    <header className='app__header'>
      <h1 className='app__title'>
        <span>Character</span> explorer
      </h1>
      <nav className='app__menu'>
        <ul>
          <li>
            <span aria-current='page'>Characters</span>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default AppHeader;
