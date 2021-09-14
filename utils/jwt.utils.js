const jwt = require('jsonwebtoken');

const JWT_SIGN_SECRET = '13h05143eg5h1e3rn051e35n1e3t51n03et15n3e0t51n35e1n3te51n3e51trnet1n531n3e';
module.exports = {
    generateTokenForUser: function(userData) {
        return jwt.sign({
                userId: userData.id,
                isAdmin: userData.isAdmin
            },
            JWT_SIGN_SECRET, {
                expiresIn: '1h'
            })
    },
    parseAuthorization: function(authorization) {
        //vérification que la chaine bearer est non null
        //on remplace bearer par '' pour recupérer uniquement le Token
        return (authorization != null) ? authorization.replace('Bearer ', '') : null;
    },
    //vérification du userId
    getUserId: function(authorization) {
        let userId = -1; //valeur par défaut inexistante
        let token = module.exports.parseAuthorization(authorization); //le token que l on vient de récupérer
        //si le token est pas null
        if (token != null) {
            try {
                const jwtToken = jwt.verify(token, JWT_SIGN_SECRET);
                if (jwtToken != null)
                    userId = jwtToken.userId;
            } catch (err) {}
        }
        return userId;
    }
}