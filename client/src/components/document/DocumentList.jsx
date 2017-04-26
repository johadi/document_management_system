import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import moment from 'moment';

const confirmDeletion = (callback, documentId) => {
  swal({
    title: 'Are you sure?',
    text: 'Would you like to delete this document?',
    type: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#DD6B55',
    confirmButtonText: 'Yes, delete it!',
    closeOnConfirm: false,
    closeOnCancel: false
  },
  (deletionConfirmed) => {
    if (deletionConfirmed) {
      callback(documentId);
      swal('Deleted!', 'Document has been deleted.', 'success');
    }
  });
};

const DocumentList = (props) => {
  const list = props.documents.map((document) => {
    const firstname = (document.User !== undefined)
      ? document.User.firstname
      : document.firstname;
    const lastname = (document.User !== undefined)
      ? document.User.lastname
      : document.lastname;
    return (
      <ul key={document.id} className="collection">
        <li className="collection-item avatar">
          <i className="material-icons circle">note</i>
          <div className='col s11'>
            <span className="title truncate">
              <Link to={`/view-document/${document.id}`}>
                {document.title}
              </Link>
            </span>
            <div className="row mb-10">
              <div className="col s1"><strong> Owner</strong></div>
              <div className="col s11">
                <Link to={`/profile/${document.creatorId}`}>
                  {`${firstname} ${lastname}`}
                </Link>
              </div>
            </div>
            <div className="row mb-10">
              <div className="col s1"><strong> Access</strong></div>
              <div className="col s11">
                {document.access}
              </div>
            </div>
            <div className="row mb-10">
              <div className="col s1"><strong> Created</strong></div>
              <div className="col s11">
                {moment(document.createdAt).format('L')}
              </div>
            </div>
          </div>
          <div className="col s1">
            <div className="secondary-content">
              {
                ((props.userId === document.creatorId || props.roleId === 1) ?
                    <Link to={`/edit-document/${document.id}`}
                          className="btn-floating action-edit-color">
                      <i className="small material-icons edit-btn">mode_edit</i>
                    </Link>
                    : ''
                )
              }
              {
                ((props.userId === document.creatorId || props.roleId === 1) ?
                    <Link
                      className="btn-floating red"
                      onClick={
                  () => confirmDeletion(props.deleteDocument, document.id)
                  }>
                      <i className="small material-icons delete-btn">delete</i>
                    </Link>
                    : ''
                )
              }
            </div>
          </div>
        </li>
      </ul>);
  });
  return (<div className='doc_list'>{list}</div>);
};

DocumentList.propTypes = {
  documents: PropTypes.array,
  userId: PropTypes.number,
  roleId: PropTypes.number,
  deleteDocument: PropTypes.func
};

export default DocumentList;
