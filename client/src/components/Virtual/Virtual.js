// A virtual component to handle ajax requests
const Virtual = {};

// https://stackoverflow.com/questions/44326797/express-session-not-working-for-ajax-call
// (same problem for ../registerServiceWorker.js)
const fetchJson = function(string, init) {
  if (!init) init = {};
  init.credentials = 'same-origin';
  return fetch(string, init)
    .then(response => {
      if (response.status >= 200 && response.status < 300) {
        return response;
      }

      const error = new Error(`HTTP Error ${response.statusText}`);
      error.status = response.statusText;
      error.response = response;
      console.error(error); // eslint-disable-line no-console
      throw error;
    })
    .then(res => res.json());
};

const fetchJsonAndSetState = function(string, init) {
  return fetchJson(string, init).then(object => this.setState(object));
};

Virtual.fetchJson = fetchJson;
Virtual.fetchJsonAndSetState = fetchJsonAndSetState;

export default Virtual;
