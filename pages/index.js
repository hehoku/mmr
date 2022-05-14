import Head from 'next/head'
import Image from 'next/image'
import { useState, useRef, useEffect } from 'react'
import styles from '../styles/Home.module.css'

export default function Home() {
  const [target, setTarget] = useState(10000)
  const [current, setCurrent] = useState(2000)
  const [selectedImage, setSelectedImage] = useState(null)

  const hiddenFileInput = useRef(null)
  const canvasRef = useRef(null)

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

  // DONE: Convert percentage to emoji and display it
  const convertPercentageToEmoji = percentage => {
    const process = Math.floor(percentage * 10)
    const doneEmoji = '🟩'.repeat(Math.min(10, process))
    const inProgressEmoji = '🟨'.repeat(10 - Math.min(process, 10))
    return doneEmoji + inProgressEmoji
  }

  useEffect(() => {
    if (canvasRef.current && selectedImage) {
      const context = canvasRef.current.getContext('2d')
      const w = context.canvas.width
      const h = context.canvas.height
      const centerX = w / 2
      const centerY = h / 2
      const radius = Math.min(w, h) / 2

      context.beginPath()
      context.arc(centerX, centerY, radius, 0, 2 * Math.PI)
      context.fillStyle = 'green'
      context.clip()

      const image = new window.Image()
      console.log(selectedImage)
      image.src = URL.createObjectURL(selectedImage)
      image.onload = () => {
        context.drawImage(image, 0, 0, w, h)
      }

      context.beginPath()
      context.arc(centerX, centerY, radius - 20, 0, 2 * Math.PI)
      context.clip()
    }
  }, [selectedImage])

  // DONE: draw an image on canvas, and add circle process decoration
  return (
    <div className="flex h-screen flex-row items-center justify-center">
      <div className="flex flex-col items-center justify-center">
        <div className="h-32 w-32 rounded-full bg-gray-500">
          {' '}
          {selectedImage && (
            <div>
              <canvas
                className="h-32 w-32"
                ref={canvasRef}
                width={'250px'}
                height={'250px'}
              />
            </div>
          )}
        </div>
        <button
          className="my-4 rounded-md bg-green-400 p-2 text-2xl font-bold text-white"
          onClick={handleButtonClick}
        >
          Upload
          <input
            className="hidden"
            type="file"
            name="myImage"
            onChange={handleFileChange}
            ref={hiddenFileInput}
          />
        </button>
      </div>
      <div className="ml-12 mb-12 flex flex-col">
        <label className="mb-4 text-2xl font-bold">
          Target:{' '}
          <input
            className="rounded-md border-2 border-black"
            type="text"
            value={target}
            onChange={handleTargetChange}
          />
        </label>
        <label className="text-2xl font-bold">
          Current:{' '}
          <input
            className="rounded-md border-2 border-black"
            type="text"
            onChange={handleCurrentChange}
            value={current}
          />
        </label>
        <p className="mt-4 text-2xl font-bold">
          {convertPercentageToEmoji(current / target)}
          {target && ((current / target) * 100).toFixed(2)}%
        </p>
      </div>
    </div>
  )
}
