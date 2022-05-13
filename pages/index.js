import Head from 'next/head'
import Image from 'next/image'
import { useState, useRef } from 'react'
import styles from '../styles/Home.module.css'

export default function Home () {
  const [target, setTarget] = useState(10)
  const [current, setCurrent] = useState(0)
  const [selectedImage, setSelectedImage] = useState(null)

  const hiddenFileInput = useRef(null)

  const handleTargetChange = e => {
    setTarget(e.target.value)
  }

  const handleCurrentChange = e => {
    setCurrent(e.target.value)
  }

  const handleButtonClick = e => {
    hiddenFileInput.current.click()
  }

  const handleFileChange = e => {
    const fileUploaded = e.target.files[0]
    setSelectedImage(fileUploaded)
  }

  // TODO: Convert percentage to emoji and display it
  const convertPercentageToEmoji = percentage => {
    const process = Math.floor(percentage * 10)
    const doneEmoji = '🟩'.repeat(Math.min(10, process))
    const inProgressEmoji = '🟨'.repeat(10 - Math.min(process, 10))
    return doneEmoji + inProgressEmoji
  }

  return (
    <div className='flex h-screen flex-row items-center justify-center'>
      <div className='flex flex-col items-center justify-center'>
        <div className='h-32 w-32 rounded-full bg-gray-500'>
          {selectedImage && (
            <Image
              width={'250px'}
              height={'250px'}
              className='rounded-full'
              src={URL.createObjectURL(selectedImage)}
              alt='img'
            />
          )}
        </div>
        <button
          className='my-4 rounded-md bg-green-400 p-2 text-2xl font-bold text-white'
          onClick={handleButtonClick}
        >
          Upload
          <input
            className='hidden'
            type='file'
            name='myImage'
            onChange={handleFileChange}
            ref={hiddenFileInput}
          />
        </button>
      </div>
      <div className='ml-12 mb-12 flex flex-col'>
        <label className='mb-4 text-2xl font-bold'>
          Target:{' '}
          <input
            className='rounded-md border-2 border-black'
            type='text'
            value={target}
            onChange={handleTargetChange}
          />
        </label>
        <label className='text-2xl font-bold'>
          Current:{' '}
          <input
            className='rounded-md border-2 border-black'
            type='text'
            onChange={handleCurrentChange}
            value={current}
          />
        </label>
        <p className='mt-4 text-2xl font-bold'>
          Process: {target && (current / target) * 100}%
          {convertPercentageToEmoji((current / target))}
        </p>
      </div>
    </div>
  )
}
