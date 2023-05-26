/**
 * 网络请求配置
 */
import axios from "axios";

axios.defaults.timeout = 100000;
/**
 * http request 拦截器
 */
// axios.interceptors.request.use(
//   (config) => {
//     config.data = JSON.stringify(config.data);
//     config.headers = {
//       "Content-Type": "x-www-form-urlencoded",
//     };
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );
// get请求
export function getRequest(url, sendData) {
	return new Promise((resolve, reject) => {
		axios
			.get(url, { params: sendData })
			.then((res) => {
				resolve(res.data);
			})
			.catch((error) => {
				reject(error);
			});
	});
}

// post请求
export function postRequest(url, sendData) {
	return new Promise((resolve, reject) => {
		axios
			.post(url, sendData)
			.then((res) => {
				resolve(res.data);
			})
			.catch((error) => {
				reject(error);
			});
	});
}

export async function postImage(base64String) {
	// 将base64解码成二进制数据
	const bytes = atob(base64String.split(",")[1]);
	const mime = base64String.match(/data:(.*);/)[1];
	let buff = new ArrayBuffer(bytes.length);
	let arr = new Uint8Array(buff);
	for (let i = 0; i < bytes.length; i++) {
		arr[i] = bytes.charCodeAt(i);
	}
	// 创建File对象
	const file = new File([arr], "image.jpg", { type: mime });

	// 创建FormData对象
	const formData = new FormData();
	formData.append("file", file);

	// 发送POST请求
	// try {
	//   const response = await axios.post('http://imgget.astorm.cn/upload', formData, {
	//     headers: {
	//       'Content-Type': 'multipart/form-data'
	//     }
	//   });
	//   console.log(response.data);
	// } catch (error) {
	//   console.error(error);
	// }
	return new Promise((resolve, reject) => {
		axios
			.post("http://imgget.astorm.cn/upload", formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			})
			.then((res) => {
				resolve(res.data);
			})
			.catch((error) => {
				reject(error);
			});
	});
}
