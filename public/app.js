class User {
  constructor(id, name, location, followers, repositories, avatarUrl) {
    this.id = id;
    this.name = name || "N/A";
    this.location = location || "N/A";
    this.followers = followers || 0;
    this.repositories = repositories || 0;
    this.avatarUrl = avatarUrl || "";
  }
}

class UserSearch {
  constructor() {
    this.users = JSON.parse(localStorage.getItem("users")) || [];
    this.table = document.getElementById("userTable");
    this.searchBtn = document.getElementById("searchBtn");
    this.usernameInput = document.getElementById("username");
    this.alertContainer = document.getElementById("alertContainer");

    this.searchBtn.addEventListener("click", this.searchUser.bind(this));
    this.usernameInput.addEventListener("input", this.clearError.bind(this));
    this.usernameInput.addEventListener("keypress", this.handleKeyPress.bind(this));

    this.displayUsers();
  }

  searchUser() {
    const username = this.usernameInput.value;
    const url = `https://api.github.com/users/${username}`;

    fetch(url)
      .then(response => response.json())
      .then(data => {
        if (data.message && data.message === "Not Found") {
          this.showError("Usuário não encontrado.");
          return;
        }

        const id = data.id;
        const name = data.name;
        const location = data.location;
        const followers = data.followers;
        const repositories = data.public_repos;
        const avatarUrl = data.avatar_url;

        if (this.isUserExistsById(id)) {
          this.showError("Usuário já existe na lista.");
          return;
        }

        const user = new User(id, name, location, followers, repositories, avatarUrl);

        this.users.push(user);
        localStorage.setItem("users", JSON.stringify(this.users));

        this.displayUsers();

        this.usernameInput.value = "";
        this.clearError();
      })
      .catch(error => {
        console.log("Error:", error);
        this.showError("Ocorreu um erro ao processar a solicitação.");
      });
  }

  deleteRow(button) {
    const row = button.parentNode.parentNode;
    const username = row.cells[1].textContent;

    this.users = this.users.filter(user => user.name !== username);

    localStorage.setItem("users", JSON.stringify(this.users));
    row.parentNode.removeChild(row);
  }

  displayUsers() {
    let tbody = this.table.querySelector("tbody");
    if (!tbody) {
      tbody = document.createElement("tbody");
      this.table.appendChild(tbody);
    }
    tbody.innerHTML = "";

    this.users.forEach(user => {
      const newRow = tbody.insertRow();
      newRow.innerHTML = `<td><img class="avatar" src="${user.avatarUrl}" alt="Avatar"></td><td>${user.name}</td><td>${user.location}</td><td>${user.followers}</td><td>${user.repositories}</td><td><button onclick='app.deleteRow(this)'>Delete</button></td>`;
    });
  }

  handleKeyPress(event) {
    if (event.key === "Enter") {
      this.searchUser();
    }
  }

  isUserExistsById(id) {
    return this.users.some(user => user.id === id);
  }

  showError(message) {
    const alertHTML = `
      <div class="alert">
        <span class="closebtn" onclick="this.parentElement.style.display='none';">&times;</span>
        ${message}
      </div>
    `;
    this.alertContainer.innerHTML = alertHTML;
    this.alertContainer.style.display = "block";
  }

  clearError() {
    this.alertContainer.innerHTML = "";
    this.alertContainer.style.display = "none";
  }
}

const app = new UserSearch();