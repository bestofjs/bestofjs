import React from 'react';

import Layout from './Layout';
import menu from '../../helpers/menu';

// require *.styl intructions have been moved from components to the App.jsx container
// to be able to run tests with node.js

if (typeof window !== 'undefined') require('../../../node_modules/react-select/dist/react-select.css');

function hideSplashScreen() {
  const elements = document.querySelectorAll('.nojs');
  Array.prototype.forEach.call(elements, (el) => el.classList.remove('nojs'));

  // Add the stylesheets to overwrite inline styles defined in index.html
  if (typeof window !== 'undefined') require('../../stylesheets/main.styl');
}

const AppUI = React.createClass({
  componentWillMount() {
    hideSplashScreen();
  },
  componentDidMount() {
    if (window) menu.start();
  },
  render() {
    return (
      <Layout {...this.props}>
        {this.props.children}
      </Layout>
    );
  }
});
export default AppUI;
