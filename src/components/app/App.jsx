import { Component } from 'react';
import AppHeader from '../appHeader/AppHeader';
import RandomChar from '../randomChar/RandomChar';
import CharList from '../charList/CharList';
import CharInfo from '../charInfo/CharInfo';
import ErrorBoundary from '../errorBoundary/ErrorBoundary';
import { isMarvelDemoMode } from '../../services/MarvelService';

class App extends Component {
  state = {
    selectedChar: null,
  };

  onCharSelected = (id) => {
    this.setState({
      selectedChar: id,
    });
  };

  render() {
    return (
      <div className='app'>
        <AppHeader />
        {isMarvelDemoMode() && (
          <p className='preview-status' role='status'>
            Demo mode: these original sample characters are not Marvel characters and are not loaded from the Marvel API.
          </p>
        )}
        <main>
          <ErrorBoundary>
            <RandomChar />
          </ErrorBoundary>
          <div className='char__content'>
            <ErrorBoundary>
              <CharList
                onCharSelected={this.onCharSelected}
                selectedCharId={this.state.selectedChar}
              />
            </ErrorBoundary>
            <ErrorBoundary>
              <CharInfo charId={this.state.selectedChar} />
            </ErrorBoundary>
          </div>
        </main>
      </div>
    );
  }
}

export default App;
