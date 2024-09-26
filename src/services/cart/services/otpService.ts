import speakeasy from "speakeasy";
import QRCode from "qrcode";
import otpauth from "otpauth"; // Ensure you have otpauth package installed
import * as URL from "url";

interface SecretDetails {
  base32: string;
  ascii: string;
  hex: string;
  otpauth_url: string;
  qr_code_url: string;
}

export const generateSecret = (): SecretDetails => {
  try {
    const secret = speakeasy.generateSecret({ length: 20 });

    // Ensure all properties are defined and assert their types
    if (!secret.base32 || !secret.otpauth_url) {
      throw new Error("Secret generation failed");
    }

    // Construct QR code URL for user to scan
    const qrCodeUrl = `https://chart.googleapis.com/chart?chs=200x200&cht=qr&chl=${encodeURIComponent(
      secret.otpauth_url
    )}`;

    return {
      base32: secret.base32,
      ascii: secret.ascii || "", // Use empty string as fallback if undefined
      hex: secret.hex || "", // Use empty string as fallback if undefined
      otpauth_url: secret.otpauth_url,
      qr_code_url: qrCodeUrl,
    };
  } catch (error) {
    console.error("Error generating secret:", error);
    throw new Error("Could not generate OTP secret");
  }
};

export const verifyToken = (secret: string, token: string) => {
  return speakeasy.totp.verify({
    secret,
    encoding: "base32",
    token,
  });
};

export const verifyQRToken = (secret: string, token: string): boolean => {
  try {
    return speakeasy.totp.verify({
      secret,
      encoding: "base32",
      token,
      window: 1, // Optional: Allows for a small time window to account for clock skew
    });
  } catch (error) {
    console.error("Error verifying OTP token:", error);
    return false;
  }
};

export const generateQRCode = async (otpauthUrl: string): Promise<string> => {
  try {
    // Generate QR code as a Data URL
    const dataUrl = await QRCode.toDataURL(otpauthUrl);
    return dataUrl;
  } catch (error) {
    console.error("Error generating QR code:", error);
    throw error;
  }
};

export const extractSecretFromOtpauthUrl = (otpauthUrl: string): string => {
  try {
    const url = new URL.URL(otpauthUrl);
    const secret = url.searchParams.get("secret") || "";
    return secret;
  } catch (error) {
    console.error("Error extracting secret from otpauth_url:", error);
    return "";
  }
};
// export const otpauthURL = (secret: string, username: string) => {
//   const qrcodeLink = secret.otpauth_url
//   QRCode.toDataURL(qrcodeLink, (err, qrCode) => {
//     if (err) console.error(err);
//     else console.log(qrCode); // Displays QR code as a base64 encoded image
//   });
// return speakeasy.otpauthURL({
//   secret,
//   label: "bookstore",
//   issuer: "YourApp",
// });
// };
