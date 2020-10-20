import React from 'react';
import {Card} from 'react-bootstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLaptopCode } from "@fortawesome/free-solid-svg-icons";
import { sampleModel1 } from '../../models';
import { GLTFViewer } from 'xeokit-react';

const gltfModelCard = {
  border: 'none',
  borderRadius: '0',
  marginBottom: '10px',
  boxShadow: '3px 4px 8px -4px rgba(0, 0, 0, 0.4)'
}

const GLTFModel = () => (
  <div>
    <Card style={gltfModelCard}>
      <Card.Header as="h5">
        <FontAwesomeIcon icon={faLaptopCode} style={{ color: "red" }} size="1x" className = "mr-2"/>
        Computation Model
      </Card.Header>
      <Card.Body>
        <GLTFViewer
          canvasID="canvas-gltf"
          width={600}
          height={600}
          models={[sampleModel1]}
        />
      </Card.Body>
    </Card>
  </div>
);

export default GLTFModel;
