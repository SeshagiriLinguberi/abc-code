const conn =  require('../config/dbconfig');

module.exports.addComponent = async(req,res)=>{
    const sql = `CALL insert_components(?)`;
    const values = [
        req.body.component_name,
        new Date()
    ]
    conn.query(sql,[values],async(err,data)=>{
        if(err){
            res.status(500).json({
                statusCode:500,
                status:false,
                error:true,
                msg:err
            })
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
}