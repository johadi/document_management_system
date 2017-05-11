import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import React from 'react';
import PropTypes from 'prop-types';
import toastr from 'toastr';
import { Header, Sidebar, Alert } from './../common';
import clearErrorAlert from '../../actions/errorActions/errorActions';
import { createUserAction } from '../../actions/userActions';

/**
 * React component for CreateUser.
 * @class CreateUser
 */
class CreateUser extends React.Component {
  /**
   * constructor
   * @param {object} props
   */
  constructor(props) {
    super(props);
    this.state = {
      user: {
        firstname: '',
        username: '',
        lastname: '',
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
    if (this.state.success === true) {
      toastr.success('User Created Successfully');
      browserHistory.push('/users');
    }
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
   * On create user submit
   * @param {object }event
   * @return {void} void
   */
  handleSubmit(event) {
    event.preventDefault();
    const token = localStorage.getItem('token');
    this.props.createUser(this.state.user, token);
  }

  /**
   * on close of alert
   * @return {void} void
   */
  onClose() {
    this.props.alertClose(this.state);
  }

  /**
   * renders the CreateUser component
   * @return {XML} JSX
   */
  render() {
    if (!window.localStorage.getItem('token')) {
      browserHistory.push('/');
    }
    return (
      <div className="row dashboardContainer col s12">
        <Header />
        <Sidebar />
        <div className="col s12 workspace">
          <div className="col s12">
            <center>
              <h4>Create User</h4>
            </center>
          </div>
          <form onSubmit={this.handleSubmit} className="col s8 offset-s2 card-panel">

            { this.state.error ?
              <Alert info={this.state} onClose={this.onClose} /> : ''
            }
            <div className="row">
              <div className="input-field col s12 mt-20">
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
            <div className="col s12">
              <div className="mt-10">
                <button className="btn col s4 offset-s8 mb-20" type="submit">Create User</button>
              </div>
            </div>

          </form>
        </div>
      </div>
    );
  }
}

CreateUser.PropTypes = {
  alertClose: PropTypes.func.isRequired,
  createUser: PropTypes.func.isRequired
};

CreateUser.contextTypes = {
  router: PropTypes.object
};

const mapStoreToProps = state => ({
  error: state.errorReducer.error,
  success: state.usersReducer.success
});

const mapDispatchToProps = dispatch => ({
  createUser: (userDetails, token) => dispatch(createUserAction(userDetails, token)),
  alertClose: () => dispatch(clearErrorAlert())
});

export default connect(mapStoreToProps, mapDispatchToProps)(CreateUser);
