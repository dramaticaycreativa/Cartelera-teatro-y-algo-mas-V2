let activities = [];
let currentPage = 1;
const itemsPerPage = 5;
let obras = [];

// Cargar actividades desde data.json
fetch("data.json")
  .then(response => response.json())
  .then(data => {
    activities = data;
    renderPage(currentPage);
    renderPagination();
    applyPaginationStyles(); // Aplicar estilos al contenedor de paginación
  })
  .catch(error => console.error("Error cargando actividades:", error));

function renderPage(page) {
  const activitiesContainer = document.getElementById("activities");
  activitiesContainer.innerHTML = "";

  const start = (page - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const paginatedItems = activities.slice(start, end);

  paginatedItems.forEach(activity => {
    const section = document.createElement("section");
    section.classList.add("activity");

    section.innerHTML = `
      <h3>📅 ${activity.titulo}</h3>
      <p>⏰ ${activity.fecha}</p>
      <p>📍 ${activity.lugar}</p>
      <details>
        <summary>Ver más detalles</summary>
        <p>${activity.descripcion}</p>
        <p>Entrada: ${activity.precio}</p>
        <p><a href="${activity.mapa}" target="_blank">Ver ubicación en Google Maps</a></p>
      </details>
    `;

    activitiesContainer.appendChild(section);
  });
}

function renderPagination() {
  const paginationContainer = document.getElementById("pagination");
  paginationContainer.innerHTML = "";

  const totalPages = Math.ceil(activities.length / itemsPerPage);

  // Botón Anterior
  const prevBtn = document.createElement("button");
  prevBtn.textContent = "⬅️ Anterior";
  prevBtn.disabled = currentPage === 1;
  prevBtn.onclick = () => {
    if (currentPage > 1) {
      currentPage--;
      renderPage(currentPage);
      renderPagination();
      window.scrollTo(0, 0);
      applyPaginationStyles();
    }
  };
  paginationContainer.appendChild(prevBtn);

  // Indicador de página
  const pageInfo = document.createElement("span");
  pageInfo.textContent = `Página ${currentPage} de ${totalPages}`;
  pageInfo.style.margin = "0 1rem";
  paginationContainer.appendChild(pageInfo);

  // Botón Siguiente
  const nextBtn = document.createElement("button");
  nextBtn.textContent = "Siguiente ➡️";
  nextBtn.disabled = currentPage === totalPages;
  nextBtn.onclick = () => {
    if (currentPage < totalPages) {
      currentPage++;
      renderPage(currentPage);
      renderPagination();
      window.scrollTo(0, 0);
      applyPaginationStyles();
    }
  };
  paginationContainer.appendChild(nextBtn);

  applyPaginationStyles();
}

// Función para aplicar estilos al contenedor y botones
function applyPaginationStyles() {
  const paginationContainer = document.getElementById("pagination");
  paginationContainer.style.display = "flex";
  paginationContainer.style.justifyContent = "center";
  paginationContainer.style.alignItems = "center";
  paginationContainer.style.margin = "2rem 0";

  const buttons = paginationContainer.querySelectorAll("button");
  buttons.forEach(btn => {
    btn.style.backgroundColor = "#d9b843";
    btn.style.color = "#2b3e79";
    btn.style.border = "none";
    btn.style.padding = "0.5rem 1rem";
    btn.style.margin = "0 0.5rem";
    btn.style.borderRadius = "5px";
    btn.style.cursor = "pointer";
    btn.style.fontWeight = "bold";
    if (btn.disabled) {
      btn.style.backgroundColor = "#999";
      btn.style.cursor = "not-allowed";
      btn.style.color = "#fff";
    }
  });
}
// ----------- NUEVO: Control de navegación entre pestañas -----------

// Función para mostrar una sección y ocultar las demás
function mostrarSeccion(id) {
  document.querySelectorAll("main > section").forEach(sec => {
    sec.style.display = "none";
  });

  const seccion = document.getElementById(id);
  if (seccion) {
    seccion.style.display = "block";
  }
  // Quitar clase activo de todos los botones
  document.querySelectorAll("nav a").forEach(link => {
    link.classList.remove("activo");
  });

  // Agregar clase activo al botón correspondiente
  const linkActivo = document.querySelector(`nav a[data-seccion="${id}"]`);
  if (linkActivo) {
    linkActivo.classList.add("activo");
  }
}

// Al cargar la página
document.addEventListener("DOMContentLoaded", () => {
  // Mostrar cartelera como inicio
  mostrarSeccion("cartelera");

  // Escuchar clics en el menú de navegación
  document.querySelectorAll("nav a").forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      const target = e.target.getAttribute("data-seccion");
      mostrarSeccion(target);
    });
  });
   // Cargar obras y comentarios
  cargarObrasYResenas();
});

// ----------- NUEVO: Espacio inicial de reseñas -----------

// ----------- Reseñas dinámicas -----------
const GOOGLE_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLScWZaJN0yjx3qKTDj2qF-CXviy6NwnU41gX9YrFbhAt3NNEFg/viewform?usp=header"; // Formulario único para todas las obras
//const sheetURL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTJOKU6xHIN5oTjo5tRdpgAmIzO7aGM7_iZ1A1LxsMpNrSGkZFjgJ7xOTatsbpLRBJZcvjNK5XSS7JD/pub?output=csv";

// -------------------- CSV Parsing --------------------
function parseCSV(csvText) {
  const lines = csvText.trim().split("\n");
  const headers = lines[0].split(",");

  const data = lines.slice(1).map(line => {
    const values = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/); // manejo de comillas
    const obj = {};
    headers.forEach((header, i) => {
      obj[header.trim().replace(/"/g, "")] = values[i].trim().replace(/"/g, "");
    });
    return obj;
  });

  return data;
}

// -------------------- Filtrar comentarios por obra --------------------
  function filtrarComentarios(obras, comentariosCSV) {
    obras.forEach(obra => {
       // Filtrar comentarios para esta obra
       obra.reseñas = comentariosCSV.filter(c => c.Obra === obra.titulo);
      });
  }
// -------------------- Renderizar reseñas --------------------
function renderReseñas(obras) {
  const reseñasContainer = document.getElementById("reseñas-lista");
  reseñasContainer.innerHTML = "";

  obras.forEach(obra => {
    const obraCard = document.createElement("div");
    obraCard.classList.add("review-card");

  // Calcular promedio de estrellas
    let promedio = 0;
    if (obra.reseñas && obra.reseñas.length > 0) {
      const suma = obra.reseñas.reduce((acc, r) => acc + Number(r.Puntuación), 0);
      promedio = (suma / obra.reseñas.length).toFixed(1); // 1 decimal
    }

    // Crear representación visual de estrellas
    let estrellasVisual = "";
    for (let i = 1; i <= 5; i++) {
      estrellasVisual += i <= Math.round(promedio) ? "⭐" : "☆";
    }

    obraCard.innerHTML = `
      <h3>🎭 ${obra.titulo}</h3>
      <p><strong>Promedio:</strong> ${promedio} / 5 ${estrellasVisual}</p>
      <p><strong>Sinopsis:</strong> ${obra.sinopsis}</p>
      <p><strong>Elenco:</strong> ${obra.elenco}</p>
      <details>
        <summary>Ver reseñas</summary>
        <div>
          ${obra.reseñas && obra.reseñas.length > 0 ? obra.reseñas.map(r => `
            <div class="comment-box">
              <p><strong>${r.Nombre}</strong> (${r.Fecha})</p>
              <p>⭐ ${r.Puntuación}/5</p>
              <p><em>Aspectos destacados:</em> ${r.Aspectos}</p>
              <p>${r.Experiencia}</p>
              ${r.ComentarioAdicional ? `<p><em>Comentario adicional:</em> ${r.ComentarioAdicional}</p>` : ""}
            </div>
          `).join("") : "<p>No hay reseñas aún.</p>"}
          <p><a href="https://docs.google.com/forms/d/e/1FAIpQLScWZaJN0yjx3qKTDj2qF-CXviy6NwnU41gX9YrFbhAt3NNEFg/viewform?usp=header" target="_blank">Deja tu reseña aquí</a></p>
        </div>
      </details>
    `;

    reseñasContainer.appendChild(obraCard);
  });
}
// -------------------- Cargar obras y CSV --------------------
const sheetURL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTJOKU6xHIN5oTjo5tRdpgAmIzO7aGM7_iZ1A1LxsMpNrSGkZFjgJ7xOTatsbpLRBJZcvjNK5XSS7JD/pub?gid=1569145678&single=true&output=csv";

function cargarObrasYResenas() {
  fetch("obras.json")
    .then(res => res.json())
    .then(data => {
      obras = data; 
      fetch(sheetURL)
        .then(res => res.text())
        .then(csvText => {
          const comentariosCSV = parseCSV(csvText);
          filtrarComentarios(obras, comentariosCSV);
          renderReseñas(obras);
        })
        .catch(err => console.error("Error cargando CSV de Google Sheets:", err));
    })
    .catch(err => console.error("Error cargando obras.json:", err));
}

//Activar cuando se abre la pestaña Reseñas
function mostrarSeccion(id) {
  document.querySelectorAll("main > section").forEach(sec => {
    sec.style.display = "none";
  });
  const seccion = document.getElementById(id);
  if (seccion) {
    seccion.style.display = "block";
  }
  // Si es reseñas, renderizarlas pasando las obras cargadas
  if (id === "reseñas") {
    if (typeof obras !== "undefined" && obras.length > 0) {
      renderReseñas(obras); // obras es el array que cargaste desde obras.json
    } else {
      console.log("Obras todavía no cargadas");
    }
  } 
}
