"use strict";

class AppFooter extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
        <footer class="footer">
          <p>&copy; 2024 Notes App. By Mohamad Tantyo Wisnuwardhana.</p>
        </footer>
      `;
  }
}

customElements.define("app-footer", AppFooter);
