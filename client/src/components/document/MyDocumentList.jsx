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

const MyDocumentList = props =>
  (
    <table id="document-list" className="highlight doc_list pagination">
      <thead>
      <tr>
        <th>Title</th>
        <th>Access</th>
        <th>Created on</th>
      </tr>
      </thead>

      <tbody>
      {props.documents.map(document =>
        (<tr key={document.id}>
          <td className="doc-title"> <Link to={`/view-document/${document.id}`}>
            {document.title}</Link></td>
          <td>{document.access}</td>
          <td>{moment(document.createdAt).format('L')}</td>
          <td>
            <Link to={`/edit-document/${document.id}`}
                  className="btn-floating action-edit-color">
              <i className="small material-icons edit-btn">mode_edit</i>
            </Link>
          </td>
          <td><Link
            className="btn-floating red"
            onClick={
                    () => confirmDeletion(props.deleteDocument, document.id)
                    }>
            <i className="small material-icons delete-btn">delete</i>
          </Link></td>
        </tr>)
      )}
      </tbody>
    </table>
  );


MyDocumentList.propTypes = {
  documents: PropTypes.array,
  userId: PropTypes.number,
  deleteDocument: PropTypes.func
};

export default MyDocumentList;
