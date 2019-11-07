import click
import time
import re
import logging
import pandas as pd
from pathlib import Path

@click.group()
def main():
    pass

@main.command(help="Scan for BACnet devices on your network")
@click.option("--ip", help="source IP to use (interface)")
@click.option("--dest", default=".", help="destination of scraped points")
def scan(ip, dest):
    import BAC0
    BAC0.log_level('error')
    c = BAC0.connect(ip=ip)
    c.discover()

    points = []

    for dev in c.devices:
        logging.info(f"Scanning BACnet device {dev}")
        devname = f"{dev[0]}-{dev[1]}-{dev[2]}-{dev[3]}.csv"
        device = BAC0.device(dev[2], dev[3], c, history_size=1)
        for point in device.points:
            try:
                d = {
                    'name': getattr(point.properties, 'name', None),
                    'units': getattr(point.properties, 'units', None),
                    'description': getattr(point.properties, 'description', None),
                }
                points.append(d)
            except Exception as e:
                logging.error(point)
                logging.error(e)

    c.disconnect()
    df = pd.DataFrame.from_records(points)
    df.to_csv(Path(dest) / Path(devname), index=False)

@main.command(help="Run webserver to clean/publish datasets")
@click.option("--port", default=5000, help="webserver port")
def web(port):
    from app import app
    app.run(host='0.0.0.0', port=port, debug=True)

if __name__ == '__main__':
    main()
