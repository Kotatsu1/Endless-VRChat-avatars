use reqwest::Client;
use reqwest::header::{HeaderMap, HeaderValue, COOKIE};
use tauri::command;
use super::cookie_headers::build_headers;
use crate::db::{update_auth_cookie};



#[command]
pub async fn get_releases_info() -> Result<String, String> {
    let client = Client::new();

    let headers = build_headers();

    let response = client.get("https://api.github.com/repos/Kotatsu1/Endless-VRChat-avatars/releases")
        .headers(headers)
        .send()
        .await
        .map_err(|err| err.to_string())?;

    let body = response.text().await.unwrap_or_else(|_| String::from(""));
    Ok(body)
}



#[command]
pub fn update_auth_cookie_cmd(auth_cookie: String) -> Result<(), String> {
    update_auth_cookie(&auth_cookie).map_err(|e| e.to_string())
}

#[command]
pub async fn check_auth() -> Result<String, String> {
    let client = Client::new();

    let headers = build_headers();

    let response = client.get("https://vrchat.com/api/1/auth/user")
        .headers(headers)
        .send()
        .await
        .map_err(|err| err.to_string())?;

    let status_code = response.status().to_string();

    Ok(status_code)
}

#[command]
pub async fn get_user_info() -> Result<String, String> {
    let client = Client::new();

    let headers = build_headers();

    let response = client.get("https://vrchat.com/api/1/auth/user")
        .headers(headers)
        .send()
        .await
        .map_err(|err| err.to_string())?;

    let body = response.text().await.unwrap_or_else(|_| String::from(""));


    Ok(body)
}

#[command]
pub async fn login(auth_string: String) -> Result<(String, Vec<String>), String> {
    let client = reqwest::Client::new();

    let auth_header_value = format!("Basic {}", auth_string);
    let mut headers = HeaderMap::new();

    headers.insert(reqwest::header::USER_AGENT, "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:123.0) Gecko/20100101 Firefox/123.0".parse().unwrap());
    headers.insert(reqwest::header::AUTHORIZATION, auth_header_value.parse().unwrap());

    let response = client.get("https://vrchat.com/api/1/auth/user")
        .headers(headers)
        .send()
        .await
        .map_err(|err| err.to_string())?;

    let cookies: Vec<String> = response
        .cookies()
        .map(|cookie| format!("{}={}", cookie.name(), cookie.value()))
        .collect();

    let body = response.text().await.unwrap_or_else(|_| String::from(""));

    Ok((body, cookies))
}

#[command]
pub async fn verify_two_factor(code: String, auth_cookie: String, method: String) -> Result<Vec<String>, String> {
    let client = Client::new();

    let mut headers = HeaderMap::new();

    headers.insert(reqwest::header::USER_AGENT, "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:123.0) Gecko/20100101 Firefox/123.0".parse().unwrap());
    headers.insert(COOKIE, HeaderValue::from_str(&auth_cookie).unwrap());

    let body = serde_json::json!({
        "code": code
    });

    let response = client.post(format!("https://vrchat.com/api/1/auth/twofactorauth/{}/verify", method))
        .headers(headers)
        .json(&body)
        .send()
        .await
        .map_err(|err| err.to_string())?;


    let cookies: Vec<String> = response
        .cookies()
        .map(|cookie| format!("{}={}", cookie.name(), cookie.value()))
        .collect();

    Ok(cookies)
}
