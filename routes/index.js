import path from 'path';
// ignore following Glitch error warning. works just fine
const __dirname = path.dirname(new URL(import.meta.url).pathname);

export default (req, res) => {
  // Glitch doesn't like relative paths that go back (eg. '../') so path has to be resolved
  res.sendFile(path.resolve(__dirname + '/../views/index.html')); 
};
