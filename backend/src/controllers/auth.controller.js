const authService = require('../services/auth.service');
const { registerSchema, loginSchema, changePasswordSchema } = require('../validators/auth.validator');

class AuthController {
    async sendOtp(req, res, next) {
        try {
            const { email } = req.body;
            const result = await authService.sendRegisterOtp(email);
            res.status(200).json({
                success: true,
                message: result.message
            });
        } catch (err) {
            next(err);
        }
    }

    async register(req, res, next) {
        try {
            const validatedData = registerSchema.parse(req.body);
            const result = await authService.register(validatedData);
            res.status(201).json({
                success: true,
                message: 'Đăng ký tài khoản thành công',
                data: result
            });
        } catch (err) {
            next(err);
        }
    }

    async login(req, res, next) {
        try {
            const validatedData = loginSchema.parse(req.body);
            const result = await authService.login(validatedData);
            res.status(200).json({
                success: true,
                message: 'Đăng nhập thành công',
                data: result
            });
        } catch (err) {
            next(err);
        }
    }

    async refreshToken(req, res, next) {
        try {
            const { refreshToken } = req.body;
            const result = await authService.refreshToken(refreshToken);
            res.status(200).json({
                success: true,
                message: 'Cấp mới token thành công',
                data: result
            });
        } catch (err) {
            next(err);
        }
    }

    async logout(req, res, next) {
        try {
            const { refreshToken } = req.body;
            const result = await authService.logout(refreshToken);
            res.status(200).json({
                success: true,
                message: result.message
            });
        } catch (err) {
            next(err);
        }
    }

    async changePassword(req, res, next) {
        try {
            const validatedData = changePasswordSchema.parse(req.body);
            const result = await authService.changePassword(req.user.userId, validatedData);
            res.status(200).json({
                success: true,
                message: result.message
            });
        } catch (err) {
            next(err);
        }
    }

    async updateProfile(req, res, next) {
        try {
            const userId = req.user.userId;
            const { fullName } = req.body;
            const avatarBuffer = req.file ? req.file.buffer : undefined;
            const result = await authService.updateProfile(userId, { fullName, avatarBuffer });
            res.status(200).json({
                success: true,
                message: result.message,
                data: result.user
            });
        } catch (err) {
            next(err);
        }
    }

    async getMe(req, res, next) {
        try {
            const user = await authService.getMe(req.user.userId);
            res.status(200).json({
                success: true,
                data: user
            });
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new AuthController();
