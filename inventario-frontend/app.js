const API_URL = "https://practica2visca.onrender.com/productos";

const form = document.getElementById("formProducto");
const productoId = document.getElementById("productoId");
const tabla = document.getElementById("tabla");
const busqueda = document.getElementById("busqueda");
const cancelar = document.getElementById("cancelar");
const tituloFormulario = document.getElementById("tituloFormulario");

async function obtenerProductos() {
  try {
    const q = busqueda.value.trim();
    const res = await fetch(`${API_URL}${q ? `?q=${encodeURIComponent(q)}` : ""}`);
    const datos = await res.json();
    tabla.innerHTML = "";

    if (!datos.length) {
      tabla.innerHTML = '<tr><td colspan="4">No hay productos registrados.</td></tr>';
      return;
    }

    datos.forEach((prod) => {
      tabla.innerHTML += `
        <tr>
          <td>${prod.nombre}</td>
          <td>$${Number(prod.precio).toFixed(2)}</td>
          <td>${prod.existencia} pzas</td>
          <td>
            <div class="row-actions">
              <button type="button" onclick='editarProducto(${JSON.stringify(prod)})'>Editar</button>
              <button type="button" class="danger" onclick="eliminarProducto('${prod._id}')">Eliminar</button>
            </div>
          </td>
        </tr>`;
    });
  } catch (err) {
    console.error("Error al traer datos:", err);
  }
}

function limpiarFormulario() {
  form.reset();
  productoId.value = "";
  tituloFormulario.textContent = "Registrar producto";
}

window.editarProducto = function editarProducto(prod) {
  productoId.value = prod._id;
  document.getElementById("nombre").value = prod.nombre;
  document.getElementById("precio").value = prod.precio;
  document.getElementById("existencia").value = prod.existencia;
  tituloFormulario.textContent = "Actualizar producto";
};

window.eliminarProducto = async function eliminarProducto(id) {
  if (!confirm("Deseas eliminar este producto?")) return;
  await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  obtenerProductos();
};

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nuevoObj = {
    nombre: document.getElementById("nombre").value,
    precio: Number(document.getElementById("precio").value),
    existencia: Number(document.getElementById("existencia").value)
  };

  const id = productoId.value;
  const res = await fetch(id ? `${API_URL}/${id}` : API_URL, {
    method: id ? "PUT" : "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(nuevoObj)
  });

  if (res.ok) {
    alert(id ? "Producto actualizado" : "Guardado con exito en MongoDB Atlas");
    limpiarFormulario();
    obtenerProductos();
  }
});

cancelar.addEventListener("click", limpiarFormulario);
busqueda.addEventListener("input", obtenerProductos);
obtenerProductos();
