import React from 'react';
import { connect } from 'react-redux';
import { browserHistory, Link } from 'react-router';
import PropTypes from 'prop-types';
import Alert from './Alert.jsx';
import loginAction from '../actions/authActions/loginAction';
import { loginAlert } from '../actions/authActions/alertAction';
import Header from './Header.jsx';

/**
 * LoginPage class declaration
 */
class LoginPage extends React.Component {
  /**
   * LoginPage class constructor
   * @param {Object} props
   */
  constructor(props) {
    super(props);
    this.state = {
      user: {
        email: '',
        password: ''
      },
      error: null,
      success: null
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.redirectIfLoggedIn = this.redirectIfLoggedIn.bind(this);
    this.onClose = this.onClose.bind(this);
  }

  /**
   * @return {void} void
   */
  componentWillMount() {
    this.redirectIfLoggedIn();
  }

  /**
   * On receiving of props
   * @param {Object} nextProps
   * @return {void} void
   */
  componentWillReceiveProps(nextProps) {
    this.state = Object.assign({}, this.state, {
      error: nextProps.loginError, success: nextProps.loginSuccess
    });
    this.redirectIfLoggedIn();
  }

  /**
   * On change of input values
   * @param {object} event
   * @return {void} void
   */
  handleChange(event) {
    const user = this.state.user;
    user[event.target.name] = event.target.value;
    this.setState({ user });
  }

  /**
   * @return {void} void
   */
  redirectIfLoggedIn() {
    if (this.state.success !== null) {
      browserHistory.push('/dashboard');
    }
  }

  /**
   * On login submit
   * @param {object }event
   * @return {void} void
   */
  handleSubmit(event) {
    // prevent default submit action
    event.preventDefault();
    this.props.login(this.state);
  }

  /**
   * on close of alert
   * @return {void} void
   */
  onClose() {
    this.props.alertClose(this.state);
  }

  /**
   * Renders component
   * @return {XML} JSX
   */
  render() {
    return (
      <div className="row">
        <Header />
        <div className="row">
          <div className="col s12">
            <div className="row">
              <div className="col s7 valign-wrapper">
                <h2>Document Management System</h2>
              </div>
              <div className="col s5 card-panel">
                <h4 className="center-align">LOGIN</h4>
                <form className="col s12 l12 loginForm" onSubmit={this.handleSubmit}>
                  { this.state.error ?
                    <Alert info={this.state} onClose={this.onClose}/> : ''
                  }
                  <div className="row">
                    <div className="input-field col s12">
                      <input
                        className="validate"
                        type="email"
                        name="email"
                        id="email"
                        onChange={this.handleChange}
                        required
                      />
                      <label htmlFor="email">Enter your email</label>
                    </div>
                  </div>

                  <div className="row">
                    <div className="input-field col s12">
                      <input
                        className="validate"
                        type="password"
                        name="password"
                        id="password"
                        onChange={this.handleChange}
                        required
                      />
                      <label htmlFor="password">Enter your password</label>
                    </div>

                    <div>
                      <span className="changeLogin">New User? <Link to="/register">Register Here</Link></span>
                    </div>
                  </div>
                  <label className="loginError" id="loginError"></label>

                  <br />
                  <center>
                    <div className="row">
                      <button
                        onClick={this.handleSubmit}
                        type="submit"
                        name="btn_login"
                        id="btn_login"
                        className="col s12 btn btn-large waves-effect">
                        Login
                      </button>
                    </div>
                  </center>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

LoginPage.PropTypes = {
  user: PropTypes.object.isRequired,
  loginError: PropTypes.object.isRequired,
  loginSuccess: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func
};

LoginPage.contextTypes = {
  router: PropTypes.object
};

const mapStoreToProps = state => ({
  user: state.loginReducer.user,
  loginSuccess: state.loginReducer.success,
  loginError: state.loginReducer.error,
  token: state.loginReducer.token
});

const mapDispatchToProps = dispatch => ({
  login: credentials => dispatch(loginAction(credentials)),
  alertClose: () => dispatch(loginAlert())
});

export default connect(mapStoreToProps, mapDispatchToProps)(LoginPage);
