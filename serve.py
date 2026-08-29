"""本地开发服务器：给所有响应加 no-store 缓存头，避免浏览器缓存旧的图片/样式文件。
用法：python serve.py [端口，默认 8123]
"""
import http.server
import sys
import functools
import os

PORT = int(os.environ.get('PORT') or (sys.argv[1] if len(sys.argv) > 1 else 8123))
ROOT = os.path.dirname(os.path.abspath(__file__))

class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
        self.send_header('Pragma', 'no-cache')
        super().end_headers()

Handler = functools.partial(NoCacheHandler, directory=ROOT)

# 用 ThreadingHTTPServer 而不是普通 TCPServer——普通版本单线程处理请求，
# 一旦有浏览器开着 keep-alive 连接不关，后面所有请求都会被卡住排队，
# 页面看起来就是"一直转圈加载不出来"。
with http.server.ThreadingHTTPServer(("", PORT), Handler) as httpd:
    print(f"Serving at http://localhost:{PORT} (no-cache headers on)")
    httpd.serve_forever()
