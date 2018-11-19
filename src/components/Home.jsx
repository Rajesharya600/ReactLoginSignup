import React from 'react'
import { Redirect } from 'react-router-dom'
// TODO - add proptypes

const Home = props => {
	if (props.user) {
		return (
			<div className="Home">
				<p>Current User:</p>
				<code>
					{JSON.stringify(props)}
				</code>
			</div>
		)
	} else {
		return (
			<div className="Home">
				<Redirect from="/" to="login" />
			</div>
		)
	}
}

export default Home
