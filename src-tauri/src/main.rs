#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod commands;
mod db;


fn main() {
    db::initialize_db().expect("Failed to initialize the database");

    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            commands::auth::check_auth,
            commands::auth::login,
            commands::auth::get_user_info,
            commands::auth::verify_two_factor,
            commands::avatar::change_avatar,
            commands::avatar::get_favorite_avatars,
            commands::avatar::get_current_avatar,
            commands::avatar::get_avatar_info,
            commands::avatar::search_avatars,
            db::update_auth_cookie_cmd,
            db::get_auth_cookie_cmd,
            db::add_avatar_cmd,
            db::remove_avatar_cmd,
            db::get_all_avatars_cmd,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
