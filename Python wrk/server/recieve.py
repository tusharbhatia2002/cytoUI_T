import json
from fastapi import FastAPI, UploadFile, File , Depends, HTTPException
from fastapi import Request
from tempfile import NamedTemporaryFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta
import pandas as pd
import matplotlib.pyplot as plt
import mpld3
import subprocess
import csv
import os
from pydantic import BaseModel
from bs4 import BeautifulSoup
import asyncio
import io
import base64
from pymongo import MongoClient
import numpy as np
import flowio
import flowutils
import uuid
# import flowkit as fk

app = FastAPI()
output_csv_path = ""  # Global variable to store the path of the converted CSV file
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000","http://localhost"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
SECRET_KEY = "your-secret-key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

users_db = {
    "username": {
        "username": "username",
        "password": "$2b$12$F1nX3D8mUKb5UcqXHfzj2eL9lAGJNS45f0Ff2Bw/YgXuy6ZrseY6m",  # hashed password: password
    }
}
authorized_configs = {}
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/login")

# MOngoDB
mongodb_connection_string=os.environ.get("MONGODB_CONNECTION_key")
if mongodb_connection_string is None:
    raise ValueError("MongoDB connection string not found in environment variables.")
mongo_client = MongoClient(mongodb_connection_string)
db = mongo_client["clusterviz"]
spillover_matrix_collection = db["spillover_matrix"]
class FileData(BaseModel):
    columnNames: list
    spilloverMatrix: list

@app.post("/api/convert-fcs-to-csv")
async def convert_fcs_to_csv(file: UploadFile = File(...) ):
    # Save the uploaded FCS file to a temporary file`
    with NamedTemporaryFile(suffix=".fcs", delete=False) as temp_fcs:
        temp_fcs.write(await file.read())
        temp_fcs_path = temp_fcs.name

    # Generate the output CSV file path
    
    global output_csv_path
    output_csv_path = f"{temp_fcs_path}.csv"
    # global fcs_path
    # fcs_path = temp_fcs_path
    # if os.path.exists(output_csv_path):
    #     with open(output_csv_path, "r") as csv_file:
    #         reader = csv.reader(csv_file)
    #         column_names = next(reader)
    #         # db["column_names"].insert_one({"columnNames": column_names})

    #     # Delete the temporary files
        
    #     os.remove(temp_fcs_path)
    #     print(file_id)

    #     # Store the column names in the database
    #     db["column_names"].update_one(
    #         {"_id": file_id},
    #         {"$set": {"columnNames": column_names}},
    #         upsert=True,
    #     )

    #     return {"fileId": file_id, "columnNames": column_names}


        # return {"columnNames": column_names}

    try:
        file_contents = await file.read()
        file_id = str(uuid.uuid4())
        print (file_id)

        # Store the uploaded FCS file in the database
        db["files"].insert_one({
            "fileId": file_id,
            "filename": file.filename,
            "timestamp": datetime.now(),
            "fcsContents": base64.b64encode(file_contents).decode('utf-8'),
            "isConverted": False,
        })


        # Execute your FCS to CSV conversion script
        command = f"python fcs_csv.py {temp_fcs_path} {output_csv_path}"
        subprocess.run(command, shell=True, check=True)

        # Read the CSV file and extract column names
        with open(output_csv_path, "r") as csv_file:
            reader = csv.reader(csv_file)   
            column_names = next(reader)
            # print(column_names)
        with open(output_csv_path, "rb") as csv_file:
            csv_contents = csv_file.read()
        print("chal rha hai")
        try:
            db["files"].update_one(
                {"fileId": file_id},
                {"$set": {"csvContents": base64.b64encode(csv_contents).decode('utf-8'), "isConverted": True}},
            )
        except Exception as e:
            print("Error updating 'files' collection:", str(e))

        print("chal rha hai abhi toh")

            
            # db["column_names"].insert_one({"columnNames": column_names})
        db["column_names"].update_one(
            {"_id": file_id},
            {"$set": {"columnNames": column_names}},
            upsert=True,
        )
        fcs_file = flowio.FlowData(temp_fcs_path)
        if 'spillover' in fcs_file.text:
            spillover_matrix, column_headers = flowutils.compensate.get_spill(fcs_file.text['spillover'])
        else:
            # If spillover matrix doesn't exist, create an empty matrix with all values set to 0
            spillover_matrix = np.zeros((len(column_names), len(column_names)))
            column_headers=column_names
            print("chal rha agar yeh spillover ni hai toh")
        
        df_spillover_matrix = pd.DataFrame(spillover_matrix, columns=column_headers)
        df_json = df_spillover_matrix.to_json(orient="columns")

# Convert the JSON to a dictionary
        spillover_data = json.loads(df_json)


        spillover_matrix_collection.update_one(
            {"_id": file_id},
            {"$set": {"spilloverMatrix": spillover_data}},
            upsert=True,
        )

        print("Saved spillover matrix in MongoDB collection 'spillover_matrix'")
        os.remove(temp_fcs_path) 


        return {"fileId": file_id, "columnNames": column_names}

        
        # return {"columnNames": column_names}

    except Exception as e:
        os.remove(temp_fcs_path)
        return {"error": str(e)}


class PlotRequest(BaseModel):
    # file_id: str
    x_column: str
    y_column: str
    x_scale: str
    y_scale: str


@app.post("/api/generate-plots")
async def generate_plots(request: PlotRequest ,file_id: str ):
    # config = authorized_configs.get(token)
    # if not config:
    #     raise HTTPException(status_code=401, detail="Unauthorized")
    # # Small delay to allow time for output_csv_path to be updated
    await asyncio.sleep(0.1)
    # file_id=request.file_id

    x_column = request.x_column
    y_column = request.y_column
    x_scale = request.x_scale
    y_scale = request.y_scale
    try:
        print("X Column:", x_column)
        print("Y Column:", y_column)
        print("X Scale:", x_scale)
        print("Y Scale:", y_scale)
        file_data = db["files"].find_one({"fileId": file_id})
        if not file_data or not file_data.get("isConverted") or not file_data.get("csvContents"):
            return {"error": "CSV file not found or not converted"}

        # Decode the CSV contents from base64
        csv_contents = base64.b64decode(file_data["csvContents"])

        # Read the CSV contents into a Pandas DataFrame
        df = pd.read_csv(io.BytesIO(csv_contents))
        print("Returning response...")
        print("Dataframe shape:", df.shape)
        print("Columns:", df.columns)

        # Create a new figure and axis objects
        fig, ax = plt.subplots()
        ax.scatter(df[x_column], df[y_column])
        if x_scale == "linear":
            ax.set_xscale("linear")
        elif x_scale == "log":
            ax.set_xscale("log")

        # Set y-axis scale
        if y_scale == "linear":
            ax.set_yscale("linear")
        elif y_scale == "log":
            ax.set_yscale("log")
        # flow_data = fk.FlowData(fcs_path)
        # flow_data.transform(xscale=x_scale, yscale=y_scale)
        # flow_data.plot(x=x_column, y=y_column, ax=ax)
        ax.set_xlabel(x_column)
        ax.set_ylabel(y_column)
        ax.set_title(f"Flow Cytometry Plot: {x_column} vs {y_column}")

        buffer=io.BytesIO()
        plt.savefig(buffer, format='png')
        buffer.seek(0)
        image_data=base64.b64encode(buffer.read()).decode('utf-8')
        
        if image_data:
            print("Plot has been created successfully")
            return {"imageData": image_data}
        else:
            return {"error": "Failed to generate plot."}

    except Exception as e:
        # Handle any errors that occur during plot generation
        return {"error": str(e)}

# using db to get the columnnames
@app.get("/api/get-column-names")
async def get_column_names(file_id: str):
    document = db["column_names"].find_one({"_id": file_id})
    if document:
        column_names = document["columnNames"]
        return {"columnNames": column_names}
    else:
        return {"columnNames": []}

@app.get("/api/get-spillover-matrix")
async def get_spillover_matrix(file_id: str):
    document = spillover_matrix_collection.find_one({"_id": file_id})
    if document:
        spillover_matrix = document["spilloverMatrix"]
        return {"spilloverMatrix": spillover_matrix}
    else:
        return {"spilloverMatrix": []}


