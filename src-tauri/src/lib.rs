use serde::{Deserialize, Serialize};
use std::path::Path;
use tauri::Manager;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct AudioTrackMetadata {
    pub id: String,
    pub title: String,
    pub artist: String,
    pub album: String,
    pub album_artist: Option<String>,
    pub genre: Option<String>,
    pub year: Option<u32>,
    pub track_number: Option<u32>,
    pub duration_seconds: f64,
    pub file_path: String,
    pub artwork_base64: Option<String>,
}

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! Welcome to Zap Music.", name)
}

#[tauri::command]
fn parse_audio_file(file_path: String) -> Result<AudioTrackMetadata, String> {
    use lofty::file::{AudioFile, TaggedFileExt};
use lofty::probe::Probe;
use lofty::tag::Accessor;

    let path = Path::new(&file_path);
    if !path.exists() {
        return Err(format!("File does not exist: {}", file_path));
    }

    let tagged_file = Probe::open(path)
        .map_err(|e| e.to_string())?
        .read()
        .map_err(|e| e.to_string())?;

    let properties = tagged_file.properties();
    let duration_seconds = properties.duration().as_secs_f64();

    let tag = tagged_file.primary_tag().or_else(|| tagged_file.first_tag());

    let title = tag
        .and_then(|t| t.title().map(|s| s.to_string()))
        .unwrap_or_else(|| {
            path.file_stem()
                .map(|s| s.to_string_lossy().to_string())
                .unwrap_or_else(|| "Unknown Title".to_string())
        });

    let artist = tag
        .and_then(|t| t.artist().map(|s| s.to_string()))
        .unwrap_or_else(|| "Unknown Artist".to_string());

    let album = tag
        .and_then(|t| t.album().map(|s| s.to_string()))
        .unwrap_or_else(|| "Unknown Album".to_string());

    let genre = tag.and_then(|t| t.genre().map(|s| s.to_string()));
    let year = tag.and_then(|t| t.year());
    let track_number = tag.and_then(|t| t.track());

    let mut artwork_base64 = None;
    if let Some(t) = tag {
        if let Some(picture) = t.pictures().first() {
            let encoded = base64::Engine::encode(
                &base64::engine::general_purpose::STANDARD,
                picture.data(),
            );
            let mime = picture.mime_type();
            let mime_str = match mime {
                Some(lofty::picture::MimeType::Jpeg) => "image/jpeg",
                Some(lofty::picture::MimeType::Png) => "image/png",
                _ => "image/jpeg",
            };
            artwork_base64 = Some(format!("data:{};base64,{}", mime_str, encoded));
        }
    }

    let id = format!("{:x}", md5_hash(&file_path));

    Ok(AudioTrackMetadata {
        id,
        title,
        artist,
        album,
        album_artist: None,
        genre,
        year,
        track_number,
        duration_seconds,
        file_path,
        artwork_base64,
    })
}

#[tauri::command]
fn scan_folder(folder_path: String) -> Result<Vec<AudioTrackMetadata>, String> {
    let mut tracks = Vec::new();
    let path = Path::new(&folder_path);
    if !path.is_dir() {
        return Err("Path is not a directory".to_string());
    }

    visit_dirs(path, &mut |entry| {
        let path = entry.path();
        if let Some(ext) = path.extension().and_then(|s| s.to_str()) {
            let lower = ext.to_lowercase();
            if matches!(lower.as_str(), "mp3" | "flac" | "m4a" | "wav" | "aiff" | "ogg" | "opus") {
                if let Ok(metadata) = parse_audio_file(path.to_string_lossy().to_string()) {
                    tracks.push(metadata);
                }
            }
        }
    })
    .map_err(|e| e.to_string())?;

    Ok(tracks)
}

fn visit_dirs(dir: &Path, cb: &mut dyn FnMut(&std::fs::DirEntry)) -> std::io::Result<()> {
    if dir.is_dir() {
        for entry in std::fs::read_dir(dir)? {
            let entry = entry?;
            let path = entry.path();
            if path.is_dir() {
                let _ = visit_dirs(&path, cb);
            } else {
                cb(&entry);
            }
        }
    }
    Ok(())
}

fn md5_hash(input: &str) -> u128 {
    use std::collections::hash_map::DefaultHasher;
    use std::hash::{Hash, Hasher};
    let mut s = DefaultHasher::new();
    input.hash(&mut s);
    s.finish() as u128
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_http::init())
        .invoke_handler(tauri::generate_handler![
            greet,
            parse_audio_file,
            scan_folder
        ])
        .setup(|app| {
            #[cfg(target_os = "macos")]
            {
                use tauri::TitleBarStyle;
                if let Some(window) = app.get_webview_window("main") {
                    let _ = window.set_title_bar_style(TitleBarStyle::Overlay);
                }
            }
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
