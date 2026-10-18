const {z}=require('zod');
const ROLES=require('../constants/roles');

const registerSchema = z.object({
    email: z.string().email('Email không đúng định dạng'),
    password: z.string().min(8, 'Password phải từ 8 ký tự trở lên'),
    fullName: z.string().min(2, 'Họ và tên không được để trống'),
    role: z.enum([ROLES.STUDENT, ROLES.TEACHER], { errorMap: () => ({ message: 'Vai trò phải là STUDENT hoặc TEACHER' }) }),
    code: z.string().optional(),
    otp: z.string().optional(),
});

const loginSchema=z.object({
    email: z.string().email('Email không hợp lệ'),
    password: z.string().min(1, 'Mật khẩu không được để trống'),
});

const changePasswordSchema=z.object({
    oldPassword: z.string().min(1, 'Vui lòng nhập mật khẩu cũ'),
    newPassword: z.string().min(8, 'Mật khẩu mới phải từ 8 ký tự trở lên'),
});
module.exports={registerSchema,loginSchema,changePasswordSchema};