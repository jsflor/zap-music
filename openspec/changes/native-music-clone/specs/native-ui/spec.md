## Purpose

Delivers a high-fidelity clone of the macOS Music app interface, featuring translucent sidebar navigation, LCD top player bar, album grid, song tables, dynamic full-screen lyrics, and MiniPlayer.

## ADDED Requirements

### Requirement: macOS Music Top LCD Playback Toolbar
The system SHALL display a top header bar with transport controls, volume slider, central LCD playback capsule, and utility toggles.

#### Scenario: Displaying current playing track in LCD capsule
- **WHEN** a track is playing
- **THEN** the central LCD capsule displays the 36x36px album artwork thumbnail, track title, artist name, and a responsive scrubber with elapsed and remaining time

### Requirement: Translucent Sidebar Navigation
The system SHALL present a sidebar structured with Library (Recently Added, Artists, Albums, Songs, Made For You) and Playlists sections with native blur effects.

#### Scenario: User navigates to Albums view
- **WHEN** the user clicks "Albums" in the sidebar
- **THEN** the main content area renders a responsive grid of square album covers with titles and artist names

### Requirement: Song List Table View
The system SHALL display tracks in a dense, customizable table view supporting sorting by title, artist, album, duration, and play count.

#### Scenario: Double clicking a song in table
- **WHEN** the user double clicks any row in the Songs table
- **THEN** that track immediately plays and the remaining visible songs are enqueued into the play queue

### Requirement: Full-Screen Time-Synced Lyrics with Mesh Gradient
The system SHALL provide an immersive full-screen view displaying time-synced lyrics over an animated, blurred background matching the album artwork.

#### Scenario: Toggling lyrics view
- **WHEN** the user clicks the Lyrics button on the player toolbar
- **THEN** the application transitions into full-screen lyric mode where lyrics auto-scroll to the current playback timestamp over a dynamic color mesh

### Requirement: Detachable MiniPlayer HUD
The system SHALL support switching into a compact floating MiniPlayer window containing essential playback controls and album artwork.

#### Scenario: Switching to MiniPlayer
- **WHEN** the user selects the MiniPlayer toggle
- **THEN** the window transforms into a compact floating HUD sized to show the cover art, track info, and playback controls
