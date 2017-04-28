import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import React from 'react';
import PropTypes from 'prop-types';
import jwtDecode from 'jwt-decode';
import toastr from 'toastr';
import Alert from './../common/Alert.jsx';
import Header from '../common/Header.jsx';
import Sidebar from '../common/Sidebar.jsx';
import changePasswordAction from '../../actions/userActions/changePassword';
import clearErrorAlert from '../../actions/errorActions/errorActions';

/**
 * React component for ChangePassword.
 * @class Signup
 */
class ChangePassword extends React.Component {
  /**
   * ChangePassword constructor
   * @param {Object} props
   */
  constructor(props) {
    super(props);
    this.state = {
      user: {
        old_password: '',
        new_password: '',
        new_password_confirmation: ''
      },
      success: null,
      error: null
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onClose = this.onClose.bind(this);
  }

  /**
   * @return {void} void
   */
  componentWillMount() {
    if (localStorage.getItem('token') !== null) {
      const decodedToken = jwtDecode(localStorage.getItem('token'));
      this.state = Object.assign({}, this.state, {
        userId: decodedToken.UserId,
        token: localStorage.getItem('token')
      });
    } else {
      browserHistory.push('/');
    }
  }

  /**
   * On receiving of props
   * @param {Object} nextProps
   * @return {void} void
   */
  componentWillReceiveProps(nextProps) {
    this.state = Object.assign({}, this.state, {
      error: nextProps.error,
      success: nextProps.success
    });
    if (this.state.success === true) {
      toastr.success('Password updated Successfully');
      setTimeout(() => {
        browserHistory.push('/dashboard');
      }, 1000);
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
   * On signup submit
   * @param {object }event
   * @return {void} void
   */
  handleSubmit(event) {
    event.preventDefault();
    this.props.changePassword(this.state);
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
      <div className="row dashboardContainer col s12">
        <Header />
        <Sidebar />
        <div className="col s12 workspace">
          <div className="col s8 l6 offset-s2 offset-l3">
            <h4>Update Password</h4>
          </div>
          <form className="col s8 offset-s2 card-panel" onSubmit={this.handleSubmit} >
            { this.state.error ?
              <Alert info={this.state} onClose={this.onClose} /> : ''
            }
            <div className="row">
              <div className="input-field col s12 mt-20">
                <input
                  className="validate"
                  type="password"
                  name="old_password"
                  id="old_password"
                  onChange={this.handleChange}
                  required
                />
                <label htmlFor="old_password">Enter your old password</label>
              </div>
            </div>

            <div className="row">
              <div className="input-field col s12">
                <input
                  className="validate"
                  type="password"
                  name="new_password"
                  id="new_password"
                  onChange={this.handleChange}
                  required
                />
                <label htmlFor="new_password">Enter your new password</label>
              </div>
            </div>

            <div className="row">
              <div className="input-field col s12">
                <input
                  className="validate"
                  type="password"
                  name="new_password_confirmation"
                  id="new_password_confirmation"
                  onChange={this.handleChange}
                  required
                />
                <label htmlFor="new_password_confirmation">Confirm your new password</label>
              </div>
            </div>

            <div className="mt-10">
              <button className="btn col s5 offset-s7 mb-20" type="submit">Update password</button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

ChangePassword.PropTypes = {
  user: PropTypes.array.isRequired,
  changePassword: PropTypes.func.isRequired
};

const mapStoreToProps = state => ({
  success: state.usersReducer.update_status,
  error: state.errorReducer.error
});

const mapDispatchToProps = dispatch => ({
  changePassword: state =>
    dispatch(changePasswordAction(state)),
  alertClose: () => dispatch(clearErrorAlert())
});

export default connect(mapStoreToProps, mapDispatchToProps)(ChangePassword);
