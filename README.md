# IDP Insight

## Overview
IDP Insight is designed to automate the collection, processing, and visualization of data on Internally Displaced Persons (IDPs). It serves as a tool for the Early Warning Preparedness Unit (EWPU) team from the World Food Program (WFP), providing a user-friendly dashboard with reliable, up-to-date, and detailed information about IDPs.

### Problem Statement
There's a need for an automated and reliable system to collect, process, and visualize accurate data on IDPs. Traditional methods involve manual work of accessing and aggregating data from various sources, which is time-consuming and prone to errors.

### Solution
IDP Insight automates the entire process, from data collection, to data processing, to visualization. It gathers data from different sources, cleans and processes it, and presents it in charts. This eliminates the need for manual data aggregation and ensures the data is current and reliable.

## Key Features
- **Automated Data Collection**: Fetches data from various reliable sources, such as International Organization for Migration (IOM), UNHCR and IDMC and stores it for processing.
- **Data Processing**: Transforms raw data into clean, organized formats ready for the analysis.
- **Visualization**: Displays processed data and provides the possibility to create charts.
- **Continuous Updates**: Regularly updates data to ensure the latest information is always available.

## Repository Structure
- [fetch-data](fetch-data/README.md): Python script deployed to AWS Lambda (`devgurus-fetch-data`). It serves to collect raw data from different sources hosted on HDX and store it in `devgurus-raw-data`.
- [idp-frontend](idp-frontend/README.md): The front-end application, built with React, deployed to `devgurus-frontend-deployment-bucket`.
- [process-data](process-data/README.md): Python script in AWS Lambda (`devgurus-process-data`) triggered by uploads to `devgurus-raw-data`. Processes raw data into clean CSV files and stores them in `devgurus-processed-data`.
- [serverless-api](serverless-api/README.md): Python-based serverless API deployed to `devgurus-serverless-api`. Acts as an interface between data buckets and the frontend, providing access to datasets, raw, and processed files.
- `.github/workflows`: Contains GitHub Actions workflows for deploying to AWS.
- [.github/workflows](.github/workflows/main.yml):
Each folder in this repository contains its own README for more specific details. Please refer to these for in-depth information about each component of the application.


