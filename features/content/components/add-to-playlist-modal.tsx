import { usePlaylists } from '@/features/playlist/hooks/usePlaylist';
import { Button, Dialog, DialogContent, Input, Label, Typography } from '@/shared/ui';
import { ListVideo, Plus, Search, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { Playlist } from '@/features/playlist/types';

interface AddToPlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddToPlaylist: (playlistId: string) => void;
  onCreatePlaylist: (name: string, description: string) => void;
  selectedCount: number;
}

export function AddToPlaylistModal({
  isOpen,
  onClose,
  onAddToPlaylist,
  onCreatePlaylist,
  selectedCount,
}: AddToPlaylistModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [newPlaylistDescription, setNewPlaylistDescription] = useState('');

  // Get playlists
  const { data: playlists, isLoading } = usePlaylists();

  // Filter playlists by search
  const filteredPlaylists = useMemo(() => {
    if (!playlists) return [];
    if (!searchQuery.trim()) return playlists;

    const query = searchQuery.toLowerCase();
    return playlists.filter((playlist) => playlist.name.toLowerCase().includes(query));
  }, [playlists, searchQuery]);

  const handleClose = () => {
    setSearchQuery('');
    setShowCreateForm(false);
    setNewPlaylistName('');
    setNewPlaylistDescription('');
    onClose();
  };

  const handleAddToPlaylist = (playlist: Playlist) => {
    onAddToPlaylist(playlist.id);
    handleClose();
  };

  const handleCreateNewPlaylist = () => {
    if (!newPlaylistName.trim()) return;

    onCreatePlaylist(newPlaylistName.trim(), newPlaylistDescription.trim());
    handleClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl border-white/20 bg-black p-0">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 p-6">
          <div>
            <Typography variant="h4" className="font-mono uppercase">
              Thêm Vào Playlist
            </Typography>
            <Typography variant="small" className="mt-1 font-mono text-zinc-500">
              {selectedCount} video đã chọn
            </Typography>
          </div>
        </div>

        {/* Content */}
        {!showCreateForm ? (
          <>
            {/* Search & Create Button */}
            <div className="space-y-4 border-b border-white/10 p-6">
              <div className="relative">
                <Search className="absolute top-2.5 left-3 h-4 w-4 text-zinc-500" />
                <Input
                  placeholder="Tìm kiếm playlist..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="border-white/20 bg-zinc-900 pl-10 font-mono text-white"
                />
              </div>

              <Button
                onClick={() => setShowCreateForm(true)}
                className="w-full border-white bg-white font-mono text-sm text-black uppercase hover:bg-zinc-200"
              >
                <Plus size={16} className="mr-2" />
                Tạo Playlist Mới
              </Button>
            </div>

            {/* Playlist List */}
            <div className="max-h-96 overflow-y-auto p-6">
              {isLoading && (
                <div className="flex justify-center py-8">
                  <Typography variant="small" className="font-mono text-zinc-500">
                    Đang tải...
                  </Typography>
                </div>
              )}

              {!isLoading && filteredPlaylists.length === 0 && (
                <div className="flex flex-col items-center justify-center py-8">
                  <ListVideo className="mb-2 h-12 w-12 text-zinc-700" />
                  <Typography variant="small" className="font-mono text-zinc-500">
                    {searchQuery ? 'Không tìm thấy playlist' : 'Chưa có playlist'}
                  </Typography>
                </div>
              )}

              {!isLoading && filteredPlaylists.length > 0 && (
                <div className="space-y-2">
                  {filteredPlaylists.map((playlist) => (
                    <button
                      key={playlist.id}
                      type="button"
                      onClick={() => handleAddToPlaylist(playlist)}
                      className="group flex w-full items-center gap-4 border border-white/10 bg-zinc-900 p-4 text-left transition-all hover:border-white/30 hover:bg-zinc-800"
                    >
                      {/* Thumbnail */}
                      <div className="h-16 w-28 flex-shrink-0 overflow-hidden bg-black">
                        {playlist.thumbnail_url ? (
                          <img
                            src={playlist.thumbnail_url}
                            alt={playlist.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">
                            <ListVideo className="h-8 w-8 text-zinc-700" />
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 overflow-hidden">
                        <Typography className="line-clamp-1 font-mono text-sm text-white">
                          {playlist.name}
                        </Typography>
                        <div className="mt-1 flex items-center gap-3">
                          <Typography variant="tiny" className="font-mono text-zinc-500">
                            {playlist.video_count} video
                          </Typography>
                          {playlist.description && (
                            <Typography
                              variant="tiny"
                              className="line-clamp-1 font-mono text-zinc-600"
                            >
                              {playlist.description}
                            </Typography>
                          )}
                        </div>
                      </div>

                      {/* Add Icon */}
                      <div className="flex h-8 w-8 items-center justify-center border border-white/20 bg-transparent text-white opacity-0 transition-opacity group-hover:opacity-100">
                        <Plus size={14} />
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </>
        ) : (
          /* Create Playlist Form */
          <div className="space-y-6 p-6">
            {/* Name */}
            <div className="space-y-2">
              <Label
                htmlFor="new-playlist-name"
                className="font-mono text-xs text-zinc-400 uppercase"
              >
                Tên Playlist *
              </Label>
              <Input
                id="new-playlist-name"
                placeholder="Nhập tên playlist..."
                value={newPlaylistName}
                onChange={(e) => setNewPlaylistName(e.target.value)}
                className="border-white/20 bg-zinc-900 font-mono text-white"
                autoFocus
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label
                htmlFor="new-playlist-description"
                className="font-mono text-xs text-zinc-400 uppercase"
              >
                Mô Tả
              </Label>
              <Input
                id="new-playlist-description"
                placeholder="Nhập mô tả playlist..."
                value={newPlaylistDescription}
                onChange={(e) => setNewPlaylistDescription(e.target.value)}
                className="border-white/20 bg-zinc-900 font-mono text-white"
              />
            </div>

            {/* Info */}
            <div className="flex items-center gap-2 border-t border-white/10 pt-4">
              <Typography variant="small" className="font-mono text-zinc-500">
                {selectedCount} video sẽ được thêm vào playlist mới
              </Typography>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 border-t border-white/10 pt-6">
              <Button
                variant="ghost"
                onClick={() => setShowCreateForm(false)}
                className="font-mono uppercase hover:bg-white/10"
              >
                Quay Lại
              </Button>
              <Button
                onClick={handleCreateNewPlaylist}
                disabled={!newPlaylistName.trim()}
                className="border-white bg-white font-mono text-black uppercase hover:bg-zinc-200 disabled:opacity-50"
              >
                Tạo & Thêm Video
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
