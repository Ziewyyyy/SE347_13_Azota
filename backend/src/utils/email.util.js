const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendOtpEmail = async (toEmail, otpCode) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log(`Gửi mã OTP đến: ${toEmail}`);
    console.log(`Mã OTP đăng ký của bạn là: ${otpCode} (Hết hạn sau 5 phút)`);
    return { mock: true, otpCode };
  }

  const mailOptions = {
    from: `"EduFlow" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: 'Mã xác thực đăng ký tài khoản',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <h2 style="color: #2563eb; text-align: center;">Xác thực tài khoản</h2>
        <p>Xin chào,</p>
        <p>Bạn đang tiến hành đăng ký tài khoản trên hệ thống học tập. Mã OTP xác thực của bạn là:</p>
        <div style="text-align: center; margin: 30px 0;">
          <span style="display: inline-block; font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #2563eb; background-color: #eff6ff; padding: 12px 24px; border-radius: 6px; border: 1px dashed #2563eb;">
            ${otpCode}
          </span>
        </div>
        <p style="color: #64748b; font-size: 14px;">Mã OTP này có hiệu lực trong vòng <strong>5 phút</strong>. Tuyệt đối không chia sẻ mã này cho bất kỳ ai.</p>
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
        <p style="color: #94a3b8; font-size: 12px; text-align: center;">© 2026 Learning System. All rights reserved.</p>
      </div>
    `
  };

  return transporter.sendMail(mailOptions);
};

module.exports = { sendOtpEmail };
