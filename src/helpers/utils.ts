import { ApiError, ErrorName } from '.';

export async function failTransaction(results: boolean | undefined) {
  if (results === false) {
    throw <ApiError> {
      name: ErrorName.Unauthorized,
      message: 'Đã xảy ra sự cố với quá trình xử lý và nó đã bị gián đoạn. Vui lòng thử thao tác lại.'
    };
  }
}

export async function failSession(results: boolean) {
  if (results) {
    throw <ApiError> {
        name: ErrorName.Unauthorized,
        message: 'Thời gian đăng nhập đã hết hạn. Xin vui lòng đăng nhập lại.'
    };
  }
}

export async function failCSRFToken(results: boolean | undefined) {
  if (results === false) {
    throw <ApiError> {
      name: ErrorName.Unauthorized,
      message: 'Thời gian đăng nhập đã hết hạn. Xin vui lòng đăng nhập lại.'
    };
  }
}

export async function invalidRequest(results: boolean) {
  if (results) {
    throw <ApiError> {
        name: ErrorName.Unauthorized,
        message: 'Yêu cầu không hợp lệ.'
    };
  }
}
