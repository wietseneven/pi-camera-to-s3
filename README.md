# pi-camera-to-s3

Small Node application that takes a photo every `x` seconds with the Raspberry Pi camera, and uploads it to an AWS S3 bucket.

## Requirements
### aws-cli
To connect to the S3 bucket, the application uses the credentials given in the aws-cli. So make sure you've got it installed. Installation instructions are [here](https://aws.amazon.com/cli/).

### Node.js
The application has only been tested on Node.js v10.11.0

### Raspberry Pi with Rapsberry Pi Camera
The needed hardware. Testend on a Raspberry Pi 3 Model B+	with Raspberry Pi Camera Board V2 module.

## Configuration
You can adjust the photo dimensions, photo quality and bucket in the config.js
