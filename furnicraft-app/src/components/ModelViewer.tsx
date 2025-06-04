"use client";
import Script from "next/script";

import { useEffect, useState } from "react";
export default function ModelViewer({ imageUrl }: { imageUrl: string }) {
    const [isTrue, setIsTrue] = useState(false);
    const [srcImage, setSrcImage] = useState<string>("");
    useEffect(() => {
        setSrcImage(imageUrl)
        setIsTrue(true);
    }, []);

    return (
        <>
            <Script
                type="module" src="https://ajax.googleapis.com/ajax/libs/model-viewer/4.0.0/model-viewer.min.js"
            />
            {isTrue &&
                //@ts-ignore
                <model-viewer
                    src={srcImage}
                    auto-rotate
                    camera-controls
                    ar
                    style={{ width: '100%', height: '500px' }}
                    shadow-intensity="1"
                />}
        </>

    );
}

// <model-viewer alt="Neil Armstrong's Spacesuit from the Smithsonian Digitization Programs Office and National Air and Space Museum" src="shared-assets/models/NeilArmstrong.glb" ar environment-image="shared-assets/environments/moon_1k.hdr" poster="shared-assets/models/NeilArmstrong.webp" shadow-intensity="1" camera-controls touch-action="pan-y"></model-viewer>