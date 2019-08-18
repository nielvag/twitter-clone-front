import React, { Component } from 'react';
import api from '../services/api';
import socket from 'socket.io-client';

import Tweet from '../components/Tweet';

import './Timeline.css';
import twitterLogo from '../twitter.svg';
import load from '../load.svg';

export default class Timeline extends Component {
	state = {
		tweets: [],
		newTweet: "",
		currPage: 1,
		docs: [],
		paginateInfo: {},
		loadingData: false
	};

	async componentDidMount() {
		window.onscroll = () => this.handleLoadMore();
		this.subscribeToEvents();
		const response = await api.get('tweets');

		const { docs, ...paginateInfo } = response.data;

		this.setState({ tweets: docs, paginateInfo });
	};

	handleLoadMore = () => {
		if(this.state.loadingData) return;

		if (this.state.currPage === this.state.paginateInfo.pages) return;

		var load_more = document.getElementById("load-more");
		var react = load_more.getBoundingClientRect();

		if(react.top <= window.innerHeight) {
			this.setState({ loadingData: true });
			console.log("foi");
			this.loadingTweets();
		}
	};

	loadingTweets = async () => {
		this.setState({ currPage: this.state.currPage + 1 });
		const response = await api.get(`/tweets?page=${this.state.currPage}`);
		this.setState({ tweets: this.state.tweets.concat(response.data.docs) });
		this.setState({ loadingData: false });
	};

	subscribeToEvents = () => {
		const io = socket('http://localhost:3000');

		io.on('tweet', data => {
			this.setState({ tweets: [data, ...this.state.tweets] });
		});

		io.on('like', data => {
			this.setState({ tweets: this.state.tweets.map(tweet => {
					if(tweet._id === data._id) {
						return data;
					} else {
						return tweet;
					}
				})
			});
		});
	};

	handleInputChange = (e) => {
		this.setState({ newTweet: e.target.value });
	};

	handleNewTweet = async (e) => {
		if(e.keyCode !== 13) return;

		const content = this.state.newTweet;
		const author = localStorage.getItem('@GoTwitter:username');

		await api.post('tweets', { content, author });

		this.setState({ newTweet: '' });
	};

	render() {
		return(
			<div className="timeline-wrapper">
				<img height={24} src={twitterLogo} alt="GoTwitter" />

				<form>
					<textarea
						value={this.state.newTweet}
						onChange={this.handleInputChange}
						onKeyDown={this.handleNewTweet}
						placeholder="O que está acontecendo?"
					/>
				</form>
				<ul className="tweet-list">
				{this.state.tweets.map((tweet) =>
						<Tweet key={tweet._id} data={tweet} />
				)}
				</ul>
				<div id="load-more">
				{
					this.state.currPage !== this.state.paginateInfo.pages?
						<img alt="load-icon" src={load} />
					:
						<p>Não há mais tweets</p>
				}
				</div>
			</div>
		);
	}
}