const db = require('../config/database');

class UserRespository {
    async findByEmail(email) {
        const res = await db.query('SELECT * FROM users WHERE "email" = $1', [email]);
        return res.rows[0];
    }

    async findById(userId) {
        const res = await db.query(
            'SELECT * FROM users WHERE "userId" = $1',
            [userId]
        );
        return res.rows[0];
    }

    async registerUserWithProfile({ email, passwordHash, fullName, role, code }) {
        const client = await db.pool.connect();
        try {
            await client.query('BEGIN');

            const userRes = await client.query(
                `INSERT INTO users ("email", "passwordHash", "fullName", "role")
                 VALUES ($1, $2, $3, $4)
                 RETURNING "userId", "email", "fullName", "role", "status", "createdAt"`,
                [email, passwordHash, fullName, role]
            );
            const user = userRes.rows[0];

            if (role === 'STUDENT') {
                await client.query(
                    `INSERT INTO students ("userId", "studentCode") VALUES ($1, $2)`,
                    [user.userId, code || null]
                );
            } else if (role === 'TEACHER') {
                await client.query(
                    `INSERT INTO teachers ("userId", "teacherCode") VALUES ($1, $2)`,
                    [user.userId, code || null]
                );
            }

            await client.query('COMMIT');
            return user;
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    async updatePassword(userId, newPasswordHash) {
        await db.query(
            'UPDATE users SET "passwordHash" = $1, "updatedAt" = CURRENT_TIMESTAMP WHERE "userId" = $2',
            [newPasswordHash, userId]
        );
    }

    async updateProfile(userId, { fullName, avatarUrl }) {
        const fields = [];
        const values = [];
        let index = 1;

        if (fullName) {
            fields.push(`"fullName" = $${index++}`);
            values.push(fullName);
        }
        if (avatarUrl) {
            fields.push(`"avatarUrl" = $${index++}`);
            values.push(avatarUrl);
        }

        fields.push(`"updatedAt" = CURRENT_TIMESTAMP`);
        values.push(userId);

        const res = await db.query(
            `UPDATE users SET ${fields.join(', ')} WHERE "userId" = $${index}
             RETURNING "userId", "email", "fullName", "avatarUrl", "role", "status", "updatedAt"`,
            values
        );
        return res.rows[0];
    }

    async getUserProfile(userId) {
        const res = await db.query(
            `SELECT u."userId", u."email", u."fullName", u."avatarUrl", u."role", u."status", u."createdAt",
                    s."studentCode", s."faculty" AS "studentFaculty", s."major",
                    t."teacherCode", t."faculty" AS "teacherFaculty", t."department"
             FROM users u
             LEFT JOIN students s ON u."userId" = s."userId"
             LEFT JOIN teachers t ON u."userId" = t."userId"
             WHERE u."userId" = $1`,
            [userId]
        );
        return res.rows[0];
    }
}

module.exports = new UserRespository();
