// Cargar actividades desde data.json
fetch("data.json")
  .then(response => response.json())
  .then(data => {
    const activitiesContainer = document.getElementById("activities");

    data.forEach(activity => {
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
  })
  .catch(error => console.error("Error cargando actividades:", error));
