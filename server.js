const express = require('express');
const path = require('path');
const os = require('os');

const app = express();
const PORT = 3013; // Reserved via Port Keeper
const DESIGNS_DIR = path.join(__dirname, 'designs');

app.use('/designs', express.static(DESIGNS_DIR));

function getLocalIP() {
	const interfaces = os.networkInterfaces();
	for (const name of Object.keys(interfaces)) {
		for (const iface of interfaces[name]) {
			if (iface.family === 'IPv4' && !iface.internal) {
				return iface.address;
			}
		}
	}
	return 'localhost';
}

app.get('/', (req, res) => {
	res.redirect('/designs/');
});

app.get('/designs/', (req, res) => {
	res.sendFile(path.join(DESIGNS_DIR, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
	console.log(`Mockup server: http://localhost:${PORT} | http://${getLocalIP()}:${PORT}`);
});
