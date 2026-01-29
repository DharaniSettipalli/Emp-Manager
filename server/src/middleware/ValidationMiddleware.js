const { validationResult } = require("express-validator")

exports.ValidationMiddleware = (req,res,next)=>{
    try{
        const result = validationResult(req)
        if(result.isEmpty()){
            next()
            return
        }

        throw new Error(result.array()[0].msg)
        //res.status(400).send({error: result.array()[0].msg})
    }catch(error){
        // next(error)
        res.status(400).send({error:error.message})
    }
}