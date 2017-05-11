import 'babel-polyfill';
import expect from 'expect';
import { Link } from 'react-router';
import { shallow } from 'enzyme';
import React from 'react';
import MyDocumentList from
  '../../src/components/document/MyDocumentList.jsx';

let wrapper = shallow(
  <MyDocumentList documents={
  [{
    title: 'document list',
    access: 'public',
    content: 'test content',
    date: '2017-05-07'
  }]}
  />);

describe('MyDocumentList component', () => {
  it('should mount the MyDocumentList component', () => {
    expect(wrapper.containsMatchingElement(<MyDocumentList />));
  });

  it('should be list of MyDocumentList', () => {
    expect(wrapper.find('span').length).toBe(1);
    expect(wrapper.find(Link).length).toBe(3);
  });

  it('should to have edit and delete link icons ', () => {
    expect(wrapper.find(Link).at(0).find('i').at(0)
      .hasClass('edit-btn'));
    expect(wrapper.find(Link).at(0).find('i').at(1)
      .hasClass('delete-btn'));
  });

  it('should take props', () => {
    expect(wrapper.props().documents).toExist;
  });

  it('should return no document found  if no document', () => {
    wrapper = shallow(<MyDocumentList documents={[]} />);
    expect(wrapper.find('p').text()).toEqual('No document found');
  });
});
