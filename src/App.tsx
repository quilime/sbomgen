import * as React from "react";
import { useRef, useState, useEffect } from "react";

// import dotenv from 'dotenv';
// dotenv.config();

export default () => {

    const [dockerImage, setDockerImage] = useState("");
    const [dockerTag, setDockerTag] = useState("latest");
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
                dockerImage : dockerImage + ":" + dockerTag
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
            link.setAttribute('download', `${dockerImageClean}-${dockerTag}.cyclonedx`);
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

            <br />

            <label>Docker Image</label>
            <br />
            <input
                style={{ width: "100%" }}
                type="text"
                placeholder="example: ubuntu, or amazon/aws-node-termination-handler"
                onChange={(e:any) => setDockerImage(e.target.value)}
            />
            <br />
            <br />

            <label>Tag</label>
            <br />
            <input
                type="text"
                placeholder="latest"
                value={dockerTag}
                onChange={(e:any) => setDockerTag(e.target.value)}
            />

            <br />
            <br />

            <button disabled={dockerImage ? false : true } className="btn btn-primary" onClick={fetchSBOM}>Generate</button>
        </div>





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
