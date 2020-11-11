
import {productos} from "./almacen.js"; //recuerda que esto solo funciona desde servidor

let carro = [];


class Carro {

    //Se importa la primera vez que abrimos la aplicación
    static importarStorage() {
        let carroAux = JSON.parse(localStorage.getItem('carro'));
        carroAux.forEach(elemento => carro.push(elemento));
    }

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

        Storage.guardar();

    }

    /**
     * Elimina un producto del carro
     */
    static borrarProducto (codigo) {
        carro.forEach(elemento => {
            if(elemento.codigo == codigo) carro.splice(carro.indexOf(elemento),1);
        })
        UI.muestraProducto();
        Storage.guardar();
    }

    //Se actualiza la cantidad de articulos en el carro.
    static actualizarCantidad(e){
        carro.forEach(producto => {
            if(producto.codigo == e.target.parentElement.parentElement.id) producto.cantidad = e.target.value;
        });
        Storage.guardar();
    }


}

class Storage {

    static guardar() {
        localStorage.clear();
        localStorage.setItem('carro', JSON.stringify(carro));
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
            precioOriginal.textContent = producto.precio.toFixed(2);

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
        UI.activarPapelera();
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
                if(e.target.value > 0) cambio(e);
                else {
                    e.target.value = 1;       
                    cambio(e);
                }                
            })

            element.addEventListener('blur', e => {
                if(e.target.value > 0) cambio(e);       
                else {
                    e.target.value = 1;       
                    cambio(e);
                }  
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


    static activarPapelera() { 
        document.querySelectorAll('#contenedor-articulos i').forEach(papelera => {
            papelera.addEventListener('click', (e) => {
                console.log(e.target.parentElement.parentElement.parentElement.id);
                Carro.borrarProducto(e.target.parentElement.parentElement.parentElement.id);
            })
        });
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
            precio.innerText = producto.precio.toFixed(2);


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

    //TODO: POR AQUI
    static borraProductos() {
        document.querySelector('#articulos').innerHTML = "";
    }


    static ordenarProductos () {

        if(desplegable.value == 'precio-asc') {

            productos.sort(function (a, b) {
                if(a.precio > b.precio) return 1;
                if(a.precio < b.precio) return -1;
                return 0;
            })
        } else if (desplegable.value == 'precio-des') {
    
            productos.sort(function (a, b) {
                if(a.precio < b.precio) return 1;
                if(a.precio > b.precio) return -1;
                return 0;
            })
        } else if (desplegable.value == 'valoracion'){
    
            productos.sort(function (a, b) {
                if(a.estrellas < b.estrellas) return 1;
                if(a.estrellas > b.estrellas) return -1;
                return 0;
            })
        } else {
            productos.sort(function (a, b) {
                if(a.codigo > b.codigo) return 1;
                if(a.codigo < b.codigo) return -1;
                return 0;
            })
        }
    
        UI.borraProductos();
        UI.cargarProductos(productos);
        UI.ponerProductosEscucha();
    }

    static agregaProducto(e){

        let codigoSeleccionado = e.target.parentElement.parentElement.id;
        UI.muestraDedito(e);
    
        productos.forEach(producto => {
            if(producto.codigo == codigoSeleccionado) {
                Carro.agregaProducto(producto);
                producto.stock--; //esto deberia estar en la funcion
            }
        })
    }

    static ponerProductosEscucha() {
        document.querySelectorAll('.agregar-carro').forEach(iterador => {
          iterador.addEventListener('click', UI.agregaProducto);
        })
    }
} 




//Creo los productos dinamicante a partir de mi Almacen(array de objetos)
UI.cargarProductos(productos);

//cuando se carga la pagina importamos del localStorage si hubiera algo
window.addEventListener('load', Carro.importarStorage);


UI.ponerProductosEscucha();

//pinchamos en el carrito para verlo
document.querySelector('#icono-carro').addEventListener('click', UI.muestraProducto);


//ponemos a la escucha el desplegable para ord
let desplegable = document.getElementById('ordenar');
desplegable.addEventListener('change', UI.ordenarProductos);






//FIXME: estoy hay que borrarlo, es solo para ir haciendo un seguimiento del carro.
document.getElementById('probando').addEventListener('click', () => {
    console.log(carro);
})