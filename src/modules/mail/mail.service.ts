import { Injectable } from "@nestjs/common";
import { MailerService } from "@nestjs-modules/mailer";

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendPasswordResetEmail(
    email: string,
    name: string,
    resetUrl: string
  ): Promise<void> {
    try {
      const htmlContent = this.getPasswordResetTemplate(name, resetUrl);

      await this.mailerService.sendMail({
        to: email,
        subject: "Password Reset Request",
        html: htmlContent,
      });
      console.log(`Password reset email sent to: ${email}`);
    } catch (error) {
      console.error("Error sending email:", error);
      throw new Error("Failed to send password reset email");
    }
  }

  private getPasswordResetTemplate(name: string, resetUrl: string): string {
    const year = new Date().getFullYear();

    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Reset</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .container {
      background-color: #f9f9f9;
      border-radius: 10px;
      padding: 30px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
    }
    .header h1 {
      color: #2c3e50;
      margin: 0;
    }
    .content {
      background-color: white;
      padding: 20px;
      border-radius: 5px;
    }
    .button {
      display: inline-block;
      padding: 12px 30px;
      background-color: #3498db;
      color: white;
      text-decoration: none;
      border-radius: 5px;
      margin: 20px 0;
      font-weight: bold;
    }
    .button:hover {
      background-color: #2980b9;
    }
    .footer {
      text-align: center;
      margin-top: 30px;
      font-size: 12px;
      color: #7f8c8d;
    }
    .warning {
      background-color: #fff3cd;
      border-left: 4px solid #ffc107;
      padding: 10px;
      margin: 20px 0;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Password Reset Request</h1>
    </div>
    
    <div class="content">
      <p>Hello ${name},</p>
      
      <p>We received a request to reset your password. Click the button below to reset it:</p>
      
      <div style="text-align: center;">
        <a href="${resetUrl}" class="button">Reset Password</a>
      </div>
      
      <p>Or copy and paste this link into your browser:</p>
      <p style="word-break: break-all; color: #3498db;">${resetUrl}</p>
      
      <div class="warning">
        <strong>⚠️ Important:</strong> This link will expire in 15 minutes for security reasons.
      </div>
      
      <p>If you didn't request a password reset, please ignore this email or contact support if you have concerns.</p>
      
      <p>Best regards,<br>Your Team</p>
    </div>
    
    <div class="footer">
      <p>&copy; ${year} Your Company. All rights reserved.</p>
      <p>This is an automated email, please do not reply.</p>
    </div>
  </div>
</body>
</html>`;
  }
}
