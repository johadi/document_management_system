import { connect } from 'react-redux';
import { browserHistory, Link } from 'react-router';
import { Pagination } from 'react-materialize';
import jwtDecode from 'jwt-decode';
import React from 'react';
import PropTypes from 'prop-types';
import Header from './../common/Header.jsx';
import Sidebar from './../common/Sidebar.jsx';
import DocumentList from './../document/DocumentList.jsx';
import deleteDocumentAction from '../../actions/docActions/deleteDocument';
import viewDocumentAction from '../../actions/docActions/viewDocuments';
import searchDocumentAction from '../../actions/docActions/searchDocument';

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
    this.refreshDocumentsList = this.refreshDocumentsList.bind(this);
  }

  /**
   * @return {void} void
   */
  componentWillMount() {
    if (localStorage.getItem('token') !== null) {
      const decodedToken = jwtDecode(localStorage.getItem('token'));
      this.state = Object.assign({}, this.state, {
        userId: decodedToken.UserId,
        roleId: decodedToken.RoleId,
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
        <Header/>
        <Sidebar />
        <div className="col s12 workspace">
          <div className="row workspace-header">
            <h4 className="col s8">Public/Role Access Documents</h4>
            <div className="col s4">
              <input
                className="col s10"
                type="text"
                id="searchTerms"
                name="searchTerms"
                value={this.state.searchTerms}
                placeholder="Search..."
                onChange={this.handleChange}/>
              <button className="btn col s2" id="searchBtn"
                onClick={this.searchDocument}>
              <i className="material-icons">search</i></button>
            </div>

            <div className="col m1 offset-m11">
              <Link onClick={this.refreshDocumentsList}>
                <i className="material-icons refresh-list-btn">
                  autorenew</i>
              </Link>
            </div>

            <div className="col s5 btnAddDocument">
              <Link className="waves-effect waves-light btn" to="/create-document">
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
                }/> : '')
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
  deleteDocument: documentid =>
    dispatch(deleteDocumentAction(documentid)),
  paginateDocuments: (usertoken, offset, limit) =>
    dispatch(viewDocumentAction(usertoken, offset, limit)),
  searchDocument: (usertoken, documentName) =>
    dispatch(searchDocumentAction(usertoken, documentName))
});

export default connect(mapStoreToProps, mapDispatchToProps)(ViewDocuments);
