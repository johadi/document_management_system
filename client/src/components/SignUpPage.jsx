import { browserHistory, Link } from 'react-router';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Alert from './Alert.jsx';
import signUpAction from '../actions/authActions/signUpAction';
import clearErrorAlert from '../actions/errorActions/errorActions';
import Header from '../components/Header.jsx';

/**
 * React component for Signup.
 * @class Signup
 */
class SignUpPage extends React.Component {

  /**
   * SignUpPage constructor
   * @param {Object} props
   */
  constructor(props) {
    super(props);
    this.state = {
      user: {
        firstname: '',
        lastname: '',
        username: '',
        email: '',
        password: '',
        password_confirmation: ''
      },
      success: null,
      error: null
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onClose = this.onClose.bind(this);
    this.redirectIfSignUp = this.redirectIfSignUp.bind(this);
  }

  /**
   * @return {void} void
   */
  componentWillMount() {
    this.redirectIfSignUp();
    if (localStorage.getItem('token')) {
      browserHistory.push('/dashboard');
    }
  }

  /**
   * On receiving of props
   * @param {Object} nextProps
   * @return {void} void
   */
  componentWillReceiveProps(nextProps) {
    this.state = Object.assign({}, this.state, {
      error: nextProps.error, success: nextProps.success
    });
    this.redirectIfSignUp();
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
   * Redirect user if successfully signed up
   * @return {void} void
   */
  redirectIfSignUp() {
    if (this.state.success === true) {
      browserHistory.push('/dashboard');
    }
  }

  /**
   * On signup submit
   * @param {object }event
   * @return {void} void
   */
  handleSubmit(event) {
    event.preventDefault();
    this.props.signup(this.state);
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
        <div className="col s8 offset-s2 card-panel">
          <h4 className="center-align">SIGN UP</h4>
          <form className="loginForm" onSubmit={this.handleSubmit} >
            { this.state.error ?
              <Alert info={this.state} onClose={this.onClose}/> : ''
            }
          <div className="row">
            <div className="input-field col s12">
              <input
                className="validate"
                type="text"
                name="username"
                id="username"
                onChange={this.handleChange}
                required
              />
              <label htmlFor="username">Username</label>
            </div>
          </div>
          <div className="row">
            <div className="input-field col s12">
              <input
                className="validate"
                type="text"
                name="firstname"
                id="firstname"
                onChange={this.handleChange}
                required
              />
              <label htmlFor="firstname">Firstname</label>
            </div>
          </div>

          <div className="row">
            <div className="input-field col s12">
              <input
                className="validate"
                type="text"
                name="lastname"
                id="lastname"
                onChange={this.handleChange}
                required
              />
              <label htmlFor="lastname">Lastname</label>
            </div>
          </div>

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
          </div>

          <div className="row">
            <div className="input-field col s12">
              <input
                className="validate"
                type="password"
                name="password_confirmation"
                id="password_confirmation"
                onChange={this.handleChange}
                required
              />
              <label htmlFor="password_confirmation">Confirm your password</label>
            </div>
          </div>

            <div>
              <span className="changeLogin">Existing User? <Link to="/">Login Here</Link></span>
            </div>
            <br />
            <center>
              <div className="row">
                <button
                  type="submit"
                  name="btn_login"
                  id="btn_login"
                  className="col s6 offset-s3 btn btn-large waves-effect">
                  Register
                </button>
              </div>
            </center>
          </form>
        </div>
      </div>

    );
  }
}

SignUpPage.PropTypes = {
  user: PropTypes.object.isRequired
};

SignUpPage.contextTypes = {
  router: PropTypes.object
};

const mapStoreToProps = state => ({
  user: state.signUpReducer.user,
  error: state.errorReducer.error,
  success: state.signUpReducer.success
});

const mapDispatchToProps = dispatch => ({
  signup: userDetails => dispatch(signUpAction(userDetails)),
  alertClose: () => dispatch(clearErrorAlert())
});

export default connect(mapStoreToProps, mapDispatchToProps)(SignUpPage);
