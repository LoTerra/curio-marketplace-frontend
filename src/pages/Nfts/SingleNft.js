import React, { useState } from 'react'
import { useRouteData } from 'react-static'
import NftCard from '../../components/NftCard'
import { useStore } from '../../store'



export default () => {
 
    const {raffle} = useRouteData()

  const { state, dispatch } = useStore()
  const [amount,setAmount] = useState(0)

  function placeBid(){
      console.log(amount, 'make bid')
      //Check if bid is highest
  }
 
  return (
            <>
            <section className="single-nft-main">
                <div className="container">
                    <div className="row">
                        <div className="col-md-7">
                            <NftCard key={1} data={raffle} type={'xl'} index={99}/>
                        </div>
                        <div className="col-md-5 d-flex">
                            <div className="align-self-center w-100">
                            <h3 className="title">{raffle.name}</h3>
                            <p className="author">Author name</p>
                            <p className="description">{raffle.desc}</p>
                            <h5>Current bids</h5>
                            <table className="table">
                                <tbody>
                                <tr>
                                    <td>Username</td>
                                    <td>1000 UST</td>
                                </tr>
                                <tr>
                                    <td>Username</td>
                                    <td>1000 UST</td>
                                </tr>
                                <tr>
                                    <td>Username</td>
                                    <td>1000 UST</td>
                                </tr>
                                <tr>
                                    <td>Username</td>
                                    <td>1000 UST</td>
                                </tr>
                                <tr>
                                    <td>Username</td>
                                    <td>1000 UST</td>
                                </tr>
                                </tbody>
                            </table>
                            <h5>Your bid</h5>
                            <div className="input-group mb-3">
                                    <span className="input-group-text" id="basic-addon1">
                                        <img src="/img/UST.svg" width="30px" className="img-fluid"/>
                                    </span>
                                    <input type="number" className="form-control amount-input-staking" onChange={(e) => setAmount(e.target.value)} value={amount} autoComplete="off" placeholder="0.00" name="amount"/>
                                </div>
                            <button className="btn btn-primary btn-lg w-100" onClick={() => placeBid()} disabled={amount == 0}>Place bid</button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="nfts">
    <div className="container">
      <div className="row">
        <div className="col-md-12">
        <div className="heading">
            <h3>Category name</h3>
            <p>Here comes a little description about the category</p>
          </div>
        </div>
          { state.raffles && state.raffles.slice(0,4).map((obj,key) => {
            return (
              <div className="col-md-3">
                <NftCard key={key} type={'small'} data={obj} index={key}/>
              </div>
            )
          })}
      </div>
    </div>
  </section>
            </>
  )
}