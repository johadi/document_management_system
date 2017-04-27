import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import moment from 'moment';

const confirmDeletion = (callback, userId) => {
  swal({
    title: 'Are you sure?',
    text: 'Would you like to delete this user?',
    type: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#DD6B55',
    confirmButtonText: 'Yes, delete it!',
    closeOnConfirm: false,
    closeOnCancel: true
  },
  (deletionConfirmed) => {
    if (deletionConfirmed) {
      callback(userId);
      swal('Deleted!', 'User has been deleted.', 'success');
    }
  });
};

const UsersList = (props) => {
  const list = props.users.map(user => (
    <ul key={user.id} className="collection">
      <li className="collection-item avatar">
        <i className="material-icons circle">person</i>
        <div className='col s11'>
            <span className="title truncate">
              <Link to={`/view-user/${user.id}`}>
                {user.lastname} {user.firstname}
              </Link>
            </span>
          <div className="row mb-10">
            <div className="col s1"><strong> Email</strong></div>
            <div className="col s11">
              {user.email}
            </div>
          </div>
          <div className="row mb-10">
            <div className="col s1"><strong> Created</strong></div>
            <div className="col s11">
              {moment(user.createdAt).format('L')}
            </div>
          </div>
        </div>
        <div className="col s1">
          <div className="secondary-content">
            <Link to={`/edit-user/${user.id}`}
              className="btn-floating action-edit-color"
            >
              <i className="small material-icons edit-btn">mode_edit</i>
            </Link>
            <Link
              className="btn-floating red"
              onClick={
                () => confirmDeletion(props.deleteUser, user.id)
              }
            >
              <i className="small material-icons delete-btn">delete</i>
            </Link>
          </div>
        </div>
      </li>
    </ul>)
  );
  return (<div className='collection_list'>{list}</div>);
};


UsersList.propTypes = {
  users: PropTypes.array,
  userId: PropTypes.number,
  deleteUser: PropTypes.func
};

export default UsersList;
