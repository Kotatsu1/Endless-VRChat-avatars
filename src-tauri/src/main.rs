#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod commands;
mod db;

use commands::auth::check_auth;
use commands::auth::login;
use commands::auth::get_user_id;
use commands::auth::verify_two_factor;
use commands::avatar::change_avatar;
use commands::avatar::get_favorite_avatars;
use commands::avatar::get_current_avatar;
use commands::avatar::get_avatar_info;
use db::initialize_db;
use db::add_avatar_cmd;
use db::remove_avatar_cmd;
use db::get_all_avatars_cmd;
use db::update_auth_cookie_cmd;
use db::get_auth_cookie_cmd;

fn main() {
    initialize_db().expect("Failed to initialize the database");

    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            check_auth,
            login,
            get_user_id,
            update_auth_cookie_cmd,
            get_auth_cookie_cmd,
            verify_two_factor,
            change_avatar,
            get_favorite_avatars,
            get_current_avatar,
            get_avatar_info,
            add_avatar_cmd,
            remove_avatar_cmd,
            get_all_avatars_cmd,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
