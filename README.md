# Ethiopian Orthodox Mezmur Mobile App

A full-stack React Native mobile application for browsing, streaming, and downloading Ethiopian Orthodox Mezmurs (spiritual songs).

## Features

### Authentication
- **Sign Up / Login**: Email and password authentication via Supabase
- **Profile Management**: Update username, profile picture, and password
- **Secure**: Row Level Security (RLS) policies protect user data

### Mezmur Management
- **Browse**: View all available mezmurs with beautiful card layouts
- **Categories**: Organize mezmurs by categories (Saint, Holy Days, Praise, etc.)
- **Search**: Find mezmurs by title or artist
- **Poem/Lyrics**: View lyrics for each mezmur

### Audio Features
- **Online Streaming**: Stream mezmurs directly from Supabase storage
- **Offline Download**: Download mezmurs for offline playback
- **Audio Player**: Persistent bottom player with play/pause controls
- **Progress Tracking**: Visual progress bar and time display

### Favorites
- **Save Favorites**: Mark mezmurs as favorites for quick access
- **Favorites Tab**: Dedicated tab to view all favorite mezmurs

### User Interface
- **Tab Navigation**: Easy navigation between Home, Categories, Favorites, and Profile
- **Responsive Design**: Beautiful, clean UI optimized for mobile
- **Stock Photos**: Professional images from Pexels
- **Loading States**: Smooth loading indicators and refresh controls

## Tech Stack

- **Frontend**: React Native + Expo
- **Navigation**: Expo Router (file-based routing)
- **Backend**: Supabase (PostgreSQL database)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage for audio files
- **Audio**: Expo AV for audio playback
- **File System**: Expo File System for offline downloads
- **State Management**: React Context API

## Project Structure

```
├── app/
│   ├── (auth)/           # Authentication screens
│   │   ├── login.tsx
│   │   └── signup.tsx
│   ├── (tabs)/           # Main app tabs
│   │   ├── index.tsx     # Home screen
│   │   ├── categories.tsx
│   │   ├── favorites.tsx
│   │   └── profile.tsx
│   ├── _layout.tsx       # Root layout with providers
│   └── index.tsx         # Auth routing logic
├── components/           # Reusable components
│   ├── MezmurCard.tsx
│   └── AudioPlayer.tsx
├── contexts/            # React contexts
│   ├── AuthContext.tsx
│   └── AudioContext.tsx
├── hooks/               # Custom hooks
│   └── useMezmurs.ts
├── services/            # API services
│   └── mezmurService.ts
├── types/              # TypeScript types
│   └── database.ts
└── lib/                # Configuration
    └── supabase.ts
```

## Database Schema

### Tables

1. **profiles** - User profile information
   - Links to Supabase auth.users
   - Stores username and avatar_url

2. **categories** - Mezmur categories
   - Name, description, icon

3. **mezmurs** - Mezmur songs
   - Title, artist, audio_url, poem (lyrics)
   - Links to categories
   - Includes duration, image_url, play_count

4. **favorites** - User favorites
   - Links users to their favorite mezmurs

5. **downloads** - Offline downloads tracking
   - Tracks which mezmurs are downloaded locally

### Security

- Row Level Security (RLS) enabled on all tables
- Users can only access their own favorites and downloads
- Public read access for mezmurs and categories
- Authenticated users required for most operations

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Expo CLI
- Supabase account (already configured)

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. The app is already connected to Supabase via environment variables in `.env`

### Adding Real Audio Files

The seed data includes placeholder audio URLs. To add real mezmur audio files:

1. Upload audio files to Supabase Storage
2. Get the public URLs for each file
3. Update the `audio_url` field in the `mezmurs` table
4. Or use the Supabase dashboard to manage files

Example Supabase Storage structure:
```
mezmurs/
  ├── saint/
  │   └── mezmur1.mp3
  ├── praise/
  │   └── mezmur2.mp3
  └── holy-days/
      └── mezmur3.mp3
```

### Adding Categories

Insert new categories via SQL:

```sql
INSERT INTO categories (name, description, icon)
VALUES ('New Category', 'Description', 'icon-name');
```

### Adding Mezmurs

Insert new mezmurs via SQL:

```sql
INSERT INTO mezmurs (title, artist, category_id, audio_url, poem, duration, image_url)
VALUES (
  'Mezmur Title',
  'Artist Name',
  'category-uuid',
  'https://your-supabase-url/storage/v1/object/public/mezmurs/song.mp3',
  'Lyrics/poem content',
  240000,
  'https://images.pexels.com/photos/123456/image.jpg'
);
```

## Available Scripts

- `npm run dev` - Start Expo development server
- `npm run build:web` - Build for web
- `npm run typecheck` - Run TypeScript type checking
- `npm run lint` - Run ESLint

## Features to Implement

Some ideas for future enhancements:

1. **Playlists**: Create custom playlists
2. **Shuffle/Repeat**: Add shuffle and repeat modes to player
3. **Share**: Share mezmurs with friends
4. **Comments**: Allow users to comment on mezmurs
5. **Lyrics Sync**: Synchronized lyrics display during playback
6. **Dark Mode**: Add dark theme support
7. **Push Notifications**: Notify users of new mezmurs
8. **Social Features**: Follow other users, see what they're listening to

## Notes

- Sample data includes placeholder audio from SoundHelix (public domain)
- Replace with actual Ethiopian Orthodox Mezmur recordings
- Images are from Pexels stock photos
- Poems/lyrics are placeholders in Amharic

## License

This is a demonstration project for educational purposes.
