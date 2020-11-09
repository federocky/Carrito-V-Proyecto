const productos = [
    {
        codigo: 1,
        precio: 2.78,
        nombre: 'Juguete sonido',
        descripcion: 'este juguete es una puta pasada',
        rutaImg: 'img/productos/gato-gusanito-azul.jpg',
        stock: 20, 
        estrellas: 4
    },
    {
        codigo: 2,
        precio: 12.50,
        nombre: 'Cama para perro',
        descripcion: 'una camita muy comoda',
        rutaImg: 'img/productos/cama-perro.jpg',
        stock: 2, 
        estrellas: 5
    },
    {
        codigo: 3,
        precio: 23.50,
        nombre: 'Carrito para peluches',
        descripcion: 'un carrito muy muy chulo',
        rutaImg: 'img/productos/carrito-peluche.jpg',
        stock: 50, 
        estrellas: 5
    },
    {
        codigo: 4,
        precio: 5.99,
        nombre: 'Correa para perros',
        descripcion: 'correa para perro',
        rutaImg: 'img/productos/correa-perro.jpg',
        stock: 50, 
        estrellas: 3
    }
];


let carro = [];




class Carro {

    /**
     * Esto se ejecuta al pinchar en el boton de algun producto
     * @param {*} prod 
     */
    static agregaProducto(prod) {

        let encontrado = false; //flag para comprobar si ya tenemos el producto en el carro

        //si ya tenemos este producto actualizamos su cantidad
        carro.forEach(i => {
            if(i.codigo == prod.codigo) {
                encontrado = true;
                i.cantidad++;
            } 
        })

        //en caso de tener carro vacío o bien no tenemos el producto en el carro lo agregamos
        if (carro.length == 0 || !encontrado) {
            let productoAux = {
                codigo: prod.codigo,
                nombre: prod.nombre,
                precio: prod.precio ,
                rutaImg: prod.rutaImg,
                cantidad: 1
            }
            //productoAux.precio *= productoAux.cantidad; FIXME: no se porque no funciona

            carro.push(productoAux);
        }

    }

    //Al utilizar los controladores de cantidad del carro actualizamos esto en el carro
    static actualizarCantidad(e){
        carro.forEach(producto => {
            if(producto.codigo == e.target.parentElement.parentElement.id) producto.cantidad = e.target.value;
            console.log(producto);
        });
    }


}




class UI {

    /**
     * Se lanza cuando pinchamos en el carro. Nos muestra este recorriendo el array
     */
    static muestraProducto() {
        let contenedorBueno =  document.querySelector('#contenedor-articulos');
        contenedorBueno.innerHTML = '';

        
        carro.forEach(producto => {

            let contenedor = document.createElement('div');
            contenedor.classList.add('articulo');
            contenedor.id = producto.codigo;
            let imagen = document.createElement('img');
            let contenedorSecundario = document.createElement('div');
            let tituloProducto = document.createElement('p');
            tituloProducto.classList.add('titulo-articulo');
            let iconoDelete = document.createElement('i');
            iconoDelete.classList.add('fa', 'fa-trash-alt');
            let input = document.createElement('input');
            input.setAttribute('type', 'number');
            input.classList.add('cantidad-articulos');
            let precio = document.createElement('p');
            precio.classList.add('precio-articulo');
            let precioOriginal = document.createElement('p');

            imagen.src = producto.rutaImg;
            tituloProducto.textContent = producto.nombre;
            input.setAttribute('value', producto.cantidad);
            precio.textContent = (producto.precio * producto.cantidad).toFixed(2);
            precioOriginal.textContent = producto.precio;

            tituloProducto.appendChild(iconoDelete);
            contenedorSecundario.appendChild(tituloProducto);
            contenedorSecundario.appendChild(input);
            contenedorSecundario.appendChild(precioOriginal);
            contenedorSecundario.appendChild(precio);
            contenedor.appendChild(imagen);
            contenedor.appendChild(contenedorSecundario);

            contenedorBueno.appendChild(contenedor);
        })

        UI.actualizarTotal();
        UI.activarControladoresCantidad();
    }


    static actualizarTotal(){
        let total = 0;

        carro.forEach(producto => {
            total += producto.precio * producto.cantidad;
        })

        document.querySelector('#total p span').textContent = total.toFixed(2);
    }

    //pone a la escucha de cualquier evento que se realice sobre la cantidad de los productos.
    static activarControladoresCantidad(){
        document.querySelectorAll('.cantidad-articulos').forEach(element => {
            element.addEventListener('click', e => {
                cambio(e);                
            })
        });

        document.querySelectorAll('.cantidad-articulos').forEach(element => {
            element.addEventListener('keyup', e => {
                cambio(e);                
            });
        });
        //TODO: por que no me funciona esto? element.addEventListener('keyup', cambio(e));
        // seria un codigo mas limpio pero me dice que e no esta definida.

        function cambio(e) {
            UI.actualizarPrecio(e);
            Carro.actualizarCantidad(e);
            UI.actualizarTotal();
        }
    }

    static actualizarPrecio(e){
        e.target.nextElementSibling.nextElementSibling.textContent = (e.target.value * e.target.nextElementSibling.textContent).toFixed(2);
    }


    
    static muestraDedito(e){
        e.target.nextElementSibling.style.transform = 'scale(1.0)';
        setTimeout(() => {
            e.target.nextElementSibling.style.transform = 'scale(0.0)';
        }, 500);
    }

    static cargarProductos (objeto) {
        objeto.forEach(producto => {
            //console.log(producto);

            let article = document.createElement('article');
            article.id = producto.codigo;

            let img = document.createElement('img');
            img.src = producto.rutaImg;

            let tituloProducto = document.createElement('h4');
            tituloProducto.innerText = producto.nombre;

            let estrellas = document.createElement('p');
            for (let i = 0; i < 5; i++) {
                let estrella = document.createElement('i');

                if(i <= producto.estrellas) {
                    estrella.classList.add('fas', 'fa-star');
                    estrellas.appendChild(estrella);
                } else {
                    estrella.classList.add('far', 'fa-star');
                    estrellas.appendChild(estrella);
                }
            }

            let precio = document.createElement('p');
            precio.id = 'precio';
            precio.innerText = producto.precio;


            let botonAgregar = document.createElement('div');
            botonAgregar.classList.add('agregar-carro');
            let carrito = document.createElement('i');
            let dedito = document.createElement('i');
            carrito.classList.add('fas', 'fa-cart-arrow-down');
            dedito.classList.add('far', 'fa-thumbs-up', 'dedito');
            botonAgregar.appendChild(carrito);
            botonAgregar.appendChild(dedito);

            article.appendChild(img);
            article.appendChild(tituloProducto);
            article.appendChild(estrellas);
            article.appendChild(precio);
            article.appendChild(botonAgregar);

            document.querySelector('#articulos').appendChild(article);


        });
    }

} 





//Creo los productos dinamicante a partir de mi Almacen(array de objetos)
UI.cargarProductos(productos);


//pinchamos en agregar al carro
document.querySelectorAll('.agregar-carro').forEach(iterador => {

    iterador.addEventListener('click', e => {
        console.log(e.target.parentElement.parentElement.id);
        let codigoSeleccionado = e.target.parentElement.parentElement.id;
        UI.muestraDedito(e);
        productos.forEach(producto => {
            if(producto.codigo == codigoSeleccionado) {
                Carro.agregaProducto(producto);
                producto.stock--; //esto deberia estar en la funcion
            }
        })
    })
})


//pinchamos en el carrito para verlo
document.querySelector('#icono-carro').addEventListener('click', UI.muestraProducto);
