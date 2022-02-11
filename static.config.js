import path from 'path'
import axios from 'axios'

export default {
    getSiteData: async ({ dev }) => ({
        title: 'Auction marketplace',
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
            path: '/create',
            template: 'src/pages/Create',
        },
        {
            path: '/collections',
            template: 'src/pages/Collections',
        },
        {
            path: '/update-royalty',
            template: 'src/pages/Royalty',
        },
        // A 404 component
        {
            path: '404',
            template: 'src/pages/NotFound',
        },
    ],
    plugins: [
        ['react-static-plugin-sass'],
        ['react-static-plugin-react-router'],
        [
            require.resolve('react-static-plugin-source-filesystem'),
            {
                location: path.resolve('./src/pages'),
            },
        ],

        // require.resolve('react-static-plugin-reach-router'),
        require.resolve('react-static-plugin-sitemap'),
    ],
}
