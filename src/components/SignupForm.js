import React, { Component } from 'react';
import { Link } from "react-router-dom";

import Description from "./Description";

const emailRegex = RegExp(
  /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
);

const passwordRegexp = RegExp(
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/
);

class SignupForm extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      showPassword: false,
      email: "",
      firstName: "",
      lastName: "",
      login: "",
      password: "",
      privacyPolicy: true,
      emailValidate: true,
      agreeTermsOfServices: true,
      passwordValidate: true,
      signupFailed: false,
      signupStage: false,
    }
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleEmailChange(e) {
    if (emailRegex.test(e.target.value)) {
      this.setState({ email: e.target.value, emailValidate: true})
    } else {
      this.setState({ email: e.target.value, emailValidate: false})
    }
  }

  handlePasswordChange(e) {
    this.setState({
      password: e.target.value,
      passwordValidate: passwordRegexp.test(e.target.value)
    })
  }

  handleSubmit(e) {
    e.preventDefault();
    const { email, password, privacyPolicy } = this.state;
    if (emailRegex.test(email)) {
      if (privacyPolicy) {
        this.setState({ signupStage: true });
        const firstName = email.split("@")[0];
        const lastName = firstName;
    
        const headers = {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "q": 0.01,
          "User-Agent": "request",
        }
        fetch(`${process.env.REACT_APP_SIGNUP_URL}`, {
          method: "post",
          headers,
          body: JSON.stringify({
            userProfile: {
              email,
              firstName,
              lastName,
              password,
            }
          })
        }).then(res => res.json())
          .then(resp => {
            this.setState({ signupStage: false })
            if (resp.errorCauses) {
              this.setState({ signupFailed: true });
            }
          })
      } else {
        this.setState({ agreeTermsOfServices: false})
      }
    } else {
      this.setState({ emailValidate: false });
    }
  }
  render() { 
    const {
      showPassword,
      emailValidate,
      privacyPolicy,
      passwordValidate,
      signupFailed,
      signupStage,
    } = this.state;
    return (
      <div className="container-fluid login">
        <div className="row">
          <div className="col-md-4 offset-md-2 col-xs-12">
            <Description />
          </div>
          <div className="col-md-4 offset-md-1 col-xs-12">
            <div className="row login-form">
              <form onSubmit={ this.handleSubmit }>
                <div className="form-row title-row">
                  <h3>Register For Free</h3>
                </div>
                <div className="form-row my-3 email">
                  <input
                    type="Email"
                    className="form-control context-input"
                    placeholder="Email"
                    value={ this.state.email }
                    onChange={ this.handleEmailChange }
                    required
                  />
                  {!emailValidate && <small>Email is not valid</small>}
                </div>
                <div className="form-row my-3 password">
                  <input
                    type={showPassword ? `textfield`: `password`}
                    className="form-control context-input"
                    placeholder="Set Password"
                    autoComplete="off"
                    value={ this.state.password }
                    onChange={ this.handlePasswordChange }
                    required
                  />
                    
                </div>
                {
                  !passwordValidate &&
                  <div className="password-hint">
                    <small>must be included the special character</small>
                    <small>must be included the uppercase</small>
                    <small>must be included the lowercase</small>
                    <small>must be included the number</small>
                  </div>
                }
                <div className="form-row agreements">
                  <input 
                    type="checkbox"
                    className="form-check-input"
                    value={ this.state.showPassword }
                    onChange={() => this.setState({ showPassword: !this.state.showPassword })}
                  />
                  <span className="form-check-label">Show Password</span>
                </div>
                <div className="form-row agreements my-1">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    value={ this.state.privacyPolicy }
                    onChange={ () => this.setState({ privacyPolicy: !this.state.privacyPolicy }) }
                    defaultChecked
                  />
                  <span className="form-check-label text-white">
                    Subscribe to our blog & get AWS tips and tricks delivered right to your inbox.
                  </span>
                </div>
                <div className={`form-row my-4 ${!signupFailed && `mb-1`}`}>
                  <button type="submit" className="btn btn-primary mb-2 login-button">
                    { signupStage ? `Signning Up...`: `Sign Up`}
                  </button>
                </div>
                { signupFailed &&
                  <div className={ `form-row failed-message mb-5` }>
                    <p>Signup Failed</p>
                  </div> }
                <div className="form-row awstipsform text-center">
                  <h6>
                    By clicking on "Sign Up", you agree to our Terms & acknowledge reading our&nbsp;
                    <Link to="/privacy">
                      Privacy Policy
                    </Link>
                  </h6>
                </div>
                { !privacyPolicy &&
                    <div className="form-row service-content">
                      <h6>Please agree terms of services</h6>
                    </div>
                }
                <div className="form-row mb-5 my-3 have-account">
                  <h6>Already have an account?<Link to="/login">Login</Link></h6>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
 
export default SignupForm;