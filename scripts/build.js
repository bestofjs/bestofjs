import fs from 'fs-extra';

process.env.NODE_ENV = 'development';
import buildHtml from './buildHtml';
buildHtml((err, html) => write(html));

function write(html) {
  // path relative from the root folder when the script is launched from the npm command
  const writer = fs.createOutputStream('./www/build.html');
  writer.write(html);
  writer.end();
  console.log('html file created!');
}
