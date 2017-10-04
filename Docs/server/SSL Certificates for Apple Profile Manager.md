### How to get the certificate from LetsEncrypt via certbot
1. Install certbot
2. Make sure Server is running and web sites are turned on and accessible over port 80
3. Run the following command, changing the -w argument to root directory for the server and the -d argument to the hostname you want to get an SSL certificate for
```bash
sudo certbot certonly --webroot -w /Library/Server/Web/Data/Sites/Default -d nano.sesa.us
```
4. Assuming all goes well, certificate(s), chain(s), and key(s) will be in ```/etc/letsencrypt/live/nano.sesa.us```
5. Using ```sudo```, copy them to a temp directory, chown them to your user, and open the window:
```bash
mkdir /tmp
sudo cp /etc/letsencrypt/live/nano.sesa.us/*.pem /tmp
chown admin:wheel /tmp/*.pem
open /tmp
```
6. In Server, under certificates, click the + sign to import the new certificate. Drag the certificate(s) and key(s) into the window that pops up, and click OK.
7. You should be good.
