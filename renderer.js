const THREE = require('three')

let renderer = undefined
let scene = undefined
let camera = undefined
let model = undefined

function setModel (newModel) {
  if (model) {
    scene.remove(model)
  }
  model = newModel
  newModel.scale.x = newModel.scale.y = newModel.scale.z = 0.75
  newModel.translation = newModel.geometry.center()
  scene.add(newModel)
  renderer.render(scene, camera)
}

function init () {
  renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(700, 600)
  document.getElementById('canvas').appendChild(renderer.domElement)
    
  scene = new THREE.Scene()
    
  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000)

  camera.position.set(-1, 1, 1)
  camera.lookAt(scene.position)
    
  const light = new THREE.AmbientLight(0xffffff)
  scene.add(light)
    
  renderer.setClearColor( 0xdddddd, 1)
  renderer.render(scene, camera)

  const SPEED = 0.1
  return () => {
    if (!model) { return }
    model.rotation.y -= SPEED
    renderer.render(scene, camera)
  }
}

module.exports = {
  setModel,
  init
}
