let activities = [];
let currentPage = 1;
const itemsPerPage = 5;

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
});

// ----------- NUEVO: Espacio inicial de reseñas -----------

// ----------- Reseñas dinámicas -----------

function renderReseñas() {
  const reseñasContainer = document.getElementById("reseñas-lista");
  reseñasContainer.innerHTML = ""; // limpiar

  // Cargar obras desde obras.json
  fetch("obras.json")
    .then(response => response.json())
    .then(obras => {
      obras.forEach(obra => {
        const section = document.createElement("section");
        section.classList.add("review-card");

        section.innerHTML = `
          <h3>🎭 ${obra.titulo}</h3>
          <p><strong>Sinopsis:</strong> ${obra.sinopsis}</p>
          <p><strong>Elenco:</strong> ${obra.elenco}</p>

          <!-- Formulario de Google embebido -->
          <div class="formulario-container">
            <iframe src="${obra.formulario}?embedded=true" 
              width="100%" height="600" frameborder="0" marginheight="0" marginwidth="0">
              Cargando formulario…
            </iframe>
          </div>

          <!-- Aquí se mostrarán las reseñas desde la hoja de cálculo -->
          <div id="reseñas-obra-${obra.id}" class="comentarios-container">
            <p>📑 Las reseñas aparecerán aquí automáticamente.</p>
          </div>
        `;

        reseñasContainer.appendChild(section);

        // Llamada futura: cargar reseñas desde la hoja
        // loadReseñasFromSheet(obra.id);
      });
    })
    .catch(error => {
      reseñasContainer.innerHTML = "<p>Error cargando reseñas.</p>";
      console.error("Error cargando obras:", error);
    });
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

  // Si es reseñas, renderizarlas
  if (id === "reseñas") {
    renderReseñas();
  }
}

