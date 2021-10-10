import React, {
    createContext,
    useContext,
    useReducer,
    useCallback,
} from 'react'

const StoreContext = createContext()

const initialState = {
    loterraContractAddress: 'terra1q2k29wwcz055q4ftx4eucsq6tg9wtulprjg75w',
}

const reducer = (state, action) => {
    switch (action.type) {
        case 'setLoterraContractAddress':
            return {
                ...state,
                loterraContractAddress: action.message,
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