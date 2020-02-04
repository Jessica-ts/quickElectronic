const express = require('express');
const path = require('path');
const fs = require('fs-extra');
const router = express.Router();

const {randomNumber} = require('../helpers/libs');

const Componente = require('../models/Componente');
const User = require('../models/Usuario');
//const Search = require('../models/Search');
const Comment = require('../models/Comment');

const {isAuthenticated} = require('../helpers/auth');


router.get('/componentes/add', isAuthenticated, (req, res) => 
{
	res.render('componentes/nuevo-componente.hbs');
});

router.post('/componentes/nuevo-componente', isAuthenticated, async (req, res) => 
{
	const {nombre,descripcion} = req.body;
	const errors = [];

	if(!nombre)
	{
		errors.push({text: 'Escribe un nombre'});
	}
	if(!descripcion)
	{
		errors.push({text: 'Escribe una descripcion'});
	}
	if(errors.length>0)
	{
		res.render('componentes/nuevo-componente', {errors, nombre, descripcion});
	}
	else
	{
		const imgUrl = randomNumber();
		const repetir = await Componente.find({filename : imgUrl});
		if(repetir.length > 0)
		{
			imgUrl = randomNumber();
		}
		const imagebc = req.file.path;
		const ext = path.extname(req.file.originalname).toLowerCase();
		const targetPath = path.resolve(`public/uploads/${imgUrl}${ext}`);

		if(ext === '.png' || ext ==='.jpg' || ext === '.jpeg' || ext === '.gif')
		{
			//Rename mueve un archivo de un directorio a otro
			await fs.rename(imagebc, targetPath);
			const newComponente = new Componente({
				nombre : req.body.nombre,
				descripcion: req.body.descripcion,  
				filename: imgUrl + ext
			})
			await newComponente.save();
			req.flash('success_msg', 'Componente agregado correctamente');
			
		}
		else
		{
			await fs.unlink(imagebc);
			req.flash('error_msg', 'Solo se aceptan imagenes en este campo');
		}
		res.redirect('/componentes');
	}

});

router.get('/componentes', isAuthenticated, async (req, res) => {
	const componentes = await Componente.find().sort({date: 'desc'});
	res.render('componentes/componentes', {componentes});
});

router.get('/search', isAuthenticated, async(req, res) =>{
	let searchOptions = {}

	if(req.query.author != null && req.query.author !== '')
	{
		searchOptions.author = RegExp(req.query.author, 'i')
	}
	if(req.query.title != null && req.query.title !== '')
	{
		searchOptions.title = RegExp(req.query.title, 'i')
	}
	try	
	{
		const busquedas = await Componente.find(searchOptions).sort({date: 'desc'});
		res.render('componentes/search-books', { busquedas, searchOptions:req.query.author, searchOptions:req.query.title});
	}
	catch
	{
		req.flash('error_msg', 'Componente no encontrado');
	}

});

router.get('/componentes/:id/comentar', isAuthenticated, async (req, res) => 
{
	const postcomment = await Componente.findById(req.params.id);
	const comments = await Comment.find({post_id : postcomment._id});
	res.render('componentes/comentar', {postcomment, comments});
});

router.post('/componentes/:id/comentar', isAuthenticated, async (req, res) => 
{
	const post = await Componente.findById(req.params.id);
	if(post)	
	{
		const newComment = new Comment(
		{
			comment : req.body.comment,
			postedBy: req.body.postedBy
		});

		newComment.post_id = post._id;
		await newComment.save();

		res.redirect('/componentes/' + post._id + '/comentar');
	}
});

router.get('/componentes/editar/:id',isAuthenticated, async (req, res) => {
	const componente = await Componente.findById(req.params.id);
	res.render('componentes/editar-componente', {componente});
});

router.put('/componentes/editar-componente/:id', isAuthenticated, async (req,res) => 
{
	const {nombre, descripcion} = req.body;
	await Componente.findByIdAndUpdate(req.params.id, {nombre, descripcion});
	req.flash('success_msg', 'Componente agregado exitosamente');
	res.redirect('/search');
});

router.delete('/componentes/delete/:id', isAuthenticated, async (req, res) => {
	await Componente.findByIdAndDelete(req.params.id);
	req.flash('success_msg', 'Componente elminado exitosamente');
	res.redirect('/componentes');
});

router.delete('/componentes/deleteCom/:id', isAuthenticated, async (req, res) => 
{
	await Comment.findByIdAndDelete(req.params.id);

	req.flash('success_msg', 'Comentario eliminado exitosamente');
	res.redirect('/componentes');
});

module.exports = router;