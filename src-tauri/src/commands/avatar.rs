use reqwest::Client;
use tauri::command;
use super::cookie_headers::build_headers;
use crate::db::get_auth_cookie_cmd;
use tauri::Window;

#[command]
pub async fn change_avatar(window: Window, avatar_id: String) -> Result<bool, String> {
    let client = Client::new();

    let auth_cookie = match get_auth_cookie_cmd() {
        Ok(Some(cookie)) => cookie,
        _ => String::new(),
    };
    
    let headers = build_headers(&auth_cookie);

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
pub async fn get_favorite_avatars() -> Result<String, String> {
    let client = Client::new();

    let auth_cookie = match get_auth_cookie_cmd() {
        Ok(Some(cookie)) => cookie,
        _ => String::new(),
    };
    
    let headers = build_headers(&auth_cookie);
    let url = "https://vrchat.com/api/1/avatars/favorites";
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

    let auth_cookie = match get_auth_cookie_cmd() {
        Ok(Some(cookie)) => cookie,
        _ => String::new(),
    };
    
    let headers = build_headers(&auth_cookie);
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

    let auth_cookie = match get_auth_cookie_cmd() {
        Ok(Some(cookie)) => cookie,
        _ => String::new(),
    };
    
    let headers = build_headers(&auth_cookie);
    let url = format!("https://vrchat.com/api/1/avatars/{}/", avtr);
    let response = client.get(&url)
        .headers(headers)
        .send()
        .await
        .map_err(|err| err.to_string())?;

    let body = response.text().await.unwrap_or_else(|_| String::from(""));
    Ok(body)
}


