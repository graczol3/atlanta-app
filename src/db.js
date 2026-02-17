import { openDB } from "idb";

const DB_NAME = "atlanta-db";
const DB_VERSION = 9; // 🔥 zwiększona wersja

export const dbPromise = openDB(DB_NAME, DB_VERSION, {
  upgrade(db, oldVersion) {

    /* =========================
       PROPERTIES
    ========================= */
    if (!db.objectStoreNames.contains("properties")) {
      db.createObjectStore("properties", { keyPath: "id" });
    }

    /* =========================
       RESERVATIONS
    ========================= */
    if (!db.objectStoreNames.contains("reservations")) {
      const store = db.createObjectStore("reservations", { keyPath: "id" });
      store.createIndex("date", "date");
    }

    /* =========================
       TICKETS
    ========================= */
    if (!db.objectStoreNames.contains("tickets")) {
      const store = db.createObjectStore("tickets", { keyPath: "id" });
      store.createIndex("status", "status");
      store.createIndex("date", "date");
    }

    /* =========================
       NOTICES
    ========================= */
    if (!db.objectStoreNames.contains("notices")) {
      const store = db.createObjectStore("notices", { keyPath: "id" });
      store.createIndex("date", "date");
      store.createIndex("audience", "audience");
      store.createIndex("pinned", "pinned");
    }

    /* =========================
       DOCUMENTS
    ========================= */
    if (!db.objectStoreNames.contains("documents")) {
      const store = db.createObjectStore("documents", { keyPath: "id" });
      store.createIndex("date", "date");
    }
  }
});


/* =====================================================
   PROPERTIES
===================================================== */
export async function getAllProperties() {
  return (await dbPromise).getAll("properties");
}

export async function saveProperties(properties) {
  const db = await dbPromise;
  const tx = db.transaction("properties", "readwrite");
  const store = tx.objectStore("properties");

  await store.clear();
  for (const p of properties) {
    await store.put(p);
  }
  await tx.done;
}


/* =====================================================
   RESERVATIONS
===================================================== */
export async function getAllReservations() {
  return (await dbPromise).getAll("reservations");
}

export async function addReservation(reservation) {
  return (await dbPromise).put("reservations", reservation);
}

export async function updateReservation(reservation) {
  return (await dbPromise).put("reservations", reservation);
}

export async function deleteReservation(id) {
  return (await dbPromise).delete("reservations", id);
}


/* =====================================================
   TICKETS
===================================================== */
export async function getAllTickets() {
  return (await dbPromise).getAll("tickets");
}

export async function addTicket(ticket) {
  return (await dbPromise).put("tickets", ticket);
}

export async function updateTicket(ticket) {
  return (await dbPromise).put("tickets", ticket);
}

export async function deleteTicket(id) {
  return (await dbPromise).delete("tickets", id);
}


/* =====================================================
   NOTICES
===================================================== */
export async function getAllNotices() {
  return (await dbPromise).getAll("notices");
}

export async function addNotice(notice) {
  return (await dbPromise).put("notices", notice);
}

export async function updateNotice(notice) {
  return (await dbPromise).put("notices", notice);
}

export async function deleteNotice(id) {
  return (await dbPromise).delete("notices", id);
}


/* =====================================================
   DOCUMENTS
===================================================== */
export async function getAllDocuments() {
  return (await dbPromise).getAll("documents");
}

export async function addDocument(document) {
  return (await dbPromise).put("documents", document);
}

/* 🔥 NOWA FUNKCJA - EDYCJA DOKUMENTU */
export async function updateDocument(document) {
  return (await dbPromise).put("documents", document);
}

export async function deleteDocument(id) {
  return (await dbPromise).delete("documents", id);
}
