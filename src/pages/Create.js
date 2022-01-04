import React from 'react'
import CreateAuction from '../components/Create/CreateAuction'
import MintNft from '../components/Create/MintNft'

export default () => {
    return (
        <>
            <section className="nfts-big d-flex" style={{minHeight:'100vh'}}>
                <div className="container align-self-center w-100">
                    <div className="row">
                        <div className="col-md-10 intro mx-auto text-center">
                            <h1>
                                <span className="pink">Auction</span> your NFT
                            </h1>
                            <p className="badge">BETA MODE</p>
                            <p className="slogan fs-5">
                                Choosing to sell your NFTs at curio.art means
                                that bidders from around the world can bid
                                online for them.
                            </p>
                        </div>
                        <div className="col-md-10 mx-auto">
                            <CreateAuction />
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
