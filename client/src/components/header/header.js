import React from 'react';
import './header.css';
import { Link } from 'react-router-dom'
import { BrowserRouter as Router, Route } from 'react-router-dom'

const Header = () => {
    return(
        <body>
            <div className="header-container">
                <div className="title-container"><Link className="grumble-title" to="/">Grumble</Link></div>
            </div>
        </body>
    )
}

export default Header
