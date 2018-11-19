import React, {Component} from 'react'
import axios from 'axios'
import {Redirect, Link} from 'react-router-dom'
import './SignupForm.css'
import {Button, FormGroup, FormControl, ControlLabel} from "react-bootstrap";
import {toast} from 'react-toastify';

class SignupForm extends Component {
    constructor() {
        super()
        this.state = {
            email: '',
            password: '',
            confirmPassword: '',
            redirectTo: null
        }
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleChange = this.handleChange.bind(this)
    }

    handleChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        });
    }

    validateForm() {
        return this.state.email.length > 0 && this.state.password.length > 0 && this.state.confirmPassword.length > 0;
    }

    handleSubmit(event) {
        event.preventDefault()
        // TODO - validate!
        axios
            .post('/auth/signup', {
                email: this.state.email,
                password: this.state.password
            })
            .then(response => {
                console.log(response)
                if (!response.data.error) {
                    this.setState({
                        redirectTo: '/login'
                    })
                } else {
                    toast.error(response.data.error, {
                        position: toast.POSITION.TOP_CENTER,
                        autoClose: 4000,
                        hideProgressBar: true,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true
                    });
                    console.log('duplicate')
                }
            })
    }

    render() {
        if (this.state.redirectTo) {
            toast.success("Signup successfull. Please verify your email to continue.", {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 4000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true
            });
            return <Redirect to={{pathname: this.state.redirectTo}}/>
        }
        return (
            <div className="cover">
                <div className="SignUp">
                    <form onSubmit={this.handleSubmit}>
                        <div className="title"><h3>Signup</h3></div>
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
                        <FormGroup controlId="confirmPassword" bsSize="large">
                            <ControlLabel>Confirm Password</ControlLabel>
                            <FormControl
                                value={this.state.confirmPassword}
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
                            Sign up
                        </Button>
                        <div className="textCenter">
                            <Link to="/login">
                                Back to login
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}

export default SignupForm
