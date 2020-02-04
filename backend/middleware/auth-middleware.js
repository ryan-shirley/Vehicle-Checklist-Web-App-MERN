const jwt = require('jsonwebtoken')

const checkIfAuthenticated = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer', '').trim()
        const decoded = jwt.verify(token, process.env.JWT_VERIFY)

        req.decoded = decoded
        // console.log('Authenticated!')
        
        // const user = await User.findOne({ _id:decoded._id, 'tokens.token': token})

        // if(!user){
        //     throw new Error()
        // }

        // req.user = user
    } catch (error) {
        // console.log('Not Authenticated!');
        return res.status(401).json({ error:'You are not authenticated!' })
    }

    return next()
    
}

module.exports = checkIfAuthenticated