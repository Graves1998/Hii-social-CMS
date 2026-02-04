import z from 'zod';

export const createPlaylistSchema = z.object({
  name: z.string().min(1, 'Tên playlist không được để trống'),
  description: z.string().optional(),
  video_ids: z.array(z.string()).optional(),
  thumbnail: z.string().min(1, 'Ảnh đại diện không được để trống'),
});

export type CreatePlaylistSchema = z.infer<typeof createPlaylistSchema>;
