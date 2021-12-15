import { TelegramLogo, TwitchLogo, TwitterLogo } from 'phosphor-react'
import React, { useState, useEffect, useMemo } from 'react'

export default function Footer(props){



    return (
        <footer>
            <p className="m-0 text-muted small">Follow us</p>
            <ul>
                <li><a href="https://t.me/LoTerra" target="_blank" className="p-1"><TelegramLogo size={24} color={'#fff'}/></a></li>
                <li><a href="https://twitter.com/LoTerra_LOTA"  target="_blank" className="p-1"><TwitterLogo size={24} color={'#fff'}/></a></li>                
            </ul>
        </footer>
    )
}