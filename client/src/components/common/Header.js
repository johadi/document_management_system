import React from 'react';
import {Link, IndexLink} from 'react-router';
import {connect} from 'react-redux';
import {logout} from '../../actions/userActions';

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.logout = this
      .logout
      .bind(this);
  }

  logout(e) {
    e.preventDefault();
    this
      .props
      .logout();
  }

  render() {
    const {isAuthenticated} = this.props.auth;

    const userLinks = (
      <ul>
        <li>
          <a href="#" onClick={this.logout}>Logout</a>
        </li>
      </ul>
    );

    const guestLinks = (
      <ul>
        <li activeClassName="active">
          <Link to="/signup">Sign up</Link>
        </li>
      </ul>
    );
    return (
      <nav className="pink darken-3">
        <div className="nav-wrapper">
          <div className="navheader">
            <Link to="/" className="brand-logo">DMS</Link>
          </div>
          <a href="#" data-activates="mobile-demo" className="button-collapse">
            <i className="material-icons">menu</i>
          </a>
          <ul id="nav-mobile" className="right hide-on-med-and-down">
            <li activeClassName="active">
              <IndexLink to="/">Home</IndexLink>
            </li>
            <li activeClassName="active">
              <a href="badges.html">Components</a>
            </li>
            <li>
              {isAuthenticated
                ? userLinks
                : guestLinks}
            </li>
          </ul>
          <ul id="mobile-demo" className="side-nav">
            <li activeClassName="active">
              <IndexLink to="/">Home</IndexLink>
            </li>
            <li activeClassName="active">
              <a href="badges.html">Components</a>
            </li>
            <li>
              {isAuthenticated
                ? userLinks
                : guestLinks}
            </li>
          </ul>
        </div>
      </nav>
    );
  }
}

Header.propTypes = {
  auth: React.PropTypes.object.isRequired,
  logout: React.PropTypes.func.isRequired
};

/**
 *
 *
 * @param {any} state
 * @returns {any} data
 */
function mapStateToProps(state) {
  return {auth: state.auth};
}

export default connect(mapStateToProps, {logout})(Header);
