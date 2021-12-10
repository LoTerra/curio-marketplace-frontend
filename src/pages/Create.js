import React from 'react'
import CreateAuction from '../components/Create/CreateAuction'
import MintNft from '../components/Create/MintNft'

export default  () => {
 
    
    
    return (
        <>
          <section className="nfts-big">
    <div className="container">
        <div className="row">
          <div className="col-md-10 intro mx-auto text-center">
            <h1><span className="pink">Auction</span> your NFT</h1>
            <p className="badge">TESTNET MODE</p>
            <p className="slogan">Select your NFT and set up the auction</p>
          </div>
          <div className="col-md-10 mx-auto">
          <CreateAuction/> 
          </div>
          </div>
          </div>
          </section>
        </>
    )
}