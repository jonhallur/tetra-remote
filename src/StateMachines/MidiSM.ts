import { openDB } from 'idb';
import {writable} from 'svelte/store';
import * as R from 'ramda';

const PatchesStore = writable({});
let db;

async function openDatabase() {
    db = await openDB("TetraRemoteApp", undefined, {
        upgrade(db) {
            console.log("create obj store")
            const store = db.createObjectStore('patches');
        }
    });
    refreshPatchesStore();
}

async function refreshPatchesStore() {
    let keys = await db.getAllKeys('patches');
    let values = await Promise.all(R.map(async (key) => await db.get('patches', key), keys));
    let list = R.zipObj(keys, values);
    PatchesStore.set(list);
}

openDatabase();

async function storePatch(key, val) {
    await db.put('patches', val, key)
    refreshPatchesStore();
}

async function deletePatch(key) {
    console.log("remove", key)
    await db.delete('patches', key)
    refreshPatchesStore();
}

export {
    openDatabase,
    PatchesStore,
    storePatch,
    deletePatch
}