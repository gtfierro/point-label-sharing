FROM python:3.7-buster

COPY point-label-sharing /opt
COPY scan.sh /usr/bin/scan
RUN pip install --requirement /opt/requirements.txt
RUN ln -s /opt/frontend/build /opt/static

WORKDIR /opt

EXPOSE 47808/udp
EXPOSE 5000

CMD ["python", "scan.py", "web"]
