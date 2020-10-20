import React from 'react';
import {Nav, Navbar, NavDropdown} from 'react-bootstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCodeBranch, faInfoCircle } from "@fortawesome/free-solid-svg-icons";

const NavigationBar = () => {

  return (
    <div>
      <Navbar fixed='top' bg="dark" variant="dark" expand="md" style = {{marginBottom:15}}>

        {/* NavBar Brand */}
        <Navbar.Brand href="#home">
          <img
            alt=""
            src="/brand_alt_light_nb.svg"
            width="60"
            height="60"
            className="d-inline-block align-top"
          />{' '}
            {/*<b>BIM4Temp</b>
            <sup className="text-muted"> MES</sup>*/}
        </Navbar.Brand>

        {/* Collapsible part of Nav*/}
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">

          {/* Search bar 
          <Form inline>
              <FormControl type="text" placeholder="Search for Configurations" className="mr-sm-2" />
          </Form>

          {/* Right nav-link items */}
          <Nav className="ml-auto">

        {/* <Nav.Link href="#features">Home</Nav.Link>
            <Nav.Link href="#pricing">Dashboard</Nav.Link>
            <Nav.Link eventKey={2} href="#memes">
              ShareBIM
            </Nav.Link>
        */}
            
            {/* Drop-down nav item */}
            <NavDropdown alignRight title="Prototype" id="collasible-nav-dropdown">
              <NavDropdown.Item href="https://github.com/teenkevo/UNM-MES.git">
                <FontAwesomeIcon icon={faCodeBranch} style={{ color: 'red' }} className = "mr-2" fixedWidth/>
                Github
              </NavDropdown.Item>
              
              <NavDropdown.Item href="#action/3.3">
                <FontAwesomeIcon icon={faInfoCircle} style={{ color: 'red' }} className = "mr-2" fixedWidth/>
                Support
              </NavDropdown.Item>
              
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">Documentation</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
        
      </Navbar>
    </div>
  );
}

export default NavigationBar