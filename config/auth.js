module.exports = {

    'facebookAuth' : {
        'clientID'      : '171913630001240', // your App ID
        'clientSecret'  : '721c570dc1e8a0544f3049cea384cdc6', // your App Secret
        'callbackURL'   : 'http://localhost:3000/users/auth/facebook/callback',
        'profileFields': ['email', 'displayName']
   },

    'twitterAuth' : {
        'consumerKey'       : 'your-consumer-key-here',
        'consumerSecret'    : 'your-client-secret-here',
        'callbackURL'       : 'http://localhost:3000/auth/twitter/callback'
    },

    'googleAuth' : {
        'clientID'      : 'your-secret-clientID-here',
        'clientSecret'  : 'your-client-secret-here',
        'callbackURL'   : 'http://localhost:3000/auth/google/callback'
    }

};