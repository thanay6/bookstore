import sgMail from "@sendgrid/mail";

// Replace with your SendGrid API key
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY as string;

interface twoFactor {
  adminMail: string;
  secret: string;
  dataUrl: string;
}

sgMail.setApiKey(SENDGRID_API_KEY);

export const sendTwoFactorSetupEmail = async (
  email: string,
  secret: string,
  redirectUrl: string // URL to redirect when the button is clicked
) => {
  try {
    const msg = {
      to: email,
      from: "venugopalreddy9493@gmail.com", // Your verified SendGrid sender email
      subject: "Your 2FA Setup Instructions",
      text: `
        Dear User,

        To enhance the security of your account, we have enabled two-factor authentication. Please follow the instructions below to set it up:

        1. Open Google Authenticator or any compatible 2FA app on your mobile device.
        2. Click the button below to proceed with 2FA setup or enter the secret key manually:

        Secret Key: ${secret}

        Button: ${redirectUrl}

        If you encounter any issues, please contact support.

        Best regards,
        Your Team
      `,
      html: `
        <p>Dear User,</p>
        <p>To enhance the security of your account, we have enabled two-factor authentication. Please follow the instructions below to set it up:</p>
        <ol>
          <li>Open Google Authenticator or any compatible 2FA app on your mobile device.</li>
          <li>Click the button below to proceed with 2FA setup or enter the secret key manually:</li>
        </ol>
        <p><strong>Secret Key:</strong> ${secret}, ${redirectUrl}</p>
        <p>
          <a href="${redirectUrl}" style="
            display: inline-block;
            padding: 10px 20px;
            font-size: 16px;
            font-weight: bold;
            color: #fff;
            background-color: #007bff;
            text-decoration: none;
            border-radius: 5px;
            text-align: center;
          " target="_blank">Proceed with 2FA Setup</a>
        </p>
        <p>If you encounter any issues, please contact support.</p>
        <p>Best regards,<br>Your Team</p>
      `,
    };

    const response = await sgMail.send(msg);
    console.log("2FA setup email sent successfully:", response);
  } catch (error) {
    console.error("Failed to send email:", error);
  }
};
