import React from 'react'
import { Root, Routes,addPrefetchExcludes } from 'react-static'
import {
    Switch,
    Route,
    Link
  } from "react-router-dom";
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
import SingleCollection from './pages/Collections/SingleCollection'
import SellerNfts from './pages/Seller/SellerNfts'
import Index from './pages/Index'
import ScrollToTop from './components/ScrollToTop';

//Dont prerender routes starting with (because of dynamic data)
addPrefetchExcludes(['nfts'])

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
                    Curio - Decentralized marketplace on Terra blockchain
                </title>
                <link
                    rel="icon"
                    type="image/x-icon"
                    href="/img/apple-touch-icon.png"
                />
                <link
                    data-hid="shortcut-icon"
                    rel="shortcut icon"
                    href="/img/favicon.ico"
                />
                <meta property="og:title" content="Curio" />
                <meta property="og:image:alt" content="Curio icon" />
                <meta property="og:type" content="website" />
                <meta property="og:site_name" content="Curio" />
                <meta
                    property="og:description"
                    content="Curio the place to find a rare, unusual, or intriguing NFT."
                />
                <meta name="twitter:card" content="summary" />
                <meta name="twitter:site" content="Curio" />
                <meta
                    name="twitter:title "
                    content="Curio - Decentralized marketplace on Terra blockchain"
                />
                <meta
                    name="twitter:description"
                    content="Curio the place to find a rare, unusual, or intriguing NFT."
                />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link
                    rel="preconnect"
                    href="https://fonts.gstatic.com"
                    crossorigin
                />
                <link
                    href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap"
                    rel="stylesheet"
                />
            </Head>
      
            <StoreProvider>
              
                    <div className="page-content">
                        <Navbar />
                        <React.Suspense fallback={<MainLoader />}>
                        <ScrollToTop />

                        <Switch>  
                     
                            <Route exact path="/" component={Index} />
                            <Route exact path="/nfts/:nftid" component={SingleNft} />                               
                            <Route exact path="/collection/:collectioncontract" component={SingleCollection} />
                            <Route exact path="/creator/:selleraddress" component={SellerNfts} />                            
                            <Route exact path="/create">
                                <Create/>
                            </Route>
                            <Route render={() => <Routes/>} />

                        </Switch>
             
                        </React.Suspense>
                    </div>
                    <Footer />
               
            </StoreProvider>

        </Root>
    )
}

export default App
