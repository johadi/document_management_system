import React, { Component } from 'react';
import jwtDecode from 'jwt-decode';
import { connect } from 'react-redux';
import { browserHistory, Link } from 'react-router';
import logoutAction from '../actions/authActions/logoutAction';

/**
 * My Header declaration
 */
export class Header extends Component {
  /**
   * My Header constructor
   * @param {Object} props
   */
  constructor(props) {
    super(props);
    const token = window.localStorage.getItem('token');
    if (token) {
      console.log(token, 'in header');
      this.state = {
        id: jwtDecode(token).UserId,
        username: jwtDecode(token).Username
      };
      this.logout = this.logout.bind(this);
    }
  }

  componentWillReceiveProps(nextProps){
    // if (nextProps.user) {
      console.log(nextProps.user);
    // }
  }

  /**
   * @return {void} void
   */
  componentDidMount() {
    $(document).ready(() => {
      // $('select').material_select();
      $("#collapse_btn").sideNav();
      $("#collapse_btn").sideNav('hide');
    });
  }

  /**
   * @return {void} void
   */
  logout() {
    window.localStorage.removeItem('token');
    this.props.logout();
    browserHistory.push('/');
  }

  /**
  * Renders component
  * @return {HTML} JSX
  */
  render() {
    if (this.props.user) {
      return (
        <div className="navbar-fixed">
          <nav>
            <div className="nav-wrapper">
              <Link to="/" className="brand-logo"></Link>
              <ul id="loggedinNav">
                <li>
                  {this.props.user.Username}
                </li>
                <li><Link id="logout" onClick={this.logout}>
                  Sign Out</Link>
                </li>
              </ul>
              <ul id="nav-mobile" className="right hide-on-med-and-down" />
            </div>
            <Link data-activates="slide-out" className="btn" id="collapse_btn">
              <i className="material-icons">view_headline</i></Link>
          </nav>
        </div>

      );
    }
    return (
      <div className="navbar-fixed">
        <nav>
          <div className="nav-wrapper">
            <Link to="/" className="brand-logo"></Link>
            <ul id="nav-mobile" className="right hide-on-med-and-down">
              <li><a href="./">Home</a></li>
            </ul>
          </div>
          <h3 className="center title">DMS</h3>
        </nav >
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    logout: () => dispatch(logoutAction())
  };
};
const mapStoreToProps = (state) => {
  return {
    user: state.loginReducer.user
  };
};

export default connect(mapStoreToProps, mapDispatchToProps)(Header);
