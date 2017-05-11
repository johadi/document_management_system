import React from 'react';
import jwtDecode from 'jwt-decode';
import { connect } from 'react-redux';
import { browserHistory, Link } from 'react-router';
import { logoutAction } from '../../actions/authActions';

/**
 * Header component class declaration
 */
class Header extends React.Component {
  /**
   * Header component constructor
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
   * Function when component about to mount
   * @return {void} void
   */
  componentWillMount() {
    if (localStorage.getItem('token')) {
      const decodedToken = jwtDecode(localStorage.getItem('token'));
      this.state = Object.assign({}, this.state, {
        id: decodedToken.userId,
        username: decodedToken.username,
        token: localStorage.getItem('token')
      });
    }
  }

  /**
   * @return {void} void
   */
  componentDidMount() {
    $(document).ready(() => {
      $('#collapse_btn').sideNav();
      $('#collapse_btn').sideNav('hide');
      $('.dropdown-button').dropdown();
    });
  }

  /**
   * On logout clicked
   * @return {void} void
   */
  logout() {
    localStorage.removeItem('token');
    this.props.logout();
    browserHistory.push('/');
  }

  /**
  * Renders Header component
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
                <li>
                  <Link id="dropbtn" className="dropdown-button" data-activates="dropdown1">
                    {this.state.username}<i className="material-icons right">arrow_drop_down</i>
                  </Link>
                  <ul id="dropdown1" className="dropdown-content">
                    <li>
                      <Link to={'/password'} >
                        <left>
                          Change password
                        </left>
                      </Link>
                    </li>
                    <li className="divider"></li>
                    <li>
                      <Link to={'/profile'}>
                        <left>
                          My profile
                        </left>
                      </Link>
                    </li>
                    <li className="divider"></li>
                    <li>
                      <Link id="logout" onClick={this.logout} >
                        <left>
                          Sign Out
                        </left>
                      </Link>
                    </li>
                  </ul>
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

const mapDispatchToProps = dispatch => ({
  logout: () => dispatch(logoutAction())
});
const mapStoreToProps = state => ({
  user: state.loginReducer.user,
  token: state.loginReducer.token
});

export default connect(mapStoreToProps, mapDispatchToProps)(Header);
