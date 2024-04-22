'use client';

import { FileIcon, X } from 'lucide-react';
import Image from 'next/image';

import { UploadDropzone } from '@/lib/uploadthing';
import imageCompression from 'browser-image-compression';
import qs from 'query-string';

import '@uploadthing/react/styles.css';
import axios from 'axios';
import { useState } from 'react';
import BeatLoader from 'react-spinners/BeatLoader';

interface FileUploadProps {
  onChange: (url?: string) => void;
  value: string;
  // endpoint matches the key in ourFileRouter created in app/api/uploadthing/core.ts
  endpoint: 'messageFile' | 'serverImage';
  setError: (isError: string) => void;
  fileName?: string;
  setFileName?: (fileName: string) => void;
}

export const FileUpload = ({ 
  onChange, value, endpoint, setError, fileName, setFileName 
}: FileUploadProps) => {
  const fileType = value?.split('.').pop();
  const [isLoading, setIsLoading] = useState(false);

  const handleRemove = async () => {
    setError("Attachment is required");
    if (endpoint === 'messageFile') {
      const url = qs.stringifyUrl({
        url: `/api/uploadthing/files`,
        query: { 
          url: value,
        }
      });
      await axios.delete(url);
    }
  }

  if (value && fileType !== 'pdf') {
    return (
      <>
        {!isLoading && (
          <div className="relative h-20 w-20">
            <a href={value} target="_blank" rel="noopener noreferrer">
              <Image fill src={value} alt={fileName || value} className="rounded-full" />
            </a>
            <button
              onClick={() => onChange('')}
              className="bg-rose-500 text-white p-1 rounded-full absolute top-0 right-0 shadow-sm"
              type="button"
              >
              <X 
                onClick={handleRemove}
                className="h-4 w-4" 
              />
            </button>
          </div>
        )}
      </>
    );
  }

  if (value && fileType === 'pdf') {
    return (
      <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
        <FileIcon className="h-10 w-10 fill-indigo-200 stroke-indigo-400" />
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline"
        >
          {fileName || value}
        </a>
        <button
          onClick={() => onChange('')}
          className="bg-rose-500 text-white p-1 rounded-full absolute -top-2 -right-2 shadow-sm"
          type="button"
        >
          <X 
            onClick={handleRemove}
            className="h-4 w-4" 
          />
        </button>
      </div>
    );
  }

  return (
    <>
      {isLoading ? (
        <BeatLoader size={8} color={"#1E1F22"} loading={isLoading} />
      ) : (
      <UploadDropzone
        endpoint={endpoint}
        onBeforeUploadBegin={async (files) => {
          setError("");
          setIsLoading(true);
          const compressedFiles = [];
          for (let file of files) {
            if (file.type.startsWith('image/')) {
              const options = {
                maxSizeMB: 2,
                useWebWorker: true,
              };
              const compressedFile = await imageCompression(file, options);
              compressedFiles.push(
                new File([compressedFile], file.name, { type: file.type }),
              );
            } else {
              compressedFiles.push(
                new File([file], file.name, { type: file.type }),
              );
            }
          }
          return compressedFiles;
        }}
        onClientUploadComplete={(res: any) => {
          if (res && res.length > 0) {
            setError("");
            if (setFileName) setFileName(res[0].name);
            onChange(res[0].url);
          } else {
            setError("Attachment is required");
          }
          setIsLoading(false);
        }}
        onUploadError={(error: Error) => {
          setError(error.message);
          console.log(error);
          setIsLoading(false);
        }}
      />
      )}
    </>
  );
};
