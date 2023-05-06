const conn = require('../config/dbconfig');
const jsonwebToken = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const otpGenerator = require('generate-otp');
const readline = require('readline');
//const utils = require('../utils/validations');
const bcrypt = require('bcrypt');
// const { generate } = require('generate-otp');
//const { connect } = require('../routers/api/user.router');

exports.getAllUsers = async (req,res)=>{
    let sql = `SELECT* FROM users WHERE log_state=1`;
    conn.query(sql,(err,data)=>{
        if(err){
            res.status(500).json({
                statusCode:500,
                status:false,
                error:true,
                message:"no users found"
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
    let sql = `select * from users where email_id = '${req.body.email_id}'`
    await conn.query(sql,async(err,result)=>{
        console.log(result);
        if(err){
          
       }else{
        
          if(result.length == 0){
            let sql3 = `select * from users where phone_number = '${req.body.phone_number}'`
            conn.query(sql3,async (err,result)=>{
                if(err){

                }else{
                    if(result.length==0){
                      
                            const saltRounds=10;
                        let myPlaintextPassword=req.body.password;
                        const salt =await bcrypt.genSalt(saltRounds);
                        myPlaintextPassword = await bcrypt.hash(myPlaintextPassword, salt);
                       console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@",myPlaintextPassword);

                        const sql1 = `INSERT INTO users (user_name,first_name,last_name,full_name,date_of_birth,phone_number,email_id,password,created_datetime) VALUES (?)`;
                        let values = [
                                req.body.user_name,
                                req.body.first_name,
                                 req.body.last_name,
                                req.body.full_name,
                                req.body.date_of_birth,
                                req.body.phone_number,
                                req.body.email_id,
                                myPlaintextPassword,
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
                                let sql2 = `SELECT * FROM users WHERE log_state=1`;
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
                                                message:"phone already exist"
                                            });
                                   }
                }              
                });
            }else{
                res.status(401).json(
                    {
                         statusCode:401,
                         status:true,
                         error:false,
                         message:"EmailId already exist"
                     });
            }

          }
       })
   }
exports.getUserById= async (req,res)=>{
    let id;
    conn.query('SELECT user_id FROM users WHERE user_id = '+req.body.user_id,(err,data)=>{
        if(!err)
        {
            id=data.user_id;
            console.log(data.user_id);
        }
        else
        {
            throw err;
        }
    })
    if(true)
    {
        let userid = req.body.user_id;
        let sql = 'SELECT * FROM users WHERE log_state=1 AND user_id ='+userid;
        conn.query(sql,userid,(err,data)=>{
            if(err){
                res.status(500).json({
                    statusCode:500,
                    status:false,
                    error:true,
                    message:"no users found"
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

exports.deleteUserById= async (req,res)=>{
    // let userid= req.body.user_id;
    let username;
    let email;
    conn.query('SELECT email_id,user_name FROM users',(err,data)=>{
        if(!err){
            username=data.user_name;
             email=data.email_id;
        }
        else{
            throw err;
        }
    })
    if(req.body.email_id==email&&req.body.user_name==username)
    {
        let sql = `UPDATE users SET log_state = 3  WHERE user_id = ${ req.body.user_id}`
        conn.query(sql,(err,data)=>{
            if(err){
                res.status(500).json({
                    statusCode:500,
                    status:false,
                    error:true,
                    message:"no users found"
                });
            }
            else{
           
                let sql1 = `SELECT * FROM users WHERE log_state=1`;
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
            message:"no users found"
        })
    }
  
}
exports.updateUser = async (req,res)=>{
    let username;
    let email;
    conn.query('SELECT email_id,user_name FROM users',(err,data)=>{
        if(!err)
        {
            username=data.user_name;
            email=data.email_id;
        }
        else
        {
            throw err;
        }
    })
    if(req.body.email_id==email&&req.body.user_name==username)
    {
    let sql = `UPDATE users SET user_name = ?,first_name = ?,last_name = ?,full_name = ?,date_of_birth = ?,phone_number = ?,email_id = ?,password = ?,updated_datetime = ? WHERE user_id = ? AND log_state=1`;
    
    let values = [
        req.body.user_name,
        req.body.first_name,
        req.body.last_name,
        req.body.full_name,
        req.body.date_of_birth,
        req.body.phone_number,
        req.body.email,
        req.body.password,
        new Date(),
        req.body.user_id
    ]
    conn.query(sql,values,(err,data)=>{
        if(err){
            res.status(500).json({
                statusCode:500,
                status:false,
                error:true,
                message:"no users found"
            });
        }
        else
        {
            let sql1 = `SELECT * FROM users WHERE log_state=1`;
            conn.query(sql1,(err,result)=>{
                if(err){
                    throw err;
                }
                else{
                    res.status(500).json({
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
        message:"no users found"
    });
}
};


async function userValidationCheck (req,res){
  
    let sql = `select * from users where email_id = '${req.body.email_id}'`
     await conn.query(sql,async(err,result)=>{
         if(err){
           
        }else{
            console.log("result::",result);
            d1 = result
        //    return result
        }
    }
    )
    return d1
   
}
exports.userLogin= async (req,res)=>{   
    const email = req.body.email_id;
    const candidatePassword = req.body.password;
    let sql = `SELECT* FROM users WHERE email_id='${email}'`
    conn.query(sql,async(err,data)=>{
        if(err)
        {
            res.status(500).json({
                statusCode:500,
                status:true,
                error:false,
                message:err
            })
        }
        else
        {
            console.log(data[0]);
            if(data.length==0)
            {
                res.status(401).json({
                    statusCode:401,
                    status:true,
                    error:false,
                    message:"Enter a valid email address..."
                })
            }
            else
            {
                const match =await bcrypt.compare(candidatePassword,data[0].password);
                console.log(match);
                if(match)
                {
                    let token = jsonwebToken.sign({userdata:data},"new data");
                    console.log(token);
                    data[0].token=token;
                   
                    let sql1;
                    let values = [
                        req.body.email_id                     
                       ]
                        sql1=`INSERT INTO user_login_table (email_id,token,login_at_datetime) VALUES(?,token,NOW()) ON DUPLICATE KEY UPDATE  login_at_datetime =  NOW(),token='${token}'`;
                   
                    // const sql1=`INSERT INTO user_login_table (email_id,token,login_at_datetime) VALUES(?)`;
                     
                    //const sql = `INSERT INTO users (email, last_login_time)VALUES (?, NOW()) ON DUPLICATE KEY UPDATE last_login_time = NOW()`;
                    
                    
                    conn.query(sql1,[values],(err,dataa)=>{
                     if(err)
                     {
                         res.status(500).json({
                             statusCode:500,
                             status:true,
                             error:false,
                             message:err
                         })
                     }
                     else
                     {
                        console.log("mdbcck88888888888888888",data[0]);
                        
                         res.status(200).json({
                             statusCode:200,
                             status:true,
                             error:false,
                             responseData:data[0]
                             
                         });
                     }
                    })
                    
                }
                else
                {
                    res.status(401).json({
                        statusCode:401,
                        status:true,
                        error:false,
                        message:"Enter a valid password..."
                    })
                }
            }
        }
    })
}


exports.userLogin2 = ((req,res)=>{
        let sql = `SELECT * FROM user_login_table WHERE email_id='${req.body.email_id}'`;
        conn.query(sql,(err,data)=>{
            if(err)
            {
                res.status(500).json({
                    statusCode:500,
                    status:true,
                    error:false,
                    message:err
                })
            }
            else
            {
                if(data.length==0)
                {
                        let token = jsonwebToken.sign({userdata:data},"new data");
                       const sql1=`INSERT INTO user_login(email_id,token,login_at_datetime) VALUES(?)`;
                       const values = [
                        req.body.email_id,
                        token,
                        new Date()
                       ]
                       conn.query(sql1,[values],(err,data)=>{
                        if(err)
                        {
                            res.status(500).json({
                                statusCode:500,
                                status:true,
                                error:false,
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
                            });
                        }
                       })
                }
                else
                {
                    res.status(401).json({
                        statusCode:401,
                        status:true,
                        error:false,
                        message:"email id already exists..."
                    })
                }
            }
        })
})

exports.forgetPassword = async (req,res)=>{
    let sql = `SELECT * FROM users WHERE email_id='${req.body.email_id}'`
    conn.query(sql,async(err,data)=>{
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
            if(data.length!=0)
            {
                console.log(data.email_id)
                let newPassword=req.body.new_password;
                const saltRounds=10;
                const salt = await bcrypt.genSalt(saltRounds);
                newPassword = await bcrypt.hash(newPassword,salt);
                const  sql1= `UPDATE users SET password = ?   WHERE email_id='${req.body.email_id}'`;
                console.log(newPassword);
                conn.query(sql1,[newPassword],(err,data1)=>{
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
                        console.log(data1[0]);
                        res.status(200).json({
                            statusCode:200,
                            status:true,
                            error:false,
                            responseData:"Password updated successfully "
                        })

                    }
                });
            }
            else
            {
                res.status(401).json(
                    {
                         statusCode:401,
                         status:true,
                         error:false,
                         message:"user doesnot exists please enter a valid email address...."
                     });
            }
            
        }
    })
}


exports.changePassword = async(req,res)=>{
    console.log(req.body.password);
    const sql = `SELECT * FROM users WHERE email_id='${req.body.email_id}'`
    conn.query(sql,async(err,data)=>{
        if(err)
        {
            res.status(500).json({
                statusCode:500,
                status:false,
                error:true,
                message:true
            })
        }
        else
        {
            console.log(data);
            if(data.length!=0)
            {
                console.log(data[0]);
                const sql1 = `SELECT * FROM users WHERE email_id='${req.body.email_id}'`;
                conn.query(sql1,async(err,data1)=>{
                    const match =await bcrypt.compare(req.body.password,data1[0].password);
                    if(match)
                    {
                        let newPassword = req.body.new_password;
                        const saltRounds=10;
                        const salt= await bcrypt.genSalt(saltRounds);
                        newPassword=await bcrypt.hash(newPassword,salt);
                        const sql3 = `UPDATE users SET password= '${newPassword}' WHERE email_id='${req.body.email_id}'`;

                        conn.query(sql3,async (err,data3)=>{
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
                                    message:"Password changed successfully"
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
                            message:"Password not matched, please enter a valid password"
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
                    message:'no user found ....'
                })
            }
        }
    })
}

exports.forgetPassword2 = async (req,res)=>{
    let sql = `SELECT * FROM users WHERE email_id='${req.body.email_id}'`
    conn.query(sql,async(err,data)=>{
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
            if(data.length!=0)
            {
                // Generate an OTP
                const otp = otpGenerator.generate(6, { digits: true, alphabets: false, upperCase: false, specialChars: false });
                console.log(`Your OTP is ${otp}`);
                // Create a transporter object using SMTP transport
                let transporter = nodemailer.createTransport({
                    host: 'smtp.gmail.com',
                    port: 587,
                    secure: false,
                    auth: {
                        user: 'nodejssentmail45@gmail.com',
                        pass: 'sliabuyslamxfxki'
                    }
                });
                
                // Configure the email options
                let mailOptions = {
                    from: 'nodejssentmail45@gmail.com',
                    to: 'samalajashwanthjk@gmail.com',
                    subject: 'OTP for Verification',
                    text: `Your OTP is ${otp}.`
                };
                
                // Send the email
                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Email sent: ' + info.response);
                    }
                });
                const rl = readline.createInterface({
                    input: process.stdin,
                    output: process.stdout
                });
                                        
                // Ask the user to input the OTP
                rl.question('Enter the OTP: ', async(userInput) => {
               // Compare the user input with the generated OTP
                 if (userInput === otp) 
                    {
                        console.log('OTP verification successful');
                        let newPassword=req.body.new_password;
                        const saltRounds=10;
                        const salt = await bcrypt.genSalt(saltRounds);
                        newPassword = await bcrypt.hash(newPassword,salt);
                        const  sql1= `UPDATE users SET password = ?   WHERE email_id='${req.body.email_id}'`;
                        console.log(newPassword);
                        conn.query(sql1,[newPassword],(err,data1)=>{
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
                                console.log(data1[0]);
                                res.status(200).json({
                                    statusCode:200,
                                    status:true,
                                    error:false,
                                    responseData:"Password updated successfully "
                                })
        
                            }
                        });
                        
                    } 
               else {
                     console.log('OTP verification failed');
                    }
    
    // Close the readline interface
    rl.close();
});
            }
            else
            {
                res.status(401).json(
                    {
                         statusCode:401,
                         status:true,
                         error:false,
                         message:"user doesnot exists please enter a valid email address...."
                     });
            }
            
        }
    })
}
