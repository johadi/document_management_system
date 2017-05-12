import { connect } from 'react-redux';
import { browserHistory, Link } from 'react-router';
import React from 'react';
import jwtDecode from 'jwt-decode';
import PropTypes from 'prop-types';
import { Header, Sidebar } from './../common';
import { viewUserAction } from '../../actions/userActions';

/**
 * React component for ViewUser.
 * @class ViewUser
 */
class ViewUser extends React.Component {

  /**
   * ChangePassword constructor
   * @param {Object} props
   */
  constructor(props) {
    super(props);
    this.state = {
      userId: null
    };
  }

  /**
   * componentWillMount
   * @return {void} void
   */
  componentWillMount() {
    if (localStorage.getItem('token') !== null) {
      const decodedToken = jwtDecode(localStorage.getItem('token'));
      this.state = Object.assign({}, this.state, {
        userId: decodedToken.userId,
        token: localStorage.getItem('token')
      });
      if (this.props.params.id) {
        this.props.viewUser(this.state, this.props.params.id);
      } else {
        this.props.viewUser(this.state, false);
      }
    } else {
      browserHistory.push('/');
    }
  }

  /**
   * renders the ViewUser component
   * @return {XML} JSX
   */
  render() {
    if (!localStorage.getItem('token')) {
      browserHistory.push('/');
    }
    return (
      <div className="user_doc row col s12">
        <Header />
        <Sidebar />
        {(this.props.user) ?
          <div className= "row">
            <div className="col s8 offset-s2 mt-15">
              <ul className="collection z-depth-1">
                <li className="collection-item">
                  <div className="row">
                    <div className="col s5 header-text-color">
                      Name</div>
                    <div className="col s7 grey-text text-darken-4 right-align" id="profile-name">
                      {this.props.user.lastname} {this.props.user.firstname}</div>
                  </div>
                </li>
                <li className="collection-item">
                  <div className="row">
                    <div className="col s5 header-text-color">
                      Username</div>
                    <div className="col s7 grey-text text-darken-4 right-align">
                      {this.props.user.username}</div>
                  </div>
                </li>
                <li className="collection-item">
                  <div className="row">
                    <div className="col s5 header-text-color">
                      Email</div>
                    <div className="col s7 grey-text text-darken-4 right-align">
                      {this.props.user.email}</div>
                  </div>
                </li>
              </ul>
              {
                (!this.props.params.id) ?
                  <Link to='/profile/edit' className="col s4 offset-s8 btn btn-large waves-effect">
                    Edit Profile
                  </Link> : ''
              }
           </div>
          </div>
          :
          <div>
            User not Found
          </div>
        }
      </div>

    );
  }
}


ViewUser.propTypes = {
  viewUser: PropTypes.func.isRequired
};

const mapStoreToProps = state => ({
  user: state.usersReducer.user
});

const mapDispatchToProps = dispatch => ({
  viewUser: (usertoken, userId) =>
    dispatch(viewUserAction(usertoken, userId))
});

export default connect(mapStoreToProps, mapDispatchToProps)(ViewUser);
