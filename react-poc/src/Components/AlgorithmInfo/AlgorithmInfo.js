import React from 'react'
import {Button, Card, Accordion} from 'react-bootstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMicrochip } from "@fortawesome/free-solid-svg-icons";

const algorithmInfoCard = {
    border: 'solid rgb(220,220,220)',
    borderRadius: '0',
    marginBottom: '10px',
    position: 'static'
    //boxShadow: '3px 4px 8px -4px rgba(0, 0, 0, 0.4)'
}

const AlgorithmInfo = () => {
    return (
        <div >
            <Accordion>
                <Card style={algorithmInfoCard}>
                    <Accordion.Toggle as={Card.Header} eventKey="0">
                        <FontAwesomeIcon icon={faMicrochip} style={{ color: 'red' }} className = "mr-2"/>
                        <span style={{fontSize:16}}>Control Algorithm Configuration</span>
                    </Accordion.Toggle>

                    <Accordion.Collapse eventKey="0">
                        <div>
                            <Card.Body>
                                <Card.Text>
                                    <small>
                                        Dueling Deep Q-Network<br/> 
                                        Version: 1.5.2 <br/>
                                        Added: May 18, 2020, 5:16 p.m<br/>
                                        Owner: Kevin
                                    </small>
                                </Card.Text>
                            </Card.Body>
                            <Card.Footer className='d-flex'>
                                <div>
                                    <small className="text-muted">Added 28th Mar 2020 </small>
                                </div>
                                <Button variant="primary" size="sm" className="ml-auto" style={{borderRadius: '0'}}>Configure</Button>
                            </Card.Footer>
                        </div>   
                    </Accordion.Collapse>   
                </Card>
            </Accordion>
        </div>
    )
}

export default AlgorithmInfo
