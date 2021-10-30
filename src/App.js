import React from 'react'
import { Root, Routes, addPrefetchExcludes } from 'react-static'
import { Router, Link } from "@reach/router"

import { Head } from 'react-static'
import { popper } from '@popperjs/core'
let bootstrap = {}
if (typeof document !== 'undefined') {
    bootstrap = require('bootstrap')
}
import { StoreProvider } from './store'
import './styles/app.scss'
import Navbar from './components/Navbar'
import SingleNft from './pages/Nfts/SingleNft'

//Dont prerender routes starting with (because of dynamic data)
addPrefetchExcludes([
    "nfts"
])
  

function App() {
  return (
    <Root>   
      <Head>
                        <meta charSet="UTF-8" />
                        <meta
                            name="viewport"
                            content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
                        />
                        <title>
                            NFT Raffle - by LoTerra
                        </title>
                        <link
                            rel="icon"
                            type="image/x-icon"
                            href="https://loterra.io/favicon.ico"
                        />
                        <link
                            data-hid="shortcut-icon"
                            rel="shortcut icon"
                            href="https://loterra.io/favicon.ico"
                        />
                        <meta property="og:title" content="LoTerra" />
                        <meta
                            property="og:image"
                            content="https://loterra.io/loterra.png"
                        />
                        <meta property="og:image:alt" content="LoTerra icon" />
                        <meta property="og:type" content="website" />
                        <meta
                            property="og:site_name"
                            content="NFT Raffle"
                        />
                        <meta
                            property="og:description"
                            content="LoTerra is a lottery contract, buy tickets as a player or join the governance! DAO allows making decisions together! Manage the casino 🎰 Set the prize 🏆 Up the ticket price or go cheap 🏷 Extract max profits 🤑 Keep the vault secure at all times!"
                        />
                        <meta name="twitter:card" content="summary" />
                        <meta name="twitter:site" content="LoTerra" />
                        <meta
                            name="twitter:title "
                            content="LoTerra - Decentralized lottery on Terra blockchain"
                        />
                        <meta
                            name="twitter:description"
                            content="LoTerra is a lottery contract, buy tickets as a player or join the governance! DAO allows making decisions together! Manage the casino 🎰 Set the prize 🏆 Up the ticket price or go cheap 🏷 Extract max profits 🤑 Keep the vault secure at all times!"
                        />
                        <meta
                            name="twitter:image"
                            content="https://loterra.io/loterra.png"
                        />
                        <link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
<link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet"/>
                    </Head>   
      <div className="content">
        <React.Suspense fallback={<em>Loading...</em>}>
       
                    <StoreProvider>
                        <Navbar/>
                            <Router>           
                                <SingleNft path="/nfts/:nftId" />                     
                                <Routes default />                                
                            </Router>
                
                    </StoreProvider>

        </React.Suspense>
      </div>
    </Root>
  )
}

export default App
