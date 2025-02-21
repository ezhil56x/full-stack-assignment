FROM golang:1.24-bookworm AS builder

ENV GO111MODULE=on \
    CGO_ENABLED=0 \
    GOOS=linux \
    GOARCH=amd64

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .
RUN go build -o main .

FROM alpine:latest
WORKDIR /root/
COPY --from=builder /app/main .

# Not for production, the best way is to pass these values as ARGs while building the image
ENV DATABASE_URL=postgres://postgres:postgres@192.168.0.111:5432/taskmanager
ENV JWT_SECRET=supersecretkey
ENV GIN_MODE=release

RUN echo "DATABASE_URL=$DATABASE_URL" > .env
RUN echo "JWT_SECRET=$JWT_SECRET" >> .env

EXPOSE 8080
CMD ["./main"]
