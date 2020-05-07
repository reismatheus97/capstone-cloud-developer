import * as AWS_SDK from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import * as moment from 'moment'
import { TodueItem } from '../models/TodueItem'

const AWS = AWSXRay.captureAWS(AWS_SDK)

export class TodueAccess {
  constructor (
    private readonly docClient = new AWS.DynamoDB.DocumentClient(),
    private readonly toduesTable = process.env.TODUES_TABLE,
    private readonly s3Client = new AWS.S3({
      signatureVersion: 'v4'
    }),
    private readonly bucketName = process.env.IMAGES_S3_BUCKET,
    private readonly urlExpiration = process.env.SIGNED_URL_EXPIRATION
  ) {}

  async getToduesPerUser (userId: string): Promise<TodueItem[]> {
    console.log('Getting all Todues')

    const result = await this.docClient.query({
      TableName: this.toduesTable,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      },
      ScanIndexForward: false
    }).promise()

    return result.Items
  }

  async getTodue (userId: string, todueId: string): Promise<TodueItem[]> {
    console.log('Getting user Todues')

    const result = await this.docClient.query({
      TableName: this.toduesTable,
      KeyConditionExpression: 'userId = :userId AND todueId = :todueId',
      ExpressionAttributeValues: {
        ':userId': userId,
        ':todueId': todueId
      },
      ScanIndexForward: false
    }).promise()

    return result.Items
  }

  async createTodue (todue: TodueItem): Promise<TodueItem> {
    console.log(`Creating a Todue with id ${todue.todueId}`)

    await this.docClient.put({
      TableName: this.toduesTable,
      Item: {
        ...todue,
        createdAt: moment().format("YYYY-MM-DD HH:mm:ss")
      }
    }).promise()

    return todue
  }

  async updateTodue (userId: string, updatedTodue: any): Promise<any> {
    let params = {
      TableName: this.toduesTable,
      Key: {
        "userId": userId,
        "todueId": updatedTodue.todueId
      },
      UpdateExpression: "set #x = :name, dueDate = :dueDate, done = :done",
      ExpressionAttributeValues: {
        ':name': updatedTodue.name,
        ':dueDate': updatedTodue.dueDate,
        ':done': updatedTodue.done
      },
      ExpressionAttributeNames: {
        '#x': 'name'
      }
    }

    await this.docClient.update(params).promise()
  }

  async deleteTodue (userId: string, todueId: string): Promise<any> {
    await this.docClient.delete({
      TableName: this.toduesTable,
      Key: {
        "userId": userId,
        "todueId": todueId
      }
    }).promise()
    return true
  }


  async getUploadUrl (todueId: string = '', userId: string): Promise<string> {
    let encodedUserId = encodeURIComponent(userId)
    return this.s3Client.getSignedUrl('putObject', {
      Bucket: this.bucketName,
      Key: todueId + '___' + encodedUserId,
      Expires: this.urlExpiration
    })
  }
}