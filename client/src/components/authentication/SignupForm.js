import React, {PropTypes} from 'react';
import {Link} from 'react-router';
import TextInput from '../common/TextInput';
import toastr from 'toastr';

class SignupForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      user: {},
      errors: {}
    };
    this.onChange = this
      .onChange
      .bind(this);
    this.saveUser = this
      .saveUser
      .bind(this);
    this.checkUserExists = this.checkUserExists.bind(this);
    this.clearError = this.clearError.bind(this);
  }

  /**
   *
   * @param {any} event
   * @returns {object} state of object
   *
   * @memberOf SignupPage
   */
  onChange(event) {
    const field = event.target.name;
    let user = this.state.user;
    user[field] = event.target.value;
    this.setState({user});
  }

  isFormValid() {
    let formIsValid = true;
    let errors = {};
    if (this.state.user.password.length < 5) {
      errors.password = 'Password must be at least 5 characters.';
      formIsValid = false;
    }
    this.setState({errors});
    return formIsValid;
  }

  checkUserExists(e) {
    const field = e.target.name;
    const val = e.target.value;
    if (val !== '') {
      this.props.isUserExists(val).then(res => {
        let errors = this.state.errors;
        let invalid;
        if (res.data.user) {
          errors[field] = 'There is user with such ' + field;
          invalid = true;
        } else {
          errors[field] = '';
          invalid = false;
        }
        this.setState({ errors, invalid });
      });
    }
  }

  clearError(e){
    const field = e.target.name;
    let errors = this.state.errors;
    let invalid;

    errors[field] = '';
    invalid = false;
    this.setState({ errors, invalid });
  }

  /**
   *
   *
   * @param {any} event
   *@return {boolean} false
   * @memberOf SignupPage
   */
  saveUser(event) {
    event.preventDefault();
    if (!this.isFormValid()) {
      return;
    }
    this
      .props
      .saveUser(this.state.user)
      .then(() => this.redirect())
      .catch(error => {
        toastr.error('Unable sign up user, please confirm your username and password and try again');
      });
  }

  /**
   *
   *
   *@returns {any} new route
   * @memberOf SignupPage
   */
  redirect() {
    toastr.success('User Successfully Created');
    this.context.router.push('/dashboard');
  }

  render() {
    const {errors} = this.state;
    const form = (
      <div className="col s12 z-depth-5 card-panel">
        <form className="login-form">
          <div className="row margin">
            <TextInput
              type="text"
              name="name"
              label="fullname"
              icon="person_outline"
              onChange={this.onChange}
              error={errors.name}/>
          </div>
          <div className="row margin">
            <TextInput
              type="text"
              name="username"
              label="username"
              icon="person"
              onChange={this.onChange}
              checkUserExists={this.checkUserExists}
              clearError={this.clearError}
              error={errors.username}/>
          </div>
          <div className="row margin">
            <TextInput
              type="email"
              name="email"
              label="email"
              icon="email"
              onChange={this.onChange}
              checkUserExists={this.checkUserExists}
              clearError={this.clearError}
              error={errors.email}/>
          </div>
          <div className="row margin">
            <TextInput
              type="password"
              name="password"
              label="password"
              icon="lock"
              onChange={this.onChange}
              error={errors.password}/>
          </div>
          <div className="row">
            <div className="input-field col s12">
              <input
                type="submit"
                value="Sign Up"
                className="btn waves-effect waves-light col s12 pink darken-1"
                onClick={this.saveUser}/>
            </div>
            <div className="input-field col s12">
              <p className="margin center medium-small sign-up">
                Already have an account?
                <Link to="/"> Login</Link>
              </p>
            </div>
          </div>
        </form>
      </div>
    );
    return (
      <div>
        {form}
      </div>
    );
  }

}
// Pull in the React Router context so router is available on
// this.context.router.
SignupForm.contextTypes = {
  router: PropTypes.object
};
// const SignupForm = ({user, onSave, onChange, saving, errors}) => {};
SignupForm.propTypes = {
  isUserExists: React.PropTypes.func.isRequired
};

export default SignupForm;
