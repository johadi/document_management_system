import React from 'react';
import jwtDecode from 'jwt-decode';
import { connect } from 'react-redux';
import { browserHistory, Link } from 'react-router';
import logoutAction from '../../actions/authActions/logoutAction';

/**
 * My Header declaration
 */
class Header extends React.Component {
  /**
   * My Header constructor
   * @param {Object} props
   */
  constructor(props) {
    super(props);
    this.state = {
      token: null
    };
    this.logout = this.logout.bind(this);
  }

  /**
   * @return {void} void
   */
  componentDidMount() {
    $(document).ready(() => {
      $('select').material_select();
      $('#collapse_btn').sideNav();
      $('#collapse_btn').sideNav('hide');
    });
  }

  /**
   * On receiving of props
   * @param {Object} nextProps
   * @return {void} void
   */
  componentWillReceiveProps(nextProps) {
    const token = nextProps.token;
    if (token) {
      const decodedToken = jwtDecode(token);
      this.state = Object.assign({}, this.state, {
        id: decodedToken.UserId,
        username: decodedToken.Username,
        token
      });
    }
  }
  /**
   * @return {void} void
   */
  logout() {
    localStorage.removeItem('token');
    this.props.logout();
    browserHistory.push('/');
  }

  /**
  * Renders component
  * @return {HTML} JSX
  */
  render() {
    if (localStorage.getItem('token')) {
      return (
        <div className="navbar-fixed">
          <nav>
            <div className="nav-wrapper">
              <div className="navheader">
                <Link to="/dashboard" className="brand-logo">DMS</Link>
              </div>
              <ul id="loggedinNav">
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
            <div className="navheader">
              <Link to="/" className="brand-logo">DMS</Link>
            </div>
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
const mapStoreToProps = state => ({
  user: state.loginReducer.user,
  token: state.loginReducer.token
});

export default connect(mapStoreToProps, mapDispatchToProps)(Header);
