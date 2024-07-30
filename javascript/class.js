class UserProfile {
  constructor(name) {
    this.name = name;
  }

  get name() {
    return this._name;
  }

  set name(value) {
    if (!value) {
      throw new Error("Name is required");
    }
    this._name = value;
  }
}

try {
  const profile = new UserProfile("value");
  console.log(profile.name);
} catch (e) {
  console.error(e.message); // "Name is required"
}
