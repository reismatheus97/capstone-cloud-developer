import * as AWS_SDK from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { S3Handler, S3Event } from 'aws-lambda'
import 'source-map-support/register'

const AWS = AWSXRay.captureAWS(AWS_SDK)
const docClient = new AWS.DynamoDB.DocumentClient()
const toduesTable = process.env.TODUES_TABLE
const bucketName = process.env.IMAGES_S3_BUCKET

export const handler: S3Handler = async (event: S3Event) => {
  for (const record of event.Records) {
    const key = record.s3.object.key
    let attachmentUrl = `https://${bucketName}.s3.amazonaws.com/${key}`

    let userId = key.split("___")[0]
    let todueId = key.split("___")[1]
    userId = decodeURIComponent(userId)
    let params = {
      TableName: toduesTable,
      Key: {
        "userId": userId,
        "todueId": todueId
      },
      UpdateExpression: "set attachmentUrl = :attachmentUrl",
      ExpressionAttributeValues: {
        ':attachmentUrl': attachmentUrl,
      }
    }

    try {
      await docClient.update(params).promise()
    } catch (error) {
      console.error(error)
    }
  }
}