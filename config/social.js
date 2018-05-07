module.exports = {
    facebook: {
        client_id: process.env.CLIENT_ID || '379430232572140',
        client_secret: process.env.CLIENT_SECRET || '74cf5f034b3c3ce9d5364bff9c76c0e8',
        callbackURL: 'http://localhost:3000/auth/facebook/callback/'
    }
}