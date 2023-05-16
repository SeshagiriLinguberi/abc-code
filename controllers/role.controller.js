const conn = require('../config/dbconfig');

exports.addRole = async (req,res)=>{
        const sql = `INSERT INTO roles(role_name,created_datetime) VALUES(?)`;
        const values = [
            req.body.role_name,
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

                    const sql2 = `SELECT * FROM roles WHERE log_state=1`
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

exports.getRoles = async (req,res)=>{

    const sql = `SELECT * FROM roles WHERE log_state=1`
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

exports.updateRoles = async(req,res)=>{
    const sql = `SELECT * FROM roles WHERE role_name = '${req.body.role_name}'`;
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
                    const sql2 = `UPDATE roles SET role_name= '${req.body.newrole_name}',updated_datetime='${new Date()}' WHERE role_name='${req.body.role_name}'`;
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
                            let sql3 = `SELECT * FROM roles WHERE log_state=1`;
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

exports.deleteRoles = async (req,res)=>{
    conn.query(`SELECT * FROM roles WHERE role_name = '${req.body.role_name}' AND log_state=1`,(err,data)=>{
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
                    let sql = `UPDATE roles SET log_state = 3  WHERE role_name = '${ req.body.role_name}'`
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
                       
                            let sql1 = `SELECT * FROM roles WHERE log_state=1`;
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