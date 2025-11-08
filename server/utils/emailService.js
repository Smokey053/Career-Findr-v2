import nodemailer from "nodemailer";

// Create transporter only if email credentials are provided
let transporter;
if (process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
  transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
} else {
  console.log(
    "⚠️  Email service not configured. Email notifications will be skipped."
  );
}

export const sendVerificationEmail = async (email, verificationLink) => {
  if (!transporter) {
    console.log(
      `📧 [SKIPPED] Verification email to ${email} (email service not configured)`
    );
    return { success: true, skipped: true };
  }
  const mailOptions = {
    from: `"Career Platform" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Verify Your Email - Career Platform",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background-color: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to Career Platform!</h1>
          </div>
          <div class="content">
            <h2>Email Verification</h2>
            <p>Thank you for registering with Career Platform. Please verify your email address to activate your account.</p>
            <div style="text-align: center;">
              <a href="${verificationLink}" class="button">Verify Email Address</a>
            </div>
            <p>Or copy and paste this link in your browser:</p>
            <p style="word-break: break-all; color: #667eea;">${verificationLink}</p>
            <p><strong>Note:</strong> This link will expire in 24 hours.</p>
          </div>
          <div class="footer">
            <p>If you didn't create an account, please ignore this email.</p>
            <p>&copy; ${new Date().getFullYear()} Career Platform. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error("Email sending error:", error);
    throw new Error("Failed to send verification email");
  }
};

export const sendApprovalEmail = async (email, userName, accountType) => {
  if (!transporter) {
    console.log(`📧 [SKIPPED] Approval email to ${email}`);
    return { success: true, skipped: true };
  }

  const mailOptions = {
    from: `"Career Platform" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Account Approved - Career Platform",
    html: `
      <!DOCTYPE html>
      <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #4CAF50;">Account Approved! 🎉</h2>
          <p>Hello ${userName},</p>
          <p>Great news! Your ${accountType} account has been approved by our admin team.</p>
          <p>You can now access all features of the Career Platform.</p>
          <p>Login now: <a href="${process.env.CLIENT_URL}/login">Career Platform Login</a></p>
          <p>Best regards,<br>Career Platform Team</p>
        </div>
      </body>
      </html>
    `,
  };

  await transporter.sendMail(mailOptions);
};

export const sendApplicationStatusEmail = async (
  email,
  studentName,
  courseName,
  status
) => {
  if (!transporter) {
    console.log(`📧 [SKIPPED] Application status email to ${email}`);
    return { success: true, skipped: true };
  }

  const mailOptions = {
    from: `"Career Platform" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `Application Update - ${courseName}`,
    html: `
      <!DOCTYPE html>
      <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2>Application Status Update</h2>
          <p>Hello ${studentName},</p>
          <p>Your application for <strong>${courseName}</strong> has been updated.</p>
          <p><strong>Status:</strong> ${status.toUpperCase()}</p>
          ${
            status === "accepted"
              ? '<p style="color: #4CAF50;">Congratulations! You have been accepted.</p>'
              : ""
          }
          ${
            status === "rejected"
              ? "<p>We encourage you to explore other opportunities on our platform.</p>"
              : ""
          }
          <p>View your applications: <a href="${
            process.env.CLIENT_URL
          }/student/applications">My Applications</a></p>
        </div>
      </body>
      </html>
    `,
  };

  await transporter.sendMail(mailOptions);
};

export const sendAdmissionOfferEmail = async (
  email,
  studentName,
  courseName,
  institutionName
) => {
  if (!transporter) {
    console.log(`📧 [SKIPPED] Admission offer email to ${email}`);
    return { success: true, skipped: true };
  }

  const mailOptions = {
    from: `"Career Platform" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `Admission Offer - ${courseName}`,
    html: `
      <!DOCTYPE html>
      <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #4CAF50;">Congratulations! 🎓</h2>
          <p>Hello ${studentName},</p>
          <p>We are pleased to inform you that you have received an admission offer!</p>
          <p><strong>Course:</strong> ${courseName}</p>
          <p><strong>Institution:</strong> ${institutionName}</p>
          <p><strong>Action Required:</strong> Please login to accept or decline this offer.</p>
          <p><a href="${process.env.CLIENT_URL}/student/admissions" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">View Admission Offers</a></p>
          <p><em>Note: You can only accept one admission offer.</em></p>
        </div>
      </body>
      </html>
    `,
  };

  await transporter.sendMail(mailOptions);
};
