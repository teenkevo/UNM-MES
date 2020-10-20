import React, { Component } from "react";
import PropTypes from "prop-types";
import NeoVis from 'neovis.js/dist/neovis.js';

class NeoGraph extends Component {
  constructor(props) {
    super(props);
    this.visRef = React.createRef();
  }

  componentDidMount() {
    const { neo4jUri, neo4jUser, neo4jPassword } = this.props;
    const config = {
      container_id: this.visRef.current.id,
      server_url: neo4jUri,
      server_user: neo4jUser,
      server_password: neo4jPassword,
      labels: {
        "Terminal": {
          "caption": "System_Name"
        },
        "Space": {
          "caption": "Name"
        }
      },
      relationships: {
        "FLOWS_TO_SPACE": {
          "thickness": "weight",
          "caption": false
        }
      },
      initial_cypher:
        "MATCH p=()-[r:FLOWS_TO_SPACE]->() RETURN p LIMIT 25"
    };
    /*
      Since there is no neovis package on NPM at the moment, we have to use a "trick":
      we bind Neovis to the window object in public/index.html.js
    */
    this.vis = new NeoVis(config);
    this.vis.render();
  }

  render() {
    const { width, height, containerId, backgroundColor } = this.props;
    return (
      <div
        id={containerId}
        ref={this.visRef}
        style={{
          width: `${width}px`,
          height: `${height}px`,
          backgroundColor: `${backgroundColor}`
        }}
      />
    );
  }
}

NeoGraph.defaultProps = {
  width: 600,
  height: 600,
  backgroundColor: "#d3d3d3"
};

NeoGraph.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  containerId: PropTypes.string.isRequired,
  neo4jUri: PropTypes.string.isRequired,
  neo4jUser: PropTypes.string.isRequired,
  neo4jPassword: PropTypes.string.isRequired,
  backgroundColor: PropTypes.string
};


export { NeoGraph};
