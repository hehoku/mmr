import Head from 'next/head'
import Image from 'next/image'
import { useState, useRef, useEffect } from 'react'
import styles from '../styles/Home.module.css'

export default function Home() {
  const [target, setTarget] = useState(10000)
  const [current, setCurrent] = useState(2000)
  const [progress, setProgress] = useState(target && current / target)
  const [selectedImage, setSelectedImage] = useState(null)

  const hiddenFileInput = useRef(null)
  const canvasRef = useRef()

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

  // DONE: draw an image on canvas, and add circle process decoration
  // DONE: add two circular ring, one as background, the other as progress
  useEffect(() => {
    if (selectedImage) {
      console.log(`draw image with process: ${progress} `)
      const context = canvasRef.current.getContext('2d')
      const w = context.canvas.width
      const h = context.canvas.height
      const centerX = w / 2
      const centerY = h / 2
      const radius = Math.min(w, h) / 2
      console.log(`canvas size: ${w} x ${h}`)
      context.clearRect(0, 0, w, h)

      // draw background
      context.beginPath()
      context.arc(centerX, centerY, radius, 0, 2 * Math.PI)
      context.fillStyle = 'rgba(0, 0, 0, 0.1)'
      context.fill()
      context.clip()

      // circular ring for progress
      context.beginPath()
      context.arc(
        centerX,
        centerY,
        radius - 10,
        -Math.PI * 0.5,
        2 * Math.PI * progress - Math.PI * 0.5,
        false
      )
      context.lineWidth = 20
      context.lineCap = 'round'
      var gradient = context.createLinearGradient(0, 0, w, h)
      gradient.addColorStop(0, 'hsl(240deg 100% 20%)')
      gradient.addColorStop(0.11, 'hsl(289deg 100% 21%)')
      gradient.addColorStop(0.22, 'hsl(315deg 100% 27%)')
      gradient.addColorStop(0.33, 'hsl(329deg 100% 36%)')
      gradient.addColorStop(0.44, 'hsl(337deg 100% 43%)')
      gradient.addColorStop(0.56, 'hsl(357deg 91% 59%)')
      gradient.addColorStop(0.67, 'hsl(17deg 100% 59%)')
      gradient.addColorStop(0.78, 'hsl(34deg 100% 53%)')
      gradient.addColorStop(0.89, 'hsl(45deg 100% 50%)')
      gradient.addColorStop(1, 'hsl(55deg 100% 50%)')
      context.strokeStyle = gradient
      context.stroke()

      // BUG：以下代码不启用的时候可以动态展示 progress bar, 启用下面代码后无法正常显示
      // draw image
      context.beginPath()
      context.arc(centerX, centerY, radius - 20, 0, 2 * Math.PI)
      const image = new window.Image()
      console.log(selectedImage)
      image.src = URL.createObjectURL(selectedImage)
      image.onload = () => {
        console.log('requesting for image')
        context.drawImage(image, 0, 0, w, h)
      }
      context.clip()
      context.save()
    }
  }, [progress, selectedImage])

  useEffect(() => {
    setProgress(target && current / target)
  }, [target, current])

  // TODO: current user should set the target and current, then upload an image
  // other can't generate the progress

  return (
    <div className="flex h-screen flex-row items-center justify-center">
      <div className="flex flex-col items-center justify-center">
        <div className="h-64 w-64 bg-gray-500">
          {' '}
          {selectedImage && (
            <div>
              <canvas
                className="h-64 w-64"
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
      <div className="ml-12 mb-12 flex w-1/2 flex-col">
        <p className="mb-4 text-xl font-bold">
          Fill the target and current, then upload an image.
        </p>
        <p className="mb-4 text-xl font-bold">
          If you want get new image, please refresh the page.
        </p>
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
          {(progress * 100).toFixed(2)}%
        </p>
      </div>
    </div>
  )
}
