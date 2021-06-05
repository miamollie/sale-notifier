"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AWS = require("aws-sdk");
// Set the region
AWS.config.region = process.env.AWS_REGION;
const ses = new AWS.SES();
//Get Email Addresses
const senderEmailAddress = process.env.SES_SENDER_IDENTITY;
const receiverEmailAddress = process.env.SES_RECEIVER_IDENTITY;
//TODO saleUrl should come from the SNS published message somehow
exports.handler = async function (event) {
    var params = {
        Destination: {
            ToAddresses: [receiverEmailAddress /* RECEIVER email address */],
        },
        Message: {
            Body: {
                Html: {
                    Charset: "UTF-8",
                    Data: "Found item on sale" +
                        event.saleURL /* customize html version of email body */,
                },
                Text: {
                    Charset: "UTF-8",
                    Data: "Found item on sale" +
                        event.saleURL /* customize text version of email body */,
                },
            },
            Subject: {
                Charset: "UTF-8",
                Data: "New item on sale",
            },
        },
        Source: senderEmailAddress,
        ReplyToAddresses: [
            senderEmailAddress /* verified Amazon SES identity FROM email address */,
        ],
    };
    // Send to SES
    const result = await ses.sendEmail(params).promise();
    console.log(result);
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2FsZS1ub3RpZmllci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInNhbGUtbm90aWZpZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwrQkFBZ0M7QUFDaEMsaUJBQWlCO0FBQ2pCLEdBQUcsQ0FBQyxNQUFNLENBQUMsTUFBTSxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDO0FBRTNDLE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBRTFCLHFCQUFxQjtBQUNyQixNQUFNLGtCQUFrQixHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsbUJBQW1CLENBQUM7QUFDM0QsTUFBTSxvQkFBb0IsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLHFCQUFxQixDQUFDO0FBRS9ELGlFQUFpRTtBQUVqRSxPQUFPLENBQUMsT0FBTyxHQUFHLEtBQUssV0FBVyxLQUEwQjtJQUMxRCxJQUFJLE1BQU0sR0FBRztRQUNYLFdBQVcsRUFBRTtZQUNYLFdBQVcsRUFBRSxDQUFDLG9CQUFvQixDQUFDLDRCQUE0QixDQUFDO1NBQ2pFO1FBQ0QsT0FBTyxFQUFFO1lBQ1AsSUFBSSxFQUFFO2dCQUNKLElBQUksRUFBRTtvQkFDSixPQUFPLEVBQUUsT0FBTztvQkFDaEIsSUFBSSxFQUNGLG9CQUFvQjt3QkFDcEIsS0FBSyxDQUFDLE9BQU8sQ0FBQywwQ0FBMEM7aUJBQzNEO2dCQUNELElBQUksRUFBRTtvQkFDSixPQUFPLEVBQUUsT0FBTztvQkFDaEIsSUFBSSxFQUNGLG9CQUFvQjt3QkFDcEIsS0FBSyxDQUFDLE9BQU8sQ0FBQywwQ0FBMEM7aUJBQzNEO2FBQ0Y7WUFDRCxPQUFPLEVBQUU7Z0JBQ1AsT0FBTyxFQUFFLE9BQU87Z0JBQ2hCLElBQUksRUFBRSxrQkFBa0I7YUFDekI7U0FDRjtRQUNELE1BQU0sRUFBRSxrQkFBa0I7UUFDMUIsZ0JBQWdCLEVBQUU7WUFDaEIsa0JBQWtCLENBQUMscURBQXFEO1NBQ3pFO0tBQ0YsQ0FBQztJQUNGLGNBQWM7SUFDZCxNQUFNLE1BQU0sR0FBRyxNQUFNLEdBQUcsQ0FBQyxTQUFTLENBQUMsTUFBa0MsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBQ2pGLE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDdEIsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEFXUyA9IHJlcXVpcmUoXCJhd3Mtc2RrXCIpO1xuLy8gU2V0IHRoZSByZWdpb25cbkFXUy5jb25maWcucmVnaW9uID0gcHJvY2Vzcy5lbnYuQVdTX1JFR0lPTjtcblxuY29uc3Qgc2VzID0gbmV3IEFXUy5TRVMoKTtcblxuLy9HZXQgRW1haWwgQWRkcmVzc2VzXG5jb25zdCBzZW5kZXJFbWFpbEFkZHJlc3MgPSBwcm9jZXNzLmVudi5TRVNfU0VOREVSX0lERU5USVRZO1xuY29uc3QgcmVjZWl2ZXJFbWFpbEFkZHJlc3MgPSBwcm9jZXNzLmVudi5TRVNfUkVDRUlWRVJfSURFTlRJVFk7XG5cbi8vVE9ETyBzYWxlVXJsIHNob3VsZCBjb21lIGZyb20gdGhlIFNOUyBwdWJsaXNoZWQgbWVzc2FnZSBzb21laG93XG5cbmV4cG9ydHMuaGFuZGxlciA9IGFzeW5jIGZ1bmN0aW9uIChldmVudDogeyBzYWxlVVJMOiBzdHJpbmcgfSkge1xuICB2YXIgcGFyYW1zID0ge1xuICAgIERlc3RpbmF0aW9uOiB7XG4gICAgICBUb0FkZHJlc3NlczogW3JlY2VpdmVyRW1haWxBZGRyZXNzIC8qIFJFQ0VJVkVSIGVtYWlsIGFkZHJlc3MgKi9dLFxuICAgIH0sXG4gICAgTWVzc2FnZToge1xuICAgICAgQm9keToge1xuICAgICAgICBIdG1sOiB7XG4gICAgICAgICAgQ2hhcnNldDogXCJVVEYtOFwiLFxuICAgICAgICAgIERhdGE6XG4gICAgICAgICAgICBcIkZvdW5kIGl0ZW0gb24gc2FsZVwiICtcbiAgICAgICAgICAgIGV2ZW50LnNhbGVVUkwgLyogY3VzdG9taXplIGh0bWwgdmVyc2lvbiBvZiBlbWFpbCBib2R5ICovLFxuICAgICAgICB9LFxuICAgICAgICBUZXh0OiB7XG4gICAgICAgICAgQ2hhcnNldDogXCJVVEYtOFwiLFxuICAgICAgICAgIERhdGE6XG4gICAgICAgICAgICBcIkZvdW5kIGl0ZW0gb24gc2FsZVwiICtcbiAgICAgICAgICAgIGV2ZW50LnNhbGVVUkwgLyogY3VzdG9taXplIHRleHQgdmVyc2lvbiBvZiBlbWFpbCBib2R5ICovLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIFN1YmplY3Q6IHtcbiAgICAgICAgQ2hhcnNldDogXCJVVEYtOFwiLFxuICAgICAgICBEYXRhOiBcIk5ldyBpdGVtIG9uIHNhbGVcIixcbiAgICAgIH0sXG4gICAgfSxcbiAgICBTb3VyY2U6IHNlbmRlckVtYWlsQWRkcmVzcywgLyogcmVxdWlyZWQ6IHZlcmlmaWVkIEFtYXpvbiBTRVMgaWRlbnRpdHkgRlJPTSBlbWFpbCBhZGRyZXNzICovXG4gICAgUmVwbHlUb0FkZHJlc3NlczogW1xuICAgICAgc2VuZGVyRW1haWxBZGRyZXNzIC8qIHZlcmlmaWVkIEFtYXpvbiBTRVMgaWRlbnRpdHkgRlJPTSBlbWFpbCBhZGRyZXNzICovLFxuICAgIF0sXG4gIH07XG4gIC8vIFNlbmQgdG8gU0VTXG4gIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHNlcy5zZW5kRW1haWwocGFyYW1zIGFzIEFXUy5TRVMuU2VuZEVtYWlsUmVxdWVzdCkucHJvbWlzZSgpO1xuICBjb25zb2xlLmxvZyhyZXN1bHQpO1xufTtcbiJdfQ==