// Utilidad para convertir un usuario interno a una representación pública
function toPublicUsuario(usuario) {
  if (!usuario) return null;
  return {
    id: usuario.id,
    username: usuario.username,
    image: usuario.image || null
  };
}

module.exports = { toPublicUsuario };
