use reqwest::Client;
use tauri::command;
use super::cookie_headers::build_headers;
use crate::db::{get_all_avatars, get_existing_avatar, add_avatar, remove_avatar, update_avatar_last_used, Avatar};
use tauri::Window;


#[command]
pub fn add_avatar_cmd(window: Window, avtr: String, title: String, thumbnailUrl: String) -> Result<(), String> {
    window.emit("catalog_changed", "Avatar added successfully").unwrap();
    add_avatar(&avtr, &title, &thumbnailUrl).map_err(|e| e.to_string())
}

#[command]
pub fn update_avatar_last_used_cmd(avtr: String) -> Result<(), String> {
    update_avatar_last_used(&avtr).map_err(|e| e.to_string())
}


#[command]
pub fn remove_avatar_cmd(window: Window, avtr: String) -> Result<(), String> {
    window.emit("catalog_changed", "Avatar removed successfully").unwrap();
    remove_avatar(&avtr).map_err(|e| e.to_string())
}

#[command]
pub fn get_all_avatars_cmd() -> Result<Vec<Avatar>, String> {
    get_all_avatars().map_err(|e| e.to_string())
}

#[command]
pub fn get_existing_avatar_cmd(avtr: String) -> Result<Option<Avatar>, String> {
    get_existing_avatar(&avtr).map_err(|e| e.to_string())
}

#[command]
pub async fn change_avatar(window: Window, avatar_id: String) -> Result<bool, String> {
    let client = Client::new();
    
    let headers = build_headers();

    let url = format!("https://vrchat.com/api/1/avatars/{}/select", avatar_id);
    let response = client.put(&url)
        .headers(headers)
        .send()
        .await
        .map_err(|err| err.to_string())?;

    let status = response.status();

    if status.is_success() {
        window.emit("avatar_changed", "Avatar changed successfully").unwrap();
        Ok(true)
    } else {
        Ok(false)
    }
}

#[command]
pub async fn get_favorite_avatars(category: String) -> Result<String, String> {
    let client = Client::new();
    
    let headers = build_headers();
    let url = format!("https://vrchat.com/api/1/avatars/favorites?tag={}", category);
    let response = client.get(url)
        .headers(headers)
        .send()
        .await
        .map_err(|err| err.to_string())?;

    let body = response.text().await.unwrap_or_else(|_| String::from(""));
    Ok(body)
}

#[command]
pub async fn get_uploaded_avatars() -> Result<String, String> {
    let client = Client::new();
    
    let headers = build_headers();
    let url = "https://vrchat.com/api/1/avatars?releaseStatus=all&organization=vrchat&sort=updated&order=descending&user=me&n=101";
    let response = client.get(url)
        .headers(headers)
        .send()
        .await
        .map_err(|err| err.to_string())?;

    let body = response.text().await.unwrap_or_else(|_| String::from(""));
    Ok(body)
}

#[command]
pub async fn get_current_avatar(user_id: String) -> Result<String, String> {
    let client = Client::new();
    
    let headers = build_headers();
    let url = format!("https://vrchat.com/api/1/users/{}/avatar", user_id);
    let response = client.get(&url)
        .headers(headers)
        .send()
        .await
        .map_err(|err| err.to_string())?;

    let body = response.text().await.unwrap_or_else(|_| String::from(""));
    Ok(body)
}

#[command]
pub async fn get_avatar_info(avtr: String) -> Result<String, String> {
    let client = Client::new();

    let headers = build_headers();
    let url = format!("https://vrchat.com/api/1/avatars/{}/", avtr);
    let response = client.get(&url)
        .headers(headers)
        .send()
        .await
        .map_err(|err| err.to_string())?;

    let body = response.text().await.unwrap_or_else(|_| String::from(""));
    Ok(body)
}

#[command]
pub async fn search_avatars(search_query: String) -> Result<String, String> {
    let client = Client::new();

    let url = format!("https://avatarsearch.cc/Avatar/AvatarSearcher?name={}", search_query);
    let response = client.get(&url)
        .send()
        .await
        .map_err(|err| err.to_string())?;

    let body = response.text().await.unwrap_or_else(|_| String::from(""));
    Ok(body)
}


