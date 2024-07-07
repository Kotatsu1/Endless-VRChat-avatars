use rusqlite::{params, Connection, Result};
use serde::Serialize;
use tauri::command;
use tauri::Window;


#[derive(Serialize)]
pub struct Avatar {
    id: i32,
    avtr: String,
    title: String,
    thumbnail: String,
}

pub fn initialize_db() -> Result<()> {
    let conn = Connection::open("app.db")?;
    conn.execute(
        "CREATE TABLE IF NOT EXISTS avatars (
              id INTEGER PRIMARY KEY,
              avtr TEXT NOT NULL,
              title TEXT NOT NULL,
              thumbnail TEXT NOT NULL
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

fn add_avatar(conn: &Connection, avtr: &str, title: &str, thumbnail: &str) -> Result<()> {
    conn.execute(
        "INSERT INTO avatars (avtr, title, thumbnail) VALUES (?1, ?2, ?3)",
        params![avtr, title, thumbnail],
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
    let mut stmt = conn.prepare("SELECT id, avtr, title, thumbnail FROM avatars")?;
    let avatar_iter = stmt.query_map([], |row| {
        Ok(Avatar {
            id: row.get(0)?,
            avtr: row.get(1)?,
            title: row.get(2)?,
            thumbnail: row.get(3)?,
        })
    })?;

    let mut avatars = Vec::new();
    for avatar in avatar_iter {
        avatars.push(avatar?);
    }
    Ok(avatars)
}

#[command]
pub fn add_avatar_cmd(window: Window, avtr: String, title: String, thumbnail: String) -> Result<(), String> {
    window.emit("catalog_changed", "Avatar added successfully").unwrap();
    let conn = Connection::open("app.db").map_err(|e| e.to_string())?;
    add_avatar(&conn, &avtr, &title, &thumbnail).map_err(|e| e.to_string())
}

#[command]
pub fn remove_avatar_cmd(window: Window, avtr: String) -> Result<(), String> {
    window.emit("catalog_changed", "Avatar added successfully").unwrap();
    let conn = Connection::open("app.db").map_err(|e| e.to_string())?;
    remove_avatar(&conn, &avtr).map_err(|e| e.to_string())
}

#[command]
pub fn get_all_avatars_cmd() -> Result<Vec<Avatar>, String> {
    let conn = Connection::open("app.db").map_err(|e| e.to_string())?;
    get_all_avatars(&conn).map_err(|e| e.to_string())
}

#[command]
pub fn update_auth_cookie_cmd(auth_cookie: String) -> Result<(), String> {
    let conn = Connection::open("app.db").map_err(|e| e.to_string())?;
    update_auth_cookie(&conn, &auth_cookie).map_err(|e| e.to_string())
}


#[command]
pub fn get_auth_cookie_cmd() ->  Result<Option<String>, String>{
    let conn = Connection::open("app.db").map_err(|e| e.to_string())?;
    get_auth_cookie(&conn).map_err(|e| e.to_string())
}

