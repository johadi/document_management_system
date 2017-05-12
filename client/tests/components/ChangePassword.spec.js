/* eslint-disable no-unused-vars*/
import 'babel-polyfill';
import expect from 'expect';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import React from 'react';
import ChangePassword from '../../src/components/user/ChangePassword.jsx';
import initialState from '../../src/store/initialState';
import configureStore from '../../src/store/configureStore';

const store = configureStore(initialState);

const wrapper = mount(
  <Provider store={store}>
    <ChangePassword />
  </Provider>
);


describe('ChangePassword Page', () => {
  it('should mount the ChangePassword component', () => {
    expect(wrapper.find('ChangePassword').length).toBe(1);
    expect(wrapper.find('Header').length).toBe(1);
    expect(wrapper.find('Sidebar').length).toBe(1);
    expect(wrapper.find('form').length).toBe(1);
    expect(wrapper.find('input').length).toBe(3);
    expect(wrapper.find('button').length).toBe(1);
  });

  it('should have a button  with type ="submit"', () => {
    expect(wrapper.find('button').props().type).toEqual('submit');
    expect(wrapper.find('button').text()).toEqual('Update password');
  });
  it('should have a form  with an onSubmit property', () => {
    expect(wrapper.find('form').props().onSubmit).toExist();
  });
});
