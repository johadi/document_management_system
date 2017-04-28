import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import React from 'react';
import PropTypes from 'prop-types';
import { FroalaEditorView } from './../common/FraolaComponent';
import Header from './../common/Header.jsx';
import Sidebar from './../common/Sidebar.jsx';
import viewDocumentAction from '../../actions/documentActions/viewOneDocument';

/**
 * React component for ViewDocument.
 * @class ViewDocument
 */
class ViewDocument extends React.Component {
  /**
   * componentWillMount
   * @return {void}
   */
  componentWillMount() {
    const token = localStorage.getItem('token');
    if (token) {
      this.props.viewDocument(token, this.props.params.id);
    }
  }

  /**
   * renders the ViewDocument component
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
        {(this.props.document) ?
          <div className= "row">
            <div className="col s8 offset-s2">
              <div className="card">
                <div className="card-content">
                  <span className="card-title">{this.props.document.title || ''}</span>
                    <FroalaEditorView
                      model={this.props.document.content || ''}
                    />
                </div>
                <div className="card-action">
                  {this.props.document.access || ''}
                </div>
              </div>
            </div>
          </div>
          :
          <div>
            Document not Found
          </div>
        }
      </div>

    );
  }
}


ViewDocument.propTypes = {
  viewDocument: PropTypes.func.isRequired
};

const mapStoreToProps = state => ({
  document: state.documentsReducer.document
});

const mapDispatchToProps = dispatch => ({
  viewDocument: (usertoken, documentid) =>
    dispatch(viewDocumentAction(usertoken, documentid))
});

export default connect(mapStoreToProps, mapDispatchToProps)(ViewDocument);
