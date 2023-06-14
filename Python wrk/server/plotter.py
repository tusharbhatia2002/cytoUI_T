import subprocess
import pandas as pd
import matplotlib.pyplot as plt
import mpld3
from fastapi import FastAPI, File, UploadFile
from fastapi.responses import HTMLResponse
from tempfile import NamedTemporaryFile
app = FastAPI()
@app.post("/api/generate-plots")
async def generate_plots(file: UploadFile = File(...), x_axis: str = "", y_axis: str = ""):
    with NamedTemporaryFile(suffix=".fcs") as f:
        f.write(await file.read())
        f.seek(0)

        # Define the command to execute your script and generate the plots
        command = ["python", "generate_plots.py", f.name, x_axis, y_axis]
        try:
            subprocess.run(command, check=True)
            html_file = "output.html"
            with open(html_file, "r") as f:
                html_content = f.read()
            return HTMLResponse(content=html_content)
        except subprocess.CalledProcessError as e:
            error_message = f"Error: {e.returncode}\n{e.output.decode('utf-8')}"
            return {"error": error_message}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("receive:app", host="0.0.0.0", port=8000)
