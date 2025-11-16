export const USERS_MESSAGES = {
  VALIDATION_ERROR: 'Lỗi xác thực dữ liệu',

  // ===== AUTH =====
  EMAIL_ALREADY_EXISTS: 'Email đã được sử dụng',
  EMAIL_IS_REQUIRED: 'Email là bắt buộc',
  EMAIL_IS_INVALID: 'Email không hợp lệ',
  EMAIL_OR_PASSWORD_INCORRECT: 'Email hoặc mật khẩu không chính xác',
  EMAIL_NOT_VERIFIED: 'Email chưa được xác thực',
  PASSWORD_IS_REQUIRED: 'Mật khẩu là bắt buộc',
  PASSWORD_MUST_BE_STRING: 'Mật khẩu phải là chuỗi ký tự',
  PASSWORD_LENGTH: 'Độ dài mật khẩu phải từ 6 đến 50 ký tự',
  USED_REFRESH_TOKEN_OR_NOT_EXIST: "Refresh token hết hạn hoặc không tồn tại",
  LOGIN_SUCCESS: 'Đăng nhập thành công',
  REGISTER_SUCCESS: 'Đăng ký tài khoản thành công',
  LOGOUT_SUCCESS: 'Đăng xuất thành công',

  // ===== TOKEN =====
  ACCESS_TOKEN_REQUIRED: 'Access token là bắt buộc',
  REFRESH_TOKEN_REQUIRED: 'Refresh token là bắt buộc',
  REFRESH_TOKEN_INVALID: 'Refresh token không hợp lệ hoặc đã hết hạn',
  REFRESH_TOKEN_SUCCESS: 'Làm mới token thành công',

  // ===== USER =====
  USER_NOT_FOUND: 'Không tìm thấy người dùng',
  USER_NOT_VERIFIED: 'Email người dùng chưa được xác thực',
  GET_PROFILE_SUCCESS: 'Lấy thông tin hồ sơ thành công',
  UPDATE_PROFILE_SUCCESS: 'Cập nhật hồ sơ thành công',

  // ===== GENERAL =====
  INVALID_USER_ID: 'User ID không hợp lệ',
  PERMISSION_DENIED: 'Bạn không có quyền thực hiện hành động này'
} as const;

// =======================
//   WALLET SYSTEM
// =======================
export const WALLET_MESSAGES = {
  CREATE_SUCCESS: 'Tạo ví thành công',
  UPDATE_SUCCESS: 'Cập nhật ví thành công',
  DELETE_SUCCESS: 'Xóa ví thành công',

  GET_SUCCESS: 'Lấy thông tin ví thành công',
  LIST_SUCCESS: 'Lấy danh sách ví thành công',

  NOT_FOUND: 'Không tìm thấy ví',

  INVALID_WALLET_ID: 'Wallet ID không hợp lệ',

  // Validation
  NAME_REQUIRED: 'Tên ví là bắt buộc',
  NAME_MUST_BE_STRING: 'Tên ví phải là chuỗi ký tự',

  START_BALANCE_REQUIRED: 'Số dư ban đầu là bắt buộc',
  START_BALANCE_INVALID: 'Số dư ban đầu phải là số không âm',

  START_BALANCE_DATE_REQUIRED: 'Ngày bắt đầu số dư là bắt buộc',
  START_BALANCE_DATE_INVALID: 'Ngày bắt đầu số dư phải có định dạng ISO8601',

  BANK_NAME_INVALID: 'Tên ngân hàng phải là chuỗi ký tự',
  ACCOUNT_NUMBER_INVALID: 'Số tài khoản phải là chuỗi ký tự',

  ALREADY_DELETED: 'Ví này đã được xóa trước đó'
} as const;

// =======================
//  TRANSACTION SYSTEM (Thu/Chi)
// =======================
export const TRANSACTION_MESSAGES = {
  CREATE_SUCCESS: 'Tạo giao dịch thành công',
  UPDATE_SUCCESS: 'Cập nhật giao dịch thành công',
  DELETE_SUCCESS: 'Xóa giao dịch thành công',

  GET_SUCCESS: 'Lấy thông tin giao dịch thành công',
  LIST_SUCCESS: 'Lấy danh sách giao dịch thành công',

  NOT_FOUND: 'Không tìm thấy giao dịch',
  INVALID_TRANSACTION_ID: 'Transaction ID không hợp lệ',

  // Validation
  CATEGORY_REQUIRED: 'Danh mục là bắt buộc',
  TYPE_REQUIRED: 'Loại giao dịch là bắt buộc',
  TYPE_INVALID: 'Loại giao dịch phải là "income" hoặc "expense"',
  AMOUNT_INVALID: 'Số tiền phải là số dương',
  DATE_INVALID: 'Ngày giao dịch phải có định dạng ISO8601',
  DESCRIPTION_INVALID: 'Mô tả phải là chuỗi ký tự',

  WALLET_NOT_FOUND: 'Không tìm thấy ví cho giao dịch này',
  EXCEED_BALANCE: 'Số tiền chi vượt quá số dư của ví'
} as const;


// =======================
//   CATEGORY SYSTEM (Danh mục thu/chi)
// =======================
export const CATEGORY_MESSAGES = {
  CREATE_SUCCESS: 'Tạo danh mục thành công',
  UPDATE_SUCCESS: 'Cập nhật danh mục thành công',
  DELETE_SUCCESS: 'Xóa danh mục thành công',

  GET_SUCCESS: 'Lấy thông tin danh mục thành công',
  LIST_SUCCESS: 'Lấy danh sách danh mục thành công',

  NOT_FOUND: 'Không tìm thấy danh mục',
  INVALID_CATEGORY_ID: 'Category ID không hợp lệ',

  // Validation
  NAME_REQUIRED: 'Tên danh mục là bắt buộc',
  NAME_MUST_BE_STRING: 'Tên danh mục phải là chuỗi ký tự',

  TYPE_REQUIRED: 'Loại danh mục là bắt buộc',
  TYPE_INVALID: 'Loại danh mục phải là "income" hoặc "expense"',

  ALREADY_DELETED: 'Danh mục này đã được xóa trước đó'
} as const;
