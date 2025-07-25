#!/bin/bash
set -e

# Start RabbitMQ in the background
rabbitmq-server &
RABBITMQ_PID=$!

# Wait for RabbitMQ to be ready
rabbitmqctl wait --timeout 60 $RABBITMQ_PID_FILE

# Create normal user
echo "Creating normal user..."
rabbitmqctl add_user $RABBITMQ_NORMAL_USER $RABBITMQ_NORMAL_PASSWORD 2>/dev/null || true
rabbitmqctl set_user_tags $RABBITMQ_NORMAL_USER monitoring
rabbitmqctl set_permissions -p / $RABBITMQ_NORMAL_USER ".*" ".*" ".*"

echo "*** Normal user '$RABBITMQ_NORMAL_USER' with password '$RABBITMQ_NORMAL_PASSWORD' created. ***"
echo "*** User can view queues and basic operations but is not an administrator ***"

# Wait for the background process
wait $RABBITMQ_PID
