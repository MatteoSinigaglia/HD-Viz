import '../css/App.css';
import { Link, Redirect, Route, BrowserRouter as Router, Switch } from 'react-router-dom';
import MainController, { MainControllerContext } from '../../controller/MainController';
import React, { useEffect, useState } from 'react';
import Store, { StoreContext } from '../../store/Store';
import BuildGraph from './BuildGraph';
import Header from './Header';
import Vizualization from './Vizualization';

const store = new Store();
const mainController = new MainController(store);

const App = () => {
  const [storeDefined, setStoreDefined] = useState(false)
  const i = 1;

  useEffect(() => {
    // eslint-disable-next-line no-unused-expressions
    store.originalData.length > 0 ? setStoreDefined(true) : setStoreDefined(false);
  }, [])

  return (
    <StoreContext.Provider value={store}>
      <MainControllerContext.Provider value={mainController}>
        <div className="App">
          <Router>
            <Header />
            <ul>
              <li><Link to="/">Cambia dati</Link></li>
              <li><Link to="/dataset">Gestisci dataset</Link></li>
              <li><Link to="/help">Aiuto</Link></li>
            </ul>
            <Switch>
              <Route exact path="/">
                <BuildGraph />
              </Route>
              <Route path="/visualization">
                { storeDefined ? <Vizualization algoritmoGrafico="pca" tipoGrafico="scpm" distanzaGrafico="euclidean" onDelete={idx => console.log(`Eliminato ${idx}`)} key={i} index={i} /> : <Redirect to="/" /> }
              </Route>
              <Route path="/dataset">
                <div>Gestion dataset</div>
              </Route>
              <Route path="/help">
                <div>Manuale</div>
              </Route>
            </Switch>
          </Router>
        </div>

      </MainControllerContext.Provider>
    </StoreContext.Provider>
  );
};

export default App;
