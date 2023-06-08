const conn = require('../config/dbconfig');
const readline = require('readline');
const jwt = require('jsonwebtoken');

module.exports.verifyJWT=async(req,res,next)=> {
  try 
  {
    let token = req.headers['authorization'];
    console.log("TOKEN LENGTH:::",token.length);
    if(token.length==0){
      res.status(403).json({
        statusCode:403,
        status:false,
        error:true,
        msg:"null tokens not valid please enter details"
      })
    }else if(token.length!=0)
    {
      const data =jwt.verify(token, "secretkey");
          console.log("data::::",data);
          if(data.length!=0)
          {
              next();
          } 
          else{
            console.log("token not valid")
            res.status(401).json({
              statusCode:401,
              status:false,
              error:true,
              msg:"token not valid"
            })
          }
    }
  }  
    catch (error){
     console.log("catch block");
     console.log(error.message);
     res.status(401).json({
      statusCode:401,
      status:false,
      error:true,
      msg:error.message
    })
  }
}
module.exports.verifyEmail=async (emailId)=>{
    return new Promise(async(resolve,reject)=>{
            const sql = `Call user_get_details_by_emailId(?)`;
            conn.query(sql,[emailId],async(err,data)=>{
              if(err)
              {
                throw err;
              }
              else{
                console.log("length:::",data.length);
                resolve(data[0]);
              }
            })
    })
};

module.exports.verifyPhoneNumber=async (phone_number)=>{
  let output=[];
  return new Promise(async(resolve,reject)=>{
          const sql = `Call user_get_details_by_phoneNumber(?)`;
          conn.query(sql,[phone_number],async(err,data)=>{
            if(err){
              throw err;
            }
            else{
              console.log(data[0].length);
              output=data[0];
              resolve(data);
            }
          })
  })
};

module.exports.getAllUserDetails = async ()=>{
  let output=[];
  return new Promise(async(resolve,reject)=>{
          const sql = `Call user_get_all_user_details`;
          conn.query(sql,async(err,data)=>{
            if(err){
              throw err;
            }
            else{
              console.log(data[0].length);
              output=data;
              resolve(output);
            }
          })
  })
};

module.exports.deleteUserById=async(user_id)=>{
  let output=[];
  return new Promise(async(resolve,reject)=>{
          const sql = `Call users_get_and_delete_all_user_deletails(?)`;
          const flag =2;
          const values=[flag,user_id];
          conn.query(sql,[values],async(err,data)=>{
            if(err){
              console.log("error")
              throw err;
             
            }
            else{
              console.log("else block")
              console.log(data[0].length);
              output=data;
              resolve(output);
            }
          })
  })
};

module.exports.getUserDetailsById=async(user_id)=>{
  let output=[];
  return new Promise(async(resolve,reject)=>{
          const sql = `Call users_get_and_delete_all_user_deletails(?)`;
          const flag =1;
          const values=[flag,user_id];
          conn.query(sql,[values],async(err,data)=>{
            if(err){
              console.log("error")
              throw err;
             
            }
            else{
              console.log("else block")
              console.log(data[0].length);
              output=data;
              resolve(output);
            }
          })
  })
};

module.exports.updateUserDetails = async(values)=>{
  return new Promise(async(resolve,reject)=>{
   const sql = `Call users_update_user_detailes(?)`;
   conn.query(sql,[values],async(err,data)=>{
     if(err){
       throw err;
     }
     else{
         resolve(data);
     }
   })
  })
 }

module.exports.updatePassword = async (emailId,newPassword)=>{
  return new Promise(async(resolve,reject)=>{
    const sql = `Call users_update_password(?)`;
    const values = [emailId,newPassword];
    conn.query(sql,[values],async(err,data))
  })
}


// module.exports.componentInfo =async (roleId) => {
//     let output = [];
//     return new Promise(async(resolve, reject) => {
//       const sql = `Call user_get_role_and_component_Details(?)`;
//       conn.query(sql, [roleId], (err, data) => {
//         if (err) 
//         {
//           throw err;
//         } 
//         else 
//         {
//           let result = {};
//           let ex;
//           let finalresult2 =  data[0].map(obj => {
//           const { role_id,role_name, ...rest } = obj;
//           if (!result[role_id]) 
//           {
//               ex=[{role_id,role_name, types: [] }];
//               ex[0].role_id=(role_id);
//               ex[0].role_name=role_name;
//           }
                  
//           ex[0].types.push(rest);
//           return ex[0];
//       });
//       const result3 = Object.values(finalresult2.reduce((acc, { role_id,role_name, types }) =>{
//           if (!acc[role_id]) 
//             {
//                acc[role_id] = {role_id,role_name,types: [] };
//            }
//                acc[role_id].role_id = role_id;
//                acc[role_id].role_name = role_name;
//                acc[role_id].types = acc[role_id].types.concat(types);
               
//                return acc;
//         }, {}));
//           output = result3;
//           resolve(output);
//         }
//       });
//     });
//   };


module.exports.roleInfo = (roleId)=>{
    let output=[];
    return new Promise((resolve,reject)=>{
        const sql =`Call user_login_show_details2(?)`;
        conn.query(sql,[roleId],async(err,data)=>{
            if(err){
                throw err;
            }
            else{
                let result = {};
                let ex;
                console.log(data[0])
                let finalresult =  data[0].map(obj => {
                const { user_id, ...rest } = obj;
                if (!result[user_id]) 
                 {
                     ex=[{user_id, types: [] }];
                     ex[0].user_id=(user_id);
                 }
                ex[0].types.push(rest);
                return ex[0];
                 });
                const result2 = Object.values(finalresult.reduce((acc, { user_id, types }) =>{
                if (!acc[user_id]) 
                 {
                    acc[user_id] = {types: [] };
                 }
                    acc[user_id].types = acc[user_id].types.concat(types);
                    //acc[user_id].user_id = user_id;
                    return acc;
             }, {}));
                output=result2;
                console.log(output);
                resolve(output);
            }
        })
    })
}