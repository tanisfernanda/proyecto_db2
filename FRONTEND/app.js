const API_URL = "https://proyecto-db2.onrender.com"; // Cambia esto a la URL de tu backend desplegado

// Elementos del DOM (Productos)
const listaProductos = document.getElementById("listaProductos");
const formulario = document.getElementById("formularioProducto");
const productoId = document.getElementById("productoId");
const nombreInput = document.getElementById("nombre");
const precioInput = document.getElementById("precio");
const stockInput = document.getElementById("stock");
const btnGuardar = document.getElementById("btnGuardar");
const btnCancelar = document.getElementById("btnCancelar");
const tituloFormulario = document.getElementById("tituloFormulario");

// Elementos del DOM (Contacto)
const formContacto = document.getElementById("formularioContacto");
const nombreContactoInput = document.getElementById("nombreContacto");
const correoContactoInput = document.getElementById("correoContacto");
const asuntoContactoInput = document.getElementById("asuntoContacto");
const mensajeContactoInput = document.getElementById("mensajeContacto");
const listaMensajes = document.getElementById("listaMensajes");

// 1. Función para consultar los productos y mostrarlos en el DOM (READ)
async function cargarProductos() {
  if (!listaProductos) return;

  try {
    const respuesta = await fetch(`${API_URL}/Producto`);
    const productos = await respuesta.json();

    listaProductos.innerHTML = "";

    if (productos.length === 0) {
      listaProductos.innerHTML = "<p style='color: #64748b;'>No hay productos registrados.</p>";
      return;
    }

    productos.forEach((producto) => {
      const elemento = document.createElement("div");
      elemento.classList.add("producto");

      elemento.innerHTML = `
        <div>
          <h3>${producto.nombre}</h3>
          <p class="producto-precio">Precio: $${producto.precio}</p>
          <p>Stock: ${producto.stock} unidades</p>
        </div>
        <div class="acciones">
          <button class="btn-editar" onclick="cargarEnFormulario(${producto.id}, '${producto.nombre}', ${producto.precio}, ${producto.stock})">Editar</button>
          <button class="btn-eliminar" onclick="eliminarProducto(${producto.id})">Eliminar</button>
        </div>
      `;

      listaProductos.appendChild(elemento);
    });
  } catch (error) {
    console.error("Error al cargar productos:", error);
  }
}

// 2. Cargar datos del producto en el formulario para editar (UPDATE - Paso 1)
function cargarEnFormulario(id, nombre, precio, stock) {
  if (!productoId) return;
  productoId.value = id;
  nombreInput.value = nombre;
  precioInput.value = precio;
  stockInput.value = stock;

  tituloFormulario.textContent = "Editar Producto";
  btnGuardar.textContent = "Actualizar Producto";
  btnCancelar.style.display = "block";
  nombreInput.focus();
}

// Cancelar edición y restaurar formulario
function cancelarEdicion() {
  if (!formulario) return;
  formulario.reset();
  productoId.value = "";
  tituloFormulario.textContent = "Registrar Producto";
  btnGuardar.textContent = "Guardar Producto";
  btnCancelar.style.display = "none";
}

if (btnCancelar) {
  btnCancelar.addEventListener("click", cancelarEdicion);
}

// 3. Guardar o Actualizar según si hay un ID seleccionado (CREATE o UPDATE)
if (formulario) {
  formulario.addEventListener("submit", async (event) => {
    event.preventDefault();

    const id = productoId.value;
    const nombre = nombreInput.value;
    const precio = precioInput.value;
    const stock = stockInput.value;

    try {
      if (id) {
        await fetch(`${API_URL}/Producto/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nombre, precio, stock }),
        });
      } else {
        await fetch(`${API_URL}/Producto`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nombre, precio, stock }),
        });
      }

      cancelarEdicion();
      cargarProductos();
    } catch (error) {
      console.error("Error al guardar el producto:", error);
    }
  });
}

// 4. Eliminar un producto (DELETE)
async function eliminarProducto(id) {
  const confirmar = confirm("¿Deseas eliminar este producto de la base de datos?");
  if (!confirmar) return;

  try {
    await fetch(`${API_URL}/Producto/${id}`, {
      method: "DELETE",
    });

    if (productoId && productoId.value == id) {
      cancelarEdicion();
    }

    cargarProductos();
  } catch (error) {
    console.error("Error al eliminar producto:", error);
  }
}

// ==========================================
// SECCIÓN FORMULARIO DE CONTACTO / MENSAJES
// ==========================================

// 5. Cargar el historial de mensajes desde la base de datos (READ)
async function cargarMensajes() {
  if (!listaMensajes) return;

  try {
    const respuesta = await fetch(`${API_URL}/Contactos`);
    const mensajes = await respuesta.json();

    listaMensajes.innerHTML = "";

    if (mensajes.length === 0) {
      listaMensajes.innerHTML = "<p style='color: #64748b; padding: 10px;'>No hay mensajes registrados.</p>";
      return;
    }

    mensajes.forEach((msg) => {
      const elemento = document.createElement("div");
      elemento.classList.add("producto"); // Reutilizamos el estilo de tarjeta limpio
      elemento.style.marginBottom = "12px";

      elemento.innerHTML = `
        <div>
          <h3 style="color: #1e293b;">${msg.nombre} <span style="font-size: 0.8em; color: #64748b; font-weight: normal;">(${msg.correo})</span></h3>
          <p style="font-weight: 600; color: #334155; margin: 4px 0;">Asunto: ${msg.asunto}</p>
          <p style="color: #475569; margin: 4px 0;">${msg.mensaje}</p>
        </div>
        <div class="acciones" style="margin-top: 10px;">
          <button class="btn-eliminar" onclick="eliminarMensaje(${msg.id})">Eliminar</button>
        </div>
      `;

      listaMensajes.appendChild(elemento);
    });
  } catch (error) {
    console.error("Error al cargar mensajes:", error);
  }
}

// 6. Enviar nuevo mensaje y guardarlo en la base de datos (CREATE)
if (formContacto) {
  formContacto.addEventListener("submit", async (event) => {
    event.preventDefault();

    const nombre = nombreContactoInput.value;
    const correo = correoContactoInput.value;
    const asunto = asuntoContactoInput.value;
    const mensaje = mensajeContactoInput.value;

    try {
      const respuesta = await fetch(`${API_URL}/Contactos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, correo, asunto, mensaje }),
      });

      if (!respuesta.ok) {
        throw new Error("Error en la respuesta del servidor");
      }

      alert("¡Mensaje enviado y guardado con éxito!");
      formContacto.reset();
      cargarMensajes(); // Actualiza el historial automáticamente abajo
    } catch (error) {
      console.error("Error al enviar el mensaje:", error);
      alert("Hubo un error al enviar el mensaje. Verifica que tu backend esté encendido.");
    }
  });
}

// 7. Eliminar un mensaje del historial (DELETE)
async function eliminarMensaje(id) {
  const confirmar = confirm("¿Deseas eliminar este mensaje de la base de datos?");
  if (!confirmar) return;

  try {
    await fetch(`${API_URL}/Contactos/${id}`, {
      method: "DELETE",
    });
    cargarMensajes(); // Refrescar historial
  } catch (error) {
    console.error("Error al eliminar el mensaje:", error);
  }
}

// Llamados iniciales al cargar la página
cargarProductos();
cargarMensajes();