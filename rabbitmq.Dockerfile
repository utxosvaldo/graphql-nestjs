FROM rabbitmq:3-management

# Define environment variables for the new user
ENV RABBITMQ_NORMAL_USER=satoshi
ENV RABBITMQ_NORMAL_PASSWORD=nakamoto
ENV RABBITMQ_PID_FILE=/var/lib/rabbitmq/mnesia/rabbitmq

# Copy initialization script
COPY rabbitmq-init.sh /rabbitmq-init.sh
RUN chmod +x /rabbitmq-init.sh

EXPOSE 5672 15672

# Use the initialization script
CMD ["/rabbitmq-init.sh"]
