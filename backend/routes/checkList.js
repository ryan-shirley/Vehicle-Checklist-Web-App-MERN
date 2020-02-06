const router = require('express').Router()
const checkIfAuthenticated = require('../middleware/auth-middleware')

const CheckList = require('../models/CheckList')
const CheckGroup = require('../models/CheckGroup')

router.route('/').get((req, res) => {

    CheckList.find()
        .populate('required_checks.check_group_id')
        .then(list => res.json(list))
        .catch(err => res.status(400).json({
            code: 400,
            message: err.message
        }))

})

module.exports = router;
