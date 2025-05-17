import axios from 'axios';



type props = {
    toNumber: string;
    template: string;
}



export const message = async ({toNumber, template}: props) => {
  try {
    console.log('Sending message...');
    console.log(`${toNumber} ${template}${process.env.META_TOKEN} ${process.env.NUMBER}`);
    const response = await axios.post(
      `https://graph.facebook.com/v22.0/627770013747980/messages`,
      {
        messaging_product: 'whatsapp',
        to: String(toNumber),
        type: 'template',
        template: {
          name: template,
          language: {
            code: 'en_US',
          },
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.META_TOKEN}`,
          'Content-Type': 'application/json',
        },
      },
    );
console.log('Message sent successfully:', response);
    console.log('Message sent successfully:', response);
    return response.data;
  } catch (error) {
    console.error('Error sending message:', error);
    return error;
  }
};
