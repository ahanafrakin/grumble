import React from 'react';
import ReactDOM from 'react-dom';
import Header from './components/header/header'
import { BrowserRouter as Router, Route } from "react-router-dom";

import MainPage from './components/main-page/main-page.component'
import AboutPage from './components/about-page/about-page.component'
import CreatePage from './components/create-page/create-page.component'
import WaitPage from './components/wait-page/wait-page.component'

const App = () => {
	return(
		<Router>
			<div>
				<Header />
				<Route path="/" exact component={MainPage} />
				<Route path="/about" component={AboutPage} />
				<Route path="/creategame" component={CreatePage} />
				<Route path="/waitpage" component={WaitPage} />
			</div>
		</Router>
	) 
}

ReactDOM.render(
	<App />,
  document.getElementById('root')
);

