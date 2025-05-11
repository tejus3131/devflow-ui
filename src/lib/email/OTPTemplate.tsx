import * as React from 'react';

interface EmailOTPTemplateProps {
  firstName: string;
  otp: string;
}

export const EmailOTPTemplate: React.FC<Readonly<EmailOTPTemplateProps>> = ({
  firstName,
  otp,
}) => (
  <div
    style={{
      fontFamily: 'Arial, sans-serif',
      lineHeight: '1.6',
      fontSize: '16px',
      color: '#333',
      padding: '20px',
    }}
  >
    <h2>Hello {firstName},</h2>
    <p>We received a request to change the email address on your account.</p>
    <p>
      To verify this request, please use the OTP code below. This code is valid
      for the next 10 minutes:
    </p>
    <div
      style={{
        backgroundColor: '#f5f5f5',
        padding: '15px 20px',
        textAlign: 'center',
        fontSize: '24px',
        fontWeight: 'bold',
        borderRadius: '6px',
        margin: '20px 0',
        letterSpacing: '2px',
      }}
    >
      {otp}
    </div>
    <p>If you did not request this change, you can safely ignore this email.</p>
    <p>Thank you,<br />Your Support Team</p>
  </div>
);
