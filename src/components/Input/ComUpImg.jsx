import React, { useEffect, useState } from 'react';
import { UploadOutlined } from '@ant-design/icons';
import { Button, Upload, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Modal } from 'antd';
const getBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
const ComUpImg = ({value, onChange}) => {
    const [previewOpen, setPreviewOpen] = useState(false);
    const [fileList, setFileList] = useState([]);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');

    const maxImages = 1;
    const isImageFile = (file) => {
        const acceptedFormats = ['.jpg', '.jpeg', '.png', '.gif'];
        const fileExtension = file.name.toLowerCase().slice(-4); // Lấy phần mở rộng của tệp
        if (!acceptedFormats.includes(fileExtension)) {
            message.error('Chỉ cho phép chọn các tệp hình ảnh.');
            return false; // Ngăn tải lên nếu không phải là hình ảnh
        }
        return true;
    };
    useEffect(() => {
        if (value) {
            const fileList = [{
                url: value // assuming "value" is the URL of the image from the API
            }];
            setFileList(fileList);
        }
    }, [value]);
   
    const handleCancel = () => setPreviewOpen(false);


    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
        setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
    };

    const handleChange = ({ fileList }) => {
        if (fileList.length > maxImages) {
            message.error(`Chỉ được chọn tối đa ${maxImages} ảnh.`);
            setFileList(fileList.slice(0, maxImages)); // Giới hạn số lượng ảnh được chọn
            return;
        }
        const filteredFileList = fileList.filter((file) => isImageFile(file));
        if (filteredFileList.length > 0) {
            const reader = new FileReader();
            reader.onload = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(filteredFileList[0].originFileObj);
        } else {
            setPreviewImage(null);
        }

        setFileList(filteredFileList);
        onChange(filteredFileList)
    };
    const uploadButton = (
        <div>
            <PlusOutlined />
            <div
                style={{
                    marginTop: 8,
                }}
            >
                Upload
            </div>
        </div>
    );
    return (
        <>
            <Upload
                action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                listType="picture-card"
                fileList={fileList}
                onPreview={handlePreview}
                onChange={handleChange}
            >
                {fileList.length >= 8 ? null : uploadButton}
            </Upload>
            <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
                <img
                    alt="example"
                    style={{
                        width: '100%',
                    }}
                    src={previewImage}
                />
            </Modal>
        </>
    );
};
export default ComUpImg;