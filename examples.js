const THREE = require('three')
const _ = require('underscore')

function createCubeOutput () {
  const modifier = Math.random()
  return [0.5,0.5,0.5,0.5,0.5,-0.5,0.5,-0.5,0.5,0.5,-0.5,-0.5,-0.5,0.5,-0.5,-0.5,0.5,0.5,-0.5,-0.5,-0.5,-0.5,-0.5,0.5]
    .map(v => v * modifier)
}

function createCubeExamples (numberOfExamples) {
  return [...new Array(numberOfExamples)].map(() => ({
    input: [Math.random()],
    output: createCubeOutput()
  }))
}

function loadGrassAsync (progressCallback, number = undefined) {
  return new Promise((resolve, reject) => {
    const loader = new THREE.JSONLoader()
    loader.load(`assets/models/grass${number || ''}.json`,
      (geometry, materials) => {
        const grass = new THREE.Mesh(geometry, materials)
        grass.material.side = THREE.DoubleSide
        resolve(grass)
      },
      xhr => {
        if (progressCallback) {
          progressCallback(xhr.loaded)
        }
      },
      reject
    )
  })
}

async function loadGrassExamplesAsync (numberOfExamples, progressCallback) {
  const grass = await loadGrassAsync(progressCallback)
  const grass2 = await loadGrassAsync(progressCallback, 2)
  const grass3 = await loadGrassAsync(progressCallback, 3)
  const grass4 = await loadGrassAsync(progressCallback, 4)
  
  const createOutput = (g) => {
    const modifier = 1
    return g.geometry.vertices.reduce((p, v) => {
      p.push(v.x * modifier, v.y * modifier, v.z * modifier)
      return p
    }, [])
  }

  return _.shuffle([...new Array(numberOfExamples)].reduce((last) => ([
    ...last,
    {
      input: [0],
      output: createOutput(grass)
    },
    {
      input: [0.33],
      output: createOutput(grass2)
    },
    {
      input: [0.66],
      output: createOutput(grass3)
    },
    {
      input: [1],
      output: createOutput(grass4)
    },
  ]), []))
}

module.exports = {
  createCubeExamples,
  loadGrassAsync,
  loadGrassExamplesAsync
}