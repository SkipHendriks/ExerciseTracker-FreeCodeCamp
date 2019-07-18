import path from 'path';


export default (req, res) => {
  const dir = path.resolve();
  res.sendFile(path.resolve(`${dir}/views/index.html`));
};
