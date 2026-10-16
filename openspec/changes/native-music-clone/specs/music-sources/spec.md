## Purpose

Abstracts multiple music repositories (Local Filesystem, Cloudflare R2 / S3 Object Storage, Navidrome / Subsonic servers, and Spotify) into a single unified source interface.

## ADDED Requirements

### Requirement: Local Storage Source Ingestion
The system SHALL scan selected local directories or mounted shares and extract audio metadata and embedded artwork.

#### Scenario: Local folder scan
- **WHEN** the user selects a local folder containing audio files (MP3, FLAC, M4A, WAV, AIFF, OGG)
- **THEN** the system recursively discovers files, parses tag metadata via `lofty`, extracts embedded album artwork, and updates the local catalog

### Requirement: Cloudflare R2 and S3 Object Storage Access
The system SHALL connect to S3-compatible object storage buckets using configured credentials and stream audio using HTTP Range requests.

#### Scenario: Audio streaming from R2 or S3
- **WHEN** the player requests audio from a track stored on an S3 or Cloudflare R2 bucket
- **THEN** the source provider issues HTTP Range requests to stream the audio data efficiently without downloading the complete object up front

### Requirement: Subsonic and Navidrome Server Synchronization
The system SHALL authenticate with Subsonic / Navidrome OpenSubsonic endpoints to browse collections, stream audio, and synchronize favorites.

#### Scenario: Sync with Navidrome server
- **WHEN** the user connects a Navidrome server with valid URL and token authentication
- **THEN** the system fetches artists, albums, songs, and playlists from the server and caches them locally

### Requirement: Spotify Account Connectivity
The system SHALL provide an integration path for authenticated Spotify accounts to browse libraries and stream content via Spotify Web Playback.

#### Scenario: User links Spotify account
- **WHEN** the user authorizes their Spotify Premium account via OAuth
- **THEN** the system loads the user's saved tracks and playlists and routes playback through the Spotify Web Playback SDK
