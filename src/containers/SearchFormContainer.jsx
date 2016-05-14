import React from 'react';
import hashHistory from 'react-router/lib/hashHistory';

import SearchForm from '../components/home/SearchForm';

function emitChange(text) {
  if (text) {
    hashHistory.push(`/search/${text}`);
  } else {
    hashHistory.push('/');
  }
}

export default () => (
  <SearchForm onChange={ emitChange }/>
);
