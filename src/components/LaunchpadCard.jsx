import React, { useEffect, useState } from 'react'
import Media from "./Media";

export default function LaunchpadCard(props) {

    const {a} = props;

    const formatDate = (date) => {
        let formatted = new Date(date * 1000);
        return formatted.toLocaleString()
    }

  return (
    <div className="col-lg-3">
    <a href={'/mint/'+a.launchpad_contract} className="card text-white nft-card ratio ratio-1x1">
    <Media data={{image_url:a.background_image}} />
    <div className="card-img-overlay">
        <div className="d-flex h-100 w-100">
            <div className="nft-info align-self-end w-100">
                <h5 className="card-title m-0">{a.title}</h5>
                <p className="m-0">{formatDate(a.opening_time)}</p>
            </div>
        </div>
    </div>
    </a>
</div>
  );
}