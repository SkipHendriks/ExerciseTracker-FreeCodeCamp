import path from 'path';
const __dirname = path.dirname(new URL(import.meta.url).pathname);

export const index = (req, res) => {
  // Glitch doesn't like relative paths that go back (eg. '../') so path has to be resolved
  res.sendFile(path.resolve(__dirname + '/../views/index.html')); 
};