import React, { useState, useEffect, useMemo, useRef } from 'react'
import axios from 'axios'
import { LCDClient, WasmAPI } from '@terra-money/terra.js'

import { useStore } from '../store'
import { MagnifyingGlass } from "phosphor-react"; 





export default function Navbar(props) {
    const { state, dispatch } = useStore()
   
    const [connected, setConnected] = useState(false)

    


    function connectTo(to) {
        if (to == 'extension') {
            wallet.connect(wallet.availableConnectTypes[1])
        } else if (to == 'mobile') {
            wallet.connect(wallet.availableConnectTypes[2])
        } else if (to == 'disconnect') { 
            wallet.disconnect()
            dispatch({ type: 'setWallet', message: {} })
        }
        setConnected(!connected)
    }

    return (
        <div className="navbar navbar-expand-md">
            <div className="container-fluid px-5">
                <div className="navbar-brand">
                    <a href="/">SomeName</a>
                </div>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav me-auto">
                    <li className="nav-item">
                        <div className="dropdown">
                        <button className="btn btn-secondary dropdown-toggle" id="dropdownMenuButton1" type="button"
                            data-bs-toggle="dropdown" aria-expanded="false">Select category</button>
                        <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                            <button className="dropdown-item">
                                Category 1
                            </button>
                            <button className="dropdown-item">
                                Category 2
                            </button>
                            <button className="dropdown-item">
                                Category 3
                            </button>
                            <button className="dropdown-item">
                                Category 4
                            </button>
                            <button className="dropdown-item">
                                Category 5
                            </button>
                            <button className="dropdown-item">
                                Category 6
                            </button>
                        </ul>
                        </div>
                    </li>
                </ul>
                <ul className="navbar-nav ms-auto">
                <form className="nav-item me-3">
                    <button type="submit"><MagnifyingGlass size={24} weight="bold" /></button>
                    <input className="form-control " type="search" placeholder="Search" aria-label="Search"/>
                </form>
                    <li className="nav-item">
                    
                                <div className="dropdown">
                                <button
                                    className="btn btn-primary nav-item dropdown-toggle"
                                    type="button"
                                    id="dropdownMenuButton2"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                >                                    
                                    Connect
                                </button>
                                <ul
                                    className="dropdown-menu dropdown-menu-end"
                                    aria-labelledby="dropdownMenuButton2"
                                >
                                    <button
                                        onClick={() => connectTo('extension')}
                                        className="dropdown-item"
                                    >                                        
                                        Terra Station (extension/mobile)
                                    </button>
                                    <button
                                        onClick={() => connectTo('mobile')}
                                        className="dropdown-item"
                                    >                                        
                                        Terra Station (mobile for desktop)
                                    </button>
                                </ul>
                                </div>
                           
                    </li>
                </ul>
                </div>
            </div>
        </div>
    )
}