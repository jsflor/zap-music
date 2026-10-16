## Purpose

Maintains an embedded SQLite catalog of songs, albums, artists, and playlists, supporting instant full-text filtering and playlist curation.

## ADDED Requirements

### Requirement: Local Unified Library Indexing
The system SHALL index all tracks, albums, and artists from connected sources into an embedded SQLite database.

#### Scenario: Instant search query
- **WHEN** the user types "Miles Davis" into the search field
- **THEN** the system returns matching artists, albums, and tracks from the local SQLite index within 50 milliseconds

### Requirement: Custom and Smart Playlist Management
The system SHALL allow users to create, rename, delete, and curate playlists with custom descriptions and artwork.

#### Scenario: Creating a playlist
- **WHEN** the user creates a new playlist titled "Chill Vibes" and adds five tracks
- **THEN** the playlist is persisted in the database and displayed under the Playlists section in the sidebar

#### Scenario: Favoriting a track
- **WHEN** the user clicks the favorite star/heart button on a track
- **THEN** the track's favorited status toggles and updates across all views and syncs to any connected upstream provider that supports favorites
