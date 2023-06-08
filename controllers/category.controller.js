const conn = require('../config/dbconfig');
const fs = require('fs');
exports.getAllCategories = async (req,res)=>{
    let sql = `Call categories_get_all_categories`;
    conn.query(sql,(err,data)=>{
        if(err){
            res.status(500).json({
                statusCode:500,
                status:false,
                error:true,
                message:err
            })
        }
        else {
            res.status(200).json({
                statusCode:200,
                status:true,
                error:false,
                responseData:data[0]
            })
        }
    })
}
exports.insertData = async (req, res) => {
    let category_id = Math.floor(Math.random() * 1000) + 1000;
    const sql = `Call categories_insert_catagories(?)`;
    let values = [ category_id , req.body.category_name ,new Date(), req.body.image];
    conn.query(sql,[values],async(err,data)=>{
        if(err){
            res.status(500).json(
                {
                     statusCode:500,
                     status:false,
                     error:true,
                     message:err
                 });
        }
        else{
            console.log(data[0]);
            console.log(data[0][0].image)
            if(data[0].length==0){
                res.status(200).json({
                    statusCode:200,
                    status:true,
                    error:false,
                    responseData:data[0]
                   });
            }else{
                res.status(401).json({
                    statusCode:401,
                    status:false,
                    error:true,
                    message:"Category already exists"
                   });
            }
           
        }
    })
                              
   }
exports.getCategoryById = async (req,res)=>{
    const sql = `Call categories_get_details_by_id(?)`;
    const flag=1;
    const values = [req.body.category_id,flag];
    conn.query(sql,[values],async(err,data)=>{
        if(err){
            res.status(500).json({
                statusCode:500,
                status:false,
                error:true,
                message:err
            })
        }
        else{
                console.log(data[0]);
                if(data[0].length!=0){
                    res.status(200).json({
                        statusCode:200,
                        status:true,
                        error:false,
                        responseData:data[0]
                    })
                }else{
                    res.status(401).json({
                        statusCode:401,
                        status:false,
                        error:true,
                        message:"no categories found "
                    })
                }
        }
    })
}

exports.deleteCategoryById = async (req,res)=>{
    const sql = 'Call categories_get_details_by_id(?)';
    const flag=2;
    const values = [req.body.category_id,flag];
    conn.query(sql,[values],(err,data)=>{
        if(err){
            res.status(500).json({
                statusCode:500,
                status:false,
                error:true,
                message:err
            });
        }
        else{
            if(data[0].length!=0){
                res.status(200).json({
                    statusCode:200,
                    status:true,
                    error:false,
                    responseData:data[0]
                });
            }
            else{
                res.status(401).json({
                    statusCode:400,
                    status:false,
                    error:true,
                    message:"no categories found"
                });
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
                ];
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
            let result = {};
            let ex;
            let finalresult =  data.map(obj => {
            const { category_id, ...rest } = obj;
            if (!result[category_id]){
                ex=[{category_id, types: [] }];
                ex[0].category_id=(category_id);
            }
            ex[0].types.push(rest);
            return ex[0];
            });
          
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
    const sql = `Call category_get_all_subcategories_and_items_based_on_category_id`;
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
            const result = [];
            const groupedData = {};

            data[0].forEach((item) => {
                if (!groupedData[item.category_id]) {
                       groupedData[item.category_id] = {
                       category_id: item.category_id,
                       category_name:item.category_name,
                       type: []
                       };
                   }
               let type = groupedData[item.category_id].type.find(
                    (t) => t.category_type_id === item.category_type_id
                   );
       
                   if (!type) {
                       type = {
                         category_type_id: item.category_type_id,
                         category_name:item.subcategory,
                         types: []
                       };
                       groupedData[item.category_id].type.push(type);
                     }
                       type.types.push({
                       item_id: item.item_id,
                       item_name: item.item_name
                   });
       
               });
       
               for (const key in groupedData) 
               {
                   if (Object.prototype.hasOwnProperty.call(groupedData, key)) 
                   {
                       result.push(groupedData[key]);
                   }
               }
            res.status(200).json({
                statusCode:200,
                status:true,
                error:false,
                responseData:result
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
module.exports.getAllCategoriesSubcategoriesItemsInSingleObject = async(req,res)=>{
    const sql = `Call category_get_all_subcategories_and_items_based_on_category_id`;
    conn.query(sql,async(err,data)=>{
        if(err){
            res.status(500).json({
                statusCode:500,
                status:false,
                error:true,
                message:err
            })
        }
        else{
        const result = [];
        const groupedData = {}

        data[0].forEach((item) => {
         if (!groupedData[item.category_id]) {
                groupedData[item.category_id] = {
                category_id: item.category_id,
                category_name:item.category_name,
                type: []
                };
            }
        let type = groupedData[item.category_id].type.find(
             (t) => t.category_type_id === item.category_type_id
            );

            if (!type) {
                type = {
                  category_type_id: item.category_type_id,
                  category_name:item.subcategory,
                  types: []
                };
                groupedData[item.category_id].type.push(type);
              }
                type.types.push({
                item_id: item.item_id,
                item_name: item.item_name
            });

        });

        for (const key in groupedData) 
        {
            if (Object.prototype.hasOwnProperty.call(groupedData, key)) 
            {
                result.push(groupedData[key]);
            }
        }
            res.status(200).json({
                statusCode:200,
                status:true,
                error:false,
                responseData:result
            })
        }
    })
}
