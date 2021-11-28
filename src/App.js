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
import Create from './pages/Create'
import MainLoader from './components/Loaders/MainLoader'
import Footer from './components/Footer'

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
                            NFT auction marketplace - from LoTerra
                        </title>
                        <link
                            rel="icon"
                            type="image/x-icon"
                            href="#"
                        />
                        <link
                            data-hid="shortcut-icon"
                            rel="shortcut icon"
                            href="https://loterra.io/favicon.ico"
                        />
                        <meta property="og:title" content="Privilege" />
                        <meta
                            property="og:image"
                            content=""
                        />
                        <meta property="og:image:alt" content="Privilege icon" />
                        <meta property="og:type" content="website" />
                        <meta
                            property="og:site_name"
                            content="Privilege marketplace"
                        />
                        <meta
                            property="og:description"
                            content="Privilege auction marketplace, where creators sell NFT's"
                        />
                        <meta name="twitter:card" content="summary" />
                        <meta name="twitter:site" content="Privilege" />
                        <meta
                            name="twitter:title "
                            content="Privilege - Decentralized marketplace on Terra blockchain"
                        />
                        <meta
                            name="twitter:description"
                            content="Privilege auction marketplace, where creators sell NFT's"
                        />
                        <meta
                            name="twitter:image"
                            content=""
                        />
                        <link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
<link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet"/>
                    </Head>   
      <div className="content">
        <React.Suspense fallback={<MainLoader/>}>
       
                    <StoreProvider>
                        <Navbar/>
                            <Router>    
                                <SingleNft path="/nfts/:nftId" />         
                                <Create path="/create" />    
                                <Routes default />                                                                                                                 
                            </Router>
                        <Footer/>
                    </StoreProvider>

        </React.Suspense>
      </div>
    </Root>
  )
}

export default App
