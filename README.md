DimDimSum is a card game loosely (entirely) based off of the popular and hugely successful card game "Sushi Go".

# Running Locally

To run on your local machine:

1. Create a virtual environment and start it:

    ```
    cd dimdimsum
    virtualenv dds-env
    . dds-env/bin/activate
    ```

2. Install python dependencies:

    ```
    pip install -r requirements.txt
    ```

4. Install js dependencies:
    ```
    npm i
    ```

5. Install Gulp globally:
    ```
    npm install gulp -g
    ```

6. Compile the frontend source, start the server and run the app

    ```
    # make sure virtualenv is running
    gulp start
    ```
