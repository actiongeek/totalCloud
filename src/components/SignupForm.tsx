import React, { Component, FormEvent } from 'react';
import { Link } from "react-router-dom";

import Description from "./Description";

const emailRegex = RegExp(
  /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
);

const passwordRegexp = RegExp(
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/
);

const errorsvg = `
<?xml version="1.0" ?><!DOCTYPE svg  PUBLIC '-//W3C//DTD SVG 1.0//EN'  'http://www.w3.org/TR/2001/REC-SVG-20010904/DTD/svg10.dtd'><svg height="8" style="overflow:visible;enable-background:new 0 0 16 16" viewBox="0 0 16 16" width="16" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g><g id="Error_1_"><g id="Error"><circle cx="16" cy="16" id="BG" r="16" style="fill:#D72828;"/><path d="M14.5,25h3v-3h-3V25z M14.5,6v13h3V6H14.5z" id="Exclamatory_x5F_Sign" style="fill:#E6E6E6;"/></g></g></g></svg>`

export interface SignupFormProps {

}

export interface SignupFormState {
  email: string;
  showPassword: boolean;
  firstName: string;
  lastName: string;
  login: string;
  password: string;
  privacyPolicy: boolean;
  emailValidate: boolean;
  agreeTermsOfServices: boolean;
  signupFailed: boolean;
  signupStage: boolean;
  passwordValidate: boolean;
}

const style = {
  width: "80%",
  margin: "auto",
}

class SignupForm extends Component<SignupFormProps, SignupFormState> {
  constructor(props: SignupFormProps) {
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

  handleEmailChange(e: React.FormEvent<HTMLInputElement>): void {
    this.setState({ 
      email: e.currentTarget.value, 
      emailValidate: emailRegex.test(e.currentTarget.value)}
    )
  }

  handlePasswordChange(e: React.FormEvent<HTMLInputElement>): void {
    this.setState({
      password: e.currentTarget.value,
      passwordValidate: passwordRegexp.test(e.currentTarget.value)
    })
  }

  handleSubmit(e: React.FormEvent<HTMLFormElement>): void {
    e.preventDefault();
    const { email, password, privacyPolicy } = this.state;
    if (emailRegex.test(email)) {
      if (privacyPolicy) {
        this.setState({ signupStage: true });
        const firstName = email.split("@")[0];
        const lastName = firstName;

        const headers: HeadersInit = new Headers();
        headers.append("Accept", "application/json");
        headers.append("Content-Type", "application/json");
        headers.append("q", "0.01");
        headers.append("User-Agent", "request");

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
        <div className="row" style={style}>
          <div className="col-lg-5 offset-lg-1 col-xs-12">
            <Description />
          </div>
          <div className="col-lg-4 offset-lg-1 col-xs-12">
            <div className="row login-form">
              <form onSubmit={ this.handleSubmit }>
                <div className="form-group">
                  <div className="form-row title-row text-center">
                    <h4>Set-up TotalCloud to save engineering costs & time</h4>
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
                      <small>
                        <div dangerouslySetInnerHTML={ { __html: errorsvg } }></div>
                        <span>At least 8 character(s)</span>
                      </small>
                      <br />
                      <small>
                        <div dangerouslySetInnerHTML={ { __html: errorsvg } }></div>
                        <span>At least 1 number(s)</span>
                      </small>
                      <br />
                      <small>
                        <div dangerouslySetInnerHTML={ { __html: errorsvg } } />
                        <span>At least 1 lowercase letter(s)</span>
                      </small>
                      <br />
                      <small>
                        <div dangerouslySetInnerHTML={ { __html: errorsvg } } />
                        <span>At least 1 uppercase letter(s)</span>
                      </small>
                    </div>
                  }
                  <div className="form-row agreements">
                    <input 
                      type="checkbox"
                      className="form-check-input"
                      checked={showPassword}
                      // value={ showPassword }
                      onChange={(e) => this.setState({ showPassword: e.currentTarget.checked })}
                    />
                    <span className="form-check-label">Show Password</span>
                  </div>
                  <div className="form-row agreements my-1">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      // value={ this.state.privacyPolicy }
                      checked={privacyPolicy}
                      onChange={ (e) => this.setState({ privacyPolicy: e.currentTarget.checked }) }
                    />
                    <span className="form-check-label text-white">
                      Get AWS tips and tricks delivered right to your inbox.
                    </span>
                  </div>
                  <div className={`form-row my-4 ${!signupFailed && `mb-1`}`}>
                    <button type="submit" className="btn btn-primary mb-2 login-button">
                      { signupStage ? `Signning Up...`: `Sign Up`}
                    </button>
                  </div>
                  { 
                    signupFailed &&
                    <div className={ `form-row failed-message mb-5` }>
                      <p>Signup Failed</p>
                    </div> 
                  }
                  <div className="form-row awstipsform text-center">
                    <small>
                      By clicking on "Sign Up", you agree to our Terms & acknowledge reading our&nbsp;
                      <Link to="/privacy">
                        Privacy Policy
                      </Link>
                    </small>
                  </div>
                  { 
                  !privacyPolicy &&
                    <div className="form-row service-content">
                      <h6>Please agree our terms of services</h6>
                    </div>
                  }
                  <div className="form-row mb-5 my-3 have-account text-center">
                    <h6>Already have an account?<Link to="/login">Login</Link></h6>
                  </div>
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