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
            commands::auth::update_auth_cookie_cmd,
            commands::avatar::change_avatar,
            commands::avatar::get_favorite_avatars,
            commands::avatar::get_current_avatar,
            commands::avatar::get_uploaded_avatars,
            commands::avatar::get_avatar_info,
            commands::avatar::search_avatars,
            commands::avatar::add_avatar_cmd,
            commands::avatar::remove_avatar_cmd,
            commands::avatar::get_all_avatars_cmd,
            commands::avatar::get_existing_avatar_cmd,
            commands::avatar::update_avatar_last_used_cmd
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
