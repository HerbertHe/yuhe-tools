import { useState } from "react"
import "./App.less"

import watermark from "./assets/watermark.png"

const App = () => {
    const [raw, setRaw] = useState<FileList | null>(null)

    const handleChange = () => {
        const preview = document.getElementById("preview-imgs")
        setRaw(null)
        while (preview?.firstChild) {
            preview.removeChild(preview.firstChild)
        }

        const el = document.getElementById("raw-img-files") as HTMLInputElement
        const files = el.files
        if (!files || files?.length === 0) {
            alert("没有选择任何文件")
            return
        }

        setRaw(files)

        for (let idx in files) {
            const fr = new FileReader()
            fr.readAsDataURL(files[idx])
            fr.onload = () => {
                const url = fr.result
                const img = new Image(100, 100)
                img.src = url as string
                preview?.appendChild(img)
            }
        }
    }

    const composeImgs = () => {
        // 合成图片
        const composed = document.getElementById("composed-imgs")
        while (composed?.firstChild) {
            composed.removeChild(composed.firstChild)
        }

        if (!raw || raw.length === 0) {
            alert("没有待合成的图片")
            return
        }

        for (let idx in raw) {
            const canvas = document.createElement("canvas")
            const ctx = canvas.getContext("2d")

            const fr = new FileReader()
            fr.readAsDataURL(raw[idx])
            fr.onload = () => {
                const url = fr.result as string
                const img = new Image()
                img.src = url
                img.onload = () => {
                    const { width, height } = img
                    canvas.height = height / 2
                    canvas.width = width / 2
                    ctx?.scale(0.5, 0.5)
                    ctx?.drawImage(img, 0, 0, width, height)

                    const wmi = new Image()
                    wmi.src = watermark
                    wmi.onload = () => {
                        const { width: ww, height: wh } = wmi
                        const ratio = wh / ww
                        const w = width / 5
                        const h = ratio * w
                        const x = width - w - 50
                        const y = height - h - 50

                        ctx?.drawImage(wmi, x, y, w, h)
                    }
                }
            }

            composed?.appendChild(canvas)
        }
    }

    return (
        <div className="App">
            <header>于何工具箱 β</header>
            <main>
                <div className="job">
                    <div className="title">统计水印合成</div>
                    <p className="desc">用于新疆统计水印合成</p>
                    <div className="progress">
                        <div className="action">
                            <div className="name">选择待处理图片</div>
                            <div>
                                <label htmlFor="raw-img-files">➡️&nbsp;</label>
                                <input
                                    type="file"
                                    id="raw-img-files"
                                    multiple
                                    accept=".png,.jpeg,.jpg"
                                    onChange={handleChange}
                                />
                                <div
                                    className="imgs-container"
                                    id="preview-imgs"
                                ></div>
                            </div>
                        </div>

                        <div className="action">
                            <div className="name">合成图片</div>
                            <button type="button" onClick={composeImgs}>
                                ☝️点击合成
                            </button>
                            <div
                                className="imgs-container"
                                id="composed-imgs"
                            ></div>
                            {!!raw && raw?.length !== 0 && <p>图像上鼠标右键选择 <b>“图像另存为...”</b> 进行保存</p>}
                        </div>
                    </div>
                </div>
            </main>
            <footer>
                开放源代码 &copy;{" "}
                <a href="https://github.com/HerbertHe/yuhe-tools">yuhe-tools</a>{" "}
                by Herbert He
            </footer>
        </div>
    )
}

export default App
