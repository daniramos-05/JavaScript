let precioArticulo = 100;
let saldo = parseFloat(localStorage.getItem("saldo")) || 1000;
let cupon = parseFloat(localStorage.getItem("cupon")) || 200;
let articulosComprados = parseInt(localStorage.getItem("articulosComprados")) || 0;

const cantidadInput = document.getElementById("cantidad");
const usarCuponCheckbox = document.getElementById("usar-cupon");
const comprarBtn = document.getElementById("comprar-btn");
const mensaje = document.getElementById("mensaje");

const spanSaldo = document.getElementById("saldo");
const spanCupon = document.getElementById("cupon");
const spanArticulos = document.getElementById("articulos-comprados");
const spanPrecio = document.getElementById("precio-articulo");

actualizarDOM();

comprarBtn.addEventListener("click", comprarArticulos);

function comprarArticulos() {
  const cantidad = parseInt(cantidadInput.value);
  const usarCupon = usarCuponCheckbox.checked;

  if (isNaN(cantidad) || cantidad <= 0) {
    mostrarMensaje("❌ Ingrese una cantidad válida.");
    return;
  }

  let total = cantidad * precioArticulo;
  let cuponAplicado = 0;

  if (usarCupon && cupon > 0) {
    cuponAplicado = Math.min(cupon, total);
    total -= cuponAplicado;
  }

  if (total > saldo) {
    mostrarMensaje("❌ Saldo insuficiente para esta compra.");
    return;
  }

  saldo -= total;
  cupon -= cuponAplicado;
  articulosComprados += cantidad;

  guardarDatos();

  mostrarMensaje(`✅ Compra realizada: ${cantidad} artículo(s). Total pagado: $${total.toFixed(2)}.`);

  actualizarDOM();

  cantidadInput.value = "";
  usarCuponCheckbox.checked = false;
}

function actualizarDOM() {
  spanSaldo.textContent = saldo.toFixed(2);
  spanCupon.textContent = cupon.toFixed(2);
  spanArticulos.textContent = articulosComprados;
  spanPrecio.textContent = precioArticulo.toFixed(2);
}

function mostrarMensaje(texto) {
  mensaje.textContent = texto;
  setTimeout(() => mensaje.textContent = "", 4000);
}

function guardarDatos() {
  localStorage.setItem("saldo", saldo);
  localStorage.setItem("cupon", cupon);
  localStorage.setItem("articulosComprados", articulosComprados);
}
