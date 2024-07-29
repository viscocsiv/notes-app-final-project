"use strict";

import Swal from "sweetalert2";

const baseUrl = "https://notes-api.dicoding.dev/v2";

class AddNoteForm extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
        <form class="add-note-container" novalidate>
          <div class="form-group">
            <input type="text" id="note-title" placeholder="Title" required>
            <span id="title-error" class="error-message"></span>
          </div>
          <div class="form-group">
            <textarea id="note-body" placeholder="Content" required></textarea>
            <span id="body-error" class="error-message"></span>
          </div>
          <button type="submit" id="add-note">Add Note</button>
        </form>
      `;

    this.querySelector("form").addEventListener("submit", async (event) => {
      event.preventDefault();

      const title = this.querySelector("#note-title").value.trim();
      const body = this.querySelector("#note-body").value.trim();
      const titleError = this.querySelector("#title-error");
      const bodyError = this.querySelector("#body-error");

      titleError.textContent = "";
      bodyError.textContent = "";

      let hasError = false;

      if (!this.validateInput(title)) {
        titleError.textContent = "Title is required.";
        hasError = true;
      }

      if (!this.validateInput(body)) {
        bodyError.textContent = "Content is required.";
        hasError = true;
      }

      if (hasError) {
        Swal.fire({
          icon: "error",
          title: "Validation Error",
          text: "Please fill the form above correctly.",
          confirmButtonText: "OK",
        });
        return;
      }

      try {
        await this.createNote({ title, body });
        this.querySelector("#note-title").value = "";
        this.querySelector("#note-body").value = "";
        document.dispatchEvent(new Event("refresh-notes"));
      } catch (error) {
        console.error("Error creating note:", error);

        Swal.fire({
          icon: "error",
          title: "Error",
          text: "An error occurred while creating the note. Please try again later.",
          confirmButtonText: "OK",
        });
      }
    });
  }

  async createNote({ title, body }) {
    try {
      const response = await fetch(baseUrl + "/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, body }),
      });

      if (!response.ok) {
        throw new Error("Failed to create note");
      }

      Swal.fire({
        icon: "success",
        title: `Note Created`,
        text: `New note with title "${title}" has been created.`,
        confirmButtonText: "OK",
      });

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  validateInput(value) {
    return value.trim() !== "";
  }
}

customElements.define("add-note-form", AddNoteForm);
