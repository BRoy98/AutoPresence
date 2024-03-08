import sqlite3 from "better-sqlite3";
import path from "path";
import { User } from "./types";

const db = new sqlite3(
  path.join(__dirname, "../..", "/static/gmail-notifier.sqlite")
);

export const initUserTable = () => {
  const sql = `CREATE TABLE IF NOT EXISTS users (
                id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
                google_id TEXT NOT NULL,
                email TEXT NOT NULL UNIQUE,
                name TEXT,
                picture TEXT,
                access_token TEXT,
                refresh_token TEXT,
                scope TEXT,
                token_type TEXT,
                id_token TEXT,
                expiry_date INTEGER
              );`;
  return db.prepare(sql).run();
};

export const getUserByEmail = (email: string) => {
  return db.prepare(`SELECT * FROM users WHERE email = ?`).get(email);
};

export const createUser = (user: User) => {
  const sql = `INSERT INTO users (
            google_id, 
            email, 
            name,
            picture,
            access_token,
            refresh_token,
            scope,
            token_type,
            id_token,
            expiry_date)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  const params = [
    user.google_id,
    user.email,
    user.name,
    user.picture,
    user.access_token,
    user.refresh_token,
    user.scope,
    user.token_type,
    user.id_token,
    user.expiry_date,
  ];

  return db.prepare(sql).run(...params);
};

export const updateUserTokens = async (
  email: string,
  accessToken: string,
  refreshToken?: string
) => {
  const sql = `UPDATE users SET access_token = ? ${
    refreshToken && ", refresh_token = ?"
  } WHERE email = ?`;
  const params = [accessToken];

  if (refreshToken) params.push(refreshToken);
  params.push(email);

  return db.prepare(sql).run(...params);
};
