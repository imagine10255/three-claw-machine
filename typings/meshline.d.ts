
import {MeshLineGeometry, MeshLineMaterial} from 'meshline';

declare module '@react-three/fiber' {
    interface ThreeElements {
        meshLineGeometry: ThreeElements['bufferGeometry'] & {
            args?: ConstructorParameters<typeof MeshLineGeometry>,
        }
        meshLineMaterial: ThreeElements['material'] & {
            args?: ConstructorParameters<typeof MeshLineMaterial>,
            color?: string,
            transparent?: boolean,
            opacity?: number,
            lineWidth?: number,
            resolution?: [number, number],
            depthTest?: boolean,
        }
    }
}
