import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
  try {
    // prefer cookie-based token
    let token = req.cookies?.accessToken;
    if (!token) {
      // fallback to Authorization header
      const auth = req.headers.authorization;
      if (auth && auth.startsWith("Bearer ")) token = auth.split(" ")[1];
    }
    if (!token) return res.status(401).json({ message: "Not authorized" });

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    req.user = { id: decoded.id, role: decoded.role };
    next();
  } catch (err) {
    return res.status(401).json({ message: "Not authorized" });
  }
};

export const authorizeRoles = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) return res.status(403).json({ message: "Forbidden" });
  next();
};
