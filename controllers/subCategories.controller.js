const conn = require('../config/dbconfig');

exports.getAllSubAllCategories = async (req,res)=>{
    let sql = `SELECT * FROM sub_category WHERE log_state = 1`;
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

exports.addSubCategories = async (req, res) => {
    let sql = `select * from sub_category where category_type_name = '${req.body.category_type_name}'`;
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
                    //let token = Math.floor(Math.random() * 1000) + 1000;
                        const sql1 = `INSERT INTO sub_category (category_type_name,category_id,catgeory_type_created_datetime) VALUES (?)`;
                        let values = [
                               // token,
                                req.body.category_type_name,
                                req.body.category_id,
                                new Date()
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
                                let sql2 = `SELECT * FROM sub_category WHERE log_state=1`;
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
                          message:"sub_category  already exist"
                      });
             }                      

          }
       })
   }

exports.getSubCategoryById = async (req,res)=>{
console.log(req.body.category_id);
    conn.query(`SELECT * FROM sub_category WHERE category_type_id = '${req.body.category_type_id}' AND log_state=1`,(err,data)=>{
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
                let sql1 = `SELECT * FROM sub_category WHERE category_type_id = '${req.body.category_type_id}'`;
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
               res.status(500).json({
                   statusCode:500,
                   status:false,
                   error:true,
                   message:"no sub-catagories  found"
               })
           }
        }
    })
   
  
}

exports.deleteSubCategoryById = async (req,res)=>{
    conn.query(`SELECT * FROM sub_category WHERE category_type_id = '${req.body.category_type_id}' AND log_state=1`,(err,data)=>{
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
                    let sql = `UPDATE sub_category SET log_state = 3  WHERE category_type_id = '${ req.body.category_type_id}'`
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
                       
                            let sql1 = `SELECT * FROM sub_category WHERE log_state=1`;
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
                        message:"no sub_category found"
                    })
                }
        }
    })
}
exports.updatesubCategoryById = async (req,res)=>{
    conn.query(`SELECT * FROM sub_category WHERE category_type_id = '${req.body.category_type_id}'  AND log_state=1`,(err,data)=>{
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
               
                let sql = `UPDATE sub_category SET category_type_name = ?,category_id = ?,catgeory_type_updated_datetime = ? WHERE category_type_id = ?`;
                let values = [
                    req.body.category_type_new_name,
                    req.body.category_id,
                    new Date(),
                    req.body.category_type_id
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
                        let sql1 = `SELECT * FROM sub_category WHERE log_state=1`;
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
                message:"no sub_category found"
            });
            }
            
        }
    })
 

};

exports.getAllItems = async (req,res)=>{
console.log("entered");
    let sql = `SELECT items.item_name  FROM sub_category INNER JOIN items ON sub_category.category_id = items.category_id `;
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