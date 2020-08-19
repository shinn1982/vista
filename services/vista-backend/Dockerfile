FROM containers.cisco.com/yare-core/build-base-image:latest

LABEL maintainer="Xi Zhang <xizha2@cisco.com>"

COPY . /vista-backend

WORKDIR /vista-backend

RUN pip install -r requirements.txt

RUN python complie.py -y

EXPOSE 8000

CMD []
