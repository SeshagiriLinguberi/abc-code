const conn = require('../config/dbconfig');
const jsonwebToken = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const otpGenerator = require('generate-otp');
const readline = require('readline');
const bcrypt = require('bcrypt');
const validations = require('../utils/validations');
exports.getAllUsers = async (req,res)=>{
    let sql =`CALL user_get_all_user_details()`;
    conn.query(sql,(err,data)=>{
        if(err){
            res.status(500).json({
                statusCode:500,
                status:false,
                error:true,
                message:err.sqlMessage
            })
        }
        else 
        {
            console.log(data[0]);
            res.status(200).json({
                statusCode:200,
                status:true,
                error:false,
                responseData:data[0]
            })
        }
    })
}

module.exports.insertData = async (req, res) => {
    const email_id=req.body.email_id
    //email checking 
    const emailChecking = await validations.verifyEmail(email_id);
    console.log(emailChecking);  
    console.log(emailChecking[0].length);
    
    if(emailChecking[0].length == 0)
    {   
        //phone_number checking
        const phoneNumber= req.body.phone_number;
        const phoneNumberChecking = await validations.verifyPhoneNumber(phoneNumber);
        console.log(phoneNumberChecking);

        if(phoneNumberChecking[0].length==0)
        {
            const saltRounds=10;
            let myPlaintextPassword=req.body.password;
            const salt =await bcrypt.genSalt(saltRounds);
            myPlaintextPassword = await bcrypt.hash(myPlaintextPassword, salt);
            const sql1 = `CALL user_insert_details (?)`;
            let values = [req.body.user_name,
                    req.body.first_name,
                     req.body.last_name,
                    req.body.full_name,
                    req.body.date_of_birth,
                    req.body.phone_number,
                    req.body.email_id,
                    myPlaintextPassword,
                    new Date()];
                conn.query(sql1, [values], async(err, data) => {
                if (err){
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
                    const getAllUserDetails = await validations.getAllUserDetails();
                    res.status(200).json({
                        statusCode:200,
                        status:true,
                        error:false,
                        responseData:getAllUserDetails[0]
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
                      message:"phone already exist"
            });
         }
}
else{
    res.status(401).json(
        {
             statusCode:401,
             status:true,
             error:false,
             message:"EmailId already exist"
         });
    }      

}


module.exports.getUserById= async (req,res)=>{
    const user_id= req.body.user_id;
    const checkUserById = await validations.getUserDetailsById(user_id);
    console.log("checkUserById::::",checkUserById);
    if(checkUserById.length!=0)
    {
        res.status(200).json({
            statusCode:200,
            status:true,
            error:false,
            responseData:checkUserById[0]
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

module.exports.deleteUserById = async (req,res)=>{
    const user_id = req.body.user_id;
 
    const checkUserById = await validations.getAllUserDetails(user_id);
    if(checkUserById.length!=0)
    {
        const userId= req.body.user_id;
        const deleteUser = await validations.deleteUserById(userId);
                    if(deleteUser.length!=0)
                    {
                        res.status(200).json({
                            statusCode:200,
                            status:true,
                            error:false,
                            responseData:deleteUser[0]
                        });
                    }
    }
    else{
        res.status(401).json({
                 statusCode:401,
                 status:false,
                 error:true,
                 message:"no users found"
             });
    }  
}

module.exports.updateUser = async (req,res)=>{ 
    const email_id = req.body.email;
    const validateUserByEmailId= await validations.verifyEmail(email_id);
    if(validateUserByEmailId[0].length!=0)  {
        const saltRounds=10;
        let myPlaintextPassword=req.body.password;
        const salt =await bcrypt.genSalt(saltRounds);
        myPlaintextPassword = await bcrypt.hash(myPlaintextPassword, salt);
        let values = [
            req.body.user_name,
            req.body.first_name,
            req.body.last_name,
            req.body.full_name,
            req.body.date_of_birth,
            req.body.phone_number,
            req.body.email,
           myPlaintextPassword,
            new Date(),
            req.body.user_id
        ];
        const updateUser =await validations.updateUserDetails(values);
        res.status(200).json({
            statusCode:200,
            status:true,
            error:false,
            responseData:updateUser[0]
        })
    }
    else
    {
        res.status(401).json({
            statusCode:401,
            status:false,
            error:true,
            message:"no users found"
        });
    }                     
};

module.exports.userLogin= async (req,res)=>{  
    const candidatePassword = req.body.password;
    const sql  =`Call user_get_details_by_emailId(?)`;
    const values =[req.body.email_id];

    conn.query(sql,[values],async(err,data)=>{
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
            console.log(data.length,"length");
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
                const match =await bcrypt.compare(candidatePassword,data[0][0].password);
                console.log("match:::",match);
                if(match)
                {
                    // const payload = 
                    //   {
                    //     exp: Math.floor(Date.now() / 1000) + 60
                    //   };
                      
                      // Generate the JWT
                      //const token = jwt.sign(payload, 'your_secret_key');
                    const token = jsonwebToken.sign({userdata:data},"secretkey"/*,{expiresIn:'60s'}*/);
                    data[0][0].token=token;
                    let values = [
                        req.body.email_id,
                        token,
                         new Date()
                       ];
                       const sql1 = `Call user_login_into_userLoginTable(?)`;
                        conn.query(sql1,[values],async(err,data1)=>{
                            if(err){
                                res.status(500).json({
                                    statusCode:500,
                                    status:true,
                                    error:false,
                                    message:err
                                })
                            }
                            else{
                                async function componentInfo1(roleId) {
                                    let output = [];
                                    return new Promise(async(resolve, reject) => {
                                      const sql = `Call user_get_role_and_component_Details(?)`;
                                      conn.query(sql, [roleId], (err, data) => {
                                        if (err) {
                                            res.status(500).json({
                                                statusCode:500,
                                                status:false,
                                                error:true,
                                                message:err
                                            })
                                        } 
                                        else {
                                            console.log("data:::",data.length)
                                          let result = {};
                                          let output1;
                                          let finalresult2 =  data[0].map(obj => {
                                          const { role_id,role_name, ...rest } = obj;
                                          if (!result[role_id]) 
                                          {
                                              output1=[{role_id,role_name, types: [] }];
                                              output1[0].role_id=(role_id);
                                              output1[0].role_name=role_name;
                                          }
                                                  
                                          output1[0].types.push(rest);
                                          return output1[0];
                                      });
                                      const result3 = Object.values(finalresult2.reduce((acc, { role_id,role_name, types }) =>{
                                          if (!acc[role_id]) 
                                            {
                                               acc[role_id] = {role_id,role_name,types: [] };
                                           }
                                               acc[role_id].types = acc[role_id].types.concat(types);
                                               
                                               return acc;
                                        }, {}));
                                          output = result3;
                                          resolve(output);
                                        }
                                      });
                                    });
                                  };
                                const values = data[0][0].user_id;
                                console.log("user _id ",values); 
                                const componentInfo =  await componentInfo1(values);
                                data[0][0].roleInfo=componentInfo;
                                      res.status(200).json({
                                       statusCode:200,
                                       status:true,
                                       error:false,
                                       responseData:data[0]
                                   })
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


module.exports.userLogin2 = ((req,res)=>{
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

module.exports.forgetPassword = async (req,res)=>{
   const emailId = req.body.email_id;
   const checkUserByEmail = await validations.verifyEmail(emailId);
   if(checkUserByEmail[0].length!=0)
   {
    let newPassword=req.body.new_password;
    const saltRounds=10;
    const salt = await bcrypt.genSalt(saltRounds);
    newPassword = await bcrypt.hash(newPassword,salt);
    
    res.status(200).json({
        statusCode:200,
        status:true,
        error:false,
        responseData:"Password updated successfully "
    })
    }
    else{
        res.status(401).json({
                 statusCode:401,
                 status:true,
                 error:false,
                 message:"user doesnot exists please enter a valid email address...."
    });}   
}

module.exports.changePassword = async(req,res)=>{
    const checkUserByEmail = await validations.verifyEmail(req.body.email_id);
    console.log("checkUserByEmail::::",checkUserByEmail.length);
            if(checkUserByEmail[0].length!=0)
            {
                const match =await bcrypt.compare(req.body.password,checkUserByEmail[0].password);
                if(match)
                {
                    let newPassword = req.body.new_password;
                    const saltRounds=10;
                    const salt= await bcrypt.genSalt(saltRounds);
                    newPassword=await bcrypt.hash(newPassword,salt);
                    const sql = `Call users_update_password(?)`;
                    const values = [newPassword,req.body.email_id];
                    conn.query(sql,[values],async (err,data)=>{
                        if(err){
                            res.status(500).json({
                                statusCode:500,
                                status:false,
                                error:true,
                                message:err
                            })
                        }
                        else{
                            res.status(200).json({
                                statusCode:200,
                                status:true,
                                error:false,
                                message:"Password changed successfully"
                            })
                        }
                    })
                }
                else{
                    res.status(401).json({
                        statusCode:401,
                        status:false,
                        error:true,
                        message:"Password not matched, please enter a valid password"
                    })
                }
            }
            else{
                res.status(401).json({
                    statusCode:401,
                    status:false,
                    error:true,
                    message:'no user found ....'
                })
            }
}

module.exports.forgetPassword2 = async (req,res)=>{
    
    const  checkEmail = await validations.verifyEmail(req.body.email_id);
    let expireTime=0;
    if(checkEmail.length!=0){
        console.log("check email:::",checkEmail);
        setInterval(async()=>{
        //set time for expire for otp 
        const expiretime =  function AddMinutesToDate(date,minutes)  {
                              return new Date(date.getTime() + minutes*60000);
                             }
        // const startTime = new Date().getMinutes();
        //generate otp
        const otp =await otpGenerator.generate(6, { digits: true, alphabets: false, upperCase: false, specialChars: false });
        console.log(`Your OTP is ${otp}`);
        //otp start time
        const created_at =await expiretime(new Date(),0);
        //otp expire time
        const expires_at =await expiretime(new Date(),1);
        console.log("expires at:::",expires_at)
        expireTime=expires_at;
        const values = [checkEmail[0].email_id,otp,created_at,expires_at];
        const sql =  `Call  user_otp_verification_add_otp(?)`;
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
                console.log("updated data into user_otp_verification table");
                
            }
        })
    },40000)
        //get the otp from database
         const sql = `Call user_otp_verification_table_get_otp(?)`;
         console.log("expireTime::::",expireTime);
         const values = [req.body.email_id]
         conn.query(sql,[values],async(err,data)=>{
            if(err){
                res.status(500).json({
                    statusCode:500,
                    status:false,
                    error:true,
                    message:err
                });
            }
            else{
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
                    console.log(data[0][0].otp)
                    let mailOptions = { 
                     from: 'nodejssentmail45@gmail.com',
                     to: 'seshagirilinguberi45@gmail.com',
                     subject: 'OTP for Verification',
                     text: `Your OTP is ${data[0][0].otp}.`
                    };
                     // Send the email
                     transporter.sendMail(mailOptions,async (error, info) => {
                    if (error) {
                         console.log(error);
                    } 
                    else {
                        console.log('Email sent: ');
                        const rl = readline.createInterface({
                            input: process.stdin,
                            output: process.stdout
                        });
                     // Ask the user to input the OTP
                     rl.question('Enter the OTP: ', async(userInput) => {

                    //     const date2 = new Date();
                    //     const lastTime = date2.getMinutes();
                    //     let difference = lastTime-startTime;
                    // console.log(difference,"difference");
                   //Compare the user input with the generated OTP
                    console.log("otp for validation",data[0][0].otp)
                    console.log("user inout:::",userInput);
                    console.log("database otp:::",data[0][0].otp)
                      if (userInput === data[0][0].otp) 
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
                                         responseData:"Password updated successfully "
                                     })
             
                                 }
                             });
                             
                         } 
                    else {
                          console.log('OTP verification failed');
                          res.status(401).json({
                             statusCode:401,
                             status:false,
                             error:true,
                             msg:"otp verification failed"
                         })
                         }
         
                      // Close the readline interface
                      rl.close();
                        
                    });
                     }
                  });
                 
                }
         })
    }
    else {
        console.log("error")
    }                  
                // setInterval(async()=>{
                //             // const sql5 =  `INSERT INTO user_otp_verification (email_id,otp,created_at,expires_at) VALUES('${data[0].email_id}','${otp}','${created_at}','${expires_at}') ON DUPLICATE KEY UPDATE otp='${otp}',created_at ='${created_at}',expires_at = '${expires_at}'`;
                //             //sql1=`INSERT INTO user_login_table (email_id,token,login_at_datetime) VALUES(?,token,NOW()) ON DUPLICATE KEY UPDATE  login_at_datetime =  NOW(),token='${token}'`;
                //             conn.query(sql5,async(err,data)=>{
                //                 if(err)
                //                 {
                //                     res.status(500).json(
                //                         {
                //                              statusCode:500,
                //                              status:false,
                //                              error:true,
                //                              message:err
                //                          });
                //                 }
                //                 else{
                //                     console.log("updated data into user_otp_verification table");
                //                 }
                //             })
                           
                //  // Ask the user to input the OTP
                // rl.question('Enter the OTP: ', async(userInput) => {
                //     const date2 = new Date();
                //     const lastTime = date2.getMinutes();
                //     let difference = lastTime-startTime;
                //     console.log(difference,"difference");
                //     // Compare the user input with the generated OTP
                //       if (userInput === otp && difference<=10) 
                //          {
                //              console.log('OTP verification successful');
                //              let newPassword=req.body.new_password;
                //              const saltRounds=10;
                //              const salt = await bcrypt.genSalt(saltRounds);
                //              newPassword = await bcrypt.hash(newPassword,salt);
                //              const  sql1= `UPDATE users SET password = ?   WHERE email_id='${req.body.email_id}'`;
                //              console.log(newPassword);
                //              conn.query(sql1,[newPassword],(err,data1)=>{
                //                  if(err)
                //                  {
                //                      res.status(500).json(
                //                          {
                //                               statusCode:500,
                //                               status:false,
                //                               error:true,
                //                               message:err
                //                           });
                //                  }
                //                  else
                //                  {
                //                      console.log(data1[0]);
                //                      res.status(200).json({
                //                          statusCode:200,
                //                          status:true,
                //                          error:false,
                //                          responseData:"Password updated successfully "
                //                      })
             
                //                  }
                //              });
                             
                //          } 
                //     else {
                //           console.log('OTP verification failed');
                //           res.status(401).json({
                //              statusCode:401,
                //              status:false,
                //              error:true,
                //              msg:"otp verification failed"
                //          })
                //          }
         
                //       // Close the readline interface
                //       rl.close();
                //  });
                // },1000*60);
}

module.exports.forgetPassword3 = async (req,res)=>{
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
    user: 'nodejssentmail45@gmail.com',
    pass: 'sliabuyslamxfxki'
    }
    });

  // Generate a random 6-digit OTP
  function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000);
  }

  // Function to send OTP to user's email
  function sendOTP(email, otp) {
    const mailOptions = { 
     from: 'nodejssentmail45@gmail.com',
     to: email,
     subject: 'OTP for Verification',
     text: `Your OTP is ${otp}.`
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  }
  
  // Verify the OTP entered by the user
  function verifyOTP(email, otp, callback) {
    const query = `SELECT * FROM user_otp_verification WHERE email_id = '${email}' AND otp = '${otp}' AND expires_at > NOW()`;
    conn.query(query, function (error, results) {
      if (error) {
        console.log(error);
        callback(false);
      } else {
        if (results.length === 1) {
          callback(true);
        } else {
          callback(false);
        }
      }
    });
  }
  
  // Reset the user's password
  function resetPassword(email, otp, newPassword) {
    verifyOTP(email, otp, async function (isValid) {
      if (isValid) {
        console.log('OTP verification successful!');
        const saltRounds=10;
        const salt = await bcrypt.genSalt(saltRounds);
        newPassword = await bcrypt.hash(newPassword,salt);
        const updateQuery = `UPDATE users SET password = '${newPassword}' WHERE email_id = '${email}'`;
        conn.query(updateQuery, function (error, results) {
          if (error) {
            console.log(error);
          } else {
            console.log('Password reset successful!');
            res.status(200).json({
                statusCode:200,
                status:true,
                error:false,
                responseData:"password reset successful!"
            })
          }
        });
      } else {
        console.log('Invalid OTP or expired OTP');
        res.status(500).json({
            statusCode:500,
            status:false,
            error:true,
            message:"Invalid OTP or expired OTP"
        })
      }
    });
  }
  
  // Generate and send OTP to the user's email
  function forgotPassword(email) {
    const otp = generateOTP();
    const otpStartTime = new Date(Date.now());
    const otpExpires = new Date(Date.now() + 60000); // Set OTP expiration time to 1 minute
    //const query = `UPDATE users SET otp = '${otp}', otp_expires = '${otpExpires}' WHERE email = '${email}'`;
    const query = `CALL user_otp_verification_add_otp(?)`;
    const values = [req.body.email_id,otp,otpStartTime,otpExpires];
    conn.query(query,[values], function (error, results) {
      if (error) {
        res.status(500).json({
            statusCode:500,
            error:true,
            status:false,
            msg:error
        })
      } else {
        console.log("otp:::",otp);
        sendOTP(email, otp);
        console.log('OTP sent successfully!');
        promptResetPassword(email,req.body.password);
      }
    });
  }
  
  // Prompt user to enter OTP and new password
  function promptResetPassword(email,) {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
  
    rl.question('Enter the OTP: ', function (otp) {
     // rl.question('Enter the new password: ', 
     // function (newPassword) {
        resetPassword(email, otp,req.body.new_password);
        rl.close();
      //}
      //);
    });
  }
  
  const userEmail = req.body.email_id;
  forgotPassword(userEmail);
}


