use discord_rich_presence::{activity, DiscordIpc, DiscordIpcClient};
use std::sync::Mutex;

pub struct DiscordPresence {
    client: Mutex<Option<DiscordIpcClient>>,
    client_id: String,
}

const DEFAULT_CLIENT_ID: &str = "1456601764731293911";

impl DiscordPresence {
    pub fn new() -> Self {
        Self {
            client: Mutex::new(None),
            client_id: DEFAULT_CLIENT_ID.to_string(),
        }
    }

    pub fn connect(&self) -> Result<(), String> {
        let mut client = DiscordIpcClient::new(&self.client_id)
            .map_err(|e| format!("Failed to create Discord client: {}", e))?;

        client
            .connect()
            .map_err(|e| format!("Failed to connect to Discord: {}", e))?;

        *self.client.lock().unwrap() = Some(client);
        Ok(())
    }

    pub fn is_connected(&self) -> bool {
        self.client.lock().unwrap().is_some()
    }

    pub fn reconnect(&self) -> Result<(), String> {
        self.disconnect();
        self.connect()
    }

    pub fn update_presence(
        &self,
        song_title: &str,
        artist: &str,
        album: &str,
        duration: i64,
        current_time: i64,
        is_playing: bool,
    ) -> Result<(), String> {
        let mut client_lock = self.client.lock().unwrap();

        if let Some(client) = client_lock.as_mut() {
            let now = std::time::SystemTime::now()
                .duration_since(std::time::UNIX_EPOCH)
                .unwrap()
                .as_secs() as i64;

            let mut activity_builder = activity::Activity::new().state(song_title).assets(
                activity::Assets::new()
                    .large_image("music_icon")
                    .large_text(album),
            );

            if is_playing && duration > 0 {
                let start_time = now - current_time;
                let end_time = now + (duration - current_time);
                activity_builder = activity_builder
                    .timestamps(activity::Timestamps::new().start(start_time).end(end_time));
            }

            client
                .set_activity(activity_builder)
                .map_err(|e| format!("Failed to set activity: {}", e))?;
        }

        Ok(())
    }

    pub fn clear_presence(&self) -> Result<(), String> {
        let mut client_lock = self.client.lock().unwrap();

        if let Some(client) = client_lock.as_mut() {
            client
                .clear_activity()
                .map_err(|e| format!("Failed to clear activity: {}", e))?;
        }

        Ok(())
    }

    pub fn disconnect(&self) {
        let mut client_lock = self.client.lock().unwrap();

        if let Some(mut client) = client_lock.take() {
            let _ = client.close();
        }
    }
}
