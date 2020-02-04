const express = require('express');
const router = express.Router();

const User = require('../models/Usuario');
const {isAuthenticated} = require('../helpers/auth');

const passport = require('passport');
const Componente = require('../models/Componente');

router.get('/', (req, res, next) => {
	res.render('index');
});

router.get('/acerca', isAuthenticated, (req, res) => {
	res.render('acerca');
});

router.get('/users/signin', (req, res) => {
	res.render('users/signin');
});

router.post('/users/signin', passport.authenticate('local', 
{
	successRedirect: '/perfil',
	failureRedirect: '/users/signin', 
	failureFlash: true
}));

router.get('/users/signup', (req, res) => {
	res.render('users/signup');
});

//Ruta para signUp
router.post('/users/signup', async (req, res) => {
	const {nombre, email, password, confirm_password} = req.body;
	const errors = [];
	if((nombre.length <= 0))
	{
		errors.push({text: 'Agrega tu nombre, por favor'});
	}
	if((email.length <= 0))
	{
		errors.push({text: 'Agrega tu correo, por favor'});
	}

	if(password != confirm_password)
	{
		errors.push({text: 'La contraseña no coincide'});
	}
	if(password.length < 8)
	{
		errors.push({text: 'La contraseña debe ser de al menos 8 caracteres'});
	}
	if(errors.length > 0)
	{
		res.render('users/signup', {errors, nombre, email}/*, name, email, password, confirm_password}*/);
	}
	else
	{
		const emailUser = await User.findOne({email : email});
		if(emailUser)
		{
			req.flash('error_msg', 'Este correo ya ha sido registrado');
			res.redirect('/users/signup');
		}
		const newUser = new User({nombre, email, password});
		newUser.password = await newUser.encryptPassword(password);
		await newUser.save();
		req.flash('success_msg', 'Registrado exitosamente');
		res.redirect('/users/signin');
	}
});


router.get('/perfil', isAuthenticated, (req, res) => {
	res.render('perfil');
});

router.get('/users/logout', (req, res) => {
	req.logout();
	res.redirect('/quickElectronic');
});

router.get('/quickElectronic', (req, res) => {
	res.render('quickElectronic');
});

router.get('/contacto', (req, res) => {
	res.render('contacto');
});

router.get('/tiendas', (req, res) => {
	res.render('tiendas');
});

router.get('/videos', (req, res) => {
	res.render('videos');
});

module.exports = router;