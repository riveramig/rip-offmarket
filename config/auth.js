module.exports = {

    'facebookAuth' : {
        'clientID'      : '171913630001240', // your App ID
        'clientSecret'  : '721c570dc1e8a0544f3049cea384cdc6', // your App Secret
        'callbackURL'   : 'http://172.30.10.110:3000/users/auth/facebook/callback',
        'profileFields': ['email', 'displayName']
   },

    'twitterAuth' : {
        'consumerKey'       : '5UgYXYdFXNH1P4zc4TYs5qFuN',
        'consumerSecret'    : 'YKnEzpdM8UfFTajVd5cZcxQYHVu685lSnTyjfWdotYh55vZaNW',
        'callbackURL'       : 'http://127.0.0.1:3000/users/auth/twitter/callback'
    },

    'googleAuth' : {
        'clientID'      : '424790351253-031tntl3u256garfdabh6rif628b9t6e.apps.googleusercontent.com',
        'clientSecret'  : 'L6WIij1OQy4c1zHqB1W20Te8',
        'callbackURL'   : 'http://127.0.0.1:3000/users/auth/google/callback'
    }

};