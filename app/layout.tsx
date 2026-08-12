import type { Metadata } from "next";
import "./globals.css";
import "./learning.css";
import "./gallery.css";
import "./annotations.css";
import "./auth.css";
export const metadata:Metadata={metadataBase:new URL("http://localhost:3000"),title:"新趨勢文理補習班｜生物全攻略",description:"七年級生物上下冊課文、互動圖解、單元測驗與會考式模考。",openGraph:{title:"新趨勢文理補習班・生物全攻略",description:"國中生物總複習｜41 單元・1,025 題",images:["/og.png"]}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="zh-Hant"><body>{children}</body></html>}
