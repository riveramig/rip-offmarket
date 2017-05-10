module.exports = {

    'facebookAuth' : {
        'clientID'      : '171913630001240', // your App ID
        'clientSecret'  : '721c570dc1e8a0544f3049cea384cdc6', // your App Secret
        'callbackURL'   : 'http://127.0.0.1:3000/users/auth/facebook/callback',
        'profileFields': ['email', 'displayName']
   },

    'twitterAuth' : {
        'consumerKey'       : '5UgYXYdFXNH1P4zc4TYs5qFuN',
        'consumerSecret'    : 'YKnEzpdM8UfFTajVd5cZcxQYHVu685lSnTyjfWdotYh55vZaNW',
        'callbackURL'       : 'http://127.0.0.1:3000/users/auth/twitter/callback'
    },

    'googleAuth' : {
        'clientID'      : 'your-secret-clientID-here',
        'clientSecret'  : 'your-client-secret-here',
        'callbackURL'   : 'http://localhost:3000/auth/google/callback'
    }

};