import { format } from "date-fns";

function generateCertificateEmailHTML({ event, user, position, isParticipation }: {
  event: { title: string; startDate: Date }
  user: { firstName: string; lastName: string }
  position: string
  isParticipation: boolean
}) {
  const eventDate = format(new Date(event.startDate), 'MMMM do, yyyy')
  const certificateType = isParticipation ? 'Participation Certificate' : 'Achievement Certificate'
  const congratsText = isParticipation
    ? `Thank you for participating in ${event.title}!`
    : `Congratulations on securing ${position} in ${event.title}!`

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${certificateType}</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f8fafc;
        }
        .container {
          background: white;
          border-radius: 12px;
          padding: 32px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        .header {
          text-align: center;
          margin-bottom: 32px;
          padding-bottom: 24px;
          border-bottom: 2px solid #e2e8f0;
        }
        .trophy {
          width: 64px;
          height: 64px;
          background: ${isParticipation ? 'linear-gradient(45deg, #48bb78, #68d391)' : 'linear-gradient(45deg, #ffd700, #ffed4e)'};
          border-radius: 50%;
          margin: 0 auto 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 32px;
        }
        .title {
          color: #1e293b;
          font-size: 28px;
          font-weight: bold;
          margin: 0;
        }
        .subtitle {
          color: #64748b;
          font-size: 16px;
          margin: 8px 0 0 0;
        }
        .greeting {
          font-size: 18px;
          color: #1e293b;
          margin-bottom: 24px;
        }
        .achievement-card {
          background: ${isParticipation ? '#f0fff4' : '#fffbeb'};
          border: 1px solid ${isParticipation ? '#c6f6d5' : '#fed7aa'};
          border-radius: 8px;
          padding: 24px;
          margin: 24px 0;
          text-align: center;
        }
        .achievement-title {
          font-size: 24px;
          font-weight: bold;
          color: ${isParticipation ? '#22543d' : '#92400e'};
          margin: 0 0 8px 0;
        }
        .achievement-subtitle {
          color: ${isParticipation ? '#2f855a' : '#d69e2e'};
          font-size: 16px;
        }
        .event-details {
          background: #f8fafc;
          border-radius: 8px;
          padding: 20px;
          margin: 20px 0;
        }
        .event-name {
          font-size: 20px;
          font-weight: bold;
          color: #1e293b;
          margin-bottom: 8px;
        }
        .event-date {
          color: #64748b;
          font-size: 16px;
        }
        .attachment-info {
          background: #dbeafe;
          border: 1px solid #93c5fd;
          border-radius: 8px;
          padding: 16px;
          margin: 24px 0;
        }
        .attachment-title {
          color: #1e40af;
          font-weight: 600;
          margin-bottom: 8px;
        }
        .attachment-text {
          color: #1e40af;
          font-size: 14px;
        }
        .footer {
          text-align: center;
          margin-top: 32px;
          padding-top: 24px;
          border-top: 1px solid #e2e8f0;
          color: #64748b;
          font-size: 14px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="trophy">${isParticipation ? '🎖️' : '🏆'}</div>
          <h1 class="title">${certificateType} Issued!</h1>
          <p class="subtitle">Your achievement has been recognized</p>
        </div>

        <p class="greeting">Hi ${user.firstName},</p>
        
        <p>${congratsText}</p>

        <div class="achievement-card">
          <h2 class="achievement-title">${position}</h2>
          <p class="achievement-subtitle">Well done on your achievement!</p>
        </div>

        <div class="event-details">
          <div class="event-name">${event.title}</div>
          <div class="event-date">${eventDate}</div>
        </div>

        <div class="attachment-info">
          <div class="attachment-title">📎 Certificate Attached</div>
          <p class="attachment-text">
            Your official certificate is attached to this email. You can download, print, or share it as needed.
          </p>
        </div>

        <p>Keep up the excellent work and continue participating in our events!</p>

        <div class="footer">
          <p>Best regards,<br>College Event Portal Team</p>
          <p>Making campus events accessible to everyone</p>
        </div>
      </div>
    </body>
    </html>
  `
}

export default generateCertificateEmailHTML