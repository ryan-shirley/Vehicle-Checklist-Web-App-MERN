const router = require('express').Router({mergeParams: true})

const Records = require('../models/Records')

router.route('/').get((req, res) => {
    const user_id = req.params.id

    Records.find({ user_id: user_id})
        .select('-user_id')
        .populate('checked_groups.group_id')
        .then(records => res.json(records))
        .catch(err => res.status(400).json({
            code: 400,
            message: err.message
        }))

})

module.exports = router;