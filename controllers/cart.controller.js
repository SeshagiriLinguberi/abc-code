const conn = require('../config/dbconfig');
const validate = require('../utils/common_utils');
exports.addToCart = async(req,res)=>{
    let sql3=`SELECT * FROM users WHERE user_id='${req.body.user_id}' AND log_state=1`;
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
            if(data3.length!=0)
            {
                const sql = `SELECT * FROM items WHERE item_id = '${req.body.item_id}'`
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
                        console.log(data.length);
                            if(data.length!=0)
                            {
                                
                                const sql2  = `INSERT INTO cart (category_id,category_type_id,item_id,item_quantity,item_price,total_price,user_id,created_datetime) VALUES(?)`;
                                const values= [
                                                data[0].category_id,
                                                data[0].category_type_id,
                                                req.body.item_id,
                                                req.body.item_quantity,
                                                req.body.item_price,
                                                req.body.item_quantity*req.body.item_price,
                                                req.body.user_id,
                                                new Date()
                                              ];
                                 conn.query(sql2,[values],async(err,data1)=>{
                                        if(err)
                                        {
                                            res.status(500).json({
                                                statusCode:500,
                                                status:false,
                                                error:true,
                                                msg:err
                                            });
                                        }
                                        else
                                        {
                                            let sql4 = `SELECT * FROM cart WHERE item_id = '${req.body.item_id}'`
                                            conn.query(sql4,async(err,data4)=>{
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
                                                        responseData:data4
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
                                    msg:"item out of Stock"
                                })
                            }
                            
                        
                    }
                    
                })
            }
            else
            {
                res.status(500).json({
                    statusCode:500,
                    status:false,
                    error:true,
                    msg:"please signup to the website"
                });
            }
        }
    });
}
exports.modifyCartItem = async (req,res,next)=>{
    let sql3=`SELECT * FROM users WHERE user_id='${req.body.user_id}' AND log_state=1`;
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
            if(data3.length!=0)
            {
                const sql = `SELECT token FROM user_login_table WHERE email_id = '${data3[0].email_id}'`;
                console.log(data3[0].email_id);
                //const token = req.headers.authorization.split(' ')[1];
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
                                // console.log(data[0].token);
                                // console.log('body>>>>',req.body.token);
                                // const decoded = validate.verifyJWT(req.headers.Authorization);
                                // // console.log(decoded,"decode");
                                // if (decoded) 
                                //  {
                                //   console.log('decoded');
                                  const sql2  = `UPDATE cart SET item_quantity = ?,item_price =?,total_price= ?,updated_datetime =? WHERE item_id = ?`;
                                  const values= [
                                                  req.body.item_quantity,
                                                  req.body.item_price,
                                                  req.body.item_quantity*req.body.item_price,
                                                  new Date(),
                                                  req.body.item_id
                                                ];
                                   conn.query(sql2,values,async(err,data1)=>{
                                          if(err)
                                          {
                                              res.status(500).json({
                                                  statusCode:500,
                                                  status:false,
                                                  error:true,
                                                  msg:err
                                              });
                                          }
                                          else
                                          {
                                              let sql4 = `SELECT * FROM cart WHERE item_id = '${req.body.item_id}'`
                                              conn.query(sql4,async(err,data4)=>{
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
                                                          responseData:data4
                                                      })
                                                      next();
                                                  }
                                              
                                              })
                                              
                                          }
                                  });
                                //} else 
                                // {
                                  
                                //     res.status(401).json({
                                //         statusCode:401,
                                //         status:false,
                                //         error:true,
                                //         msg:'Invalid token'

                                //     })
                                // }
                              
                    }
                    
                })
            }
            else
            {
                res.status(500).json({
                    statusCode:500,
                    status:false,
                    error:true,
                    msg:"no users  found"
                });
            }
        }
    });
}

exports.deleteCartItem = async (req,res)=>{
    let sql3=`SELECT * FROM users WHERE user_id='${req.body.user_id}' AND log_state=1`;
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
            if(data3.length!=0)
            {
                const sql = `SELECT token FROM user_login_table WHERE email_id = '${data3[0].email_id}'`;
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
                                console.log(data.length);
                                const decode = validate.verifyJWT(req.body.tooken,data[0].token);
                                if(decode)
                                {
                                    const sql2  = `UPDATE cart SET log_state = 3 WHERE item_id = '${req.body.item_id}'`;
                                    conn.query(sql2,async(err,data1)=>{
                                           if(err)
                                           {
                                               res.status(500).json({
                                                   statusCode:500,
                                                   status:false,
                                                   error:true,
                                                   msg:err
                                               });
                                           }
                                           else
                                           {
                                               let sql4 = `SELECT * FROM cart `;
                                               conn.query(sql4,async(err,data4)=>{
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
                                                           responseData:data4
                                                       })
                                                   }
                                               
                                               })
                                               
                                           }
                                   })  
                                }
                                else
                                {
                                    
                                    res.status(401).json({
                                        statusCode:401,
                                        status:false,
                                        error:true,
                                        msg:'Invalid token'

                                    })
                                }
 
                    }
                    
                })
            }
            else
            {
                res.status(500).json({
                    statusCode:500,
                    status:false,
                    error:true,
                    msg:"no users found"
                });
            }
        }
    });
}

exports.getCartItem = async (req,res)=>{
    let sql3=`SELECT * FROM users WHERE user_id='${req.body.user_id}' AND log_state=1`;
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
            if(data3.length!=0)
            {
                const sql = `SELECT * FROM cart WHERE user_id = '${req.body.user_id}'AND log_state=1`;
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
                        console.log(data.length);
                            if(data.length!=0)
                            {
                                res.status(200).json({
                                    statusCode:200,
                                    status:true,
                                    error:true,
                                    responseData:data
                                })
                            }
                            else{
                                res.status(401).json({
                                    statusCode:401,
                                    status:false,
                                    error:true,
                                    responseData:[]
                                })
                            }
                            
                        
                    }
                    
                })
            }
            else
            {
                res.status(401).json({
                    statusCode:401,
                    status:false,
                    error:true,
                    responseData:[]
                });
            }
        }
    });
}
exports.getAllCartUsers = async (req,res)=>{
    const sql = `SELECT * FROM cart`;
    conn.query(sql,async(err,data)=>{
        if(err){
            res.status(500).json({
                statusCode:500,
                status:false,
                error:true,
                msg:err
            });
        }
        else
        {
            res.status(200).json({
                statusCode:200,
                status:true,
                error:true,
                responseData:data
            })
        }
    })
}
