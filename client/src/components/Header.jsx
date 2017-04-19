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
    const token = (window.localStorage.getItem('token'));
    if (token) {
      this.state = { id: jwtDecode(token).user.id,
        username: jwtDecode(token).user.username };
      this.logout = this.logout.bind(this);
    }
  }

  /**
   * @return {void} void
   */
  componentDidMount() {
    $(document).ready(() => {
      // $('select').material_select();
      $('#collapse_btn').sideNav();
      $('#collapse_btn').sideNav('hide');
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
    if (window.localStorage.getItem('token')) {
      return (
        <div className="navbar-fixed">
          <nav>
            <div className="nav-wrapper">
              <Link to="/" className="brand-logo"></Link>
              <ul id="loggedinNav">
                <li><Link to={`/profile/${this.state.id}`}>{this.state.username}</Link></li>
                <li><Link id="logout" onClick={this.logout}>Sign Out</Link></li>
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
    user: state.user
  };
};

export default connect(mapStoreToProps, mapDispatchToProps)(Header);
