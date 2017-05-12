/* eslint-disable no-unused-vars*/
import 'babel-polyfill';
import expect from 'expect';
import { shallow } from 'enzyme';
import React from 'react';
import Sidebar from '../../src/components/common/Sidebar.jsx';

const wrapper = shallow(<Sidebar />);

describe('Sidebar component', () => {
  it('should mount the Sidebar component', () => {
    expect(wrapper.containsMatchingElement(<Sidebar />));
  });
  it('should be a list of text', () => {
    expect(wrapper.find('ul').length).toBe(1);
    expect(wrapper.find('li').length).toBe(3);
    expect(wrapper.find('p').length).toBe(3);
  });

  it(`should have a paragraphs that contains
   sidebar menu`, () => {
    expect(wrapper.find('p').first().text()).toEqual('Other Documents');
    expect(wrapper.find('p').at(1).text()).toEqual('My Documents');
    expect(wrapper.find('p').at(2).text()).toEqual('Profile');
  });
});
