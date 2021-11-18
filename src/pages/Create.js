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
            <p className="slogan">We are currently in <strong>testnet mode</strong>, feel free to test with us</p>
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