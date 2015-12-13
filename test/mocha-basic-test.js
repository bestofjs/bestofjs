// A basic test using Mocha and Enzyme "JSDOM Full Rendering"
import React from 'react';
import {
  describeWithDOM,
  render,
  spyLifecycle
} from 'enzyme';
import assert from 'assert';

import Project from '../src/components/projects/Project';

const project = {
  "id": "react",
  "name":"React",
  "stars":32839,
  "repository":"https://github.com/facebook/react",
  "deltas":[53,59,72,63,50,46,48,50,70,63],
  "url":"https://facebook.github.io/react/",
  "full_name":"facebook/react",
  "description":"A declarative, efficient, and flexible JavaScript library for building user interfaces.",
  "pushed_at":"2015-12-11T20:22:41.000Z",
  "tags":[{id:"framework", name:"Frameworks"}],
  "readme": "<p>A wonderful readme!</p>"
};


describeWithDOM('<Project> component', () => {

  const wrapper = render(<Project project={ project } />);

  it('Check the title', () => {
    const title = wrapper.find('h1');
    assert.ok(title);
    assert.ok(title.html().indexOf('React') > -1);
  });

  it('Check the README', () => {
    const readme = wrapper.find('.readme .body');
    assert.ok(readme.html().length > 10);
  });

});
