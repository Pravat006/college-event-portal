import { EventEmail } from "@/types/event"
import { format } from "date-fns"

function generateEventUpdateHTML({ event, user, updateType }: EventEmail & { updateType: 'updated' | 'cancelled' }) {
  const startDate = format(new Date(event.startDate), 'EEEE, MMMM do, yyyy')
  const startTime = format(new Date(event.startDate), 'h:mm a')
  const endTime = format(new Date(event.endDate), 'h:mm a')

  const isUpdate = updateType === 'updated'
  const bgColor = isUpdate ? '#fef3c7' : '#fee2e2'
  const borderColor = isUpdate ? '#fcd34d' : '#fca5a5'
  const textColor = isUpdate ? '#92400e' : '#dc2626'
  const icon = isUpdate ? '⚠️' : '❌'

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Event ${updateType === 'updated' ? 'Update' : 'Cancellation'}</title>
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
        .alert {
          background: ${bgColor};
          border: 1px solid ${borderColor};
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 24px;
          text-align: center;
        }
        .alert-title {
          color: ${textColor};
          font-size: 24px;
          font-weight: bold;
          margin: 0 0 8px 0;
        }
        .alert-message {
          color: ${textColor};
          margin: 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="alert">
          <div style="font-size: 48px; margin-bottom: 16px;">${icon}</div>
          <h1 class="alert-title">Event ${updateType === 'updated' ? 'Updated' : 'Cancelled'}</h1>
          <p class="alert-message">
            ${updateType === 'updated'
      ? 'Important changes have been made to your registered event'
      : 'Unfortunately, this event has been cancelled'
    }
          </p>
        </div>

        <p>Hi ${user.firstName},</p>
        
        <p>
          ${updateType === 'updated'
      ? `We wanted to let you know that <strong>${event.title}</strong> has been updated. Please review the current event details below.`
      : `We regret to inform you that <strong>${event.title}</strong> has been cancelled. We apologize for any inconvenience this may cause.`
    }
        </p>

        ${updateType === 'updated' ? `
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 24px; margin: 24px 0;">
            <h2 style="color: #1e293b; margin: 0 0 16px 0;">${event.title}</h2>
            <div style="display: grid; gap: 12px;">
              <div style="display: flex; align-items: center; gap: 12px;">
                <span style="width: 20px;">📅</span>
                <span>${startDate}</span>
              </div>
              <div style="display: flex; align-items: center; gap: 12px;">
                <span style="width: 20px;">🕐</span>
                <span>${startTime} - ${endTime}</span>
              </div>
              <div style="display: flex; align-items: center; gap: 12px;">
                <span style="width: 20px;">📍</span>
                <span>${event.location}</span>
              </div>
            </div>
          </div>
        ` : ''}


        <div style="text-align: center; margin-top: 32px; padding-top: 24px; border-top: 1px solid #e2e8f0; color: #64748b; font-size: 14px;">
          <p>Questions? Contact us at events@college.edu</p>
          <p>College Event Portal</p>
        </div>
      </div>
    </body>
    </html>
  `
}

export default generateEventUpdateHTML