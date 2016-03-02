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

      <main id="panel" className="slideout-panel">

        <Header
          searchText={ textFilter }
        />

        { children }

        <Footer
          staticContent={ staticContent }
          lastUpdate={ lastUpdate }
        />

      </main>

    </div>
  );
};

export default Layout;
