from celery import Celery

app = Celery('core', include=["cxpasta.utils.core"])
app.config_from_object("cxpasta.celeryconfig")

if __name__ == "__main__":
    app.start()
