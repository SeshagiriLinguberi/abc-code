const conn = require('../config/dbconfig');

module.exports.componentInfo =async (roleId) => {
  let output = [];

  return new Promise(async(resolve, reject) => {
    const sql = `Call user_get_role_and_component_Details(?)`;
    conn.query(sql, [roleId], (err, data) => {
      if (err) 
      {
        throw err;
      } 
      else 
      {
        let result = {};
        let ex;
        let finalresult2 =  data[0].map(obj => {
        const { role_id, ...rest } = obj;
        if (!result[role_id]) 
        {
            ex=[{role_id, types: [] }];
            ex[0].role_id=(role_id);
        }
                
        ex[0].types.push(rest);
        return ex[0];
    });
    const result3 = Object.values(finalresult2.reduce((acc, { role_id, types }) =>{
        if (!acc[role_id]) 
          {
             acc[role_id] = {types: [] };
         }
             acc[role_id].types = acc[role_id].types.concat(types);
             //acc[role_id].role_id = role_id;
             return acc;
      }, {}));
        output = result3;
        resolve(output);
      }
    });
  });
};


module.exports.roleInfo = (roleId)=>{
    let output=[];
    return new Promise((resolve,reject)=>{
        const sql =`Call user_login_show_role_details(?)`;
        conn.query(sql,[roleId],async(err,data)=>{
            if(err){
                throw err;
            }
            else{
                let result = {};
                let ex;
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
                output=result2[0];
                resolve(output);
            }
        })
    })
}
