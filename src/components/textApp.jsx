
export const textApp = {

    common: {
        button: {
            login: "Đăng nhập",
            reissue: "Reissue",
            createProduct: "Tạo sản phẩm"
        }
    },
    Login: {
        pageTitle: "Đăng nhập",
        label: {
            username: "Tài khoản",
            password: "Password"
        },
        placeholder: {
            username: "Please enter you Login ID",
            password: "Please enter you password"
        },
        message: {
            username: "Login ID is required item",
            password: "Password is required item",
            error: "Tài khoản hoặc mật khẩu sai",
            error1: "Đang có lỗi máy chủ vui lòng liên hệ quản lý.",
        }
    },
    Reissue: {
        pageTitle: "Tạo tài khoản",
        label: {
            username: "Tên đăng nhập",
            password: "Mật Khẩu",
            password2: "Xác nhận lại mật khẩu",
            phone: "Số điện thoại",
            email: "Email"
        },
        placeholder: {
            username: "Please enter you Login User",
            phone: "Please enter you phone",
            email: "Please enter you email",
            password: "Please enter you password",
            password2: "Please enter you password",
        },
        message: {
            username: "Login User is required item",
            usernameMIn: "Tài khoản phải lớn hơn 6 kí tự",
            phone: "Phone is required item",
            password: "Password is required item",
            password2: "Password is required item",
            passwordMIn: "Mật khẩu phải lớn hơn hoặc bằng 5 kí tự",
            email: "Email is required item",
            emailFormat: "Định dạng mail không hợp lệ.",
            passwordCheck: "Mật khẩu nhập lại không khớp.",
        }
    },
    CreateProduct: {
        pageTitle: "Tạo sản phẩm",
        label: {
            name: "Tên sản phẩm",
            price: "Giá tiền",
            reducedPrice: "Giá tiền giảm",
            size: "Kích cỡ",
            quantity: "Số lượng sản phẩm",
            detail: "detail",
            models: "models",
            material: "Chất liệu",
            durability: "Độ bền",
            sold: "sold",
            imagePath: 'Thêm ảnh',
            description: "Chi tiết sản phẩm",
        },
        placeholder: {
            name: "Nhập tên sản phẩm",
            price: "Nhập giá",
            quantity: "Nhập số lượng",
            size: "Vui lòng nhập kích cỡ sản phẩm",
            detail: "Please enter detail",
            models: "Please enter models",
            material: "Nhập chất liệu",
            durability: "Thêm độ bền",
            sold: "Please enter sold",
            imagePath: "Please enter Img",
            description: "Thêm mô tả",
        },
        message: {
            name: "Hãy nhập tên",
            price: "Hãy nhập giá",
            priceMin: "phải lớn hơn hoặc bằng 1",
            size: "Hãy thêm kích cỡ",
            priceDecimal: "Số tiền không được là số thập phân ",
            quantity: "Hãy nhập",
            quantityMin: "phải lớn hơn hoặc bằng 1",
            detail: "Hãy nhập",
            models: "Hãy nhập",
            durability: "Hãy thêm độ bền",
            material: "Hãy thêm nguyên liệu",
            accessory: "accessory is required item",
            sold: "sold is required item",
            imagePath: "image is required item",
            description: "Hãy thêm mô tả",
        },
        Notification: {
            m1: {
                message: "Lỗi",
                description: "Giá tiền phải là số nguyên!"
            },
            m2: {
                message: "Thành công",
                description: "Tạo sản phẩm thành công!"
            },
            m3: {
                message: "Lỗi",
                description: "Tạo sản phẩm không thành công!"
            },
            m4: {
                message: "Lỗi",
                description: "Vui lòng chọn Chất liệu sản phẩm!"
            },
            m5: {
                message: "Lỗi",
                description: "Vui lòng chọn ít nhất một ảnh cho sản phẩm!"
            },
            m6: {
                message: "Lỗi",
                description: "Giá tiền giảm phải nhỏ hơn giá tiền gốc !"
            },
            m7: {
                message: "Lỗi",
                description: "Giá tiền gốc phải hợp lý!"
            },
            m8: {
                message: "Lỗi",
                description: "Giá tiền giảm phải hợp lý!"
            }
        }
    },
    TableProduct: {
        title: {
            change: "Chỉnh sửa",
            delete: 'Xóa sản phẩm'
        },
        modal: {
            cancel: "Hủy",
            submitChange: "Thay đổi",
            submitDelete: "Xóa"
        },
        Notification: {
            delete: {
                message: "Thành công!",
                description: "Đã xóa sản phẩm!"
            },
            deleteError: {
                message: "Thất bại!",
                description: "Vui lòng kiểm tra lại hoặc báo cho kĩ thuật!"
            },
            change: {
                message: "Thành công!",
                description: "Vui lòng chọn Chất liệu sản phẩm!"
            }
        }
    },
    Product: {
        title: {

        },
        page: {
            quantity: "Số lượng",
            material: "Chất Liệu :",
            size: "Hình Dáng :"
        },
        message: {
            quantity: "Số lượng không đúng.",
            min: "Số lượng phải lớn hơn hoặc bằng 1.",

        }
    },
    Footer: {
        contact: {
            title: "Thông tin liên hệ",
            adress: "Địa chỉ: LôE2a Đường D1, Thành phố Thủ Đức",
            email: "Email: banlongchim@gmail.com",
            phone: "Số điện thoại: (0123) 456-7890",
        },

        aboutUs: {
            title: "Thông tin",
            infor: "Về chúng tôi",
            info1: "Sản phẩm",
            info2: "Chính sách bảo mật",
            info3: "Điều khoản sử dụng"
        },
        ship: {
            title: "Thông tin vận chuyển",
            freeShip: "Miễn phí vận chuyển cho đơn hàng trên 1.000.000 VND",
            time: "Thời gian vận chuyển: 3-5 ngày làm việc"
        },
        send: {
            field: "Nhập địa chỉ email",
            submit: "Gửi"
        }
    },
    HeaderAdmin: {
        product: "Sản phẩm",
    },
    Header: {
        search: "Tìm kiếm...",
    },
    Home: {
        getAll: "Xem thêm...",
        text: "Sản phẩm mới"
    },
    Payment: {
        title: "Thanh toán",
        message: "Vui lòng kiểm tra thông tin Khách hàng, thông tin Giỏ hàng trước khi Đặt hàng.",
        information: {
            title: "Thông tin khách hàng",
            label: {
                name: "Họ và tên",
                address: "Địa chỉ",
                phone: "Số điện thoại",
                email: "Email",
                promotion: "Mã khuyễn mãi",
                description: "Thông tin bổ sung"
            },
            placeholder: {
                name: "Vui lòng nhập họ và tên",
                address: "Vui lòng nhập địa chỉ",
                phone: "Vui lòng số điện thoại",
                email: "Vui lòng Email",
                promotion: "Mã khuyễn mãi",
                description: "Vui lòng thông tin bổ sung"

            },
            message: {
                name: "Trường này là bắt buộc",
                address: "Trường này là bắt buộc",
                phone: "Trường này là bắt buộc",
                email: "Trường này là bắt buộc",
                emailError: "Mail không hợp lệ",
            },
        },
        text: "Sản phẩm mới"
    },
    ShoppingCart: {
        tile: "Giỏ hàng",
        checkbox: "Chọn tất cả"
    },

}