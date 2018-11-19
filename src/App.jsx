import React, {Component} from 'react'
import axios from 'axios'
import {Route, Link, Redirect} from 'react-router-dom'
import './App.css'
import LoginForm from './components/Login/LoginForm'
import SignupForm from './components/SignupForm'
import VerifyEmail from './components/VerifyEmail'
import Header from './components/Header'
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Home from './components/Home'

const DisplayLinks = props => {
    if (props.loggedIn) {
        return (
            <nav className="navbar">
                <ul className="nav">
                    <li className="nav-item">
                        <Link to="/" className="nav-link">
                            Home
                        </Link>
                    </li>
                    <li>
                        <Link to="#" className="nav-link" onClick={props._logout}>
                            Logout
                        </Link>
                    </li>
                </ul>
            </nav>
        )
    } else {
        return (
            <nav className="navbar">
            </nav>
        )
    }
}

class App extends Component {
    constructor() {
        super()
        this.state = {
            loggedIn: false,
            user: null,
            redirectTo: null
        }
        this._logout = this._logout.bind(this)
        this._login = this._login.bind(this)
    }

    componentDidMount() {
        axios.get('/auth/user').then(response => {
            console.log(response.data)
            if (!!response.data.user) {
                console.log('THERE IS A USER')
                this.setState({
                    loggedIn: true,
                    user: response.data.user
                })
            } else {
                this.setState({
                    loggedIn: false,
                    user: null
                })
            }
        })
    }

    _logout(event) {
        event.preventDefault()
        console.log('logging out')
        axios.post('/auth/logout').then(response => {
            console.log(response.data)
            if (response.status === 200) {
                this.setState({
                    loggedIn: false,
                    user: null
                });
                toast.success('You are logged out..!', {
                    position: toast.POSITION.TOP_CENTER,
                    autoClose: 4000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true
                });
            }
        })
    }

    _login(email, password) {
        axios
            .post('/auth/login', {
                email,
                password
            })
            .then(response => {
                console.log('Login API:', response);
                if (response.status === 200) {
                    if (response.data.status == "unverified") {
                        toast.warning('Please verify your email..!', {
                            position: toast.POSITION.TOP_CENTER,
                            autoClose: 4000,
                            hideProgressBar: true,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true
                        });
                    } else {
                        // update the state
                        this.setState({
                            loggedIn: true,
                            user: response.data.user
                        })
                    }
                }
            }, error => {
                if (error.response.status === 401) {
                    toast.error('Invalid email or password', {
                        position: toast.POSITION.TOP_CENTER,
                        autoClose: 4000,
                        hideProgressBar: true,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true
                    });
                }
            })
    }

    render() {
        if (this.state.redirectTo) {
            return <Redirect to={{pathname: this.state.redirectTo}}/>
        }

        return (
            <div className="App">
                <div className="App-header"><h1>Login & Signup App</h1>
                    <Header user={this.state.user}/></div>
                <ToastContainer
                    position="bottom-center"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnVisibilityChange
                    draggable
                    pauseOnHover
                />
                {/* LINKS to our different 'pages' */}
                <DisplayLinks _logout={this._logout} loggedIn={this.state.loggedIn}/>
                {/*  ROUTES */}
                <Route exact path="/" component={Home}/>

                <Route
                    exact
                    path="/login"
                    render={() =>
                        <LoginForm
                            _login={this._login}
                            _googleSignin={this._googleSignin}
                        />}
                />
                <Route exact path="/signup" component={SignupForm}/>
                <Route exact path="/verify/:token" component={VerifyEmail}/>
                {/* <LoginForm _login={this._login} /> */}
            </div>
        )
    }
}

export default App
