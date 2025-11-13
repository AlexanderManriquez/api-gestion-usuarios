class Usuario {
  constructor(id, username, passwordHash, image = null) {
    this.id = id;
    this.username = username;
    this.passwordHash = passwordHash;
    this.image = image;
  }
}

module.exports = Usuario;