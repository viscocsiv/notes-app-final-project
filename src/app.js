"use strict";
import Swal from "sweetalert2";
import "./styles/styles.css";
import "./scripts/index.js";

const baseUrl = "https://notes-api.dicoding.dev/v2";

const archivedNotes = document.getElementById("notes-archived");
const unarchivedNotes = document.getElementById("notes-unarchived");

async function fetchUnarchivedNotes() {
  try {
    const response = await fetch(baseUrl + `/notes`);
    const responseJson = await response.json();

    if (responseJson.status === "fail") {
      throw new Error(responseJson.message);
    } else {
      return responseJson.data || [];
    }
  } catch (error) {
    console.error("Error fetching unarchived notes:", error);

    Swal.fire({
      icon: "error",
      title: "Error",
      text: "An error occurred while fetching the notes. Please refresh the page.",
      confirmButtonText: "OK",
    });
    return [];
  }
}

async function fetchArchivedNotes() {
  try {
    const response = await fetch(baseUrl + `/notes/archived`);
    const responseJson = await response.json();
    if (responseJson.data === null || responseJson.status === "fail") {
      if (responseJson.data === null) {
        throw new Error("Invalid API");
      }
      throw new Error(responseJson.message);
    } else {
      return responseJson.data || [];
    }
  } catch (error) {
    console.error("Error fetching archived notes:", error);

    Swal.fire({
      icon: "error",
      title: "Error",
      text: "An error occurred while fetching the notes. Please refresh the page.",
      confirmButtonText: "OK",
    });
    return [];
  }
}

async function fetchAllNotes() {
  showLoading();
  try {
    const archivedNotes = await fetchArchivedNotes();
    const unarchivedNotes = await fetchUnarchivedNotes();
    const allNotes = archivedNotes.concat(unarchivedNotes);
    if (allNotes === null) {
      throw new Error("Data manipulation error");
    }
    return allNotes;
  } catch (error) {
    console.error("Error fetching notes:", error);
    return [];
  } finally {
    hideLoading();
  }
}

function renderAllNotes(notes) {
  archivedNotes.innerHTML = "";
  unarchivedNotes.innerHTML = "";

  notes.forEach((note) => {
    const noteItem = document.createElement("note-item");
    noteItem.setAttribute("id", note.id);
    noteItem.setAttribute("title", note.title);
    noteItem.setAttribute("body", note.body);
    noteItem.setAttribute("archived", note.archived);
    if (note.archived === true) {
      archivedNotes.appendChild(noteItem);
    } else {
      unarchivedNotes.appendChild(noteItem);
    }
    // notesContainer.appendChild(noteItem);
  });
}

function showLoading() {
  const loadingOverlay = document.getElementById("loading-overlay");
  if (loadingOverlay) {
    loadingOverlay.style.display = "flex";
  }
}

function hideLoading() {
  const loadingOverlay = document.getElementById("loading-overlay");
  if (loadingOverlay) {
    loadingOverlay.style.display = "none";
  }
  document.querySelector("header").style.display = "block";
  document.querySelector("main").style.display = "block";
  document.querySelector("footer").style.display = "block";
}

window.addEventListener("DOMContentLoaded", async () => {
  await fetchAndRenderNotes();
});

document.addEventListener("refresh-notes", async () => {
  await fetchAndRenderNotes();
});

async function fetchAndRenderNotes() {
  const notes = await fetchAllNotes();
  renderAllNotes(notes);
}
