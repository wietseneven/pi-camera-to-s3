const AWS = require('aws-sdk');
const fs = require('fs');
const PiCamera = require('pi-camera');
const moment = require('moment');

const BUCKET_NAME = 'pycamera';

const s3bucket = new AWS.S3({
   Bucket: BUCKET_NAME,
 });

function uploadToS3(file) {
 s3bucket.createBucket(function () {
   var params = {
    Bucket: BUCKET_NAME,
    Key: `${file.today}/${file.name}`,
    Body: file.data,
   };
   s3bucket.upload(params, function (err, data) {
    if (err) {
     console.log('error in callback');
     console.log(err);
    }
    console.log('success');
    console.log(data);
    fs.unlink(`${ __dirname }/images/${ file.name }`, (err) => {
      if (err) throw err;
      console.log(`${ __dirname }/images/${ file.name } was deleted`);
    });
   });
 });
}

function takePhotoAndUpload() {
  const now = moment().format('YYYYMMDDkkmmss');
  const today = moment().format('YYYY-MM-DD');
  const file = `${ __dirname }/images/${now}.jpg`;
  const compressed = `${ __dirname }/compressed/`;

  const myCamera = new PiCamera({
    mode: 'photo',
    output: file,
    width: 1280,
    height: 720,
    quality: 60,
    nopreview: true,
  });

  myCamera.snap()
    .then((result) => {
      console.log(result);

      fs.readFile(file, (error, data) => {
        if (error) {
          console.log('Error reading file!', error);
          return;
        }
        uploadToS3({name: `${now}.jpg`, data: data, today: today});
      });
    })
    .catch((error) => {
      console.error('error!', error);
    });
}

setInterval(takePhotoAndUpload, 20000);
