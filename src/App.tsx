import * as React from "react";
import { useRef, useState, useEffect } from "react";

// import dotenv from 'dotenv';
// dotenv.config();

export default () => {

    const [dockerImage, setDockerImage] = useState();
    const [response, setResponse] = useState();

    const fetchSBOM = async (e:any) => {
        const genButton = e.target;
        genButton.disabled = true;
        genButton.innerHTML = "Processing...";

        const f = await fetch(import.meta.env.VITE_SERVER_URL as RequestInfo);
        const res = await f.json();
        setResponse(res);

        genButton.disabled = false;
        genButton.innerHTML = "Generate";
    }

    return(
    <>
        <h1 className="display-5">CycloneDX SBOM Generator</h1>
        <div className="form-group">
            <label>Docker Image</label>
            <input
                type="text"
                id="dockerImageInput"
                name="dockerImage"
                placeholder="example: linuxserver/sickbeard"
                onChange={(e:any) => setDockerImage(e.target.value)}
            />
        </div>
        <button className="btn btn-primary" onClick={fetchSBOM}>Generate</button>

        {response && (
        <div id="response">
            {JSON.stringify(response)}
        </div>
        )}

    </>
    );
}