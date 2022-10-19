## Postman collection
You can find postman collection with some of API queries but don't forget to login via proper method and insert 
JWT token in Auth section https://www.getpostman.com/collections/c6e3639aaa61c509e695

## Project description
Mysql database already filled. DB folder is properly mapped to the mysql docker container.

## Project startup
```
docker-compose up
```

## Project config
- Basic configuration is in the .env file
- Prisma DB string is properly preconfigured
- You can swap prod and dev startup mode by changing the **NODE_ENV** key.
