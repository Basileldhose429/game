const WebSocket = require("ws");
const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const SECRET = "dude_theft_secret_99";
const db = new sqlite3.Database("./game.db");

db.serialize(() => {
  db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY,
    username TEXT UNIQUE,
    password TEXT,
    money INTEGER DEFAULT 1000,
    x REAL DEFAULT 0,
    z REAL DEFAULT 0
  )
  `);
});

const wss = new WebSocket.Server({ port: 8081 });
let players = {};

function generateId() {
  return Math.random().toString(36).slice(2);
}

// ─── AUTHORITATIVE SIMULATION ───
function simulatePlayer(p, input, dt) {
    if (!input) return;
    const speed = (input.shift ? 15 : 8);
    const rotSpeed = 3.5;

    // Rotation
    if (input.a) p.ry += rotSpeed * dt;
    if (input.d) p.ry -= rotSpeed * dt;

    // Movement
    if (input.w) {
        p.x -= Math.sin(p.ry) * speed * dt;
        p.z -= Math.cos(p.ry) * speed * dt;
    }
    if (input.s) {
        p.x += Math.sin(p.ry) * speed * dt;
        p.z += Math.cos(p.ry) * speed * dt;
    }
}

function validateMovement(p, nextX, nextZ) {
    const dist = Math.sqrt(Math.pow(nextX - p.x, 2) + Math.pow(nextZ - p.z, 2));
    if (dist > 2.0) { // Speed hack threshold (per 50ms tick)
        console.log(`[Anti-Cheat] Suspicious movement from ${p.username}: ${dist.toFixed(2)} units`);
        return false;
    }
    return true;
}

wss.on("connection", ws => {
  const pid = generateId();
  ws.pid = pid;
  
  // Initial state
  players[pid] = { id: pid, x: 0, z: 0, ry: 0, hp: 500, money: 1000, username: "Guest" };

  ws.on("message", msg => {
    let data;
    try { data = JSON.parse(msg); } catch { return; }

    if (data.type === "register") {
      const hash = bcrypt.hashSync(data.password, 10);
      db.run("INSERT INTO users (username,password) VALUES (?,?)", [data.username, hash], 
        err => ws.send(JSON.stringify({ type: err ? "error" : "registered" })));
    }

    if (data.type === "login") {
      db.get("SELECT * FROM users WHERE username=?", [data.username], (err, user) => {
        if (err || !user || !bcrypt.compareSync(data.password, user.password)) {
          ws.send(JSON.stringify({ type: "error", message: "Invalid credentials" }));
          return;
        }
        const token = jwt.sign({ id: user.id, username: user.username }, SECRET, { expiresIn: "7d" });
        ws.user = user;
        players[pid].x = user.x;
        players[pid].z = user.z;
        players[pid].username = user.username;
        players[pid].money = user.money;

        ws.send(JSON.stringify({
          type: "login", id: pid, token: token, money: user.money, x: user.x, z: user.z, username: user.username
        }));
      });
    }

    // AUTH (Resume Session)
    if (data.type === "auth") {
        try {
            const decoded = jwt.verify(data.token, SECRET);
            db.get("SELECT * FROM users WHERE id=?", [decoded.id], (err, user) => {
                if (user) {
                    ws.user = user;
                    players[pid].x = user.x;
                    players[pid].z = user.z;
                    players[pid].username = user.username;
                    ws.send(JSON.stringify({ type: "login", id: pid, money: user.money, x: user.x, z: user.z, username: user.username }));
                }
            });
        } catch(e) {}
    }

    // AUTHORITATIVE INPUT
    if (data.type === "input") {
        const p = players[pid];
        if (p) {
            simulatePlayer(p, data.keys, 0.05); // Fixed 20Hz step
            
            // Save to DB periodically (e.g., every 10th input or on close)
            if (ws.user && Math.random() < 0.05) {
                db.run("UPDATE users SET x=?, z=?, money=? WHERE id=?", [p.x, p.z, p.money, ws.user.id]);
            }
        }
    }
    
    // Non-auth update (for HP/Money sync from client logic like damage)
    if (data.type === "sync") {
        const p = players[pid];
        if (p) {
            p.hp = data.hp;
            p.money = data.money;
        }
    }
  });

  ws.on("close", () => {
      delete players[pid];
      wss.clients.forEach(c => {
          if (c.readyState === WebSocket.OPEN) c.send(JSON.stringify({ type: "player_left", id: pid }));
      });
  });
});

// BROADCAST SNAPSHOT (20Hz)
setInterval(() => {
  const msg = JSON.stringify({ type: "snapshot", players });
  wss.clients.forEach(c => {
    if (c.readyState === WebSocket.OPEN) c.send(msg);
  });
}, 50);

console.log("Authoritative Server running ws://localhost:8081");
