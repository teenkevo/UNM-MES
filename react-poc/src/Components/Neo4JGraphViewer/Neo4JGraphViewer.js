/*
 * Copyright (c) 2002-2018 "Neo4j, Inc"
 * Network Engine for Objects in Lund AB [http://neotechnology.com]
 *
 * This file is part of Neo4j.
 *
 * Neo4j is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import React from 'react'
import ReactDOM from 'react-dom'
import { ExplorerComponent } from '../D3Visualization/components/Explorer'
import * as grassActions from '../D3Visualization/grass/grassDuck'
import { deepEquals } from '../D3Visualization/services/utils'

import Node from '../D3Visualization/lib/visualization/components/node'
import Relationship from '../D3Visualization/lib/visualization/components/relationship'

import ServiceManager from 'SvcManager'
import bolt from '../D3Visualization/services/bolt/bolt'
import { StyledVisContainer } from '../D3Visualization/VisualizationView.styled'
import { Provider } from 'react-redux'

import config from'c0nfig'

class Neo4jGraphViewer extends React.Component {

  state = {
    nodes: [],
    relationships: []
  }

  constructor () {

    super()

}

  componentDidMount () {

    this.graphSvc = ServiceManager.getService('GraphSvc')

    if (this.props.query)
    {
      
      
      //This is a quick fix so the Neo4j driver can use the bolt protocol directly from the browser.
      //In production, we would find a solution to avoid exposing our DB credentials.
      bolt.openConnection({username:'neo4j',password:'neo4j',host:'neo4jhost:port'}).then((res) =>
      {
        this.runCypherQuery(this.props.query)
        //bolt.directTransaction(this.props.query, undefined).then( r => {
        //  const rec = r
        //}).catch(e =>{
        //  reject(new Error())
        //});
      });
      
      this.runCypherQuery(this.props.query)
    }

  }


  runCypherQuery(query){

    bolt.directTransaction(query, undefined)
    .then(r =>  
      {
        console.log("n response")
        this.populateDataToStateFromProps(r.records) 

     })
    .catch(e =>{
      console.log(e)
    })
  }

  shouldComponentUpdate (props, state) {
    return (
      this.props.updated !== props.updated ||
      !deepEquals(props.graphStyleData, this.props.graphStyleData) ||
      this.state.updated !== state.updated ||
      this.props.frameHeight !== props.frameHeight ||
      this.props.autoComplete !== props.autoComplete
    )
  }

  componentWillReceiveProps (props) {
    if (
      this.props.updated !== props.updated ||
      this.props.autoComplete !== props.autoComplete
    ) {
      this.populateDataToStateFromProps(props)
    }
  }

  populateDataToStateFromProps (results) {
    const {
      nodes,
      relationships
    } = bolt.extractNodesAndRelationshipsFromRecordsForOldVis(results)
    this.setState({
      nodes,
      relationships,
      updated: new Date().getTime()
    }, () => {this.forceUpdate()})

    
  }
  

  autoCompleteRelationships (existingNodes, newNodes) {
    if (this.props.autoComplete) {
      const existingNodeIds = existingNodes.map(node => parseInt(node.id))
      const newNodeIds = newNodes.map(node => parseInt(node.id))

      this.getInternalRelationships(existingNodeIds, newNodeIds)
        .then(graph => {
          this.autoCompleteCallback &&
            this.autoCompleteCallback(graph.relationships)
        })
        .catch(e => {})
    } else {
      this.autoCompleteCallback && this.autoCompleteCallback([])
    }
  }

  getNeighbours (id, currentNeighbourIds = []) {
    const query = `MATCH path = (a)--(o)
                   WHERE id(a) = ${id}
                   AND NOT (id(o) IN[${currentNeighbourIds.join(',')}])
                   RETURN path, size((a)--()) as c
                   ORDER BY id(o)
                   LIMIT ${this.props.maxNeighbours -
                     currentNeighbourIds.length}`
    return new Promise((resolve, reject) => {
      bolt.directTransaction(query, undefined).then( r => {
            let count =
              r.records.length > 0
                ? parseInt(r.records[0].get('c').toString())
                : 0
            const resultGraph = bolt.extractNodesAndRelationshipsFromRecordsForOldVis(
              r.records,
              false
            )
            this.autoCompleteRelationships(this.graph._nodes, resultGraph.nodes)
            resolve({ ...resultGraph, count: count })
          }).catch(e =>{
            reject(new Error())
          });
        });
  }

  getInternalRelationships (existingNodeIds, newNodeIds) {
    newNodeIds = newNodeIds.map(bolt.neo4j.int)
    existingNodeIds = existingNodeIds.map(bolt.neo4j.int)
    existingNodeIds = existingNodeIds.concat(newNodeIds)
    const query =
      'MATCH (a)-[r]->(b) WHERE id(a) IN $existingNodeIds AND id(b) IN $newNodeIds RETURN r;'
    return new Promise((resolve, reject) => {
      bolt.directTransaction(query, { existingNodeIds, newNodeIds }).then(r =>{
              resolve({
                ...bolt.extractNodesAndRelationshipsFromRecordsForOldVis(r.records,false)
              })
          }).catch(e =>{
            reject(new Error())
          });
    })
  }

  setGraph (graph) {
    this.graph = graph
    this.autoCompleteRelationships([], this.graph._nodes)
  }
  
setViewFromQuery(query){  
  bolt.directTransaction(query, undefined, {
    useCypherThread: false
  })
  .then(r => 
    {
      console.log(r)

     this.props.viewer.model.getExternalIdMapping((m) => 
     {
        console.log("got id mapping")
        this.IdMapping = m
        var exids = []
        var exids = r.records.map((n) => this.IdMapping[n._fields[0]]).filter(n => n !== undefined) //0 index is assumed to always be the UniqueId
        if (exids.length > 0) this.props.viewer.isolate(exids)

    });

   })
  .catch(e =>{

    console.log(e)
  })
}

setSelectionFromQuery(query){  
  bolt.directTransaction(query, undefined, {
    useCypherThread: false
  })
  .then(r => 
    {
      console.log(r)

     this.props.viewer.model.getExternalIdMapping((m) => 
     {
        console.log("got id mapping")
        this.IdMapping = m
        var exids = []

        var exids = r.records.map((n) => this.IdMapping[n._fields[0]]).filter(n => n !== undefined) //0 index is assumed to always be the UniqueId

      this.props.viewer.select(exids[0])

    });

   })
  .catch(e =>{

    console.log(e)
  })

}

showNodesInView(){

  this.props.viewer.model.getExternalIdMapping((m) => 
  {
     console.log("got id mapping")
     this.IdMapping = m
     var exids = []

     let nids = this.state.nodes.map(n => {return parseInt(n.id)})
     nids = nids.map(bolt.neo4j.int)
     let query = `MATCH (e)-[:REALIZED_BY]->(re) WHERE id(e) IN $ids RETURN re.UniqueId`

    
      bolt.directTransaction(query, {ids:nids}, {
        useCypherThread: false
      })
      .then(r => 
        {
          console.log(r)
          var exids = r.records.map((n) => this.IdMapping[n._fields[0]]).filter(n => n !== undefined) //0 index is assumed to always be the UniqueId
          if (exids.length > 0) this.props.viewer.isolate(exids)
       })
      .catch(e =>{
        console.log(e)
      })
 });

}


setSelectionInView(item){
    console.log(item)
    if (item && item.type == 'node'){
      let nid = item.item.id
      let labels = item.item.labels
      let shwq = ''
      if (labels.includes("Space") ){
        let shwq = `MATCH (s:Space)<-[:IS_IN_SPACE]-(e) WHERE id(s)=${nid} MATCH (e)-[:REALIZED_BY]->(re) RETURN re.UniqueId`
        let nmprops = {}
        item.item.properties.map((nm) => nmprops[nm.key] = nm.value)
        let snumber = nmprops["Number"]
        this.props.viewerView.findSpacesGeo(snumber)
        console.log(snumber)
        this.setViewFromQuery(shwq)
      }

      if (labels.includes("System") ){
        let shwq = `MATCH (s:System)<-[:ABSTRACTED_BY]-(e) WHERE id(s)=${nid} MATCH (e)-[:REALIZED_BY]->(re) RETURN re.UniqueId`
        this.setViewFromQuery(shwq)
      }

      if (labels.includes("Section") ){
        let shwq = `MATCH (s:Section)-[:IS_ON]->(e) WHERE id(s)=${nid} MATCH (e)-[:REALIZED_BY]->(re) RETURN re.UniqueId`
        this.setViewFromQuery(shwq)
      }

      if (labels.includes("Level") ){
        let shwq = `MATCH (s:Level)<-[:IS_ON]-(e) WHERE id(s)=${nid} MATCH (e)-[:REALIZED_BY]->(re) RETURN re.UniqueId`
        this.setViewFromQuery(shwq)
      }

      if (labels.includes("ModelElement") ){
        let shwq = `MATCH (re:ModelElement) WHERE id(re)=${nid} RETURN re.UniqueId`
        this.setViewFromQuery(shwq)
      }

      if (labels.includes("RevitModel") ){
        let shwq = `MATCH (s:RevitModel)<-[:IS_IN]-(re) WHERE id(s)=${nid} RETURN re.UniqueId`
        this.setViewFromQuery(shwq)
      }

      if (labels.includes("Circuit") ){
        let shwq = `MATCH (s:Circuit)-[:ELECTRICAL_FLOW_TO]-(e) WHERE id(s)=${nid} MATCH (e)-[:REALIZED_BY]->(re) RETURN re.UniqueId`
        this.setViewFromQuery(shwq)
      }

      if (labels.includes("ElectricalLoad") ){
        let shwq = `MATCH (s:ElectricalLoad)<-[:ELECTRICAL_FLOW_TO*]-(e) WHERE id(s)=${nid} MATCH (e)-[:REALIZED_BY]->(re) RETURN re.UniqueId`
        this.setViewFromQuery(shwq)
      }

      if (labels.includes("ElementType") ){
        let shwq = `MATCH (s:ElementType)<-[:IS_OF]-(e) WHERE id(s)=${nid} MATCH (e)-[:REALIZED_BY]->(re) RETURN re.UniqueId`
        this.setViewFromQuery(shwq)
      }

      if (labels.includes("ModelElement") ){
        let selq = `MATCH (s:${labels[0]}) WHERE id(s)=${nid} RETURN s.UniqueId`
        this.setSelectionFromQuery(selq)
      } else{
       let selq = `MATCH (s:${labels[0]})-[:REALIZED_BY]->(re) WHERE id(s)=${nid} RETURN re.UniqueId`
       this.setSelectionFromQuery(selq)
      }
    }

    if (item && item.type == 'relationship'){
      this.showNodesInView()
    }
}



  render () {

    this.viewer = this.props.viewer
    if (!this.state.nodes.length) return null

    return (
   
        <ExplorerComponent
          ref="expref"
          maxNeighbours={1000}
          initialNodeDisplay={1000}
          updateStyle={(graphStyleData) => {grassActions.updateGraphStyleData(graphStyleData)}}
          getNeighbours={this.getNeighbours.bind(this)}
          nodes={this.state.nodes}
          relationships={this.state.relationships}
          fullscreen={true}
          frameHeight={1000}
          cypherRunner={this.runCypherQuery.bind(this)}
          getAutoCompleteCallback={callback => {
            this.autoCompleteCallback = callback
          }}
          setGraph={this.setGraph.bind(this)}
          setSelectionInView={this.setSelectionInView.bind(this)}
        />
 
    )
  }
}



export default Neo4jGraphViewer;