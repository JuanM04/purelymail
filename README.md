# Purelymail Vercel

Dumb autodiscovery/autoconfig server for purelymail.com.

Add these DNS records:
```
_imap._tcp            SRV  0 0 0   .
_imaps._tcp           SRV  0 1 993 imap.purelymail.com.
_pop3._tcp            SRV  0 0 0   .
_pop3s._tcp           SRV 10 1 995 pop3.purelymail.com.
_submission._tcp      SRV  0 1 465 smtp.purelymail.com.
_autodiscover._tcp    SRV  0 1 443 purelymail.vercel.app.

autoconfig    CNAME purelymail.vercel.app.
```