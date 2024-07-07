use reqwest::Client;
use reqwest::header::{HeaderMap, HeaderValue, COOKIE};
use serde_json::Value; 
use tauri::command;
use super::cookie_headers::build_headers;
use crate::db::get_auth_cookie_cmd;

#[command]
pub async fn check_auth() -> Result<String, String> {
    let client = Client::new();

    let auth_cookie = match get_auth_cookie_cmd() {
        Ok(Some(cookie)) => cookie,
        _ => String::new(),
    };

    let headers = build_headers(&auth_cookie);

    let response = client.get("https://vrchat.com/api/1/auth/user")
        .headers(headers)
        .send()
        .await
        .map_err(|err| err.to_string())?;

    let status_code = response.status().to_string();

    Ok(status_code)
}


#[command]
pub async fn get_user_id() -> Result<String, String> {
    let client = Client::new();

    let auth_cookie = match get_auth_cookie_cmd() {
        Ok(Some(cookie)) => cookie,
        _ => String::new(),
    };

    let headers = build_headers(&auth_cookie);

    let response = client.get("https://vrchat.com/api/1/auth/user")
        .headers(headers)
        .send()
        .await
        .map_err(|err| err.to_string())?;

    let body = response.text().await.unwrap_or_else(|_| String::from(""));
    let json_data: Value = serde_json::from_str(&body).map_err(|err| err.to_string())?;
    let user_id = json_data["id"].as_str().unwrap_or_default();

    Ok(user_id.to_string())
}


#[command]
pub async fn login(auth_string: String) -> Result<(String, Vec<String>), String> {
    let client = reqwest::Client::new();

    let auth_header_value = format!("Basic {}", auth_string);
    let mut headers = HeaderMap::new();

    headers.insert(reqwest::header::USER_AGENT, "KotatsuApp".parse().unwrap());
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
pub async fn verify_two_factor(code: String, auth_cookie: String) -> Result<Vec<String>, String> {
    let client = Client::new();

    let mut headers = HeaderMap::new();

    headers.insert(reqwest::header::USER_AGENT, "KotatsuApp".parse().unwrap());
    headers.insert(COOKIE, HeaderValue::from_str(&auth_cookie).unwrap());

    let body = serde_json::json!({
        "code": code
    });

    let response = client.post("https://vrchat.com/api/1/auth/twofactorauth/emailotp/verify")
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
