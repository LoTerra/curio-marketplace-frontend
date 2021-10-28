import React, {
    createContext,
    useContext,
    useReducer,
} from 'react'
import {
    LCDClient,
} from '@terra-money/terra.js'

const lcd = new LCDClient({
    URL: 'https://bombay-lcd.terra.dev',
    chainID: 'bombay-12',
});

const StoreContext = createContext()

//Static dev data for tests
const baseRaffles = [
    {id:1,bg:'/img/bull.png',art:'https://pbs.twimg.com/media/FCndFS6X0AIM9NL?format=png&name=900x900',logo:'/img/brand.png',name:'LunaBulls', desc:''},
    {id:2,bg:'/img/nft-1.jpg',art:'https://pbs.twimg.com/media/FCFU8tFXsAI63bf?format=png&name=small',logo:'/img/logo-1.jpg',name:'SudeshaNFT',desc:'LunaBoys are a collection of 1,020 unique art work representing the Luna Ecosystem. LunaBoys rewards holders. Holding three LunaBoys puts you in a draw to win one of five , 1,000 UST prizes.'},
    {id:3,bg:'/img/bull.png',art:'https://pbs.twimg.com/media/FCSjVD7VgAEIUdl?format=png&name=small',logo:'/img/brand.png',name:'LunaBulls', desc:''},
    {id:4,bg:'/img/bull.png',art:'https://pbs.twimg.com/media/FB_7CPHVEAE_W-7?format=jpg&name=large',logo:'/img/brand.png',name:'LunaBulls', desc:''},
    {id:5,bg:'/img/bull.png',art:'https://pbs.twimg.com/media/FB_qQvVVUAMrWDP?format=jpg&name=large',logo:'/img/brand.png',name:'LunaBulls', desc:''},
    {id:6,bg:'/img/bull.png',art:'https://pbs.twimg.com/media/FB7TQ2NVIAE8_40?format=jpg&name=large',logo:'/img/brand.png',name:'LunaBulls', desc:''},
    {id:7,bg:'/img/bull.png',art:'https://pbs.twimg.com/media/FCKxX_IWQAk7vhN?format=jpg&name=medium',logo:'/img/brand.png',name:'LunaBulls', desc:''}, 
]

const initialState = {
    privTokenContract: 'terra187zev94j7xjgqrmgvl5zdm96sugyme0aumnvjf',
    raffles: baseRaffles,
    lcd:lcd,
    wallet:{},
}

const reducer = (state, action) => {
    switch (action.type) {
        case 'setPrivTokenContract':
            return {
                ...state,
                privTokenContract: action.message,
            }
            case 'setWallet':
                return {
                    ...state,
                    wallet: action.message,
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