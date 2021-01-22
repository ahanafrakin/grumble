import React, {useEffect, useRef} from 'react';
import ReactDOM from 'react-dom';
import Header from './components/header/header'
import { BrowserRouter as Router, Route } from "react-router-dom";
import io from 'socket.io-client';
import MainPage from './components/main-page/main-page'
import CreatePage from './components/create-page/create-page'
import WaitPage from './components/wait-page/wait-page'
import SearchPage from './components/search-page/search-page';

const App = () => {
	let socket = io;
	let socketRef = useRef()
	useEffect(()=>{
		document.body.style.backgroundColor = "#121212"
		if(!socketRef.current){
			socket = io();
			socketRef.current = socket;
		}
	},[])
	
	return(
		<Router>
			<div >
				<Header />
				<Route path="/" exact component={MainPage} />
				<Route path="/creategame" component={CreatePage} />
				<Route path="/waitpage" render={(props => <WaitPage {...props} socketRef={socketRef}/>)} />
				<Route path="/searchpage" render={(props => <SearchPage {...props} socketRef={socketRef}/>)} />
			</div>
		</Router>
	) 
}

ReactDOM.render
(
	<App />,
  document.getElementById('root'),
);

