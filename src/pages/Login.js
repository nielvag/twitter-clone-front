import React, { Component } from 'react';

import './Login.css';
import twitterLogo from '../twitter.svg';

export default class Login extends Component {
	state = {
		username: ""
	};

	componentDidMount() {
		const ls = localStorage.getItem("@GoTwitter:username");
		if(ls != null) this.setState({ username: ls });
	};

	handleInputChange = (e) => {
		this.setState({ username: e.target.value });
	};

	handleSubmit = (e) => {
		e.preventDefault();

		const { username } = this.state;
		if(!username.length) return;

		localStorage.setItem("@GoTwitter:username", username);

		this.props.history.push('/timeline');		//history é uma propriedade do react-router-dom
	};

	render() {
		return (
			<div className="login-wrapper">
				<img src={twitterLogo} alt="GoTwitter" />
				<form onSubmit={this.handleSubmit}>
					<input
						value={this.state.username}
						placeholder="Nome de Usuário"
						onChange={this.handleInputChange}
					/>
					<button type="submit">Entrar</button>
				</form>
			</div>
		);
	}
}