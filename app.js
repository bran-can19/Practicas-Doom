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
    actualizarStats();
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
    }
});