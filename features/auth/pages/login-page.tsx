import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Lock, Mail, AlertCircle } from 'lucide-react';
import { Button, Input, Typography } from '@/shared/ui';
import { useAuthStore } from '../stores/useAuthStore';
import { loginSchema, type LoginFormData } from '../schemas/auth.schema';

function LoginPageComponent() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setServerError(null);

    try {
      // TODO: Call API login
      // Giả lập API call
      // eslint-disable-next-line no-promise-executor-return
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock user data - thay bằng response từ API
      const mockUser = {
        id: '1',
        name: 'Admin User',
        email: data.email,
        role: 'ADMIN' as const,
      };

      login(mockUser as any, 'mock-token-123');
      navigate({ to: '/dashboard' });
    } catch (error) {
      setServerError('Email hoặc mật khẩu không đúng');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#050505] p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <Typography
            variant="h1"
            className="mb-2 font-mono text-2xl font-black tracking-wider text-white uppercase"
          >
            TRUY_CẬP_HỆ_THỐNG
          </Typography>
          <Typography variant="muted" className="font-mono text-[10px] text-zinc-600 uppercase">
            Xác thực danh tính để tiếp tục
          </Typography>
        </div>

        {/* Login Form */}
        <div className="border border-white/10 bg-black/50 p-8 backdrop-blur-sm">
          {serverError && (
            <div className="mb-6 flex items-center gap-2 border border-red-500/50 bg-red-950/20 p-3">
              <AlertCircle size={16} className="text-red-500" />
              <Typography variant="small" className="font-mono text-xs text-red-400">
                {serverError}
              </Typography>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="flex items-center gap-2 font-mono text-[10px] tracking-wider text-zinc-500 uppercase"
              >
                <Mail size={10} /> Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="user@system.io"
                className="h-11 border-white/10 bg-transparent font-mono text-sm text-white transition-colors focus:border-white"
                {...register('email')}
              />
              {errors.email && (
                <Typography variant="small" className="font-mono text-xs text-red-400">
                  {errors.email.message}
                </Typography>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="flex items-center gap-2 font-mono text-[10px] tracking-wider text-zinc-500 uppercase"
              >
                <Lock size={10} /> Mật khẩu
              </label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className="h-11 border-white/10 bg-transparent font-mono text-sm text-white transition-colors focus:border-white"
                {...register('password')}
              />
              {errors.password && (
                <Typography variant="small" className="font-mono text-xs text-red-400">
                  {errors.password.message}
                </Typography>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="h-12 w-full bg-white font-mono text-xs font-bold tracking-widest text-black uppercase transition-all hover:bg-zinc-200 disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-black" />
                  XỬ_LÝ...
                </span>
              ) : (
                'ĐĂNG_NHẬP'
              )}
            </Button>
          </form>

          {/* Register Link */}
          <div className="mt-8 border-t border-white/10 pt-6 text-center">
            <Typography variant="small" className="font-mono text-xs text-zinc-600">
              Chưa có tài khoản?{' '}
              <button
                type="button"
                onClick={() => navigate({ to: '/register' })}
                className="text-white underline transition-colors hover:text-zinc-400"
              >
                Đăng ký ngay
              </button>
            </Typography>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-6 text-center">
          <Typography variant="tiny" className="font-mono text-[9px] text-zinc-700 uppercase">
            CARBON_KINETIC_SYSTEM :: v2.4.1
          </Typography>
        </div>
      </div>
    </div>
  );
}

export default LoginPageComponent;
