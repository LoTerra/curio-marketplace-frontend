import React from 'react'
import ReactDOM from 'react-dom'
let Wallet = {}
if (typeof document !== 'undefined') {
    Wallet = require('@terra-money/wallet-provider').WalletProvider
}
import { AppContainer } from 'react-hot-loader'

// Your top level component
import App from './App'

const mainnet = {
    name: 'mainnet',
    chainID: 'columbus-5',
    lcd: 'https://lcd.terra.dev',
}

const testnet = {
    name: 'testnet',
    chainID: 'bombay-12',
    lcd: 'https://bombay-lcd.terra.dev',
}

// Export your top level component as JSX (for static rendering)
export default App

// Render your app
if (typeof document !== 'undefined') {
    const target = document.getElementById('root')

    const renderMethod = target.hasChildNodes()
        ? ReactDOM.hydrate
        : ReactDOM.render
    let inProduction = true
    const render = (Comp) => {
        renderMethod(
            <Wallet
                defaultNetwork={testnet}
                walletConnectChainIds={{
                    0: testnet,
                    1: mainnet,
                }}
                connectorOpts={{
                    bridge: inProduction
                        ? 'https://walletconnect.terra.dev/'
                        : 'https://bombay-walletconnect.terra.dev/',
                }}
            >
                <AppContainer>
                    <Comp />
                </AppContainer>
            </Wallet>,
            target,
        )
    }

    // Render!
    render(App)

    // Hot Module Replacement
    if (module && module.hot) {
        module.hot.accept('./App', () => {
            render(App)
        })
    }
}
