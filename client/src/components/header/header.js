import React from 'react';
import './header.styles.css';
import { Link } from 'react-router-dom'
import { BrowserRouter as Router, Route } from 'react-router-dom'

const Header = () => {
    return(
        <body>
            <div className="header-container">
                <div className="grumble-title"><Link to="/">Grumble</Link></div>
            </div>
        </body>
    )
}

export default Header
