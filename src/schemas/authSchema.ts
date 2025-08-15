import { z } from 'zod';

export const loginSchema = z.object({
  username: z
    .string()
    .min(4, 'Tên đăng nhập phải có ít nhất 4 ký tự')
    .max(15, 'Tên đăng nhập không được vượt quá 15 ký tự')
    .regex(
      /^[a-z0-9]+$/,
      'Tên đăng nhập chỉ được chứa chữ thường và số'
    ),
  password: z
    .string()
    .min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
    .max(40, 'Mật khẩu không được vượt quá 40 ký tự')
    .regex(
      /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 số và 1 ký tự đặc biệt'
    ),
  rememberMe: z.boolean().default(false),
});

export type LoginFormData = z.infer<typeof loginSchema>;
