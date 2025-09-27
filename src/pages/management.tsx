import React from "react"
import { Link } from "react-router-dom"
import Logo from "../logo.svg"
import "../App.css"

const Management = () => {
    return (
        <div className="management">
            <p>Management Page</p>
            <Link className ="App-link" to= "/">Link to Home</Link>
            <img className="about-img" width="275" src={Logo} alt=""/>
        </div>
    )
}

export default Management