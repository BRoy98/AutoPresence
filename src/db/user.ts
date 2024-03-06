import sqlite3 from "better-sqlite3";
import path from "path";
import { Database } from "sqlite3";
import { User } from "./types";

const db = new sqlite3(
  path.join(__dirname, "../..", "/static/gmail-notifier.sqlite")
);

export const getUserByEmail = async (email: string) => {
  return db.prepare(`SELECT * FROM users WHERE email = ?`).get(email);
};

export const createUser = async (user: User) => {
  const sql = `INSERT INTO users (
            google_id, 
            email, 
            name,
            picture,
            access_token,
            refresh_token,
            scope,
            token_type,
            expiry_date)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  const params = [
    user.google_id,
    user.email,
    user.name,
    user.picture,
    user.access_token,
    user.refresh_token,
    user.scope,
    user.token_type,
    user.expiry_date,
  ];

  return db.prepare(sql).run(params);
};
