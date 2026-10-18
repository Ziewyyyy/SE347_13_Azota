const userRepo = require('../repositories/user.respository');
const sessionRepo = require('../repositories/session.respository');
const otpRepo = require('../repositories/otp.respository');

const { hashPassword, comparePassword } = require('../utils/hash.util');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require('../utils/jwt.util');
const { generateOtp } = require('../utils/otp.util');
const { sendOtpEmail } = require('../utils/email.util');
const { uploadToCloudinary } = require('../config/cloudinary');

const USER_STATUS = require('../constants/user-status');

class AuthService {
    async sendRegisterOtp(email) {
        if (!email) {
            const error = new Error('Email không được để trống');
            error.statusCode = 400;
            throw error;
        }

        const existing = await userRepo.findByEmail(email);
        if (existing) {
            const error = new Error('Email đã được đăng ký');
            error.statusCode = 409;
            throw error;
        }

        const otpCode = generateOtp();
        await otpRepo.saveOtp(email, otpCode, 5);
        await sendOtpEmail(email, otpCode);

        return {
            message: 'Mã xác thực OTP đã được gửi đến email của bạn'
        };
    }

    async register({ email, otp, password, fullName, role, code }) {
        const existing = await userRepo.findByEmail(email);
        if (existing) {
            const error = new Error('Email đã được đăng ký.');
            error.statusCode = 409;
            throw error;
        }

        if (otp) {
            const validOtp = await otpRepo.verifyOtp(email, otp);
            if (!validOtp) {
                const error = new Error('Mã OTP không chính xác hoặc đã hết hạn');
                error.statusCode = 400;
                throw error;
            }
        }

        const passwordHash = await hashPassword(password);
        const user = await userRepo.registerUserWithProfile({
            email,
            passwordHash,
            fullName,
            role,
            code
        });

        if (otp) {
            await otpRepo.deleteOtp(email);
        }

        return { user };
    }

    async login({ email, password }) {
        const user = await userRepo.findByEmail(email);
        if (!user) {
            const error = new Error('Tài khoản hoặc mật khẩu không chính xác');
            error.statusCode = 401;
            throw error;
        }
        if (user.status !== USER_STATUS.ACTIVE) {
            const error = new Error('Tài khoản đã bị khóa hoặc vô hiệu hóa');
            error.statusCode = 403;
            throw error;
        }
        const isMatch = await comparePassword(password, user.passwordHash || user.password_hash);
        if (!isMatch) {
            const error = new Error('Tài khoản hoặc mật khẩu không chính xác');
            error.statusCode = 401;
            throw error;
        }
        const payload = { userId: user.userId, email: user.email, role: user.role };
        const accessToken = generateAccessToken(payload);
        const refreshToken = generateRefreshToken(payload);

        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        await sessionRepo.createSession({ userId: user.userId, refreshTokenHash: refreshToken, expiresAt });

        return {
            accessToken,
            refreshToken,
            user: {
                userId: user.userId,
                email: user.email,
                fullName: user.fullName,
                role: user.role,
                avatarUrl: user.avatarUrl
            }
        };
    }

    async refreshToken(refreshToken) {
        if (!refreshToken) {
            const error = new Error('Refresh Token không được để trống');
            error.statusCode = 400;
            throw error;
        }
        let payload;
        try {
            payload = verifyRefreshToken(refreshToken);
        } catch (err) {
            const error = new Error('Refresh Token hết hạn hoặc không hợp lệ');
            error.statusCode = 401;
            throw error;
        }
        const session = await sessionRepo.findValidSession(refreshToken);
        if (!session) {
            const error = new Error('Phiên đăng nhập đã bị thu hồi hoặc không tồn tại');
            error.statusCode = 401;
            throw error;
        }
        const accessToken = generateAccessToken({
            userId: payload.userId,
            email: payload.email,
            role: payload.role
        });
        return { accessToken };
    }

    async logout(refreshToken) {
        if (!refreshToken) {
            const error = new Error('Refresh Token không được để trống');
            error.statusCode = 400;
            throw error;
        }
        await sessionRepo.revokeSession(refreshToken);
        return { message: 'Đăng xuất thành công' };
    }

    async changePassword(userId, { oldPassword, newPassword }) {
        const user = await userRepo.findById(userId);
        if (!user) {
            const error = new Error('Người dùng không tồn tại');
            error.statusCode = 404;
            throw error;
        }
        const isMatch = await comparePassword(oldPassword, user.passwordHash || user.password_hash);
        if (!isMatch) {
            const error = new Error('Mật khẩu cũ không chính xác');
            error.statusCode = 400;
            throw error;
        }
        const newPasswordHash = await hashPassword(newPassword);
        await userRepo.updatePassword(userId, newPasswordHash);
        return { message: 'Đổi mật khẩu thành công' };
    }

    async updateProfile(userId, { fullName, avatarBuffer }) {
        let avatarUrl = undefined;
        if (avatarBuffer) {
            avatarUrl = await uploadToCloudinary(avatarBuffer, 'azota/avatars');
        }
        const updatedUser = await userRepo.updateProfile(userId, { fullName, avatarUrl });
        return {
            user: updatedUser,
            message: 'Cập nhật thông tin cá nhân thành công'
        };
    }

    async getMe(userId) {
        const user = await userRepo.getUserProfile(userId);
        if (!user) {
            const error = new Error('Người dùng không tồn tại');
            error.statusCode = 404;
            throw error;
        }
        return user;
    }
}

module.exports = new AuthService();