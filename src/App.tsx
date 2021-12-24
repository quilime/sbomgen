import * as React from "react";
import { useRef, useState, useEffect } from "react";

// import dotenv from 'dotenv';
// dotenv.config();

export default () => {

    const [dockerImage, setDockerImage] = useState("");
    const [error, setError] = useState("");

    const fetchSBOM = async (e:any) => {
        setError("");

        const genButton = e.target;
        genButton.disabled = true;
        genButton.innerHTML = "Processing...";

        window.onbeforeunload = (event) => confirm("Confirm refresh?");

        const f = await fetch(import.meta.env.VITE_SERVER_URL as RequestInfo, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                dockerImage : dockerImage
            })
        });
        const res = await f.json();

        if (res.blob) {

            // warning -- entering hack city
            // Create blob link to download
            const url = window.URL.createObjectURL(new Blob([res.blob]));
            const link = document.createElement('a');
            const dockerImageClean = dockerImage.replace('/', '-');
            link.href = url;
            link.setAttribute('download', `${dockerImageClean}.cyclonedx`);
            document.body.appendChild(link);
            link.click();

            if (link.parentNode) {
                link.parentNode.removeChild(link);
            }

        } else if (res.error) {
            console.log(res.error);
            setError(res.error);
        }


    window.onbeforeunload = (event) => null;
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

        <button disabled={dockerImage ? false : true } className="btn btn-primary" onClick={fetchSBOM}>Generate</button>

        {error && (<>
            <br />
            <br />
            <div className="alert alert-warning">
                {error}
            </div>
        </>)}
    </>
    );
}
