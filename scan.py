import click
import re
import logging

@click.group()
def main():
    pass

@main.command(help="Scan for BACnet devices on your network")
@click.option("--dest", default="scraped", help="destination of scraped points")
def scan(dest):
    import BAC0
    from BAC0 import lite
    l = lite()
    l.discover()

    for dev in l.devices:
        logging.info(f"Scanning BACnet device {dev}")
        device = BAC0.device(dev[2], dev[3], l, history_size=1)
        for point in device.points:
            print(point)

@main.command(help="Run webserver to clean/publish datasets")
@click.option("--port", default=8000, help="webserver port")
def web(port):
    from app import app
    app.run(host='0.0.0.0',port=port,debug=True)

if __name__ == '__main__':
    main()
