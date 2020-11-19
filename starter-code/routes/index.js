const express = require('express');
const router  = express.Router();
const Place = require('../models/place');

/* GET home page */
router.get('/', (req, res, next) => {
  Place.find({},(err, placesFromDb) => {
    if (err) {
      next(err)
    } else {
      res.render('index', {places: placesFromDb});
    }
  })
});

router.get('/add', (req, res, next) => {
  res.render('add');
});

router.get('/edit/:id', (req, res, next) => {
  Place.findById(req.params.id, (err, place) => {
    if(err) {
      next(err);
    } else {
      res.render('edit', {place});
    }
  });
});

router.get('/delete/:id', (req, res, next) => {
  Place.findByIdAndDelete(req.params.id)
    .then(() => res.redirect('/'))
    .catch(e => console.log(`Error deleting place: ${e}`))
});

router.get('/api', (req, res, next) => {
  Place.find({}, (err, allPlacesFromDb) => {
    if(err) {
      next(err);
    } else {
      res.status(200).json({places: allPlacesFromDb})
    }
  })
});

router.post('/', (req, res, next) => {
  const {name, type} = req.body;
  const location = {
    type: 'Point',
    coordinates: [req.body.longitude, req.body.latitude]
  };
  const newPlace = new Place({name, type, location});
  newPlace.save()
    .then(() => res.redirect('/'))
    .catch((e) => console.log(`Error adding place: ${e}`))
});

router.post('/edit/:id', (req, res, next) => {
  Place.findById(req.params.id, (err, place) => {
    if(err) {
      next(err)
    } else {
      const {name, type} = req.body;
      const location = {
        type: 'Point',
        coordinates: [req.body.longitude, req.body.latitude]
      };
      place.name = name;
      place.type = type;
      place.location = location;
      place.save(err => {
        if(err) {
          next(err)
        } else {
          res.redirect('/');
        }
      })
    }
  })
});

module.exports = router;
