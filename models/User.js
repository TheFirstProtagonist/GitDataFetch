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

module.exports = User;