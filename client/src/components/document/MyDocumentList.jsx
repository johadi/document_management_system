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
    closeOnCancel: true
  },
  (deletionConfirmed) => {
    if (deletionConfirmed) {
      callback(documentId);
      swal('Deleted!', 'Document has been deleted.', 'success');
    }
  });
};

const MyDocumentList = (props) => {
  const list = props.documents.map(document => (
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
              <Link to={`/edit-document/${document.id}`}
                className="btn-floating action-edit-color"
              >
                <i className="small material-icons edit-btn">mode_edit</i>
              </Link>
              <Link
                className="btn-floating red"
                onClick={
                  () => confirmDeletion(props.deleteDocument, document.id)
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


MyDocumentList.propTypes = {
  documents: PropTypes.array,
  userId: PropTypes.number,
  deleteDocument: PropTypes.func
};

export default MyDocumentList;
