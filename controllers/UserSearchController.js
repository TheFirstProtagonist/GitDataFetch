const fetch = require('node-fetch');
const User = require('../models/User');

class UserSearchController {
  constructor() {
    this.users = [];
  }

  async searchUser(username) {
    var url = "https://api.github.com/users/" + username;

    try {
      const response = await fetch(url);
      const data = await response.json();

      // Verifica se o usuário foi encontrado
      if (data.message && data.message === "Not Found") {
        throw new Error("Usuário não encontrado.");
      }

      var id = data.id; // Adiciona o id do usuário
      var name = data.name;
      var location = data.location;
      var followers = data.followers;
      var repositories = data.public_repos;
      var avatarUrl = data.avatar_url;

      // Verifica se o usuário já existe na lista
      if (this.isUserExistsById(id)) {
        throw new Error("Usuário já existe na lista.");
      }

      var user = new User(id, name, location, followers, repositories, avatarUrl);

      this.users.push(user);

      return user;
    } catch (error) {
      throw new Error("Ocorreu um erro ao processar a solicitação.");
    }
  }

  deleteById(id) {
    this.users = this.users.filter(user => user.id !== id);
  }

  isUserExistsById(id) {
    return this.users.some(user => user.id === id);
  }
}

module.exports = UserSearchController;