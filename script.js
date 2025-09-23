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
    }
  };
  paginationContainer.appendChild(nextBtn);
}
