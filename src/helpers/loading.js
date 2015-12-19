// Helper used to show/hide the loading bar

import axios from 'axios';
const loading = window.topbar;

export default ({
  // init method is called by entry.jsx to setup "interceptors"
  // GOAL: automatically display the loading indicator when a request is made.
  init() {
    const self = this;
    // Add a request interceptor
    axios.interceptors.request.use(function (config) {
      // Do something before request is sent
      self.show();
      return config;
    }, function (error) {
        // Do something with request error
      return Promise.reject(error);
    }
    );
    // Add a response interceptor
    axios.interceptors.response.use(function (response) {
        // Do something with response data
      self.hide();
      return response;
    }, function (error) {
        // Do something with response error
      self.hide();
      return Promise.reject(error);
    });
  },

  show() {
    if (loading) loading.show();
  },

  hide() {
    if (loading) loading.hide();
  }
});
