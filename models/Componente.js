const mongoose = require('mongoose');
const {Schema} = mongoose;
const path = require('path');

const coverImageBasePath = 'uploads/bookCovers'

const ComponenteSchema = new Schema({
	nombre: {type: String, required: true},
	descripcion: { type: String, required: true},
	filename: { type: String },
	fecha: {type: Date, default: Date.now},
	usuario : {type : String}
});


module.exports= mongoose.model('Componente', ComponenteSchema);
