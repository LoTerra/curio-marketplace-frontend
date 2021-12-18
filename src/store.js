import React, { createContext, useContext, useReducer } from 'react'
import { LCDClient } from '@terra-money/terra.js'

const lcd = new LCDClient({
    URL: 'https://bombay-lcd.terra.dev',
    chainID: 'bombay-12',
})

const StoreContext = createContext()

//Static dev data for tests
// const baseRaffles = [
//     {id:1,bg:'/img/bull.png',art:'https://pbs.twimg.com/media/FCndFS6X0AIM9NL?format=png&name=900x900',logo:'/img/brand.png',name:'LunaBulls', desc:''},
//     {id:2,bg:'/img/nft-1.jpg',art:'https://pbs.twimg.com/media/FCFU8tFXsAI63bf?format=png&name=small',logo:'/img/logo-1.jpg',name:'SudeshaNFT',desc:'LunaBoys are a collection of 1,020 unique art work representing the Luna Ecosystem. LunaBoys rewards holders. Holding three LunaBoys puts you in a draw to win one of five , 1,000 UST prizes.'},
//     {id:3,bg:'/img/bull.png',art:'https://pbs.twimg.com/media/FCSjVD7VgAEIUdl?format=png&name=small',logo:'/img/brand.png',name:'LunaBulls', desc:''},
//     {id:4,bg:'/img/bull.png',art:'https://pbs.twimg.com/media/FB_7CPHVEAE_W-7?format=jpg&name=large',logo:'/img/brand.png',name:'LunaBulls', desc:''},
//     {id:5,bg:'/img/bull.png',art:'https://pbs.twimg.com/media/FB_qQvVVUAMrWDP?format=jpg&name=large',logo:'/img/brand.png',name:'LunaBulls', desc:''},
//     {id:6,bg:'/img/bull.png',art:'https://pbs.twimg.com/media/FB7TQ2NVIAE8_40?format=jpg&name=large',logo:'/img/brand.png',name:'LunaBulls', desc:''},
//     {id:7,bg:'/img/bull.png',art:'https://pbs.twimg.com/media/FCKxX_IWQAk7vhN?format=jpg&name=medium',logo:'/img/brand.png',name:'LunaBulls', desc:''},
// ]

let cats = [
    'All',
    'Art',
    'Photography',
    'Metaverses',
    'Games',
    'Music',
    'Domains',
    'DeFi',
    'Memes',
    'Punks',
    'Other',
]

const initialState = {
    privAuctionContract: 'terra19var5pwphf9swhp7z3jsjqy2j70luvj7h44g2d',
    privTokenCw20Contract: 'terra1m83w4cy8dfst47l8f0vf7dk9ucdrhdm7l9qxmq',
    categories: cats,
    auctions: [],
    lcd: lcd,
    wallet: {},
}

const reducer = (state, action) => {
    switch (action.type) {
        case 'setAuctions':
            return {
                ...state,
                auctions: action.message,
            }
        case 'setPrivAuctionContract':
            return {
                ...state,
                privAuctionContract: action.message,
            }
        case 'setWallet':
            return {
                ...state,
                wallet: action.message,
            }
        case 'setRaffles':
            return {
                ...state,
                raffles: action.message,
            }
        default:
            throw new Error(`Unhandled action type: ${action.type}`)
    }
}

export const StoreProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState)

    return (
        <StoreContext.Provider value={{ state, dispatch }}>
            {children}
        </StoreContext.Provider>
    )
}

export const useStore = () => useContext(StoreContext)
