import React from 'react'
import { hot } from 'react-hot-loader/root'
import axios from 'axios'
import cn from 'classnames'
// import DraggableTest from 'Components/DraggableTest'
// import data from '../../data.json'
import { InputGroup, Button, Tree } from '@blueprintjs/core'
import Select from 'Components/Select'
import { GoGear, GoBroadcast } from 'react-icons/go';
// import 'normalize'
import '@blueprintjs/icons/lib/css/blueprint-icons.css'
import '@blueprintjs/core/lib/css/blueprint.css'
import './App.scss'

// const data = require('./data.json')
import data from 'Scripts/data'

/* eslint-disable no-param-reassign */

const seenFoldersString = localStorage.getItem('seenFolders')
const seenFolders = seenFoldersString ? JSON.parse(seenFoldersString) : []

function updateDataWithSeenState(node) {
  if (seenFolders.includes(node.filepath)) {
    node.seen = true
    node.className = 'seen-folder'
  } else {
    node.className = 'unseen-folder'
  }
  if (node.childNodes.length) {
    node.childNodes.forEach((item) => {
      updateDataWithSeenState(item)
    })
  }
  return node
}

updateDataWithSeenState(data)


// const CURRENT_FOLDER = '/Volumes/GDrive/ech/Gravure/zPics/Nana_Asakawa'
const resetTop = () => window.scrollTo(0, 100)
const folderFilterer = (item) => item
  && !/(\.mp4)|(\.wmv)|(\.m4v)|(\.rar)/g.test(item)

function prepareFolderMap(folder) {
  let folders = []
  if (folder.ownPicCount > 0) {
    folders.push(folder)
  }
  if (folder.childNodes.length) {
    folder.childNodes.forEach((item) => {
      folders = folders.concat(prepareFolderMap(item))
    })
  }
  return folders
}
class App extends React.Component {
  state = {
    currentFolder: null,
    currentIndex: 0,
    configMode: false,
    fullImageMode: true,
    parentFolderData: [],
    folderData: [],
    nodes: [data],
  }

  selectedNode = null

  count = 0

  total = 0

  inputRef = React.createRef()

  componentDidMount() {
    document.addEventListener('keydown', (event) => {
      if (event.keyCode === 39) {
        this.incrementIndex()
      } else if (event.keyCode === 37) {
        this.decrementIndex()
      }
    })
  }

  get configMode() {
    const { currentFolder, currentIndex, configMode } = this.state
    if (configMode) {
      return true
    }
    return !currentFolder || currentIndex === null
  }

  updateFolderSeenState = () => {
    const seenFolders = prepareFolderMap(this.selectedNode)
    const folderFilepathArray = seenFolders.map((item) => item.filepath)
    localStorage.setItem('seenFolders', JSON.stringify(folderFilepathArray))
  }

  folderChangeHandler = (folder) => {
    if (folder.name === 'Choose One') return
    this.setState({ currentFolder: folder.name })
    // console.log('folder-path', `${CURRENT_FOLDER}/${value}`)
    axios.post('/folder-info', { folderPath: folder.filepath })
    .then(({ data: { folderData } }) => {
      const fd = folderData.filter(folderFilterer)
      this.total = fd.length
      this.setState({ folderData: fd, currentIndex: 0, configMode: false }, () => {
        this.forceUpdate()
      })
    })
  }

  jumpChangeHandler = () => {
    const { current: { value } } = this.inputRef
    const idx = parseInt(value, 10) - 1
    this.setState({
      currentIndex: idx,
    })
  }

  setCurrentIndex = (idx) => {
    this.setState({
      currentIndex: +idx,
    })
  }

  toggleFullScreenMode = () => {
    this.setState((state) => ({ fullImageMode: !state.fullImageMode }))
  }

  incrementIndex = () => {
    this.setState((state) => ({
        currentIndex: (state.currentIndex + 1) % this.total,
      }))
  }

  decrementIndex = () => {
    this.setState((state) => ({
      currentIndex: Math.max(0, (state.currentIndex - 1)) % this.total,
    }))
  }

  handleNodeClick = (nodeData) => {
    if (this.selectedNode) {
      if (this.selectedNode !== nodeData) {
        this.selectedNode.isSelected = false
      }
      this.selectedNode = null
    }
    const originalSelected = nodeData.isSelected
    nodeData.isSelected = originalSelected === null ? true : !originalSelected
    if (nodeData.isSelected) {
      this.selectedNode = nodeData
    }
    this.setState(this.state)
  }

  handleNodeExpand = (nodeData) => {
    nodeData.isExpanded = true
    // this.setState(this.state)
    this.forceUpdate()
  }

  handleNodeCollapse = (nodeData) => {
    nodeData.isExpanded = false
    this.forceUpdate()
  }

  prepareSelection = () => {
    if (this.selectedNode !== null) {
      const folders = prepareFolderMap(this.selectedNode)
      // const seenFoldersString = localStorage.getItem('seenFolders')
      // if (seenFoldersString) {
      //   const seenFolders = JSON.parse(seenFoldersString)
      //   folders = folders.map((item) => {
      //     item.seen = seenFolders.includes(item.filepath)
      //     return item
      //   })
      // }
      this.setState({
        parentFolderData: folders,
      })
    }
  }

  toggleConfigMode = () => {
    this.setState((state) => ({ configMode: !state.configMode }))
  }

  updateFolder = () => {
    axios.post('/update-folder', { folderPath: 'nonce' })
  }

  render() {
    const {
      currentIndex, currentFolder, folderData, parentFolderData, fullImageMode,
    } = this.state
    return (
      <div className="app">
        <nav id="main-nav">
          <h2>
            Screenshots Viewer
            {' '}
            <span className="config" onClick={this.toggleConfigMode}><GoGear /></span>
            <span className="folder-update" onClick={this.updateFolder}><GoBroadcast /></span>
          </h2>
          <div className="folder-widget">
            <div className="displayer">
              {parentFolderData.length > 0 && (
                <Select
                  onChange={this.folderChangeHandler}
                  className="folder-chooser"
                  options={parentFolderData}
                />
              )}
              <span className="folder-info">
                Current folder:
                {' '}
                <span className="folder-name">{currentFolder || 'No folder selected'}</span>
              </span>
            </div>
            {/* <div className="folder-form"></div> */}
          </div>
        </nav>
        <main className={cn({ 'full-mode': fullImageMode })}>
          { this.configMode ? (
            <div className="file-list">
              <h4>Files</h4>
              {/* <ul>
                {parentFolderData.map((item) => <li key={makeId()}>{item.name}</li>)}
              </ul> */}
              <Tree
                contents={this.state.nodes}
                onNodeClick={this.handleNodeClick}
                onNodeExpand={this.handleNodeExpand}
                onNodeCollapse={this.handleNodeCollapse}
              />
              <Button text="Mark as seen" onClick={this.updateFolderSeenState} />
              <Button text="Prepare selection" onClick={this.prepareSelection} />
            </div>
          ) : (
            <div className="image-content">
              <h4>
                Filename:
                {folderData[currentIndex]}
                <div className="rest-info">
                  <span className="count-info">
                    {currentIndex + 1}
                    /
                    {folderData.length}
                  </span>
                  <InputGroup className="jump-page" inputRef={this.inputRef} />
                  <Button text="Go" onClick={this.jumpChangeHandler} />
                </div>
              </h4>
              <div className="image-container">
                <img
                  onLoad={resetTop}
                  onClick={this.toggleFullScreenMode}
                  src={`/image/${folderData[currentIndex]}`}
                  alt="ik"
                />
              </div>
            </div>
          )}
        </main>
      </div>
    )
  }
}

export default hot(App)
