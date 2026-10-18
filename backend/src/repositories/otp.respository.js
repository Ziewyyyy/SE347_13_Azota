const db = require('../config/database');

class OtpRespository {
  async saveOtp(email, otpCode, ttlMinutes = 5) {
    const expiresAt = new Date(Date.now() + ttlMinutes * 60 * 1000);
    const res = await db.query(
      `INSERT INTO registration_otps ("email", "otpCode", "expiresAt")
       VALUES ($1, $2, $3)
       ON CONFLICT ("email") DO UPDATE 
       SET "otpCode" = EXCLUDED."otpCode", "expiresAt" = EXCLUDED."expiresAt", "createdAt" = CURRENT_TIMESTAMP
       RETURNING *`,
      [email, otpCode, expiresAt]
    );
    return res.rows[0];
  }

  async verifyOtp(email, otpCode) {
    const res = await db.query(
      `SELECT * FROM registration_otps 
       WHERE "email" = $1 AND "otpCode" = $2 AND "expiresAt" > CURRENT_TIMESTAMP`,
      [email, otpCode]
    );
    return res.rows[0];
  }

  async deleteOtp(email) {
    await db.query(`DELETE FROM registration_otps WHERE "email" = $1`, [email]);
  }
}

module.exports = new OtpRespository();
