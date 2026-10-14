import app from "./src/utils/app.js";
const port = process.env.PORT || 4000;

const server = app.listen(port, () => {
	console.log(`Server listening at http://localhost:${port}`);
});

server.on('error', (error) => {
	console.error('Failed to start server:', error);
	process.exitCode = 1;
})

