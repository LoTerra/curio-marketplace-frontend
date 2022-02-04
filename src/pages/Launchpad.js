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
                        <button className="btn btn-primary btn-lg">Join launchpad</button>
                    </div>                   
                    <div className="col-12 mt-5">
                        <h4>Active mints</h4>
                        <div className="row">
                            { launchpads && launchpads.length > 0 && launchpads.filter(o => new Date(o.opening_time * 1000) >= Date.now() && new Date(o.closing_time * 1000) <= Date.now()).map(a => {
                                return (
                                    <LaunchpadCard a={a}/>
                                )
                            })
                            }
                            { launchpads && launchpads.filter(o => new Date(o.opening_time * 1000) >= Date.now() && new Date(o.closing_time * 1000) <= Date.now()).length == 0 &&
                                <div className="col-12">
                                    <div className="card nft-card text-center">
                                        <div className="card-body">
                                            <p className="text-muted m-0">No public mints yet</p>
                                        </div>
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                    <div className="col-12 mt-4">
                        <h4>Upcoming projects</h4>
                        <div className="row">
                        { launchpads && launchpads.length > 0 && launchpads.filter(o => new Date(o.opening_time * 1000) > Date.now()).map(a => {
                                return (
                                  <LaunchpadCard a={a}/>
                                )
                            })
                            }
                            { launchpads && launchpads.filter(o => new Date(o.opening_time * 1000) < Date.now()).length == 0 &&
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
                        { launchpads && launchpads.length > 0 && launchpads.filter(o => new Date(o.closing_time * 1000) < Date.now()).map(a => {
                                return (
                                  <LaunchpadCard a={a}/>
                                )
                            })
                            }
                            { launchpads && launchpads.filter(o => new Date(o.closing_time * 1000) < Date.now()).length == 0 &&
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
