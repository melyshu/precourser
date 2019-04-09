import React from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import ReactGA from 'react-ga';
import App from './components/App/App';
import Home from './components/Home/Home';
import './normalize.css';
import './index.css';

if (process.env.NODE_ENV === 'production') {
  // Google Analytics tracking
  ReactGA.initialize('UA-115536526-1');
}

ReactDOM.render(
  <BrowserRouter>
    <Switch>
      <Route exact path="/home" component={Home} />
      <Route path="/course/:courseId" component={App} />
      <Route exact path="/" component={App} />
    </Switch>
  </BrowserRouter>,
  document.getElementById('root')
);
registerServiceWorker();
