package com.artium.gallery.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;

@Service
public class EmailService {

    @Value("${app.gallery.name}")
    private String galleryName;

    @Value("${mail.enabled:true}")
    private boolean mailEnabled;

    @Value("${mail.script.url}")
    private String scriptUrl;

    @Value("${admin.email:2400030987@kluniversity.in}")
    private String adminEmail;

    @Async
    public void sendWelcomeEmail(String toEmail, String userName) {
        if (!mailEnabled || scriptUrl == null || scriptUrl.isBlank()) {
            System.out.println("📧 Email disabled or Script URL not configured — skipping welcome email for: " + toEmail);
            return;
        }

        try {
            String subject = "Welcome to " + galleryName + "! 🎨";
            String htmlContent = buildWelcomeHtml(userName);

            String jsonPayload = "{\"to\":\"" + toEmail + "\","
                    + "\"subject\":\"" + escapeJson(subject) + "\","
                    + "\"html\":\"" + escapeJson(htmlContent) + "\"}";

            System.out.println("📧 Sending welcome email to: " + toEmail);
            String response = postWithRedirect(scriptUrl, jsonPayload);
            System.out.println("✅ Welcome email sent to: " + toEmail + " | Response: " + response);

        } catch (Exception e) {
            System.err.println("❌ Failed to send welcome email to " + toEmail + ": " + e.getClass().getSimpleName() + " - " + e.getMessage());
            e.printStackTrace();
        }
    }

    @Async
    public void sendOtpEmail(String toEmail, String otp) {
        if (!mailEnabled || scriptUrl == null || scriptUrl.isBlank()) {
            System.out.println("📧 Email disabled or Script URL not configured — skipping OTP email for: " + toEmail);
            return;
        }

        try {
            String subject = "Your " + galleryName + " Verification Code \uD83D\uDD10";
            String htmlContent = buildOtpHtml(otp);

            String jsonPayload = "{\"to\":\"" + toEmail + "\","
                    + "\"subject\":\"" + escapeJson(subject) + "\","
                    + "\"html\":\"" + escapeJson(htmlContent) + "\"}";

            System.out.println("📧 Sending OTP email to: " + toEmail);
            String response = postWithRedirect(scriptUrl, jsonPayload);
            System.out.println("✅ OTP email sent to: " + toEmail + " | Response: " + response);

        } catch (Exception e) {
            System.err.println("❌ Failed to send OTP email to " + toEmail + ": " + e.getClass().getSimpleName() + " - " + e.getMessage());
            e.printStackTrace();
        }
    }

    @Async
    public void sendSubscribeNotification(String name, String email, String role, String gender) {
        if (!mailEnabled || scriptUrl == null || scriptUrl.isBlank()) {
            System.out.println("📧 Email disabled — skipping subscribe notification for: " + email);
            return;
        }

        try {
            String subject = "New " + role.toUpperCase() + " Access Request — " + galleryName;
            String htmlContent = buildSubscribeNotificationHtml(name, email, role, gender);

            String jsonPayload = "{\"to\":\"" + adminEmail + "\","
                    + "\"subject\":\"" + escapeJson(subject) + "\","
                    + "\"html\":\"" + escapeJson(htmlContent) + "\"}";

            System.out.println("📧 Sending subscribe notification to admin for: " + email);
            String response = postWithRedirect(scriptUrl, jsonPayload);
            System.out.println("✅ Subscribe notification sent | Response: " + response);

        } catch (Exception e) {
            System.err.println("❌ Failed to send subscribe notification for " + email + ": " + e.getClass().getSimpleName() + " - " + e.getMessage());
            e.printStackTrace();
        }
    }

    @Async
    public void sendCredentialsEmail(String toEmail, String name, String tempPassword) {
        if (!mailEnabled || scriptUrl == null || scriptUrl.isBlank()) {
            System.out.println("📧 Email disabled — skipping credentials email for: " + toEmail);
            return;
        }

        try {
            String subject = "Your ARTIUM Account Access";
            String htmlContent = buildCredentialsHtml(name, toEmail, tempPassword);

            String jsonPayload = "{\"to\":\"" + toEmail + "\","
                    + "\"subject\":\"" + escapeJson(subject) + "\","
                    + "\"html\":\"" + escapeJson(htmlContent) + "\"}";

            System.out.println("📧 Sending credentials email to: " + toEmail);
            String response = postWithRedirect(scriptUrl, jsonPayload);
            System.out.println("✅ Credentials email sent to: " + toEmail + " | Response: " + response);

        } catch (Exception e) {
            System.err.println("❌ Failed to send credentials email to " + toEmail + ": " + e.getClass().getSimpleName() + " - " + e.getMessage());
            e.printStackTrace();
        }
    }

    /**
     * Posts JSON to the given URL and follows up to 5 redirects (including POST→POST).
     */
    private String postWithRedirect(String urlStr, String jsonPayload) throws Exception {
        int maxRedirects = 5;
        String currentUrl = urlStr;

        for (int i = 0; i < maxRedirects; i++) {
            URL url = new URL(currentUrl);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("POST");
            conn.setRequestProperty("Content-Type", "application/json; charset=UTF-8");
            conn.setRequestProperty("Accept", "application/json, text/plain, */*");
            conn.setDoOutput(true);
            conn.setInstanceFollowRedirects(false);
            conn.setConnectTimeout(15000);
            conn.setReadTimeout(30000);

            try (OutputStream os = conn.getOutputStream()) {
                os.write(jsonPayload.getBytes(StandardCharsets.UTF_8));
            }

            int status = conn.getResponseCode();
            System.out.println("📧 HTTP " + status + " from: " + currentUrl);

            if (status == 200 || status == 201) {
                try (var is = conn.getInputStream()) {
                    return new String(is.readAllBytes(), StandardCharsets.UTF_8);
                }
            } else if (status == 301 || status == 302 || status == 303 || status == 307 || status == 308) {
                String location = conn.getHeaderField("Location");
                if (location == null || location.isBlank()) {
                    throw new RuntimeException("Redirect with no Location header at: " + currentUrl);
                }
                System.out.println("📧 Redirecting to: " + location);
                currentUrl = location;
                conn.disconnect();
            } else {
                String errorBody = "";
                try (var es = conn.getErrorStream()) {
                    if (es != null) errorBody = new String(es.readAllBytes(), StandardCharsets.UTF_8);
                }
                throw new RuntimeException("HTTP " + status + " from Apps Script. Body: " + errorBody);
            }
        }
        throw new RuntimeException("Too many redirects when posting to Apps Script.");
    }

    /** Minimal JSON string escaping */
    private String escapeJson(String s) {
        if (s == null) return "";
        return s.replace("\\", "\\\\")
                .replace("\"", "\\\"")
                .replace("\r", "\\r")
                .replace("\n", "\\n")
                .replace("\t", "\\t");
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

    private String buildOtpHtml(String otp) {
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
                                        <p style="margin:8px 0 0; font-size:12px; color:#1a1a2e; letter-spacing:0.2em; text-transform:uppercase;">Email Verification</p>
                                    </td>
                                </tr>

                                <!-- Body -->
                                <tr>
                                    <td style="padding:40px;">
                                        <p style="margin:0 0 20px; font-size:18px; color:#e8d48b;">Verify Your Email</p>
                                        <p style="margin:0 0 24px; font-size:15px; color:#c4c4c4; line-height:1.7;">
                                            Use the following verification code to complete your registration with <strong style="color:#e8d48b;">%s</strong>:
                                        </p>

                                        <table role="presentation" width="100%%" cellspacing="0" cellpadding="0" style="margin:0 0 24px;">
                                            <tr>
                                                <td align="center">
                                                    <div style="display:inline-block; padding:20px 40px; background-color:#0f1729; border:2px solid #c9a84c; border-radius:12px; letter-spacing:0.5em; font-size:36px; font-weight:700; color:#e8d48b;">
                                                        %s
                                                    </div>
                                                </td>
                                            </tr>
                                        </table>

                                        <p style="margin:0 0 16px; font-size:14px; color:#c4c4c4; line-height:1.7;">
                                            ⏱️ This code will expire in <strong style="color:#e8d48b;">5 minutes</strong>.
                                        </p>
                                        <p style="margin:0; font-size:13px; color:#888; line-height:1.7;">
                                            If you didn't request this code, you can safely ignore this email.
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
            """.formatted(galleryName, otp, galleryName);
    }

    private String buildSubscribeNotificationHtml(String name, String email, String role, String gender) {
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
                                        <p style="margin:8px 0 0; font-size:12px; color:#1a1a2e; letter-spacing:0.2em; text-transform:uppercase;">Admin Notification</p>
                                    </td>
                                </tr>

                                <!-- Body -->
                                <tr>
                                    <td style="padding:40px;">
                                        <p style="margin:0 0 20px; font-size:18px; color:#e8d48b;">New %s Access Request</p>
                                        <p style="margin:0 0 24px; font-size:15px; color:#c4c4c4; line-height:1.7;">
                                            A new user has requested <strong style="color:#e8d48b;">%s</strong> access on %s.
                                        </p>

                                        <table role="presentation" cellspacing="0" cellpadding="0" style="margin:0 0 28px; width:100%%;">
                                            <tr>
                                                <td style="padding:12px 16px; font-size:14px; color:#888; border-bottom:1px solid #2a2a4a; width:120px;">Name</td>
                                                <td style="padding:12px 16px; font-size:14px; color:#e8d48b; border-bottom:1px solid #2a2a4a;">%s</td>
                                            </tr>
                                            <tr>
                                                <td style="padding:12px 16px; font-size:14px; color:#888; border-bottom:1px solid #2a2a4a;">Email</td>
                                                <td style="padding:12px 16px; font-size:14px; color:#e8d48b; border-bottom:1px solid #2a2a4a;">%s</td>
                                            </tr>
                                            <tr>
                                                <td style="padding:12px 16px; font-size:14px; color:#888; border-bottom:1px solid #2a2a4a;">Role Requested</td>
                                                <td style="padding:12px 16px; font-size:14px; color:#e8d48b; border-bottom:1px solid #2a2a4a;">%s</td>
                                            </tr>
                                            <tr>
                                                <td style="padding:12px 16px; font-size:14px; color:#888;">Gender</td>
                                                <td style="padding:12px 16px; font-size:14px; color:#e8d48b;">%s</td>
                                            </tr>
                                        </table>

                                        <p style="margin:0; font-size:14px; color:#c4c4c4; line-height:1.7;">
                                            Please review this request and create the account from the Admin Dashboard if approved.
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
            """.formatted(
                capitalize(role), capitalize(role), galleryName,
                name.isEmpty() ? "Not provided" : name,
                email, capitalize(role),
                gender.isEmpty() ? "Not provided" : capitalize(gender),
                galleryName
            );
    }

    private String buildCredentialsHtml(String name, String email, String tempPassword) {
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
                                        <p style="margin:8px 0 0; font-size:12px; color:#1a1a2e; letter-spacing:0.2em; text-transform:uppercase;">Account Access</p>
                                    </td>
                                </tr>

                                <!-- Body -->
                                <tr>
                                    <td style="padding:40px;">
                                        <p style="margin:0 0 20px; font-size:18px; color:#e8d48b;">Hello %s,</p>
                                        <p style="margin:0 0 24px; font-size:15px; color:#c4c4c4; line-height:1.7;">
                                            Your account has been approved. 🎉
                                        </p>

                                        <table role="presentation" cellspacing="0" cellpadding="0" style="margin:0 0 28px; width:100%%; background-color:#0f1729; border:1px solid #2a2a4a; border-radius:12px;">
                                            <tr>
                                                <td style="padding:20px 24px; font-size:14px; color:#888; border-bottom:1px solid #2a2a4a; width:150px;">Login Email</td>
                                                <td style="padding:20px 24px; font-size:15px; color:#e8d48b; border-bottom:1px solid #2a2a4a; font-weight:600;">%s</td>
                                            </tr>
                                            <tr>
                                                <td style="padding:20px 24px; font-size:14px; color:#888;">Temporary Password</td>
                                                <td style="padding:20px 24px; font-size:15px; color:#e8d48b; font-family:monospace; font-weight:600; letter-spacing:0.1em;">%s</td>
                                            </tr>
                                        </table>

                                        <p style="margin:0 0 16px; font-size:14px; color:#c4c4c4; line-height:1.7;">
                                            🔐 You will be asked to <strong style="color:#e8d48b;">change your password</strong> when you log in for the first time.
                                        </p>

                                        <p style="margin:0 0 24px; font-size:13px; color:#888; line-height:1.7;">
                                            If you did not request this account, please ignore this email.
                                        </p>

                                        <p style="margin:0; font-size:15px; color:#c4c4c4; line-height:1.7;">
                                            Regards,<br/>
                                            <strong style="color:#e8d48b;">ARTIUM Team</strong>
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
            """.formatted(name, email, tempPassword, galleryName);
    }

    private String capitalize(String s) {
        if (s == null || s.isEmpty()) return s;
        return s.substring(0, 1).toUpperCase() + s.substring(1).toLowerCase();
    }
}
