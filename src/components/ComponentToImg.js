import React, { useContext, useState } from "react";
// import { exportComponentAsPNG } from "react-component-export-image";
import "./CoverImage.css";
import { ImgContext } from "../utils/ImgContext";
import unsplash from "../utils/unsplashConfig";
import domtoimage from "dom-to-image";
import { postImage } from "../utils/request";

const ComponentToImg = (props) => {
	const [loading, setLoading] = useState(false);
	const [url, setUrl] = useState('')
	const { unsplashImage } = useContext(ImgContext);
	const componentRef = React.createRef();

	async function saveImage(data) {
		var a = document.createElement("A");
		a.href = data;
		a.download = `cover.png`;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
	}

	const getImageBase64 = async () => {
		const element = componentRef.current;
		const data = await domtoimage.toPng(componentRef.current, {
			height: element.offsetHeight * 2,
			width: element.offsetWidth * 2,
			style: {
				transform: "scale(" + 2 + ")",
				transformOrigin: "top left",
				width: element.offsetWidth + "px",
				height: element.offsetHeight + "px",
			},
		});
		return data;
	};

	const downloadImage = async () => {
		// exportComponentAsPNG(componentRef, 'cover')
		setLoading(true);

		const base64Data = await getImageBase64();

		await saveImage(base64Data);
		setLoading(false);

		if (unsplashImage) {
			unsplash.photos.trackDownload({
				downloadLocation: unsplashImage.downloadLink,
			});
		}
	};

	// 点击复制
	const onClickCopy = (str, copyElementId) => {
		if (copyElementId) { // 如果传入elemetID则拿到对应DOM的文本
			const copyElement = document.getElementById(copyElementId);
			str = copyElement.innerText;
		}
		const clipboardObj = navigator.clipboard;
		if (clipboardObj) { // 不支持Clipboard对象直接报错
			return clipboardObj.writeText(str).then( // 读取内容到剪贴板
				() => alert('链接已复制到粘贴板'),
				() => alert('Failed to copy')
			);
		}
		return alert('Failed to copy');
	};

	// 获取图片链接
	const getImageUrl = async () => {
		// exportComponentAsPNG(componentRef, 'cover')
		setLoading(true);
		const base64Data = await getImageBase64();
		setLoading(false);
		// 删除前缀
		// const base64Code = base64Data.replace(/^data:image\/\w+;base64,/, "");
		// await reqGetImgUrl(base64Code)
		// console.log(base64Data)
		const resData = await postImage(base64Data);
		if (resData.url) {
			setUrl(resData.url)
			onClickCopy(resData.url)
		} else {
			alert(resData.message);
		}
	};

	return (
		<React.Fragment>
			<div ref={componentRef}>{props.children}</div>
			<button
				className="border p-2 bg-gray-700 hover:bg-gray-800 flex items-center text-white text-xl rounded-lg m-4 px-4"
				onClick={() => getImageUrl()}
			>
				<span>
					{loading ? (
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="w-6 h-6 text-white animate animate-spin"
							fill="currentColor"
							width="24"
							height="24"
							viewBox="0 0 24 24"
						>
							<path d="M12 22c5.421 0 10-4.579 10-10h-2c0 4.337-3.663 8-8 8s-8-3.663-8-8c0-4.336 3.663-8 8-8V2C6.579 2 2 6.58 2 12c0 5.421 4.579 10 10 10z"></path>
						</svg>
					) : (
						<svg
							className="w-6 h-6"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
							></path>
						</svg>
					)}
				</span>

				<span className="mx-2">一键生成base64 URL链接</span>
			</button>

			<div className="flex flex-row">
				<div className="font-medium">URL链接：</div>
				<input
					type="text"
					value={url}
					placeholder="Author"
					className="focus:outline-none border text-gray-700 text-xl rounded bg-white p-2 flex-8"
					// onChange={(e) => this.setState({ author: e.target.value })}
				></input>
				<button
					className="border p-2 bg-gray-700 hover:bg-gray-800 flex items-center text-white text-xl rounded-lg px-4"
					onClick={() => onClickCopy()}
				>点击复制链接</button>
			</div>
		</React.Fragment>
	);
};

export default ComponentToImg;
