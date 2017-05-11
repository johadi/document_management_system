import { browserHistory, Link } from 'react-router';
import { Pagination } from 'react-materialize';
import { connect } from 'react-redux';
import jwtDecode from 'jwt-decode';
import React from 'react';
import PropTypes from 'prop-types';
import { Header, Sidebar } from './../common';
import MyDocumentList from './MyDocumentList.jsx';
import {
  deleteDocumentAction,
  viewDocumentsAction,
  searchDocumentsAction
} from '../../actions/documentActions';

/**
 * MyDocuments class declaration
 */
class MyDocuments extends React.Component {
  /**
   * MyDocuments class constructor
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
        token: localStorage.getItem('token')
      });
      const offset = 0;
      this.props.paginateDocuments(this.state.token,
        offset, this.state.limit, this.state.userId);
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
    this.props.searchDocument(this.state.token, this.state.searchTerms,
      this.state.userId);
  }

  /**
   * Refresh list of documents
   * @return {void} void
   */
  refreshDocumentsList() {
    const offset = 0;
    this.props.paginateDocuments(this.state.token,
      offset, this.state.limit, this.state.userId);
    this.setState({
      searchTerms: ''
    });
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
   * Renders component
   * @return {XML} JSX
   */
  render() {
    if (localStorage.getItem('token') === null) {
      browserHistory.push('/');
    }

    return (
      <div className="row dashboardContainer col s12">
        <Header />
        <Sidebar />
        <div className="col s12 workspace">
          <div className="row workspace-header">
            <div className="row">
              <h4 className="col s8">My Documents</h4>
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
              <div className="col m4 btnAddDocument">
                <Link className="waves-effect waves-light btn" to="/document">
                  <i className="material-icons left">note_add</i>
                  Add Document
                </Link>
              </div>
              <div className="col m1 offset-m7">
                <Link onClick={this.refreshDocumentsList}>
                  <i className="material-icons refresh-list-btn">
                    autorenew</i>
                </Link>
              </div>
            </div>
            <div className="col s2 offset-s10">
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

          </div>

          <div className="col s10 offset-s1 card-panel">
            <MyDocumentList
              documents={this.props.documents || []}
              deleteDocument={this.props.deleteDocument}
            />
          </div>
          <div className="col s10 offset-s1">
            <div className="right">
              {
                ((this.props.pageCount) ?
                  <Pagination
                    items={this.props.pageCount}
                    onSelect={(page) => {
                      const token = localStorage.getItem('token');
                      const offset = (page - 1) * this.state.limit;
                      this.props.paginateDocuments(token,
                        offset, this.state.limit, this.state.userId);
                    }
                } /> : '')
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

MyDocuments.PropTypes = {
  documents: PropTypes.array.isRequired,
  paginateDocuments: PropTypes.func.isRequired,
  deleteDocument: PropTypes.func.isRequired,
  searchDocument: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  documents: state.documentsReducer.documents,
  pageCount: state.documentsReducer.pageCount
});

const mapDispatchToProps = dispatch => ({
  deleteDocument: documentid =>
    dispatch(deleteDocumentAction(documentid)),
  paginateDocuments: (token, offset, limit, userId) =>
    dispatch(viewDocumentsAction(token, offset, limit, userId)),
  searchDocument: (usertoken, searchTerm, userId) =>
    dispatch(searchDocumentsAction(usertoken, searchTerm, userId))
});

export default connect(mapStateToProps, mapDispatchToProps)(MyDocuments);
