// import { gmail_v1, google } from "googleapis";

// // If modifying these scopes, delete token.json.
// const SCOPES = ["https://www.googleapis.com/auth/gmail.readonly"];

// function gmailClient(oAuth2Client) {
//   return google.gmail("v1");
// }

// /**
//  * Get a new token after prompting for user authorization, and then
//  * execute the given callback with the authorized OAuth2 client.
//  * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
//  * @return {Promise<google.auth.OAuth2>} The promise for the authorized client.
//  */
// // async function get_new_token(oAuth2Client, token) {
// //   return authenticate(oAuth2Client, SCOPES, token);
// // }

// /**
//  * Lists the labels in the user's account.
//  *
//  * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
//  */
// const listLabels = async (gmail: gmail_v1.Gmail, oauth2Client) => {
//   try {
//     const labels = await new Promise((resolve, reject) => {
//       gmail.users.labels.list(
//         {
//           userId: "me",
//           auth: oauth2Client,
//         },
//         function (err, res) {
//           if (err) {
//             reject(err);
//           } else {
//             const labels = res.data.labels;
//             resolve(labels);
//           }
//         }
//       );
//     });
//     return labels;
//   } catch (err) {
//     console.log("The API returned an error: " + err);
//     throw err;
//   }
// };

// /**
//  * Retrieve Messages in user's mailbox matching query.
//  *
//  * @param  {String} userId User's email address. The special value 'me'
//  * can be used to indicate the authenticated user.
//  * @param  {String} query String used to filter the Messages listed.
//  */
// const listMessages = async (gmail, oauth2Client, query, labelIds) => {
//   const messages = await new Promise((resolve, reject) => {
//     gmail.users.messages.list(
//       {
//         userId: "me",
//         q: query,
//         auth: oauth2Client,
//         labelIds: labelIds,
//       },
//       async function (err, res) {
//         if (err) {
//           reject(err);
//         } else {
//           let result = res.data.messages || [];
//           let { nextPageToken } = res.data;
//           while (nextPageToken) {
//             const resp = await new Promise((resolve, reject) => {
//               gmail.users.messages.list(
//                 {
//                   userId: "me",
//                   q: query,
//                   auth: oauth2Client,
//                   labelIds: labelIds,
//                   pageToken: nextPageToken,
//                 },
//                 function (err, res) {
//                   if (err) {
//                     reject(err);
//                   } else {
//                     resolve(res);
//                   }
//                 }
//               );
//             });
//             result = result.concat(resp.data.messages);
//             nextPageToken = resp.data.nextPageToken;
//           }
//           resolve(result);
//         }
//       }
//     );
//   });
//   let result = messages || [];
//   return result;
// };

// /**
//  * Get the recent email from your Gmail account
//  *
//  * @param {google.auth.OAuth2} oauth2Client An authorized OAuth2 client.
//  * @param {string} query String used to filter the Messages listed.
//  * @param {string} label Email label. Default = INBOX.
//  */
// const getRecentEmail = async (oauth2Client, query = "", label = "INBOX") => {
//   try {
//     const client = gmailClient(oauth2Client);
//     const labels = await listLabels(client, oauth2Client);
//     const inbox_label_id = [labels.find((l) => l.name === label).id];
//     const messages = await listMessages(
//       client,
//       oauth2Client,
//       query,
//       inbox_label_id
//     );
//     let promises = [];
//     for (let message of messages) {
//       promises.push(
//         new Promise((resolve, reject) => {
//           client.users.messages.get(
//             {
//               auth: oauth2Client,
//               userId: "me",
//               id: message.id,
//               format: "full",
//             },
//             function (err, res) {
//               if (err) {
//                 reject(err);
//               } else {
//                 resolve(res);
//               }
//             }
//           );
//         })
//       );
//     }
//     const results = await Promise.all(promises);
//     return results.map((r) => r.data);
//   } catch (error) {
//     console.log("Error when getting recent emails: " + error);
//     throw error;
//   }
// };

// module.exports = {
//   getRecentEmail,
// };
