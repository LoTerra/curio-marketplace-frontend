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
            <h1><span className="green">Buy</span> or <span className="pink">Auction</span> your NFT</h1>
            <p className="slogan">We are currently in <strong>testnet mode</strong>, feel free to test with us</p>
          </div>
          <div className="col-md-10 mx-auto">
          <ul className="nav nav-pills nav-fill mb-3" id="pills-tab" role="tablist">
  <li className="nav-item" role="presentation">
    <button className="nav-link active" id="pills-home-tab" data-bs-toggle="pill" data-bs-target="#pills-home" type="button" role="tab" aria-controls="pills-home" aria-selected="true">Create Auction</button>
  </li>
  <li className="nav-item" role="presentation">
    <button className="nav-link" id="pills-profile-tab" data-bs-toggle="pill" data-bs-target="#pills-profile" type="button" role="tab" aria-controls="pills-profile" aria-selected="false">Mint NFT</button>
  </li>
</ul>
<div className="tab-content" id="pills-tabContent">
  <div className="tab-pane fade show active" id="pills-home" role="tabpanel" aria-labelledby="pills-home-tab">
      <CreateAuction/> 
  </div>
  <div className="tab-pane fade" id="pills-profile" role="tabpanel" aria-labelledby="pills-profile-tab">
      <MintNft/>
  </div>
</div>
          </div>
          </div>
          </div>
          </section>
        </>
    )
}