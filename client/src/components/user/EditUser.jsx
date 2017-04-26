import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { browserHistory } from 'react-router';
import React from 'react';
import toastr from 'toastr';
import jwtDecode from 'jwt-decode';
import Header from './../common/Header.jsx';
import Sidebar from './../common/Sidebar.jsx';
import Alert from './../common/Alert.jsx';
import clearErrorAlert from '../../actions/errorActions/errorActions';
import viewUserAction from '../../actions/userActions/viewUserProfile';
import editUserAction from '../../actions/userActions/editUserProfile';

/**
 * React component for EditUser.
 * @class CreateDocument
 */
class EditUser extends React.Component {
  /**
   * constructor
   * @param {object} props
   */
  constructor(props) {
    super(props);
    this.state = {
      user: {
        username: '',
        firstname: '',
        lastname: ''
      },
      self: true,
      success: null,
      error: null
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onClose = this.onClose.bind(this);
  }

  /**
   * componentWillMount
   * @return {void}
   */
  componentWillMount() {
    if (localStorage.getItem('token') !== null) {
      const decodedToken = jwtDecode(localStorage.getItem('token'));
      this.state = Object.assign({}, this.state, {
        userId: decodedToken.UserId,
        roleId: decodedToken.RoleId,
        token: localStorage.getItem('token')
      });
      if (this.props.params.id && (decodedToken.RoleId !== 1)) {
        browserHistory.push('/dashboard');
      }
      if (this.props.params.id) {
        this.state = Object.assign({}, this.state, {
          self: false
        });
        this.props.viewUser(this.state, this.props.params.id);
      } else {
        this.props.viewUser(this.state, false);
      }
    } else {
      browserHistory.push('/');
    }
  }

  /**
   * componentDidMount
   * @return {void}
   */
  componentDidMount() {
    $(this.refs.roleId).material_select(this.handleChange.bind(this));
  }

  /**
   * On receiving of props
   * @param {Object} nextProps
   * @return {void} void
   */
  componentWillReceiveProps(nextProps) {
    this.state = Object.assign({}, this.state, {
      error: nextProps.error,
      success: nextProps.success,
      user: {
        firstname: nextProps.user.firstname,
        lastname: nextProps.user.lastname,
        username: nextProps.user.username,
        roleId: nextProps.user.roleId
      }
    });
    $('#roleId').val(nextProps.user.roleId);
    if (this.state.success === true) {
      toastr.success('Updated Successfully');
      if (this.state.self === false) {
        browserHistory.push('/users');
      } else {
        browserHistory.push('/profile');
      }
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
   * On create document submit
   * @param {object }event
   * @return {void} void
   */
  handleSubmit(event) {
    event.preventDefault();
    if (this.props.params.id) {
      this.props.editUser(this.state, this.props.params.id);
    } else {
      this.props.editUser(this.state, false);
    }
  }

  /**
   * on close of alert
   * @return {void} void
   */
  onClose() {
    this.props.alertClose(this.state);
  }

  /**
   * renders the EditUser component
   * @return {XML} JSX
   */
  render() {
    if (!localStorage.getItem('token')) {
      browserHistory.push('/');
    }
    return (
      <div className="row dashboardContainer col s12">
        <Header />
        <Sidebar />
        <div className="col s12 workspace">
          <div className="col s8 l6 offset-s2 offset-l3">
            { ((this.props.params.id) ? <h4>Edit User </h4> : <h4>Edit Profile </h4>) }
          </div>
          <form onSubmit={this.handleSubmit} className="col s8 offset-s2 card-panel">
            { this.state.error ?
              <Alert info={this.state} onClose={this.onClose}/> : ''
            }
            <div className="col s12 mt-20">
              <div className="row">
                <div className="input-field col s12 mt-20">
                  <input
                    className="validate"
                    type="text"
                    name="username"
                    id="username"
                    onChange={this.handleChange}
                    value={this.state.user.username}
                    required/>
                  <label className="active" htmlFor="username">Username</label>
                </div>
              </div>
              <div className="row">
                <div className="input-field col s12 mt-20">
                  <input
                    className="validate"
                    type="text"
                    name="firstname"
                    id="firstname"
                    onChange={this.handleChange}
                    value={this.state.user.firstname}
                    required/>
                  <label className="active" htmlFor="firstname">Firstname</label>
                </div>
              </div>
              <div className="row">
                <div className="input-field col s12 mt-20">
                  <input
                    className="validate"
                    type="text"
                    name="lastname"
                    id="lastname"
                    onChange={this.handleChange}
                    value={this.state.user.lastname}
                    required/>
                  <label className="active" htmlFor="lastname">Lastname</label>
                </div>
              </div>
              <div className="row">
                <div className="input-field col s12 mt-20">
                  { ((this.props.params.id && (this.state.roleId === 1)) ?
                    <select
                      name="roleId"
                      id="roleId"
                      onChange={this.handleChange}
                      value={this.state.value}
                      className="browser-default">
                      <option value="">Select Role</option>
                      <option value="1">Admin</option>
                      <option value="2">Regular</option>
                    </select>
                    : ''
                    )
                  }
                </div>
              </div>
              <div className="col m9 s12"></div>
              <div className="row">
                <div className="col s5 mt-15 mb-20">
                  <button className="btn" type="submit">Save</button>
                </div>
              </div>
            </div>

          </form>
        </div>
      </div>
    );
  }
}


EditUser.PropTypes = {
  user: PropTypes.object.isRequired
};

EditUser.contextTypes = {
  router: PropTypes.object
};

const mapStoreToProps = state => ({
  user: state.usersReducer.user,
  error: state.errorReducer.error,
  success: state.usersReducer.update_status
});

const mapDispatchToProps = dispatch => ({
  viewUser: (token, userId) => dispatch(viewUserAction(token, userId)),
  editUser: (documentDetails, token, documentid) =>
    dispatch(editUserAction(documentDetails, token, documentid)),
  alertClose: () => dispatch(clearErrorAlert())
});

export default connect(mapStoreToProps, mapDispatchToProps)(EditUser);
