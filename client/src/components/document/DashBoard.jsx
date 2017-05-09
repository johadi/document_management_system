import { connect } from 'react-redux';
import { browserHistory, Link } from 'react-router';
import { Pagination } from 'react-materialize';
import jwtDecode from 'jwt-decode';
import React from 'react';
import PropTypes from 'prop-types';
import { Header, Sidebar } from './../common';
import DocumentList from './DocumentList.jsx';
import {
  deleteDocumentAction,
  viewDocumentsAction,
  searchDocumentsAction
} from '../../actions/documentActions';

/**
 * ViewDocuments class declaration
 */
class ViewDocuments extends React.Component {

  /**
   * ViewDocuments class constructor
   * @param {Object} props
   */
  constructor(props) {
    super(props);
    this.state = {
      limit: 10,
      searchTerms: ''
    };
    this.handleChange = this.handleChange.bind(this);
    this.searchDocument = this.searchDocument.bind(this);
    this.changeLimit = this.changeLimit.bind(this);
    this.refreshDocumentsList = this.refreshDocumentsList.bind(this);
  }

  /**
   * @return {void} void
   */
  componentWillMount() {
    if (localStorage.getItem('token') !== null) {
      const decodedToken = jwtDecode(localStorage.getItem('token'));
      this.state = Object.assign({}, this.state, {
        userId: decodedToken.userId,
        roleId: decodedToken.roleId,
        token: localStorage.getItem('token')
      });
      const offset = 0;
      this.props.paginateDocuments(this.state.token,
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
  searchDocument() {
    this.props.searchDocument(this.state.token, this.state.searchTerms);
  }

  /**
   * Change limit of documents to display per page
   * @param {any} event
   * @return {void}
   */
  changeLimit(event) {
    const value = Math.abs(parseInt(event.target.value, 10));
    this.state = (Object.assign({}, this.state, { limit: value }));
    this.refreshDocumentsList();
  }

  /**
   * Refresh list of documents
   * @return {void} void
   */
  refreshDocumentsList() {
    const offset = 0;
    this.props.paginateDocuments(this.state.token,
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
    if (this.props.documents && this.props.documents.length === 0) {
      return (<p>There are no documents yet in your collection.</p>);
    }
    return (
      <div className="row dashboardContainer col s12">
        <Header />
        <Sidebar />
        <div className="col s12 workspace">
          <div className="row workspace-header">
            <div className="row">
              <h4 className="col s8">Documents</h4>
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
                  onClick={this.searchDocument}
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
                <Link onClick={this.refreshDocumentsList}>
                  <i className="material-icons refresh-list-btn">
                    autorenew</i>
                </Link>
              </div>
            </div>

            <div className="col s5 btnAddDocument">
              <Link className="waves-effect waves-light btn" to="/document">
                <i className="material-icons left">note_add</i>
                Add Document
              </Link>
            </div>

          </div>

          <div className="col s10 offset-s1 card-panel">
            <DocumentList
              deleteDocument={this.props.deleteDocument}
              userId={this.state.userId}
              roleId={this.state.roleId}
              documents={this.props.documents || []}
            />
          </div>
          <div className="col s12">
            <center>
              {
                ((this.props.pageCount) ?
                  <Pagination
                    items={this.props.pageCount}
                    onSelect={(page) => {
                      const token = window.localStorage.getItem('token');
                      const offset = (page - 1) * this.state.limit;
                      this.props.paginateDocuments(token,
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


ViewDocuments.PropTypes = {
  documents: PropTypes.array.isRequired,
  paginateDocuments: PropTypes.func.isRequired,
  deleteDocument: PropTypes.func.isRequired,
  searchDocument: PropTypes.func.isRequired
};

const mapStoreToProps = state => ({
  documents: state.documentsReducer.documents,
  pageCount: state.documentsReducer.pageCount
});

const mapDispatchToProps = dispatch => ({
  deleteDocument: documentId =>
    dispatch(deleteDocumentAction(documentId)),
  paginateDocuments: (usertoken, offset, limit) =>
    dispatch(viewDocumentsAction(usertoken, offset, limit)),
  searchDocument: (usertoken, searchTerm) =>
    dispatch(searchDocumentsAction(usertoken, searchTerm))
});

export default connect(mapStoreToProps, mapDispatchToProps)(ViewDocuments);
