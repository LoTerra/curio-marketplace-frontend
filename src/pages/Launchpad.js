import { Rocket } from 'phosphor-react'
import React, { useEffect, useState } from 'react'
import { useStore } from '../store'
import axios from "axios";
import Media from '../components/Media';
import LaunchpadCard from '../components/LaunchpadCard';

export default (props) => {

    const { state, dispatch } = useStore()
    const [launchpads, setLaunchpads] = useState([])

    async function get_launchpads(){
        let res = await axios.get(`https://privilege.digital/api/get-launchpads`);
        setLaunchpads(res.data.launchpads)
        console.log(res.data.launchpads)
    }
    useEffect(() => {
        //Do stuff on mount
        get_launchpads()
    },[])

    return (
        <>
            <section className="nfts-big d-flex" style={{ minHeight: '100vh' }}>
            <div className="container align-self-center w-100">
                <div className="row mt-4">
                    <div className="col-lg-8 mx-auto text-center py-4">
                        <Rocket size={'45'} className="d-block mx-auto"/>
                        <h1>Launchpad</h1>
                        <p className="text-muted">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque tellus turpis, pellentesque eget nunc non, vestibulum malesuada odio. Aenean mattis sodales commodo. Vestibulum malesuada egestas bibendum. </p>
                        <a target="_blank" href="https://forms.gle/8oNPQXvynbZwHcsx9" className="btn btn-primary btn-lg">Join launchpad</a>
                    </div>                   
                    <div className="col-12 mt-5">
                        <h4>Active mints</h4>
                        <div className="row">
                            { launchpads && launchpads.length > 0 && launchpads.filter(o => o.opening_time < Math.floor(Date.now() / 1000) && o.closing_time > Math.floor(Date.now() / 1000)).map(a => {
                                return (
                                    <LaunchpadCard a={a}/>
                                )
                            })
                            }
                            { launchpads && launchpads.filter(o => o.opening_time > Math.floor(Date.now() / 1000) || o.closing_time < Math.floor(Date.now() / 1000)).length == 0 &&
                                <div className="col-12">
                                    <div className="card nft-card text-center">
                                        <div className="card-body">
                                            <p className="text-muted m-0">No mint yet</p>
                                        </div>
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                    <div className="col-12 mt-4">
                        <h4>Upcoming projects</h4>
                        <div className="row">
                        { launchpads && launchpads.length > 0 && launchpads.filter(o => o.opening_time > Math.floor(Date.now() / 1000)).map(a => {
                                return (
                                  <LaunchpadCard a={a}/>
                                )
                            })
                            }
                            { launchpads && launchpads.filter(o => o.opening_time < Math.floor(Date.now() / 1000)).length == 0 &&
                                <div className="col-12">
                                    <div className="card nft-card text-center">
                                        <div className="card-body">
                                            <p className="text-muted m-0">No upcoming projects yet</p>
                                        </div>
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                    <div className="col-12 mt-4">
                        <h4>Past launches</h4>
                        <div className="row">
                        { launchpads && launchpads.length > 0 && launchpads.filter(o => o.closing_time  < Math.floor(Date.now() / 1000)).map(a => {
                                return (
                                  <LaunchpadCard a={a}/>
                                )
                            })
                            }
                            { launchpads && launchpads.filter(o => o.closing_time  < Math.floor(Date.now() / 1000) ).length == 0 &&
                                <div className="col-12">
                                    <div className="card nft-card text-center">
                                        <div className="card-body">
                                            <p className="text-muted m-0">No past launches</p>
                                        </div>
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
            </section>
        </>
    )
}
