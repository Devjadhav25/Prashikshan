const protect = (req, res, next) => {
    if(req.oidc.isAuthenticated()) {
        next();
    }
    else {
        return res.status(401).json({ message: "Unauthorized" });
    }
};
export default protect;