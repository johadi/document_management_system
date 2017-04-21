import { browserHistory, Link } from 'react-router';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import signupAction from '../actions/authActions/signUpAction';
import { Header } from '../components/Header.jsx';

/**
 * My SignUpPage declaration
 */
class SignUpPage extends Component {

  /**
   * My SignUpPage constructor
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
      error: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  /**
   * @return {void} void
   */
  componentWillMount() {
    if (window.localStorage.getItem('token')) {
      browserHistory.push('/dashboard');
    }
  }

  /**
   * On receiving of props
   * @param {Object} nextProps
   * @return {void} void
   */
  componentWillReceiveProps(nextProps) {
    this.setState({
      error: nextProps.error
    });
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
   * On signup submit
   * @param {object }event
   * @return {void} void
   */
  handleSubmit(event) {
    event.preventDefault();
    this.props.signup(this.state);
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
            <div className="login-feedback error">
              { this.state.error }
            </div>
            : <span />
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
                  className="col s12 btn btn-large waves-effect">
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
  user: React.PropTypes.object.isRequired,
  loginThings: React.PropTypes.func.isRequired
};

SignUpPage.contextTypes = {
  router: React.PropTypes.object
};

const mapStoreToProps = (state) => {
  return {
    user: state.signUpReducer.user,
    error: state.signUpReducer.error
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    signup: userDetails => dispatch(signupAction(userDetails))
  };
};

export default connect(mapStoreToProps, mapDispatchToProps)(SignUpPage);
