import os
import tempfile
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig, MessageType
from app.core.config import settings

conf = ConnectionConfig(
    MAIL_USERNAME=settings.MAIL_USERNAME,
    MAIL_PASSWORD=settings.MAIL_PASSWORD,
    MAIL_FROM=settings.MAIL_FROM,
    MAIL_PORT=settings.MAIL_PORT,
    MAIL_SERVER=settings.MAIL_SERVER,
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,
    USE_CREDENTIALS=True,
    VALIDATE_CERTS=True
)

async def send_report_email(
    email_to: str,
    pdf_file: bytes,
    filename: str = "founder-clarity-report.pdf"
):
    """
    Sends the Founder Clarity Report PDF to the user via email.
    """

    # ✔ Create safe, unique temp file
    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
        tmp.write(pdf_file)
        tmp_path = tmp.name

    html = """
        <html>
        <body>
            <h2>Your Founder Clarity Report is Ready</h2>
            <p>Hi there,</p>
            <p>Here is your personalized Founder Clarity Report from the Snuggly Jackrabbit Buzz diagnostic.</p>
            <p>Inside you'll find:</p>
            <ul>
                <li>Your Top Mindset Shift</li>
                <li>Critical Operational Focus</li>
                <li>Your Immediate Next Move</li>
            </ul>
            <p>We hope these insights help you unlock the next level of growth.</p>
            <br>
            <p>Best regards,</p>
            <p>The Team</p>
        </body>
        </html>
        """

    message = MessageSchema(
        subject="Your Founder Clarity Compass Report",
        recipients=[email_to],
        body=html,
        subtype=MessageType.html,
        attachments=[{
            "file": tmp_path,       # physical file path
            "filename": filename    # name shown to user
        }]
    )

    fm = FastMail(conf)
    await fm.send_message(message)

    # Optional cleanup
    os.remove(tmp_path)
