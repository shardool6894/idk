const viewProfile = (req,res) => {
    try{
        const user = req.user;
        res.status(200).json({
            success : true,
            email : user.email})
    }
    catch(err){
        res.status(400).json({
            success : false,
            message : err.message
        })
    }
}

module.exports = {viewProfile}