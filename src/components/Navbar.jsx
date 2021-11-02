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
import { MagnifyingGlass, Wallet, Check, UserCircle } from "phosphor-react"; 
import CreateNftModal from './CreateNft'





export default function Navbar(props) {
    const { state, dispatch } = useStore()
    let connectedWallet = ''

    const [connected, setConnected] = useState(false)
    const [bank, setBank] = useState(false)

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

            let coins;
            try{
                const api = new WasmAPI(lcd.apiRequester)
                coins = await lcd.bank.balance(connectedWallet.walletAddress)
                setConnected(true)
            } catch {
               
            }

            let uusd = coins.filter((c) => {
                return c.denom === 'uusd'
            })
            let ust = parseInt(uusd) / 1000000
            setBank(numeral(ust).format('0,0.00'))
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
                    color="#fff"
                    style={{ display: 'inline-block', marginTop: '-3px' }}
                />{' '}
                {bank ? (
                    <>
                        <Check
                            size={16}
                            color="#fff"
                            weight="bold"
                            style={{
                                display: 'inline-block',
                                marginTop: '-8px',
                                marginLeft: '-5px',
                            }}
                        />
                        {bank} UST
                    </>
                ) : (
                    <div className="spinner-border spinner-border-sm" role="status">
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

   
    }, [
        connectedWallet,
        lcd     
    ])

    return (
        <>
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
                    { connected &&
                    <li className="nav-item">
                    <button className="btn btn-primary ms-3" data-bs-toggle="modal" data-bs-target="#createNftModal">
                        Create NFT
                    </button>
                    </li>
                    }
                </ul>
                <ul className="navbar-nav ms-auto">
                <form className="nav-item me-3">
                    <button type="submit"><MagnifyingGlass size={24} weight="bold" /></button>
                    <input className="form-control " type="search" placeholder="Search" aria-label="Search"/>
                </form>
                { connected &&
                    <li className="nav-item">
                    <button className="btn btn-secondary ">
                    <UserCircle size={24} style={{marginTop:'-3px'}}/>
                    </button>
                    </li>
                }
                    <li className="nav-item">
                            { !connected &&
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
                           
                            }
                            { connected &&
                            <>
                            
                               <div className="dropdown">
                                   <button
                                className="btn btn-primary nav-item dropdown-toggle"
                                type="button"
                                id="dropdownMenuButton2"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                           >
                               {returnBank() ? returnBank() : 'loading'}
                           </button>
                           <ul
                                    className="dropdown-menu dropdown-menu-end"
                                    aria-labelledby="dropdownMenuButton2"
                                >
                                    <button
                                        onClick={() => connectTo('disconnect')}
                                        className="dropdown-item"
                                    >                                        
                                        Disconnect
                                    </button>
                                    </ul>
                               </div>
                               </>
                            }
                                
                    </li>
                </ul>
                </div>
            </div>
        </div>
        <CreateNftModal/>
        </>
    )
}