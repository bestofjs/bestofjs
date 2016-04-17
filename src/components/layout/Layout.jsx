import React from 'react';

import Sidebar from '../sidebar/Sidebar';
import Header from './Header';
import Footer from './Footer';

const Layout = (props) => {
  const { children, allTags, popularTags, lastUpdate, staticContent, textFilter, currentTagId, auth, authActions } = props;
  return (
    <div id="layout">

      <Sidebar
        allTags={ allTags}
        popularTags={ popularTags}
        selectedTag={ currentTagId }
        auth={ auth }
        authActions={ authActions }
      />

      <div id="panel" className="slideout-panel">

        <Header
          searchText={ textFilter }
        />

        <main id="main">
          { children }
        </main>

        <Footer
          staticContent={ staticContent }
          lastUpdate={ lastUpdate }
        />

      </div>

    </div>
  );
};

export default Layout;
