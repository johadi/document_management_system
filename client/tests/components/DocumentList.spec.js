import 'babel-polyfill';
import expect from 'expect';
import { Link } from 'react-router';
import { shallow } from 'enzyme';
import React from 'react';
import DocumentList from
  '../../src/components/document/DocumentList.jsx';

const wrapper = shallow(
  <DocumentList documents={
  [{
    title: 'document list',
    access: 'public',
    content: 'test content',
    date: '2017-05-17'
  }]}
  />);

describe('DocumentList component', () => {
  it('should mount the DocumentList component', () => {
    expect(wrapper.containsMatchingElement(<DocumentList />));
  });

  it('should be list of DocumentList', () => {
    expect(wrapper.find('span').length).toBe(2);
    expect(wrapper.find(Link).length).toBe(4);
  });

  it('should take props', () => {
    expect(wrapper.props().documents).toExist;
  });
});

