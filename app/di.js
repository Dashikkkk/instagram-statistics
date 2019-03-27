const root = require('app-root-path').path;
const di = require('node-dependency-injection');

const container = new di.ContainerBuilder();
(new di.YamlFileLoader(container)).load(root + '/di.yaml');
container.compile();

module.exports = container;