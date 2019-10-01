import React, { Component } from 'react';
import MiniDrawer from './MiniDrawer';
import { connect } from 'react-redux';
import * as actions from '../actions';
import Papa from 'papaparse';
import {
    convertCSVTo2DArray
} from '../helper';
//const datasets = importAll(require.context('../datasets/davis'));

class Dashboard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            fileId: "",
            appliedRules: null
        };
      
        this.importFileFromDB = this.importFileFromDB.bind(this);
    }

    render() {
        const { files } = this.props;

        const csvData = files.file ? files.file.contents : [];
        const csvName = files.file ? files.file.name : [];

        return <MiniDrawer fileId={this.state.fileId} csvData={csvData} csvName={csvName} uploadFile={(file) => this.uploadFile(file)} importFileFromDB={this.importFileFromDB} appliedRules={this.state.appliedRules || []} />;
    }

    uploadFile(file) {
        
        this.getCSVData(file, (csvData) => {
            this.props.createFile({
                fileContents: {
                    name: file.name,
                    contents: convertCSVTo2DArray(csvData)
                }
            }).then(res => {
                this.importFileFromDB(res.files.response.fileid)
            });
        });
        // for(const dsName of Object.keys(datasets).slice(1, 6)) {
        //     if (dsName) {
        //         this.getCSVData(datasets[dsName], (csvData) => {
        //             this.props.createFile({
        //                 fileContents: {
        //                     name: dsName,
        //                     contents: convertCSVTo2DArray(csvData)
        //                 }
        //             });
        //         });
        //     }
        // }
    }
    
    getCSVData(file, callback) {
    
        Papa.parse(file, {
            download: true,
            complete: results => {
                if (results && results.data) {
                    callback(results.data);
                }
            }
        });
    }    

    importFileFromDB(fileId) {
        this.props.getRulesByFile({ fileId }).then(res => {
            this.props.getFile({ fileId }).then(fileRes => {
                this.props.getAllFiles({ appliedRules: true }).then(res2 => {
                    this.setState({ fileId, appliedRules: res.rules.rules });
                });
            });
        });
    }

}

const mapStateToProps = ({ rules, files }) => {
    return { rules, files };
}

export default connect(mapStateToProps, actions)(Dashboard);