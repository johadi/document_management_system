import React from 'react';
// import {Link} from 'react-router';
import LoginForm from './LoginForm';

/**
 * HomePage Component
 */
export default class HomePage extends React.Component {

  /**
   * React Render
   * @return {object} html
   */
  render() {
    return (
      <div className="row">
        <div className="col s7">
          <div className="col s12 z-depth-5">
            <h4>Document Management System</h4>
          </div>
        </div>
        <div className="col s5">
          <h3>Login</h3>
          <LoginForm/>
        </div>
      </div>
    );
  }

}
