import { IncomingWebhook } from "@slack/webhook";

export const sendNotification = async ({
  type,
  message,
  data,
}: {
  type: "success" | "failure";
  message: string;
  data?: any;
}) => {
  try {
    const slackWebhookURL = process.env.SLACK_WEBHOOK;
    if (slackWebhookURL) {
      const webhook = new IncomingWebhook(slackWebhookURL);
      let metaData = data;
      if (data instanceof Error) {
        metaData = data.stack;
      }

      await webhook.send({
        text: message,
        blocks: [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `${message}\n\n` + `\`\`\`${metaData}\`\`\``,
            },
          },
          ...(type === "failure" && [
            {
              type: "actions",
              // @ts-ignore
              elements: [
                {
                  type: "button",
                  text: {
                    type: "plain_text",
                    emoji: true,
                    text: "Retry",
                  },
                  style: "primary",
                  value: "retry_btn",
                },
              ],
            },
          ]),
        ],
      });
    }
  } catch (error) {}
};
