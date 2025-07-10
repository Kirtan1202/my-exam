var express = require('express');
var router = express.Router();
var product_info = require('../Models/Product');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});
// Product
router.get('/AddProduct', function (req, res, next) {
  res.render('AddProduct')
});
router.post('/AddProduct', function (req, res, next) {
  if (!req.files || !req.files.Upload) {
    return res.status(400).send('No file was uploaded.');
  }

  const uploadedFile = req.files.Upload;
  const uploadPath = './public/Upload/' + uploadedFile.name;

  const product = new product_info({
    name: req.body.txt1,
    price: req.body.txt2,
    description: req.body.txt3,
    Upload: uploadedFile.name
  });

  product.save()
    .then(data => {
      uploadedFile.mv(uploadPath, function (err) {
        if (err) {
          console.log('Error in Uploading Image: ' + err);
          return res.status(500).send(err);
        }
        res.redirect('/DisplayProduct');
      });
    })
    .catch(err => console.log('Error in Inserting Data: ' + err));

});

router.post('/Add-Api', function (req, res, next) {
  const uploadedFile = req.files.Upload;
  const bodydata = {
    name: req.body.txt1,
    price: req.body.txt2,
    description: req.body.txt3,
    Upload: uploadedFile.name
  }
  var product = new product_info(bodydata)
  product.save()
  res.send(JSON.stringify({ "status": 200, "flag": 1, "message": "Data Inserted" }))
});



router.get('/DisplayProduct', function (req, res, next) {
  product_info.find()
    .then(data => {
      res.render('DisplayProduct', { data: data })
    })
    .catch(err => console.log('Error in Display' + err))
});

router.get('/Display-Api', function (req, res, next) {
  product_info.find()
    .then(data => {
      res.json({
        status: 200,
        flag: 1,
        message: "Product Data Fetched Successfully",
        data: data
      });
    })
    .catch(err => {
      res.status(500).json({ status: 500, flag: 0, message: 'Error fetching Product data', error: err });
    });
});


router.get('/delete/:id', function (req, res, next) {
  console.log(req.params.id)
  product_info.findByIdAndDelete(req.params.id)
    .then(data => {
      res.redirect('/DisplayProduct')
    })
    .catch(err => console.log("Error in Deleting"))
});

module.exports = router;
console.log('http://127.0.0.1:5000')