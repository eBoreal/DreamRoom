import React, { useState, useEffect, useRef } from "react";

function Image(props) {
    const [imageSrc, setImageSrc] = useState(props.imageUrl)
    const [fileName, setFileName] = useState(props.fileName)

    return (
        <a download={fileName} href={imageSrc}>
            <img style={{ width: "auto", height: 512}} src={imageSrc} 
            alt={fileName}/>
        </a>

    )
  }

export default Image;