const { checkType } = require('parser');
const conn = require('../config/dbconfig');
const fs = require('fs');
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
                        const sql1 = `INSERT INTO categories (category_id,category_name,created_datetime,image) VALUES (?)`;
                        let values = [
                                token,
                                req.body.category_name,
                                new Date(),
                                req.body.image
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

    let sql = `SELECT categories.category_id,sub_category.category_type_name,sub_category.category_type_id,sub_category.catgeory_type_created_datetime,sub_category.catgeory_type_updated_datetime
     FROM categories  
     INNER JOIN sub_category 
     ON categories.category_id = sub_category.category_id
    GROUP BY categories.category_id,sub_category.category_type_name`;
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
            //console.log(data);
            let result = {};
            let ex;
            let finalresult =  data.map(obj => {
            const { category_id, ...rest } = obj;
            
            //console.log(!result[category_id]);
            if (!result[category_id]) 
            {
                ex=[{category_id, types: [] }];

                console.log(category_id,">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
                     ex[0].category_id=(category_id);
                   
            }
            console.log("ex:::",ex[0]);
            ex[0].types.push(rest);
            console.log(ex);
            return ex[0];
            });
        console.log(finalresult);
          
          const result2 = Object.values(finalresult.reduce((acc, { category_id, types }) => {
            if (!acc[category_id]) {
              acc[category_id] = { category_id, types: [] };
            }
            acc[category_id].types = acc[category_id].types.concat(types);
            return acc;
          }, {}));
          
          console.log(result2);
                res.status(200).json({
                statusCode:200,
                status:true,
                error:false,
                responseData:result2
            })
        }
    })
}
exports.getAllCategoriesSubcategoriesItemsByGroup = async (req,res)=>{
    let sql = `SELECT categories.category_id,sub_category.category_type_id,items.item_id,items.item_name,items.item_created_datetime,items.item_updated_datetime,sub_category.category_type_name,items.category_type_id
    FROM categories,sub_category,items
    WHERE categories.category_id = sub_category.category_id OR 
    sub_category.category_type_id=items.category_type_id
    GROUP BY categories.category_id,sub_category.category_type_id,items.category_type_id`;

    conn.query(sql,async(err,data)=>{
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
            //console.log(data);
            let result = {};
            let ex;
            let finalresult =  data.map(obj => {
            const { category_id,category_type_id,item_id,category_type_name, ...rest } = obj;
           //console.log(!result[category_id],"result>>>>>>>>>>....");
           //console.log(category_id);
            if (!result[category_id]) 
            {
                //console.log([category_type_id],"<<<<<<<<<<>>>>>>>>>>>>>>>");
                ex=[{category_id, types1: [{category_type_id,category_type_name,types2:[{item_id,types3:[]}]}] }];
            
                //console.log(category_id,">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
                     ex[0].category_id=(category_id);
                     ex[0].types1[0].category_type_id=category_type_id;
                     ex[0].types1[0].category_type_name=category_type_name;
                     ex[0].types1[0].types2[0].item_id=item_id;
            }
            //console.log("ex:::",ex[0]);
            ex[0].types1[0].types2[0].types3.push(rest);
            //console.log(ex);
            return ex[0];
            });
            //console.log(finalresult);
            //=------------------------------------------------------------------------
            const result2 = Object.values(finalresult.reduce((acc, {category_id, types1}) => {
             if (!acc[category_id]) 
             {
              //console.log(!acc[category_id],"gggg");
               acc[category_id] = { category_id, types1: [] };
             }
             acc[category_id].types1 = acc[category_id].types1.concat(types1);
             return acc;
            }, {}));
            //-------------------------------------------------------------------
            // const result3 = Object.values(result2.reduce((acc, {category_id,category_type_id,types1, types2}) => {
            //     if (!acc[types1.category_type_id]) 
            //     {
            //      //console.log(!acc[category_id],"gggg");
            //       acc[category_type_id] = [{category_id, types1: [{category_type_id,types2:[]}] }];

            //     }
            //     acc[category_type_id].types2 = acc[category_type_id].types2.concat(types2);
            //     return acc;
            //    }, {}));
            //    console.log(result3);
               console.log(result2);
            //console.log(result);

            //console.log(finalresult);
            res.status(200).json({
                statusCode:200,
                status:true,
                error:false,
                responseData:result2
            })
        }
    })
}
exports.uploadImage = async (req,res) =>{
    const sql = `INSERT INTO categories(image) VALUES(?)`;
    conn.query(sql,[req.body.image],async(err,data)=>{
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

            res.status(200).json({
                statusCode:200,
                status:true,
                error:false,
                responseData:data
            })
        }
    })
}
exports.downloadImage = async (req,res) =>{
    const sql = `SELECT image FROM categories`;
    conn.query(sql,async(err,data1)=>{
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
            const filename = 'package.json';
            const binaryData = fs.readFileSync(filename);
            const baseString = new Buffer(binaryData).toString('base64');
            console.log(baseString);
            res.status(200).json({
                statusCode:200,
                status:true,
                error:false,
                responseData:data1[0].image.data
            })
        }
    })
}
