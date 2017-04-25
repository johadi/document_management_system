import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { browserHistory } from 'react-router';
import React from 'react';
import Header from './../Header.jsx';
import Sidebar from './../Sidebar.jsx';
import Alert from './../Alert.jsx';
import clearErrorAlert from '../../actions/errorActions/errorActions';
import viewDocument from '../../actions/docActions/viewOneDocument';
import editDocument from '../../actions/docActions/editDocument';

/**
 * React component for EditDocument.
 * @class CreateDocument
 */
class EditDocument extends React.Component {
  /**
   * constructor
   * @param {object} props
   */
  constructor(props) {
    super(props);
    this.state = {
      document: {
        title: '',
        content: '',
        access: ''
      },
      success: null,
      error: null
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onClose = this.onClose.bind(this);
  }

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
   * componentDidMount
   * @return {void}
   */
  componentDidMount() {
    $(this.refs.access).material_select(this.handleChange.bind(this));
  }

  /**
   * On receiving of props
   * @param {Object} nextProps
   * @return {void} void
   */
  componentWillReceiveProps(nextProps) {
    this.state = Object.assign({}, this.state, {
      error: nextProps.error,
      success: nextProps.success,
      document: {
        title: nextProps.document.title,
        access: nextProps.document.access,
        content: nextProps.document.content
      }
    });
    $('#access').val(nextProps.document.access);
    if (this.state.success === true) {
      browserHistory.push('/dashboard');
    }
  }

  /**
   * On change of input values
   * @param {object} event
   * @return {void} void
   */
  handleChange(event) {
    const document = this.state.document;
    document[event.target.name] = event.target.value;
    this.setState({ document });
  }

  /**
   * On create document submit
   * @param {object }event
   * @return {void} void
   */
  handleSubmit(event) {
    const token = localStorage.getItem('token');
    event.preventDefault();
    this.props.editDocument(this.state.document, token, this.props.params.id);
  }

  /**
   * on close of alert
   * @return {void} void
   */
  onClose() {
    this.props.alertClose(this.state);
  }

  /**
   * renders the EditDocument component
   * @return {XML} JSX
   */
  render() {
    if (!window.localStorage.getItem('token')) {
      browserHistory.push('/');
    }
    return (
      <div className="row dashboardContainer col s12">
        <Header />
        <Sidebar />
        <div className="col s12 workspace">
          <div className="row workspace-header">
            <h4>Edit document</h4>
          </div>
          <form onSubmit={this.handleSubmit} className="panel">
            { this.state.error ?
              <Alert info={this.state} onClose={this.onClose}/> : ''
            }
            <div className="col s12">
              <div className="col s12">
                <div className="col m9 s12 document-name-field">
                  <input
                    type="text" name="title"
                    id="title"
                    onChange={this.handleChange}
                    placeholder="Name of Document"
                    value={this.state.document.title}/>
                </div>
                <div className="col m3 s12">
                  <select
                    name="access"
                    id="access"
                    onChange={this.handleChange}
                    value={this.state.value}
                    className="browser-default">
                    <option value="" disabled >Select Access Type</option>
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                    <option value="role">Role</option>
                  </select>
                </div>
              </div>
              <div className="col s12">
                <textarea
                  name="content"
                  id="content"
                  onChange={this.handleChange}
                  placeholder="Type your content here..."
                  value={this.state.document.content}/>
              </div>
              <div className="col s2 mt-15">
                <button className="btn" type="submit">Save</button>
              </div>
            </div>

          </form>
        </div>
      </div>
    );
  }
}


EditDocument.PropTypes = {
  document: PropTypes.object.isRequired
};

EditDocument.contextTypes = {
  router: PropTypes.object
};

const mapStoreToProps = state => ({
  document: state.documentsReducer.document,
  error: state.errorReducer.error,
  success: state.documentsReducer.update_status
});

const mapDispatchToProps = dispatch => ({
  viewDocument: (token, documentid) => dispatch(viewDocument(token, documentid)),
  editDocument: (documentDetails, token, documentid) =>
    dispatch(editDocument(documentDetails, token, documentid)),
  alertClose: () => dispatch(clearErrorAlert())
});

export default connect(mapStoreToProps, mapDispatchToProps)(EditDocument);
