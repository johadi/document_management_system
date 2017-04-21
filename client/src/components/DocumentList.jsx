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
      swal('Deleted!', 'Your document has been deleted.', 'success');
    }
  });
};

const DocumentList = (props) => {
  return (
    <table id="document-list" className="highlight doc_list z-depth-4
      panel pagination">
      <thead>
      <tr>
        <th>Title</th>
        <th>Creator</th>
        <th>Access</th>
        <th>Published on</th>
      </tr>
      </thead>

      <tbody>
        {props.documents.map((document) => {
          const firstname = (document.User !== undefined)
            ? document.User.firstname
            : document.firstname;
          const lastname = (document.User !== undefined)
            ? document.User.lastname
            : document.lastname;
          return (<tr key={document.id}>
            <td className="doc-title"> <Link to={`/view-document/${document.id}`}>
              {document.title}</Link></td>
            <td className="doc-title">
              <Link to={`/profile/${document.creatorId}`}>
                {`${firstname} ${lastname}`}
              </Link></td>
            <td>{document.access}</td>
            <td>{moment(document.createdAt).format('L')}</td>
            {
              ((props.userId === document.creatorId || props.roleId === 1) ?
                  <td><Link to={`/edit-document/${document.id}`}>
                    <i className="small material-icons edit-btn">mode_edit</i>
                  </Link></td>
                  : <td />
              )}
            {
              ((props.userId === document.creatorId || props.roleId === 1) ?
              <td><Link onClick={
                  () => confirmDeletion(props.deleteDocument, document.id)
                  }>
                <i className="small material-icons delete-btn">delete</i>
              </Link></td>
              : <td />
            )}
          </tr>);
        }
        )}
      </tbody>
    </table>
  );
};


DocumentList.propTypes = {
  documents: PropTypes.array,
  userId: PropTypes.number,
  roleId: PropTypes.number,
  deleteDocument: PropTypes.func
};

export default DocumentList;
