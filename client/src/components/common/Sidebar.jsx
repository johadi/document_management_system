import React from 'react';
import { Link } from 'react-router';
import jwtDecode from 'jwt-decode';

/**
 * Sidebar class declaration
 */
export default class Sidebar extends React.Component {
  /**
   * LoginPage class constructor
   * @param {Object} props
   */
  constructor(props) {
    super(props);
    this.state = {
      token: localStorage.getItem('token')
    };
  }

  /**
   * Renders component
   * @return {XML} JSX
   */
  render() {
    return (
      <div className="sidebar">
        <ul id="slide-out" className="side-nav">
          <li>
            <Link to="/dashboard" className="col s12 menu_link">
              <div className="col s2">
                <center className="circle useractions">
                  <i className="material-icons">view_list</i>
                </center>
            </div>
              { jwtDecode(this.state.token).RoleId === 1 ?
                <p className="col s10 action_desc">
                  All Documents
                </p>
                :
                <p className="col s10 action_desc">
                  Other Documents
                </p>
              }
            </Link>
          </li>
          <li>
            <Link to="/my-documents" className="col s12 menu_link">
              <div className="col s2">
                <center className="circle useractions">
                  <i className="material-icons">view_list</i>
                </center>
              </div>
              <p className="col s10 action_desc">My Documents</p>
            </Link>
          </li>
          { jwtDecode(this.state.token).RoleId === 1 ?
            (
              <div>
                <li>
                  <Link to="/users" className="col s12 menu_link">
                    <div className="col s2">
                      <center className="circle useractions">
                        <i className="material-icons">supervisor_account</i>
                      </center>
                    </div>
                    <p className="col s10 action_desc">All Users</p>
                  </Link>
                </li>
              </div>
            ) : <span />}
          <li>
            <Link to={'/profile'} className="col s12 menu_link">
              <div className="col s2">
                <center className="circle useractions">
                  <i className="material-icons">account_circle</i></center>
              </div>
              <p className="col s10 action_desc">Profile</p>
            </Link>
          </li>
          <li>
            <Link to={'/change-password'} className="col s12 menu_link">
              <div className="col s2">
                <center className="circle useractions">
                  <i className="material-icons">vpn_key</i></center>
              </div>
              <p className="col s10 action_desc">Change password</p>
            </Link>
          </li>

        </ul>

      </div >
    );
  }
}
