class ListaTareas {
    constructor() {
        // Cargar tareas desde localStorage o usar una lista por defecto
        this.tareas = JSON.parse(localStorage.getItem('tareas')) || [];
        this.cargarTareas();
        this.agregarEventListeners();
    }

    agregarEventListeners() {
        // Manejar el evento de presionar Enter en el input
        document.getElementById('recordatorio').addEventListener('keypress', (evento) => {
            if (evento.key === 'Enter') {
                this.agregarTarea(evento.target.value);
                evento.target.value = '';
            }
        });

        // Manejar el evento de clic en el botón de agregar
        document.getElementById('agregarTarea').addEventListener('click', () => {
            const input = document.getElementById('recordatorio');
            this.agregarTarea(input.value);
            input.value = '';
        });
    }

    cargarTareas() {
        // Generar el HTML para las tareas y actualizar el DOM
        let htmlTareas = this.tareas.reduce((html, tarea, indice) => html + this.generarHtmlTarea(tarea, indice), '');
        document.getElementById('listaTareas').innerHTML = htmlTareas;
    }

    cambiarEstadoTarea(indice) {
        // Cambiar el estado completado de la tarea
        this.tareas[indice].completado = !this.tareas[indice].completado;
        this.cargarTareas();
        localStorage.setItem('tareas', JSON.stringify(this.tareas));
    }

    eliminarTarea(evento, indice) {
        evento.preventDefault();
        this.tareas.splice(indice, 1);
        this.cargarTareas();
        localStorage.setItem('tareas', JSON.stringify(this.tareas));
    }

    editarTarea(indice) {
        const tareaItem = document.querySelector(`#tarea-${indice}`);
        if (tareaItem.querySelector('.editar-tarea')) return; // Evitar múltiples ediciones

        const contenido = tareaItem.querySelector('.texto-tarea');
        const editarInput = document.createElement('input');
        editarInput.className = 'editar-tarea';
        editarInput.type = 'text';
        editarInput.value = contenido.textContent;

        const botonGuardar = document.createElement('button');
        botonGuardar.textContent = 'Guardar';
        botonGuardar.className = 'btn btn-success';
        botonGuardar.addEventListener('click', () => this.guardarCambios(indice, tareaItem, editarInput));

        contenido.style.display = 'none';
        tareaItem.appendChild(editarInput);
        tareaItem.appendChild(botonGuardar);

        editarInput.focus();

        editarInput.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                this.guardarCambios(indice, tareaItem, editarInput);
            }
        });
    }

    guardarCambios(indice, tareaItem, editarInput) {
        const nuevoTexto = editarInput.value.trim();
        if (nuevoTexto === '') {
            alert('Por favor, ingresa un texto válido.');
            return;
        }

        this.tareas[indice].tarea = nuevoTexto;
        localStorage.setItem('tareas', JSON.stringify(this.tareas));
        this.cargarTareas();
    }

    generarHtmlTarea(tarea, indice) {
        return `
            <li id="tarea-${indice}" class="list-group-item checkbox">
                <div class="container">
                    <div class="row">
                        <div class="col-md-1 col-xs-1 col-lg-1 col-sm-1 checkbox">
                            <label>
                                <input type="checkbox" onchange="listaTareas.cambiarEstadoTarea(${indice})" class="caja-comprobacion" ${tarea.completado ? 'checked' : ''}>
                            </label>
                        </div>
                        <div class="col-md-7 col-xs-7 col-lg-7 col-sm-7 texto-tarea ${tarea.completado ? 'tarea-completada' : ''}">
                            ${tarea.tarea}
                        </div>
                        <div class="col-md-2 col-xs-2 col-lg-2 col-sm-2 fecha-tarea">
                            ${tarea.fecha}
                        </div>
                        <div class="col-md-2 col-xs-2 col-lg-2 col-sm-2 area-icono-eliminacion">
                            <button class="btn btn-warning btn-sm" onclick="listaTareas.editarTarea(${indice})">Editar</button>
                            <a href="#" onclick="listaTareas.eliminarTarea(event, ${indice})" class="btn btn-danger btn-sm">
                                <i class="fas fa-trash-alt"></i>
                            </a>
                        </div>
                    </div>
                </div>
            </li>
        `;
    }

    agregarTarea(tarea) {
        tarea = tarea.trim();

        // Evitar tareas duplicadas
        if (this.tareas.some(t => t.tarea === tarea)) {
            alert('Esta tarea ya existe.');
            return;
        }

        if (tarea !== '') {
            const nuevaTarea = {
                tarea: tarea,
                completado: false,
                fecha: new Date().toLocaleDateString()
            };

            this.tareas.push(nuevaTarea);
            localStorage.setItem('tareas', JSON.stringify(this.tareas));
            this.cargarTareas();
        }
    }
}

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then((registration) => {
                console.log('Service Worker registrado con éxito:', registration);
            })
            .catch((error) => {
                console.log('Error al registrar el Service Worker:', error);
            });
    });
}

window.addEventListener('load', () => {
    window.listaTareas = new ListaTareas();
});

