// ================================================================
//  AeroLista ✈ · eliminar.js — cancelar una reserva
// ================================================================

// Abre una confirmación nativa del navegador y retorna true (Aceptar) o false (Cancelar).
function preguntar(titulo, texto) {
  return Promise.resolve(window.confirm(`${titulo}\n\n${texto}`));
}

// Pregunta y, si el usuario acepta, elimina. Retorna true si se eliminó.
async function confirmarEliminar(numero, pasajero = null) {
  const quien = pasajero ? `${pasajero.nombre} (asiento ${pasajero.asiento})` : `la reserva #${numero}`;
  const acepta = await preguntar("¿Cancelar la reserva?",
    `Se quitará a ${quien} y el asiento quedará libre.`);
  if (!acepta) return false;                  // dijo que no

  const r = await API.eliminar(numero);       // en Flask usará eliminar() de tu lista
  if (!r.ok) {
    mostrarProblema(r);
    return false;
  }
  avisar(r.mensaje, "ok");
  $("#eliminar-numero").value = "";
  // Si justo estábamos modificando a ese pasajero, salimos de la edición
  if (estado.enEdicion && estado.enEdicion.numero === r.datos.numero) cancelarEdicion();
  estado.encontrado = null;
  await refrescar();
  animarAsiento(r.datos.asiento, "liberado"); // el asiento "brilla" al quedar libre
  return true;
}

// Al enviar el formulario de la pestaña Eliminar
async function enviarEliminar(evento) {
  evento.preventDefault();
  await confirmarEliminar($("#eliminar-numero").value);
}

$("#form-eliminar").addEventListener("submit", enviarEliminar);
