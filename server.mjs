import express from "express";
import fs, { readFile } from "fs";
import * as tf from '@tensorflow/tfjs';
import * as tfnode from '@tensorflow/tfjs-node';

import multer from 'multer';
import bodyParser from 'body-parser';
import fs_s from 'fs'
import path from "path";

const app = express();

app.use(bodyParser.json());

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
       cb(null, 'uploads');
    },
    filename: function (req, file, cb) {
       cb(null, 'sample'+'.png');
    }
 });
 var upload = multer({ storage: storage });

const port = 9000;

const model = await tf.loadGraphModel('https://raw.githubusercontent.com/yuvaraj11-01/Cassava-Leaf-Disease-Classification-model/main/TFJS_files/model.json');

app.get("/",(req,res)=>{
    res.json({message:"From Cassava Leaf Disease Classification API"});
});

app.post("/predict", upload.single('image'),(req,res)=>{
    //console.log(__dirname);
    fs_s.readFile('./uploads/sample.png',function(err,data){
        if(err) throw err;
        var img_sam = tfnode.node.decodeGif(data);
        var tf_image = tf.cast(img_sam,"float32")
        console.log( tf_image );
         
        console.log(model.inputs);
        var output = model.predict(tf_image);
        //output.print();
        var result = output.arraySync();
        res.send(apiResponse({'result': result[0]}));

    });
    

});

function apiResponse(results){
    return JSON.stringify({"status": 200, "error": null, "response": results});
}

app.listen(port,()=>{
    console.log(`Starting server on port ${port}`);

});
