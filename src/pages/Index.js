import React, { useCallback, useEffect } from 'react'
import NftCard from '../components/NftCard'
import { useStore } from '../store'

import { LCDClient, WasmAPI } from '@terra-money/terra.js'

export default () => {

  const { state, dispatch } = useStore()
  const terra = state.lcd
  const api = new WasmAPI(terra.apiRequester)

  const fetchNftData = useCallback( async() => {
        try {
          const contractConfigInfo = await api.contractQuery(
            state.privTokenContract,
            {
                state: {},
            }          
        )
        console.log(contractConfigInfo)
        } catch {

        }
  })
  useEffect(() => {
    fetchNftData()
}, [fetchNftData])
  return (
<>

  <section className="nfts-big">
    <div className="container">
      <div className="row">
        <div className="col-md-5">
        <NftCard key={1} data={state.raffles[0]} type={'big'} index={99}/>
        </div>
        <div className="col-md-7">
          <div className="row">
            <div className="col-md-4">
              <NftCard key={1} data={state.raffles[1]} type={'small'} index={99}/>
            </div>
            <div className="col-md-4">
              <NftCard key={1} data={state.raffles[2]} type={'small'} index={99}/>
            </div>
            <div className="col-md-4">
              <NftCard key={1} data={state.raffles[3]} type={'small'} index={99}/>
            </div>
            <div className="col-md-4">
              <NftCard key={1} data={state.raffles[4]} type={'small'} index={99}/>
            </div>
            <div className="col-md-4">
              <NftCard key={1} data={state.raffles[5]} type={'small'} index={99}/>
            </div>
            <div className="col-md-4">
              <NftCard key={1} data={state.raffles[6]} type={'small'} index={99}/>
            </div>
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
  

