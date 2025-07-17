const precioArticulo = 15;
let articulosComprados = 0;
let saldo = 0;
let cupon = 0;

function ingresarCupon() {
  while (true) {
    let valor = parseFloat(prompt("Ingrese el valor de su cupón:"));

    if (!isNaN(valor) && valor > 1 && valor < 20) {
      cupon = valor;
      alert("✅ Cupón cargado con éxito por $" + cupon);
      break;
    } else {
      alert(
        "❌ El valor del cupón debe ser un número mayor a 1 y menor a 20. Por favor intente nuevamente."
      );
    }
  }
}

function comprarArticulos() {
  let cantidad = parseInt(
    prompt("Ingrese la cantidad de artículos que desea comprar:")
  );

  if (isNaN(cantidad) || cantidad <= 0) {
    alert("Por favor ingrese una cantidad válida.");
    return;
  }

  let totalAPagar = cantidad * precioArticulo;

  if (cupon > 0) {
    let usarCupon = confirm(
      "Tienes un cupón de $" + cupon + ". ¿Quieres usarlo?"
    );
    if (usarCupon) {
      if (cupon >= totalAPagar) {
        cupon -= totalAPagar;
        totalAPagar = 0;
      } else {
        totalAPagar -= cupon;
        cupon = 0;
      }
      alert(
        "El cupón se ha aplicado. Nuevo total a pagar: $" +
          totalAPagar.toFixed(2)
      );
    }
  }

  let pagoUsuario;
  while (true) {
    pagoUsuario = parseFloat(
      prompt(
        "El total a pagar por " +
          cantidad +
          " artículo(s) es: $" +
          totalAPagar.toFixed(2) +
          ".\nIngrese la cantidad que desea pagar:"
      )
    );

    if (!isNaN(pagoUsuario) && pagoUsuario >= totalAPagar) {
      break;
    } else {
      alert(
        "❌ El pago ingresado no es suficiente. Por favor, ingrese nuevamente."
      );
    }
  }

  let confirmacion = confirm(
    "¿Está seguro de que desea comprar " +
      cantidad +
      " artículo(s) por $" +
      totalAPagar.toFixed(2) +
      "?"
  );

  if (confirmacion) {
    articulosComprados += cantidad;
    saldo -= totalAPagar;
    alert("✅ Ha comprado " + cantidad + " artículo(s).");
  } else {
    alert("Compra cancelada.");
  }
}

function main() {
  console.log("Bienvenido a la tienda de artículos GNO (GYM NEW OPPORT).");
  console.log("Precio por artículo: $" + precioArticulo);

  ingresarCupon();

  console.log("Tienes un cupón disponible de: $" + cupon);

  comprarArticulos();

  console.log("Artículos comprados: " + articulosComprados);
  console.log("Saldo restante: $" + saldo);
  console.log("Cupón restante: $" + cupon);
}

main();
