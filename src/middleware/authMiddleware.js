import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
  const authString = req.headers.authorization;

  if (!authString || !authString.startsWith("Bearer ")) {
    return res.status(401).json({
      status: "error",
      message: "Unauthorised",
    });
  }

  const token = authString.split(" ")[1];
  const decoded = jwt.verify(token, process.env.JWT_AUTH_SECRET_KEY);
  req.user = decoded;
  console.log(req.user, "00");
  next();
};
