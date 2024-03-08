import { google } from "googleapis";
import { Label } from "./types";
import { getOAuthClient } from "./oauth";
import { getUserByEmail } from "../db";

const gmail = google.gmail("v1");

export const getLabels = async (): Promise<Array<Label>> => {
  const { oauth2Client } = await getOAuthClient();
  let user = getUserByEmail(process.env.GCP_AUTH_EMAIL);

  if(!user) throw Error("User data ont found in DB")

  oauth2Client.setCredentials(user);

  try {
    const labels: Array<Label> = await new Promise((resolve, reject) => {
      gmail.users.labels.list(
        {
          userId: "me",
          auth: oauth2Client,
        },
        function (err, res) {
          if (err) {
            reject(err);
          } else {
            const labels = res.data.labels;
            resolve(labels);
          }
        }
      );
    });
    return labels;
  } catch (err) {
    console.log("The API returned an error: " + err);
    throw err;
  }
};

export const getKekaLabel = async () => {
  const labels = await getLabels();
  const kekaLabel = labels.find((label) => label.name === "keka");

  if (!kekaLabel) {
    throw new Error("no lable found with the name 'keka'");
  }

  return kekaLabel;
};
