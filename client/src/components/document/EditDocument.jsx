import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { browserHistory } from 'react-router';
import React from 'react';
import toastr from 'toastr';
import Header from './../common/Header.jsx';
import Sidebar from './../common/Sidebar.jsx';
import Alert from './../common/Alert.jsx';
import { FroalaEditor } from './../common/FraolaComponent';
import clearErrorAlert from '../../actions/errorActions/errorActions';
import viewDocument from '../../actions/documentActions/viewOneDocument';
import editDocument from '../../actions/documentActions/editDocument';

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
    this.handleContentChange = this.handleContentChange.bind(this);
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
      toastr.success('Updated Successfully');
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
   * handleContentChange
   * @param {object} content - text in the content text area
   * @return {void}
   */
  handleContentChange(content) {
    if (this.state) {
      const document = this.state.document;
      document.content = content;
      this.setState({ document });
    }
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
              <Alert info={this.state} onClose={this.onClose} /> : ''
            }
            <div className="row">
              <div className="input-field col m9 s12">
                <input
                  className="validate"
                  type="text"
                  name="title"
                  id="title"
                  onChange={this.handleChange}
                  value={this.state.document.title}
                  required
                />
                <label className='active' htmlFor="title">Title of Document</label>
              </div>

              <div className="col m3 s12">
                <select
                  name="access"
                  id="access"
                  onChange={this.handleChange}
                  value={this.state.value}
                  className="browser-default"
                >
                  <option value="">Select Access Type</option>
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                  <option value="role">Role</option>
                </select>
              </div>
            </div>
            <div className="row">
              <div className="col s12">
                <FroalaEditor
                  tag='textarea'
                  model={this.state.document.content}
                  onModelChange={this.handleContentChange}
                />
              </div>
            </div>
            <div className="col s12">
              <div className="mt-15">
                <button className="btn col s3 offset-s9" type="submit">Save</button>
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
