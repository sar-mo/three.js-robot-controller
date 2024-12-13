import './style.css'
import ReactDOM from 'react-dom/client'
import { Canvas } from '@react-three/fiber'
import Experience from './Experience.jsx'
import { Physics } from '@react-three/rapier'
import { KeyboardControls } from '@react-three/drei'

const keyboardMap = [
    { name: 'forward', keys: [ 'ArrowUp', 'KeyW' ] },
    { name: 'backward', keys: [ 'ArrowDown', 'KeyS' ] },
    { name: 'leftward', keys: [ 'ArrowLeft', 'KeyA' ] },
    { name: 'rightward', keys: [ 'ArrowRight', 'KeyD' ] },
    { name: 'jump', keys: [ 'Space' ] },
    { name: 'run', keys: [ 'Shift' ] },
    
    // Optional animation key map
    { name: 'action1', keys: [ '1' ] },
    { name: 'action2', keys: [ '2' ] },
    { name: 'action3', keys: [ '3' ] },
    { name: 'action4', keys: [ 'KeyF' ] },
]
const root = ReactDOM.createRoot(document.querySelector('#root'))

root.render(
    <>
    <KeyboardControls map={keyboardMap}>
    <Canvas
        shadows 
        camera={ { fov: 25, near: 0.1, far: 200, position: [ 0, 4, 6 ] } }
        style={ { touchAction: 'none' } }
        >

        <Physics debug>
            <Experience />
        </Physics>
    </Canvas>
    </KeyboardControls>
    </>
)