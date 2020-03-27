import React from 'react'
import { hot } from 'react-hot-loader/root'
// import DraggableTest from 'Components/DraggableTest'
import data from '../../data.json'
import './App.scss'


const CURRENT_FOLDER = '/Volumes/WDrive/lech/Asian_Uncen/JapanHDV SiteRip 21.01.2016 - 30.04.2016/Screens'
const resetTop = () => window.scrollTo(0, 0)
class App extends React.Component {
  state = {
    currentFolder: CURRENT_FOLDER,
    currentIndex: 0,
    folderData: data.folderData,
  }

  componentDidMount() {
    console.log('Mounted')
  }

  setCurrentIndex = (idx) => {
    this.setState({
      currentIndex: +idx,
    })
  }

  incrementIndex = () => {
    this.setState((state) => ({
      currentIndex: state.currentIndex + 1,
    }))
  }

  render() {
    const { currentIndex, currentFolder, folderData } = this.state
    return (
      <div className="app" style={{ height: '100vh', width: '100vw' }}>
        <nav id="main-nav">
          <h2>Screenshots</h2>
          <div className="folder-widget">
            <div className="displayer">
              <span className="folder-info">
                Current folder:
                {' '}
                <span className="folder-name">{currentFolder}</span>
              </span>
            </div>
            {/* <div className="folder-form"></div> */}
          </div>
        </nav>
        <main>
          { currentIndex === null ? (
            <div className="file-list">
              <h4>Files</h4>
              <ul>
                {folderData.map((item) => <li>{item}</li>)}
              </ul>
            </div>
          ) : (
            <div className="image-content">
              <h4>
                Filename:
                {folderData[currentIndex]}
                <span className="count-info">
                  {currentIndex + 1}
                  /
                  {folderData.length}
                </span>
              </h4>
              <div className="image-container">
                <img
                  onLoad={resetTop}
                  onClick={this.incrementIndex}
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
