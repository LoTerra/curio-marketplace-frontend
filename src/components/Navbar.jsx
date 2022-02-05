import React, { useState, useEffect, useMemo, useRef } from 'react'
import { Switch, Route, Link } from 'react-router-dom'

import { LCDClient, WasmAPI } from '@terra-money/terra.js'
import {
    useWallet,
    WalletStatus,
    useConnectedWallet,
    ConnectType,
} from '@terra-money/wallet-provider'
import numeral from 'numeral'
import { useStore } from '../store'
import {
    MagnifyingGlass,
    Wallet,
    Check,
    UserCircle,
    List,
    Rocket,
    CirclesThreePlus,
    PlusCircle,
    Warning,
    House,
    X,
} from 'phosphor-react'
import UserModal from './UserModal'
import LiveFeed from './LiveFeed'
import CollectionSearch from './CollectionSearch'

export default function Navbar(props) {
    const { state, dispatch } = useStore()
    let connectedWallet = ''

    const [connected, setConnected] = useState(false)
    const [userBids, setUserBids] = useState(false)
    const [priv, setPriv] = useState(false)
    const [bank, setBank] = useState(false)
    const [liveFeed, setLiveFeed] = useState([])

    const [renderModal,setRenderModal] = useState(false)

    let wallet = ''
    if (typeof document !== 'undefined') {
        wallet = useWallet()
        connectedWallet = useConnectedWallet()
    }
 
    const lcd = useMemo(() => {
        if (!connectedWallet) {
            return null
        }

        return new LCDClient({
            URL: connectedWallet.network.lcd,
            chainID: connectedWallet.network.chainID,
        })
    }, [connectedWallet])

    async function contactBalance() {
        if (connectedWallet && connectedWallet.walletAddress && lcd) {
            dispatch({ type: 'setWallet', message: connectedWallet })

            let coins
            let privToken
            try {
                const api = new WasmAPI(lcd.apiRequester)
                coins = await lcd.bank.balance(connectedWallet.walletAddress)

                privToken = await api.contractQuery(
                    state.privTokenCw20Contract,
                    {
                        balance: {
                            address: connectedWallet.walletAddress,
                        },
                    },
                )
                setPriv(privToken.balance)
                // const bidderData = await api.contractQuery(
                //     state.privAuctionContract,
                //     {
                //         bidder:{
                //             auction_id:0,
                //             address: connectedWallet.walletAddress
                //         }
                //     }
                // )
                // setUserBids(bidderData)
                // console.log(bidderData)
                //console.log(privToken)

               // console.log(coins)
                let uusd = coins.filter((c) => {
                    return c.denom === 'uusd'
                })
                let ust = parseInt(uusd) / 1000000
               // console.log(uusd, 'ust bank')
                setBank(numeral(ust).format('0,0.00'))
                setConnected(true)
            } catch {}
        }
    }

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

    function returnTogglers(){
        return(
            <>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#collectionSearchContainer" aria-controls="collectionSearchContainer" aria-expanded="false" aria-label="Toggle navigation">
            <MagnifyingGlass size={21}  color={'#fff'} weight="bold"  style={{
                                            display: 'inline-block',
                                            marginTop: '-3px',
                                        }}/>
            </button>
                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <List size={21}  color={'#fff'} weight="bold"  style={{
                                            display: 'inline-block',
                                            marginTop: '-3px',
                                        }}/>
            </button>
            </>
        )
    }

    function returnBank() {
        return (
            <>
                <Wallet
                    size={21}
                    weight={'bold'}
                    color="#fff"
                    style={{ display: 'inline-block', marginTop: '-3px' }}
                />{' '}
                {bank ? (
                    <>
                        <Check
                            size={14}
                            color="#fff"
                            weight="bold"
                            style={{
                                display: 'inline-block',
                                marginTop: '-8px',
                                marginLeft: '-5px',
                            }}
                        />
                        {/* {bank} UST */}
                    </>
                ) : (
                    <div
                        className="spinner-border spinner-border-sm"
                        role="status"
                    >
                        <span className="visually-hidden">Loading...</span>
                    </div>
                )}
            </>
        )
    }

    useEffect(() => {
        const pusher = new Pusher(/* testnet: '371306b233edc5c8cfb9'*/ 'cc01f6108151986beed1', {
            cluster: 'eu',
        })

        //console.log(window.sessionStorage.getItem("liveFeed"))

        // if (typeof(Storage) !== "undefined") {
        //     dispatch({ type: 'setLiveFeed', message: [...state.liveFeed, window.sessionStorage.getItem("liveFeed")] })
        // }

    
        const channel = pusher.subscribe('auction-channel')
        channel.bind('bid-event', function (data) {
            console.log(data)
            let parsed_data = JSON.parse(JSON.stringify(data.message))
            //setLiveFeed(liveFeed => [...liveFeed, {obj:JSON.parse(JSON.stringify(data.message)),type:'bid'}])
            dispatch({ type: 'setLiveFeed', message: [...state.liveFeed, {auction:JSON.parse(parsed_data),type:'bid'}] })
            //window.sessionStorage.setItem('liveFeed', liveFeed );
        })
        channel.bind('buy-event', async function (data) {
            // console.log(data)      
        })
        return () => {
            pusher.unsubscribe('auction-channel')
        }
    }, [state.liveFeed])

    useEffect(() => {
        if (connectedWallet) {
            contactBalance()
        }
    }, [connectedWallet, lcd, bank])

    return (
        <>
            <div className="top-notice">
                <div className="container-fluid">
                    <p style={{ fontWeight: 700 }}>
                        <Warning size={'16'} /> We are in contact with security
                        audit, until a full audit report we recommend to use
                        Curio at your own discretion and risk.
                    </p>
                </div>
            </div>
            <div className="navbar navbar-expand-lg">
                <div className="container-fluid">
                    <div className="navbar-brand">
                        <Link to="/">
                            <img src={'/img/logo.svg'} />
                        </Link>
                        <p className="badge">BETA</p>
                    </div>
                    <div
                        className="collapse navbar-collapse"
                        id="collectionSearchContainer"
                    >
                    <div className="navbar-nav nav-selector me-auto">
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#collectionSearchContainer" aria-controls="collectionSearchContainer" aria-expanded="false" aria-label="Toggle navigation">
                    <X size={24}  color={'#fff'} weight="bold"/>
                    </button>
                        <CollectionSearch />
                    </div>
                    </div>
                
                    <div
                        className="collapse navbar-collapse"
                        id="navbarSupportedContent"
                    >
                                          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <X size={24}  color={'#fff'} weight="bold"/>
                    </button>
                        <ul className="navbar-nav main-nav ms-auto">
                           { !connected && (
                            <>
                           <li className="nav-item">
                                    {/* <a
                                        className="btn btn-outline-primary ms-md-3"
                                        href="/create"
                                    > */}
                                    <Link to="/" className="nav-link">
                                        <House size={16} weight="bold" />{' '}
                                        Home
                                    </Link>
                                    {/* </a> */}
                                </li>
                            <li className="nav-item">
                            {/* <a
                                className="btn btn-outline-primary ms-md-3"
                                href="/create"
                            > */}
                            <Link to="/launchpad" className="nav-link">
                                <Rocket size={16} weight="bold" />{' '}
                                Launchpad
                            </Link>
                            {/* </a> */}
                        </li>
                            </>
                           )
                           }
                            {connected && (
                                <>
                                <li className="nav-item">
                                    {/* <a
                                        className="btn btn-outline-primary ms-md-3"
                                        href="/create"
                                    > */}
                                    <Link to="/" className="nav-link">
                                        <House size={16} weight="bold" />{' '}
                                        Home
                                    </Link>
                                    {/* </a> */}
                                </li>                            
                                <li className="nav-item">
                                {/* <a
                                    className="btn btn-outline-primary ms-md-3"
                                    href="/create"
                                > */}
                                <Link to="/launchpad" className="nav-link">
                                    <Rocket size={16} weight="bold" />{' '}
                                    Launchpad
                                </Link>
                                {/* </a> */}
                            </li>
                            <li className="nav-item">
                                {/* <a
                                    className="btn btn-outline-primary ms-md-3"
                                    href="/create"
                                > */}
                                <Link to="/create" className="nav-link">
                                    <PlusCircle size={16} weight="bold" />{' '}
                                    Create Auction
                                </Link>
                                {/* </a> */}
                            </li>
                                </>
                            )}
                        </ul>
                        {/* <ul className="navbar-nav ms-auto">
                
                <form className="nav-item me-3">
                    <button type="submit"><MagnifyingGlass size={24} color={'#595959'} weight="bold" /></button>
                    <input className="form-control " type="search" placeholder="Search" aria-label="Search"/>
                </form>
                
            
                </ul> */}
                    </div>

                    <div className="d-flex">
                        {!connected && (
                            <div className="dropdown">
                                <button
                                    className="btn nav-item text-white dropdown-toggle px-2"
                                    type="button"
                                    id="dropdownMenuButton2"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                >
                                    <Wallet
                                        size={21}
                                        color="#fff"
                                        style={{
                                            display: 'inline-block',
                                            marginTop: '-3px',
                                        }}
                                    />
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
                                {returnTogglers()}
                
                            </div>
                        )}
                        {connected && (
                            <>
                                <button
                                    className="btn px-2"
                                    data-bs-toggle="modal"
                                    data-bs-target="#userModal"
                                    onClick={() => setRenderModal(renderModal => !renderModal)}
                                >
                                    <UserCircle
                                        size={21}
                                        color={'#fff'}
                                        weight={'bold'}
                                        style={{ marginTop: '-3px' }}
                                    />
                                </button>

                                <div className="dropdown nav-item ms-2">
                                    <button
                                        className="btn dropdown-toggle text-white px-2"
                                        type="button"
                                        id="dropdownMenuButton2"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                    >
                                        {returnBank()
                                            ? returnBank()
                                            : 'loading'}
                                    </button>
                                    <ul
                                        className="dropdown-menu dropdown-menu-end"
                                        aria-labelledby="dropdownMenuButton2"
                                    >
                                        <button
                                            onClick={() =>
                                                connectTo('disconnect')
                                            }
                                            className="dropdown-item"
                                        >
                                            Disconnect
                                        </button>
                                    </ul>
                                </div>
                          {returnTogglers()}
                 
                            </>
                        )}

                        {/* <button className="nav-item navbar-toggler px-2 btn ms-2 btn-secondary" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <List size={24} color={'#fff'}/>
                </button> */}
                    </div>
                </div>
            </div>
            { connectedWallet && connectedWallet.walletAddress &&                 
                    <UserModal bank={bank} priv={priv} connectedWallet={connectedWallet} renderModal={renderModal} setRenderModal={() => setRenderModal(renderModal => !renderModal)} />               
            }
            <LiveFeed data={liveFeed}/>
        </>
    )
}
