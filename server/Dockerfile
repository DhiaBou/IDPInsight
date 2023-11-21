FROM python:3.11

# Set the working directory to /code/src
WORKDIR /code/src

# Copy only the necessary files for installing dependencies
COPY ./server/pyproject.toml ./server/poetry.lock* /code/

# Install Poetry, disable virtual environments creation by Poetry,
# install dependencies, and ensure Poetry's bin directory is in the $PATH
RUN pip install poetry \
    && poetry config virtualenvs.create false \
    && poetry install --no-dev \
    && PATH=$PATH:/root/.local/bin

# Copy the rest of the application
COPY ./server /code/src/

# Use the full path to uvicorn if necessary, or ensure it's in the $PATH
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
