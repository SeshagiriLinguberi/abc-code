const conn = require('../config/dbconfig');

exports.getAllItems = async (req,res)=>{
    let sql = `SELECT * FROM items WHERE log_state = 1`;
    conn.query(sql,(err,data)=>{
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
            res.status(200).json({
                statusCode:200,
                status:true,
                error:false,
                responseData:data
            })
        }
    })
}

exports.addItem = async (req, res) => {
    let sql = `select * from items where item_name = '${req.body.item_name}'`;
    await conn.query(sql,async(err,result)=>{
        console.log(result);
        if(err)
        {
            res.status(500).json(
                {
                     statusCode:500,
                     status:false,
                     error:true,
                     message:err
                 });
        }
        else
        {
            if(result.length==0)
            {
                console.log(result);
                        const sql1 = `INSERT INTO items (item_name,category_type_id,category_id,item_created_datetime,item_inline_data,item_quantity,item_price) VALUES (?)`;
                        let values = [
                                req.body.item_name,
                                req.body.category_type_id,
                                req.body.category_id,
                                new Date(),
                                req.body.item_inline_data,
                                req.body.item_quantity,
                                req.body.item_price
                                    ]
                            conn.query(sql1, [values], async(err, data) => {
                            if (err)
                            {
                                        res.status(500).json(
                                        {
                                             statusCode:500,
                                             status:false,
                                             error:true,
                                             message:err
                                         });
                            } 
                            else 
                            {
                                let sql2 = `SELECT * FROM items WHERE log_state=1`;
                                await conn.query(sql2,(err,result)=>{
                                if(err)
                                {
                                    res.status(500).json(
                                        {
                                             statusCode:500,
                                             status:false,
                                             error:true,
                                             message:err
                                         });
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
            else{
                res.status(401).json(
                     {
                          statusCode:401,
                          status:true,
                          error:false,
                          message:"items  already exist"
                      });
             }                      

          }
       })
   }

exports.getItemsById = async (req,res)=>{
    // console.log(req.body.category_id);
        conn.query(`SELECT * FROM items WHERE item_id = '${req.body.item_id}' AND log_state=1`,(err,data)=>{
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
                console.log("data ::::",data);
                console.log(data.length);
               if(data.length!=0)
               {
                    let sql1 = `SELECT * FROM items WHERE item_id = '${req.body.item_id}'`;
                    conn.query(sql1,(err,data1)=>{
                        if(err){
                            res.status(500).json({
                                statusCode:500,
                                status:false,
                                error:true,
                                message:err
                            });
                        }
                        else
                        {
                            res.status(200).json({
                                statusCode:200,
                                status:true,
                                error:false,
                                responseData:data1,
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
                       message:"no items found"
                   })
               }
            }
        })
       
      
    }

exports.updateItmesById = async (req,res)=>{
        conn.query(`SELECT * FROM items WHERE item_id = '${req.body.item_id}'  AND log_state=1`,(err,data)=>{
            if(err)
            {
                res.status(500).json({
                    statusCode:500,
                    status:false,
                    error:true,
                    message:err
                })
            }
            else
            {
                if(data.length!= 0)
                {
                   
                    let sql = `UPDATE items SET item_name = ?,category_type_id = ?,category_id = ?,item_updated_datetime = ? WHERE item_id = ?`;
                    let values = [
                        req.body.item_name,
                        req.body.category_type_id,
                        req.body.category_id,
                        new Date(),
                        req.body.item_id
                    ]
                    conn.query(sql,values,(err,data)=>{
                        if(err){
                            res.status(500).json({
                                statusCode:500,
                                status:false,
                                error:true,
                                message:err
                            });
                        }
                        else
                        {
                            let sql1 = `SELECT * FROM items WHERE log_state=1`;
                            conn.query(sql1,(err,result)=>{
                                if(err){
                                    res.status(500).json({
                                        statusCode:500,
                                        status:false,
                                        error:true,
                                        message:err
                                    });
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
                    message:"no items found"
                });
                }
                
            }
        })
     
    
};

exports.deleteItemsById = async (req,res)=>{
    conn.query(`SELECT * FROM items WHERE item_id = '${req.body.item_id}' AND log_state=1`,(err,data)=>{
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
                    let sql = `UPDATE items SET log_state = 3  WHERE item_id = '${ req.body.item_id}'`
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
                       
                            let sql1 = `SELECT * FROM items WHERE log_state=1`;
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
                        message:"no items found"
                    })
                }
        }
    })
}