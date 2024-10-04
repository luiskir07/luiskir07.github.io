class ListaTareas {
    constructor() {
        this.listas = JSON.parse(localStorage.getItem('listas')) || [];
        this.agregarEventListeners();
    }

    agregarEventListeners() {
        document.getElementById('crear-lista-button').addEventListener('click', () => {
            const nombreLista = document.getElementById('nombre-lista-input').value.trim();
            if (nombreLista) {
                this.agregarLista(nombreLista);
                document.getElementById('nombre-lista-input').value = '';
            }
        });

        document.getElementById('nombre-lista-input').addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                const nombreLista = event.target.value.trim();
                if (nombreLista) {
                    this.agregarLista(nombreLista);
                    event.target.value = '';
                }
            }
        });

        document.getElementById('ver-tareas').addEventListener('click', () => {
            this.mostrarListas();
        });

        document.getElementById('home-button').addEventListener('click', () => {
            this.volver();
        });
    }

    agregarLista(nombre) {
        const existeLista = this.listas.some(lista => lista.nombre.toLowerCase() === nombre.toLowerCase());
        if (existeLista) {
            alert("La lista ya existe. No se puede duplicar.");
            return;
        }
        
        this.listas.push({ nombre, tareas: [] });
        localStorage.setItem('listas', JSON.stringify(this.listas));
        this.cargarListas();
    }

    cargarListas() {
        const htmlListas = this.listas.map((lista, index) => 
            `<div class="list-group-item">
                ${lista.nombre}
                <button class="btn btn-secondary btn-sm float-end" onclick="listaTareas.verTareas(${index})">Ver Tareas</button>
                <button class="btn btn-danger btn-sm float-end me-2" onclick="listaTareas.eliminarLista(${index})">Eliminar</button>
            </div>`).join('');
        document.getElementById('listas').innerHTML = htmlListas;
    }

    mostrarListas() {
        document.getElementById('crear-lista-container').style.display = 'none';
        document.getElementById('listas-container').style.display = 'block';
        this.cargarListas();
    }

    volver() {
        document.getElementById('crear-lista-container').style.display = 'block';
        document.getElementById('listas-container').style.display = 'none';
    }

    eliminarLista(index) {
        this.listas.splice(index, 1);
        localStorage.setItem('listas', JSON.stringify(this.listas));
        this.cargarListas();
    }

    verTareas(index) {
        const lista = this.listas[index];
        const tareasHTML = lista.tareas.map((tarea, tareaIndex) => 
            `<div>
                <span id="tarea-nombre-${index}-${tareaIndex}">${tarea.nombre}</span>
                <input type="text" id="edit-tarea-input-${index}-${tareaIndex}" class="form-control d-none" placeholder="Editar tarea" value="${tarea.nombre}">
                <button class="btn btn-warning btn-sm" onclick="listaTareas.mostrarInput(${index}, ${tareaIndex})">Editar</button>
                <button class="btn btn-danger btn-sm" onclick="listaTareas.eliminarTarea(${index}, ${tareaIndex})">Eliminar</button>
                <button class="btn btn-success btn-sm d-none" onclick="listaTareas.guardarEdicion(${index}, ${tareaIndex})">Guardar</button>
            </div>`).join('');
        
        document.getElementById('listas').innerHTML = `
            <div class="d-flex justify-content-between align-items-center">
                <h4>Tareas de "${lista.nombre}"</h4>
                <button class="btn btn-danger" id="toggleAgregar" onclick="listaTareas.cerrarAgregar()">X</button>
            </div>
            <div>${tareasHTML}</div>
            <input type="text" id="nueva-tarea-input" class="form-control mt-2" placeholder="Nueva tarea">
            <button class="btn btn-primary mt-2" onclick="listaTareas.agregarTarea(${index})">Añadir Tarea</button>
            <button class="btn btn-secondary mt-2" onclick="listaTareas.volver()">Volver a Listas</button>
        `;
    }

    cerrarAgregar() {
        const toggleButton = document.getElementById('toggleAgregar');
        const nuevaTareaInput = document.getElementById('nueva-tarea-input');
        const addButton = document.querySelector('.btn-primary.mt-2');

        if (nuevaTareaInput.style.display === 'none') {
            nuevaTareaInput.style.display = 'block';
            addButton.style.display = 'block';
            toggleButton.innerHTML = 'X';
            toggleButton.classList.remove('btn-success');
            toggleButton.classList.add('btn-danger');
        } else {
            nuevaTareaInput.style.display = 'none';
            addButton.style.display = 'none';
            toggleButton.innerHTML = '✓'; // Cambiar a palomita
            toggleButton.classList.remove('btn-danger');
            toggleButton.classList.add('btn-success');
        }
    }

    mostrarInput(index, tareaIndex) {
        document.getElementById(`tarea-nombre-${index}-${tareaIndex}`).classList.add('d-none');
        document.getElementById(`edit-tarea-input-${index}-${tareaIndex}`).classList.remove('d-none');
        document.querySelector(`#edit-tarea-input-${index}-${tareaIndex}`).focus();
        document.querySelector(`.btn-warning[onclick="listaTareas.mostrarInput(${index}, ${tareaIndex})"]`).classList.add('d-none');
        document.querySelector(`.btn-success[onclick="listaTareas.guardarEdicion(${index}, ${tareaIndex})"]`).classList.remove('d-none');
    }

    agregarTarea(index) {
        const nuevaTareaInput = document.getElementById('nueva-tarea-input');
        const nuevaTarea = nuevaTareaInput.value.trim();
        const existeTarea = this.listas[index].tareas.some(tarea => tarea.nombre.toLowerCase() === nuevaTarea.toLowerCase());

        if (existeTarea) {
            alert("La tarea ya existe. No se puede duplicar.");
            return;
        }

        if (nuevaTarea) {
            this.listas[index].tareas.push({ nombre: nuevaTarea });
            localStorage.setItem('listas', JSON.stringify(this.listas));
            this.verTareas(index);
            nuevaTareaInput.value = '';
        }
    }

    eliminarTarea(index, tareaIndex) {
        this.listas[index].tareas.splice(tareaIndex, 1);
        localStorage.setItem('listas', JSON.stringify(this.listas));
        this.verTareas(index);
    }

    guardarEdicion(index, tareaIndex) {
        const nuevaTareaNombre = document.getElementById(`edit-tarea-input-${index}-${tareaIndex}`).value.trim();
        const existeTarea = this.listas[index].tareas.some((tarea, i) => tarea.nombre.toLowerCase() === nuevaTareaNombre.toLowerCase() && i !== tareaIndex);

        if (existeTarea) {
            alert("La tarea ya existe. No se puede duplicar.");
            return;
        }

        if (nuevaTareaNombre) {
            this.listas[index].tareas[tareaIndex].nombre = nuevaTareaNombre;
            localStorage.setItem('listas', JSON.stringify(this.listas));
            this.verTareas(index);
        }
    }
}

let listaTareas;

window.addEventListener('load', () => {
    listaTareas = new ListaTareas();
});
