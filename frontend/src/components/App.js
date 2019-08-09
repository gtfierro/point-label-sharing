import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import './css/App.css';
import Button from '@material-ui/core/Button';
import Papa from 'papaparse';
import { Series, DataFrame } from 'pandas-js';
import csvFilePath from '../datasets/davis/ACAD.csv';
import EnhancedTable from './EnhancedTable';
import MiniDrawer from './MiniDrawer';
import { connect } from 'react-redux';
import * as actions from '../actions';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      csvData: []
    };
  }

  componentDidMount() {

    if (this.state.csvData.length > 0) {
    
      this.props.getAllFiles();
      
    }

  }

  componentWillMount() {
    this.getCSVData();
  }

  async getCSVData() {

    Papa.parse(csvFilePath, {
      download: true,
      header: true,
      complete: results => {
          if (results && results.data) {
            this.setState({csvData: results.data});
            console.log(results.data);
            const csvFileName = csvFilePath.substring(csvFilePath.lastIndexOf("/") + 1);

            // this.props.createFile({
            //   fileContents: {
            //     name: csvFileName,
            //     contents: this.convertCSVTo2DArray(this.state.csvData)
            //   }
            // });
          }
      }
    });
  }

  render() {
    if (!this.state.csvData || this.state.csvData.length <= 0 || !this.props.files) {
       return (<BrowserRouter>
          <div className="App">
            <div>Loading...</div>;
          </div>
        </BrowserRouter>)
    }

    //this.props.files.fileIds.forEach(fileId => this.props.getFile({ fileId }))
    //console.log();

    const content = (
      <EnhancedTable csvData={this.state.csvData} csvName={csvFilePath.substring(csvFilePath.lastIndexOf("/") + 1)} />
    )

    return (
      <BrowserRouter>
        <div className="App">
          <Route exact path="/" component={() => <MiniDrawer content={content} csvData={this.state.csvData}/>} />
        </div>
      </BrowserRouter>
    );
  }

  convertCSVTo2DArray(csv) {
    let data = []

    data[0] = Object.keys(csv[0]);

    console.log(data[0]);

    csv.forEach((row, i) => {
      let j = 0;
      data[0].forEach(key => {
        console.log(key);
        if (i !== 0) {
          data[i] = [];
          data[i][j] = row[key];
          j++;
        }
      });
    });

    return data;
  }

}

const mapStateToProps = ({ files }) => {
  return { files };
}

export default connect(mapStateToProps, actions)(App);
