// Roster community: where people share the rosters they make.
// Backend: Supabase with accounts when supabase-config.js is filled in (tables in supabase/schema.sql), otherwise the Firebase
// Realtime Database that multiplayer uses. Either one is loaded only when a roster is actually listed, downloaded, uploaded or reported.
// The Firebase layout, used while accounts are off:
//
//   rosterIndex/<key>  {name, author, description, count, preview, created, reports}   the list shown on the page
//   rosterData/<key>   the whole roster file (format "2uhub-roster")
//
// Rules to paste into the Firebase console are in database.rules.json. They keep uploads write-once and size limited.
//
// window.Community.adapter can be replaced (tests do this) so nothing touches the live database.

const FIREBASE_CONFIG = {
    apiKey: "AIzaSyBRVYIMTjkrUbm4h92lgc3ATMr44W3Od28",
    authDomain: "khub-multiplayer.firebaseapp.com",
    databaseURL: "https://khub-multiplayer-default-rtdb.firebaseio.com",
    projectId: "khub-multiplayer",
    storageBucket: "khub-multiplayer.firebasestorage.app",
    messagingSenderId: "902192680645",
    appId: "1:902192680645:web:37f5870810fdaa4e6caaac"
};
const SDK = "https://www.gstatic.com/firebasejs/10.8.1/";
const LIST_LIMIT = 300;
const HIDE_AT_REPORTS = 5;

let sdkPromise = null;
function sdk() {
    if (!sdkPromise) {
        sdkPromise = Promise.all([import(SDK + "firebase-app.js"), import(SDK + "firebase-database.js")]).then(([appMod, db]) => {
            const app = appMod.initializeApp(FIREBASE_CONFIG, "community");
            return Object.assign({ db: db.getDatabase(app) }, db);
        });
    }
    return sdkPromise;
}

const real = {
    // newest first, without anything that was reported too often
    async list() {
        const f = await sdk();
        const snap = await f.get(f.query(f.ref(f.db, "rosterIndex"), f.orderByChild("created"), f.limitToLast(LIST_LIMIT)));
        const out = [];
        snap.forEach(child => { out.push(Object.assign({ key: child.key }, child.val())); });
        return out.filter(r => (r.reports || 0) < HIDE_AT_REPORTS).sort((a, b) => (b.created || 0) - (a.created || 0));
    },
    async get(key) {
        const f = await sdk();
        const snap = await f.get(f.ref(f.db, "rosterData/" + key));
        if (!snap.exists()) throw new Error("That roster is not in the community any more.");
        return snap.val();
    },
    // writes the list entry and the roster together, as one new key
    async upload(meta, data) {
        const f = await sdk();
        const key = f.push(f.ref(f.db, "rosterIndex")).key;
        const m = Object.assign({}, meta, { created: f.serverTimestamp(), reports: 0 });
        await f.update(f.ref(f.db), { ["rosterIndex/" + key]: m, ["rosterData/" + key]: data });
        return key;
    },
    async report(key) {
        const f = await sdk();
        await f.runTransaction(f.ref(f.db, "rosterIndex/" + key + "/reports"), n => (n || 0) + 1);
    }
};

// Supabase: rosters belong to a signed-in user (see supabase/schema.sql). Used when supabase-config.js is filled in.
const supa = {
    async list() {
        const c = await window.Auth.client();
        const { data, error } = await c.from("rosters")
            .select("id,owner,name,description,star_count,preview,created_at,shared_at,reports,profiles(display_name)")
            .eq("is_public", true).order("shared_at", { ascending: false }).limit(LIST_LIMIT);
        if (error) throw new Error(error.message);
        return (data || []).filter(r => (r.reports || 0) < HIDE_AT_REPORTS).map(r => ({
            key: r.id, owner: r.owner, name: r.name, description: r.description, count: r.star_count, preview: r.preview || [],
            author: (r.profiles && r.profiles.display_name) || "Unknown", created: Date.parse(r.shared_at || r.created_at) || 0, reports: r.reports || 0
        }));
    },
    async get(key) {
        const c = await window.Auth.client();
        const { data, error } = await c.from("rosters").select("name,description,superstars,profiles(display_name)").eq("id", key).maybeSingle();
        if (error) throw new Error(error.message);
        if (!data) throw new Error("That roster is not in the community any more.");
        return { format: "2uhub-roster", version: 1, name: data.name, author: (data.profiles && data.profiles.display_name) || "", description: data.description, superstars: data.superstars };
    },
    async upload(meta, data) {
        await window.Auth.requireUser();
        const c = await window.Auth.client();
        const { data: row, error } = await c.from("rosters")
            .insert({ name: data.name, description: data.description || "", brands: [], superstars: data.superstars, preview: meta.preview || [] })
            .select("id").single();
        if (error) throw new Error(error.message);
        return row.id;
    },
    async report(key) {
        await window.Auth.requireUser();
        const c = await window.Auth.client();
        const { error } = await c.from("roster_reports").insert({ roster_id: key });
        if (error) throw new Error(error.code === "23505" ? "You already reported this roster." : error.message);
    },
    // ---- rosters kept in the signed-in person's account (private until they share them)
    async mine() {
        const c = await window.Auth.client();
        const { data, error } = await c.from("rosters").select("id,name,description,superstars,is_public,updated_at").eq("owner", window.Auth.user.id);
        if (error) throw new Error(error.message);
        return data || [];
    },
    async saveMine(entry) {
        const clean = window.HC.cleanRoster(entry);
        if (!clean.ok) throw new Error(clean.error);
        const r = clean.roster, c = await window.Auth.client();
        const preview = r.superstars.filter(s => /^images\//.test(s.img)).sort((a, b) => (b.tier === "high") - (a.tier === "high")).slice(0, 5).map(s => s.img);
        const payload = { name: r.name, description: r.description, superstars: r.superstars, preview, updated_at: new Date().toISOString() };
        if (entry.cloudId) {
            const { data, error } = await c.from("rosters").update(payload).eq("id", entry.cloudId).select("id");
            if (error) throw new Error(error.message);
            if (data && data.length) return entry.cloudId;
        }
        const { data: row, error: e2 } = await c.from("rosters").insert(Object.assign({ is_public: false }, payload)).select("id").single();
        if (e2) throw new Error(e2.message);
        return row.id;
    },
    async setPublic(id, isPublic) {
        const c = await window.Auth.client();
        const { error } = await c.from("rosters").update({ is_public: !!isPublic, updated_at: new Date().toISOString() }).eq("id", id);
        if (error) throw new Error(error.message);
    },
    async remove(key) {
        await window.Auth.requireUser();
        const c = await window.Auth.client();
        const { error } = await c.from("rosters").delete().eq("id", key);
        if (error) throw new Error(error.message);
    }
};
const useSupabase = !!(window.SUPABASE_CONFIG && window.SUPABASE_CONFIG.url && window.SUPABASE_CONFIG.anonKey && window.Auth);

// one upload per minute and five per day per browser (the database rules are the real limit)
function checkUploadAllowed() {
    try {
        const log = (JSON.parse(localStorage.getItem("2uhub_upload_log") || "[]") || []).filter(t => Date.now() - t < 86400000);
        if (log.length && Date.now() - log[log.length - 1] < 60000) return "Please wait a minute before uploading again.";
        if (log.length >= 5) return "You can upload up to 5 rosters per day.";
    } catch (e) { /* storage blocked: skip the check */ }
    return "";
}
function logUpload() {
    try {
        const log = (JSON.parse(localStorage.getItem("2uhub_upload_log") || "[]") || []).filter(t => Date.now() - t < 86400000);
        log.push(Date.now());
        localStorage.setItem("2uhub_upload_log", JSON.stringify(log));
    } catch (e) { /* ignore */ }
}

const Community = {
    accounts: useSupabase,
    adapter: window.__fakeCommunity || (useSupabase ? supa : real),
    list() { return Community.adapter.list(); },
    get(key) { return Community.adapter.get(key); },
    report(key) { return Community.adapter.report(key); },
    mine() { return Community.adapter.mine ? Community.adapter.mine() : Promise.resolve([]); },
    saveMine(entry) { return Community.adapter.saveMine ? Community.adapter.saveMine(entry) : Promise.reject(new Error("Not available.")); },
    setPublic(id, v) { return Community.adapter.setPublic ? Community.adapter.setPublic(id, v) : Promise.reject(new Error("Not available.")); },
    deleteMine(id) { return Community.adapter.remove ? Community.adapter.remove(id) : Promise.reject(new Error("Not available.")); },
    remove(key) { return Community.adapter.remove ? Community.adapter.remove(key) : Promise.reject(new Error("Not available.")); },
    // meta is the list entry, data the cleaned roster; returns the new key
    async upload(meta, data) {
        const blocked = checkUploadAllowed();
        if (blocked) throw new Error(blocked);
        const key = await Community.adapter.upload(meta, data);
        logUpload();
        return key;
    }
};
window.Community = Community;
window.dispatchEvent(new Event("community-ready"));
