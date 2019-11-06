FROM python:3.7-buster

COPY point-label-sharing /opt
COPY install-node.sh /opt
COPY scan.sh /usr/bin/scan
RUN pip install --requirement /opt/requirements.txt
RUN apt-get update && apt-get install -y \
    curl \
    software-properties-common

WORKDIR /opt
CMD ["python", "scan.py", "web"]
