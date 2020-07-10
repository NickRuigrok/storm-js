class Store {
  #store;
  constructor() {
    this.#store = JSON.parse(window.sessionStorage.getItem('storm-js') || '{}');

    window.onbeforeunload = () => window.sessionStorage.setItem('storm-js', JSON.stringify(this.#store));
    window.sessionStorage.removeItem('storm-js');
  }

  add(key, value) {
    this.#store[key] = value;
  }

  remove(key) {
    delete this.#store[key];
  }

  set(value) {
    this.#store = value;
  }

  clear() {
    this.#store = {};
  }
}

export default Store;