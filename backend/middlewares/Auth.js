import userModel from "../App/models/user.js";
import { getUser } from "../services/Auth.js";

// Paths that bypass token verification completely
const publicPaths = [
    '/',
    '/signup',
    '/login',
    '/sendotp',
    '/reset-password',
    '/forget-password',
    '/api/products',
    '/api/products/public'
];

async function isLoggedIn(req, res, next) {
    // Check if the current request is public
    if (publicPaths.includes(req.path)) return next();
    if (req.method === 'GET' && req.path.startsWith('/api/products')) return next();

    req.user = null;
    let token = req.cookies?.UID;
    if (!token) return res.send({ status: 50, msg: "No token found. Please login." });

    let userPayload = await getUser(token);
    if (!userPayload) return res.send({ status: 51, msg: "Invalid or expired token" });

    const id = userPayload.id;
    try {
        let findUser = await userModel.findById(id);
        if (!findUser) return res.send({ status: 52, msg: "User account not found" });

        // Check if token exists in user's active sessions
        const hasValidSession = findUser.sessions && findUser.sessions.some(s => s.token === token);
        if (!hasValidSession) {
            return res.send({ status: 53, msg: "Session expired or invalid credentials" });
        }

        req.user = findUser;
        next();
    } catch (err) {
        console.log(err);
        return res.send({ status: 100, msg: "Authentication error" });
    }
}

// Middleware to restrict by role
function requireRole(allowedRoles = []) {
    return (req, res, next) => {
        if (!req.user) {
            return res.send({ status: 401, msg: "Unauthorized. Please login." });
        }
        if (req.user.role === 'super_admin') {
            return next(); // Super admin has access to everything
        }
        if (!allowedRoles.includes(req.user.role)) {
            return res.send({ status: 403, msg: "Access forbidden: insufficient role permissions" });
        }
        next();
    };
}

export { isLoggedIn, requireRole };