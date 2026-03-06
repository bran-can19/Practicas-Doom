'use strict';
// Declaración de utilidades y referencias
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

const buildCard = ({ id, titulo, tag, fav = 0 }) => {
    const tarea = document.createElement('li');
    tarea.className = 'card';
    tarea.dataset.id = id || `t${Date.now()}`;
    tarea.dataset.tag = tag;
    tarea.dataset.fav = fav;
    tarea.innerHTML = `
        <div class="card__head">
            <span class="badge">${tag}</span>
            <div class="actions">
                <button class="icon" type="button" data-action="fav" aria-label="Marcar favorito">${fav === 1 ? '★' : '☆'}</button>
                <button class="icon" type="button" data-action="done" aria-label="Marcar completada">✓</button>
                <button class="icon danger" type="button" data-action="del" aria-label="Eliminar">🗑</button>
            </div>
        </div>
        <p class="card__title">${titulo}</p>
    `;
    return tarea;
};

const btnAgregar = $('#btnAgregar');
const listaTareas = $('#listaTareas');
const emptyState = $('#emptyState');
const statTotal = $('#statTotal');
const statVisibles = $('#statVisibles');
const statFavs = $('#statFavs');
const filtros = document.querySelector('.filters');
const inputBuscar = $('#inputBuscar');
const btnLimpiarBuscar = $('#btnLimpiarBuscar');
let activeFilter = 'all'; // filtrar categorias 
let searchTerm = '';

const actualizarStats = () => {
    const tarjetas = Array.from(listaTareas.children);
    const total = tarjetas.length;
    const visibles = tarjetas.filter((tarjeta) => !tarjeta.classList.contains('is-hidden')).length;
    const favs = tarjetas.filter((tarjeta) => tarjeta.dataset.fav === '1').length;

    statTotal.textContent = total;
    statVisibles.textContent = visibles;
    statFavs.textContent = favs;

    emptyState.classList.toggle('is-hidden', visibles !== 0);
};

// Actualizar 
actualizarStats();

btnAgregar.addEventListener('click', (e) => {
    e.preventDefault();
    const inputTitulo = $('#inputTitulo');
    const selectTag = $('#selectTag');
    const titulo = inputTitulo.value.trim();
    const tag = selectTag.value;
    if (titulo === '') {
        alert('ingresa un título para la tarea');
        return;
    }
    const nuevaTarea = buildCard({
        id: `t${Date.now()}`,
        titulo: titulo,
        tag: tag,
        fav: 0
    });
    listaTareas.append(nuevaTarea);
    inputTitulo.value = '';
// Aplicar busqueda
    applyFilter(activeFilter);
});
// Filtros de búsqueda 
const applyFilter = (filter) => {
    const tarjetas = Array.from(listaTareas.children);
    const term = searchTerm.trim().toLowerCase();

    console.log('applyFilter', { filter, term, total: tarjetas.length });

    tarjetas.forEach((tarjeta) => {
        let hide = false;

        if (filter === 'all') {
            hide = false;
        } else if (filter === 'fav') {
            hide = tarjeta.dataset.fav !== '1';
        } else {
            hide = tarjeta.dataset.tag !== filter;
        }

        if (term) {
            const title = tarjeta.querySelector('.card__title')?.textContent?.toLowerCase() || '';
            if (!title.includes(term)) {
                hide = true;
            }
        }

        tarjeta.classList.toggle('is-hidden', hide);
    });

    actualizarStats();
};
filtros.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-filter]');
    if (!btn) return;

    activeFilter = btn.dataset.filter;

    filtros.querySelectorAll('button').forEach((b) => {
        b.classList.toggle('is-active', b === btn);
    });

    applyFilter(activeFilter);
});

inputBuscar.addEventListener('input', (e) => {
    searchTerm = e.target.value || '';
    console.log('search term:', searchTerm);
    applyFilter(activeFilter);
});

// Limpiar búsqueda por texto
btnLimpiarBuscar.addEventListener('click', () => {
    searchTerm = '';
    inputBuscar.value = '';
    applyFilter(activeFilter);
});

// Eliminar tarjeta 
listaTareas.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-action]');
    if (!btn) return;

    const action = btn.dataset.action;
    const tarjeta = btn.closest('.card');
    if (!tarjeta) return;

    if (action === 'del') {
        tarjeta.remove();
        actualizarStats();
        return;
    }

    // Marca como completada/incompleta
    //✔️ incompleta, ✔️✔️ completada
    if (action === 'done') {
        const isDone = tarjeta.classList.toggle('is-done');
        btn.setAttribute('aria-label', isDone ? 'Marcar incompleta' : 'Marcar completada');
        btn.textContent = isDone ? '✔️' : '✔️✔️';
        console.log('toggle done', tarjeta.dataset.id, isDone);
        return;
    }

    // Marca como favorita/no favorita
    if (action === 'fav') {
        const isFav = tarjeta.dataset.fav === '1';
        tarjeta.dataset.fav = isFav ? '0' : '1';
        btn.setAttribute('aria-label', isFav ? 'Quitar de favoritas' : 'Marcar favorita');
        btn.textContent = isFav ? '☆' : '⭐';
        tarjeta.classList.toggle('is-fav', !isFav);
        applyFilter(activeFilter);
        console.log('toggle fav', tarjeta.dataset.id, tarjeta.dataset.fav);
    }
});

