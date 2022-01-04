import { TelegramLogo, TwitchLogo, TwitterLogo } from 'phosphor-react'
import React, { useState, useEffect, useMemo } from 'react'

export default function Footer(props) {
    return (
      <>
        <footer className="footer mt-auto text-center">
                        <a href="/" className="w-100">
                            <img src={'/img/logo.svg'} style={{width:'160px'}}/>
                        </a>
                        <p className="badge" style={{
                            width: 'auto',
                            background:'#20ff93',
                            color: '#000',
                        }}>BETA MODE</p>
            <p className="m-0 small mb-1" style={{
                opacity:0.5
            }}>Follow us</p>

            <ul className="social">
                <li>
                    <a
                        href="https://t.me/curio_nft"
                        target="_blank"
                        className="p-1"
                    >
                        <TelegramLogo size={24} />
                    </a>
                </li>
                <li>
                    <a
                        href="https://twitter.com/curio_nft"
                        target="_blank"
                        className="p-1"
                    >
                        <TwitterLogo size={24} />
                    </a>
                </li>
            </ul>
        
        </footer>
            <div className="container-fluid py-2" style={{background:'#151516'}}>
            <small style={{
                opacity:0.3,
                fontSize:'13px'
            }}> Copyright Curio 2022. All Rights Reserved.</small>
</div>
      </>
    )
}
