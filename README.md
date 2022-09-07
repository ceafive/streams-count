![node](https://img.shields.io/badge/node-16-green)
![express](https://img.shields.io/badge/express-4.16.1-red)
![aws-serverless-express](https://img.shields.io/badge/aws--serverless--express-3.4.0-yellowgreen)

# streams-count-api

## Count concurrent number of streams

A service in Node.js that exposes an API which can be consumed from any client. Thisservice checks how many video streams a given user is watching and prevent a user fromwatching more than 3 video streams concurrently. Uses services like API Gateway, Lambda, DynamoDB etc

## 🤔 How do I use this?

<details>
<summary>Hey- before you actually use this, make sure you've [Docker](https://www.docker.com/) installed and running. Expand to read more</summary>
<br>
### 🚨 AWS CREDENTIALS

This project uses AWS credentials that have been provided separately to help you run this project. This have been set to ENV variables with the keys below:

1. ACCESS\_KEY\_ID
2. SECRET\_ACCESS\_KEY
3. DEFAULT\_REGION

Once you have each of these: access key id, secret access key, region, you're all set!

</details>

### Step 1: Build Image

In your project directory, run

```sh
docker build --build-arg ACCESS_KEY_ID=<ACCESS_KEY_ID> --build-arg SECRET_ACCESS_KEY=<SECRET_ACCESS_KEY> --build-arg DEFAULT_REGION=<DEFAULT_REGION> -t streams-count-api . 
```

### Step 2: Verify Image

When build is complete you can verify your image with:

```sh
docker images
```

Then run your image with (make sure port 8080 is free on your local machine):

```sh
docker run -p 8080:8080 -d --name streams-count-api streams-count-api 
```

### Step 3: Follow Logs

#### Run following commands to follow logs
```sh
docker ps
docker logs streams-count-api
```

#### If you need to go inside the container you can use the exec command:

```sh
docker exec -it streams-count-api /bin/bash
```

### Step 4: Open Postman and try out the api
First do a curl 

```sh
curl -i localhost:8080
```

You should get a `ITS WORKING` response. You can open Postman (to make it easier) and test your the api

The endpoint for getting the streams for current user is `localhost:8080/streams`

> Please note there are some users currently in database. The `localhost:8080/streams` endpoint requires a `X-ID` header in other to identify the current user

You can user the following ids to test out the endpoint:

1. 123
2. 1234
3. 12345
4. 123456

## You can skip all the above setup and test the deploy prod endpoints at: 

```sh
curl -i https://l788umca3c.execute-api.us-west-2.amazonaws.com/prod/
```

> Please note, you require a `X-ID` header in other to identify the current user

```sh
https://l788umca3c.execute-api.us-west-2.amazonaws.com/prod/streams
```

# Scaling strategy
This api uses AWS Lambda, Lambda automatically scales out for incoming requests, if all existing execution contexts (lambda instances) are busy. Also we can use AWS Lambda with an Application Load Balancer,

We can also use Application Auto Scaling. Application Auto Scaling allows us to configure automatic scaling for different resources, including Provisioned Concurrency for Lambda. We can scale resources based on a specific CloudWatch metric or at a specific date and time.

# Logging & monitoring
This api implements `CloudWatch` logs to help in logging and monitoring at scale. The api uses `winston-cloudwatch` to send appropriate logs to `CloudWatch`




