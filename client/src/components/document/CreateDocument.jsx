import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import React from 'react';
import PropTypes from 'prop-types';
import toastr from 'toastr';
import Header from './../common/Header.jsx';
import Sidebar from './../common/Sidebar.jsx';
import Alert from './../common/Alert.jsx';
import clearErrorAlert from '../../actions/errorActions/errorActions';
import newDocument from '../../actions/documentActions/newDocument';

/**
 * React component for CreateDocument.
 * @class CreateDocument
 */
class CreateDocument extends React.Component {
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
   * componentDidMount
   * @return {void}
   */
  componentDidMount(){
    $(this.refs.access).material_select(this.handleChange.bind(this));
  }

  /**
   * On receiving of props
   * @param {Object} nextProps
   * @return {void} void
   */
  componentWillReceiveProps(nextProps) {
    this.state = Object.assign({}, this.state, {
      error: nextProps.error, success: nextProps.success
    });
    if (this.state.success === true) {
      toastr.success('Created Successfully');
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
    event.preventDefault();
    this.props.create(this.state.document);
  }

  /**
   * on close of alert
   * @return {void} void
   */
  onClose() {
    this.props.alertClose(this.state);
  }

  /**
   * renders the CreateDocument component
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
          <div className="row workspace-header"><h4>Create A Document</h4></div>
          <form onSubmit={this.handleSubmit} className="panel">

            { this.state.error ?
              <Alert info={this.state} onClose={this.onClose}/> : ''
            }
            <div className="row">
              <div className="input-field col m9 s12">
                <input
                  className="validate"
                  type="text"
                  name="title"
                  id="title"
                  onChange={this.handleChange}
                  required/>
                <label htmlFor="title">Title of Document</label>
              </div>

              <div className="col m3 s12">
                <select
                  name="access"
                  id="access"
                  onChange={this.handleChange}
                  value={this.state.value}
                  className="browser-default">
                  <option value="">Select Access Type</option>
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                  <option value="role">Role</option>
                </select>
              </div>
            </div>
            <div className="row">
              <div className="input-field col s12">
                <textarea
                  name="content"
                  id="content"
                  onChange={this.handleChange}
                  placeholder="Type your content here..."/>
              </div>
            </div>
            <div className="col s12">
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

CreateDocument.PropTypes = {
  document: PropTypes.object.isRequired,
  alertClose: PropTypes.func.isRequired,
  create: PropTypes.func.isRequired
};

CreateDocument.contextTypes = {
  router: PropTypes.object
};

const mapStoreToProps = state => ({
  document: state.documentsReducer.document,
  error: state.errorReducer.error,
  success: state.documentsReducer.success
});

const mapDispatchToProps = dispatch => ({
  create: documentDetails => dispatch(newDocument(documentDetails)),
  alertClose: () => dispatch(clearErrorAlert())
});

export default connect(mapStoreToProps, mapDispatchToProps)(CreateDocument);
