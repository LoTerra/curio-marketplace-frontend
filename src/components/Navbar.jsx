import React, { useState, useEffect, useMemo, useRef } from 'react'
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
    CirclesThreePlus,
    PlusCircle,
    Warning,
} from 'phosphor-react'
import UserModal from './UserModal'

export default function Navbar(props) {
    const { state, dispatch } = useStore()
    let connectedWallet = ''

    const [connected, setConnected] = useState(false)
    const [userBids, setUserBids] = useState(false)
    const [priv, setPriv] = useState(false)
    const [bank, setBank] = useState(false)

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

    function returnBank() {
        return (
            <>
                <Wallet
                    size={24}
                    color="#000"
                    style={{ display: 'inline-block', marginTop: '-3px' }}
                />{' '}
                {bank ? (
                    <>
                        <Check
                            size={16}
                            color="#000"
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
                        <a href="/">
                            <img src={'/img/logo.svg'} />
                        </a>
                        <p className="badge">BETA</p>
                    </div>

                    <div
                        className="collapse navbar-collapse"
                        id="navbarSupportedContent"
                    >
                        <ul className="navbar-nav me-auto">
                            <button
                                className="navbar-toggler btn btn-secondary mobile-toggle mt-3 mb-2"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target="#navbarSupportedContent"
                                aria-controls="navbarSupportedContent"
                                aria-expanded="false"
                                aria-label="Toggle navigation"
                            >
                                Close
                            </button>
                            {/* <li className="nav-item">
                        <div className="dropdown">
                        <button className="btn btn-secondary dropdown-toggle" id="dropdownMenuButton1" type="button"
                            data-bs-toggle="dropdown" aria-expanded="false">Categories</button>
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
                    </li> */}
                            {connected && (
                                <li className="nav-item">
                                    <a
                                        className="btn btn-outline-primary ms-md-3"
                                        href="/create"
                                    >
                                        <PlusCircle size={16} weight="bold" />{' '}
                                        Auction
                                    </a>
                                </li>
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
                                    className="btn btn-primary nav-item dropdown-toggle px-2"
                                    type="button"
                                    id="dropdownMenuButton2"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                >
                                    <Wallet
                                        size={24}
                                        color="#000"
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
                            </div>
                        )}
                        {connected && (
                            <>
                                <button
                                    className="btn btn-secondary px-2"
                                    data-bs-toggle="modal"
                                    data-bs-target="#userModal"
                                    onClick={() => setRenderModal(renderModal => !renderModal)}
                                >
                                    <UserCircle
                                        size={24}
                                        style={{ marginTop: '-3px' }}
                                    />
                                </button>

                                <div className="dropdown nav-item ms-2">
                                    <button
                                        className="btn btn-primary dropdown-toggle px-2"
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
        </>
    )
}
