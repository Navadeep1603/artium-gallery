package com.artium.gallery.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

    @Autowired(required = false)
    private JavaMailSender mailSender;

    @Value("${app.gallery.name}")
    private String galleryName;

    @Value("${spring.mail.username:}")
    private String fromEmail;

    @Value("${mail.enabled:true}")
    private boolean mailEnabled;

    @Async
    public void sendWelcomeEmail(String toEmail, String userName) {
        if (!mailEnabled || mailSender == null) {
            System.out.println("📧 Email disabled or not configured — skipping welcome email for: " + toEmail);
            return;
        }
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("Welcome to " + galleryName + "! 🎨");
            helper.setText(buildWelcomeHtml(userName), true);

            mailSender.send(message);
            System.out.println("✅ Welcome email sent to: " + toEmail);
        } catch (Exception e) {
            System.err.println("❌ Failed to send welcome email to " + toEmail + ": " + e.getMessage());
        }
    }

    private String buildWelcomeHtml(String userName) {
        return """
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="margin:0; padding:0; background-color:#1a1a2e; font-family:'Segoe UI',Arial,sans-serif;">
                <table role="presentation" width="100%%" cellspacing="0" cellpadding="0" style="background-color:#1a1a2e; padding:40px 20px;">
                    <tr>
                        <td align="center">
                            <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background-color:#16213e; border-radius:16px; overflow:hidden; box-shadow:0 8px 32px rgba(0,0,0,0.3);">

                                <!-- Header -->
                                <tr>
                                    <td style="background: linear-gradient(135deg, #c9a84c 0%%, #e8d48b 50%%, #c9a84c 100%%); padding:40px 40px 30px; text-align:center;">
                                        <h1 style="margin:0; font-size:32px; font-weight:700; color:#1a1a2e; letter-spacing:0.15em;">ARTIUM</h1>
                                        <p style="margin:8px 0 0; font-size:12px; color:#1a1a2e; letter-spacing:0.2em; text-transform:uppercase;">Virtual Gallery</p>
                                    </td>
                                </tr>

                                <!-- Body -->
                                <tr>
                                    <td style="padding:40px;">
                                        <p style="margin:0 0 20px; font-size:18px; color:#e8d48b;">Hi %s,</p>
                                        <p style="margin:0 0 24px; font-size:15px; color:#c4c4c4; line-height:1.7;">
                                            Thank you for creating an account with <strong style="color:#e8d48b;">%s</strong>! 🎨
                                        </p>
                                        <p style="margin:0 0 24px; font-size:15px; color:#c4c4c4; line-height:1.7;">
                                            We're excited to have you join our creative community.
                                        </p>

                                        <p style="margin:0 0 16px; font-size:16px; color:#e8d48b;">✨ What you can do next:</p>
                                        <table role="presentation" cellspacing="0" cellpadding="0" style="margin:0 0 28px 8px;">
                                            <tr><td style="padding:6px 0; font-size:14px; color:#c4c4c4;">🖼️&nbsp;&nbsp;Browse stunning art collections</td></tr>
                                            <tr><td style="padding:6px 0; font-size:14px; color:#c4c4c4;">👨‍🎨&nbsp;&nbsp;Discover new artists</td></tr>
                                            <tr><td style="padding:6px 0; font-size:14px; color:#c4c4c4;">❤️&nbsp;&nbsp;Save your favorite pieces</td></tr>
                                            <tr><td style="padding:6px 0; font-size:14px; color:#c4c4c4;">🏛️&nbsp;&nbsp;Stay updated with latest exhibitions</td></tr>
                                        </table>

                                        <p style="margin:0; font-size:15px; color:#c4c4c4; line-height:1.7;">
                                            Warm regards,<br/>
                                            <strong style="color:#e8d48b;">%s Team</strong>
                                        </p>
                                    </td>
                                </tr>

                                <!-- Footer -->
                                <tr>
                                    <td style="background-color:#0f1729; padding:24px 40px; text-align:center; border-top:1px solid #2a2a4a;">
                                        <p style="margin:0; font-size:12px; color:#666;">© 2026 %s. All rights reserved.</p>
                                    </td>
                                </tr>

                            </table>
                        </td>
                    </tr>
                </table>
            </body>
            </html>
            """.formatted(userName, galleryName, galleryName, galleryName);
    }
}
