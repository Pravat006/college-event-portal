import { WinnerPosition } from "./schemas"

type CertificateData = {
  userName: string
  eventTitle: string
  position: WinnerPosition
  eventDate: string
  organizerName: string
  collegeName?: string
  registrationNumber?: string
  semester?: string
}

export function getPositionDisplay(position: WinnerPosition): string {
  const positions = {
    'FIRST': '1st Place',
    'SECOND': '2nd Place',
    'THIRD': '3rd Place'
  }
  return positions[position]
}

export function getPositionEmoji(position: WinnerPosition): string {
  const emojis = {
    'FIRST': '🥇',
    'SECOND': '🥈',
    'THIRD': '🥉'
  }
  return emojis[position]
}

export function generateCertificateHTML(data: CertificateData): string {
  const { userName, eventTitle, position, eventDate, organizerName, collegeName, registrationNumber, semester } = data

  const positionDisplay = getPositionDisplay(position)
  const positionEmoji = getPositionEmoji(position)

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Certificate of Achievement</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Inter:wght@300;400;500;600&display=swap');
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Inter', sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }
        
        .certificate {
          width: 800px;
          height: 600px;
          background: white;
          border-radius: 20px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 60px;
          text-align: center;
        }
        
        .certificate::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(45deg, #f093fb 0%, #f5576c 25%, #4facfe 50%, #00f2fe 75%, #43e97b 100%);
          background-size: 400% 400%;
          animation: gradient 15s ease infinite;
          opacity: 0.05;
        }
        
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        .certificate-border {
          position: absolute;
          top: 20px;
          left: 20px;
          right: 20px;
          bottom: 20px;
          border: 3px solid;
          border-image: linear-gradient(45deg, #667eea, #764ba2, #f093fb, #f5576c) 1;
          border-radius: 15px;
        }
        
        .certificate-header {
          margin-bottom: 30px;
        }
        
        .certificate-title {
          font-family: 'Playfair Display', serif;
          font-size: 36px;
          font-weight: 700;
          color: #2d3748;
          margin-bottom: 10px;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        .certificate-subtitle {
          font-size: 18px;
          color: #667eea;
          font-weight: 500;
          letter-spacing: 2px;
          text-transform: uppercase;
        }
        
        .certificate-body {
          margin-bottom: 40px;
          line-height: 1.8;
        }
        
        .certificate-text {
          font-size: 18px;
          color: #4a5568;
          margin-bottom: 20px;
        }
        
        .recipient-name {
          font-family: 'Playfair Display', serif;
          font-size: 42px;
          font-weight: 700;
          color: #2d3748;
          margin: 20px 0;
          text-decoration: underline;
          text-decoration-color: #667eea;
          text-underline-offset: 8px;
          text-decoration-thickness: 3px;
        }
        
        .event-name {
          font-size: 24px;
          font-weight: 600;
          color: #667eea;
          margin: 15px 0;
        }
        
        .achievement-text {
          font-size: 20px;
          color: #4a5568;
          margin: 15px 0;
        }
        
        .certificate-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          margin-top: 40px;
        }
        
        .date-section, .signature-section {
          text-align: center;
        }
        
        .date-label, .signature-label {
          font-size: 14px;
          color: #718096;
          margin-bottom: 5px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        
        .date-value {
          font-size: 16px;
          font-weight: 600;
          color: #2d3748;
        }
        
        .signature-line {
          width: 200px;
          height: 2px;
          background: linear-gradient(90deg, #667eea, #764ba2);
          margin: 10px 0 5px 0;
        }
        
        .signature-name {
          font-size: 16px;
          font-weight: 600;
          color: #2d3748;
        }
        
        .signature-title {
          font-size: 14px;
          color: #718096;
        }
        
        .college-name {
          font-size: 14px;
          color: #718096;
          margin-top: 20px;
          font-style: italic;
        }
        
        .winner-badge {
          position: absolute;
          top: 30px;
          right: 30px;
          background: linear-gradient(45deg, #ffd700, #ffed4e);
          color: #744210;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 14px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
          box-shadow: 0 4px 8px rgba(255, 215, 0, 0.3);
        }
        
        @media print {
          body {
            background: white;
            padding: 0;
          }
          
          .certificate {
            box-shadow: none;
            border: 2px solid #667eea;
          }
        }
      </style>
    </head>
    <body>
      <div class="certificate">
        <div class="certificate-border"></div>
        
        <div class="winner-badge">${positionEmoji} ${positionDisplay}</div>
        
        <div class="certificate-header">
          <h1 class="certificate-title">Certificate of Achievement</h1>
          <p class="certificate-subtitle">Excellence in Achievement</p>
        </div>
        
        <div class="certificate-body">
          <p class="certificate-text">This is to certify that</p>
          
          <h2 class="recipient-name">${userName}</h2>
          
          <p class="achievement-text">has been recognized for securing <strong>${positionDisplay}</strong> in</p>
          
          <h3 class="event-name">${eventTitle}</h3>
          
          ${collegeName ? `<p class="college-name">${collegeName}</p>` : ''}
          
          ${registrationNumber ? `<p class="registration-info">Registration: ${registrationNumber}</p>` : ''}
          ${semester ? `<p class="semester-info">Semester: ${semester}</p>` : ''}
        </div>
        
        <div class="certificate-footer">
          <div class="date-section">
            <p class="date-label">Date</p>
            <p class="date-value">${eventDate}</p>
          </div>
          
          <div class="signature-section">
            <div class="signature-line"></div>
            <p class="signature-name">${organizerName}</p>
            <p class="signature-title">Event Organizer</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `
}

export function getCertificateFileName(userName: string, eventTitle: string, position: WinnerPosition): string {
  const sanitizedUserName = userName.replace(/[^a-zA-Z0-9]/g, '_')
  const sanitizedEventTitle = eventTitle.replace(/[^a-zA-Z0-9]/g, '_')
  const positionDisplay = getPositionDisplay(position).replace(/[^a-zA-Z0-9]/g, '_')

  return `Certificate_${sanitizedUserName}_${sanitizedEventTitle}_${positionDisplay}.html`
}