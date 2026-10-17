
const API_URL =
    "http://localhost:8080/api/medicamentos";

let idMedicamentoEditando = null;


// ==============================
// ELEMENTOS DEL HTML
// ==============================

const formulario =
    document.getElementById("formularioMedicamento");

const btnGuardar =
    document.getElementById("btnGuardar");

const btnLimpiar =
    document.getElementById("btnLimpiar");

const btnBuscar =
    document.getElementById("btnBuscar");

const btnMostrarTodos =
    document.getElementById("btnMostrarTodos");

const tabla =
    document.getElementById("tablaMedicamentos");


// ==============================
// LISTAR TODOS
// ==============================

function listarMedicamentos() {

    fetch(API_URL)

        .then(response => {

            if (!response.ok) {
                throw new Error("Error al consultar medicamentos");
            }

            return response.json();

        })

        .then(medicamentos => {

            mostrarMedicamentos(medicamentos);

        })

        .catch(error => {

            console.error("Error:", error);

        });
}


// ==============================
// MOSTRAR EN TABLA
// ==============================

function mostrarMedicamentos(medicamentos) {

    tabla.innerHTML = "";

    medicamentos.forEach(medicamento => {

        const fila =
            document.createElement("tr");

        fila.innerHTML = `

            <td>${medicamento.id}</td>

            <td>${medicamento.nombre}</td>

            <td>${medicamento.principioActivo}</td>

            <td>${medicamento.laboratorio}</td>

            <td>${medicamento.precio}</td>

            <td>${medicamento.stock}</td>

            <td>

                <button
                    onclick="editarMedicamento(${medicamento.id})">
                    Editar
                </button>

                <button
                    onclick="eliminarMedicamento(${medicamento.id})">
                    Eliminar
                </button>

            </td>
        `;

        tabla.appendChild(fila);

    });
}


// ==============================
// REGISTRAR / ACTUALIZAR
// ==============================

formulario.addEventListener(
    "submit",
    function(event) {

        event.preventDefault();


        const medicamento = {

            nombre:
                document.getElementById("nombre").value,

            principioActivo:
                document.getElementById("principioActivo").value,

            laboratorio:
                document.getElementById("laboratorio").value,

            precio:
                parseFloat(
                    document.getElementById("precio").value
                ),

            stock:
                parseInt(
                    document.getElementById("stock").value
                )
        };


        if (idMedicamentoEditando === null) {

            registrarMedicamento(medicamento);

        } else {

            actualizarMedicamento(
                idMedicamentoEditando,
                medicamento
            );

        }

    }
);


// ==============================
// REGISTRAR
// ==============================

function registrarMedicamento(medicamento) {

    fetch(API_URL, {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(medicamento)

    })

    .then(response => {

        if (!response.ok) {
            throw new Error("Error al registrar medicamento");
        }

        return response.json();

    })

    .then(() => {

        // Limpiar formulario
        formulario.reset();

        // Actualizar automáticamente la tabla
        listarMedicamentos();

    })

    .catch(error => {

        console.error("Error:", error);

    });
}


// ==============================
// BUSCAR POR ID
// ==============================

function buscarPorId() {

    const id =
        document.getElementById("idBuscar").value;


    if (!id) {

        alert("Ingrese un ID");

        return;
    }


    fetch(`${API_URL}/${id}`)

        .then(response => {

            if (response.status === 404) {

                throw new Error(
                    "No existe un medicamento con ese ID"
                );

            }

            if (!response.ok) {

                throw new Error(
                    "Error al buscar medicamento"
                );

            }

            return response.json();

        })

        .then(medicamento => {

            // Mostrar solamente el medicamento encontrado
            mostrarMedicamentos([medicamento]);

        })

        .catch(error => {

            alert(error.message);

            console.error("Error:", error);

        });
}


// ==============================
// EVENTO BOTÓN BUSCAR
// ==============================

btnBuscar.addEventListener(
    "click",
    function() {

        buscarPorId();

    }
);


// ==============================
// MOSTRAR TODOS
// ==============================

btnMostrarTodos.addEventListener(
    "click",
    function() {

        document.getElementById("idBuscar").value = "";

        listarMedicamentos();

    }
);


// ==============================
// EDITAR
// ==============================

function editarMedicamento(id) {

    fetch(`${API_URL}/${id}`)

        .then(response => {

            if (!response.ok) {

                throw new Error(
                    "No se pudo consultar el medicamento"
                );

            }

            return response.json();

        })

        .then(medicamento => {

            document.getElementById("nombre").value =
                medicamento.nombre;

            document.getElementById("principioActivo").value =
                medicamento.principioActivo;

            document.getElementById("laboratorio").value =
                medicamento.laboratorio;

            document.getElementById("precio").value =
                medicamento.precio;

            document.getElementById("stock").value =
                medicamento.stock;


            idMedicamentoEditando =
                medicamento.id;


            btnGuardar.textContent =
                "Actualizar";

        })

        .catch(error => {

            console.error("Error:", error);

        });
}


// ==============================
// ACTUALIZAR
// ==============================

function actualizarMedicamento(
    id,
    medicamento
) {

    fetch(`${API_URL}/${id}`, {

        method: "PUT",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(medicamento)

    })

    .then(response => {

        if (!response.ok) {

            throw new Error(
                "Error al actualizar medicamento"
            );

        }

        return response.json();

    })

    .then(() => {

        formulario.reset();

        idMedicamentoEditando = null;

        btnGuardar.textContent =
            "Guardar";

        // Actualizar tabla automáticamente
        listarMedicamentos();

    })

    .catch(error => {

        console.error("Error:", error);

    });
}


// ==============================
// ELIMINAR
// ==============================

function eliminarMedicamento(id) {

    const confirmar =
        confirm(
            "¿Desea eliminar este medicamento?"
        );


    if (!confirmar) {
        return;
    }


    fetch(`${API_URL}/${id}`, {

        method: "DELETE"

    })

    .then(response => {

        if (!response.ok) {

            throw new Error(
                "Error al eliminar medicamento"
            );

        }

    })

    .then(() => {

        // Actualizar tabla automáticamente
        listarMedicamentos();

    })

    .catch(error => {

        console.error("Error:", error);

    });
}


// ==============================
// LIMPIAR
// ==============================

btnLimpiar.addEventListener(
    "click",
    function() {

        formulario.reset();

        idMedicamentoEditando = null;

        btnGuardar.textContent =
            "Guardar";

    }
);


// ==============================
// INICIO
// ==============================

listarMedicamentos();

