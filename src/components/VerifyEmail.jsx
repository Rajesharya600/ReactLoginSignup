import React, {Component} from 'react'
import { Redirect } from 'react-router-dom'
import { toast } from 'react-toastify'
import axios from 'axios'

class VerifyEmail extends Component {
    constructor() {
        super()
        this.state = {
            redirectTo: null
        };
    }

    componentDidMount() {
        if(this.props.match.params.token){
            console.log('verify user',this.props.match.params.token);
            axios.get('/auth/verify',{
                params: {
                    token: this.props.match.params.token
                }}).then(response => {
                if (response.status === 200) {
                    if(response.data.status == "error"){
                        toast.error(response.data.msg, {
                            position: toast.POSITION.TOP_CENTER,
                            autoClose: 4000,
                            hideProgressBar: true,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true
                        });
                    } else if (response.data.status == "success"){
                        toast.success(response.data.msg, {
                            position: toast.POSITION.TOP_CENTER,
                            autoClose: 4000,
                            hideProgressBar: true,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true
                        });
                    } else if (response.data.status == "expired"){
                        toast.warn(response.data.msg, {
                            position: toast.POSITION.TOP_CENTER,
                            autoClose: 4000,
                            hideProgressBar: true,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true
                        });
                    }
                    this.setState({
                        loggedIn: false,
                        user: null,
                        redirectTo: '/login'
                    });
                }
            }, error => {
                this.setState({
                    redirectTo: '/login'
                })
            })
        } else {
            toast.error("Invalid Token", {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 4000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true
            });
        }
    }

    render() {
        if (this.state.redirectTo) {
            return <Redirect to={{pathname: this.state.redirectTo}}/>
        }
        return (
            <div className="cover">
                <h3> Verifying your email. Please wait...</h3>
            </div>
        )
    }
}

export default VerifyEmail

