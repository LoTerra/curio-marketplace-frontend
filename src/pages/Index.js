import React from 'react'
import NftCard from '../components/NftCard'

export default () => (
  <>
  <section className="start d-flex">
    <div className="container align-self-center">      
            <span>NFT</span>
            <h1>RAFFLE</h1>
            <p>Get ready for terras biggest nft raffle</p>
    </div>
  </section>

  <section className="nfts">
    <div className="container">
      <div className="row">
          { [1,2,3,4,5,6].map((obj,key) => {
            return (<NftCard key={key} index={key}/>)
          })}
      </div>
    </div>
  </section>
  </>
)
