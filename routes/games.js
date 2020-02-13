var express = require('express')
var mongoose = require('mongoose');
var router = express.Router();
var {ensureAuthenticated} = require('../helper/auth')

//load game model
require('../models/Game');
var Game = mongoose.model('games')



router.get('/games', ensureAuthenticated, function (req, res) {
    Game.find({ user: req.user.id }).then(function (games) {
        res.render('gameentry/index', {
            games: games
        });
    })
});


router.get('/gameentry/gameentryadd', ensureAuthenticated, function (req, res) {
    res.render('gameentry/gameentryadd');
});


router.get('/gameentry/gameentryedit/:id', ensureAuthenticated, function (req, res) {
    Game.findOne({
        _id: req.params.id
    }).then(function (game) {

        if (game.user != req.user.id) {
            req.flash('error_msg', 'Not authorized')
            res.redirect('/game/games')
        } else {
            res.render('gameentry/gameentryedit',
                {
                    game: game
                });
        }
    })
});




router.get('/enterHighScore', function (req, res) {
    res.render('gameentry/enterhighscore');
});



//Post Requests
router.post('/gameentry',ensureAuthenticated, function (req, res) {
    console.log(req.body);
    var errors = [];
    if (!req.body.title) {
        errors.push({ text: 'Please add a title' })

    }
    if (!req.body.price) {
        errors.push({ text: 'Please add a price' })

    }
    if (!req.body.description) {
        errors.push({ text: 'Please add a description' })
    }

    if (errors.length > 0) {
        res.render('gameentry/gameentryadd', {

            errors: errors,
            title: req.body.title,
            price: req.body.price,
            description: req.body.description,
        })
    } else {
        //Send info to database
        // res.send(req.body)
        var newUser = {
            title: req.body.title,
            price: req.body.price,
            description: req.body.description,
            user: req.user.id
        }
        Game(newUser).save().then(function () {
            req.flash('success_msg', 'Game Added Successfully')
            res.redirect('games')
        })
    }
    //  res.send('Game Posted')
})

router.put("/gameedit/:id",ensureAuthenticated, function (req, res) {
    Game.findOne({
        _id: req.params.id
    }).then(function (game) {
        game.title = req.body.title;
        game.price = req.body.price;
        game.description = req.body.description
        game.save().then(function (game) {
            req.flash('success_msg', 'Game Edited Successfully')
            res.redirect('/games')
        });
    })
})


router.delete('/gamedelete/:id',ensureAuthenticated, function (req, res) {
    Game.remove({
        _id: req.params.id
    }).then(function () {
        req.flash('success_msg', 'Game Deleted Successfully')
        res.redirect('/game/games')
    })
})


module.exports = router;

