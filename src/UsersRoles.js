import React, { useMemo, useState } from "react";
import "./UsersRoles.css";

const seed = [
  { id: "U1", name: "Jan Kowalski", email: "jan@ex.com", roles: ["ADMIN", "MANAGER"] },
  { id: "U2", name: "Anna Nowak",   email: "anna@ex.com", roles: ["TENANT"] },
  { id: "U3", name: "Piotr Wiśn.",  email: "piotr@ex.com", roles: ["OWNER"] },
  { id: "U4", name: "Ewa Ziel.",    email: "ewa@ex.com",   roles: ["MANAGER", "TENANT"] },
];

const ALL_ROLES = ["ADMIN", "MANAGER", "OWNER", "TENANT"];

export default function UsersRoles() {
  const [users, setUsers] = useState(seed);
  const [q, setQ] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [newUser, setNewUser] = useState({ name: "", email: "", roles: ["TENANT"] });

  const filtered = useMemo(() => {
    return users.filter(u => {
      const matchQ =
        !q ||
        u.name.toLowerCase().includes(q.toLowerCase()) ||
        u.email.toLowerCase().includes(q.toLowerCase()) ||
        u.id.toLowerCase().includes(q.toLowerCase());
      const matchR = roleFilter === "ALL" ? true : u.roles.includes(roleFilter);
      return matchQ && matchR;
    });
  }, [users, q, roleFilter]);

  const toggleRole = (userId, role) => {
    setUsers(prev =>
      prev.map(u => {
        if (u.id !== userId) return u;
        const has = u.roles.includes(role);
        return { ...u, roles: has ? u.roles.filter(r => r !== role) : [...u.roles, role] };
      })
    );
  };

  const removeUser = id => setUsers(prev => prev.filter(u => u.id !== id));

  const addUser = e => {
    e.preventDefault();
    if (!newUser.name.trim() || !newUser.email.trim()) return;
    const id = `U${Math.floor(Math.random() * 90000) + 10000}`;
    setUsers(prev => [{ id, ...newUser }, ...prev]);
    setNewUser({ name: "", email: "", roles: ["TENANT"] });
  };

  return (
    <div className="users-roles">
      <h2>Użytkownicy i role</h2>

      <div className="filters">
        <input
          type="text"
          placeholder="Szukaj: imię, e-mail, ID…"
          value={q}
          onChange={e => setQ(e.target.value)}
        />
        <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)}>
          <option value="ALL">Wszystkie role</option>
          {ALL_ROLES.map(r => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
      </div>

      <div className="grid">
        <div className="panel">
          <h3>Dodaj użytkownika</h3>
          <form className="form" onSubmit={addUser}>
            <input
              placeholder="Imię i nazwisko"
              value={newUser.name}
              onChange={e => setNewUser(s => ({ ...s, name: e.target.value }))}
            />
            <input
              placeholder="Email"
              value={newUser.email}
              onChange={e => setNewUser(s => ({ ...s, email: e.target.value }))}
            />
            <div className="role-box">
              {ALL_ROLES.map(r => (
                <label key={r} className="chk">
                  <input
                    type="checkbox"
                    checked={newUser.roles.includes(r)}
                    onChange={() => {
                      const has = newUser.roles.includes(r);
                      setNewUser(s => ({ ...s, roles: has ? s.roles.filter(x => x !== r) : [...s.roles, r] }));
                    }}
                  />
                  {r}
                </label>
              ))}
            </div>
            <div className="actions">
              <button className="btn primary" type="submit">Dodaj</button>
              <button className="btn light" type="reset" onClick={() => setNewUser({ name: "", email: "", roles: ["TENANT"] })}>Wyczyść</button>
            </div>
          </form>
        </div>

        <div className="panel">
          <h3>Lista użytkowników ({filtered.length})</h3>
          <div className="table head">
            <div>ID</div>
            <div>Użytkownik</div>
            <div>Email</div>
            <div>Role</div>
            <div>Akcje</div>
          </div>

          {filtered.map(u => (
            <div className="table row" key={u.id}>
              <div>{u.id}</div>
              <div>{u.name}</div>
              <div>{u.email}</div>
              <div className="roles">
                {ALL_ROLES.map(r => (
                  <label key={r} className={`tag ${u.roles.includes(r) ? "on" : ""}`}>
                    <input
                      type="checkbox"
                      checked={u.roles.includes(r)}
                      onChange={() => toggleRole(u.id, r)}
                    />
                    {r}
                  </label>
                ))}
              </div>
              <div className="actions">
                <button className="btn danger" onClick={() => removeUser(u.id)}>Usuń</button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && <div className="empty">Brak użytkowników.</div>}
        </div>
      </div>
    </div>
  );
}
