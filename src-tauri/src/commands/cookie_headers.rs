use reqwest::header::{HeaderMap, HeaderValue, COOKIE};

pub fn build_headers(auth_cookie: &str) -> HeaderMap {
    let cookies: Vec<&str> = auth_cookie.split(";").collect();
    let mut headers = HeaderMap::new();

    headers.insert(reqwest::header::USER_AGENT, "YourAppName".parse().unwrap());

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
