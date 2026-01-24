import { useNavigate } from '@tanstack/react-router';
import { LogOut, Settings, User, ChevronDown } from 'lucide-react';
import { toast } from '@/shared/utils/toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';
import { useLogout } from '@/features/auth/hooks';
import { useUser } from '@/features/auth/stores/useAuthStore';

/**
 * User Profile Component
 *
 * Hiển thị thông tin user hiện tại với dropdown menu
 * Style: Carbon Kinetic
 */
export function UserProfile() {
  const navigate = useNavigate();
  const user = useUser();
  const { logoutMutation } = useLogout();
  const isLoading = logoutMutation.isPending;

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success('LOGGED_OUT', {
          description: 'You have been logged out',
          duration: 2000,
        });
        navigate({ to: '/login' });
      },
      onError: () => {
        toast.error('LOGGED_OUT_FAILED', {
          description: 'Failed to log out',
          duration: 2000,
        });
      },
    });
  };

  if (!user) {
    return null;
  }

  // Get initials from name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="group flex w-full items-center gap-3 border border-white/10 bg-black/50 p-3 transition-all hover:border-white/20 hover:bg-white/5 focus:ring-1 focus:ring-white/50 focus:outline-none"
        >
          {/* Avatar */}
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center border border-white/20 bg-white/5 font-mono text-xs font-bold text-white">
            {getInitials(user.username)}
          </div>

          {/* User Info */}
          <div className="flex-1 text-left">
            <div className="font-mono text-xs font-bold tracking-wider text-white uppercase">
              {user.username}
            </div>
            <div className="font-mono text-[10px] text-zinc-500 uppercase">{user.email}</div>
          </div>

          {/* Chevron */}
          <ChevronDown
            size={12}
            className="text-zinc-500 transition-transform group-hover:text-white group-data-[state=open]:rotate-180"
          />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-60">
        <DropdownMenuLabel>ACCOUNT</DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => {
            toast.info('PROFILE', {
              description: 'Profile page coming soon',
            });
          }}
        >
          <User size={14} className="mr-2" />
          Profile
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => {
            toast.info('SETTINGS', {
              description: 'Settings page coming soon',
            });
          }}
        >
          <Settings size={14} className="mr-2" />
          Settings
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={handleLogout}
          className="text-red-400 focus:bg-red-950/20 focus:text-red-400"
          disabled={isLoading}
        >
          <LogOut size={14} className="mr-2" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
