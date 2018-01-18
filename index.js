(async function(){
  const brain = require('brain')
  const NeuralNetwork = brain.NeuralNetwork

  const THREE = require('three')
  
  const examples = require('./examples')
  const renderer = require('./renderer')

  const render = renderer.init()

  setInterval(render, 33)
  
  const net = new NeuralNetwork({
    hiddenLayers: [6],
    learningRate: 0.3
  })

  try {
    let grass = await examples.loadGrassAsync()
    const grassExamples = await examples.loadGrassExamplesAsync(1)
    renderer.setModel(grass)

    net.train(grassExamples, {
      errorThresh: 0.005,  // error threshold to reach 
      iterations: 2000,   // maximum training iterations 
      log: true,           // console.log() progress periodically 
      logPeriod: 100,       // number of iterations between logging 
      learningRate: 0.1    // learning rate 
    })

    setInterval(async () => {
      const sampleInput = [Math.random()]
      console.log(`Sampling for: ${JSON.stringify(sampleInput)}`)
      const newVerts = net.run(sampleInput)

      grass = await examples.loadGrassAsync()
      grass.geometry.vertices = []
      newVerts.reduce((last, c) => {
        last.push(c)
        if (last.length === 3) {
          grass.geometry.vertices.push(new THREE.Vector3(last[0], last[1], last[2]))
          return []
        }
        return last
      }, [])
      grass.geometry.computeVertexNormals()

      renderer.setModel(grass)
      console.log('here')
    }, 3000)
  } catch (ex) {
    console.log(ex)
  }
})()
