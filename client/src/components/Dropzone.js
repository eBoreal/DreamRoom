//*Dropzone.js*//

import React from "react";
import { useDropzone } from "react-dropzone";
import { ButtonDrop } from "./base_components"

function Dropzone({ onDrop, open }) {
    const { getRootProps, getInputProps, isDragActive, acceptedFiles } =
    useDropzone({
    accept: {
        'image/png': ['.png'],
        'image/jpg': ['.jpg'],
        'image/jpeg': ['.jpeg'],
    },
    onDrop,
    });

    const files = acceptedFiles.map((file) => (
      <li key={file.path}>
        {file.path} - {file.size} bytes
      </li>
    ));
    return (
      <div className="container">
        <div {...getRootProps({ className: "dropzone" })}>
          <input {...getInputProps()} />
        
            <p>
                Drag and drop your image in this box. 
            </p>
            <p>
                 Or 
            </p>
            <ButtonDrop type="button" onClick={open} className="btn">
                Click to select files
            </ButtonDrop>

        </div>
        <aside>
          <ul>{files}</ul>
        </aside>
      </div>
    );
  }
  export default Dropzone;