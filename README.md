## Introduction

Smart Trade is a stock Trading platform that provides friendly user interface and easy access for every person to the stock market.

## Technologies
- React - An frontend library for building user interfaces.
- Redux - A predictable, centralized state container for JavaScript apps.
- Python - A programming language for building backend data manipulation.
- SQLAlchemy - A library that facilitates the communication between Python programs and databases
- Database: Development: SQLite3

![Alt Text](react-app/src/website-screen-shot.png)

## Getting started

1. Clone this repository (only this branch)

2. Install dependencies

      ```bash
      pipenv install -r requirements.txt
      ```

3. Create a **.env** file based on the example with proper settings for your
   development environment

4. Make sure the SQLite3 database connection URL is in the **.env** file

5. This starter organizes all tables inside the `flask_schema` schema, defined
   by the `SCHEMA` environment variable.  Replace the value for
   `SCHEMA` with a unique name, **making sure you use the snake_case
   convention**.

6. Get into your pipenv, migrate your database, seed your database, and run your Flask app

   ```bash
   pipenv shell
   ```

   ```bash
   flask db upgrade
   ```

   ```bash
   flask seed all
   ```

   ```bash
   flask run
   ```

7. To run the React App in development, checkout the [README](./react-app/README.md) inside the `react-app` directory.
