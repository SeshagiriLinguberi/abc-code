const conn = require('../config/dbconfig');


exports.addRolePermission = async(req,res)=>{
    const sql = `INSERT INTO user_role_permissions (user_id,role_id,created_datetime) VALUES(?)`;
    const values = [
        req.body.user_id,
        req.body.role_id,
        new Date()
        ]
    conn.query(sql,[values],async(err,data)=>{
            if(err){
                res.status(500).json({
                    statusCode:500,
                    status:false,
                    error:true,
                    msg:err
                });
            }
            else{

                const sql2 = `SELECT * FROM user_role_permissions WHERE log_state=1`
                conn.query(sql2,async(err,data1)=>{
                    if(err){
                        res.status(500).json({
                            statusCode:500,
                            status:false,
                            error:true,
                            msg:err
                        });
                    }
                    else{
                        res.status(200).json({
                            statusCode:200,
                            status:true,
                            error:false,
                            responseData:data1
                        })
                    }
                })
               
            }
    })
}

exports.updateRolePermission = async(req,res)=>{
    const sql = `SELECT * FROM user_role_permissions WHERE user_id = '${req.body.user_id}'`;
    conn.query(sql,async(err,data)=>{
        if(err){
            res.status(500).json({
                statusCode:500,
                status:false,
                error:true,
                msg:err
            });
        }
        else{
                if(data.length!=0){

                    const sql2 = `UPDATE user_role_permissions SET role_id= '${req.body.new_role_id}',updated_datetime='${new Date()}' WHERE user_id='${req.body.user_id}'`;
                    conn.query(sql2,async(err,data2)=>{
                        if(err){
                            res.status(500).json({
                                statusCode:500,
                                status:false,
                                error:true,
                                msg:err
                            });
                        }
                        else{
                            let sql3 = `SELECT * FROM user_role_permissions WHERE log_state=1`;
                            conn.query(sql3,async(err,data3)=>{
                                if(err){
                                    res.status(500).json({
                                        statusCode:500,
                                        status:false,
                                        error:true,
                                        msg:err
                                    });
                                }
                                else{
                                    res.status(200).json({
                                        statusCode:200,
                                        status:true,
                                        error:false,
                                        responseData:data3
                                    })
                                }
                            })
                        }
                    })
                }
                else{
                    res.status(401).json({
                        statusCode:401,
                        status:false,
                        error:true,
                        msg:"no user found"
                    });
                }
        }
    })
}

exports.deleteRolePermission = async (req,res)=>{
    conn.query(`SELECT * FROM user_role_permissions WHERE user_id = '${req.body.user_id}' AND log_state=1`,(err,data)=>{
        if(err){
            res.status(500).json({
                statusCode:500,
                status:false,
                error:true,
                message:err
            })
        }
        else
        {
            if(data.length!=0)
            {
                    let sql = `UPDATE user_role_permissions SET log_state = 3  WHERE user_id = '${ req.body.user_id}'`
                    conn.query(sql,(err,data)=>{
                        if(err){
                            res.status(500).json({
                                statusCode:500,
                                status:false,
                                error:true,
                                message:err
                            });
                        }
                        else{
                       
                            let sql1 = `SELECT * FROM user_role_permissions WHERE log_state=1`;
                            conn.query(sql1,(err,result)=>{
                                if(err){
                                    throw err;
                                }
                                else{
                                    res.status(200).json({
                                        statusCode:200,
                                        status:true,
                                        error:false,
                                        responseData:result
                                    });
                                }
                            });
                        }
                    })
                }
                else
                {
                    res.status(500).json({
                        statusCode:500,
                        status:false,
                        error:true,
                        message:"no data found"
                    })
                }
        }
    })
}

exports.getRolePermission = async (req,res)=>{

    const sql = `SELECT * FROM user_role_permissions WHERE log_state=1`
    conn.query(sql,async(err,data)=>{
        if(err){
            res.status(500).json({
                statusCode:500,
                status:false,
                error:true,
                msg:err
            });
        }
        else{
            res.status(200).json({
                statusCode:200,
                status:true,
                error:false,
                responseData:data
            })
        }
    })
};

exports.loginRolePermission = async (req,res)=>{
    let sql = `SELECT * FROM user_role_permissions WHERE user_id='${req.body.user_id}' AND log_state=1`;
    conn.query(sql,async(err,data)=>{
            if(err){
                res.status(500).json({
                    statusCode:500,
                    status:false,
                    error:true,
                    msg:err
                });
            }
            else{
                if(data.length!=0){
                    
                    const sql2 = `SELECT user_role_permissions.user_id,user_role_permissions.role_id,roles.role_name,roles.role_name,roles.created_datetime,roles.updated_datetime
                        FROM user_role_permissions
                        INNER JOIN roles
                        ON user_role_permissions.role_id = roles.role_id
                        WHERE user_id = '${req.body.user_id}'
                        GROUP BY user_role_permissions.user_id,user_role_permissions.role_id`;

                    conn.query(sql2,async(err,data2)=>{
                        if(err){
                            res.status(500).json({
                                statusCode:500,
                                status:false,
                                error:true,
                                msg:err
                            });
                        }
                        else{
                            let result = {};
                            let ex;
                            let finalresult =  data2.map(obj => {
                                    const { user_id, ...rest } = obj;
                                    if (!result[user_id]) 
                                     {
                                           ex=[{user_id, types: [] }];
                                           ex[0].user_id=(user_id);
                                     }
                           // console.log("ex:::",ex[0]);
                            ex[0].types.push(rest);
                            console.log(ex);
                            return ex[0];
                        });
                            const result2 = Object.values(finalresult.reduce((acc, { user_id, types }) => {
                           if (!acc[user_id]) 
                          {
                            
                                acc[user_id] = { user_id, types: [] };
                          }
                                acc[user_id].types = acc[user_id].types.concat(types);
                                acc[user_id].user_id = user_id;
                                return acc;
                         }, {}));

                            res.status(200).json({
                                statusCode:200,
                                status:true,
                                error:false,
                                responseData:result2
                            })
                            //console.log(finalresult);
                        }
                    })
                }
                else{
                    res.status(401).json({
                        statusCode:401,
                        status:false,
                        error:true,
                        msg:"no user found"
                    });
                }
            }
    })
}

