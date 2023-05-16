const jwt = require('jsonwebtoken');
//const userController = require('../controllers/user.controller');
exports.verifyJWT=async(req,res,next)=> {
  try 
  {
    //const token = req.req.headers.Authorization;
    let token = req.headers['authorization']
    console.log(token.length);
    if(token==null){
      res.status(403).json({
        statusCode:403,
        status:false,
        error:true,
        msg:"null tokens not valid please enter details"
      })
    }
    
    else if(token.length !=0)
    {
      const data = jwt.verify(token,"secretkey");
      console.log(data);
          if(data)
          {
              next();
          }
          else
          {
            res.status(401).json({
              statusCode:401,
              status:false,
              error:true,
              msg:"token not valid"
            })
          }
    }

    console.log(data);
  } 
  catch (error) 
  {
     console.log(error.message);
    return null; 
  }


}

