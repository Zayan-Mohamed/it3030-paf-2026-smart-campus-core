compile:
        cd api/ && ./mvnw clean compile

test:
    cd api/ && ./mvnw test

lint: 
    cd client/ && npm run lint

build:
    cd client/ && npm run build

