
/**
 * Convierte una fecha a formato local YYYY-MM-DD.
 * @param {Date} [d=new Date()] - Fecha a convertir. Por defecto, la fecha actual.
 * @returns {string} Fecha en formato YYYY-MM-DD.
 */
export function toLocalYYYYMMDD(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}


/**
 * Convierte grados a la dirección de la brújula correspondiente.
 * @param {number} deg - Grados a convertir.
 * @returns {string} Dirección de la brújula (N, NE, E, etc.) o '—' si no es válido.
 */
export function degToCompass(deg) {
  if (deg == null || isNaN(deg)) return '—'
  const dirs = ['N','NNE','NE','ENE','E','ESE','SE','SSE','S','SSO','SO','OSO','O','ONO','NO','NNO']
  return dirs[Math.round(deg / 22.5) % 16]
}
