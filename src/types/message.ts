export interface Message {
  id: string;
  user_id: string;
  name: string;
  text: string;
  country: string;
  flag?: string;
  favorite_song?: string;
  lat?: number;
  lng?: number;
  created_at: string;
}
