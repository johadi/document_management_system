/* eslint-disable no-unused-vars*/
import 'babel-polyfill';
import expect from 'expect';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import React from 'react';
import { LoginComponent } from '../../src/components/auth';
import initialState from '../../src/store/initialState';
import configureStore from '../../src/store/configureStore';

const store = configureStore(initialState);


const wrapper = mount(
  <Provider store={store}>
    <LoginComponent />
  </Provider>
);

describe('LoginPage Component', () => {
  it('should mount the LoginPage component', () => {
    expect(wrapper.find('LoginPage').length).toBe(1);
    expect(wrapper.find('Header').length).toBe(1);
    expect(wrapper.find('form').length).toBe(1);
    expect(wrapper.find('input').length).toBe(2);
    expect(wrapper.find('button').length).toBe(1);
  });

  it('should have input field with id ="email" and an onChange property',
    () => {
      expect(wrapper.find('input').at(0).props().id).toEqual('email');
      expect(wrapper.find('input').at(0).props().onChange).toExist();
    });

  it('should have input field with id ="password" and an onChange property',
    () => {
      expect(wrapper.find('input').at(1).props().id).toEqual('password');
      expect(wrapper.find('input').at(1).props().onChange).toExist();
    });

  it('should have a button  with type ="submit"', () => {
    expect(wrapper.find('button').props().type).toEqual('submit');
    expect(wrapper.find('button').text()).toEqual('Login');
  });

  it('should have a form  with an onSubmit property', () => {
    expect(wrapper.find('form').props().onSubmit).toExist();
  });

  it('should have an input  with an onChange property', () => {
    expect(wrapper.find('input').at(0).props().onChange).toExist();
  });
});
