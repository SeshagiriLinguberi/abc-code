const conn = require('../config/dbconfig');

exports.getAllCategories = async (req,res)=>{
    let sql = `SELECT* FROM categories WHERE log_state=1`;
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
exports.insertData = async (req, res) => {
    let sql = `select * from categories where category_name = '${req.body.category_name}'`
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
                    let token = Math.floor(Math.random() * 1000) + 1000;
                        const sql1 = `INSERT INTO categories (category_id,category_name,created_datetime) VALUES (?)`;
                        let values = [
                                token,
                                req.body.category_name,
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
                                let sql2 = `SELECT * FROM categories WHERE log_state=1`;
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
                          message:"category  already exist"
                      });
             }                      

          }
       })
   }
exports.getCategoryById = async (req,res)=>{
    conn.query(`SELECT * FROM categories WHERE category_id = '${req.body.category_id}' AND log_state=1`,(err,data)=>{
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
                let userid = req.body.user_id;
                let sql = `SELECT * FROM categories WHERE log_state=1 AND category_id = '${req.body.category_id}'`;
                conn.query(sql,userid,(err,data)=>{
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
                            responseData:data,
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
                   message:"no users found"
               })
           }
        }
    })
   
  
}

exports.deleteCategoryById = async (req,res)=>{
    conn.query(`SELECT * FROM categories WHERE category_id = '${req.body.category_id}' AND log_state=1`,(err,data)=>{
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
                    let sql = `UPDATE categories SET log_state = 3  WHERE category_id = '${ req.body.category_id}'  AND log_state=1`
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
                       
                            let sql1 = `SELECT * FROM categories WHERE log_state=1`;
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
                        message:"no categories found"
                    })
                }
        }
    })
}
exports.updateCategoryById = async (req,res)=>{
    conn.query(`SELECT * FROM categories WHERE category_id = '${req.body.category_id}'  AND log_state=1`,(err,data)=>{
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
               
                let sql = `UPDATE categories SET category_name = ?,updated_datetime = ? WHERE category_id = ?`;
                
                let values = [
                    req.body.category_name,
                    new Date(),
                    req.body.category_id
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
                        let sql1 = `SELECT * FROM categories WHERE log_state=1`;
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
                message:"no categories found"
            });
            }
            
        }
    })
 

};

exports.getAllSubCategories = async (req,res)=>{

    let sql = `SELECT sub_category.category_type_name FROM categories  INNER JOIN sub_category ON categories.category_id = sub_category.category_id `;
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

exports.getAllSubCategoriesBYGroup = async (req,res)=>{

    let sql = `SELECT categories.category_id,sub_category.category_type_name FROM categories  INNER JOIN sub_category ON categories.category_id = sub_category.category_id GROUP BY categories.category_id,sub_category.category_type_name`;
//     SELECT Shippers.ShipperName, COUNT(Orders.OrderID) AS NumberOfOrders FROM Orders
// LEFT JOIN Shippers ON Orders.ShipperID = Shippers.ShipperID
// GROUP BY ShipperName;
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
            let result = data.reduce((acc, curr) => {
                if (!acc[curr.category_id]) {
                  acc[curr.category_id] = { category_id: curr.category_id, category_type_name: [] };
                }
                acc[curr.category_id].category_type_name.push(curr.category_type_name);
                return acc;
              }, {});
              
              result = Object.values(result).map(group => ({ category_id: group.category_id, category_type_name: { ...group.category_type_name.reduce((obj, category_type_name) => ({ ...obj, [category_type_name]: category_type_name }), {}) } }));
              
            res.status(200).json({
                statusCode:200,
                status:true,
                error:false,
                responseData:result
            })
        }
    })
}
