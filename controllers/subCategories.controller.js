const conn = require('../config/dbconfig');

exports.getAllSubAllCategories = async (req,res)=>{
    const sql = `Call sub_category_get_all_sub_categories_and_items(?)`;
    const flag =1;
    conn.query(sql,[flag],(err,data)=>{
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
                responseData:data[0]
            })
        }
    })
}

exports.addSubCategories = async (req, res) => {
    const sql1 = `Call sub_category_category_type_name_checking(?)`;
    let values = [
        req.body.category_type_name,
        req.body.category_id,
        new Date()
            ]                   
   conn.query(sql1, [values], async(err, data) => {
    if (err) {
        res.status(500).json(
        {
             statusCode:500,
             status:false,
             error:true,
             message:err.message
         });
    } 
    else 
    {
        res.status(200).json({
         statusCode:200,
         status:true,
         error:false,
         responseData:data[0]
        });
}                     
})                                                
                   
}
exports.getSubCategoryById = async (req,res)=>{
    const sql =`Call sub_category_get_sub_category_by_id(?)`;
    const flag =1;
    const values = [req.body.category_type_id,flag];
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
            res.status(200).json({
                statusCode:200,
                status:true,
                error:false,
                responseData:data[0]
            })
        }             
})
}

exports.deleteSubCategoryById = async (req,res)=>{
    const sql = `Call sub_category_get_sub_category_by_id(?)`;
    const flag=2;
    const values  = [req.body.category_type_id,flag];
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
                            res.status(200).json({
                                        statusCode:200,
                                        status:true,
                                        error:false,
                                        responseData:data[0]
                                    });
                            }
                    })
}
exports.updatesubCategoryById = async (req,res)=>{
            const sql =`Call sub_category_update_details(?)`; 
            let values = [
                    req.body.category_type_new_name,
                    req.body.category_id,
                    req.body.category_type_id];
                conn.query(sql,[values],(err,data)=>{
                    if(err){
                        res.status(500).json({
                            statusCode:500,
                            status:false,
                            error:true,
                            message:err.message
                        });
                    }
                    else
                    {                       
                        res.status(200).json({
                            statusCode:200,
                            status:true,
                            error:false,
                            responseData:data[0]
                        });       
                    }
                });
};

exports.getAllItems = async (req,res)=>{
    const sql = `Call sub_category_get_all_items`;
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
                responseData:data[0]
            })
        }
    })
}

exports.getAllItemsByGroup = async (req,res)=>{
     const sql = `Call sub_category_get_all_sub_categories_and_items`;
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
            console.log("data::::",data.length);
            let result = {};
            let output;
            let finalresult =  data[0].map(obj => {
            const { category_id,category_type_id,category_type_name, ...rest } = obj;
            if (!result[category_type_id]) 
            {
                output=[{category_id,category_type_id,category_type_name, types: [] }];
                output[0].category_type_id=(category_type_id);
                output[0].category_type_name=category_type_name;
                output[0].category_id=(category_id);
            }
            output[0].types.push(rest);
            return output[0];
        });
            const result2 = Object.values(finalresult.reduce((acc, { category_type_id,category_id,category_type_name, types }) => {
           if (!acc[category_type_id]) 
          {
            
                acc[category_type_id] = { category_type_id,category_id,category_type_name, types: [] };
          }
                acc[category_type_id].types = acc[category_type_id].types.concat(types);
                return acc;
         }, {}));
         
                res.status(200).json({
                statusCode:200,
                status:true,
                error:false,
                responseData:result2
            })
        }
    })
}

