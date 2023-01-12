const cookie = {
  read(name: string): string | null {
    // ^|; 开头或分号结尾 : match 1， \\s 结尾接0到多个空格，拼上 name : match 2， [^;] 表示值， * 标识0-多个 : match 3
    // 使用 () 用于捕获值
    const match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'))
    // decodeURIComponent 对 encodeURIComponent 编码的 URI 进行解码
    return match ? decodeURIComponent(match[3]) : null
  }
}

export default cookie
