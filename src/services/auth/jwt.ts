import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET_KEY as string;

// Middleware to verify JWT
export function verifyToken(req: any, res: any, next: () => void) {
  const token = req.headers["authorization"];

  if (!token)
    return res.status(403).send({ auth: false, message: "No token provided." });

  jwt.verify(token, SECRET_KEY, {}, (error: any, decoded: any) => {
    if (error) {
      return res
        .status(500)
        .send({ auth: false, message: "Failed to authenticate token." });
    }
    console.log({ decoded });
    req.userId = decoded.id;
    next();
  });
}

export function generateToken(id: string) {
  return jwt.sign({ id }, SECRET_KEY, {
    expiresIn: 86400, // expires in 24 hours
  });
}
