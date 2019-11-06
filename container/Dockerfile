FROM python:3.7-buster

COPY point-label-sharing /opt
COPY install-node.sh /opt
COPY scan.sh /usr/bin/scan
RUN pip install --requirement /opt/requirements.txt
RUN apt-get update && apt-get install -y \
    curl \
    software-properties-common
# RUN /opt/install-node.sh
# RUN apt-get install -y nodejs
# RUN cd /opt && make install_dependencies

WORKDIR /opt
CMD ["python", "scan.py", "web"]
