Setup HTTPS reverse proxy for Calder Wheels APIs

Prerequisites:
  - SSH access to the server as root
  - Server has nginx as front-end (confirmed: server: nginx)
  - API servers already running on 127.0.0.1:8082 (configurator) and 127.0.0.1:8083 (fitment)

Steps:

1. Copy the nginx config to the server:
   scp calder-api.nginx.conf root@server.covedigitalworks.com:/etc/nginx/conf.d/calder-api.conf

2. SSH into the server:
   ssh root@server.covedigitalworks.com

3. Find the actual SSL cert paths (cPanel AutoSSL):
   grep -r ssl_certificate /etc/nginx/conf.d/ | head -2

4. Edit /etc/nginx/conf.d/calder-api.conf and update the two ssl_certificate paths
   to match what step 3 found.

5. Test and reload:
   nginx -t && systemctl reload nginx

6. Verify the proxy works:
   curl https://server.covedigitalworks.com:8443/api/configurator/health
   curl https://server.covedigitalworks.com:8443/api/fitment/health

7. Set the theme API URLs in Shopify admin:
   - Fitment API URL:  https://server.covedigitalworks.com:8443
   - Configurator API URL:  https://server.covedigitalworks.com:8443

   (Both APIs are behind the same endpoint; path routing handles which service.)

Note: If port 8443 is firewalled, open it in the server's firewall:
   firewall-cmd --permanent --add-port=8443/tcp && firewall-cmd --reload
   (or ufw, or iptables, or cPanel's CSF depending on setup)