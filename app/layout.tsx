import type { Metadata } from "next";
import "./globals.css";
export const metadata:Metadata={metadataBase:new URL("http://localhost:3000"),title:"BIO MISSION｜生物特務挑戰",description:"國一生物個人闖關賽：進入研究中心，完成 8 項生物任務。"};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="zh-Hant"><body>{children}</body></html>}
