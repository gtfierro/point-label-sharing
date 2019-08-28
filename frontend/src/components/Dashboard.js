import React, { Component } from 'react';
import MiniDrawer from './MiniDrawer';
import { connect } from 'react-redux';
import * as actions from '../actions';
import Papa from 'papaparse';
import {
    convertCSVTo2DArray,
    importAll
} from '../helper';
const datasets = importAll(require.context('../datasets/davis'));

class Dashboard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            csvFilePath: datasets["ACAD.csv"]
        };
      
        this.importFile = this.importFile.bind(this);
    }

    componentDidMount() {
        if (!this.props.rules.rules || this.props.rules.rules.length === 0) {
            this.props.getAllRules();
        }

        this.getCSVData(datasets["ACAD.csv"], data => {
            this.setState({
              csvData: convertCSVTo2DArray(data)
            });
          });
      
        if (this.state.csvData && this.state.csvData.length > 0) {
    
        this.props.getAllFiles();
    
        }
      
        //this.uploadDatasetsToDB();

        console.log(this.props.rules);
    }

    render() {
        const { rules, files } = this.props;

        //this.props.files.fileIds.forEach(fileId => this.props.getFile({ fileId }))
        //console.log();

        if (!rules.rules || !this.state.csvData || this.state.csvData.length <= 0) {
            return <div>Loading...</div>;
        }

        console.log(rules.rules);

        return (
            <MiniDrawer csvData={this.state.csvData} csvName={this.state.csvFilePath.substring(this.state.csvFilePath.lastIndexOf("/") + 1)} importFile={this.importFile} appliedRules={rules.rules} />
        )
    }

    uploadDatasetsToDB() {
        Object.keys(datasets).forEach(dsName => {
    
          if (dsName) {
            this.getCSVData(dsName, (csvData) => {
              this.props.createFile({
                fileContents: {
                  name: datasets[dsName],
                  contents: convertCSVTo2DArray(csvData)
                }
              });
            });
          }
         
        });
    }
    
    getCSVData(filePath, callback) {
    
        console.log(filePath);

        Papa.parse(filePath, {
            download: true,
            header: true,
            complete: results => {
            if (results && results.data) {
                callback(results.data);
            }
            }
        });
    }    

    importFile(fileName) {
        console.log(fileName);
        this.getCSVData(datasets[fileName], data => {
          this.setState({
            csvFilePath: datasets[fileName],
            csvData: convertCSVTo2DArray(data)
          });
        });
      }

}

const mapStateToProps = ({ rules, files }) => {
    return { rules, files };
}

export default connect(mapStateToProps, actions)(Dashboard);