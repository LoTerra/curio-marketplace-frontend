import path from 'path'
import axios from 'axios'

const raffles = [
  {id:1,bg:'/img/bull.png',art:'https://pbs.twimg.com/media/FCndFS6X0AIM9NL?format=png&name=900x900',logo:'/img/brand.png',name:'LunaBulls', desc:''},
  {id:2,bg:'/img/nft-1.jpg',art:'https://pbs.twimg.com/media/FCFU8tFXsAI63bf?format=png&name=small',logo:'/img/logo-1.jpg',name:'SudeshaNFT',desc:'LunaBoys are a collection of 1,020 unique art work representing the Luna Ecosystem. LunaBoys rewards holders. Holding three LunaBoys puts you in a draw to win one of five , 1,000 UST prizes.'},
  {id:3,bg:'/img/bull.png',art:'https://pbs.twimg.com/media/FCSjVD7VgAEIUdl?format=png&name=small',logo:'/img/brand.png',name:'LunaBulls', desc:''},
  {id:4,bg:'/img/bull.png',art:'https://pbs.twimg.com/media/FB_7CPHVEAE_W-7?format=jpg&name=large',logo:'/img/brand.png',name:'LunaBulls', desc:''},
  {id:5,bg:'/img/bull.png',art:'https://pbs.twimg.com/media/FB_qQvVVUAMrWDP?format=jpg&name=large',logo:'/img/brand.png',name:'LunaBulls', desc:''},
  {id:6,bg:'/img/bull.png',art:'https://pbs.twimg.com/media/FB7TQ2NVIAE8_40?format=jpg&name=large',logo:'/img/brand.png',name:'LunaBulls', desc:''},
  {id:7,bg:'/img/bull.png',art:'https://pbs.twimg.com/media/FCKxX_IWQAk7vhN?format=jpg&name=medium',logo:'/img/brand.png',name:'LunaBulls', desc:''}, 
]


export default {
  getSiteData: async ({ dev }) => ({
    title: 'NFT Raffle',
    lastBuilt: Date.now(),
}),


//maxThreads: 1, // Remove this when you start doing any static generation
getRoutes: async ({ dev }) => [
  
    // A simple route
    {
        path: '/',
        template: 'src/pages/Index',
    },   
    {
      path: '/nfts',
      template: 'src/pages/Nfts/Index',
      getData: async () => ({
        raffles,
      }),
      children: raffles.map(raffle => ({
        path: `${raffle.id}`,
        template: 'src/pages/Nfts/SingleNft',
        getData: async () => ({
          raffle
        }),
      })),
    },

    // A 404 component
    {
        path: '404',
        template: 'src/pages/NotFound',
    },
],
  plugins: [
    ['react-static-plugin-sass'],
    [
      require.resolve('react-static-plugin-source-filesystem'),
      {
        location: path.resolve('./src/pages'),
      },
    ],
    require.resolve('react-static-plugin-reach-router'),
    require.resolve('react-static-plugin-sitemap'),
  ],
}
