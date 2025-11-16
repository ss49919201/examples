FROM amazon/aws-cli AS adotlayer
ARG AWS_ACCESS_KEY_ID
ARG AWS_SECRET_ACCESS_KEY
ENV AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID}
ENV AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY}
ENV AWS_DEFAULT_REGION=ap-northeast-1
WORKDIR /opt
RUN yum -y install unzip && \
    curl $(aws lambda get-layer-version-by-arn --arn arn:aws:lambda:ap-northeast-1:901920570463:layer:aws-otel-nodejs-amd64-ver-1-30-2:1 --query 'Content.Location' --output text) --output layer.zip && \
    unzip layer.zip && rm -f layer.zip

FROM ubuntu:latest AS tmp
COPY --from=adotlayer /opt /opt

FROM public.ecr.aws/lambda/nodejs:22 AS builder
WORKDIR /usr/app
COPY package.json ./src/index.ts  ./
RUN npm install
RUN npm run build

FROM public.ecr.aws/lambda/nodejs:22
COPY --from=adotlayer /opt /opt
WORKDIR ${LAMBDA_TASK_ROOT}
COPY --from=builder /usr/app/dist/* ./
CMD ["index.handler"]
