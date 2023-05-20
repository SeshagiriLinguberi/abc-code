const conn = require('../config/dbconfig');

exports.insertRoleComponentMapping = async (req,res)=>{
    const sql  = 'Call role_checking(?)'
    const values=[req.body.role_id];
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
            console.log(data.length,"role length");
            
            if(data.length!=0){

                let sql2 = `Call component_checking(?)`;
                const values= [req.body.component_id];
                conn.query(sql2,[values],async(err,data2)=>{
                    if(err){
                        res.status(500).json({
                            statusCode:500,
                            status:false,
                            error:true,
                            msg:err
                        })
                    }
                    else{
                        console.log(data2.length,"component length")
                        if(data2.length!=0){
                            const sql3 = `Call role_component_mapping_check_by_role_component(?)`;
                            const values = [ 
                                             req.body.role_id,
                                             req.body.component_id
                                            ]
                            conn.query(sql3,[values],async(err,data3)=>{
                                if(err){
                                    res.status(500).json({
                                        statusCode:500,
                                        status:false,
                                        error:true,
                                        msg:err
                                    })
                                }
                                else{
                                    console.log(data3.length,data3,"role_component length");
                                    if(data3[0].length==0)
                                    {
                                        const sql4 = `Call role_component_mapping_insert(?)`;
                                        const values = [req.body.role_id,
                                                        req.body.component_id,
                                                        new Date()
                                                        ]
                                        conn.query(sql4,[values],async(err,data4)=>{
                                            if(err){
                                                res.status(500).json({
                                                    statusCode:500,
                                                    status:false,
                                                    error:true,
                                                    msg:err
                                                })
                                            }
                                            else{
                                                
                                                const sql5 =  `Call role_component_mapping_get_details`;
                                                conn.query(sql5,async(err,data5)=>{
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
                                                            responseData:data5[0]
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
                                            msg:"Already component assigned to the role"
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
                                msg:"component not exist"
                            })
                        }
                    }
                })
            }
            else{
                res.status(401).json({
                    statusCode:401,
                    status:false,
                    error:true,
                    msg:"role not exists"
                })
            }
            
        }
    })
}

exports.updateRoleComponentMapping = async (req,res)=>{
    const sql  = 'Call role_checking(?)'
    const values=[req.body.role_id];
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
            if(data.length!=0){
                let sql2 = `Call component_checking(?)`;
                const values= [req.body.component_id];
                conn.query(sql2,[values],async(err,data2)=>{
                    if(err){
                        res.status(500).json({
                            statusCode:500,
                            status:false,
                            error:true,
                            msg:err
                        })
                    }
                    else{
                        if(data2.length!=0){
                            const sql3 = `Call role_component_mapping_update(?)`;
                            const values = [
                                            req.body.newComponent_id,
                                            req.body.role_id,
                                            req.body.component_id,
                                            new Date()
                                            ]
                            conn.query(sql3,[values],async(err,data3)=>{
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
                                        responseData:data3
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
                                msg:"component not exist"
                            })
                        }
                    }
                })
            }
            else{
                res.status(401).json({
                    statusCode:401,
                    status:false,
                    error:true,
                    msg:"role not exists"
                })
            }
            
        }
    })
}

exports.deleteRoleComponentMapping = async(req,res)=>{
    const sql = `Call role_component_mapping_check_by_role_component(?)`;
    const values = [req.body.role_id,
                    req.body.component_id
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
            //console.log("MMM");
            //console.log(data);
            if(data[0].length!=0)
            {
               const sql2 = `Call role_component_mapping_delete(?)`;
               const values = [req.body.role_id,
                req.body.component_id
              ];
               conn.query(sql2,[values],async(err,data2)=>{
                if(err){
                    res.status(500).json({
                        statusCode:500,
                        status:false,
                        error:true,
                        msg:err
                    })
                }
                else{
                    const sql3 = `Call role_component_mapping_get_details`;
                    conn.query(sql3,async(err,data)=>{
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
               })
            }
            else{
                res.status(401).json({
                    statusCode:401,
                    status:false,
                    error:true,
                    msg:"role-component not found "
                })
            }
        }
    })
}

exports.getAllRoleComponentMapping = async(req,res)=>{
    const sql = `Call role_component_mapping_get_details`;
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