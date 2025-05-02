
import jwt from "jsonwebtoken";

const authUser =async (req, res, next) => {
    const {token} = req.cookies;
    // console.log(token);
    if (!token) {
        return res.status(401).json({ success: false, error: "Unauthorized" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // console.log(decoded.id);
        if(decoded.id){
            req.user = { id: decoded.id }
            next();
        }
        else{
            return res.status(401).json({ success: false, error: "Unauthorized" });
        }
    } catch (error) {
        return res.status(401).json({ success: false, error: "Unauthorized" });
    }
};

export default authUser;
