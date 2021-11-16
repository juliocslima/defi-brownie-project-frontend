import { Container } from '@material-ui/core';
import { ChainId, DAppProvider } from '@usedapp/core';
import { Header } from './components/Header';
import { Main } from './components/Main';

function App() {
  return (
    <DAppProvider config={{
      supportedChains: [ChainId.Kovan, ChainId.Rinkeby],
      notifications: {
        expirationPeriod: 1000,
        checkInterval: 1000,
      }
    }}>
      <div>
        <Header />
        <Container>
          <Main />
        </Container>
        
      </div>
    </DAppProvider>
  );
}

export default App;
