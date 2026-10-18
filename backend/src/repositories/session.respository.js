const db = require('../config/database');

class SessionRespository {
    async createSession({ userId, refreshTokenHash, expiresAt }) {
        const res = await db.query(
            'INSERT INTO user_sessions ("userId", "refreshTokenHash", "expiresAt") VALUES ($1, $2, $3) RETURNING *',
            [userId, refreshTokenHash, expiresAt]
        );
        return res.rows[0];
    }

    async findValidSession(tokenHash) {
        const res = await db.query(
            'SELECT * FROM user_sessions WHERE "refreshTokenHash" = $1 AND "revokedAt" IS NULL AND "expiresAt" > CURRENT_TIMESTAMP',
            [tokenHash]
        );
        return res.rows[0];
    }

    async revokeSession(tokenHash) {
        await db.query(
            'UPDATE user_sessions SET "revokedAt" = CURRENT_TIMESTAMP WHERE "refreshTokenHash" = $1',
            [tokenHash]
        );
    }
}

module.exports = new SessionRespository();
