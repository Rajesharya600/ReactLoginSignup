import React, {Component} from 'react'
import {Link} from 'react-router-dom'
// import googleButton from './google_signin_buttons/web/1x/btn_google_signin_dark_disabled_web.png'
import googleButton from './google_signin_buttons/web/1x/btn_google_signin_dark_normal_web.png'
import './LoginForm.css'
import {Button, FormGroup, FormControl, ControlLabel} from "react-bootstrap";
class LoginForm extends Component {
    constructor() {
        super()
        this.state = {
            email: "",
            password: "",
            redirectTo: null
        };
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleChange = this.handleChange.bind(this)
    }

    validateForm() {
        return this.state.email.length > 0 && this.state.password.length > 0;
    }

    handleChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        });
    }

    handleSubmit(event) {
        event.preventDefault()
        this.props._login(this.state.email, this.state.password)
    }

    render() {
        return (
            <div className="cover">
                <div className="Login">
                    <form onSubmit={this.handleSubmit}>
                        <div className="title"><h3>Login</h3></div>
                        <FormGroup controlId="email" bsSize="large">
                            <ControlLabel>Email</ControlLabel>
                            <FormControl
                                autoFocus
                                type="email"
                                value={this.state.email}
                                onChange={this.handleChange}
                            />
                        </FormGroup>
                        <FormGroup controlId="password" bsSize="large">
                            <ControlLabel>Password</ControlLabel>
                            <FormControl
                                value={this.state.password}
                                onChange={this.handleChange}
                                type="password"
                            />
                        </FormGroup>
                        <Button
                            block
                            bsStyle="primary"
                            bsSize="large"
                            disabled={!this.validateForm()}
                            type="submit"
                        >
                            Login
                        </Button>
                        <div className="BTNdiv">
                            <a href="/auth/google">
                                <img src={googleButton} alt="sign into Google Button"/>
                            </a>
                            <Link to="/signup" className="">
                                Signup
                            </Link>
                        </div>
                    </form>

                </div>
            </div>
        )
    }
}

export default LoginForm

