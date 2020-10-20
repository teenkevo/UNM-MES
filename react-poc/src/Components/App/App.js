import React from 'react';
import './App.css';
import {Container, Row, Col} from 'react-bootstrap';
import NavigationBar from '../NavigationBar/NavigationBar'
import AlgorithmInfo from '../AlgorithmInfo/AlgorithmInfo'
import MqttBrokerConfig from '../MqttBrokerConfig/MqttBrokerConfig'
import BIMViewerForge from '../BIMViewerForge/BIMViewerForge'
//import GLTFModel from '../GLTFModel/GLTFModel';
import IncomingDataPayload from '../IncomingDataPayload/IncomingDataPayload'
// import Neo4JGraphViewer from '../Neo4JGraphViewer/Neo4JGraphViewer'
import { NeoGraph } from '../NeoGraph/NeoGraph';


const NEO4J_URI = "bolt://localhost:11008";
const NEO4J_USER = "neo4j";
const NEO4J_PASSWORD = "letmein";


function App() {
  return (
      <div>
        
        <NavigationBar/>
        <Container fluid>
          <Row>
            <Col md={4}><AlgorithmInfo/></Col>  
          </Row>
          <Row>
            <Col md={4}><MqttBrokerConfig/></Col>  
          </Row>
          <Row>
            <Col md={4}><IncomingDataPayload/></Col>  
          </Row>
          <BIMViewerForge/>
          
          <NeoGraph
            width={480}
            height={400}
            containerId={"id1"}
            neo4jUri={NEO4J_URI}
            neo4jUser={NEO4J_USER}
            neo4jPassword={NEO4J_PASSWORD}
            backgroundColor={"rgb(246, 255, 255)"}
          />
          {/* <Neo4JGraphViewer/> */}
        </Container>
        {/*<GLTFModel />*/}
      </div>
  );
}

export default App;
