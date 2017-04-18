import React from 'react';
import {Link} from 'react-router';
import { connect } from 'react-redux';
import toastr from 'toastr';
import TextInput from '../common/TextInput';
import { login } from '../../actions/userActions';

class LoginForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      user: {},
      errors: {},
      isLoading: false
    };
    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this
      .onChange
      .bind(this);
  }

  isFormValid() {
    let formIsValid = true;
    let errors = {};

    if (this.state.user.password.length < 0) {
      errors.password = 'Password must be at least 5 characters.';
      formIsValid = false;
    }
    this.setState({errors});
    return formIsValid;
  }

  onSubmit(e) {
    e.preventDefault();
    if (this.isFormValid()) {
      this.setState({ errors: {}, isLoading: true });
      this.props.login(this.state).then(
        (res) => this.context.router.push('/dashboard'),
        (err) => this.setState({ errors: err, isLoading: false })
      );
    }
    console.log('error', this.state.errors);

  }

  onChange(event) {
    const field = event.target.name;
    let user = this.state.user;
    user[field] = event.target.value;
    this.setState({user});
  }

  render() {
    const { errors, isLoading } = this.state;
    const form = (
      <div className="col s12 z-depth-5 card-panel">
        <form className="login-form">

          <div className="row margin">
            <TextInput
              type="email"
              name="email"
              label="email"
              icon="email"
              onChange={this.onChange}
            />
          </div>
          <div className="row margin">
            <TextInput
              type="password"
              name="password"
              label="password"
              icon="lock"
              onChange={this.onChange}
            />
          </div>
          <div className="row">
            <div className="input-field col s12">
              <input
                type="submit"
                value="Login"
                className="btn waves-effect waves-light col s12 pink darken-1"
                disabled={isLoading}
                onClick={this.onSubmit}/>
            </div>
            <div className="input-field col s12">
              <p className="margin center medium-small sign-up">
                Don't have an account?
                <Link to="/signup"> Sign Up</Link>
              </p>
            </div>
          </div>
        </form>
      </div>
    )
    return (
      <div>
        {form}
      </div>
    );
  }
}
LoginForm.propTypes = {
  login: React.PropTypes.func.isRequired
}
LoginForm.contextTypes = {
  router: React.PropTypes.object.isRequired
}
export default connect(null, { login })(LoginForm);
