import { EventEmailData } from "@/lib/schemas";
import { format } from "date-fns";
const eventEmailHTML = ({ event, user }: EventEmailData) => {
  const startDate = format(new Date(event.startDate), "EEEE, MMMM do, yyyy");
  const startTime = format(new Date(event.startDate), "h:mm a");
  const endTime = format(new Date(event.endDate), "h:mm a");

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Event Registration Confirmation</title>
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
        .logo {
          width: 48px;
          height: 48px;
          background: #2563eb;
          border-radius: 8px;
          margin: 0 auto 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 24px;
          font-weight: bold;
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
        .event-card {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 24px;
          margin: 24px 0;
        }
        .event-title {
          font-size: 24px;
          font-weight: bold;
          color: #1e293b;
          margin: 0 0 8px 0;
        }
        .event-category {
          display: inline-block;
          background: #dbeafe;
          color: #1e40af;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          margin-bottom: 16px;
        }
        .event-description {
          color: #64748b;
          margin-bottom: 20px;
          line-height: 1.6;
        }
        .event-details {
          display: grid;
          gap: 12px;
        }
        .detail-row {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .detail-icon {
          width: 20px;
          height: 20px;
          background: #2563eb;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 12px;
          flex-shrink: 0;
        }
        .detail-text {
          color: #374151;
          font-weight: 500;
        }
        .price-section {
          background: #ecfdf5;
          border: 1px solid #d1fae5;
          border-radius: 8px;
          padding: 16px;
          margin: 20px 0;
          text-align: center;
        }
        .price {
          font-size: 24px;
          font-weight: bold;
          color: #059669;
        }
        .next-steps {
          background: #fef3c7;
          border: 1px solid #fcd34d;
          border-radius: 8px;
          padding: 20px;
          margin: 24px 0;
        }
        .next-steps h3 {
          color: #92400e;
          margin: 0 0 12px 0;
          font-size: 18px;
        }
        .next-steps ul {
          color: #92400e;
          margin: 0;
          padding-left: 20px;
        }
        .next-steps li {
          margin-bottom: 8px;
        }
        .footer {
          text-align: center;
          margin-top: 32px;
          padding-top: 24px;
          border-top: 1px solid #e2e8f0;
          color: #64748b;
          font-size: 14px;
        }
        .button {
          display: inline-block;
          background: #2563eb;
          color: white;
          padding: 12px 24px;
          border-radius: 8px;
          text-decoration: none;
          font-weight: 600;
          margin: 16px 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">📅</div>
          <h1 class="title">Registration Confirmed!</h1>
          <p class="subtitle">You're all set for this amazing event</p>
        </div>

        <p class="greeting">Hi ${user.firstName},</p>
        
        <p>Great news! Your registration for <strong>${event.title
    }</strong> has been confirmed. We're excited to see you there!</p>

        <div class="event-card">
          <h2 class="event-title">${event.title}</h2>
          <span class="event-category">${event.category}</span>
          
          <p class="event-description">${event.description}</p>
          
          <div class="event-details">
            <div class="detail-row">
              <div class="detail-icon">📅</div>
              <div class="detail-text">${startDate}</div>
            </div>
            <div class="detail-row">
              <div class="detail-icon">🕐</div>
              <div class="detail-text">${startTime} - ${endTime}</div>
            </div>
            <div class="detail-row">
              <div class="detail-icon">📍</div>
              <div class="detail-text">${event.location}</div>
            </div>
          </div>
        </div>

        ${event.price > 0
      ? `
          <div class="price-section">
            <div class="price">$${event.price.toFixed(2)}</div>
            <p style="margin: 8px 0 0 0; color: #059669;">Payment will be collected at the event</p>
          </div>
        `
      : `
          <div class="price-section">
            <div class="price">FREE</div>
            <p style="margin: 8px 0 0 0; color: #059669;">No payment required</p>
          </div>
        `
    }

        <div class="next-steps">
          <h3>What's Next?</h3>
          <ul>
            <li>Add this event to your calendar</li>
            <li>Arrive 15 minutes early for check-in</li>
            <li>Bring a valid student ID</li>
            <li>Check your email for any event updates</li>
            ${event.price > 0
      ? "<li>Bring exact change or card for payment</li>"
      : ""
    }
          </ul>
        </div>

        <div style="text-align: center;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    }/dashboard" class="button">
            View My Events
          </a>
        </div>

        <div class="footer">
          <p>Questions? Contact us at events@college.edu</p>
          <p>College Event Portal • Making campus events accessible to everyone</p>
        </div>
      </div>
    </body>
    </html>
  `;
};
export default eventEmailHTML;