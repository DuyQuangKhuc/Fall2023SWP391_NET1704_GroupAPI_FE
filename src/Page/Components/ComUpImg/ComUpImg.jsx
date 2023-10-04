import React, { useState } from 'react';
import { UploadOutlined } from '@ant-design/icons';
import { Button, Upload ,message } from 'antd';

const ComUpImg = ({onChange}) => {
  const [fileList, setFileList] = useState([]);
  const maxImages = 5;
  const isImageFile = (file) => {
    const acceptedFormats = ['.jpg', '.jpeg', '.png', '.gif'];
    const fileExtension = file.name.toLowerCase().slice(-4); // Lấy phần mở rộng của tệp
    if (!acceptedFormats.includes(fileExtension)) {
        message.error('Chỉ cho phép chọn các tệp hình ảnh.');
        return false; // Ngăn tải lên nếu không phải là hình ảnh
      }
      return true;
  };

  const handleFileChange = ({ fileList }) => {
      if (fileList.length > maxImages) {
          message.error(`Chỉ được chọn tối đa ${maxImages} ảnh.`);
          setFileList(fileList.slice(0, maxImages)); // Giới hạn số lượng ảnh được chọn
          return;
        }
    const filteredFileList = fileList.filter((file) => isImageFile(file));
    setFileList(filteredFileList);
    onChange(filteredFileList)
  };

  return (
    <>
      <Upload
        fileList={fileList}
        onChange={handleFileChange}
        beforeUpload={() => false} // Để tránh tải lên tự động
        accept=".jpg,.jpeg,.png,.gif" // Chỉ cho phép chọn các tệp hình ảnh
        multiple={true} // Cho phép chọn nhiều tệp
      >
        <Button icon={<UploadOutlined />}>Tải hình ảnh</Button>
      </Upload>
    </>
  );
};

export default ComUpImg;
