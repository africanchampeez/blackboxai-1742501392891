const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// In-memory user storage (replace with database in production)
const users = [];

const authController = {
    register: async (req, res) => {
        try {
            const { username, email, password } = req.body;

            // Check if user already exists
            if (users.find(user => user.email === email)) {
                return res.status(400).json({ message: 'User already exists' });
            }

            // Hash password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // Create new user
            const newUser = {
                id: users.length + 1,
                username,
                email,
                password: hashedPassword,
                createdAt: new Date()
            };

            users.push(newUser);

            // Create JWT token
            const token = jwt.sign(
                { id: newUser.id, email: newUser.email },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            res.status(201).json({
                token,
                user: {
                    id: newUser.id,
                    username: newUser.username,
                    email: newUser.email
                }
            });
        } catch (error) {
            res.status(500).json({ message: 'Error registering user', error: error.message });
        }
    },

    login: async (req, res) => {
        try {
            const { email, password } = req.body;

            // Find user
            const user = users.find(user => user.email === email);
            if (!user) {
                return res.status(400).json({ message: 'User not found' });
            }

            // Verify password
            const validPassword = await bcrypt.compare(password, user.password);
            if (!validPassword) {
                return res.status(400).json({ message: 'Invalid password' });
            }

            // Create JWT token
            const token = jwt.sign(
                { id: user.id, email: user.email },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            res.json({
                token,
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email
                }
            });
        } catch (error) {
            res.status(500).json({ message: 'Error logging in', error: error.message });
        }
    }
};

module.exports = authController;
