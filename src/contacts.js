import localforage from "localforage";
import { matchSorter } from "match-sorter";
import sortBy from "sort-by";

export async function getContacts(query) {
  // console.log("contacts.js /getContacts(query), query: ", query);
  await fakeNetwork(`getContacts:${query}`);
  let contacts = await localforage.getItem("contacts");
  if (!contacts) contacts = [];
  if (query) {
    contacts = matchSorter(contacts, query, { keys: ["first", "last"] });
  }
  return contacts.sort(sortBy("last", "createdAt"));
}

export async function createContact() {
  // console.log("contacts.js /create Contact...");
  await fakeNetwork();
  let id = Math.random().toString(36).substring(2, 9);
  let contact = { id, createdAt: Date.now() };
  let contacts = await getContacts();
  contacts.unshift(contact);
  await set(contacts);
  return contact;
}

export async function getContact(id) {
  // console.log("contacts.js / getContact....id: ", id);
  await fakeNetwork(`contact:${id}`);
  let contacts = await localforage.getItem("contacts");
  console.log("contacts: ", contacts);
  let contact = contacts.find((contact) => contact.id === id);
  console.log("contact: ", contact);
  return contact ?? null;
}

export async function updateContact(id, updates) {
  // console.log("contacts.js / update Contact....");
  await fakeNetwork();
  let contacts = await localforage.getItem("contacts");
  let contact = contacts.find((contact) => contact.id === id);
  if (!contact) throw new Error("No contact found for", id);
  Object.assign(contact, updates);
  await set(contacts);
  return contact;
}

export async function deleteContact(id) {
  // console.log("contacts.js / delete contact...");
  let contacts = await localforage.getItem("contacts");
  let index = contacts.findIndex((contact) => contact.id === id);
  if (index > -1) {
    contacts.splice(index, 1);
    await set(contacts);
    return true;
  }
  return false;
}

function set(contacts) {
  // console.log("contacts.js / set(contacts), contacts: ", contacts);
  return localforage.setItem("contacts", contacts);
}

// fake a cache so we don't slow down stuff we've already seen
let fakeCache = {};

async function fakeNetwork(key) {
  // console.log("in fakeNetwork, key, fakeCache[key]: ", key, fakeCache[key]);
  if (!key) {
    fakeCache = {};
  }

  if (fakeCache[key]) {
    // console.log("in fakeCache[key]==true if cond.");
    return;
  }

  fakeCache[key] = true;
  return new Promise((res) => {
    setTimeout(res, Math.random() * 800);
  });
}
