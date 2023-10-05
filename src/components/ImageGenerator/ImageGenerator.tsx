import React, { useRef, useState } from 'react';
import './ImageGenerator.css';
import default_image from '../../assets/default_image.jpg';

const ImageGenerator: React.FC = () => {

    const [image_url, setImage_url] = useState<string>('/');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
          generateImage();
        }
      };
    
    const generateImage = async () => {
        if (inputRef.current && inputRef.current.value === "") {
            return;
        }

        setIsLoading(true);

        const response = await fetch(
            "https://api.openai.com/v1/images/generations",
            {
                method:"POST",
                headers:{
                    "Content-Type":"application/json",
                    Authorization:
                    `Bearer ${import.meta.env.VITE_OPEN_API_KEY}`,
                    "User-Agent":"Chrome",
                },
                body:JSON.stringify({
                    prompt: `${inputRef.current?.value}`,
                    n: 1,
                    size: "512x512",
                }),
            }
        );
        let data = await response.json();
        let data_array = data.data;
        setImage_url(data_array[0].url);
        setIsLoading(false);
    }

    return (
        <div className='ai-image-generator'>
            <div className="header"> AI Image <span>Generator</span></div>
            <div className="img-loading">
                <div className="image"><img src={image_url === "/" ? default_image : image_url} alt="" width="512" height="512" /></div>

            </div>
            <div className="search-box">
                <input type="text" ref={inputRef} className="search-input" placeholder="Enter Text" onKeyDown={handleKeyDown} />
                <button className={`generate-btn ${isLoading ? 'disabled' : ''}`} onClick={() => { generateImage() }} disabled={isLoading}>
                    {isLoading ? <div className="spinner"></div> : "Generate"}
                </button>
            </div>

        </div>
    );
}

export default ImageGenerator;

