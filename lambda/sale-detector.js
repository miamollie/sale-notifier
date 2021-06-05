"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const publishMessage_1 = require("../util/publishMessage");
exports.handler = async function () {
    // Handle promise's fulfilled/rejected states
    publishMessage_1.publishMessage
        .then(function (data) {
        console.log(`Message ${publishMessage_1.params.Message} sent to the topic ${publishMessage_1.params.TopicArn}`);
        console.log("MessageID is " + data.MessageId);
    })
        .catch(function (err) {
        console.error(err, err.stack);
    });
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2FsZS1kZXRlY3Rvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInNhbGUtZGV0ZWN0b3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwyREFBZ0U7QUFFaEUsT0FBTyxDQUFDLE9BQU8sR0FBRyxLQUFLO0lBQ3JCLDZDQUE2QztJQUM3QywrQkFBYztTQUNYLElBQUksQ0FBQyxVQUFVLElBQVM7UUFDdkIsT0FBTyxDQUFDLEdBQUcsQ0FDVCxXQUFXLHVCQUFNLENBQUMsT0FBTyxzQkFBc0IsdUJBQU0sQ0FBQyxRQUFRLEVBQUUsQ0FDakUsQ0FBQztRQUNGLE9BQU8sQ0FBQyxHQUFHLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUNoRCxDQUFDLENBQUM7U0FDRCxLQUFLLENBQUMsVUFBVSxHQUFRO1FBQ3ZCLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNoQyxDQUFDLENBQUMsQ0FBQztBQUNQLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHB1Ymxpc2hNZXNzYWdlLCBwYXJhbXMgfSBmcm9tIFwiLi4vdXRpbC9wdWJsaXNoTWVzc2FnZVwiO1xuXG5leHBvcnRzLmhhbmRsZXIgPSBhc3luYyBmdW5jdGlvbiAoKSB7XG4gIC8vIEhhbmRsZSBwcm9taXNlJ3MgZnVsZmlsbGVkL3JlamVjdGVkIHN0YXRlc1xuICBwdWJsaXNoTWVzc2FnZVxuICAgIC50aGVuKGZ1bmN0aW9uIChkYXRhOiBhbnkpIHtcbiAgICAgIGNvbnNvbGUubG9nKFxuICAgICAgICBgTWVzc2FnZSAke3BhcmFtcy5NZXNzYWdlfSBzZW50IHRvIHRoZSB0b3BpYyAke3BhcmFtcy5Ub3BpY0Fybn1gXG4gICAgICApO1xuICAgICAgY29uc29sZS5sb2coXCJNZXNzYWdlSUQgaXMgXCIgKyBkYXRhLk1lc3NhZ2VJZCk7XG4gICAgfSlcbiAgICAuY2F0Y2goZnVuY3Rpb24gKGVycjogYW55KSB7XG4gICAgICBjb25zb2xlLmVycm9yKGVyciwgZXJyLnN0YWNrKTtcbiAgICB9KTtcbn07XG4iXX0=