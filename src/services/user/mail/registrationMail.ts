import sgMail from "@sendgrid/mail";

// Replace with your SendGrid API key
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY as string;

interface AdminDetails {
  username: string;
  email: string;
  password: string;
  role: string;
}

sgMail.setApiKey(SENDGRID_API_KEY);

export const sendAdminRegistrationEmail = async (admin: AdminDetails) => {
  try {
    const msg = {
      to: admin.email,
      from: "venugopalreddy9493@gmail.com",
      subject: "Registration Successful",
      text: `
        Hello ${admin.username},
        
        You have been successfully registered as an admin.

        Details:
        - Username: ${admin.username}
        - Email: ${admin.email}
        - Password: ${admin.password}

        Best regards,
        Your Team
      `,
      html: `
        <p>Hello ${admin.username},</p>
        
        <p>You have been successfully registered as an admin.</p>

        <p>Details:</p>
        <ul>
          <li>Username: ${admin.username}</li>
          <li>Email: ${admin.email}</li>
          <li>Role: ${admin.role}</li>
          <li>Password: ${admin.password}</li>
        </ul>

        <p>Best regards,<br>Your Team</p>
      `,
    };

    const response = await sgMail.send(msg);
    console.log("Email sent successfully:", response);
  } catch (error) {
    console.error("Failed to send email:", error);
  }
};
