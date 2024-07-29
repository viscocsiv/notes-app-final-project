class AppHeader extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
        <header class="header">
          <div class="logo-container">
            <img src="./assets/images/notes-logo.png" alt="App Logo" class="logo">
          </div>
          <h1>Notes App</h1>
        </header>
      `;
  }
}

customElements.define("app-header", AppHeader);
