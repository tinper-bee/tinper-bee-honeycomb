import React,{Component} from 'react';
import {Row,Button,Icon,Upload} from 'tinper-bee';


const props = {
  name: 'file',
  action: '/upload.do',
  headers: {
    authorization: 'authorization-text',
  },
  onChange(info) {
    if (info.file.status !== 'uploading') {

    }
    if (info.file.status === 'done') {
      console.log(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === 'error') {
      console.log(`${info.file.name} file upload failed.`);
    }
  },
};
class UploadCloud extends Component {
	render(){
		return(
			<Upload {...props} className="app-upload" showUploadList={false}>
        <Button shape="border">
          <Icon type="uf-cloud-up" /> 应用上传
        </Button>
      </Upload>
		)
	}
}

export default UploadCloud;
