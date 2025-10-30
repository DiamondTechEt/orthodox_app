export interface Profile {
  id: string;
  username: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  created_at: string;
}

export interface Mezmur {
  id: string;
  title: string;
  artist: string | null;
  category_id: string | null;
  audio_url: string;
  poem: string | null;
  duration: number;
  image_url: string | null;
  play_count: number;
  created_at: string;
  updated_at: string;
  category?: Category;
}

export interface Favorite {
  id: string;
  user_id: string;
  mezmur_id: string;
  created_at: string;
  mezmur?: Mezmur;
}

export interface Download {
  id: string;
  user_id: string;
  mezmur_id: string;
  local_path: string;
  downloaded_at: string;
}
