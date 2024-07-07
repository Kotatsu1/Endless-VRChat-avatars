use rusqlite::{params, Connection, Result, Error as RusqliteError};
use serde::Serialize;
use tauri::command;
use tauri::Window;
use std::fs;
use dirs::cache_dir;


#[derive(Serialize)]
pub struct Avatar {
    id: i32,
    avtr: String,
    title: String,
    thumbnailUrl: String,
}

pub fn initialize_db() -> Result<()> {
    let conn = get_connection()?;
    conn.execute(
        "CREATE TABLE IF NOT EXISTS avatars (
              id INTEGER PRIMARY KEY,
              avtr TEXT NOT NULL,
              title TEXT NOT NULL,
              thumbnailUrl TEXT NOT NULL
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


fn get_connection() -> Result<Connection, RusqliteError> {
    let dir_path = get_db_path();

    Connection::open(dir_path)
}


fn update_auth_cookie(conn: &Connection, auth_cookie: &str) -> Result<()> {
    conn.execute(
        "INSERT OR REPLACE INTO auth_cookie (id, auth_cookie) VALUES (1, ?1)",
        params![auth_cookie],
    )?;
    Ok(())
}

fn get_auth_cookie(conn: &Connection) -> Result<Option<String>> {
    let mut stmt = conn.prepare("SELECT auth_cookie FROM auth_cookie WHERE id = 1")?;
    let mut rows = stmt.query([])?;

    if let Some(row) = rows.next()? {
        Ok(Some(row.get(0)?))
    } else {
        Ok(None)
    }
}

fn add_avatar(conn: &Connection, avtr: &str, title: &str, thumbnailUrl: &str) -> Result<()> {
    conn.execute(
        "INSERT INTO avatars (avtr, title, thumbnailUrl) VALUES (?1, ?2, ?3)",
        params![avtr, title, thumbnailUrl],
    )?;
    Ok(())
}

fn remove_avatar(conn: &Connection, avtr: &str) -> Result<()> {
    conn.execute(
        "DELETE FROM avatars WHERE avtr = ?1",
        params![avtr],
    )?;
    Ok(())
}

fn get_all_avatars(conn: &Connection) -> Result<Vec<Avatar>> {
    let mut stmt = conn.prepare("SELECT id, avtr, title, thumbnailUrl FROM avatars")?;
    let avatar_iter = stmt.query_map([], |row| {
        Ok(Avatar {
            id: row.get(0)?,
            avtr: row.get(1)?,
            title: row.get(2)?,
            thumbnailUrl: row.get(3)?,
        })
    })?;

    let mut avatars = Vec::new();
    for avatar in avatar_iter {
        avatars.push(avatar?);
    }
    Ok(avatars)
}

#[command]
pub fn add_avatar_cmd(window: Window, avtr: String, title: String, thumbnailUrl: String) -> Result<(), String> {
    window.emit("catalog_changed", "Avatar added successfully").unwrap();
    let conn = get_connection().map_err(|e| e.to_string())?;
    add_avatar(&conn, &avtr, &title, &thumbnailUrl).map_err(|e| e.to_string())
}

#[command]
pub fn remove_avatar_cmd(window: Window, avtr: String) -> Result<(), String> {
    window.emit("catalog_changed", "Avatar removed successfully").unwrap();
    let conn = get_connection().map_err(|e| e.to_string())?;
    remove_avatar(&conn, &avtr).map_err(|e| e.to_string())
}

#[command]
pub fn get_all_avatars_cmd() -> Result<Vec<Avatar>, String> {
    let conn = get_connection().map_err(|e| e.to_string())?;
    get_all_avatars(&conn).map_err(|e| e.to_string())
}

#[command]
pub fn update_auth_cookie_cmd(auth_cookie: String) -> Result<(), String> {
    let conn = get_connection().map_err(|e| e.to_string())?;
    update_auth_cookie(&conn, &auth_cookie).map_err(|e| e.to_string())
}

#[command]
pub fn get_auth_cookie_cmd() -> Result<Option<String>, String> {
    let conn = get_connection().map_err(|e| e.to_string())?;
    get_auth_cookie(&conn).map_err(|e| e.to_string())
}
