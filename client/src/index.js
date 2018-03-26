import initOpbeat from 'opbeat-react';
import React from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import { wrapRouter } from 'opbeat-react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import ReactGA from 'react-ga';
import App from './components/App/App';
import Home from './components/Home/Home';
import './normalize.css';
import './index.css';

// opbeat performance tracking
initOpbeat({
  orgId: 'af6e6dcefd2748bebdabf76661867211',
  appId: '1c764f70b0'
});
const OpbeatRouter = wrapRouter(BrowserRouter);

// Google Analytics tracking
//if (process.env.NODE_ENV === 'production') {
  ReactGA.initialize('UA-115536526-1', {debug: true});
//}

ReactDOM.render(
  <OpbeatRouter>
    <Switch>
      <Route exact path="/home" component={Home} />
      <Route path="/course/:courseId" component={App} />
      <Route exact path="/" component={App} />
    </Switch>
  </OpbeatRouter>,
  document.getElementById('root')
);
registerServiceWorker();
