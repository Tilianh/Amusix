FROM nginx:alpine@sha256:54f2a904c251d5a34adf545a72d32515a15e08418dae0266e23be2e18c66fefa

# Copy Nginx conf
COPY default.conf /etc/nginx/conf.d/default.conf

# Launch Nginx
ENTRYPOINT ["nginx"]
CMD ["-g", "daemon off;"]