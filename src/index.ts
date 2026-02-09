export default {
	async fetch(request, env, ctx): Promise<Response> {
		// Check if the request is a GET request
		if (request.method !== 'GET') {
			return new Response('Method Not Allowed', { status: 405 });
		}

		// Look for a query parameter named "url"
		const url = new URL(request.url);
		const urlParam = url.searchParams.get('url');
		if (!urlParam) {
			return new Response(`
				<!DOCTYPE html>
				<html>
				<body>
					<h1>解码Base64格式的订阅</h1>
					<p>用法：</p>
					<p>https://decode-base64-sub.boris1993.com/?url=机场订阅URL</p>
				</body>
				</html>
			`, {
				headers: {
					'Content-Type': 'text/html; charset=utf-8',
				},
			});
		}

		// Get the content from the provided URL
		try {
			const response = await fetch(urlParam, {
				method: 'GET',
				headers: {
					'pragma': 'no-cache',
					// Must use a common User-Agent to avoid being blocked
					'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36',
				},
			});
			if (!response.ok) {
				console.log(response);
				return new Response('获取订阅内容失败', { status: 400 });
			}

			// Decode the Base64 content
			const base64Content = await response.text();
			const decodedContent = atob(base64Content);

			// Return the decoded content as a response
			return new Response(decodedContent, {
				headers: {
					'Content-Type': 'text/plain; charset=utf-8',
				},
			});
		} catch (error) {
			return new Response(`获取或解码订阅内容失败，错误信息：${error}`, { status: 500 });
		}
	},
} satisfies ExportedHandler<Env>;
