import { Button, Input, Typography } from '@/shared/ui';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from '@tanstack/react-router';
import { AlertCircle, CheckCircle2, Lock, Mail, User } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { registerSchema, type RegisterFormData } from '../schemas/auth.schema';
import { useAuthStore } from '../stores/useAuthStore';

function RegisterPageComponent() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const password = watch('password');

  // Password strength indicators
  const passwordChecks = [
    { label: 'Ít nhất 6 ký tự', valid: password?.length >= 6 },
    { label: 'Có chữ hoa', valid: /[A-Z]/.test(password || '') },
    { label: 'Có chữ thường', valid: /[a-z]/.test(password || '') },
    { label: 'Có số', valid: /[0-9]/.test(password || '') },
  ];

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    setServerError(null);

    try {
      // TODO: Call API register
      // Giả lập API call
      // eslint-disable-next-line no-promise-executor-return
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Mock user data - thay bằng response từ API
      const mockUser = {
        id: '2',
        name: data.name,
        email: data.email,
        role: 'EDITOR' as const,
      };

      login(mockUser as any, 'mock-token-456');
      navigate({ to: '/dashboard' });
    } catch (error) {
      setServerError('Đăng ký thất bại. Vui lòng thử lại.');
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
            ĐĂNG_KÝ_TÀI_KHOẢN
          </Typography>
          <Typography variant="muted" className="font-mono text-[10px] text-zinc-600 uppercase">
            Khởi tạo hồ sơ người dùng mới
          </Typography>
        </div>

        {/* Register Form */}
        <div className="border border-white/10 bg-black/50 p-8 backdrop-blur-sm">
          {serverError && (
            <div className="mb-6 flex items-center gap-2 border border-red-500/50 bg-red-950/20 p-3">
              <AlertCircle size={16} className="text-red-500" />
              <Typography variant="small" className="font-mono text-xs text-red-400">
                {serverError}
              </Typography>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Name Field */}
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="flex items-center gap-2 font-mono text-[10px] tracking-wider text-zinc-500 uppercase"
              >
                <User size={10} /> Họ và tên
              </label>
              <Input
                id="name"
                type="text"
                placeholder="Nguyễn Văn A"
                className="h-11 border-white/10 bg-transparent font-mono text-sm text-white transition-colors focus:border-white"
                {...register('name')}
              />
              {errors.name && (
                <Typography variant="small" className="font-mono text-xs text-red-400">
                  {errors.name.message}
                </Typography>
              )}
            </div>

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

              {/* Password Strength Indicators */}
              {password && (
                <div className="mt-3 space-y-1.5">
                  {passwordChecks.map((check, index) => (
                    <div key={check.label} className="flex items-center gap-2">
                      {check.valid ? (
                        <CheckCircle2 size={12} className="text-[#00ff66]" />
                      ) : (
                        <div className="h-3 w-3 rounded-full border border-zinc-700" />
                      )}
                      <Typography
                        variant="tiny"
                        className={`font-mono text-[9px] ${
                          check.valid ? 'text-[#00ff66]' : 'text-zinc-700'
                        }`}
                      >
                        {check.label}
                      </Typography>
                    </div>
                  ))}
                </div>
              )}

              {errors.password && (
                <Typography variant="small" className="font-mono text-xs text-red-400">
                  {errors.password.message}
                </Typography>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <label
                htmlFor="confirmPassword"
                className="flex items-center gap-2 font-mono text-[10px] tracking-wider text-zinc-500 uppercase"
              >
                <Lock size={10} /> Xác nhận mật khẩu
              </label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                className="h-11 border-white/10 bg-transparent font-mono text-sm text-white transition-colors focus:border-white"
                {...register('confirmPassword')}
              />
              {errors.confirmPassword && (
                <Typography variant="small" className="font-mono text-xs text-red-400">
                  {errors.confirmPassword.message}
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
                  ĐANG_XỬ_LÝ...
                </span>
              ) : (
                'KHỞI_TẠO_TÀI_KHOẢN'
              )}
            </Button>
          </form>

          {/* Login Link */}
          <div className="mt-8 border-t border-white/10 pt-6 text-center">
            <Typography variant="small" className="font-mono text-xs text-zinc-600">
              Đã có tài khoản?{' '}
              <button
                type="button"
                onClick={() => navigate({ to: '/login' })}
                className="text-white underline transition-colors hover:text-zinc-400"
              >
                Đăng nhập
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

export default RegisterPageComponent;
