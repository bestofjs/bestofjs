import TestUtils from 'react-addons-test-utils';

export const getAllTags = TestUtils.scryRenderedDOMComponentsWithTag;

export const getTag = TestUtils.findRenderedDOMComponentWithTag;

export const getAllComponents = TestUtils.scryRenderedComponentsWithType;

export const getComponent = TestUtils.findRenderedComponentWithType;
