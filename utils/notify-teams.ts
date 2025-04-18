import fetch from 'node-fetch';

export const notifyTeams = async (message: string) => {
  const webhookUrl = 'https://outlook.office.com/webhook/...'; // replace with your webhook

  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: message }),
  });

  if (!response.ok) {
    console.error('Failed to send Teams notification:', response.statusText);
  } else {
    console.log('✅ Teams notification sent.');
  }
};
