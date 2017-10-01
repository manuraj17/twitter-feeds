var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.json([
    {
  	  id: 1,
  	  username: "User001"
    },
    {
  	  id: 2,
      username: "User002"
    }
  ]);
});

module.exports = router;
