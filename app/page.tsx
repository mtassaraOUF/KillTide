"use client";

import { ChangeEvent, FormEvent, useEffect, useMemo, useRef, useState } from "react";

type Catch = {
  species: string;
  length: string;
  weight: string;
  kept: boolean;
};

type Dive = {
  id: string;
  title: string;
  date: string;
  location: string;
  diveType: string;
  visibility: string;
  waterTemp: string;
  current: string;
  duration: string;
  notes: string;
  lessons: string;
  catch: Catch;
  photos: string[];
  createdAt: string;
};

type Draft = Omit<Dive, "id" | "createdAt">;

const DB_NAME = "killtide-journal";
const STORE = "dives";
const emptyDraft: Draft = {
  title: "",
  date: new Date().toISOString().slice(0, 10),
  location: "",
  diveType: "Shore",
  visibility: "",
  waterTemp: "",
  current: "Light",
  duration: "",
  notes: "",
  lessons: "",
  catch: { species: "", length: "", weight: "", kept: true },
  photos: [],
};

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { keyPath: "id" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function getAllDives(): Promise<Dive[]> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const request = db.transaction(STORE, "readonly").objectStore(STORE).getAll();
    request.onsuccess = () =>
      resolve((request.result as Dive[]).sort((a, b) => b.date.localeCompare(a.date)));
    request.onerror = () => reject(request.error);
  });
}

async function putDive(dive: Dive) {
  const db = await openDb();
  return new Promise<void>((resolve, reject) => {
    const request = db.transaction(STORE, "readwrite").objectStore(STORE).put(dive);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

async function removeDive(id: string) {
  const db = await openDb();
  return new Promise<void>((resolve, reject) => {
    const request = db.transaction(STORE, "readwrite").objectStore(STORE).delete(id);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

async function compressImage(file: File): Promise<string> {
  const url = URL.createObjectURL(file);
  const image = new Image();
  await new Promise<void>((resolve, reject) => {
    image.onload = () => resolve();
    image.onerror = () => reject(new Error("Could not read this photo."));
    image.src = url;
  });
  const max = 1600;
  const scale = Math.min(1, max / Math.max(image.width, image.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(image.width * scale);
  canvas.height = Math.round(image.height * scale);
  canvas.getContext("2d")?.drawImage(image, 0, 0, canvas.width, canvas.height);
  URL.revokeObjectURL(url);
  return canvas.toDataURL("image/jpeg", 0.78);
}

function prettyDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${value}T12:00:00`));
}

export default function Home() {
  const [dives, setDives] = useState<Dive[]>([]);
  const [draft, setDraft] = useState<Draft>(() => {
    if (typeof window === "undefined") return emptyDraft;
    const saved = localStorage.getItem("killtide-draft");
    if (!saved) return emptyDraft;
    try {
      return JSON.parse(saved) as Draft;
    } catch {
      return emptyDraft;
    }
  });
  const [view, setView] = useState<"home" | "journal" | "log" | "settings">("home");
  const [selected, setSelected] = useState<Dive | null>(null);
  const [step, setStep] = useState(1);
  const [notice, setNotice] = useState("");
  const importRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getAllDives().then(setDives).catch(() => setNotice("Local journal could not be opened."));
  }, []);

  useEffect(() => {
    try {
      const draftWithoutPhotos = { ...draft, photos: [] };
      localStorage.setItem("killtide-draft", JSON.stringify(draftWithoutPhotos));
    } catch {}
  }, [draft]);

  const stats = useMemo(() => {
    const species = new Set(dives.map((d) => d.catch.species).filter(Boolean));
    return {
      dives: dives.length,
      catches: dives.filter((d) => d.catch.species).length,
      species: species.size,
      hours: dives.reduce((sum, d) => sum + (Number(d.duration) || 0), 0),
    };
  }, [dives]);

  function patch<K extends keyof Draft>(key: K, value: Draft[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  async function handlePhotos(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []).slice(0, 6 - draft.photos.length);
    if (!files.length) return;
    setNotice("Preparing photos…");
    try {
      const compressed = await Promise.all(files.map(compressImage));
      patch("photos", [...draft.photos, ...compressed]);
      setNotice(`${compressed.length} photo${compressed.length > 1 ? "s" : ""} ready`);
    } catch {
      setNotice("One of those photos could not be added.");
    }
  }

  async function saveDive(event: FormEvent) {
    event.preventDefault();
    if (!draft.title || !draft.date || !draft.location) {
      setNotice("Add a title, date, and location before saving.");
      setStep(1);
      return;
    }
    const dive: Dive = {
      ...draft,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    await putDive(dive);
    setDives(await getAllDives());
    setDraft({ ...emptyDraft, date: new Date().toISOString().slice(0, 10) });
    localStorage.removeItem("killtide-draft");
    setStep(1);
    setView("journal");
    setNotice("Dive saved to this device.");
  }

  async function deleteDive(id: string) {
    if (!confirm("Delete this dive from your journal?")) return;
    await removeDive(id);
    setDives(await getAllDives());
    setSelected(null);
    setNotice("Dive deleted.");
  }

  function exportBackup() {
    const blob = new Blob([JSON.stringify({ version: 1, exportedAt: new Date(), dives }, null, 2)], {
      type: "application/json",
    });
    const anchor = document.createElement("a");
    anchor.href = URL.createObjectURL(blob);
    anchor.download = `killtide-backup-${new Date().toISOString().slice(0, 10)}.json`;
    anchor.click();
    URL.revokeObjectURL(anchor.href);
    setNotice("Backup downloaded.");
  }

  async function importBackup(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const parsed = JSON.parse(await file.text());
      const imported: Dive[] = Array.isArray(parsed) ? parsed : parsed.dives;
      if (!Array.isArray(imported)) throw new Error();
      await Promise.all(imported.map(putDive));
      setDives(await getAllDives());
      setNotice(`${imported.length} dives restored.`);
    } catch {
      setNotice("That backup file could not be restored.");
    }
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <button className="brand-button" onClick={() => setView("home")} aria-label="Kill Tide home">
          <img src="/killtide-logo.png" alt="" />
          <span>KILL TIDE</span>
        </button>
        <span className="privacy-pill"><i /> Private · On device</span>
      </header>

      {view === "home" && (
        <>
          <section className="hero">
            <div className="hero-wash" />
            <div className="hero-content">
              <p className="eyebrow">Your ocean diary</p>
              <h1>Every dive<br />leaves evidence.</h1>
              <p className="hero-copy">Keep the photos, conditions, catches, and lessons that shape your life in the water.</p>
              <button className="primary hero-cta" onClick={() => setView("log")}>＋ Log today&apos;s dive</button>
            </div>
          </section>

          <section className="content">
            <div className="stat-grid">
              <article><strong>{stats.dives}</strong><span>Dives</span></article>
              <article><strong>{stats.catches}</strong><span>Catches</span></article>
              <article><strong>{stats.species}</strong><span>Species</span></article>
              <article><strong>{stats.hours}</strong><span>Hours</span></article>
            </div>

            <div className="section-heading">
              <div><p className="eyebrow">Journal</p><h2>Recent dives</h2></div>
              <button className="text-button" onClick={() => setView("journal")}>View all →</button>
            </div>
            {dives.length ? (
              <div className="recent-row">
                {dives.slice(0, 3).map((dive) => <DiveCard key={dive.id} dive={dive} onOpen={setSelected} />)}
              </div>
            ) : (
              <button className="empty-card" onClick={() => setView("log")}>
                <span>01</span>
                <div><strong>Start the story</strong><small>Your first dive entry takes about two minutes.</small></div>
                <b>＋</b>
              </button>
            )}

            <article className="tide-teaser">
              <div><p className="eyebrow">Coming next</p><h2>Find the water&apos;s quiet window.</h2></div>
              <div className="tide-orb"><span>7:58</span><small>AM</small></div>
              <p>Location-aware slack-water windows and one-tap calendar planning are next on the horizon.</p>
              <span className="sample-label">FORECAST PREVIEW</span>
            </article>
          </section>
        </>
      )}

      {view === "journal" && (
        <section className="page content">
          <div className="page-intro"><p className="eyebrow">Private log</p><h1>Dive journal</h1><p>{dives.length ? "A record of the water, one entry at a time." : "Your story starts with the next dive."}</p></div>
          {dives.length ? <div className="journal-grid">{dives.map((dive) => <DiveCard key={dive.id} dive={dive} onOpen={setSelected} />)}</div> :
            <button className="empty-journal" onClick={() => setView("log")}><span>◌</span><strong>No dives logged yet</strong><small>Photos, catches, conditions, and lessons will live here.</small><b>Log first dive</b></button>}
        </section>
      )}

      {view === "log" && (
        <section className="page form-page">
          <div className="form-head">
            <button className="back" onClick={() => setView("home")}>←</button>
            <div><p className="eyebrow">New evidence</p><h1>Log a dive</h1></div>
            <span>{step}/3</span>
          </div>
          <div className="progress"><i style={{ width: `${step * 33.333}%` }} /></div>
          <form onSubmit={saveDive}>
            {step === 1 && <div className="form-step">
              <h2>When & where</h2>
              <label>Dive title<input value={draft.title} onChange={(e) => patch("title", e.target.value)} placeholder="Morning in the kelp" autoFocus /></label>
              <div className="field-row">
                <label>Date<input type="date" value={draft.date} onChange={(e) => patch("date", e.target.value)} /></label>
                <label>Dive type<select value={draft.diveType} onChange={(e) => patch("diveType", e.target.value)}><option>Shore</option><option>Boat</option><option>Kelp</option><option>Reef</option><option>Blue water</option></select></label>
              </div>
              <label>Location<input value={draft.location} onChange={(e) => patch("location", e.target.value)} placeholder="La Jolla, California" /></label>
              <p className="privacy-note">⌖ Location stays private on this device.</p>
              <label>Photos<div className="photo-input">
                <input type="file" accept="image/*" capture="environment" multiple onChange={handlePhotos} />
                <span>＋</span><strong>Take or choose photos</strong><small>Up to 6 · compressed on your phone</small>
              </div></label>
              {!!draft.photos.length && <div className="photo-strip">{draft.photos.map((photo, index) => <div key={index}><img src={photo} alt={`Dive upload ${index + 1}`} /><button type="button" onClick={() => patch("photos", draft.photos.filter((_, i) => i !== index))}>×</button></div>)}</div>}
            </div>}

            {step === 2 && <div className="form-step">
              <h2>Conditions & catch</h2>
              <div className="field-row">
                <label>Visibility<input value={draft.visibility} onChange={(e) => patch("visibility", e.target.value)} placeholder="15 ft" /></label>
                <label>Water temp<input value={draft.waterTemp} onChange={(e) => patch("waterTemp", e.target.value)} placeholder="68°F" /></label>
              </div>
              <div className="field-row">
                <label>Current<select value={draft.current} onChange={(e) => patch("current", e.target.value)}><option>Still</option><option>Light</option><option>Moderate</option><option>Strong</option></select></label>
                <label>Time in water<input type="number" min="0" step=".5" value={draft.duration} onChange={(e) => patch("duration", e.target.value)} placeholder="2 hours" /></label>
              </div>
              <div className="catch-panel">
                <p className="eyebrow">Catch · optional</p>
                <label>Species<input value={draft.catch.species} onChange={(e) => patch("catch", { ...draft.catch, species: e.target.value })} placeholder="California sheephead" /></label>
                <div className="field-row">
                  <label>Length<input value={draft.catch.length} onChange={(e) => patch("catch", { ...draft.catch, length: e.target.value })} placeholder="28 in" /></label>
                  <label>Weight<input value={draft.catch.weight} onChange={(e) => patch("catch", { ...draft.catch, weight: e.target.value })} placeholder="14 lb" /></label>
                </div>
                <label className="toggle-line"><input type="checkbox" checked={draft.catch.kept} onChange={(e) => patch("catch", { ...draft.catch, kept: e.target.checked })} /><span>Kept catch</span></label>
              </div>
            </div>}

            {step === 3 && <div className="form-step">
              <h2>Remember the dive</h2>
              <label>What happened?<textarea value={draft.notes} onChange={(e) => patch("notes", e.target.value)} placeholder="The water settled just after sunrise…" rows={5} /></label>
              <label>What did you learn?<textarea value={draft.lessons} onChange={(e) => patch("lessons", e.target.value)} placeholder="Next time, enter from the south side…" rows={4} /></label>
              <div className="review-card">
                {draft.photos[0] && <img src={draft.photos[0]} alt="" />}
                <div><small>{prettyDate(draft.date)}</small><strong>{draft.title || "Untitled dive"}</strong><span>{draft.location || "No location yet"}</span></div>
              </div>
            </div>}
            <div className="form-actions">
              {step > 1 && <button type="button" className="secondary" onClick={() => setStep(step - 1)}>Back</button>}
              {step < 3 ? <button type="button" className="primary" onClick={() => setStep(step + 1)}>Continue</button> : <button className="primary" type="submit">Save to journal</button>}
            </div>
          </form>
        </section>
      )}

      {view === "settings" && (
        <section className="page content settings">
          <div className="page-intro"><p className="eyebrow">Your data</p><h1>Privacy & backup</h1><p>Everything is stored inside this browser. No account. No cloud. No tracking.</p></div>
          <article><span className="setting-icon">⌂</span><div><strong>On-device journal</strong><p>Entries and compressed photos never leave this browser unless you export them.</p></div></article>
          <article><span className="setting-icon">↓</span><div><strong>Download a backup</strong><p>Save a copy regularly, especially before changing phones or clearing browser data.</p><button className="secondary" onClick={exportBackup}>Export full backup</button></div></article>
          <article><span className="setting-icon">↑</span><div><strong>Restore a backup</strong><p>Bring a previous Kill Tide journal back onto this device.</p><button className="secondary" onClick={() => importRef.current?.click()}>Choose backup file</button><input ref={importRef} type="file" accept=".json" hidden onChange={importBackup} /></div></article>
          <p className="safety">Marine conditions can change quickly. Kill Tide is a journal and planning aid, not a substitute for official advisories, local knowledge, or safe-diving practices.</p>
        </section>
      )}

      {selected && <div className="modal-backdrop" onClick={() => setSelected(null)}>
        <article className="dive-modal" onClick={(e) => e.stopPropagation()}>
          <button className="modal-close" onClick={() => setSelected(null)}>×</button>
          {selected.photos[0] ? <img className="modal-cover" src={selected.photos[0]} alt="" /> : <div className="modal-cover placeholder-cover" />}
          <div className="modal-body">
            <p className="eyebrow">{prettyDate(selected.date)} · {selected.diveType}</p>
            <h2>{selected.title}</h2><p className="modal-location">⌖ {selected.location}</p>
            <div className="condition-row"><span>{selected.visibility || "—"}<small>Visibility</small></span><span>{selected.waterTemp || "—"}<small>Water</small></span><span>{selected.current}<small>Current</small></span></div>
            {selected.catch.species && <div className="catch-detail"><small>CATCH</small><strong>{selected.catch.species}</strong><span>{[selected.catch.length, selected.catch.weight, selected.catch.kept ? "Kept" : "Released"].filter(Boolean).join(" · ")}</span></div>}
            {selected.notes && <div className="story"><small>THE STORY</small><p>{selected.notes}</p></div>}
            {selected.lessons && <div className="story"><small>LESSON</small><p>{selected.lessons}</p></div>}
            {selected.photos.length > 1 && <div className="modal-gallery">{selected.photos.slice(1).map((photo, i) => <img src={photo} alt="" key={i} />)}</div>}
            <button className="danger" onClick={() => deleteDive(selected.id)}>Delete dive</button>
          </div>
        </article>
      </div>}

      {notice && <button className="toast" onClick={() => setNotice("")}>{notice}<span>×</span></button>}

      <nav className="bottom-nav" aria-label="Primary navigation">
        <button className={view === "home" ? "active" : ""} onClick={() => setView("home")}><i>⌂</i><span>Home</span></button>
        <button className={view === "journal" ? "active" : ""} onClick={() => setView("journal")}><i>▤</i><span>Journal</span></button>
        <button className="log-button" onClick={() => setView("log")}><i>＋</i><span>Log dive</span></button>
        <button disabled title="Kill Tide forecasts are coming next"><i>≈</i><span>Tides</span></button>
        <button className={view === "settings" ? "active" : ""} onClick={() => setView("settings")}><i>•••</i><span>More</span></button>
      </nav>
    </main>
  );
}

function DiveCard({ dive, onOpen }: { dive: Dive; onOpen: (dive: Dive) => void }) {
  return <button className="dive-card" onClick={() => onOpen(dive)}>
    {dive.photos[0] ? <img src={dive.photos[0]} alt="" /> : <div className="card-placeholder"><span>KT</span></div>}
    <div className="card-gradient" />
    <div className="card-copy"><small>{prettyDate(dive.date)}</small><strong>{dive.title}</strong><span>⌖ {dive.location}</span>{dive.catch.species && <b>{dive.catch.species}</b>}</div>
  </button>;
}
