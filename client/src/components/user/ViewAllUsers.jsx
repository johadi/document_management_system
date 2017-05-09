import { browserHistory, Link } from 'react-router';
import { Pagination } from 'react-materialize';
import { connect } from 'react-redux';
import jwtDecode from 'jwt-decode';
import React from 'react';
import PropTypes from 'prop-types';
import { Header, Sidebar } from './../common';
import UsersList from './UsersList.jsx';
import { deleteUserAction, viewUsersAction, searchUsersAction } from '../../actions/userActions';

/**
 * ViewAllUsers class declaration
 */
class ViewAllUsers extends React.Component {
  /**
   * ViewAllUsers class constructor
   * @param {Object} props
   */
  constructor(props) {
    super(props);
    this.state = {
      limit: 10,
      searchTerms: ''
    };
    this.handleChange = this.handleChange.bind(this);
    this.searchUsers = this.searchUsers.bind(this);
    this.changeLimit = this.changeLimit.bind(this);
    this.refreshUsersList = this.refreshUsersList.bind(this);
  }

  /**
   * @return {void} void
   */
  componentWillMount() {
    if (localStorage.getItem('token') !== null) {
      const decodedToken = jwtDecode(localStorage.getItem('token'));
      this.state = Object.assign({}, this.state, {
        userId: decodedToken.userId,
        token: localStorage.getItem('token')
      });
      const offset = 0;
      this.props.paginateUsers(this.state.token,
        offset, this.state.limit);
    } else {
      browserHistory.push('/');
    }
  }

  /**
   * On change of search values
   * @param {object} event
   * @return {void} void
   */
  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  /**
   * On search of document
   * @return {void} void
   */
  searchUsers() {
    this.props.searchUsers(this.state.token, this.state.searchTerms);
  }

  /**
   * Change limit of users to display per page
   * @param {any} event
   * @return {void}
   */
  changeLimit(event) {
    const value = Math.abs(parseInt(event.target.value, 10));
    this.state = (Object.assign({}, this.state, { limit: value }));
    this.refreshUsersList();
  }

  /**
   * Refresh list of documents
   * @return {void} void
   */
  refreshUsersList() {
    const offset = 0;
    this.props.paginateUsers(this.state.token,
      offset, this.state.limit);
    this.setState({
      searchTerms: ''
    });
  }

  /**
   * Renders component
   * @return {XML} JSX
   */
  render() {
    if (!window.localStorage.getItem('token')) {
      browserHistory.push('/');
    }

    return (
      <div className="row dashboardContainer col s12">
        <Header/>
        <Sidebar />
        <div className="col s12 workspace">
          <div className="row workspace-header">
            <div className="row">
              <h4 className="col s8">Users</h4>
              <div className="col s4">
              <input
                className="col s10"
                type="text"
                id="searchTerms"
                name="searchTerms"
                value={this.state.searchTerms}
                placeholder="Search..."
                onChange={this.handleChange}
              />
              <button className="btn col s2" id="searchBtn"
                onClick={this.searchUsers}
              >
                <i className="material-icons">search</i></button>
            </div>
            </div>

            <div className="row">
              <div className="col m2">
                <label htmlFor="limit">Set limit</label>
                <select
                  name="limit"
                  id="limit"
                  onChange={this.changeLimit}
                  value={this.state.limit}
                  className="browser-default"
                >
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="15">15</option>
                  <option value="20">20</option>
                  <option value="25">25</option>
                  <option value="50">20</option>
                </select>
              </div>
              <div className="col m1 offset-m9">
                <Link onClick={this.refreshUsersList}>
                  <i className="material-icons refresh-list-btn">
                    autorenew</i>
                </Link>
              </div>
            </div>
            <div className="col s5 btnAddDocument">
              <Link className="waves-effect waves-light btn" to="/user">
                <i className="material-icons left">person add</i>
                Add User
              </Link>
            </div>

          </div>

          <div className="col s10 offset-s1 card-panel">
            <UsersList
              users={this.props.users || []}
              deleteUser={this.props.deleteUser}
            />
          </div>
          <div className="col s12">
            <center>
              {
                ((this.props.pageCount) ?
                  <Pagination
                    items={this.props.pageCount}
                    onSelect={(page) => {
                      const token = localStorage.getItem('token');
                      const offset = (page - 1) * this.state.limit;
                      this.props.paginateUsers(token,
                        offset, this.state.limit);
                    }
                } /> : '')
              }
            </center>
          </div>
        </div>
      </div>
    );
  }
}

ViewAllUsers.PropTypes = {
  users: PropTypes.array.isRequired,
  paginateUsers: PropTypes.func.isRequired,
  deleteUser: PropTypes.func.isRequired,
  searchUsers: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  users: state.usersReducer.users,
  pageCount: state.usersReducer.pageCount
});

const mapDispatchToProps = dispatch => ({
  deleteUser: userId =>
    dispatch(deleteUserAction(userId)),
  paginateUsers: (usertoken, offset, limit) =>
    dispatch(viewUsersAction(usertoken, offset, limit)),
  searchUsers: (usertoken, searchTerm) =>
    dispatch(searchUsersAction(usertoken, searchTerm))
});

export default connect(mapStateToProps, mapDispatchToProps)(ViewAllUsers);
