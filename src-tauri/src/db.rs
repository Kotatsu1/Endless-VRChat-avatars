use rusqlite::{params, Connection, Result, Error};
use serde::Serialize;
use std::time::SystemTime;
use tauri::command;
use std::fs;
use dirs::cache_dir;


#[derive(Serialize)]
pub struct Avatar {
    id: i32,
    avtr: String,
    title: String,
    thumbnailUrl: String,
    lastUsed: Option<String>
}

pub fn initialize_db() -> Result<()> {
    let conn = get_connection()?;
    conn.execute(
        "CREATE TABLE IF NOT EXISTS avatars (
              id INTEGER PRIMARY KEY,
              avtr TEXT NOT NULL,
              title TEXT NOT NULL,
              thumbnailUrl TEXT NOT NULL,
              lastUsed TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
          )",
        [],
    )?;

    conn.execute(
        "CREATE TABLE IF NOT EXISTS auth_cookie (
              id INTEGER PRIMARY KEY,
              auth_cookie TEXT NOT NULL
          )",
        [],
    )?;
    Ok(())
}

fn get_db_path() -> String {
    let mut path = cache_dir().expect("Cache directory not found");
    path.push("Endless VRChat Avatars");

    if !path.exists() {
        if let Err(err) = fs::create_dir_all(&path) {
            eprintln!("Failed to create directory: {}", err);
        }
    }

    path.push("avatars.db");
    path.to_string_lossy().to_string()
}


fn get_connection() -> Result<Connection, Error> {
    let dir_path = get_db_path();

    Connection::open(dir_path)
}

pub fn update_auth_cookie(auth_cookie: &str) -> Result<()> {
    let conn = get_connection()?;
    conn.execute(
        "INSERT OR REPLACE INTO auth_cookie (id, auth_cookie) VALUES (1, ?1)",
        params![auth_cookie],
    )?;
    Ok(())
}

pub fn get_auth_cookie() -> Result<Option<String>> {
    let conn = get_connection()?;
    let mut stmt = conn.prepare("SELECT auth_cookie FROM auth_cookie WHERE id = 1")?;
    let mut rows = stmt.query([])?;

    if let Some(row) = rows.next()? {
        Ok(Some(row.get(0)?))
    } else {
        Ok(None)
    }
}

pub fn add_avatar(avtr: &str, title: &str, thumbnailUrl: &str) -> Result<()> {
    let conn = get_connection()?;
    conn.execute(
        "INSERT INTO avatars (avtr, title, thumbnailUrl, lastUsed) VALUES (?1, ?2, ?3, CURRENT_TIMESTAMP)",
        params![avtr, title, thumbnailUrl],
    )?;
    Ok(())
}

pub fn update_avatar_last_used(avtr: &str) -> Result<()> {
    let conn = get_connection()?;
    conn.execute(
        "UPDATE avatars SET lastUsed = CURRENT_TIMESTAMP WHERE avtr = ?1",
        params![avtr],
    )?;
    Ok(())
}

pub fn remove_avatar(avtr: &str) -> Result<()> {
    let conn = get_connection()?;
    conn.execute(
        "DELETE FROM avatars WHERE avtr = ?1",
        params![avtr],
    )?;
    Ok(())
}


pub fn get_existing_avatar(avtr: &str) -> Result<Option<Avatar>> {
    let conn = get_connection()?;
    let mut stmt = conn.prepare("SELECT id, avtr, title, thumbnailUrl FROM avatars WHERE avtr = ?1")?;
    let mut rows = stmt.query(params![avtr])?;

    if let Some(row) = rows.next()? {
        Ok(Some(Avatar {
            id: row.get(0)?,
            avtr: row.get(1)?,
            title: row.get(2)?,
            thumbnailUrl: row.get(3)?,
            lastUsed: None
        }))
    } else {
        Ok(None)
    }
}

pub fn get_all_avatars() -> Result<Vec<Avatar>> {
    let conn = get_connection()?;
    let mut stmt = conn.prepare("SELECT id, avtr, title, thumbnailUrl, lastUsed FROM avatars")?;
    let avatar_iter = stmt.query_map([], |row| {
        Ok(Avatar {
            id: row.get(0)?,
            avtr: row.get(1)?,
            title: row.get(2)?,
            thumbnailUrl: row.get(3)?,
            lastUsed: row.get(4)?
        })
    })?;

    let mut avatars = Vec::new();
    for avatar in avatar_iter {
        avatars.push(avatar?);
    }
    Ok(avatars)
}

