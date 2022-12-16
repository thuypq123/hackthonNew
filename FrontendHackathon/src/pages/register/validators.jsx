
const emailRegex = new RegExp(/^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6})*$/);
const phoneRegex = new RegExp(/^((09|03|07|08|05)+([0-9]{7,8}))*$/);
const regexCCCD = new RegExp(/^[0-9]{7,12}$/);
const regexPassword = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@!%*#?&]{8,}$/);
const regexFullName = new RegExp(/^[A-Za-z ]{6,50}$/);
const userNameRegex = new RegExp(/^[A-Za-z\d]{6,50}$/);
export const emailValidator = (value) =>
  !value
    ? 'Email không được bỏ trống'
    : emailRegex.test(value)
      ? value.length < 99 ? "" : "Email không được nhập quá 99 ký tự."
      : 'Email không đúng định dạng.';

export const CCCDValidator = (value) =>
  !value
    ? 'Số CCCD hoặc CMNN là bắt buộc'
    : regexCCCD.test(value)
      ? ''
      : 'Số CCCD hoặc CMNN không đúng định dạng.';

export const fullNameValidator = (value) =>
  !value
    ? 'Full Name Không được bỏ trống'
    : regexFullName.test(value)
      ? ''
      : 'Full name không đúng định dạng';

export const userNameValidator = (value) =>
  !value
    ? 'Tên đăng nhập không được bỏ trống.'
    : userNameRegex.test(value)
      ? ''
      : 'Tên đăng nhập không đúng định dạng';
export const phoneValidator = (value) =>
  !value
    ? 'Số điện thoại là bắt buộc*.'
    : phoneRegex.test(value)
      ? ''
      : 'Số điện thoại không đúng định dạng';
let valuePassword = "";
export const passwordValidator = (value) => {
  valuePassword =value;
  return !value
    ? 'Mật khẩu là bắt buộc*.'
    : regexPassword.test(value)
      ? value.indexOf('password') !== -1 ? "Mật khẩu không được chưa chữ password"
        : ""
      : 'Mật khẩu tối thiểu 8 ký tự & phải có chữ thường, chữ hoa và số, cho phép các ký tự đặc biệt, ngoại trừ "^" "$"';
}
export const checkPassword = (value) =>
  value === valuePassword ? ""
    : "Password không khớp."


