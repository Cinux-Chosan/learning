

- [一键](https://v2xtls.org/v2ray%E5%A4%9A%E5%90%88%E4%B8%80%E8%84%9A%E6%9C%AC%EF%BC%8C%E6%94%AF%E6%8C%81vmesswebsockettlsnginx%E3%80%81vlesstcpxtls%E3%80%81vlesstcptls%E7%AD%89%E7%BB%84%E5%90%88/)


- install

`bash <(curl -L https://raw.githubusercontent.com/v2fly/fhs-install-v2ray/master/install-release.sh)`

`systemctl enable v2ray; systemctl start v2ray`

`vim  /usr/local/etc/v2ray/config.json`

`systemctl  restart v2ray`


```json
{
    "log": {
    "loglevel": "debug",
    "access": "/var/log/v2ray/access.log",
    "error": "/var/log/v2ray/error.log"
  },
  "inbounds": [
    {
      "protocol": "http",
      "port": 63333,
      "settings": {
        "allowTransparent": false
      },
      "streamSettings": {
        "httpSettings": {
          "host": [
            "mm01.p.t.kim" // 你的域名
          ],
          "path": "/v2-api"
        }
      }
    },
      {
      "listen": "0.0.0.0",
      "protocol": "socks",
      "settings": {
        "udp": true,
        "auth": "noauth"
      },
      "port": 65533
    },
    {
      "protocol": "vmess",
      "port": 63334,
      "settings": {
        "clients": [
          {
            "id": "f303c824-bfb8-4bd4-be3e-fd9387654321",
            "alterId": 0 // 其它 alterId 可能由于软件bug导致未知异常
          }
        ]
      },
      "streamSettings": {
        "network": "ws",
	"wsSettings": {
                    "path": "/v2-api"
                }
        }
      }
  ],
  "outbounds": [
    {
      "protocol": "freedom",
      "settings":{
          "domainStrategy": "AsIs"
      }
    }
  ]
  
}
```


- acme

`curl  https://get.acme.sh | sh -s email=my@example.com`

`acme.sh  --issue -d mm01.p.t.kim   --standalone`

`acme.sh  --upgrade  --auto-upgrade`


- ikev2

`wget https://git.io/vpnsetup-centos -O vpn.sh && sudo sh vpn.sh && sudo bash /opt/src/ikev2.sh --auto`



- nginx

```conf
# For more information on configuration, see:
#   * Official English Documentation: http://nginx.org/en/docs/
#   * Official Russian Documentation: http://nginx.org/ru/docs/

user nginx;
worker_processes auto;
# 改大一点
worker_rlimit_nofile 65535;
error_log /var/log/nginx/error.log;
pid /run/nginx.pid;

# Load dynamic modules. See /usr/share/doc/nginx/README.dynamic.
include /usr/share/nginx/modules/*.conf;

events {
    # 改大一点
    worker_connections 65535;
}

http {
    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';

    access_log  /var/log/nginx/access.log  main;

    sendfile            on;
    tcp_nopush          on;
    tcp_nodelay         on;
    keepalive_timeout   65;
    types_hash_max_size 2048;
    
    gzip on;
    gzip_min_length 1k;
    gzip_comp_level 2;
    gzip_types application/json text/plain application/javascript application/x-javascript text/css application/xml text/javascript application/x-httpd-php image/jpeg image/gif image/png;
    gzip_vary on;
    
    include             /etc/nginx/mime.types;
    default_type        application/octet-stream;

    # Load modular configuration files from the /etc/nginx/conf.d directory.
    # See http://nginx.org/en/docs/ngx_core_module.html#include
    # for more information.
    include /etc/nginx/conf.d/*.conf;

    server {
        listen       8880 default_server;
        listen       [::]:8880 default_server;
        server_name  _;
       	root         /usr/share/nginx/html;
       
        # Load configuration files for the default server block.
        include /etc/nginx/default.d/*.conf;

        location / {
        }

        error_page 404 /404.html;
            location = /40x.html {
        }

        error_page 500 502 503 504 /50x.html;
            location = /50x.html {
        }
    }

# Settings for a TLS enabled server.
#
#    server {
#        listen       443 ssl http2 default_server;
#        listen       [::]:443 ssl http2 default_server;
#        server_name  _;
#        root         /usr/share/nginx/html;
#
#        ssl_certificate "/etc/pki/nginx/server.crt";
#        ssl_certificate_key "/etc/pki/nginx/private/server.key";
#        ssl_session_cache shared:SSL:1m;
#        ssl_session_timeout  10m;
#        ssl_ciphers PROFILE=SYSTEM;
#        ssl_prefer_server_ciphers on;
#
#        # Load configuration files for the default server block.
#        include /etc/nginx/default.d/*.conf;
#
#        location / {
#        }
#
#        error_page 404 /404.html;
#            location = /40x.html {
#        }
#
#        error_page 500 502 503 504 /50x.html;
#            location = /50x.html {
#        }
#    }

}
```


```conf
## domain conf

 server {
        listen       443 ssl http2 default_server;
        listen       [::]:443 ssl http2 default_server;
        server_name  mm01.p.t.kim;
        root         /var/www/proxy-root;
        charset utf-8;
        ssl_certificate "/root/.acme.sh/mm01.p.t.kim/fullchain.cer";
        ssl_certificate_key "/root/.acme.sh/mm01.p.t.kim/mm01.p.t.kim.key";
        ssl_session_cache shared:SSL:1m;
        ssl_session_timeout  10m;
        # ssl_ciphers PROFILE=SYSTEM;
        ssl_prefer_server_ciphers on;
        ssl_protocols         TLSv1 TLSv1.1 TLSv1.2;
        ssl_ciphers           HIGH:!aNULL:!MD5;
        # Load configuration files for the default server block.
        # include /etc/nginx/default.d/*.conf;

        location / {
        }
        location ^~ /p/ {
	  proxy_pass http://127.0.0.1:61111;
	}

	location ^~ /v2-api {
	    proxy_pass http://127.0.0.1:63334/v2-api;
	    proxy_redirect off;
                proxy_http_version 1.1;
                proxy_set_header Upgrade $http_upgrade;
                proxy_set_header Connection "upgrade";
                proxy_set_header Host $host;
                 # Show real IP in v2ray access.log
                proxy_set_header X-Real-IP $remote_addr;
                proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
	}
	location ^~ /api/ {
           proxy_pass http://127.0.0.1:63332/api/;
	}
	location ^~ /socket.io/ {
	    proxy_pass http://127.0.0.1:63332/socket.io/;
	    proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
	    proxy_http_version 1.1;
	}
        error_page 404 /404.html;
            location = /40x.html {
        }

        error_page 500 502 503 504 /50x.html;
            location = /50x.html {
        }
    }


```