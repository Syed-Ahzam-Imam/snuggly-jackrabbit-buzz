import base64
import logging
import resend
from app.core.config import settings

logger = logging.getLogger(__name__)

# Configure Resend
resend.api_key = settings.RESEND_API_KEY


async def send_report_email(
    email_to: str,
    pdf_file: bytes,
    filename: str = "founder-clarity-report.pdf",
):
    """
    Sends the Founder Clarity Report PDF via Resend.
    """

    html = """
    <html>
      <body>
        <h2>Your Founder Clarity Report is Ready</h2>
        <p>Hi there,</p>
        <p>
          Here is your personalized Founder Clarity Report from the
          Snuggly Jackrabbit Buzz diagnostic.
        </p>
        <ul>
          <li>Your Top Mindset Shift</li>
          <li>Critical Operational Focus</li>
          <li>Your Immediate Next Move</li>
        </ul>
        <p>We hope these insights help you unlock the next level of growth.</p>
        <br />
        <p>Best regards,<br />The Team</p>
      </body>
    </html>
    """

    try:
        response = resend.Emails.send({
            "from": settings.RESEND_FROM_EMAIL,
            "to": [email_to],
            "subject": "Your Founder Clarity Compass Report",
            "html": html,
            "attachments": [
                {
                    "filename": filename,
                    "content": base64.b64encode(pdf_file).decode("utf-8"),
                }
            ],
        })

        return response

    except Exception as e:
        logger.error(f"Resend email failed: {e}")
        # Do NOT crash your API
        return None
