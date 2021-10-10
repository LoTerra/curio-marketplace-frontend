import path from 'path'
import axios from 'axios'

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
