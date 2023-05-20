const conn =  require('../config/dbconfig');

module.exports.addComponent = async(req,res)=>{
    const sql = `CALL component_checking(?)`;
    const values1 = [req.body.component_name];
    conn.query(sql,[values1],async(err,data)=>{
        if(err){
            res.status(500).json({
                statusCode:500,
                status:false,
                error:true,
                msg:err
            })
        }
        else{
            console.log(data.length);
            console.log("@@@@@@@@@@@");
            if(data.length==0)
            {
                const sql1 = `CALL components_insert(?)`;
                const values = 
                [
                    req.body.component_name,
                    new Date()
                ];
                conn.query(sql1,[values],async(err,data1)=>{
                    if(err){
                        res.status(500).json({
                            statusCode:500,
                            status:false,
                            error:true,
                            msg:err
                        })
                    }
                    else{
                        const sql2 = `CALL component_details_get`;
                        conn.query(sql2,async(err,data2)=>{
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
                                    responseData:data2
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
                    msg:"Component already exists"
                })
            }
        }
    })
}

module.exports.updateComponent = async(req,res)=>{
    //const sql = `SELECT * FROM components WHERE component_name='${req.body.component_name}'`;
      const sql = `CALL component_details_get_by_name(?)`;
      const values = 
      [
        req.body.component_name
      ];
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
            console.log(data);
            if(data.length!=0)
            {
                //const flag=2;
                const sql2 = `CALL component_update_details(?)`;
                const values = [
                    req.body.new_component_name,
                    new Date(),
                    req.body.component_name
                ];
                conn.query(sql2,[values],async(err,data2)=>{
                    if(err)
                    {
                        res.status(500).json({
                            statusCode:500,
                            status:false,
                            error:true,
                            msg:err
                        })
                    }
                    else
                    {
                       let sql3 = `CALL component_details_get()`;
                       conn.query(sql3,async(err,data3)=>{
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
                            responseData:data3[0]
                        })
                        }
                       })
                    }
                })
            }
            else
            {
                res.status(401).json({
                    statusCode:402,
                    status:false,
                    error:true,
                    msg:"no user found"
                })
            }
        }
    })
}

module.exports.deleteComponent = async(req,res)=>{
    //const sql = `SELECT * FROM components WHERE component_name='${req.body.component_name}'`;
      const sql = `CALL component_details_get_by_name(?)`;
     //const flag=4;
      const values = [
        req.body.component_name
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
            //console.log(data);
            if(data.length!=0)
            {
                //const flag=2;
                const sql2 = `CALL components_delete__by_name(?)`;
                const values = [
                    req.body.component_name
                ];
                conn.query(sql2,[values],async(err,data2)=>{
                    if(err)
                    {
                        res.status(500).json({
                            statusCode:500,
                            status:false,
                            error:true,
                            msg:err
                        })
                    }
                    else
                    {
                       let sql3 = `CALL component_details_get()`;
                       conn.query(sql3,async(err,data3)=>{
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
                            responseData:data3[0]
                        })
                        }
                       })
                    }
                })
            }
            else
            {
                res.status(401).json({
                    statusCode:402,
                    status:false,
                    error:true,
                    msg:"no user found"
                })
            }
        }
    })
}

module.exports.getAllComponents =  async (req,res)=>{
    const sql = `CALL component_details_get()`;
    conn.query(sql,async(err,data)=>{
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
                responseData:data[0]
            })   
        }
    })
}