import React from 'react'
import {Accordion, Button, Card, InputGroup, FormControl,} from 'react-bootstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThermometerHalf } from "@fortawesome/free-solid-svg-icons";

const incomingDataPayloadCard = {
    border: 'solid rgb(220,220,220)',
    borderRadius: '0',
    marginBottom: '10px',
    position: 'static'
}
const IncomingDataPayload = () => {
    return (
        <div>
            <Accordion>
                <Card style={incomingDataPayloadCard}>
                    <Accordion.Toggle as={Card.Header} eventKey="0">
                        <FontAwesomeIcon icon={faThermometerHalf} style={{ color: 'red' }} className = "mr-2"/>
                        <span style={{fontSize:16}}>Sensors</span>
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey="0">
                        <div>
                            <Card.Body>
                                <InputGroup size="sm" className="mb-3">
                                    <InputGroup.Prepend>
                                    <InputGroup.Text id="inputGroup-sizing-sm">Sensor ID</InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <FormControl className="text-muted" aria-label="Small" aria-describedby="inputGroup-sizing-sm" defaultValue="ESP32_DHT22" />
                                </InputGroup>

                                <InputGroup size="sm" className="mb-3">
                                    <InputGroup.Prepend>
                                        <InputGroup.Text id="inputGroup-sizing-sm">MQTT Publishing Topic</InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <FormControl className="text-muted" aria-label="Small" aria-describedby="inputGroup-sizing-sm" defaultValue="sensors/dht/tts"/>
                                </InputGroup>
                            </Card.Body>
                            
                            <Card.Footer className='d-flex'>
                                <div>
                                    <small className="text-muted">2 active DHT22 sensors (no issues found) </small>
                                </div>
                                <Button variant="success" size="sm" className="ml-auto" style={{borderRadius: '0'}}>Connect</Button>
                            </Card.Footer>
                        </div>
                    </Accordion.Collapse>
                    
                </Card>
            </Accordion>
        </div>
    )
}

export default IncomingDataPayload
