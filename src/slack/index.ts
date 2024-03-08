import { IncomingWebhook } from "@slack/webhook";

export const sendNotification = async (message: string, data?: any) => {
  try {
    const slackWebhookURL = process.env.SLACK_WEBHOOK;
    if (slackWebhookURL) {
      const webhook = new IncomingWebhook(slackWebhookURL);
      let error = data;
      if (data instanceof Error) {
        error = data.stack;
      }

      await webhook.send({
        text: message,
        ...(data && {
          blocks: [
            {
              type: "section",
              text: {
                type: "mrkdwn",
                text: `\`\`\`${error}\`\`\``,
              },
            },
          ],
        }),
      });
    }
  } catch (error) {}
};
