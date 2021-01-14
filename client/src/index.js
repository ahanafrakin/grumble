import React from 'react';
import ReactDOM from 'react-dom';
import Header from './components/header/header'
import { BrowserRouter as Router, Route } from "react-router-dom";
import io from 'socket.io-client';
import MainPage from './components/main-page/main-page'
import AboutPage from './components/about-page/about-page'
import CreatePage from './components/create-page/create-page'
import WaitPage from './components/wait-page/wait-page.component'

let socket = io;

const App = () => {	
	return(
		<Router>
			<div>
				<Header />
				<Route path="/" exact component={MainPage} />
				<Route path="/about" component={AboutPage} />
				<Route path="/creategame" component={CreatePage} />
				<Route path="/waitpage" render={(props => <WaitPage {...props} socket={socket}/>)} />
			</div>
		</Router>
	) 
}

ReactDOM.render(
	<App />,
  document.getElementById('root')
);

