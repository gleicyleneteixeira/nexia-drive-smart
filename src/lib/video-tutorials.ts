import { supabase } from "@/integrations/supabase/client";

export interface VideoTutorial {
  id: string;
  title: string;
  description: string;
  url: string;
  thumbnail_url: string;
  module: "hub" | "psicotecnico" | "teorico" | "direcao";
  sort_order: number;
  created_at: string;
}

const STORAGE_KEY = "video_tutorials";

export async function fetchVideoTutorials(): Promise<VideoTutorial[]> {
  const { data, error } = await supabase
    .from("app_settings")
    .select("value")
    .eq("key", STORAGE_KEY)
    .single();

  if (error || !data) {
    return [];
  }

  try {
    const videos = JSON.parse(data.value);
    return Array.isArray(videos) ? videos : [];
  } catch {
    return [];
  }
}

export async function saveVideoTutorials(videos: VideoTutorial[]): Promise<void> {
  const { error } = await supabase
    .from("app_settings")
    .upsert(
      {
        key: STORAGE_KEY,
        value: JSON.stringify(videos),
        updated_at: new Date().toISOString(),
      },
      { onConflict: "key" }
    );

  if (error) {
    throw error;
  }
}

export async function addVideoTutorial(video: Omit<VideoTutorial, "id" | "created_at">): Promise<VideoTutorial> {
  const videos = await fetchVideoTutorials();
  
  const newVideo: VideoTutorial = {
    ...video,
    id: crypto.randomUUID(),
    created_at: new Date().toISOString(),
  };

  videos.push(newVideo);
  await saveVideoTutorials(videos);
  
  return newVideo;
}

export async function updateVideoTutorial(id: string, updates: Partial<VideoTutorial>): Promise<void> {
  const videos = await fetchVideoTutorials();
  const index = videos.findIndex((v) => v.id === id);
  
  if (index === -1) {
    throw new Error("Video not found");
  }

  videos[index] = { ...videos[index], ...updates };
  await saveVideoTutorials(videos);
}

export async function deleteVideoTutorial(id: string): Promise<void> {
  const videos = await fetchVideoTutorials();
  const filtered = videos.filter((v) => v.id !== id);
  await saveVideoTutorials(filtered);
}

export async function reorderVideoTutorials(orderedIds: string[]): Promise<void> {
  const videos = await fetchVideoTutorials();
  const reordered = orderedIds
    .map((id) => videos.find((v) => v.id === id))
    .filter((v): v is VideoTutorial => v !== undefined)
    .map((v, i) => ({ ...v, sort_order: i }));
  
  await saveVideoTutorials(reordered);
}
