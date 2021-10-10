import React, { useState, useEffect } from 'react'
import { useStore } from '../store'

export default function Navbar(props) {
    const { state, dispatch } = useStore()


    return (
        <div className="navbar">
            <div className="container">
                <ul className="navbar-nav ms-auto">
                    <li className="nav-item">
                        <button className="btn btn-outline-primary" href="">Connect wallet</button>
                    </li>
                </ul>
            </div>
        </div>
    )
}