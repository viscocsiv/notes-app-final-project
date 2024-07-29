"use strict";

import Swal from "sweetalert2";
const baseUrl = "https://notes-api.dicoding.dev/v2";

class NoteItem extends HTMLElement {
  connectedCallback() {
    const id = this.getAttribute("id");
    const noteTitle = this.getAttribute("title");
    const noteBody = this.getAttribute("body");
    const archived = this.getAttribute("archived") === "true";

    this.innerHTML = `
        <div class="note">
          <h2>${noteTitle}</h2>
          <p>${noteBody.replace(/\n/g, "<br>")}</p>
          <button class="delete-note" data-id="${id}">Delete</button>
          <button class="archive-note" data-id="${id}">${archived ? "Unarchive" : "Archive"}</button>
        </div>
      `;

    this.querySelector(".delete-note").addEventListener("click", (event) => {
      const noteId = event.target.getAttribute("data-id");
      this.showDeleteModal(noteId, noteTitle);
    });

    this.querySelector(".archive-note").addEventListener("click", (event) => {
      const noteId = event.target.getAttribute("data-id");
      const currentlyArchived = this.getAttribute("archived") === "true";
      this.toggleArchive(noteId, currentlyArchived, noteTitle);
    });
  }

  showDeleteModal(noteId, noteTitle) {
    const modal = document.getElementById("delete-modal");
    const confirmButton = document.getElementById("confirm-delete");
    const cancelButton = document.getElementById("cancel-delete");

    modal.style.display = "flex";

    confirmButton.onclick = () => {
      this.deleteNote(noteId, noteTitle);
      modal.style.display = "none";
    };

    cancelButton.onclick = () => {
      modal.style.display = "none";
    };

    window.onclick = (event) => {
      if (event.target === modal) {
        modal.style.display = "none";
      }
    };
  }

  async deleteNote(noteId, noteTitle) {
    try {
      const responseFetchSingleNote = await fetch(baseUrl + `/notes/${noteId}`);
      const responseFetchSingleNoteJson = responseFetchSingleNote.json();

      if (responseFetchSingleNoteJson.data === null) {
        throw new Error("Note not found");
      }

      const responseDelete = await fetch(baseUrl + `/notes/${noteId}`, {
        method: "DELETE",
      });
      const responseDeleteJson = responseDelete.json();

      if (responseDeleteJson.status === "fail") {
        throw new Error("Fetching error, failed to delete");
      }

      Swal.fire({
        icon: "success",
        title: "Note Deleted",
        text: `"${noteTitle}" has been deleted successfully.`,
        confirmButtonText: "OK",
      });

      document.dispatchEvent(new Event("refresh-notes"));
    } catch (error) {
      console.error("Error deleting note:", error);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: "An error occurred while deleting the notes. Please try again later.",
        confirmButtonText: "OK",
      });
    }
  }

  async toggleArchive(noteId, currentlyArchived, noteTitle) {
    try {
      const endpoint = currentlyArchived
        ? baseUrl + `/notes/${noteId}/unarchive`
        : baseUrl + `/notes/${noteId}/archive`;

      const response = await fetch(endpoint, {
        method: "POST",
      });

      const responseJson = await response.json();

      if (responseJson.status === "fail") {
        throw new Error(
          `Failed to ${currentlyArchived ? "unarchived" : "archived"} note`,
        );
      }

      Swal.fire({
        icon: "success",
        title: currentlyArchived ? "Note Unarchived" : "Note Archived",
        text: `"${noteTitle}" has been ${currentlyArchived ? "unarchived" : "archived"} successfully.`,
        confirmButtonText: "OK",
      });

      document.dispatchEvent(new Event("refresh-notes"));
    } catch (error) {
      console.error("Error updating note:", error);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: "An error occurred while updating the notes. Please try again later.",
        confirmButtonText: "OK",
      });
    }
  }
}

customElements.define("note-item", NoteItem);
