import React, {
    createContext,
    useContext,
    useReducer,
    useCallback,
} from 'react'
import {
    StdFee,
    MsgExecuteContract,
    LCDClient,
    WasmAPI,
    BankAPI,
} from '@terra-money/terra.js'

const lcd = new LCDClient({
    URL: 'https://lcd.terra.dev/',
    chainID: 'columbus-4',
});

const StoreContext = createContext()

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
    loterraContractAddress: 'terra1q2k29wwcz055q4ftx4eucsq6tg9wtulprjg75w',
    raffles: baseRaffles,
    lcd:lcd,
    wallet:{},
}

const reducer = (state, action) => {
    switch (action.type) {
        case 'setLoterraContractAddress':
            return {
                ...state,
                loterraContractAddress: action.message,
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