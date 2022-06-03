console.log('a');

const productNameInput = document.getElementById('name');
const productPriceInput = document.getElementById('price');
const productUrlInput = document.getElementById('url');
const sendProductButton = document.getElementById('addProduct');

function addListener(socket){
	sendProductButton.addEventListener('click', () =>{
	const nuevoProducto = {
		title: productNameInput.value,
		price: productPriceInput.value,
		url: productUrlInput.value
	}
	socket.emit('nuevo producto', nuevoProducto);
	console.log(nuevoProducto);
	});
}

const contenedor_productos = document.getElementById('productContainer');
const contenedor_mensajes = document.getElementById('messageContainer');

const form_mensajes = document.getElementById('formMensajes');
const enviar_mensaje = document.getElementById('sendMessageButton');


class Mensaje{
	constructor(mail, texto){
		this.mail = mail.value;
		this.texto = texto.value;
		const date = new Date();
		const dia = date.getDay();
		const mes = date.getMonth();
		const year = date.getFullYear();
		const hora = date.getHours();
		const minutos = date.getMinutes();

		this.fecha = `${dia}/${mes}/${year}, ${hora}:${minutos}`;
	}
}

fetch('main.hbs')
	.then(response => response.text() )
	.then(template => {
		const hbsTemplate = Handlebars.compile(template);

		const socket = io();
		addListener(socket);

		socket.on('productos', (productos)=>{
			console.log(productos);
			const html = hbsTemplate({productos});
			contenedor_productos.innerHTML = html;
		})

		enviar_mensaje.addEventListener('click', () =>{
			const nuevoMensaje = new Mensaje(form_mensajes[0], form_mensajes[1]);
			socket.emit('nuevo mensaje', nuevoMensaje);
		});

	fetch('mensajes.hbs')
		.then(response => response.text())
		.then(messtemplate => {
			const messageTemplate = Handlebars.compile(messtemplate);

			socket.on('mensajes', (mensajes) =>{
				const mensajesHtml = messageTemplate({mensajes});
				contenedor_mensajes.innerHTML = mensajesHtml;
			})
		});
	});

