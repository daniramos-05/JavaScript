let saldoInicial = 200000; 
let saldo = parseFloat(localStorage.getItem("saldo")) || saldoInicial;
let cupon = parseFloat(localStorage.getItem("cupon")) || 20000;
let carrito = JSON.parse(localStorage.getItem("carrito")) || []; 

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
const recargarBtn = document.getElementById("recargar-btn");

let productos = []; 

async function cargarProductos() {
  try {
    const res = await fetch("./data/productos.json");
    productos = await res.json();
    mostrarProductos();
  } catch (error) {
    console.error("Error al cargar productos:", error);
  }
}

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

function agregarAlCarrito(id) {
  const producto = productos.find(p => p.id === id);
  if (producto) {
    carrito.push(producto);
    guardarDatos();
    actualizarCarrito();
    mostrarMensaje(`🛒 ${producto.nombre} agregado al carrito`);
  }
}

function actualizarCarrito() {
  carritoLista.innerHTML = "";
  carrito.forEach((p) => {
    const li = document.createElement("li");
    li.textContent = `${p.nombre} - $${p.precio}`;
    carritoLista.appendChild(li);
  });
}

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

function mostrarProductos(filtro = "todos") {
  productosContainer.innerHTML = "";
  let productosFiltrados = filtro === "todos" ? productos : productos.filter(p => p.categoria === filtro);

  if (productosFiltrados.length === 0) {
    productosContainer.innerHTML = "<p>No hay productos en esta categoría</p>";
    return;
  }

  productosFiltrados.forEach(p => {
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

function limpiarCarrito() {
  if (carrito.length === 0) {
    mostrarMensaje("⚠️ El carrito ya está limpio");
    return;
  }
  carrito = [];
  guardarDatos();
  actualizarCarrito();
  mostrarMensaje("🗑️ Carrito limpiado");
}

document.querySelectorAll(".categorias button").forEach(btn => {
  btn.addEventListener("click", () => {
    const categoria = btn.dataset.categoria;
    mostrarProductos(categoria);
  });
});

cargarProductos().then(() => mostrarProductos("todos"));

function limpiarCarrito() {
  carrito = [];
  guardarDatos();
  actualizarCarrito();
  mostrarMensaje("🗑️ Carrito limpiado");
}

function recargarSaldo() {
  saldo = saldoInicial; 
  guardarDatos();
  actualizarDOM();
  mostrarMensaje(`💳 Saldo recargado a $${saldo}`);
}

function actualizarDOM() {
  spanSaldo.textContent = saldo.toFixed(2);
  spanCupon.textContent = cupon.toFixed(2);
}

function guardarDatos() {
  localStorage.setItem("saldo", saldo);
  localStorage.setItem("cupon", cupon);
  localStorage.setItem("carrito", JSON.stringify(carrito)); 
}

function mostrarMensaje(texto) {
  mensaje.textContent = texto;
  setTimeout(() => mensaje.textContent = "", 4000);
}

toggleCarritoBtn.addEventListener("click", () => {
  carritoContainer.classList.toggle("oculto");
});
comprarBtn.addEventListener("click", comprar);
limpiarBtn.addEventListener("click", limpiarCarrito);
recargarBtn.addEventListener("click", recargarSaldo);

cargarProductos(); 
actualizarDOM();
actualizarCarrito();
