const conn = require('../config/dbconfig');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

exports.uploadImage = async(req,res)=>{
        const { originalname, buffer } = req.file;
        const sql = 'INSERT INTO images (image_name, data) VALUES (?, ?)';
        const values = [originalname, buffer];
        
        conn.query(sql, values, (err, result) => {
          if (err) throw err;
          res.status(200).json({
            data:result
          });
        });
      
}