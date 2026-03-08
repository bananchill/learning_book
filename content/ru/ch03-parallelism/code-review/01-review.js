// Этот код содержит несколько проблем с параллелизмом.
// Найди и опиши все проблемы.

async function processImages(images) {
  const results = []
  for (const image of images) {
    const worker = new Worker('image-processor.js')
    const result = await new Promise((resolve) => {
      worker.onmessage = (e) => resolve(e.data)
      worker.postMessage(image.buffer)
    })
    worker.terminate()
    results.push(result)
  }
  return results
}

function sharedCounter(sab) {
  const view = new Int32Array(sab)
  view[0] = view[0] + 1
  return view[0]
}

function sendLargeData(worker, arrayBuffer) {
  worker.postMessage({ data: arrayBuffer, timestamp: Date.now() })
  console.log('Буфер отправлен, размер:', arrayBuffer.byteLength)
}

function waitForResult(sab) {
  const view = new Int32Array(sab)
  Atomics.wait(view, 0, 0)
  return Atomics.load(view, 0)
}
