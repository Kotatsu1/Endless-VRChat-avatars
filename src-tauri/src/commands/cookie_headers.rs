use reqwest::header::{HeaderMap, HeaderValue, COOKIE};
use crate::db::{get_auth_cookie};


pub fn build_headers() -> HeaderMap {
    let auth_cookie = match get_auth_cookie().map_err(|e| e.to_string()) {
        Ok(Some(cookie)) => cookie,
        _ => String::new(),
    };
    let cookies: Vec<&str> = auth_cookie.split(";").collect();
    let mut headers = HeaderMap::new();

    headers.insert(reqwest::header::USER_AGENT, "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:123.0) Gecko/20100101 Firefox/123.0".parse().unwrap());

    for cookie in cookies {
        let mut parts = cookie.split("=");
        if let (Some(name), Some(value)) = (parts.next(), parts.next()) {
            headers.insert(
                COOKIE,
                HeaderValue::from_str(&format!("{}={}", name.trim(), value.trim())).unwrap(),
            );
        }
    }

    headers
}
