const AWS = require('aws-sdk')
const fs = require('fs')
const PiCamera = require('pi-camera')
const moment = require('moment')

const c = require('./config')

const s3bucket = new AWS.S3({
  Bucket: c.bucketName,
})

const uploadToS3 = params =>
  new Promise((resolve, reject) => {
    s3bucket.upload(params, (err, data) => {
      if (err) {
        console.error('error in upload', err)
        reject(err)
      }
      console.log('success', data)
      resolve(data)
    })
  })

const readFile = file =>
  new Promise((resolve, reject) => {
    fs.readFile(file, (error, data) => {
      if (error) reject(error)
      resolve(data)
    })
  })

const deleteFile = file =>
  new Promise((resolve, reject) => {
    fs.unlink(file, (err) => {
      if (err) reject(err)
      resolve(`${ file } was deleted`)
    })
  })

const takePhotoAndUpload = () => {
  const today = moment().format('YYYY-MM-DD')
  const fileName = `${moment().format('YYYYMMDDkkmmss')}.jpg`
  const file = `${ __dirname }/images/${fileName}`

  const myCamera = new PiCamera({
    mode: 'photo',
    output: file,
    nopreview: true,
    ...c.camera,
  })

  myCamera.snap()
    .then(() => readFile(file))
    .then(data => uploadToS3({
        Bucket: c.bucketName,
        Key: `${today}/${fileName}`,
        Body: data,
      })
    )
    .then(() => deleteFile(fileName))
    .catch((error) => {
      console.error('error!', error)
    })
}

setInterval(takePhotoAndUpload, c.interval)
