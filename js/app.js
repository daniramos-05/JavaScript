const productos = [
  {
    id: 1,
    nombre: "Remera",
    image: "https://res.cloudinary.com/dwfbrcxgu/image/upload/v1755737206/remera_aw0dxv.jpg",
    precio: 10000
  },
  {
    id: 2,
    nombre: "Pantalón",
    image: "https://res.cloudinary.com/dwfbrcxgu/image/upload/v1755737207/pantalon_rzw6fa.jpg",
    precio: 18000
  },
  {
    id: 3,
    nombre: "Zapatillas",
    image: "https://res.cloudinary.com/dwfbrcxgu/image/upload/v1755737207/zapatillas_wrnjuu.webp",
    precio: 50000
  },
  {
    id: 4,
    nombre: "Anteojos",
    image: "https://res.cloudinary.com/dwfbrcxgu/image/upload/v1755737206/anteojos_euupci.jpg",
    precio: 3000
  },
  {
    id: 5,
    nombre: "Reloj", image: "https://res.cloudinary.com/dwfbrcxgu/image/upload/v1755737646/reloj_s41eap.avif",
    precio: 20000
  }
];

let saldoInicial = 100000; 
let saldo = parseFloat(localStorage.getItem("saldo")) || saldoInicial;
let cupon = parseFloat(localStorage.getItem("cupon")) || 20000;
let carrito = [];

// DOM
const productosContainer = document.getElementById("productos-container");
const spanSaldo = document.getElementById("saldo");
const spanCupon = document.getElementById("cupon");
const mensaje = document.getElementById("mensaje");
const carritoLista = document.getElementById("carrito");

const toggleCarritoBtn = document.getElementById("toggle-carrito");
const carritoContainer = document.getElementById("carrito-container");
const usarCuponCheckbox = document.getElementById("usar-cupon");
const comprarBtn = document.getElementById("comprar-btn");
const limpiarBtn = document.getElementById("limpiar-btn");
const recargarBtn = document.getElementById("recargar-btn"); // 🔹 nuevo botón


// Renderizar tarjetas de productos
function mostrarProductos() {
  productosContainer.innerHTML = "";
  productos.forEach(p => {
    const card = document.createElement("div");
    card.classList.add("producto");
    card.innerHTML = `
      <h3>${p.nombre}</h3>
      <img class="prod-img" src="${p.image}" alt="">
      <p>Precio: $${p.precio}</p>
      <button class="prod-button" onclick="agregarAlCarrito(${p.id})">Agregar al carrito</button>
    `;
    productosContainer.appendChild(card);
  });
}

// Agregar producto al carrito
function agregarAlCarrito(id) {
  const producto = productos.find(p => p.id === id);
  if (producto) {
    carrito.push(producto);
    actualizarCarrito();
    mostrarMensaje(`🛒 ${producto.nombre} agregado al carrito`);
  }
}

// Actualizar lista del carrito
function actualizarCarrito() {
  carritoLista.innerHTML = "";
  carrito.forEach((p, index) => {
    const li = document.createElement("li");
    li.textContent = `${p.nombre} - $${p.precio}`;
    carritoLista.appendChild(li);
  });
}

// Comprar productos del carrito
function comprar() {
  if (carrito.length === 0) {
    mostrarMensaje("⚠️ El carrito está vacío");
    return;
  }

  let total = carrito.reduce((acc, p) => acc + p.precio, 0);
  let cuponAplicado = 0;

  if (usarCuponCheckbox.checked && cupon > 0) {
    cuponAplicado = Math.min(cupon, total);
    total -= cuponAplicado;
  }

  if (total > saldo) {
    mostrarMensaje("❌ Saldo insuficiente para esta compra.");
    return;
  }

  saldo -= total;
  cupon -= cuponAplicado;
  carrito = [];

  guardarDatos();
  actualizarDOM();
  actualizarCarrito();
  mostrarMensaje(`✅ Compra realizada. Pagaste $${total} (Cupón usado: $${cuponAplicado}).`);
  usarCuponCheckbox.checked = false;
}

// Limpiar carrito
function limpiarCarrito() {
  carrito = [];
  actualizarCarrito();
  mostrarMensaje("🗑️ Carrito limpiado");
}

// Recargar saldo
function recargarSaldo() {
  saldo = saldoInicial; 
  guardarDatos();
  actualizarDOM();
  mostrarMensaje(`💳 Saldo recargado a $${saldo}`);
}

// Actualizar DOM
function actualizarDOM() {
  spanSaldo.textContent = saldo.toFixed(2);
  spanCupon.textContent = cupon.toFixed(2);
}

// Guardar en localStorage
function guardarDatos() {
  localStorage.setItem("saldo", saldo);
  localStorage.setItem("cupon", cupon);
}

// Mostrar mensajes
function mostrarMensaje(texto) {
  mensaje.textContent = texto;
  setTimeout(() => mensaje.textContent = "", 4000);
}

// Eventos
toggleCarritoBtn.addEventListener("click", () => {
  carritoContainer.classList.toggle("oculto");
});
comprarBtn.addEventListener("click", comprar);
limpiarBtn.addEventListener("click", limpiarCarrito);
recargarBtn.addEventListener("click", recargarSaldo);

// Inicializar
mostrarProductos();
actualizarDOM();
actualizarCarrito();
