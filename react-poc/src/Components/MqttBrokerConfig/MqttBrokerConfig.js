import React from 'react'
import {Accordion, Button, Card, InputGroup, FormControl} from 'react-bootstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faServer } from "@fortawesome/free-solid-svg-icons";

const mqttBrokerConfigCard = {
    border: 'solid rgb(220,220,220)',
    borderRadius: '0',
    marginBottom: '10px',
    position: 'static',
}
const MqttBrokerConfig = () => {
    return (
        <div>
            <Accordion>
                <Card style={mqttBrokerConfigCard}>
                    <Accordion.Toggle as={Card.Header} eventKey="0">
                        <FontAwesomeIcon icon={faServer} style={{ color: 'red' }} className = "mr-2"/>
                        <span style={{fontSize:16}}>MQTT Server</span>
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey="0">
                        <div>
                            <Card.Body>
                                <InputGroup size="sm" className="mb-3">
                                    <InputGroup.Prepend>
                                    <InputGroup.Text id="inputGroup-sizing-sm">Hostname/IP</InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <FormControl className="text-muted" aria-label="Small" aria-describedby="inputGroup-sizing-sm" defaultValue="unm-mqtt-broker.duckdns.org" />
                                </InputGroup>

                                <InputGroup size="sm" className="mb-3">
                                    <InputGroup.Prepend>
                                        <InputGroup.Text id="inputGroup-sizing-sm">Port</InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <FormControl className="text-muted" aria-label="Small" aria-describedby="inputGroup-sizing-sm" defaultValue="8083"/>

                                    <InputGroup.Prepend className="ml-3">
                                        <InputGroup.Checkbox aria-label="Radio button for following text input" />
                                    </InputGroup.Prepend>
                                    <FormControl className="text-muted" defaultValue="SSL" readOnly/>
                                </InputGroup>
                            </Card.Body>
                            
                            <Card.Footer className='d-flex'>
                                <div>
                                    <small className="text-muted">Last Websocket connection 2 hours ago </small>
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

export default MqttBrokerConfig
