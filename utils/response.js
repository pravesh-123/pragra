
const successResponse = (req, res, data,msg) => {
    return res.send({ success: true,message:msg, data:data  })
}




module.exports = {   successResponse}
