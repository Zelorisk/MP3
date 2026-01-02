mod discord;

use discord::DiscordPresence;
use std::sync::Arc;

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn init_discord(discord: tauri::State<Arc<DiscordPresence>>) -> Result<(), String> {
    discord.connect()
}

#[tauri::command]
fn update_discord_presence(
    discord: tauri::State<Arc<DiscordPresence>>,
    song_title: String,
    artist: String,
    album: String,
    duration: i64,
    current_time: i64,
    is_playing: bool,
) -> Result<(), String> {
    discord.update_presence(
        &song_title,
        &artist,
        &album,
        duration,
        current_time,
        is_playing,
    )
}

#[tauri::command]
fn clear_discord_presence(discord: tauri::State<Arc<DiscordPresence>>) -> Result<(), String> {
    discord.clear_presence()
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let discord = Arc::new(DiscordPresence::new());

    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .manage(discord)
        .invoke_handler(tauri::generate_handler![
            greet,
            init_discord,
            update_discord_presence,
            clear_discord_presence
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
